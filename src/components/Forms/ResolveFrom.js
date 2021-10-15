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
import upload from '../../axios/upload/upload';
import createResolve from '../../axios/resolve/create';
import updateCaseTimeline from '../../axios/Case/updateTimeline';

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
		width: '80%',
		fontWeight: 'bolder'
	},

	hidden: {
		display: 'none'
	}
}));

const ResolveForm = () => {
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
	const appeal_approve = [
		{
			label: '✅ হ্যাঁ',
			value: true
		},
		{
			label: '⛔️ না',
			value: false
		}
	];

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

	const [scanCopy, setScanCopy] = useState([]);

	const handleDateChange = date => {
		setSelectedDate(date);
	};

	const handleAlertClose = () => {
		setAlertOpen(false);
	};

	const handleScanCopyUpload = e => {
		setScanCopy([...e.target.files]);
		const _Error = document.getElementById('scan-copy-error');
		_Error.classList = classes.hidden;
	};

	const removeScanCopy = image => {
		const new_copy = scanCopy.filter(item => item !== image);
		setScanCopy(new_copy);
	};

	const onSubmit = async data => {
		if (scanCopy.length < 1) {
			const _Error = document.getElementById('scan-copy-error');
			_Error.classList = classes.errorMSG;
		} else {
			console.log(data);

			let primaryDocument = [];

			let primaryFormData = new FormData();

			scanCopy.map(image => {
				primaryFormData.append('images', image);
			});

			await upload(
				'/upload/images',
				primaryFormData,
				{
					Authorization: 'Officer ' + localStorage.getItem('token'),
					'Content-type': 'multipart/form-data'
				},
				{
					directory: '/resolve/primary'
				},
				(res, err) => {
					primaryDocument = res;
				}
			);

			await createResolve(
				{
					case: data['case_no'],
					date: data['appeal_verdict_date'],
					officer: data['officer_name'],
					summary: data['verdict_details'],
					documents: primaryDocument
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
									documentType: 'Resolve',
									id: res.id,
									recordedBy: JSON.parse(
										localStorage.getItem('officer')
									)._id
								}
							},
							{
								Authorization:
									'Officer ' + localStorage.getItem('token'),
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
			//TODO: need to fix this for both gd and case
			reset_dict['case_no'] = '';
			reset_dict['resolve_date'] = new Date();
			reset_dict['officer_name'] = '';
			reset_dict['verdict_details'] = '';
			setScanCopy([]);

			reset(reset_dict);
		}
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
										মামলা নিষ্পত্তি
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
												নিষ্পত্তির তারিখ*
											</Typography>
											<MuiPickersUtilsProvider utils={DateFnsUtils}>
												<Controller
													name="resolve_date"
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
															id="resolve_date"
															label="নিষ্পত্তির তারিখ"
															format="dd/MM/yyyy"
															KeyboardButtonProps={{
																'aria-label': 'change date'
															}}
															error={!!errors.resolve_date}
															{...rest}
														/>
													)}
												/>
											</MuiPickersUtilsProvider>
											<Typography className={classes.errorMSG}>
												{errors.resolve_date && (
													<span>
														{errors.resolve_date.message}
													</span>
												)}
											</Typography>
										</AccordionDetails>

										<AccordionDetails>
											<Controller
												name="officer_name"
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
														id="officer_name"
														placeholder="অফিসারের নাম*"
														variant="outlined"
														color="secondary"
														fullWidth
														error={!!errors.officer_name}
													/>
												)}
											/>
											<Typography className={classes.errorMSG}>
												{errors.officer_name && (
													<span>
														{errors.officer_name.message}
													</span>
												)}
											</Typography>
										</AccordionDetails>

										<AccordionDetails>
											<Controller
												name="verdict_details"
												control={control}
												defaultValue={''}
												rules={{
													required: {
														value: true,
														message: 'Required'
													},
													minLength: {
														value: 30,
														message: 'Too Short'
													}
												}}
												render={({ field: { ref, ...field } }) => (
													<TextField
														{...field}
														inputRef={ref}
														id="verdict_details"
														// label="ঘটনার বিবরণ"
														placeholder="রায়ের সংক্ষেপ*"
														multiline
														variant="outlined"
														color="secondary"
														fullWidth
														rows={6}
														error={!!errors.verdict_details}
													/>
												)}
											/>
											<br />
											<Typography className={classes.errorMSG}>
												{errors.verdict_details && (
													<span>
														{errors.verdict_details.message}
													</span>
												)}
											</Typography>
										</AccordionDetails>
									</div>
								</div>
							</Accordion>

							<br />

							<Accordion>
								<AccordionSummary
									expandIcon={<ExpandMoreIcon />}
									aria-controls="panel6a-content"
									id="panel6a-header"
								>
									<Typography className={classes.heading}>
										প্র​য়োজনীয় ডকুমেন্টস আপলোড
									</Typography>
								</AccordionSummary>
								<div className={classes.wrap}>
									<div className={classes.box}>
										<AccordionDetails>
											<div>
												<input
													key="Form_scan_copy"
													type="file"
													accept="image/*"
													style={{ display: 'none' }}
													id="Form_scan_copy"
													onChange={e => handleScanCopyUpload(e)}
												/>
												<label htmlFor="Form_scan_copy">
													<Button
														key="Form_scan_copy-button"
														variant="contained"
														color="primary"
														component="span"
													>
												
														স্ক্যান কপি আপলোড *
													</Button>
												</label>
											</div>
											<Typography
												className={classes.hidden}
												id="scan-copy-error"
											>
												<span>Required</span>
											</Typography>
										</AccordionDetails>

										<AccordionDetails>
											{scanCopy.length > 0 && (
												<div>
													<ImagePreviewForForms
														images={scanCopy}
														removeImage={removeScanCopy}
													/>
												</div>
											)}
										</AccordionDetails>
									</div>
								</div>
							</Accordion>
						</div>
						<Container style={{ paddingLeft: '38%' }}>
							<Button
								label="জমা দিন"
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

export default ResolveForm;
