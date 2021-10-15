const conversionTable = {
	0: '০',
	1: '১',
	2: '২',
	3: '৩',
	4: '৪',
	5: '৫',
	6: '৬',
	7: '৭',
	8: '৮',
	9: '৯'
};

const test = '27/04/1998';

function dateConvert(EngDate) {
	let BnDate = '';
	for (const e of EngDate) {
		if (conversionTable[e]) {
			BnDate += conversionTable[e];
		} else {
			BnDate += e;
		}
	}
	console.log(BnDate);
}

export default dateConvert;
