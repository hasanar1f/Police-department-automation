import React, { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import mapDataBd from './mapDataBd';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import masterQuery from '../../axios/visualize/masterQuery';
import { CircularProgress, Button, InputLabel } from '@material-ui/core';
import Select from 'react-select';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Crimes from '../../utils/CrimeCategoryCase';
import * as QueryString from 'querystring';

// Load Highcharts modules
require('highcharts/modules/map')(Highcharts);

const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1,
		paddingTop: '10%',
		paddingLeft: '7%'
	},
	paper: {
		height: '700px',
		width: '1200px',
		textAlign: 'center',
		color: theme.palette.text.secondary,
		padding: '2rem'
	},
	select: {
		width: '100%',
		fontWeight: 'bolder'
	}
}));

// Render app with demo chart
const BdMap = () => {
	const classes = useStyles();
	const [divisionData, setDivisionData] = useState({});
	const [crimeType, setCrimeType] = useState('total');
	const [crimeLabel, setCrimeLabel] = useState('সকল ধরনের অপরাধ');
	const [loading, setLoading] = useState(true);

	const history = useHistory();

	const crimeList = [
		{ value: 'total', label: 'সকল ধরনের অপরাধ' },
		...Crimes[0].type_of_crimes,
		...Crimes[1].type_of_crimes
	];

	useEffect(async () => {
		await masterQuery(
			{
				Authorization: 'Officer ' + localStorage.getItem('token')
			},
			(res, err) => {
				if (res) {
					// setDivisionData(res.data01)
					// setDistrictData(res.data02)
					const dummyDiv = {
						total: [],
						theft: [],
						kidnapping: [],
						rape: [],
						defamation: [],
						acid_throw: [],
						dowry: [],
						weapon: [],
						mayhem: [],
						human_trafficking: [],
						murder: [],
						proving_suicide: [],
						fraud: [],
						drugs: [],
						porn: [],
						land: [],
						family: [],
						property: [],
						contract: [],
						other: [],
						injunction: [],
						agreement: []
					};
					res.data01.map(div => {
						if (div.division === 'Dhaka') {
							let temp = [];
							temp.push('bd-da');
							temp.push(div.total_crime_count);
							dummyDiv.total.push(temp);
							div.crime_wise.map(cw => {
								let temp2 = [];
								temp2.push('bd-da');
								temp2.push(cw.count);
								dummyDiv[cw._id].push(temp2);
							});
						}

						else if (div.division === 'Rangpur') {
							let temp = [];
							temp.push('bd-rp');
							temp.push(div.total_crime_count);
							dummyDiv.total.push(temp);
							div.crime_wise.map(cw => {
								let temp2 = [];
								temp2.push('bd-rp');
								temp2.push(cw.count);
								dummyDiv[cw._id].push(temp2);
							});
						}

						else if (div.division === 'Chittagong') {
							let temp = [];
							temp.push('bd-cg');
							temp.push(div.total_crime_count);
							dummyDiv.total.push(temp);
							div.crime_wise.map(cw => {
								let temp2 = [];
								temp2.push('bd-cg');
								temp2.push(cw.count);
								dummyDiv[cw._id].push(temp2);
							});
						}

						else if (div.division === 'Rajshahi') {
							let temp = [];
							temp.push('bd-rj');
							temp.push(div.total_crime_count);
							dummyDiv.total.push(temp);
							div.crime_wise.map(cw => {
								let temp2 = [];
								temp2.push('bd-rj');
								temp2.push(cw.count);
								dummyDiv[cw._id].push(temp2);
							});
						}

						else if (div.division === 'Khulna') {
							let temp = [];
							temp.push('bd-kh');
							temp.push(div.total_crime_count);
							dummyDiv.total.push(temp);
							div.crime_wise.map(cw => {
								let temp2 = [];
								temp2.push('bd-kh');
								temp2.push(cw.count);
								dummyDiv[cw._id].push(temp2);
							});
						}

						else if (div.division === 'Barisal') {
							let temp = [];
							temp.push('bd-ba');
							temp.push(div.total_crime_count);
							dummyDiv.total.push(temp);
							div.crime_wise.map(cw => {
								let temp2 = [];
								temp2.push('bd-ba');
								temp2.push(cw.count);
								dummyDiv[cw._id].push(temp2);
							});
						}

						else if (div.division === 'Sylhet') {
							let temp = [];
							temp.push('bd-sy');
							temp.push(div.total_crime_count);
							dummyDiv.total.push(temp);
							div.crime_wise.map(cw => {
								let temp2 = [];
								temp2.push('bd-sy');
								temp2.push(cw.count);
								dummyDiv[cw._id].push(temp2);
							});
						}
					});
					setDivisionData(dummyDiv);
					console.log(dummyDiv);
					setLoading(false);
				}
			}
		);
	}, []);

	const handleClick = e => {
		// console.log(e.point);
		console.log(e.point.name);
		const divisionName = e.point.name;
		history.push({
			pathname: '/visualize/division',
			state: {
				division_name: divisionName
			}
		});
	};

	const handleChange = obj => {
		setCrimeType(obj.value);
		setCrimeLabel(obj.label);
	};
	const mapOptions = {
		title: {
			text: ' '
		},

		chart: {
			height: '700px'
		},

		mapNavigation: {
			enabled: true,
			buttonOptions: {
				verticalAlign: 'bottom'
			}
		},

		colorAxis: {
			min: 0,
			stops: [
				[0.25, '#BADA55'],
				[0.5, '#ffff00'],
				[0.75, '#FFA500'],
				[1, '#FF0000']
			]
		},
		series: [
			{
				mapData: mapDataBd,
				data: divisionData[crimeType],
				name: crimeType,
				events: {
					click: handleClick
				},
				states: {
					hover: {
						color: '#696969'
					}
				},
				dataLabels: {
					enabled: true,
					format: '{point.name}'
				}
			}
		]
	};

	if (loading) {
		return (
			<div
				style={{
					position: 'absolute',
					left: '50%',
					top: '50%',
					transform: 'translate(-50%, -50%)'
				}}
			>
				<CircularProgress color="secondary" />
			</div>
		);
	}

	return (
		<div>
			<Grid
				container
				direction="row"
				justify="center"
				alignItems="center"
				spacing={0}
			>
				<Grid
					item
					container
					direction="column"
					justify="center"
					alignItems="center"
					xs={10}
					sm={8}
					spacing={8}
				>
					<Grid item xs={10} sm={1}></Grid>
					<Grid item xs={10} sm={1}></Grid>
					<Grid item xs={10} sm={8}>
						<HighchartsReact
							options={mapOptions}
							constructorType={'mapChart'}
							highcharts={Highcharts}
						/>
					</Grid>
				</Grid>
				<Grid item xs={10} sm={3}>
					<Typography variant="h5">অপরাধের ধরন: {crimeLabel}</Typography>
					<br />
					<br />
					<Select
						className={classes.select}
						placeholder="Select Crime Type"
						options={crimeList}
						fullwidth
						getOptionLabel={x => x.label}
						getOptionValue={x => x.value}
						onChange={handleChange}
					/>
				</Grid>
			</Grid>
		</div>
	);
};

export default BdMap;
