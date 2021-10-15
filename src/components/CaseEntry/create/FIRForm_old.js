import React, { useEffect, useRef, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Autocomplete from '@material-ui/lab/Autocomplete';
import create from '../../../axios/FIR/create';
import { makeStyles } from '@material-ui/core/styles';
import { KeyboardDateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import ImagePreviewForForms from '../../basic/ImagePreviewforForms';
import DocumentPreviewforForms from '../../basic/DocumentPreviewforForms';
import upload from '../../../axios/upload/upload';
import Alert from '../../basic/Alert';

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
	}

}));

const FirForm = () => {

	const classes = useStyles();
	const isFirstRender = useRef(true);
	const [name, setName] = useState('');
	const [reportingFor, setReportingFor] = useState('');
	const [accused, setAccused] = useState(null);
	const [documents, setDocuments] = useState([]);
	const [images, setImages] = useState([]);
	const [incidentDate, setIncidentDate] = useState(new Date());
	const [location, setLocation] = useState('Dhaka');
	let imgLinks = [], docLinks = [];
	// const [nid,setNid] = useState('');
	// const [phone,setPhone] = useState('');
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const options = ['Murder', 'Woman & Child', 'Riot', 'Dacoity', 'Lost item', 'Other'];

	const [value, setValue] = React.useState('Select a Category ');
	const [category, setCategory] = React.useState('');
	const [open, setOpen] = useState(false);

	const [response, setResponse] = useState({
		success: false,
		message: 'Could not create fir'
	});

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false;
		} else {
			handleOpen();
			clearAll();
		}
	}, [response]);

	const uploadImage = (imageFormData, callback) => {
		upload('/upload/images', imageFormData, {
			Authorization: 'Officer ' + localStorage.getItem('token'),
			'Content-type': 'multipart/form-data'
		}, {
			directory: 'fir/photos'
		}, function(res, err) {
			imgLinks = res;
		}, callback);
	};

	const uploadDocument = (docFormData, callback) => {
		upload('/upload/documents', docFormData, {
			Authorization: 'Officer ' + localStorage.getItem('token'),
			'Content-type': 'multipart/form-data'
		}, {
			directory: 'fir/documents'
		}, function(res, err) {
			docLinks = res;
		}, callback);
	};

	const firSubmit = (callback) => {
		create({
			topic: category,
			title,
			description,
			reportedBy: name,
			reportedFor: reportingFor,
			reportedAgainst: accused,
			incidentDate,
			areaOfIncident: location,
			documents: docLinks,
			images: imgLinks
		}, {
			Authorization: 'Officer ' + localStorage.getItem('token'),
			'content-type': 'application/json'
		}, callback);
	};

	const clearAll = () => {
		Array.from(document.querySelectorAll('*')).forEach(
			input => (input.value = '')
		);
		imgLinks = [];
		docLinks = [];
		setName('');
		setReportingFor('');
		setAccused('');
		setIncidentDate(new Date());
		setTitle('');
		setDescription('');
		setLocation('');
		setImages([]);
		setDocuments([]);
		setValue('Select a Category ');
		setCategory('');
	};

	const onFormSubmit = () => {
		let imageFormData = new FormData();
		let docFormData = new FormData();

		images.forEach(image => {
			imageFormData.append('images', image);
		});
		imageFormData.append('directory', 'fir/photos');

		documents.forEach(document => {
			docFormData.append('documents', document);
		});
		imageFormData.append('directory', 'fir/documents');

		uploadImage(imageFormData, () => {
			uploadDocument(docFormData, () => {
				firSubmit((res, err) => {
					if (res.status === 200) {
						setResponse({
							success: true,
							message: res.data.message
						});
					}
				});
			});
		});
	};

	const removeImage = image => {
		const new_images = images.filter(item => item !== image);
		setImages(new_images);
	};

	const removeDoc = doc => {
		const new_docs = documents.filter(item => item !== doc);
		setDocuments(new_docs);
	};

	return (
		<div>
			<div>
				<Grid container justify='center' direction='column' spacing={10}>
					<Grid item container className='main'>
						<div className='items'>
							<Autocomplete
								value={value}
								onChange={(event, newValue) => {
									setValue(newValue);
								}}
								category={category}
								onInputChange={(event, newInputValue) => {
									setCategory(newInputValue);
								}}

								id='category'
								variant='outlined'
								color='secondary'
								options={options}
								style={{ width: '100%' }}
								renderInput={(params) => <TextField {...params} label='Category'
																				placeholder='Choose from list' />}
							/>
						</div>

						<div className='items'>
							<TextField
								id='name'
								label='নাম'
								variant='outlined'
								color='secondary'
								fullWidth
								onChange={e => setName(e.target.value)}
							/>
						</div>

						<div className='items'>
							<TextField
								id='reportingFor'
								label='যার জন্য রিপোর্ট'
								variant='outlined'
								color='secondary'
								fullWidth
								onChange={e => setReportingFor(e.target.value)}
							/>
						</div>

						<div className='items'>
							<TextField
								id='accused'
								label='সন্দেহভাজনের নাম'
								variant='outlined'
								color='secondary'
								fullWidth
								onChange={e => setAccused(e.target.value)}
							/>
						</div>

						<div className='items'>
							<TextField
								id='title'
								label='শিরোনাম'
								variant='outlined'
								color='secondary'
								fullWidth
								multiline
								rows='3'
								onChange={e => setTitle(e.target.value)}
							/>
						</div>

						<div className='items'>
							<TextField
								id='description'
								label='বর্ণনা'
								variant='outlined'
								color='secondary'
								fullWidth
								multiline
								rows='8'
								onChange={e => setDescription(e.target.value)}
							/>
						</div>

						<div className='items'>
							<TextField
								id='location'
								label='স্থান'
								variant='outlined'
								color='secondary'
								fullWidth
								onChange={e => setLocation(e.target.value)}
							/>
						</div>

						<div className='items'>
							<MuiPickersUtilsProvider utils={DateFnsUtils}>
								<KeyboardDateTimePicker
									variant='inline'
									ampm={false}
									label='তারিখ ও সময়'
									value={incidentDate}
									onChange={setIncidentDate}
									onError={console.log}
									disablePast
									format='yyyy/MM/dd HH:mm'
								/>
							</MuiPickersUtilsProvider>
							<br />
						</div>

						<div className='items'>
							{/*image preview here. style this*/}
							{/*{*/}
							{/*    images.map(image => {*/}
							{/*        return (*/}
							{/*            <div>*/}
							{/*                <img*/}
							{/*                    key={URL.createObjectURL(image)}*/}
							{/*                    className={classes.imagePreview}*/}
							{/*                    src={URL.createObjectURL(image)}*/}
							{/*                />*/}
							{/*            </div>);*/}
							{/*    })*/}
							{/*}*/}


							<input
								accept='image/*'
								key='image-upload'
								className={classes.input}
								style={{ display: 'none' }}
								id='raised-button-file'
								multiple
								type='file'
								onChange={e => setImages([...images, ...e.target.files])}
							/>
							<label htmlFor='raised-button-file'>
								<Button
									key='image-upload-button'
									variant='outlined'
									color='primary'
									component='span'
									className={classes.button}
								>
									আপলোড
								</Button>
							</label>
							<br />
						</div>

						{
							images.length > 0 &&
							<div className={'items'}>
								<ImagePreviewForForms
									images={images}
									removeImage={removeImage}
								/>
							</div>
						}

						<div className='items'>
							{/*show a list of documents uploaded. no need for preview*/}

							<input
								key='file-upload'
								className={classes.input}
								style={{ display: 'none' }}
								id='pdf-upload'
								multiple
								type='file'
								accept='application/pdf'
								onChange={e => setDocuments([...documents, ...e.target.files])}
							/>
							<label htmlFor='pdf-upload'>
								<Button
									key='file-upload-button'
									variant='outlined'
									color='primary'
									component='span'
									className={classes.button}
								>
									ফাইল আপলোড
								</Button>
							</label>
							<br />
						</div>

						{
							documents.length > 0 &&
							<div className={'items'}>
								<DocumentPreviewforForms
									documents={documents}
									removeDoc={removeDoc}
								/>
							</div>
						}

						<div className='items'>
							<Button
								label='জমা দিন'
								variant='contained'
								variant='outlined'
								color='primary'
								size='large'
								onClick={() => onFormSubmit()}
							> জমা দিন </Button>
						</div>
					</Grid>
				</Grid>
			</div>

			{/*<TextField*/}
			{/*       id="nid"*/}
			{/*       label="NID"*/}
			{/*       fullWidth*/}
			{/*       placeholder="i.e. 440013892"*/}

			{/*       onChange={e=>setNid(e.target.value)}*/}
			{/*/>*/}

			{/*<TextField*/}
			{/*       id="phone"*/}
			{/*       label="Phone"*/}
			{/*       fullWidth*/}
			{/*       placeholder="i.e. 01521402031"*/}
			{/*       onChange={e=>setPhone(e.target.value)}*/}
			{/*/>*/}
			<br />
			<br />
			<br />

			<Alert
				open={open}
				success={response.success}
				message={response.message}
				handleClose={handleClose}
			/>

		</div>

	);
};

export default FirForm;
