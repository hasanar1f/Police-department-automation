import React, { useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import '../gd.css';
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
import AddCircleIcon from '@material-ui/icons/AddCircle';
import ThanaList from '../../../utils/ThanaList';
import GDCrimes from '../../../utils/CrimeCategoryGD';
import getThana from '../../../axios/misc/getThana';
import upload from '../../../axios/upload/upload';
import createGD from '../../../axios/GD/create';
import { Alert, AlertTitle } from '@material-ui/lab';
import { Snackbar } from '@material-ui/core';
import { Redirect, useHistory } from 'react-router-dom';
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

const GdForm = () => {

	// const officer = JSON.parse(localStorage.getItem('officer'));
	// if (!officer) {
	// 	return <Redirect to={'/login'} />;
	// }

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
	const [districtList, setDistrictList] = useState([]);
	const [thanaList, setThanaList] = useState([]);
	const [gdScanCopy, setGdScanCopy] = useState([]);
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

	useEffect(() => {
		const officer = JSON.parse(localStorage.getItem('officer'));
		if (!officer) {
			setRedirect(true);
		}
	}, []);

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

	if(redirect){
		return (<Redirect to={'/login'}/>);
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

	const handleDivisionChange = obj => {
		// console.log(obj);
		// setDistrict(Math.random());
		const division = obj.target.innerText;
		if (division !== 'Select Division') {
			divisionList.map(item => {
				// console.log(item);
				if (item.name === division) {
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
		if (district !== 'Select District') {
			districtList.map(item => {
				// console.log(item);
				if (item.name === district) {
					const thanas = item.thanas;
					setThanaList(thanas);
					setValue('thana', '');
				}
			});
		}
	};

	const handleGDScanCopyUpload = e => {
		setGdScanCopy([...e.target.files]);
		const gdError = document.getElementById('gd-scan-copy-error');
		gdError.classList = classes.hidden;
	};

	const removeGDCopy = image => {
		const new_gd_copy = gdScanCopy.filter(item => item !== image);
		setGdScanCopy(new_gd_copy);
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
		const reset_dict = {};
		if (gdScanCopy.length < 1) {
			const gdError = document.getElementById('gd-scan-copy-error');
			gdError.classList = classes.errorMSG;
		} else {
			//TODO: do submit related task

			let thana,
				primaryDocuments = [],
				secondaryImages = [],
				secondaryDocuments = [];

			let primaryFormData = new FormData(),
				secondaryImageFormData = new FormData(),
				secondaryDocumentFormData = new FormData();

			gdScanCopy.map(image => {
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
					directory: '/gd/primary'
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
					directory: '/gd/secondary/images'
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
					directory: '/gd/secondary/documents'
				},
				(res, err) => {
					secondaryDocuments = [...secondaryDocuments, ...res];
				}
			);

			let badi = [],
				bibadi = [];

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

			await createGD(
				{
					_id: data.gd_no,
					title: data.subject,
					topic: data.crime_type.value,
					description: data.crime_details,
					for: badi,
					against: bibadi,
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
							_id: data.gd_no
						};

						history.push({
							pathname: '/gd/view',
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

			//TODO: need to fix this for both gd and case
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
				reset_dict['bibadi_address_' + index] = '';
				reset_dict['bibadi_mobile_no_' + index] = '';
			});
			reset_dict['gd_no'] = '';
			reset_dict['division'] = '';
			reset_dict['district'] = '';
			reset_dict['thana'] = '';
			reset_dict['crime_type'] = '';
			reset_dict['crime_date'] = new Date();
			reset_dict['crime_details'] = '';
			reset_dict['subject'] = '';

			reset(reset_dict);
			setGdScanCopy([]);
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
												name="gd_no"
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
														id="gd_no"
														placeholder="জিডি নং*"
														variant="outlined"
														color="secondary"
														fullWidth
														error={!!errors.gd_no}
													/>
												)}
											/>
											<Typography className={classes.errorMSG}>
												{errors.gd_no && (
													<span>{errors.gd_no.message}</span>
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
													<Select
														{...field}
														inputRef={ref}
														placeholder="Select Crime Category"
														id="crime_type"
														options={GDCrimes}
														getOptionLabel={x => x.label}
														getOptionValue={x => x.value}
														className={classes.select}
														error={!!errors.crime_type}
													/>
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
														placeholder="ঘটনার বিবরণ লিখুন "
														multiline
														variant="outlined"
														color="secondary"
														fullWidth
														rows={8}
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
									aria-controls="panel5a-content"
									id="panel5a-header"
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
															placeholder="Select Division"
															id="division"
															options={divisionList}
															getOptionLabel={x => x.name}
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
															placeholder="Select District"
															id="district"
															options={districtList}
															getOptionLabel={x => x.name}
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
															placeholder="Select thana"
															id="thana"
															options={thanaList}
															getOptionLabel={x => x.name}
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
									aria-controls="panel4a-content"
									id="panel4a-header"
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
													onChange={e => handleGDScanCopyUpload(e)}
												/>
												<label htmlFor="gd_scan_copy">
													<Button
														key="gd_scan_copy-button"
														variant="contained"
														color="primary"
														component="span"
													>

														জিডির স্ক্যান কপি আপলোড *
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
											{gdScanCopy.length > 0 && (
												<div>
													<ImagePreviewForForms
														images={gdScanCopy}
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

export default GdForm;
