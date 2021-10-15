const DefendantState =
	[
		{
			label: 'গ্রেপ্তারকৃত',
			value: 'arrested',
			states: [
				{
					label: 'সোর্পদকৃত',
					value: 'under_supervision'
				},
				{
					label: 'জামিনপ্রাপ্ত',
					value: 'bail'
				},
				{
					label: 'মুচলেকা',
					value: 'undertaking'
				}
			]
		},
		{
			label: 'অগ্রেপ্তারকৃত',
			value: 'not_arrested',
			states: []
		},
		{
			label: 'পলাতক',
			value: 'absconding',
			states: []
		}
	];

export default DefendantState;
