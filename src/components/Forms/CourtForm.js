import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { Controller, useForm } from 'react-hook-form';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DateFnsUtils from '@date-io/date-fns';
import {
	KeyboardDatePicker,
	MuiPickersUtilsProvider
} from '@material-ui/pickers';
import { Alert, AlertTitle } from '@material-ui/lab';
import { Snackbar } from '@material-ui/core';
import ImagePreviewForForms from '../basic/ImagePreviewforForms';
import ConvictVerdict from '../formUtil/ConvictVerdict';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import upload from '../../axios/upload/upload';
import createVerdict from '../../axios/verdict/create';
import updateCaseTimeline from '../../axios/Case/updateTimeline';
import createCourt from '../../axios/Court/create';

const useStyles = makeStyles(theme => ({
	root: {
		'& .MuiTextField-root': {
			margin: theme.spacing(1),
			width: '25ch'
		},
		minWidth: '90%'
	},

	input: {},

	button: {},

	container: {
		backgroundColor: '#cfe8fc', //TODO: need to change later
		height: 'auto',
		minHeight: '60vh',
		backdropFilter: 'blur(.4em)',
		zIndex: 1,
		opacity: 0.8
	},

	accordion: {
		width: '100%',
		padding: '5%',
		zIndex: 10
	},

	heading: {
		fontSize: theme.typography.pxToRem(25),
		fontWeight: theme.typography.fontWeightRegular
	},

	errorMSG: {
		fontSize: theme.typography.pxToRem(18),
		fontWeight: theme.typography.fontWeightRegular,
		color: 'red',
		paddingTop: '0.5rem',
		paddingLeft: '0.3rem'
	},

	paper: {},

	box: {
		border: '1px solid black',
		margin: '10px'
		//borderColor: "black",
	},

	wrap: {
		padding: '2rem'
		//borderColor: "black",
	},

	select: {
		width: '100%',
		fontWeight: 'bolder'
	},

	hidden: {
		display: 'none'
	}
}));

