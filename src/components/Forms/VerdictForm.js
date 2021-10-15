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
import updateCase from '../../axios/Case/updateCase';

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

const VerdictForm = () => {
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

	const [verdictScanCopy, setVerdictScanCopy] = useState([]);
	const [convictCount, setConvictCount] = useState(0);
	const [convictArray, setConvictArray] = useState([{ id: 0 }]);

	const handleAddConvict = () => {
		let temp = convictCount + 1;
		setConvictCount(temp);

		let temp_array = convictArray;
		temp_array.push({ id: temp });
		setConvictArray(temp_array);
		// console.log(convictArray);
	};

	const handleVerdictScanCopyUpload = e => {
		setVerdictScanCopy([...e.target.files]);
		const verdictError = document.getElementById('verdict-scan-copy-error');
		verdictError.classList = classes.hidden;
	};

	const removeVerdictCopy = image => {
		const new_verdict_copy = verdictScanCopy.filter(item => item !== image);
		setVerdictScanCopy(new_verdict_copy);
	};

	const handleDateChange = date => {
		setSelectedDate(date);
	};

	const handleAlertClose = () => {
		setAlertOpen(false);
	};

	const onSubmit = async data => {
		if (verdictScanCopy.length < 1) {
			const verdictError = document.getElementById(
				'verdict-scan-copy-error'
			);
			verdictError.classList = classes.errorMSG;
		} else {
			console.log(data);

			let primaryDocument = [];

			let primaryFormData = new FormData();

			verdictScanCopy.map(image => {
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
					directory: '/verdict/primary'
				},
				(res, err) => {
					primaryDocument = res;
				}
			);

			let convicts = [];

			for (let index = 0; index <= convictCount; index++) {
				convicts.push({
					name: data['convict_name_' + index],
					accusation: data['accusation_' + index],
					result: data['investigation_result_' + index],
					verdict: data['verdict_' + index]
				});
			}

			await createVerdict(
				{
					case: data['case_no'],
					verdict_no: data['verdict_no'],
					name_of_court: data['court_name'],
					judge: data['judge_name'],
					state_lawyer: data['prosecutor_name'],
					defending_lawyer: data['defence_name'],
					short_description: data['verdict_summary'],
					detailed_description: data['verdict_details'],
					date: data['verdict_date'],
					criminals: convicts,
					primary_documents: primaryDocument
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
									documentType: 'Verdict',
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

						await updateCase({
							_id: data['case_no']
						},{
							verdict: data['verdict_summary']
						},{
							Authorization:
								'Officer ' + localStorage.getItem('token'),
							'Content-type': 'application/json'
						})

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
			convictArray.map((convict, index) => {
				reset_dict['convict_name_' + index] = '';
				reset_dict['accusation_' + index] = '';
				reset_dict['investigation_result_' + index] = '';
				reset_dict['verdict_' + index] = '';
			});
			reset_dict['verdict_no'] = '';
			reset_dict['case_no'] = '';
			reset_dict['verdict_date'] = new Date();
			reset_dict['court_name'] = '';
			reset_dict['judge_name'] = '';
			reset_dict['prosecutor_name'] = '';
			reset_dict['defence_name'] = '';
			reset_dict['verdict_summary'] = '';
			reset_dict['verdict_details'] = '';
			setVerdictScanCopy([]);

			//TODO: NEED to add convict wise verdict
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
										রায়ের বিস্তারিত
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
											<Controller
												name="verdict_no"
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
														id="verdict_no"
														placeholder="রায়ের নম্বর*"
														variant="outlined"
														color="secondary"
														fullWidth
														error={!!errors.verdict_no}
													/>
												)}
											/>
											<Typography className={classes.errorMSG}>
												{errors.verdict_no && (
													<span>{errors.verdict_no.message}</span>
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
												রায়ের তারিখ*
											</Typography>
											<MuiPickersUtilsProvider utils={DateFnsUtils}>
												<Controller
													name="verdict_date"
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
															id="verdict_date"
															label="রায়ের তারিখ"
															format="dd/MM/yyyy"
															KeyboardButtonProps={{
																'aria-label': 'change date'
															}}
															error={!!errors.verdict_date}
															{...rest}
														/>
													)}
												/>
											</MuiPickersUtilsProvider>
											<Typography className={classes.errorMSG}>
												{errors.verdict_date && (
													<span>
														{errors.verdict_date.message}
													</span>
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

										<AccordionDetails>
											<Controller
												name="verdict_summary"
												control={control}
												defaultValue={''}
												rules={{
													required: {
														value: true,
														message: 'Required'
													},
													minLength: {
														value: 20,
														message: 'Too Short'
													}
												}}
												render={({ field: { ref, ...field } }) => (
													<TextField
														{...field}
														inputRef={ref}
														id="verdict_summary"
														// label="ঘটনার বিবরণ"
														placeholder="রায়ের সংক্ষেপ লিখুন*"
														multiline
														variant="outlined"
														color="secondary"
														fullWidth
														rows={4}
														error={!!errors.verdict_summary}
													/>
												)}
											/>
											<br />
											<Typography className={classes.errorMSG}>
												{errors.verdict_summary && (
													<span>
														{errors.verdict_summary.message}
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
														value: 50,
														message: 'Too Short'
													}
												}}
												render={({ field: { ref, ...field } }) => (
													<TextField
														{...field}
														inputRef={ref}
														id="verdict_details"
														// label="ঘটনার বিবরণ"
														placeholder="রায়ের বিবরণ লিখুন*"
														multiline
														variant="outlined"
														color="secondary"
														fullWidth
														rows={8}
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

										<AccordionDetails>
											<div>
												<input
													key="verdict_scan_copy"
													type="file"
													accept="image/*"
													style={{ display: 'none' }}
													id="verdict_scan_copy"
													onChange={e =>
														handleVerdictScanCopyUpload(e)
													}
												/>
												<label htmlFor="verdict_scan_copy">
													<Button
														key="verdict_scan_copy-button"
														variant="contained"
														color="primary"
														component="span"
													>
														রায়ের স্ক্যান কপি আপলোড *
													</Button>
												</label>
											</div>
											<Typography
												className={classes.hidden}
												id="verdict-scan-copy-error"
											>
												<span>Required</span>
											</Typography>
										</AccordionDetails>

										<AccordionDetails>
											{verdictScanCopy.length > 0 && (
												<div>
													<ImagePreviewForForms
														images={verdictScanCopy}
														removeImage={removeVerdictCopy}
													/>
												</div>
											)}
										</AccordionDetails>
									</div>
								</div>
							</Accordion>

							<br />

							<Accordion>
								<AccordionSummary
									expandIcon={<ExpandMoreIcon />}
									aria-controls="panel1a-content"
									id="panel1a-header"
								>
									<Typography className={classes.heading}>
										অভিযুক্তদের তথ্য
									</Typography>
								</AccordionSummary>

								<div className={classes.wrap}>
									{convictArray.map((convict, index) => (
										<div className={classes.box}>
											<Typography
												className={classes.heading}
												style={{ padding: '2rem' }}
											>
												অভিযুক্ত {convict.id + 1}
											</Typography>
											<ConvictVerdict
												key={convict.id}
												handleSubmit={handleSubmit}
												control={control}
												reset={reset}
												errors={errors}
												Controller={Controller}
												index={index}
											/>
										</div>
									))}
								</div>

								<Button
									variant="contained"
									color="secondary"
									startIcon={<AddCircleIcon />}
									onClick={() => {
										handleAddConvict();
									}}
								>
									আরো একজন অভিযুক্ত যোগ করুন
								</Button>
							</Accordion>
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

export default VerdictForm;
