import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import FormControl from '@material-ui/core/FormControl';
import { Checkbox, FormControlLabel, FormGroup, FormLabel } from '@material-ui/core';
import { KeyboardDateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import Button from '@material-ui/core/Button';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex'
	},
	appBar: {
		zIndex: theme.zIndex.drawer + 1

	},
	drawer: {
		width: drawerWidth,
		flexShrink: 0
	},
	drawerPaper: {
		width: drawerWidth
	},
	drawerContainer: {
		overflow: 'auto'

	},
	content: {
		flexGrow: 1,
		padding: theme.spacing(3)
	},
	formControl: {
		paddingLeft: theme.spacing(2)
	},
	falseNesting: {
		paddingLeft: theme.spacing(3.5)
	},
	date: {
		width: '100%'
	}
}));

const SideBar = (props) => {
	const classes = useStyles();

	let statusFilters = props.statusFilters;
	let filterState = props.filterState;

	const handleStartDateChange = (date) => {
		props.setStartDate(date);
	};

	const handleEndDateChange = (date) => {
		props.setEndDate(date);
	};

	useEffect(() => {
		const a = Object.keys(statusFilters)
			.filter(function(k) {
				return statusFilters[k];
			})
			.map(String);
		// setStatusArray(a)
	}, [statusFilters]);

	const onApplyFilter = () => {
		console.log('filterrrr');
	};


	return (
		<div className={classes.root}>

			<Drawer
				className={classes.drawer}
				variant='permanent'
				classes={{
					paper: classes.drawerPaper
				}}
			>
				<br />
				<Toolbar />
				<div className={classes.drawerContainer}>
					<FormControl component='fieldset' size='medium' className={classes.formControl}>

						<FormLabel component='legend'>Filter by:</FormLabel>

						<FormGroup>
							<FormControlLabel
								control={<Checkbox checked={filterState.status.active} onChange={props.handleChange}
														 name='status' />}
								label='অবস্থা'
							/>
							<FormControl component='fieldset' disabled={filterState.status.disabled}
											 className={classes.falseNesting}>
								<FormGroup>
									<FormControlLabel
										control={<Checkbox checked={statusFilters.ongoing} onChange={props.handleStatusChange}
																 name='ongoing' />}
										label='চলমান'
									/>
									<FormControlLabel
										control={<Checkbox checked={statusFilters.finished}
																 onChange={props.handleStatusChange} name='finished' />}
										label='সম্পন্ন'
									/>
									<FormControlLabel
										control={<Checkbox checked={statusFilters.uninitialized}
																 onChange={props.handleStatusChange} name='uninitialized' />}
										label='শুরু হয়নি'
									/>
								</FormGroup>
							</FormControl>
							<FormControlLabel
								control={<Checkbox checked={filterState.date_and_time.active} onChange={props.handleChange}
														 name='date_and_time' />}
								label='Due Date and Time'
							/>
							<MuiPickersUtilsProvider utils={DateFnsUtils}>
								<div className={`${classes.falseNesting} ${classes.date}`}>
									<KeyboardDateTimePicker
										disabled={filterState.date_and_time.disabled}
										variant='inline'
										ampm={false}
										label='From:'
										value={props.startDate}
										onChange={e => {
											handleStartDateChange(e);
										}}
										onError={console.log}
										format='yyyy/MM/dd HH:mm'
									/>

									<KeyboardDateTimePicker
										disabled={filterState.date_and_time.disabled}
										variant='inline'
										ampm={false}
										label='To:'
										value={props.endDate}
										onChange={e => {
											handleEndDateChange(e);
										}}
										onError={console.log}
										format='yyyy/MM/dd HH:mm'
										minDate={props.startDate}
									/>
								</div>

							</MuiPickersUtilsProvider>
						</FormGroup>
						<Button variant='contained' fullWidth color='primary' onClick={onApplyFilter}> ফিল্টার করুন  </Button>
					</FormControl>

				</div>
			</Drawer>
		</div>
	);
};

export default SideBar;