const CourtForm = () => {
	const classes = useStyles();
	const history = useHistory();
	// console.log(divisionList);

	const [selectedDate, setSelectedDate] = useState(
		new Date('2014-08-18T21:11:54')
	);

	const [alertOpen, setAlertOpen] = useState(false);
	const [alertState, setAlertState] = useState({
		initial: true,
		alertType: 'success',
		alertTitle: 'Success',
		message: ''
	});

	useEffect(() => {
		if (!alertState.initial) {
			setAlertOpen(true);
		}
	}, [alertState]);

	// console.log(division);

	const {
		handleSubmit,
		control,
		reset,
		formState: { errors },
		getValues,
		setValue
	} = useForm();

	const location = useLocation();

	useEffect(() => {
		if (location !== undefined) {
			if (location.state !== undefined) {
				const caseNo = location.state.case_no;
				if (caseNo !== undefined && caseNo !== '') {
					setValue('case_no', caseNo);
				}
			}
		}
	}, [location]);

	const handleDateChange = date => {
		setSelectedDate(date);
	};

	const handleAlertClose = () => {
		setAlertOpen(false);
	};

	const onSubmit = async data => {
		console.log(data);

		await createCourt(
			{
				case: data['case_no'],
				name_of_court: data['court_name'],
				judge: data['judge_name'],
				state_lawyer: data['prosecutor_name'],
				defending_lawyer: data['defence_name'],
				date: data['court_date']
			},
			{
				Authorization: 'Officer ' + localStorage.getItem('token'),
				'Content-type': 'application/json'
			},
			async (res, err) => {
				if (res) {
					await updateCaseTimeline(
						{
							_id: data['case_no']
						},
						{
							toPush: {
								documentType: 'Court',
								id: res.id,
								recordedBy: JSON.parse(localStorage.getItem('officer'))
									._id
							}
						},
						{
							Authorization: 'Officer ' + localStorage.getItem('token'),
							'Content-type': 'application/json'
						}
					);
					setAlertState({
						initial: false,
						alertType: 'success',
						alertTitle: 'Success',
						message: res.message
					});
					history.goBack();
				} else {
					setAlertState({
						initial: false,
						alertType: 'error',
						alertTitle: 'Error',
						message: err.message
					});
				}
			}
		);

		const reset_dict = {};
		reset_dict['case_no'] = '';
		reset_dict['court_date'] = new Date();
		reset_dict['court_name'] = '';
		reset_dict['judge_name'] = '';
		reset_dict['prosecutor_name'] = '';
		reset_dict['defence_name'] = '';

		reset(reset_dict);
	};

	return (
		<React.Fragment>
			<Snackbar
				bodyStyle={{
					height: 200,
					width: 200
				}}
				open={alertOpen}
				autoHideDuration={2000}
				onClose={handleAlertClose}
			>
				<Alert severity={alertState.alertType}>
					<AlertTitle>{alertState.alertTitle}</AlertTitle>
					{alertState.message}
				</Alert>
			</Snackbar>

			<Paper variant="outline" elevation={5} className={classes.paper}>
				<CssBaseline />
				<Container maxWidth="lg" className={classes.container}>
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className={classes.accordion}>
							<Accordion>
								<AccordionSummary
									expandIcon={<ExpandMoreIcon />}
									aria-controls="panel4a-content"
									id="panel4a-header"
								>
									<Typography className={classes.heading}>
										আদালতের তথ্য
									</Typography>
								</AccordionSummary>
								<div className={classes.wrap}>
									<div className={classes.box}>
										<AccordionDetails>
											<Typography
												className={classes.heading}
												style={{
													paddingTop: '1rem',
													paddingRight: '5rem',
													fontSize: '1.2rem'
												}}
											>
												মামলা নম্বর*
											</Typography>
											<Controller
												name="case_no"
												control={control}
												defaultValue={''}
												rules={{
													required: {
														value: true,
														message: 'Required'
													}
												}}
												render={({ field: { ref, ...field } }) => (
													<TextField
														{...field}
														inputRef={ref}
														id="case_no"
														placeholder="মামলা নম্বর*"
														variant="outlined"
														color="secondary"
														error={!!errors.case_no}
													/>
												)}
											/>
											<Typography className={classes.errorMSG}>
												{errors.case_no && (
													<span>{errors.case_no.message}</span>
												)}
											</Typography>
										</AccordionDetails>

										<AccordionDetails>
											<Typography
												className={classes.heading}
												style={{
													paddingTop: '2rem',
													paddingRight: '3rem',
													fontSize: '1.2rem'
												}}
											>
												আদালতে দাখিলের তারিখ*
											</Typography>
											<MuiPickersUtilsProvider utils={DateFnsUtils}>
												<Controller
													name="court_date"
													control={control}
													rules={{
														required: {
															value: true,
															message: 'Required'
														}
													}}
													render={({
														field: { ref, ...rest }
													}) => (
														<KeyboardDatePicker
															inputRef={ref}
															margin="normal"
															id="court_date"
															label="আদালতে দাখিলের তারিখ"
															format="dd/MM/yyyy"
															KeyboardButtonProps={{
																'aria-label': 'change date'
															}}
															error={!!errors.court_date}
															{...rest}
														/>
													)}
												/>
											</MuiPickersUtilsProvider>
											<Typography className={classes.errorMSG}>
												{errors.court_date && (
													<span>{errors.court_date.message}</span>
												)}
											</Typography>
										</AccordionDetails>

										<AccordionDetails>
											<Controller
												name="court_name"
												control={control}
												defaultValue={''}
												rules={{
													required: {
														value: true,
														message: 'Required'
													}
												}}
												render={({ field: { ref, ...field } }) => (
													<TextField
														{...field}
														inputRef={ref}
														id="court_name"
														placeholder="আদালতের নাম*"
														variant="outlined"
														color="secondary"
														fullWidth
														error={!!errors.court_name}
													/>
												)}
											/>
											<Typography className={classes.errorMSG}>
												{errors.court_name && (
													<span>{errors.court_name.message}</span>
												)}
											</Typography>
										</AccordionDetails>

										<AccordionDetails>
											<Controller
												name="judge_name"
												control={control}
												defaultValue={''}
												rules={{
													required: {
														value: true,
														message: 'Required'
													}
												}}
												render={({ field: { ref, ...field } }) => (
													<TextField
														{...field}
														inputRef={ref}
														id="judge_name"
														placeholder="জজের নাম*"
														variant="outlined"
														color="secondary"
														fullWidth
														error={!!errors.judge_name}
													/>
												)}
											/>
											<Typography className={classes.errorMSG}>
												{errors.judge_name && (
													<span>{errors.judge_name.message}</span>
												)}
											</Typography>
										</AccordionDetails>

										<AccordionDetails>
											<Controller
												name="prosecutor_name"
												control={control}
												defaultValue={''}
												rules={{
													required: {
														value: true,
														message: 'Required'
													}
												}}
												render={({ field: { ref, ...field } }) => (
													<TextField
														{...field}
														inputRef={ref}
														id="prosecutor_name"
														placeholder="রাষ্ট্রপক্ষের উকিলের নাম*"
														variant="outlined"
														color="secondary"
														fullWidth
														error={!!errors.prosecutor_name}
													/>
												)}
											/>
											<Typography className={classes.errorMSG}>
												{errors.prosecutor_name && (
													<span>
														{errors.prosecutor_name.message}
													</span>
												)}
											</Typography>
										</AccordionDetails>

										<AccordionDetails>
											<Controller
												name="defence_name"
												control={control}
												defaultValue={''}
												rules={{
													required: {
														value: true,
														message: 'Required'
													}
												}}
												render={({ field: { ref, ...field } }) => (
													<TextField
														{...field}
														inputRef={ref}
														id="defence_name"
														placeholder="আসামীপক্ষের উকিলের নাম*"
														variant="outlined"
														color="secondary"
														fullWidth
														error={!!errors.defence_name}
													/>
												)}
											/>
											<Typography className={classes.errorMSG}>
												{errors.defence_name && (
													<span>
														{errors.defence_name.message}
													</span>
												)}
											</Typography>
										</AccordionDetails>
									</div>
								</div>
							</Accordion>

							<br />
						</div>
						<Container style={{ paddingLeft: '38%' }}>
							<Button
								label="Submit"
								variant="contained"
								color="primary"
								size="large"
								onClick={handleSubmit(onSubmit)}
							>
								জমা দিন
							</Button>
						</Container>
					</form>
					<br />
					<br />
					<br />
				</Container>
			</Paper>
		</React.Fragment>
	);
};

export default CourtForm;
