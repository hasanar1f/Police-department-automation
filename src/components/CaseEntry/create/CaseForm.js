import React, { useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import { Redirect, useHistory, useLocation } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import ImagePreviewForForms from '../../basic/ImagePreviewforForms';
import DocumentPreviewforForms from '../../basic/DocumentPreviewforForms';
import { makeStyles } from '@material-ui/core/styles';
import { Controller, useForm } from 'react-hook-form';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Select from 'react-select';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DateFnsUtils from '@date-io/date-fns';
import {
	KeyboardDatePicker,
	MuiPickersUtilsProvider
} from '@material-ui/pickers';
import BadiInfo from '../../formUtil/BadiInfo';
import BibadiInfo from '../../formUtil/BibadiInfo';
import WitnessInfo from '../../formUtil/WitnessInfo';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import ThanaList from '../../../utils/ThanaList';
import Crimes from '../../../utils/CrimeCategoryCase';
import getThana from '../../../axios/misc/getThana';
import upload from '../../../axios/upload/upload';
import { Alert, AlertTitle } from '@material-ui/lab';
import { Snackbar } from '@material-ui/core';
import createCase from '../../../axios/Case/create';
import QueryString from 'querystring';

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
		minHeight: '70vh',
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

const CaseForm = () => {
	const classes = useStyles();

	const divisionList = ThanaList.map(item => {
		return item;
	});
	// console.log(divisionList);

	const [selectedDate, setSelectedDate] = useState(
		new Date('2014-08-18T21:11:54')
	);

	const [badiCount, setBadiCount] = useState(0);
	const [badiArray, setBadiArray] = useState([{ id: 0 }]);
	const [bibadiCount, setBibadiCount] = useState(0);
	const [bibadiArray, setBibadiArray] = useState([{ id: 0 }]);
	const [witnessCount, setWitnessCount] = useState(0);
	const [witnessArray, setWitnessArray] = useState([]);
	const [districtList, setDistrictList] = useState([]);
	const [thanaList, setThanaList] = useState([]);
	const [crimeList, setCrimeList] = useState([]);
	const [caseScanCopy, setcaseScanCopy] = useState([]);
	const [attachedImages, setAttachedImages] = useState([]);
	const [attachedDocuments, setAttachedDocuments] = useState([]);
	const [alertOpen, setAlertOpen] = useState(false);
	const [alertState, setAlertState] = useState({
		initial: true,
		alertType: 'success',
		alertTitle: 'Success',
		message: ''
	});
	const [redirect, setRedirect] = useState(false);
	const history = useHistory();

	const location = useLocation();

	useEffect(() => {
		const officer = JSON.parse(localStorage.getItem('officer'));
		if (!officer) {
			setRedirect(true);
		}
	}, []);

	useEffect(() => {
		if (location !== undefined) {
			if (location.state !== undefined) {
				const gdNo = location.state.gd_no;
				if (gdNo !== undefined && gdNo !== '') {
					setValue('prev_report', gdNo);
				}
			}
		}
	}, [location]);

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

	if (redirect) {
		return <Redirect to={'/login'} />;
	}

	const handleDateChange = date => {
		setSelectedDate(date);
	};

	const handleAddBadi = () => {
		let temp = badiCount + 1;
		setBadiCount(temp);

		let temp_array = badiArray;
		temp_array.push({ id: temp });
		setBadiArray(temp_array);
		// console.log(badiArray);
	};

	const handleAddBibadi = () => {
		let temp = bibadiCount + 1;
		setBibadiCount(temp);

		let temp_array = bibadiArray;
		temp_array.push({ id: temp });
		setBibadiArray(temp_array);
		// console.log(bibadiArray);
	};

	const handleAddWitness = () => {
		// console.log(witnessCount);
		let temp = witnessCount + 1;
		// console.log(temp);
		setWitnessCount(temp);

		let temp_array = witnessArray;
		temp_array.push({ id: temp });
		setWitnessArray(temp_array);
		// console.log(witnessArray);
	};

	const handleDivisionChange = obj => {
		// console.log(obj);
		// setDistrict(Math.random());
		const division = obj.target.innerText;
		if (division !== 'বিভাগ বাছুন') {
			divisionList.map(item => {
				// console.log(item);
				// if (item.name === division) {
				if (item.label === division) {
					const districts = item.districts;
					setDistrictList(districts);
					setValue('district', '');
					setValue('thana', '');
				}
			});
		}
	};

	const handleDistrictChange = obj => {
		// console.log(obj);
		// setDistrict(Math.random());
		const district = obj.target.innerText;
		if (district !== 'জেলা বাছুন') {
			districtList.map(item => {
				// console.log(item);
				// if (item.name === district) {
				if (item.label === district) {
					const thanas = item.thanas;
					setThanaList(thanas);
					setValue('thana', '');
				}
			});
		}
	};

	const handleCrimeTypeChange = obj => {
		// console.log(obj);
		// setDistrict(Math.random());
		const crimeType = obj.target.innerText;
		if (crimeType !== 'Select Crime Type') {
			Crimes.map(item => {
				console.log(item);
				if (item.label === crimeType) {
					const temp_crimes = item.type_of_crimes;
					setCrimeList(temp_crimes);
					setValue('crime_name', '');
				}
			});
		}
	};

	const handlecaseScanCopyUpload = e => {
		setcaseScanCopy([...e.target.files]);
		const gdError = document.getElementById('gd-scan-copy-error');
		gdError.classList = classes.hidden;
	};

	const removeGDCopy = image => {
		const new_gd_copy = caseScanCopy.filter(item => item !== image);
		setcaseScanCopy(new_gd_copy);
	};

	const handleImagesUpload = e => {
		setAttachedImages([...attachedImages, ...e.target.files]);
	};

	const removeImages = image => {
		const new_images = attachedImages.filter(item => item !== image);
		setAttachedImages(new_images);
	};

	const handleDocumentUpload = e => {
		setAttachedDocuments([...attachedDocuments, ...e.target.files]);
	};

	const removeDocument = doc => {
		const new_docs = attachedDocuments.filter(item => item !== doc);
		setAttachedDocuments(new_docs);
	};

	const handleAlertClose = () => {
		setAlertOpen(false);
	};

	const onSubmit = async data => {
		console.log(data);
		const reset_dict = {};
		if (caseScanCopy.length < 1) {
			const gdError = document.getElementById('gd-scan-copy-error');
			gdError.classList = classes.errorMSG;
		} else {
			let thana,
				primaryDocuments = [],
				secondaryImages = [],
				secondaryDocuments = [];

			let primaryFormData = new FormData(),
				secondaryImageFormData = new FormData(),
				secondaryDocumentFormData = new FormData();

			caseScanCopy.map(image => {
				primaryFormData.append('images', image);
			});

			attachedImages.map(image => {
				secondaryImageFormData.append('images', image);
			});

			attachedDocuments.map(document => {
				secondaryDocumentFormData.append('documents', document);
			});

			await getThana(
				{
					division: data.division.name,
					district: data.district.name,
					thana: data.thana.name
				},
				(res, err) => {
					if (res) {
						thana = res;
					} else {
						console.log(err);
					}
				}
			);

			await upload(
				'/upload/images',
				primaryFormData,
				{
					Authorization: 'Officer ' + localStorage.getItem('token'),
					'Content-type': 'multipart/form-data'
				},
				{
					directory: '/case/primary'
				},
				(res, err) => {
					primaryDocuments = res;
				}
			);

			await upload(
				'/upload/images',
				secondaryImageFormData,
				{
					Authorization: 'Officer ' + localStorage.getItem('token'),
					'Content-type': 'multipart/form-data'
				},
				{
					directory: '/case/secondary/images'
				},
				(res, err) => {
					secondaryImages = [...secondaryImages, ...res];
				}
			);

			await upload(
				'/upload/documents',
				secondaryDocumentFormData,
				{
					Authorization: 'Officer ' + localStorage.getItem('token'),
					'Content-type': 'multipart/form-data'
				},
				{
					directory: '/case/secondary/documents'
				},
				(res, err) => {
					secondaryDocuments = [...secondaryDocuments, ...res];
				}
			);

			let badi = [],
				bibadi = [],
				witness = [];

			for (let index = 0; index <= badiCount; index++) {
				badi.push({
					name: data['badi_name_' + index],
					father_name: data['badi_father_name_' + index],
					address: data['badi_address_' + index],
					nid: data['badi_nid_' + index],
					phone_no: '0' + data['badi_mobile_no_' + index],
					date_of_birth: data['badi_dob_' + index]
				});
			}

			for (let index = 0; index <= bibadiCount; index++) {
				bibadi.push({
					name: data['bibadi_name_' + index],
					father_name: data['bibadi_father_name_' + index],
					address: data['bibadi_address_' + index],
					phone_no: '0' + data['bibadi_mobile_no_' + index]
				});
			}

			for (let index = 0; index < witnessCount; index++) {
				witness.push({
					name: data['witness_name_' + index],
					father_name: data['witness_father_name_' + index],
					address: data['witness_address_' + index],
					nid: data['witness_nid_' + index],
					phone_no: '0' + data['witness_mobile_no_' + index],
					date_of_birth: data['witness_dob_' + index],
					witness_statement: data['testimony_' + index]
				});
			}

			const print = {
					_id: data.case_no,
					subject: data.subject,
					type: data.crime_type.value, // criminal_case (fouzdari) civil_case (dewani)
					topic: data.crime_name.value,
					description: data.crime_details,
					for: badi,
					against: bibadi,
					witness: witness,
					relationship_between_parties: data.relation_between,
					damage: data.loss_amount,
					date: data.crime_date,
					late_reason: data.late_reason,
					primary_documents: primaryDocuments,
					optional_images: secondaryImages,
					optional_documents: secondaryDocuments,
					thana: thana._id
				};

			console.log(print);

			await createCase(
				{
					_id: data.case_no,
					subject: data.subject,
					type: data.crime_type.value, // criminal_case (fouzdari) civil_case (dewani)
					topic: data.crime_name.value,
					description: data.crime_details,
					for: badi,
					against: bibadi,
					witness: witness,
					relationship_between_parties: data.relation_between,
					damage: data.loss_amount,
					date: data.crime_date,
					late_reason: data.late_reason,
					primary_documents: primaryDocuments,
					optional_images: secondaryImages,
					optional_documents: secondaryDocuments,
					thana: thana._id
				},
				{
					Authorization: 'Officer ' + localStorage.getItem('token'),
					'Content-type': 'application/json'
				},
				(res, err) => {
					if (res) {
						setAlertState({
							initial: false,
							alertType: 'success',
							alertTitle: 'Success',
							message: res.message
						});

						let historyParam = {
							_id: data.case_no
						};

						history.push({
							pathname: '/CaseEntry/view',
							search: '?' + QueryString.stringify(historyParam)
						});

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

			//TODO: do submit related task
			badiArray.map((badi, index) => {
				reset_dict['badi_name_' + index] = '';
				reset_dict['badi_father_name_' + index] = '';
				reset_dict['badi_address_' + index] = '';
				reset_dict['badi_nid_' + index] = '';
				reset_dict['badi_mobile_no_' + index] = '';
				reset_dict['badi_dob_' + index] = new Date();
			});
			bibadiArray.map((bibadi, index) => {
				reset_dict['bibadi_name_' + index] = '';
				reset_dict['bibadi_father_name_' + index] = '';
				reset_dict['bibadi_address' + index] = '';
				reset_dict['bibadi_mobile_no_' + index] = '';
			});
			witnessArray.map((witness, index) => {
				reset_dict['witness_name_' + index] = '';
				reset_dict['witness_father_name_' + index] = '';
				reset_dict['witness_address_' + index] = '';
				reset_dict['witness_nid_' + index] = '';
				reset_dict['witness_mobile_no_' + index] = '';
				reset_dict['testimony_' + index] = '';
			});
			reset_dict['case_no'] = '';
			reset_dict['division'] = '';
			reset_dict['district'] = '';
			reset_dict['thana'] = '';
			reset_dict['crime_type'] = '';
			reset_dict['crime_name'] = '';
			reset_dict['crime_date'] = new Date();
			reset_dict['crime_details'] = '';
			reset_dict['subject'] = '';
			reset_dict['late_reason'] = '';
			reset_dict['loss_amount'] = '';
			reset_dict['relation_between'] = '';
			reset_dict['prev_report'] = '';

			reset(reset_dict);
			setcaseScanCopy([]);
			setAttachedImages([]);
			setAttachedDocuments([]);
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
										অপরাধের বিস্তারিত
									</Typography>
								</AccordionSummary>
								<div className={classes.wrap}>
									<div className={classes.box}>
										<AccordionDetails>
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
														placeholder="মামলা নং*"
														variant="outlined"
														color="secondary"
														fullWidth
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
												name="crime_type"
												control={control}
												defaultValue={''}
												rules={{
													required: {
														value: true,
														message: 'Required'
													}
												}}
												render={({ field: { ref, ...field } }) => (
													<div
														onClick={handleCrimeTypeChange}
														className={classes.select}
														id="crimeType_Select"
													>
														<Select
															{...field}
															inputRef={ref}
															placeholder="Select Crime Type"
															id="crime_type"
															options={Crimes}
															getOptionLabel={x => x.label}
															getOptionValue={x => x.value}
															error={!!errors.crime_type}
														/>
													</div>
												)}
											/>
											<Typography className={classes.errorMSG}>
												{errors.crime_type && (
													<span>{errors.crime_type.message}</span>
												)}
											</Typography>
										</AccordionDetails>

										<AccordionDetails>
											<Controller
												name="crime_name"
												control={control}
												defaultValue={''}
												rules={{
													required: {
														value: true,
														message: 'Required'
													}
												}}
												render={({ field: { ref, ...field } }) => (
													<div
														className={classes.select}
														id="crimeName_Select"
													>
														<Select
															{...field}
															inputRef={ref}
															placeholder="Select Crime"
															id="crime_name"
															options={crimeList}
															getOptionLabel={x => x.label}
															getOptionValue={x => x.value}
															error={!!errors.crime_name}
														/>
													</div>
												)}
											/>
											<Typography className={classes.errorMSG}>
												{errors.crime_name && (
													<span>{errors.crime_name.message}</span>
												)}
											</Typography>
										</AccordionDetails>

										<AccordionDetails>
											<Controller
												name="subject"
												control={control}
												defaultValue={''}
												rules={{
													required: {
														value: true,
														message: 'Required'
													},
													minLength: {
														value: 8,
														message: 'Too Short'
													},
													maxLength: {
														value: 40,
														message: 'Too Long'
													}
												}}
												render={({ field: { ref, ...field } }) => (
													<TextField
														{...field}
														inputRef={ref}
														id="subject"
														// label="ঘটনার বিবরণ"
														placeholder="বিষয়*"
														variant="outlined"
														color="secondary"
														fullWidth
														error={!!errors.subject}
													/>
												)}
											/>
											<Typography className={classes.errorMSG}>
												{errors.subject && (
													<span>{errors.subject.message}</span>
												)}
											</Typography>
										</AccordionDetails>

										<AccordionDetails>
											<Typography
												className={classes.heading}
												style={{
													paddingTop: '1rem',
													paddingRight: '4rem',
													fontSize: '1.2rem'
												}}
											>
												পূর্বোক্ত জিডি নাম্বার:
											</Typography>
											<Controller
												name="prev_report"
												control={control}
												defaultValue={''}
												rules={{}}
												render={({ field: { ref, ...field } }) => (
													<TextField
														{...field}
														inputRef={ref}
														id="prev_report"
														placeholder="যদি থাকে"
														variant="outlined"
														color="secondary"
														error={!!errors.prev_report}
													/>
												)}
											/>
											<Typography className={classes.errorMSG}>
												{errors.prev_report && (
													<span>{errors.prev_report.message}</span>
												)}
											</Typography>
										</AccordionDetails>

										<AccordionDetails>
											<Controller
												name="loss_amount"
												control={control}
												defaultValue={''}
												rules={{}}
												render={({ field: { ref, ...field } }) => (
													<TextField
														{...field}
														inputRef={ref}
														id="loss_amount"
														// label="ঘটনার বিবরণ"
														placeholder="ক্ষতির পরিমান (টাকায়)"
														variant="outlined"
														color="secondary"
														fullWidth
														error={!!errors.loss_amount}
													/>
												)}
											/>
											<Typography className={classes.errorMSG}>
												{errors.loss_amount && (
													<span>{errors.loss_amount.message}</span>
												)}
											</Typography>
										</AccordionDetails>

										<AccordionDetails>
											<Controller
												name="relation_between"
												control={control}
												defaultValue={''}
												rules={{}}
												render={({ field: { ref, ...field } }) => (
													<TextField
														{...field}
														inputRef={ref}
														id="relation_between"
														// label="ঘটনার বিবরণ"
														placeholder="মামলার দুইপক্ষের সম্পর্ক"
														variant="outlined"
														color="secondary"
														fullWidth
														error={!!errors.relation_between}
													/>
												)}
											/>
											<Typography className={classes.errorMSG}>
												{errors.relation_between && (
													<span>
														{errors.relation_between.message}
													</span>
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
												ঘটনার তারিখ*
											</Typography>
											<MuiPickersUtilsProvider utils={DateFnsUtils}>
												<Controller
													name="crime_date"
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
															id="crime_date"
															label="ঘটনার  তারিখ"
															format="dd/MM/yyyy"
															KeyboardButtonProps={{
																'aria-label': 'change date'
															}}
															error={!!errors.crime_date}
															{...rest}
														/>
													)}
												/>
											</MuiPickersUtilsProvider>
											<Typography className={classes.errorMSG}>
												{errors.crime_date && (
													<span>{errors.crime_date.message}</span>
												)}
											</Typography>
										</AccordionDetails>

										<AccordionDetails>
											<Controller
												name="crime_details"
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
														id="crime_details"
														// label="ঘটনার বিবরণ"
														placeholder="এজহার*"
														multiline
														variant="outlined"
														color="secondary"
														fullWidth
														rows={20}
														error={!!errors.crime_details}
													/>
												)}
											/>
											<br />
											<Typography className={classes.errorMSG}>
												{errors.crime_details && (
													<span>
														{errors.crime_details.message}
													</span>
												)}
											</Typography>
										</AccordionDetails>
										<AccordionDetails>
											<Controller
												name="late_reason"
												control={control}
												defaultValue={''}
												rules={{}}
												render={({ field: { ref, ...field } }) => (
													<TextField
														{...field}
														inputRef={ref}
														id="late_reason"
														// label="ঘটনার বিবরণ"
														placeholder="বিলম্বের কারন (যদি প্রযোজ্য হয়)"
														variant="outlined"
														color="secondary"
														fullWidth
														error={!!errors.late_reason}
													/>
												)}
											/>
											<Typography className={classes.errorMSG}>
												{errors.late_reason && (
													<span>{errors.late_reason.message}</span>
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
									aria-controls="panel1a-content"
									id="panel1a-header"
								>
									<Typography className={classes.heading}>
										বাদীর তথ্য
									</Typography>
								</AccordionSummary>

								<div className={classes.wrap}>
									{badiArray.map((badi, index) => (
										<div className={classes.box}>
											<Typography
												className={classes.heading}
												style={{ padding: '2rem' }}
											>
												বাদী {badi.id + 1}
											</Typography>
											<BadiInfo
												key={badi.id}
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
										handleAddBadi();
									}}
								>
									আরো একজন বাদী যোগ করুন
								</Button>
							</Accordion>

							<br />

							<Accordion>
								<AccordionSummary
									expandIcon={<ExpandMoreIcon />}
									aria-controls="panel2a-content"
									id="panel2a-header"
								>
									<Typography className={classes.heading}>
										বিবাদীর তথ্য
									</Typography>
								</AccordionSummary>

								<div className={classes.wrap}>
									{bibadiArray.map((bibadi, index) => (
										<div className={classes.box}>
											<Typography
												className={classes.heading}
												style={{ padding: '2rem' }}
											>
												বিবাদী {bibadi.id + 1}
											</Typography>
											<BibadiInfo
												key={bibadi.id}
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
										handleAddBibadi();
									}}
								>
									আরো একজন বিবাদী যোগ করুন
								</Button>
							</Accordion>

							<br />

							<Accordion>
								<AccordionSummary
									expandIcon={<ExpandMoreIcon />}
									aria-controls="panel5a-content"
									id="panel5a-header"
								>
									<Typography className={classes.heading}>
										স্বাক্ষীর তথ্য
									</Typography>
								</AccordionSummary>

								<div className={classes.wrap}>
									{witnessArray.map((witness, index) => (
										<div className={classes.box}>
											<Typography
												className={classes.heading}
												style={{ padding: '2rem' }}
											>
												স্বাক্ষী {witness.id}
											</Typography>
											<WitnessInfo
												key={witness.id}
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
										handleAddWitness();
									}}
								>
									স্বাক্ষী যোগ করুন
								</Button>
							</Accordion>

							<br />

							<Accordion>
								<AccordionSummary
									expandIcon={<ExpandMoreIcon />}
									aria-controls="panel3a-content"
									id="panel3a-header"
								>
									<Typography className={classes.heading}>
										থানা বেছে নিন
									</Typography>
								</AccordionSummary>
								<div className={classes.wrap}>
									<div className={classes.box}>
										<AccordionDetails>
											<Controller
												name="division"
												control={control}
												defaultValue={''}
												rules={{
													required: {
														value: true,
														message: 'Required'
													}
												}}
												render={({ field: { ref, ...field } }) => (
													<div
														onClick={handleDivisionChange}
														className={classes.select}
													>
														<Select
															{...field}
															inputRef={ref}
															placeholder="বিভাগ বাছুন"
															id="division"
															options={divisionList}
															getOptionLabel={x => x.label}
															getOptionValue={x => x.name}
															error={!!errors.division}
														/>
													</div>
												)}
											/>

											<Typography className={classes.errorMSG}>
												{errors.division && (
													<span>{errors.division.message}</span>
												)}
											</Typography>
										</AccordionDetails>

										<AccordionDetails>
											<Controller
												name="district"
												control={control}
												defaultValue={''}
												rules={{
													required: {
														value: true,
														message: 'Required'
													}
												}}
												render={({ field: { ref, ...field } }) => (
													<div
														onClick={handleDistrictChange}
														className={classes.select}
														id="districtSelect"
													>
														<Select
															{...field}
															inputRef={ref}
															placeholder="জেলা বাছুন"
															id="district"
															options={districtList}
															getOptionLabel={x => x.label}
															getOptionValue={x => x.name}
															error={!!errors.district}
														/>
													</div>
												)}
											/>
											<Typography className={classes.errorMSG}>
												{errors.district && (
													<span>{errors.district.message}</span>
												)}
											</Typography>
										</AccordionDetails>

										<AccordionDetails>
											<Controller
												name="thana"
												control={control}
												defaultValue={''}
												rules={{
													required: {
														value: true,
														message: 'Required'
													}
												}}
												render={({ field: { ref, ...field } }) => (
													<div className={classes.select}>
														<Select
															{...field}
															inputRef={ref}
															placeholder="থানা বাছুন"
															id="thana"
															options={thanaList}
															getOptionLabel={x => x.label}
															getOptionValue={x => x.name}
															error={!!errors.thana}
														/>
													</div>
												)}
											/>
											<Typography className={classes.errorMSG}>
												{errors.thana && (
													<span>{errors.thana.message}</span>
												)}
											</Typography>
										</AccordionDetails>
										<br />
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
													key="gd_scan_copy"
													type="file"
													accept="image/*"
													style={{ display: 'none' }}
													id="gd_scan_copy"
													onChange={e =>
														handlecaseScanCopyUpload(e)
													}
												/>
												<label htmlFor="gd_scan_copy">
													<Button
														key="gd_scan_copy-button"
														variant="contained"
														color="primary"
														component="span"
													>
														মামলার স্ক্যান কপি আপলোড করুন *
													</Button>
												</label>
											</div>
											<Typography
												className={classes.hidden}
												id="gd-scan-copy-error"
											>
												<span>Required</span>
											</Typography>
										</AccordionDetails>

										<AccordionDetails>
											{caseScanCopy.length > 0 && (
												<div>
													<ImagePreviewForForms
														images={caseScanCopy}
														removeImage={removeGDCopy}
													/>
												</div>
											)}
										</AccordionDetails>

										<AccordionDetails>
											<div>
												<input
													key="attached_image"
													type="file"
													accept="image/*"
													multiple
													style={{ display: 'none' }}
													id="attached_image"
													onChange={e => handleImagesUpload(e)}
												/>
												<label htmlFor="attached_image">
													<Button
														key="attached_image-button"
														variant="contained"
														color="primary"
														component="span"
													>
														ছবি সংযুক্ত করুন
													</Button>
												</label>
											</div>
										</AccordionDetails>

										<AccordionDetails>
											{attachedImages.length > 0 && (
												<div>
													<ImagePreviewForForms
														images={attachedImages}
														removeImage={removeImages}
													/>
												</div>
											)}
										</AccordionDetails>

										<AccordionDetails>
											<div>
												<input
													key="attached_documents"
													multiple
													type="file"
													accept="application/pdf"
													style={{ display: 'none' }}
													id="attached_documents"
													onChange={e => handleDocumentUpload(e)}
												/>
												<label htmlFor="attached_documents">
													<Button
														key="attached_documents-button"
														variant="contained"
														color="primary"
														component="span"
													>
														ডকুমেন্ট সংযুক্ত করুন
													</Button>
												</label>
											</div>
										</AccordionDetails>

										<AccordionDetails>
											{attachedDocuments.length > 0 && (
												<div>
													<DocumentPreviewforForms
														documents={attachedDocuments}
														removeDoc={removeDocument}
													/>
												</div>
											)}
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
								size="medium"
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

export default CaseForm;
