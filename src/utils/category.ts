import { getCollection, getEntry, type CollectionEntry, type ReferenceDataEntry } from 'astro:content';

export type Category = CollectionEntry<'categories'>;

/**
 * 从分类字段中提取 id，兼容 string 与 ReferenceDataEntry 两种形态。
 */
export function getCategoryId(category: string | ReferenceDataEntry<'categories'>): string {
  return typeof category === 'string' ? category : category.id;
}

interface CategoryIndex {
  all: Category[];
  byId: Map<string, Category>;
  childrenByParent: Map<string, Category[]>;
}

let _cachedIndex: Promise<CategoryIndex> | null = null;

async function buildIndex(): Promise<CategoryIndex> {
  const all = await getCollection('categories');
  const byId = new Map<string, Category>();
  const childrenByParent = new Map<string, Category[]>();

  for (const c of all) {
    byId.set(c.id, c);
    const parentId = c.data.parent?.id;
    if (parentId) {
      const arr = childrenByParent.get(parentId) ?? [];
      arr.push(c);
      childrenByParent.set(parentId, arr);
    }
  }

  return { all, byId, childrenByParent };
}

/**
 * 加载分类索引并缓存结果（构建期间同进程安全）。
 * 返回 all（列表）、byId（Map）、childrenByParent（Map）。
 */
export async function loadCategoryIndex(): Promise<CategoryIndex> {
  if (!_cachedIndex) {
    _cachedIndex = buildIndex();
  }
  return _cachedIndex;
}

// 递归获取分类的完整层级路径
export async function getCategoryPath(
    category: Category,
    path: string[] = []
): Promise<string[]> {
    path.unshift(category.data.title);
    
    if (category.data.parent) {
        const parent = await getEntry(category.data.parent);
        if (parent) {
            return getCategoryPath(parent, path);
        }
    }
    
    return path;
}

// 获取所有根分类
export async function getRootCategories() {
    const { all } = await loadCategoryIndex();
    return all.filter(
        c => !c.data.parent
    ).sort(
        (a, b) => a.data.order - b.data.order
    );
}

// 获取直接子分类
export async function getSubCategories(parentId: string) {
    const { childrenByParent } = await loadCategoryIndex();
    return (childrenByParent.get(parentId) ?? []).sort(
        (a, b) => a.data.order - b.data.order
    );
}

// 递归获取分类及其所有后代分类的 id 列表
export async function getDescendantIds(categoryId: string): Promise<string[]> {
  const { childrenByParent } = await loadCategoryIndex();
  const ids: string[] = [categoryId];

  function collectChildren(parentId: string) {
    const children = childrenByParent.get(parentId);
    if (!children) return;
    for (const c of children) {
      ids.push(c.id);
      collectChildren(c.id);
    }
  }

  collectChildren(categoryId);
  return ids;
}
