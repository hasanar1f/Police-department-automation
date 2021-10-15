import React, { useRef, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import { KeyboardDateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import Dialog from '@material-ui/core/Dialog';
import AssignOfficer from './AssignOfficer';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import { Icon } from '@material-ui/core';
import createTask from '../../../axios/task/create';
import List from '@material-ui/core/List';

const useStyles = makeStyles((theme) => ({
	root: {
		'& .MuiTextField-root': {
			margin: theme.spacing(1),
			width: '25ch'
		}
	},

	input: {},

	button: {},

	imagePreview: {
		width: '50vh',
		height: '35vh'
	},

	minus: {
		justifyContent: 'space-between',
		paddingLeft: '30px'
	}

}));

const TaskAdderForm = () => {


	const classes = useStyles();
	const [open, setOpen] = React.useState(false);
	const [locVariable, setLocVariable] = React.useState('Select an area ');
	const locations = ['Shahbag', 'Khilgaon', 'Basabo', 'Mugdha', 'Kazirpara', 'Arambag', 'Motijheel', 'Shahjahanpur', 'Malibag'];
	const [officers, setOfficers] = useState([]);
	const title = useRef('');
	const description = useRef('');
	const dueDateTime = useRef(new Date());
	const location = useRef('');


	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const removeOfficer = (val) => {
		setOfficers(officers.filter(value => {
			return value !== val;
		}));
	};

	const updateOfficers = (new_officers) => {
		setOfficers([...officers, ...new_officers]);
	};

	const submitTask = () => {
		let officerIDS = [];

		officers.map(officer => {
			officerIDS.push(officer._id);
		});

		createTask({
			title: title.current,
			description: description.current,
			location: location.current,
			date: dueDateTime.current,
			assigned_officers: officerIDS
		}, {
			'content-type': 'application/json'
		}, (res, err) => {
			if (res) {
				console.log(res);
			} else {
				console.log(err);
			}
		});
	};

	return (
		<div>
			<Grid container justify='center' direction='column' spacing={10}>
				<Grid item container className='main'>
					<div className='items'>
						<TextField
							id='title'
							label='Task title'
							variant='outlined'
							color='secondary'
							fullWidth
							onChange={e => {
								title.current = e.target.value;
							}}
						/>
					</div>

					<div className='items'>
						<TextField
							id='description'
							label='Add details'
							variant='outlined'
							color='secondary'
							fullWidth
							multiline
							rows='3'
							onChange={e => {
								description.current = e.target.value;
							}}
						/>
					</div>

					<div className='items'>
						<Autocomplete

							locVariable={locVariable}
							onChange={(event, newValue) => {
								setLocVariable(newValue);
							}}
							location={location}
							onInputChange={(event, newInputValue) => {
								location.current = newInputValue;
							}}

							id='location'
							variant='outlined'
							color='secondary'
							options={locations}
							style={{ width: '100%' }}
							renderInput={(params) => <TextField {...params} label='Location'
																			placeholder='Select area ' />}
						/>
					</div>

					<div className='items'>
						<MuiPickersUtilsProvider utils={DateFnsUtils}>
							<KeyboardDateTimePicker
								variant='inline'
								ampm={true}
								label='Set due date and time'
								fullWidth
								value={dueDateTime.current}
								onChange={e => {
									dueDateTime.current = e;
								}}
								onError={console.log}
								disablePast
								format='yyyy/MM/dd HH:mm'
							/>
						</MuiPickersUtilsProvider>
					</div>

					<List style={{ width: '60%' }}>
						{officers.map((value) => {
							const labelId = `checkbox-list-secondary-label-${value}`;
							return (
								<ListItem key={value._id}>
									<ListItemAvatar>
										<Avatar
											alt={value.name}
											src={`/static/images/avatar/${value.img}.jpg`}
										/>
									</ListItemAvatar>
									<ListItemText id={labelId} primary={`Name: ${value.name}`} />
									<ListItemSecondaryAction className={classes.minus}>
										<Icon
											style={{ fontSize: 20 }}
											color={'primary'}
											onClick={e => removeOfficer(value)}
										>
											cancel_circle
										</Icon>
									</ListItemSecondaryAction>
								</ListItem>

							);
						})}
					</List>

					<div className='items'>
						<React.Fragment>
							<Button fullWidth variant='outlined' color='primary' onClick={handleClickOpen}>
								
								অফিসার নিযুক্ত করুন
							</Button>

							<Dialog
								fullWidth='fullWidth'
								open={open}
								onClose={handleClose}
								aria-labelledby='max-width-dialog-title'
							>

								<AssignOfficer
									setOfficers={updateOfficers}
									officers={officers}
									handleClose={handleClose}
								/>

							</Dialog>

						</React.Fragment>

					</div>

					<div className='items'>
						<Button
							label='Submit'
							fullWidth
							variant='contained'
							color='primary'
							size='large'
							onClick={() => submitTask()}
						>
							কর্ম যুক্ত করুন
						</Button>
					</div>

				</Grid>
			</Grid>
		</div>
	);
};


export default TaskAdderForm;

