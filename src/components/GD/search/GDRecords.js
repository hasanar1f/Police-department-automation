import React, { useEffect, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import GDTable from './GDTable';
import getOfficers from '../../../axios/Authentication/getOfficers';
import { CircularProgress, InputLabel, MenuItem } from '@material-ui/core';
import SideBar from './SideBar';
import Crimes from '../../../utils/CrimeCategoryGD';
import searchGD from '../../../axios/GD/search';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import gdSearchOptions from '../../../utils/gdSearchOption';
import { Redirect } from 'react-router-dom';
import caseSearchOptions from '../../../utils/caseSearchOptions';
import gdSearchOption from '../../../utils/gdSearchOption';

function createData(_id, title, date, time, status) {
	return { _id, title, date, time, status };
}

const useStyles = makeStyles(theme => ({
	root: {},

	grid: {
		paddingLeft: '10vh',
		paddingTop: '10vh'
	},

	sideBar: {
		overflowY: true
	},

	formControl: {
		margin: theme.spacing(1),
		minWidth: 200
	}
}));

const GDRecords = () => {
	// const officer = JSON.parse(localStorage.getItem('officer'));
	// if (!officer) {
	// 	return <Redirect to={'/login'} />;
	// }

	const classes = useStyles();
	const [gds, setGDs] = useState([]);
	const [loading, setLoading] = useState(true);
	const searchKey = useRef('');
	const [filter, setFilter] = useState(undefined);
	const [searchOption, setSearchOption] = useState('');
	const [redirect, setRedirect] = useState(false);

	const applyFilter = filter => {
		setFilter(filter);
	};

	const handleGDSearchOptionChange = event => {
		setSearchOption(event.target.value);
	};

	useEffect(async () => {
		const officer = JSON.parse(localStorage.getItem('officer'));
		if (!officer) {
			setRedirect(true);
		}

		await searchGD(
			{},
			{
				Authorization: 'Officer ' + localStorage.getItem('token'),
				'Content-type': 'application/json'
			},
			function (res, err) {
				setGDs(res);
				setLoading(false);
			}
		);
	}, []);

	if (redirect) {
		return <Redirect to={'/login'} />;
	}

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

	const onSearch = async () => {
		let searchParams = {};

		searchParams[searchOption] = searchKey.current;

		if (filter !== undefined) {
			if (filter.crime_type !== undefined) {
				searchParams['topic'] = filter.crime_type.value;
			}

			if (filter.select_state !== undefined) {
				searchParams['status'] = filter.select_state.value;
			}

			if (filter.officer !== undefined) {
				searchParams['assigned_officers'] = filter.officer._id;
			}

			if (filter.start_date !== undefined) {
				searchParams['startDate'] = filter.start_date;
				searchParams['endDate'] = filter.end_date;
			}
		}

		await searchGD(
			searchParams,
			{
				Authorization: 'Officer ' + localStorage.getItem('token'),
				'Content-type': 'application/json'
			},
			(res, err) => {
				setGDs(res);
			}
		);
	};

	console.log('applying filter...');
	console.log(filter);

	return (
		<div className={classes.root}>
			<Grid
				container
				direction="column"
				justify="center"
				alignItems="center"
				spacing={8}
			>
				<Grid
					item
					container
					direction="row"
					justifyContent="center"
					alignItems="center"
				>
					<Grid item xs={3}>
						<SideBar setFilterState={setFilter} />
					</Grid>

					<Grid item xs={9}>
						<Grid
							container
							spacing={1}
							direction={'column'}
							alignItems="center"
							className={classes.grid}
						>
							<Grid
								container
								spacing={6}
								direction="row"
								alignItems="center"
							>
								<Grid item xs={3}>
									<FormControl
										variant="outlined"
										className={classes.formControl}
									>
										<InputLabel
											style={{ fontsize: '1.4rem' }}
											id="demo-simple-select-outlined-label"
										>
											অপশন বাছাই
										</InputLabel>
										<Select
											labelId="demo-simple-select-outlined-label"
											id="demo-simple-select-outlined"
											value={searchOption}
											onChange={handleGDSearchOptionChange}
											label="অপশন"
										>
											<MenuItem value="">
												<em>None</em>
											</MenuItem>
											{gdSearchOption.map(option => {
												return (
													<MenuItem value={`${option.value}`}>
														{option.name}
													</MenuItem>
												);
											})}
										</Select>
									</FormControl>
								</Grid>

								<Grid item xs={6}>
									<TextField
										id="title"
										style={{ fontsize: '1.4rem' }}
										label="এখানে লিখুন"
										placeholder="এখানে লিখুন"
										variant="outlined"
										fullWidth
										onChange={e => {
											searchKey.current = e.target.value;
										}}
									/>
								</Grid>

								<Button
									variant="contained"
									color="primary"
									size="large"
									className={classes.text_regular}
									onClick={() => onSearch()}
								>
									{' '}
									🔍 খুঁজুন{' '}
								</Button>

								<Grid item xs={12}>
									<GDTable gds={gds} />
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</div>
	);
};

export default GDRecords;
