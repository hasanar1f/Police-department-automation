const CaseStates = [
	{
		label: 'মামলা গৃহীত',
		value: 'on_hold',
		submittable_report: [],
		state_val: 1
	},
	{
		label: 'তদন্ত প্রক্রিয়াধীন',
		value: 'investigating',
		submittable_report: [
			{
				label: 'তদন্ত রিপোর্ট',
				value: 'investigation_report',
				path: '/investigationReport/Create'
			}
		],
		state_val: 2
	},
	{
		label: 'চার্জশীট প্রস্ততকরন',
		value: 'preparing_chargeSheet',
		submittable_report: [
			{
				label: 'চার্জশীট',
				value: 'chargeSheet',
				path: '/chargeSheet/create'
			}
		],
		state_val: 3
	},
	{
		label: 'জেলা কোর্টে দাখিল',
		value: 'on_zila_court',
		submittable_report: [
			{
				label: 'আদালতের তথ্য',
				value: 'court_info',
				path: '/court/create'
			},

			{
				label: 'শুনানি রিপোর্ট',
				value: 'hearing_report',
				path: '/hearing/create'
			},

			{
				label: 'রায়',
				value: 'verdict_report',
				path: '/verdict/create'
			}
		],
		state_val: 4
	},
	{
		label: 'জেলাকোর্টের রায় প্রদান',
		value: 'verdict_zila_court',
		submittable_report: [
			{
				label: 'হাইকোর্টে আপিল আবেদন',
				value: 'high_court_appeal',
				path: '/appeal/create'
			},
			{
				label: 'মামলা নিষ্পত্তি রিপোর্ট',
				value: 'case_resolved',
				path: '/resolve/create'
			}
		],
		state_val: 5
	},
	{
		label: 'হাইকোর্টে আপিলকৃত',
		value: 'appealed_to_high_court',
		submittable_report: [
			{
				label: 'হাইকোর্টে আপিল এর রায়',
				value: 'high_court_appeal_verdict',
				path: '/appealVerdict/create'
			}
		],
		state_val: 6
	},
	{
		label: 'হাইকোর্টে আপিল এর রায় প্রদান',
		value: 'high_court_appeal_verdict',
		submittable_report: [
			{
				label: 'মামলা নিষ্পত্তি রিপোর্ট',
				value: 'case_resolved',
				path: '/resolve/create'
			}
		],
		state_val: 7
	},
	{
		label: 'হাইকোর্টে দাখিল',
		value: 'on_high_court',
		submittable_report: [
			{
				label: 'শুনানি রিপোর্ট',
				value: 'hearing_report',
				path: '/hearing/create'
			},
			{
				label: 'রায়',
				value: 'verdict_report',
				path: '/verdict/create'
			}
		],
		state_val: 8
	},
	{
		label: 'হাইকোর্টের রায় প্রদান',
		value: 'verdict_high_court',
		submittable_report: [
			{
				label: 'সুপ্রিমকোর্টে আপিল আবেদন',
				value: 'supreme_court_appeal',
				path: '/appeal/create'
			},
			{
				label: 'মামলা নিষ্পত্তি রিপোর্ট',
				value: 'case_resolved',
				path: '/resolve/create'
			}
		],
		state_val: 9
	},
	{
		label: 'সুপ্রিমকোর্টে আপিলকৃত',
		value: 'appealed_to_supreme_court',
		submittable_report: [
			{
				label: 'সুপ্রিমকোর্টে আপিল এর রায়',
				value: 'supreme_court_appeal_verdict',
				path: '/appealVerdict/create'
			}
		],
		state_val: 10
	},
	{
		label: 'সুপ্রিমকোর্টে আপিল এর রায় প্রদান',
		value: 'supreme_court_appeal_verdict',
		submittable_report: [
			{
				label: 'মামলা নিষ্পত্তি রিপোর্ট',
				value: 'case_resolved',
				path: '/resolve/create'
			}
		],
		state_val: 11
	},
	{
		label: 'সুপ্রিমকোর্টে দাখিল',
		value: 'on_high_court',
		submittable_report: [
			{
				label: 'শুনানি রিপোর্ট',
				value: 'hearing_report',
				path: '/hearing/create'
			},
			{
				label: 'রায়',
				value: 'verdict_report',
				path: '/verdict/create'
			}
		],
		state_val: 12
	},
	{
		label: 'সুপ্রিমকোর্টের রায় প্রদান',
		value: 'verdict_supreme_court',
		submittable_report: [
			{
				label: 'রাষ্ট্রপতির নিকট ক্ষমার আবেদন',
				value: 'presidential_mercy_appeal',
				path: '/presidentAppeal/create'
			},
			{
				label: 'মামলা নিষ্পত্তি রিপোর্ট',
				value: 'case_resolved',
				path: '/resolve/create'
			}
		],
		state_val: 13
	},
	{
		label: 'রাষ্ট্রপতির নিকট ক্ষমার আবেদনকৃত',
		value: 'presidential_mercy_appealed',
		submittable_report: [
			{
				label: 'রাষ্ট্রপতির নিকট ক্ষমার রায়',
				value: 'presidential_mercy_verdict',
				path: '/presidentVerdict/create'
			}
		],
		state_val: 14
	},
	{
		label: 'রাষ্ট্রপতির নিকট ক্ষমার রায়',
		value: 'presidential_mercy_verdict',
		submittable_report: [
			{
				label: 'মামলা নিষ্পত্তি রিপোর্ট',
				value: 'case_resolved',
				path: '/resolve/create'
			}
		],
		state_val: 15
	},
	{
		label: 'মামলা নিষ্পত্তি',
		value: 'case_resolved',
		submittable_report: [],
		state_val: 16
	}
];

export default CaseStates;
