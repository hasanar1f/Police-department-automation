const dateToReadable = (date) => {
	if (date === undefined) {
		return '-';
	}
	date = new Date(date);
	return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
};

export default dateToReadable;
