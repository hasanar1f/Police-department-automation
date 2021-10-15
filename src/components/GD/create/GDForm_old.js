import React, { useEffect, useRef, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Autocomplete from '@material-ui/lab/Autocomplete';
import create from '../../../axios/GD/create';
import { makeStyles } from '@material-ui/core/styles';
import '../gd.css';
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

	button: {}

	// imagePreview: {
	//     width: '24vh',
	//     height: '18vh',
	//     margin: '10px',
	//     border:'10px',
	//     borderColor:'black',
	//     borderRadius: '10px',
	//     boxShadow:'0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.50)',
	// },

}));

const GdForm = () => {

	const classes = useStyles();
	const isFirstRender = useRef(true);
	const [name, setName] = useState('');
	const [reportingFor, setReportingFor] = useState('');
	const [documents, setDocuments] = useState([]);
	const [images, setImages] = useState([]);
	let imgLinks = [], docLinks = [];
	// const [nid,setNid] = useState('');
	// const [phone,setPhone] = useState('');
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const options = ['Murder', 'Woman & Child', 'Riot', 'Dacoity', 'Lost item', 'Other'];

	const [value, setValue] = useState('Select a Category ');
	const [category, setCategory] = useState('');
	const [open, setOpen] = useState(false);

	const [response, setResponse] = useState({
		success: false,
		message: 'Could not create gd'
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

	const handleReset = () => {
		Array.from(document.querySelectorAll('*')).forEach(
			input => (input.value = '')
		);

	};

	const uploadImage = (imageFormData, callback) => {
		upload('/upload/images', imageFormData, {
			Authorization: 'Officer ' + localStorage.getItem('token'),
			'Content-type': 'multipart/form-data'
		}, {
			directory: 'gd/photos'
		}, function(res, err) {
			imgLinks = res;
		}, callback);
	};

	const uploadDocument = (docFormData, callback) => {
		upload('/upload/documents', docFormData, {
			Authorization: 'Officer ' + localStorage.getItem('token'),
			'Content-type': 'multipart/form-data'
		}, {
			directory: 'gd/documents'
		}, function(res, err) {
			docLinks = res;
		}, callback);
	};

	const gdSubmit = (callback) => {
		create({
			topic: category,
			title,
			description,
			reportedBy: name,
			reportedFor: reportingFor,
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
		setTitle('');
		setDescription('');
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
		imageFormData.append('directory', 'gd/photos');

		documents.forEach(document => {
			docFormData.append('documents', document);
		});
		imageFormData.append('directory', 'gd/documents');

		uploadImage(imageFormData, () => {
			uploadDocument(docFormData, () => {
				gdSubmit((res, err) => {
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
								label='Reporting for'
								variant='outlined'
								color='secondary'
								fullWidth
								onChange={e => setReportingFor(e.target.value)}
							/>
						</div>

						<div className='items'>
							<TextField
								id='title'
								label='Title'
								variant='outlined'
								color='secondary'
								fullWidth
								multiline
								onChange={e => setTitle(e.target.value)}
							/>
							<br />
						</div>

						<div className='items'>
							<br />
							<TextField
								id='description'
								label='Descriptions'
								variant='outlined'
								color='secondary'
								fullWidth
								multiline
								rows='8'
								onChange={e => setDescription(e.target.value)}
							/>
							<br /> <br />
						</div>

						<div className='items'>
							{/*image preview here. style this*/}

							<input
								accept='image/*'
								key='image-upload'
								className={classes.input}
								style={{ display: 'none' }}
								id='image-upload'
								multiple
								type='file'
								onChange={e => setImages([...images, ...e.target.files])}
							/>
							<label htmlFor='image-upload'>
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
							{
								images.length === 0 && <br />
							}
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
									ফাইল আপলোড করুন
								</Button>
							</label>
							{
								documents.length === 0 && <br />
							}
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
								label='Submit'
								variant='contained'
								variant='outlined'
								color='primary'
								size='large'
								onClick={() => onFormSubmit()}
							> জমা দিন</Button>
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

			<Alert
				open={open}
				success={response.success}
				message={response.message}
				handleClose={handleClose}
			/>

		</div>
	);
};

export default GdForm;
