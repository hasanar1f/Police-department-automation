import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import masterQuery from '../../axios/visualize/masterQuery';
import { Cell, Pie, PieChart, Sector } from 'recharts';
import gdCountPerDivision from '../../axios/visualize/gdCountPerDivision';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import {
	CircularProgress,
	InputLabel,
	MenuItem,
	Paper,
	Select,
	Typography
} from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import ThanaList from '../../utils/ThanaList';
import pickXRandomColors from '../../utils/pieChartsColor';
import Crimes from '../../utils/CrimeCategoryCase';
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer
} from 'recharts';

const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1,
		paddingTop: '10%',
		paddingLeft: '7%'
	},
	paper: {
		// height: '700px',
		// width: '1200px',
		textAlign: 'center',
		color: theme.palette.text.secondary,
		padding: '2rem'
	},
	formControl: {
		// paddingLeft: '20%'
	}
}));

const ThanaViz = () => {
	const classes = useStyles();
	const [thana, setThana] = useState();
	const [thanaLabel, setThanaLabel] = useState();
	const [loading, setLoading] = useState(true);
	const [crimeWiseData, setCrimeWiseData] = useState([]);

	const crimeList = [...Crimes[0].type_of_crimes, ...Crimes[1].type_of_crimes];
	console.log(crimeList);

	const location = useLocation();

	useEffect(() => {
		if (location !== undefined) {
			if (location.state !== undefined) {
				const thanaName = location.state.thana_name;
				if (thanaName !== undefined && thanaName !== '') {
					setThana(thanaName);
					ThanaList.map(div => {
						div.districts.map(dist => {
							dist.thanas.map(th => {
								if (th.name === thanaName) {
									setThanaLabel(th.label);
								}
							});
						});
					});
				}
			}
		}
	}, [location]);

	useEffect(async () => {
		await masterQuery(
			{
				Authorization: 'Officer ' + localStorage.getItem('token')
			},
			(res, err) => {
				if (res) {
					console.log(res);
					const thanaName = location.state.thana_name;
					const dummyData = [];
					res.data03.map(th => {
						if (th.thana === thanaName) {
							// console.log('here');
							let land = 0;
							let female_crime = 0;
							let other = 0;
							th.crime_wise.map(crime => {
								if (
									crime._id === 'land' ||
									crime._id === 'contract' ||
									crime._id === 'property' ||
									crime._id === 'injunction' ||
									crime._id === 'agreement'
								) {
									land += crime.count;
								} else if (
									crime._id === 'rape' ||
									crime._id === 'acid_throw' ||
									crime._id === 'dowry' ||
									crime._id === 'mayhem'
								) {
									female_crime += crime.count;
								} else if (
									crime._id === 'defamation' ||
									crime._id === 'human_trafficking' ||
									crime._id === 'proving_suicide' ||
									crime._id === 'other' ||
									crime._id === 'porn' ||
									crime._id === 'fraud' ||
									crime._id === 'weapon'
								) {
									other += crime.count;
								} else {
									let temp = {};
									// const cr_label = crimeList.map(cr => {
									// 	if (cr.value === crime._id) {
									// 		return cr.label;
									// 	}
									// });
									// temp['name'] = cr_label;
									temp['name'] = crime._id;
									temp['Count'] = crime.count;
									dummyData.push(temp);
								}
							});
							let land_dict = {
								name: 'Land',
								Count: land
							};
							let f_dict = {
								name: 'Female',
								Count: female_crime
							};

							let o_dict = {
								name: 'Other',
								Count: other
							};
							if (other > 0) dummyData.push(o_dict);
							if (land > 0) dummyData.push(land_dict);
							if (female_crime > 0) dummyData.push(f_dict);
						}
					});
					setCrimeWiseData(dummyData);
					setLoading(false);
				} else {
					console.log(err);
				}
			}
		);
	}, []);

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
		<div className={classes.root}>
			<Grid>
				<Grid
					container
					spacing={3}
					direction="row"
					justifyContent="center"
					alignItems="center"
					spacing={3}
				>
					<Grid item xs={12} sm={3}></Grid>

					<Grid item xs={12} sm={5}>
						<Paper className={classes.paper}>
							<Typography variant="h5">
								{thanaLabel} থানার অপরাধচিত্র
							</Typography>
							<br />
							<BarChart width={500} height={450} data={crimeWiseData}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="name" padding={{ left: 10 }} />
								<YAxis />
								<Tooltip />
								<Legend />
								<Bar dataKey="Count" fill="#8884d8" />
							</BarChart>
						</Paper>
					</Grid>
				</Grid>
			</Grid>
		</div>
	);
};

export default ThanaViz;
