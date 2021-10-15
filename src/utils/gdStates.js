const GdStates = [
	{
		label: 'অমীমাংসিত',
		value: 'unresolved',
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
				path: '/InvestigationReport_gd/create'
			}
		],
		state_val: 2
	},
	{
		label: 'মীমাংসিত',
		value: 'resolved',
		submittable_report: [],
		state_val: 3
	},
	{
		label: 'মামলায় পরিনত',
		value: 'escalated',
		submittable_report: [
			// {
			// 	label: 'মামলা রিপোর্ট',
			// 	value: 'case_report',
			// 	path: '/CaseEntry/create'
			// }
		],
		state_val: 4
	}
];

export default GdStates;
