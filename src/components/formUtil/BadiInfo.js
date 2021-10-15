import React from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
// import { useForm, Controller } from "react-hook-form";
import Typography from '@material-ui/core/Typography';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import DateFnsUtils from '@date-io/date-fns';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';

const useStyles = makeStyles(theme => ({
	root: {
		'& .MuiTextField-root': {
			margin: theme.spacing(1),
			width: '25ch'
		}
	},

	input: {},

	button: {},

	heading: {
		fontSize: theme.typography.pxToRem(20),
		fontWeight: theme.typography.fontWeightRegular
	},

	errorMSG: {
		fontSize: theme.typography.pxToRem(18),
		fontWeight: theme.typography.fontWeightRegular,
		color: 'red',
		paddingTop: '0.5rem',
		paddingLeft: '0.3rem'
	},

	paper: {}
}));

const BadiInfo = ({
							handleSubmit,
							control,
							reset,
							errors,
							Controller,
							index
						}) => {
	const classes = useStyles();

	const [selectedDate, setSelectedDate] = React.useState(
		new Date('2014-08-18T21:11:54')
	);

	const [nidScanCopy, setNIDScanCopy] = React.useState([]);

	const handleDateChange = date => {
		setSelectedDate(date);
	};

	//   console.log(errors);
	const handleNIDScanCopyUpload = e => {
		setNIDScanCopy([...e.target.files]);
		// const nidError = document.getElementById('nid-scan-copy-error');
		// nidError.classList = classes.hidden;
	};

	const removeNIDCopy = image => {
		const new_nid_copy = nidScanCopy.filter(item => item !== image);
		setNIDScanCopy(new_nid_copy);
	};

	return (
		<React.Fragment>
			<AccordionDetails>
				<Controller
					name={'badi_name_' + index}
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
							id={'badi_name_' + index}
							label='নাম*'
							variant='outlined'
							color='secondary'
							fullWidth
							error={!!errors['badi_name_' + index]}
							//onChange={(e) => setName(e.target.value)}
						/>
					)}
				/>
				<br />
				<Typography className={classes.errorMSG}>
					{errors['badi_name_' + index] && (
						<span>{errors['badi_name_' + index].message}</span>
					)}
				</Typography>
			</AccordionDetails>
			<AccordionDetails>
				<Controller
					name={'badi_father_name_' + index}
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
							id={'badi_father_name_' + index}
							label='পিতার নাম*'
							variant='outlined'
							color='secondary'
							fullWidth
							error={!!errors['badi_father_name_' + index]}
							//onChange={(e) => setName(e.target.value)}
						/>
					)}
				/>
				<br />
				<Typography className={classes.errorMSG}>
					{errors['badi_father_name_' + index] && (
						<span>{errors['badi_father_name_' + index].message}</span>
					)}
				</Typography>
			</AccordionDetails>
			<AccordionDetails>
				<Controller
					name={'badi_address_' + index}
					control={control}
					defaultValue={''}
					rules={{}}
					render={({ field: { ref, ...field } }) => (
						<TextField
							{...field}
							inputRef={ref}
							id={'badi_address_' + index}
							label='ঠিকানা'
							placeholder='ঠিকানা লিখুন '
							multiline
							variant='outlined'
							color='secondary'
							fullWidth
							rows={4}
							error={!!errors['badi_address_' + index]}
						/>
					)}
				/>
				<br />
				<Typography className={classes.errorMSG}>
					{errors['badi_address_' + index] && (
						<span>{errors['badi_address_' + index].message}</span>
					)}
				</Typography>
			</AccordionDetails>
			<AccordionDetails>
				<Controller
					name={'badi_nid_' + index}
					control={control}
					defaultValue={''}
					rules={{
						required: { value: true, message: 'Required' },
						pattern: /[0-9]{10}/,
						minLength: { value: 10, message: 'Too Short' }, //TODO: need to fix according to original
						maxLength: { value: 20, message: 'Too Long' } //TODO: need to fix according to original
					}}
					render={({ field: { ref, ...field } }) => (
						<TextField
							{...field}
							inputRef={ref}
							id={'badi_nid_' + index}
							label='জাতীয় পরিচয়পত্র নাম্বার *'
							variant='outlined'
							color='secondary'
							fullWidth
							error={!!errors['badi_nid_' + index]}
							//onChange={(e) => setName(e.target.value)}
						/>
					)}
				/>
				<br />
				<Typography className={classes.errorMSG}>
					{errors['badi_nid_' + index] && (
						<span>{errors['badi_nid_' + index].message}</span>
					)}
				</Typography>
			</AccordionDetails>
			<AccordionDetails>
				<Typography
					className={classes.heading}
					style={{ paddingTop: '.85rem', paddingRight: '0.3rem' }}
				>
					<span>+880</span>
				</Typography>
				<Controller
					name={'badi_mobile_no_' + index}
					control={control}
					defaultValue={''}
					rules={{
						required: { value: true, message: 'Required' },
						maxLength: { value: 10, message: 'Invalid' },
						minLength: { value: 10, message: 'Invalid' },
						pattern: { value: /1[3-9][0-9]{8}/, message: 'Invalid' }
					}}
					render={({ field: { ref, ...field } }) => (
						<TextField
							{...field}
							inputRef={ref}
							id={'badi_mobile_no_' + index}
							label='ফোন নাম্বার *'
							variant='outlined'
							color='secondary'
							fullWidth
							error={!!errors['badi_mobile_no_' + index]}
							//onChange={(e) => setName(e.target.value)}
						/>
					)}
				/>
				<br />
				<Typography className={classes.errorMSG}>
					{errors['badi_mobile_no_' + index] && (
						<span>{errors['badi_mobile_no_' + index].message}</span>
					)}
				</Typography>
			</AccordionDetails>
			<AccordionDetails>
				<Typography
					className={classes.heading}
					style={{ paddingTop: '2rem', paddingRight: '1rem' }}
				>
					জন্ম তারিখ*
				</Typography>
				<MuiPickersUtilsProvider utils={DateFnsUtils}>
					<Controller
						name={'badi_dob_' + index}
						control={control}
						rules={{
							required: { value: true, message: 'Required' }
						}}
						render={({ field: { ref, ...rest } }) => (
							<KeyboardDatePicker
								inputRef={ref}
								margin='normal'
								id={'badi_dob_' + index}
								label='জন্ম তারিখ'
								format='dd/MM/yyyy'
								KeyboardButtonProps={{
									'aria-label': 'change date'
								}}
								error={!!errors['badi_dob_' + index]}
								{...rest}
							/>
						)}
					/>
				</MuiPickersUtilsProvider>
				<Typography className={classes.errorMSG}>
					{errors['badi_dob_' + index] && (
						<span>{errors['badi_dob_' + index].message}</span>
					)}
				</Typography>
			</AccordionDetails>
			<br />
			{/* <AccordionDetails>
				<div>
					<input
						key="nid_scan_copy"
						type="file"
						accept="image/*"
						style={{ display: 'none' }}
						id="nid_scan_copy"
						onChange={e => handleNIDScanCopyUpload(e)}
					/>
					<label htmlFor="nid_scan_copy">
						<Button
							key="nid_scan_copy-button"
							variant="contained"
							color="primary"
							component="span"
						>
							NID SCAN COPY UPLOAD
						</Button>
					</label>
				</div>
			</AccordionDetails>

			<AccordionDetails>
				{nidScanCopy.length > 0 && (
					<div>
						<ImagePreviewForForms
							images={nidScanCopy}
							removeImage={removeNIDCopy}
						/>
					</div>
				)}
			</AccordionDetails> */}
		</React.Fragment>
	);
};

export default BadiInfo;
