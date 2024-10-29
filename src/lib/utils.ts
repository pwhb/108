export const formatDate = (date: Date) => date.toISOString().slice(0, 10);

export const getLast7Days = (dateStr: string) => {
	const dates: string[] = [];
	const currentDate = new Date(dateStr);

	for (let i = 0; i < 7; i++) {
		const date = new Date(currentDate);
		date.setDate(currentDate.getDate() - i);
		dates.push(formatDate(date));
	}

	return dates;
};

export const getBeadMap = (rosary: any[]) => {
	const beadMap: any = {};
	rosary.forEach((bead) => {
		beadMap[bead.date] = bead;
	});
	return beadMap;
};
