import React, { useEffect, useState } from 'react';
import { Cell, Pie, PieChart } from 'recharts';
import gdCountPerDivision from '../../axios/visualize/gdCountPerDivision';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
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

const data01 = [
	{
		name: 'Group A',
		value: 400
	},
	{
		name: 'Group B',
		value: 300
	},
	{
		name: 'Group C',
		value: 300
	},
	{
		name: 'Group D',
		value: 200
	},
	{
		name: 'Group E',
		value: 278
	},
	{
		name: 'Group F',
		value: 189
	}
];

const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1,
		paddingTop: '5vh',
		
	},
	paper: {
		height: '700px',
		width: '900px',
		textAlign: 'center',
		color: theme.palette.text.secondary,
		padding: '2rem'
	},
	formControl: {
		paddingLeft: '50%'
	}
}));

const Visualize = () => {
	const classes = useStyles();
	const [division, setDivision] = useState('Dhaka');
	const [data, setData] = useState({});
	const [loading, setLoading] = useState(true);
	const history = useHistory();
	// const [colors, setColors] = useState([]);
	let colors = [];

	const handleChange = event => {
		setDivision(event.target.value);
	};

	useEffect(async () => {
		await gdCountPerDivision(
			{
				division
			},
			{
				Authorization: 'Officer ' + localStorage.getItem('token'),
				'Content-type': 'application/json'
			},
			(res, err) => {
				if (res) {
					setData(res);
					setLoading(false);
				} else {
					history.push({
						pathname: '/error',
						authenticated: true,
						message: err.message,
						status: err.errorCode
					});
				}
			}
		);
	}, []);

	useEffect(async () => {
		await gdCountPerDivision(
			{
				division
			},
			{
				Authorization: 'Officer ' + localStorage.getItem('token'),
				'Content-type': 'application/json'
			},
			(res, err) => {
				if (res) {
					setData(res);
					setLoading(false);
				} else {
					history.push({
						pathname: '/error',
						authenticated: true,
						message: err.message,
						status: err.errorCode
					});
				}
			}
		);
	}, [division]);

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

	colors = pickXRandomColors(data.length);

	const renderLabel = entry => {
		return entry._id;
	};

	

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
					<Grid item xs={12} ></Grid>
					<Grid item xs={12} >
						<Paper className={classes.paper}>
							<div className={classes.formControl}>
									<Typography id="demo-simple-select-outlined-label">
										 বিভাগ বাছাই করুন
									</Typography>
								<FormControl variant="outlined">

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
							<PieChart width={730} height={480}>
								<Pie
									data={data}
									dataKey="count"
									nameKey="_id"
									cx="50%"
									cy="50%"
									outerRadius={200}
									fill="white"
									// fill="#8884d8"
									label={renderLabel}
								>
									{data.map((entry, index) => (
										<Cell
											key={`cell-${index}`}
											fill={colors[index % colors.length]}
										/>
									))}
								</Pie>
							</PieChart>
						</Paper>

						<Grid item xs={12}></Grid>
					</Grid>
				</Grid>
			</Grid>
		</div>
	);
};

export default Visualize;
