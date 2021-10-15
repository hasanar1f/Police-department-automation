import React, { useEffect, useRef, useState } from 'react';
import SideBar from './SideBar';
import TaskTable from './TaskTable';
import Grid from '@material-ui/core/Grid';
import { CircularProgress, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import searchTask from '../../../axios/task/search';

function createData(_id, title, date, time, status) {
	return { _id, title, date, time, status };
}

const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1,
		paddingLeft: '10vh',
		paddingTop: '15vh'
	},
	right: {
		paddingLeft: '21vh'
	},

	table: {
		width: '300px'
	}
}));

const TaskRecords = () => {
	const classes = useStyles();

	const searchTerm = useRef('');
	const [tasks, setTasks] = useState([]);

	const [filterState, setFilterState] = useState({
		status: {
			active: false,
			filter: 'all',
			disabled: true
		},
		date_and_time: {
			active: false,
			filter: new Date(),
			disabled: true
		}
	});

	const [statusArray, setStatusArray] = useState([
		'ongoing',
		'completed',
		'not started yet'
	]);

	const [statusFilters, setStatusFilters] = useState({
		ongoing: true,
		finished: true,
		uninitialized: true
	});

	const [startDate, setStartDate] = useState(
		new Date(new Date().setHours(0, 0, 0, 0))
	);
	const [endDate, setEndDate] = useState(
		new Date(new Date().setHours(24, 0, 0, 0))
	);
	const [loading, setLoading] = useState(true);

	const handleChange = event => {
		setFilterState({
			...filterState,
			[event.target.name]: {
				...filterState[event.target.name],
				active: event.target.checked,
				disabled: !filterState[event.target.name].disabled
			}
		});
	};

	const handleStatusChange = event => {
		setStatusFilters({
			...statusFilters,
			[event.target.name]: event.target.checked
		});
	};

	useEffect(() => {
		searchTask(
			{
				status: ['not started yet', 'ongoing', 'completed'],
				startDate,
				endDate
			},
			{},
			(res, err) => {
				if (res) {
					let taskArray = [];
					res.map(task => {
						taskArray.push(
							createData(
								task._id,
								task.title,
								new Date(task.date).toLocaleDateString(),
								new Date(task.date).toLocaleTimeString(),
								task.status
							)
						);
					});

					setTasks(taskArray);
					setLoading(false);
				} else {
					console.log(err);
				}
			}
		);
	}, []);

	useEffect(() => {
		let filters = [];

		if (statusFilters.ongoing) {
			filters.push('ongoing');
		}

		if (statusFilters.finished) {
			filters.push('completed');
		}

		if (statusFilters.uninitialized) {
			filters.push('not started yet');
		}

		setStatusArray(filters);
	}, [statusFilters]);

	useEffect(() => {
		if (filterState.status.disabled) {
			setStatusArray(['ongoing', 'completed', 'not started yet']);
		}

		if (filterState.date_and_time.disabled) {
			setStartDate(new Date(new Date().setHours(0, 0, 0, 0)));
			setEndDate(new Date(new Date().setHours(24, 0, 0, 0)));
		}
	}, [filterState]);

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

	const handleButtonClick = () => {
		searchTask(
			{
				title: searchTerm.current,
				status: statusArray,
				startDate,
				endDate
			},
			{},
			(res, err) => {
				if (res) {
					let taskArray = [];
					res.map(task => {
						taskArray.push(
							createData(
								task._id,
								task.title,
								new Date(task.date).toLocaleDateString(),
								new Date(task.date).toLocaleTimeString(),
								task.status
							)
						);
					});

					setTasks(taskArray);
				} else {
					console.log(err);
				}
			}
		);
	};

	return (
		<div className={classes.root}>
			<SideBar
				startDate={startDate}
				endDate={endDate}
				filterState={filterState}
				setFilterState={setFilterState}
				statusFilters={statusFilters}
				setStatusFilters={setStatusFilters}
				handleChange={handleChange}
				handleStatusChange={handleStatusChange}
				setStartDate={setStartDate}
				setEndDate={setEndDate}
			/>
			<Grid container spacing={3} direction={'column'} alignItems="center">
				<Grid item xs={11}>
					<div className={classes.right}>
						<Grid
							container
							spacing={3}
							direction="row"
							alignItems="center"
						>
							<Grid item xs={11}>
								<TextField
									id="search_title"
									label="Search with title"
									variant="outlined"
									onChange={e => {
										searchTerm.current = e.target.value;
									}}
									fullWidth
									placeholder="enter your search keywords"
								/>
							</Grid>

							<Grid item xs={1}>
								<Button
									variant="contained"
									size="small"
									color="primary"
									onClick={handleButtonClick}
								>
									খোঁজ
								</Button>
							</Grid>

							<Grid item xs={12}>
								<TaskTable className={classes.table} tasks={tasks} />
							</Grid>
						</Grid>
					</div>
				</Grid>
			</Grid>
		</div>
	);
};

export default TaskRecords;
