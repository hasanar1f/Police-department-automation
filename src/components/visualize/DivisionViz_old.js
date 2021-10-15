import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import masterQuery from '../../axios/visualize/masterQuery';
import { Cell, Pie, PieChart } from 'recharts';
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

const DivisionViz = () => {
	const classes = useStyles();
	const [division, setDivision] = useState();
	const [data, setData] = useState({});
	const [loading, setLoading] = useState(true);
	const [divisionLabel, setDivisionLabel] = useState();

	const history = useHistory();
	// const [colors, setColors] = useState([]);
	let colors = [];

	const handleChange = event => {
		setDivision(event.target.value);
	};

	// const location = useLocation();

	// useEffect(() => {
	// 	if (location !== undefined) {
	// 		if (location.state !== undefined) {
	// 			const divisionName = location.state.division_name;
	// 			if (divisionName !== undefined && divisionName !== '') {
	// 				setDivision(divisionName);
	// 				ThanaList.map(div => {
	// 					if (div.name === divisionName) {
	// 						setDivisionLabel(div.label);
	// 					}
	// 				});
	// 			}
	// 		}
	// 	}
	// }, [location]);

	// useEffect(async () => {
	// 	await masterQuery(
	// 		{
	// 			Authorization: 'Officer ' + localStorage.getItem('token')
	// 		},
	// 		(res, err) => {
	// 			if (res) {
	// 				console.log(res);
	// 				setLoading(false);
	// 			} else {
	// 				console.log(err);
	// 			}
	// 		}
	// 	);
	// }, []);

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
					direction="row"
					justifyContent="center"
					alignItems="center"
					spacing={3}
				>
					<Grid item xs={12} sm={1}></Grid>

					<Grid item xs={12} sm={5}>
						<Paper className={classes.paper}>
							<div className={classes.formControl}>
								{/* <Typography variant="h5">
									বিভাগ: {divisionLabel}
								</Typography> */}
							</div>
							{/* <PieChart width={730} height={480}>
								<Pie
									data={data}
									dataKey="count"
									nameKey="_id"
									cx="35%"
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
							</PieChart> */}
						</Paper>
					</Grid>

					<Grid item xs={12} sm={5}>
						<Paper className={classes.paper}>
							<div className={classes.formControl}></div>
							{/* <PieChart width={730} height={480}>
								<Pie
									data={data}
									dataKey="count"
									nameKey="_id"
									cx="35%"
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
							</PieChart> */}
						</Paper>
					</Grid>
				</Grid>
			</Grid>
		</div>
	);
};

export default DivisionViz;
