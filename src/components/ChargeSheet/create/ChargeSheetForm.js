import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
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
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DateFnsUtils from '@date-io/date-fns';
import {
	KeyboardDatePicker,
	MuiPickersUtilsProvider
} from '@material-ui/pickers';
import InformantInfo from '../../formUtil/InformantInfo';
import DefendantInfo from '../../formUtil/DefendantInfo';
import SeizedGoodInfo from '../../formUtil/SeizedGoodInfo';
import WitnessInfo from '../../formUtil/WitnessInfo_CS';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import ThanaList from '../../../utils/ThanaList';
// import DefendantState from '../../../utils/DefendantState';
import upload from '../../../axios/upload/upload';
import { Alert, AlertTitle } from '@material-ui/lab';
import { Snackbar } from '@material-ui/core';
import createChargeSheet from '../../../axios/ChargeSheet/create';
import updateCaseTimeline from '../../../axios/Case/updateTimeline';

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

const ChargeSheetForm = () => {
	const classes = useStyles();
	const history = useHistory();

	const divisionList = ThanaList.map(item => {
		return item;
	});

	// console.log(divisionList);

	const [selectedDate, setSelectedDate] = useState(
		new Date('2014-08-18T21:11:54')
	);

	const [informantCount, setInformantCount] = useState(0);
	const [informantArray, setInformantArray] = useState([{ id: 0 }]);
	const [defendantCount, setDefendantCount] = useState(0);
	const [defendantArray, setDefendantArray] = useState([{ id: 0 }]);
	const [goodsCount, setGoodsCount] = useState(0);
	const [goodsArray, setGoodsArray] = useState([]);
	const [witnessCount, setWitnessCount] = useState(0);
	const [witnessArray, setWitnessArray] = useState([]);
	const [districtList, setDistrictList] = useState([]);
	const [thanaList, setThanaList] = useState([]);
	const [csScanCopy, setCsScanCopy] = useState([]);
	const [attachedImages, setAttachedImages] = useState([]);
	const [attachedDocuments, setAttachedDocuments] = useState([]);
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
					setValue('case_id', caseNo);
				}
			}
		}
	}, [location]);

	const handleDateChange = date => {
		setSelectedDate(date);
	};

	const handleAddInformant = () => {
		let temp = informantCount + 1;
		setInformantCount(temp);

		let temp_array = informantArray;
		temp_array.push({ id: temp });
		setInformantArray(temp_array);
		// console.log(informantArray);
	};

	const handleAddDefendant = () => {
		let temp = defendantCount + 1;
		setDefendantCount(temp);

		let temp_array = defendantArray;
		temp_array.push({ id: temp });
		setDefendantArray(temp_array);
		// console.log(defendantArray);
	};

	const handleAddGoods = () => {
		let temp = goodsCount + 1;
		setGoodsCount(temp);

		let temp_array = goodsArray;
		temp_array.push({ id: temp });
		setGoodsArray(temp_array);
		// console.log(goodsArray);
	};

	const handleAddWitness = () => {
		console.log(witnessCount);
		let temp = witnessCount + 1;
		console.log(temp);
		setWitnessCount(temp);

		let temp_array = witnessArray;
		temp_array.push({ id: temp });
		setWitnessArray(temp_array);
		// console.log(witnessArray);
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

	const handleCSScanCopyUpload = e => {
		setCsScanCopy([...e.target.files]);
		const gdError = document.getElementById('gd-scan-copy-error');
		gdError.classList = classes.hidden;
	};
	const removeCSCopy = image => {
		const new_gd_copy = csScanCopy.filter(item => item !== image);
		setCsScanCopy(new_gd_copy);
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
		console.log(data);
		if (csScanCopy.length < 1) {
			const gdError = document.getElementById('gd-scan-copy-error');
			// gdError.classList = classes.errorMSG;
		} else {
			//TODO: do submit related task
			console.log(data);

			let primaryDocument = [],
				secondaryImages = [],
				secondaryDocuments = [];

			let primaryFormData = new FormData(),
				secondaryImageFormData = new FormData(),
				secondaryDocumentFormData = new FormData();

			csScanCopy.map(image => {
				primaryFormData.append('images', image);
			});

			attachedImages.map(image => {
				secondaryImageFormData.append('images', image);
			});

			attachedDocuments.map(document => {
				secondaryDocumentFormData.append('documents', document);
			});

			await upload(
				'/upload/images',
				primaryFormData,
				{
					Authorization: 'Officer ' + localStorage.getItem('token'),
					'Content-type': 'multipart/form-data'
				},
				{
					directory: '/chargeSheet/primary'
				},
				(res, err) => {
					primaryDocument = res;
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
					directory: '/chargeSheet/secondary/images'
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
					directory: '/chargeSheet/secondary/documents'
				},
				(res, err) => {
					secondaryDocuments = [...secondaryDocuments, ...res];
				}
			);

			let informants = [],
				defendants = [],
				goods = [],
				witnesses = [];

			for (let index = 0; index <= informantCount; index++) {
				informants.push({
					name: data['informant_name_' + index],
					address: data['informant_address_' + index],
					occupation: data['occupation_' + index]
				});
			}

			for (let index = 0; index <= defendantCount; index++) {
				defendants.push({
					name: data['defendant_name_' + index],
					address: data['defendant_address_' + index],
					status: data['arrest_state_' + index].value,
					afterArrestState: data['after_arrest_state_' + index].value,
					supervisor: data['supervisor_name_' + index]
				});
			}

			for (let index = 0; index < goodsCount; index++) {
				goods.push({
					nature: data['goods_type_' + index],
					quantity: data['goods_quantity_' + index],
					location: data['goods_where_' + index],
					date: data['goods_date_' + index],
					collected_from: data['goods_from_' + index],
					collected_by: data['goods_recovered_by_' + index],
					sent_to_magistrate: data['goods_submitted_' + index].value
				});
			}

			for (let index = 0; index < witnessCount; index++) {
				witnesses.push({
					name: data['witness_name_' + index],
					address: data['witness_address_' + index],
					testimony: data['witness_testimony_' + index]
				});
			}

			await createChargeSheet(
				{
					case: data['case_id'],
					dhara: data['section_code'],
					date: data['cs_date'],
					info_provider: informants,
					acquired_items: goods,
					witness: witnesses,
					accused: defendants,
					accusation: data['complain_title'],
					crime: data['offence_title'],
					dhara_of_accusation: data['section_of_act'],
					description: data['inquiry_report'],
					primary_documents: primaryDocument,
					optional_images: secondaryImages,
					optional_documents: secondaryDocuments
				},
				{
					Authorization: 'Officer ' + localStorage.getItem('token'),
					'Content-type': 'application/json'
				},
				async (res, err) => {
					if (res) {
						await updateCaseTimeline(
							{
								_id: data['case_id']
							},
							{
								toPush: {
									documentType: 'Chargesheet',
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

			informantArray.map((badi, index) => {
				reset_dict['informant_name_' + index] = '';
				reset_dict['occupation_' + index] = '';
				reset_dict['informant_address_' + index] = '';
			});
			defendantArray.map((badi, index) => {
				reset_dict['defendant_name_' + index] = '';
				reset_dict['defendant_address_' + index] = '';
				reset_dict['arrest_state_' + index] = '';
				reset_dict['after_arrest_state_' + index] = '';
				reset_dict['supervisor_name_' + index] = '';
			});
			goodsArray.map((goods, index) => {
				reset_dict['goods_type_' + index] = '';
				reset_dict['goods_quantity_' + index] = '';
				reset_dict['goods_date_' + index] = '';
				reset_dict['goods_where_' + index] = '';
				reset_dict['goods_from_' + index] = '';
				reset_dict['goods_recovered_by_' + index] = '';
				reset_dict['goods_submitted_' + index] = '';
			});
			witnessArray.map((witness, index) => {
				reset_dict['witness_name_' + index] = '';
				reset_dict['witness_address_' + index] = '';
				reset_dict['witness_testimony_' + index] = '';
			});
			reset_dict['case_id'] = '';
			reset_dict['cs_date'] = new Date();
			reset_dict['section_code'] = '';
			reset_dict['complain_title'] = '';
			reset_dict['offence_title'] = '';
			reset_dict['section_of_act'] = '';
			reset_dict['inquiry_report'] = '';

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
									aria-controls="panel1a-content"
									id="panel1a-header"
								>
									<Typography className={classes.heading}>
										ধারা সংক্রান্ত তথ্য
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
												name="case_id"
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
														id="case_id"
														label="মামলা নাম্বার*"
														variant="outlined"
														color="secondary"
														error={!!errors.case_id}
													/>
												)}
											/>
											<Typography className={classes.errorMSG}>
												{errors.case_id && (
													<span>{errors.case_id.message}</span>
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
												চার্জশিট জমার তারিখ*
											</Typography>
											<MuiPickersUtilsProvider utils={DateFnsUtils}>
												<Controller
													name="cs_date"
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
															id="cs_date"
															label="চার্জশিট জমার তারিখ"
															format="dd/MM/yyyy"
															KeyboardButtonProps={{
																'aria-label': 'change date'
															}}
															error={!!errors.cs_date}
															{...rest}
														/>
													)}
												/>
											</MuiPickersUtilsProvider>
											<Typography className={classes.errorMSG}>
												{errors.cs_date && (
													<span>{errors.cs_date.message}</span>
												)}
											</Typography>
										</AccordionDetails>
										<br />
										<AccordionDetails>
											<Controller
												name="section_code"
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
														id="section_code"
														label="ধারা*"
														variant="outlined"
														color="secondary"
														fullWidth
														error={!!errors.section_code}
													/>
												)}
											/>
											<Typography className={classes.errorMSG}>
												{errors.section_code && (
													<span>
														{errors.section_code.message}
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
									aria-controls="panel2a-content"
									id="panel2a-header"
								>
									<Typography className={classes.heading}>
										তথ্য প্রদানকারী
									</Typography>
								</AccordionSummary>

								<div className={classes.wrap}>
									{informantArray.map((informant, index) => (
										<div className={classes.box}>
											<Typography
												className={classes.heading}
												style={{ padding: '2rem' }}
											>
												তথ্য প্রদানকারী {informant.id + 1}
											</Typography>
											<InformantInfo
												key={informant.id}
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
										handleAddInformant();
									}}
								>
									আরো একজন তথ্য প্রদানকারী যোগ করুন
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
										অভিযুক্তদের তথ্য
									</Typography>
								</AccordionSummary>

								<div className={classes.wrap}>
									{defendantArray.map((defendant, index) => (
										<div className={classes.box}>
											<Typography
												className={classes.heading}
												style={{ padding: '2rem' }}
											>
												অভিযুক্ত {defendant.id + 1}
											</Typography>
											<DefendantInfo
												key={defendant.id}
												handleSubmit={handleSubmit}
												control={control}
												reset={reset}
												errors={errors}
												Controller={Controller}
												getValues={getValues}
												setValue={setValue}
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
										handleAddDefendant();
									}}
								>
									আরো একজন অভিযুক্ত যোগ করুন
								</Button>
							</Accordion>

							<br />

							<Accordion>
								<AccordionSummary
									expandIcon={<ExpandMoreIcon />}
									aria-controls="panel4a-content"
									id="panel4a-header"
								>
									<Typography className={classes.heading}>
										প্রাপ্ত মালামাল
									</Typography>
								</AccordionSummary>

								<div className={classes.wrap}>
									{goodsArray.map((goods, index) => (
										<div className={classes.box}>
											<Typography
												className={classes.heading}
												style={{ padding: '2rem' }}
											>
												মালামাল {goods.id}
											</Typography>
											<SeizedGoodInfo
												key={goods.id}
												handleSubmit={handleSubmit}
												control={control}
												reset={reset}
												errors={errors}
												Controller={Controller}
												getValues={getValues}
												setValue={setValue}
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
										handleAddGoods();
									}}
								>
									আরো মালামাল যোগ করুন
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
									aria-controls="panel6a-content"
									id="panel6a-header"
								>
									<Typography className={classes.heading}>
										অভিযোগ তদন্তের ফলাফল
									</Typography>
								</AccordionSummary>
								<AccordionDetails>
									<Controller
										name="complain_title"
										control={control}
										defaultValue={''}
										rules={{
											required: { value: true, message: 'Required' },
											minLength: { value: 4, message: 'Too Short' }
										}}
										render={({ field: { ref, ...field } }) => (
											<TextField
												{...field}
												inputRef={ref}
												id="complain_title"
												label="অভিযোগ*"
												variant="outlined"
												color="secondary"
												fullWidth
												error={!!errors.complain_title}
												//onChange={(e) => setName(e.target.value)}
											/>
										)}
									/>
									<br />
									<Typography className={classes.errorMSG}>
										{errors.complain_title && (
											<span>{errors.complain_title.message}</span>
										)}
									</Typography>
								</AccordionDetails>

								<AccordionDetails>
									<Controller
										name="offence_title"
										control={control}
										defaultValue={''}
										rules={{
											required: { value: true, message: 'Required' },
											minLength: { value: 4, message: 'Too Short' }
										}}
										render={({ field: { ref, ...field } }) => (
											<TextField
												{...field}
												inputRef={ref}
												id="offence_title"
												label="অপরাধ*"
												variant="outlined"
												color="secondary"
												fullWidth
												error={!!errors.offence_title}
												//onChange={(e) => setName(e.target.value)}
											/>
										)}
									/>
									<br />
									<Typography className={classes.errorMSG}>
										{errors.offence_title && (
											<span>{errors.offence_title.message}</span>
										)}
									</Typography>
								</AccordionDetails>

								<AccordionDetails>
									<Controller
										name="section_of_act"
										control={control}
										defaultValue={''}
										rules={{
											required: { value: true, message: 'Required' }
										}}
										render={({ field: { ref, ...field } }) => (
											<TextField
												{...field}
												inputRef={ref}
												id="section_of_act"
												label="অভিযুক্ত ধারা*"
												variant="outlined"
												color="secondary"
												fullWidth
												error={!!errors.section_of_act}
												//onChange={(e) => setName(e.target.value)}
											/>
										)}
									/>
									<br />
									<Typography className={classes.errorMSG}>
										{errors.section_of_act && (
											<span>{errors.section_of_act.message}</span>
										)}
									</Typography>
								</AccordionDetails>

								<AccordionDetails>
									<Controller
										name="inquiry_report"
										control={control}
										defaultValue={''}
										rules={{
											required: { value: true, message: 'Required' },
											minLength: { value: 50, message: 'Too short' }
										}}
										render={({ field: { ref, ...field } }) => (
											<TextField
												{...field}
												inputRef={ref}
												id="inquiry_report"
												label="ঘটনার বিবরন*"
												placeholder="তদন্তের রিপোর্ট লিখুন "
												multiline
												variant="outlined"
												color="secondary"
												fullWidth
												rows={20}
												error={!!errors.inquiry_report}
											/>
										)}
									/>
									<br />
									<Typography className={classes.errorMSG}>
										{errors.inquiry_report && (
											<span>{errors.inquiry_report.message}</span>
										)}
									</Typography>
								</AccordionDetails>
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
													key="Charge_Sheet_scan_copy"
													type="file"
													accept="image/*"
													style={{ display: 'none' }}
													id="Charge_Sheet_scan_copy"
													onChange={e => handleCSScanCopyUpload(e)}
												/>
												<label htmlFor="Charge_Sheet_scan_copy">
													<Button
														key="Charge_Sheet_scan_copy-button"
														variant="contained"
														color="primary"
														component="span"
													>
														Charge Sheet Scan Copy Upload*
														চার্জশিটের স্ক্যান কপি আপলোড *
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
											{csScanCopy.length > 0 && (
												<div>
													<ImagePreviewForForms
														images={csScanCopy}
														removeImage={removeCSCopy}
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

export default ChargeSheetForm;
