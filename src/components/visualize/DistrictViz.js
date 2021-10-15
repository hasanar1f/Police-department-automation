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

const DistrictViz = () => {
	const classes = useStyles();
	const [district, setDistrict] = useState();
	const [districtLabel, setDistrictLabel] = useState();
	const [loading, setLoading] = useState(true);
	const [crimeWiseData, setCrimeWiseData] = useState([]);
	const [thanaWiseData, setThanaWiseData] = useState([]);
	const [activeIndex, setActiveIndex] = useState([]);

	const history = useHistory();

	const crimeList = [...Crimes[0].type_of_crimes, ...Crimes[1].type_of_crimes];
	console.log(crimeList);

	const location = useLocation();

	useEffect(() => {
		if (location !== undefined) {
			if (location.state !== undefined) {
				const districtName = location.state.district_name;
				if (districtName !== undefined && districtName !== '') {
					setDistrict(districtName);
					ThanaList.map(div => {
						div.districts.map(dist => {
							if (dist.name === districtName) {
								setDistrictLabel(dist.label);
							}
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
					const districtName = location.state.district_name;
					const dummyData = [];
					const dummyDataForThana = [];
					res.data02.map(dist => {
						if (dist.district === districtName) {
							// console.log('here');
							let land = 0;
							let female_crime = 0;
							let other = 0;
							dist.crime_wise.map(crime => {
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

					res.data03.map(th => {
						if (th.district === districtName) {
							let temp = {};
							temp['name'] = th.thana;
							temp['value'] = th.total_crime_count;
							dummyDataForThana.push(temp);
						}
					});
					setCrimeWiseData(dummyData);
					setThanaWiseData(dummyDataForThana);
					console.log(dummyDataForThana);
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

	let colors = pickXRandomColors(thanaWiseData.length);

	const renderLabel = entry => {
		return entry.name;
	};

	const onPieEnter = (_, index) => {
		setActiveIndex(index);
	};

	const renderActiveShape = props => {
		const RADIAN = Math.PI / 180;
		const {
			cx,
			cy,
			midAngle,
			innerRadius,
			outerRadius,
			startAngle,
			endAngle,
			fill,
			payload,
			percent,
			value
		} = props;
		const sin = Math.sin(-RADIAN * midAngle);
		const cos = Math.cos(-RADIAN * midAngle);
		const sx = cx + (outerRadius + 10) * cos;
		const sy = cy + (outerRadius + 10) * sin;
		const mx = cx + (outerRadius + 30) * cos;
		const my = cy + (outerRadius + 30) * sin;
		const ex = mx + (cos >= 0 ? 1 : -1) * 22;
		const ey = my;
		const textAnchor = cos >= 0 ? 'start' : 'end';

		return (
			<g>
				<text
					x={cx}
					y={cy}
					dy={8}
					textAnchor="middle"
					fill={fill}
					style={{ fontSize: '1rem' }}
				>
					Thana: {payload.name}
				</text>
				<Sector
					cx={cx}
					cy={cy}
					innerRadius={innerRadius}
					outerRadius={outerRadius}
					startAngle={startAngle}
					endAngle={endAngle}
					fill={fill}
				/>
				<Sector
					cx={cx}
					cy={cy}
					startAngle={startAngle}
					endAngle={endAngle}
					innerRadius={outerRadius + 6}
					outerRadius={outerRadius + 10}
					fill={fill}
				/>
				<path
					d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
					stroke={fill}
					fill="none"
				/>
				<circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
				<text
					x={ex + (cos >= 0 ? 1 : -1) * 12}
					y={ey}
					textAnchor={textAnchor}
					fill="#333"
				>{`Total: ${value}`}</text>
				<text
					x={ex + (cos >= 0 ? 1 : -1) * 12}
					y={ey}
					dy={18}
					textAnchor={textAnchor}
					fill="#999"
				>
					{(percent * 100).toFixed(2)}%
				</text>
			</g>
		);
	};

	const handleClickPie = obj => {
		console.log(obj);
		const thanaName = obj.name;
		history.push({
			pathname: '/visualize/thana',
			state: {
				thana_name: thanaName
			}
		});
	};

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
					<Grid item xs={12} sm={1}></Grid>

					<Grid item xs={12} sm={5}>
						<Paper className={classes.paper}>
							<Typography variant="h5">
								{districtLabel} জেলার অপরাধচিত্র
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

					<Grid item xs={12} sm={5}>
						<Paper className={classes.paper}>
							<Typography variant="h5">
								{districtLabel} জেলার থানা সমূহ
							</Typography>
							<br />
							<PieChart width={730} height={450}>
								<Pie
									activeIndex={activeIndex}
									activeShape={renderActiveShape}
									data={thanaWiseData}
									cx="40%"
									cy="50%"
									innerRadius={120}
									outerRadius={160}
									fill="#8884d8"
									dataKey="value"
									onMouseEnter={onPieEnter}
									onClick={handleClickPie}
								/>
							</PieChart>
						</Paper>
					</Grid>
				</Grid>
			</Grid>
		</div>
	);
};

export default DistrictViz;
