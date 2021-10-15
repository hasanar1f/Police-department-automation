import React, { useEffect, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Controller, useForm } from 'react-hook-form';
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import {
	Checkbox,
	FormControlLabel,
	FormGroup,
	FormLabel
} from '@material-ui/core';
import {
	KeyboardDatePicker,
	MuiPickersUtilsProvider
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import getOfficers from '../../../axios/Authentication/getOfficers';
import Button from '@material-ui/core/Button';
import GdStates from '../../../utils/gdStates';
import Crimes from '../../../utils/CrimeCategoryGD';
import Select from 'react-select';
import Typography from '@material-ui/core/Typography';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1,
		paddingTop: '12vh',
		paddingLeft: '15vh'
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
	falseNesting: {},
	date: {
		width: '100%',
		paddingLeft: theme.spacing(3.5)
	},

	button: {
		fontSize: '1.2rem'
	},

	grid: {},


	textSelect: {
		fontSize: '1rem'
	}
}));

const SideBar = ({ setFilterState }) => {
	const classes = useStyles();

	const [caseState, setCaseState] = useState('');
	const [crimeType, setCrimeType] = useState('');
	const [crimeName, setCrimeName] = useState('');
	const [crimeList, setCrimeList] = useState([]);
	const [officers, setOfficers] = useState([]);
	const [startTime, setStartTime] = useState();
	const [endTime, setEndTime] = useState();

	let category = useRef(null);

	const {
		handleSubmit,
		control,
		reset,
		formState: { errors },
		getValues,
		setValue
	} = useForm();

	useEffect(() => {
		getOfficers(
			{
				exclude: []
			},
			{
				Authorization: 'Officer ' + localStorage.getItem('token'),
				'Content-type': 'application/json'
			},
			(res, err) => {
				if (res) {
					setOfficers(res);
				}
			}
		);
	}, []);

	const onSubmit = async data => {
		setFilterState(data);
	};

	const handleCrimeTypeChange = obj => {
		const crimeType = obj.target.innerText;

		Crimes.map(item => {
			if (item.label === crimeType) {
				const temp_crimes = item.type_of_crimes;
				setCrimeList(temp_crimes);
			}
		});
	};
	const clearAll = () => {
		setCaseState('');
		setCrimeType('');
		setCrimeName('');
		setStartTime();
		setEndTime();
		setFilterState({});
	};

	return (
		<Grid container spacing={3} direction="row" className={classes.root}>
			<Grid item xs={12}>
				<Typography
					variant="h6"
					color="primary"
					className={classes.text_regular}
				>
					⌛️ ফিল্টার
				</Typography>
			</Grid>

			<Grid item xs={12}>
				<Controller
					name="select_state"
					control={control}
					render={({ field: { ref, ...field } }) => (
						<div className={classes.select} id="select_state_select">
							<Select
								{...field}
								inputRef={ref}
								className={classes.textSelect}
								placeholder="জিডির অবস্থা বেছে নিন"
								id="select_state"
								options={GdStates}
								getOptionLabel={x => x.label}
								getOptionValue={x => x.value}
							/>
						</div>
					)}
				/>
			</Grid>

			<Grid item xs={12}>
				<Controller
					name="crime_type"
					control={control}
					render={({ field: { ref, ...field } }) => (
						<div
							onClick={handleCrimeTypeChange}
							className={classes.select}
							id="crimeType_Select"
						>
							<Select
								{...field}
								inputRef={ref}
								className={classes.textSelect}
								placeholder="জিডির ধরণ"
								id="crime_type"
								options={Crimes}
								getOptionLabel={x => x.label}
								getOptionValue={x => x.value}
							/>
						</div>
					)}
				/>
			</Grid>

			<Grid item xs={12}>
				<Controller
					name="officer"
					control={control}
					render={({ field: { ref, ...field } }) => (
						<div className={classes.select} id="crimeName_Select">
							<Select
								{...field}
								inputRef={ref}
								className={classes.textSelect}
								placeholder="অফিসার নির্বাচন করুন"
								id="crime_name"
								options={officers}
								getOptionLabel={x => x.name}
								getOptionValue={x => x._id}
								error={!!errors.crime_name}
							/>
						</div>
					)}
				/>
			</Grid>

			<Grid item xs={12}>
				<Typography
					variant="h6"
					color="primary"
					style={{ fontSize: '1.2rem' }}
				>
					📅 সময়কাল নির্বাচন করুন
				</Typography>
				<div className={classes.date}>
					<MuiPickersUtilsProvider utils={DateFnsUtils}>
						<Controller
							name="start_date"
							control={control}
							render={({ field: { ref, ...rest } }) => (
								<KeyboardDatePicker
									className={classes.textSelect}
									inputRef={ref}
									margin="normal"
									id="start_date"
									label="শুরু"
									format="dd/MM/yyyy"
									KeyboardButtonProps={{
										'aria-label': 'change date'
									}}
									{...rest}
								/>
							)}
						/>
					</MuiPickersUtilsProvider>

					<MuiPickersUtilsProvider utils={DateFnsUtils}>
						<Controller
							name="end_date"
							control={control}
							render={({ field: { ref, ...rest } }) => (
								<KeyboardDatePicker
									className={classes.textSelect}
									inputRef={ref}
									margin="normal"
									id="end_date"
									label="শেষ"
									format="dd/MM/yyyy"
									KeyboardButtonProps={{
										'aria-label': 'change date'
									}}
									{...rest}
								/>
							)}
						/>
					</MuiPickersUtilsProvider>
				</div>
			</Grid>

			<Grid item xs={12}>
				<Button
					className={classes.button}
					variant="contained"
					fullWidth
					color="primary"
					onClick={handleSubmit(onSubmit)}
				>
					➕ ফিল্টার যোগ করুন
				</Button>
			</Grid>

			<Grid item xs={12}>
				<Button
					className={classes.button}
					variant="contained"
					fullWidth
					color="primary"
					onClick={clearAll}
				>
					⛔️ ফিল্টার বাদ দিন
				</Button>
			</Grid>
		</Grid>
	);
};

export default SideBar;
