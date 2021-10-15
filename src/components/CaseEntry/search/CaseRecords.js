import React, { useEffect, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import CaseTable from './CaseTable';
import getOfficers from '../../../axios/Authentication/getOfficers';
import searchCase from '../../../axios/Case/search';
import { CircularProgress, InputLabel, MenuItem } from '@material-ui/core';
import SideBar from '../../filterBar/SideBar';
import caseSearchOptions from '../../../utils/caseSearchOptions';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { Paper } from '@material-ui/core';
import { Redirect } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
	root: {
		paddingLeft: '10vh'
	},

	grid: {
		paddingLeft: '10vh',
		paddingTop: '5vh'
	},

	sideBar: {
		overflowY: true
	},

	formControl: {
		margin: theme.spacing(1),
		minWidth: 200
	}
}));

const CaseRecords = () => {
	// const officer = JSON.parse(localStorage.getItem('officer'));
	// if (!officer) {
	// 	return <Redirect to={'/login'} />;
	// }

	const classes = useStyles();
	const [cases, setCases] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchOption, setSearchOption] = useState('');
	const [filter, setFilter] = useState(undefined);
	const [redirect, setRedirect] = useState(false);

	const searchKey = useRef('');

	const handleCaseSearchOptionChange = event => {
		setSearchOption(event.target.value);
	};

	useEffect(() => {
		const officer = JSON.parse(localStorage.getItem('officer'));
		if (!officer) {
			setRedirect(true);
		}

		searchCase(
			{},
			{
				Authorization: 'Officer ' + localStorage.getItem('token'),
				'Content-type': 'application/json'
			},
			function (res, err) {
				setCases(res);
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

	const applyFilter = filter => {
		setFilter(filter);
	};

	const onSearch = () => {
		let searchParams = {};

		searchParams[searchOption] = searchKey.current;

		if (filter !== undefined) {
			if (filter.crime_name !== undefined) {
				searchParams['name'] = filter.crime_name.value;
			}

			if (filter.crime_type !== undefined) {
				searchParams['type'] = filter.crime_type.value;
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

		searchCase(
			searchParams,
			{
				Authorization: 'Officer ' + localStorage.getItem('token'),
				'Content-type': 'application/json'
			},
			(res, err) => {
				setCases(res);
			}
		);
	};

	return (
		<div className={classes.root}>
			<Grid
				container
				direction="column"
				justify="center"
				alignItems="center"
				spacing={3}
			>
				<Grid item xs={2}></Grid>
				<Grid
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
								spacing={3}
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
											onChange={handleCaseSearchOptionChange}
											label="অপশন"
										>
											<MenuItem value="">
												<em>None</em>
											</MenuItem>
											{caseSearchOptions.map(option => {
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
									🔍 খুঁজুন
								</Button>

								<Grid item xs={12}>
									<CaseTable cases={cases} />
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</div>
	);
};

export default CaseRecords;
