import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import {
	CircularProgress,
	InputLabel,
	MenuItem,
	Paper,
	Select
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import FormControl from '@material-ui/core/FormControl';
import ThanaList from '../../utils/ThanaList';
import pickXRandomColors from '../../utils/pieChartsColor';
import {
	BarChart,
	Bar,
	Cell,
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
		height: '700px',
		width: '1200px',
		textAlign: 'center',
		color: theme.palette.text.secondary,
		padding: '5rem'
	},
	formControl: {
		paddingLeft: '25%'
	}
}));

const data = [
	{
		name: 'Page A',
		pv: 2400,
		amt: 2400
	},
	{
		name: 'Page B',
		pv: 1398,
		amt: 2210
	},
	{
		name: 'Page C',
		pv: 9800,
		amt: 2290
	},
	{
		name: 'Page D',
		pv: 3908,
		amt: 2000
	},
	{
		name: 'Page E',
		pv: 4800,
		amt: 2181
	},
	{
		name: 'Page F',
		pv: 3800,
		amt: 2500
	},
	{
		name: 'Page G',
		pv: 4300,
		amt: 2100
	}
];

const MonthWise = () => {
	const classes = useStyles();
	const [division, setDivision] = useState('Dhaka');
	// const [data, setData] = useState({});
	const [loading, setLoading] = useState(true);
	const history = useHistory();
	// const [colors, setColors] = useState([]);
	let colors = [];

	const handleChange = event => {
		setDivision(event.target.value);
	};

	// if (loading) {
	// 	return (
	// 		<div
	// 			style={{
	// 				position: 'absolute',
	// 				left: '50%',
	// 				top: '50%',
	// 				transform: 'translate(-50%, -50%)'
	// 			}}
	// 		>
	// 			<CircularProgress color="secondary" />
	// 		</div>
	// 	);
	// }

	// colors = pickXRandomColors(data.length);

	// const renderLabel = entry => {
	// 	return entry._id;
	// };

	return (
		<div className={classes.root}>
			<Grid>
				<Grid
					container
					spacing={3}
					direction="column"
					justifyContent="center"
					alignItems="center"
				>
					<Grid item xs={12} sm={2}></Grid>
					<Grid item xs={12} sm={8}>
						<Paper className={classes.paper}>
							<div className={classes.formControl}>
								<FormControl variant="outlined">
									<InputLabel id="demo-simple-select-outlined-label">
										Division
									</InputLabel>
									<Select
										labelId="demo-simple-select-outlined-label"
										id="demo-simple-select-outlined"
										value={division}
										onChange={handleChange}
										label="Division"
									>
										{ThanaList.map(thana => {
											return (
												<MenuItem
													value={thana.name}
												>{`${thana.name}`}</MenuItem>
											);
										})}
									</Select>
								</FormControl>
							</div>
							<BarChart
								width={600}
								height={500}
								data={data}
								margin={{
									top: 5,
									right: 30,
									left: 20,
									bottom: 5
								}}
							>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="name" padding={{ left: 10 }} />
								<YAxis />
								<Tooltip />
								<Legend />
								<Bar dataKey="pv" fill="#8884d8" />
								<Bar dataKey="uv" fill="#82ca9d" />
							</BarChart>
						</Paper>

						<Grid item xs={12} sm={2}></Grid>
					</Grid>
				</Grid>
			</Grid>
		</div>
	);
};

export default MonthWise;
