/**
 * 将单个数字转换为中文大写数字。
 * 0-9 分别对应 零-玖，超过 9 则返回大写字符 X。
 */
export function toChineseDigit(num: number): string {
	const map: Record<number, string> = {
		0: '零',
		1: '壹',
		2: '贰',
		3: '叁',
		4: '肆',
		5: '伍',
		6: '陆',
		7: '柒',
		8: '捌',
		9: '玖',
	};

	if (num in map) {
		return map[num];
	}

	return 'X';
}
