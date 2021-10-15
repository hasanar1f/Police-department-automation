const Crimes = [
	{
		label: 'ফৌজদারী',
		value: 'criminal_case',
		type_of_crimes: [
			{
				label: 'চুরি/ডাকাতি/ছিনতাই',
				value: 'theft'
			},
			{
				label: 'অপহরণ',
				value: 'kidnapping'
			},
			{
				label: 'ধর্ষণ',
				value: 'rape'
			},
			{
				label: 'মানহানি',
				value: 'defamation'
			},
			{
				label: 'এসিড নিক্ষেপ',
				value: 'acid_throw'
			},
			{
				label: 'যৌতুক দাবি / যৌতুক এর জন্য নির্যাতন',
				value: 'dowry'
			},
			{
				label: 'অবৈধ অস্ত্র সংক্রান্ত',
				value: 'weapon'
			},
			{
				label: 'শারীরিক আঘাত/মারপিট',
				value: 'mayhem'
			},
			{
				label: 'মানব পাচার',
				value: 'human_trafficking'
			},
			{
				label: 'হত্যা',
				value: 'murder'
			},
			{
				label: 'আত্মহত্যার প্ররোচনা',
				value: 'proving_suicide'
			},
			{
				label: 'প্রতারনা / জালিয়াতি',
				value: 'fraud'
			},
			{
				label: 'মাদক সংক্রান্ত',
				value: 'drugs'
			},
			{
				label: 'পর্নোগ্রাফি সংক্রান্ত',
				value: 'porn'
			},
			{
				label: 'অন্যান্য',
				value: 'other'
			}
		]
	},
	{
		label: 'দেওয়ানী',
		value: 'civil_case',
		type_of_crimes: [
			{
				label: 'জমিজমা সংক্রান্ত',
				value: 'land'
			},
			{
				label: 'পারিবারিক মামলা',
				value: 'family'
			},
			{
				label: 'চুক্তি সংক্রান্ত',
				value: 'contract'
			},
			{
				label: 'সম্পত্তি সংক্রান্ত',
				value: 'property'
			},
			{
				label: 'স্থায়ী/অস্থায়ী নিষেধাজ্ঞা',
				value: 'injunction'
			},
			{
				label: 'দলিল সংক্রান্ত',
				value: 'agreement'
			}
		]
	}
];

export default Crimes;
