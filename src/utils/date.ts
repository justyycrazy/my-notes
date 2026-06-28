export function getDateParts(date: Date | string): { year: string; month: string; day: string } {
	const dateObj = typeof date === 'string' ? new Date(date) : date;
	return {
		year: String(dateObj.getFullYear()),
		month: String(dateObj.getMonth() + 1).padStart(2, '0'),
		day: String(dateObj.getDate()).padStart(2, '0'),
	};
}

export function getYMD(date: Date | string): string {
	const { year, month, day } = getDateParts(date);
	return `${year}-${month}-${day}`;
}
