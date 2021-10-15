import React from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
// import { useForm, Controller } from "react-hook-form";
import Typography from '@material-ui/core/Typography';
import AccordionDetails from '@material-ui/core/AccordionDetails';

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

const WitnessInfo = ({
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

	const handleDateChange = date => {
		setSelectedDate(date);
	};

	//   console.log(errors);

	return (
		<React.Fragment>
			<AccordionDetails>
				<Controller
					name={'witness_name_' + index}
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
							id={'witness_name_' + index}
							label='স্বাক্ষীর নাম*'
							variant='outlined'
							color='secondary'
							fullWidth
							error={!!errors['witness_name_' + index]}
							//onChange={(e) => setName(e.target.value)}
						/>
					)}
				/>
				<br />
				<Typography className={classes.errorMSG}>
					{errors['witness_name_' + index] && (
						<span>{errors['witness_name_' + index].message}</span>
					)}
				</Typography>
			</AccordionDetails>

			<AccordionDetails>
				<Controller
					name={'witness_father_name_' + index}
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
							id={'witness_father_name_' + index}
							label='স্বাক্ষীর পিতার নাম*'
							variant='outlined'
							color='secondary'
							fullWidth
							error={!!errors['witness_father_name_' + index]}
							//onChange={(e) => setName(e.target.value)}
						/>
					)}
				/>
				<br />
				<Typography className={classes.errorMSG}>
					{errors['witness_father_name_' + index] && (
						<span>{errors['witness_father_name_' + index].message}</span>
					)}
				</Typography>
			</AccordionDetails>

			<AccordionDetails>
				<Controller
					name={'witness_address_' + index}
					control={control}
					defaultValue={''}
					rules={{}}
					render={({ field: { ref, ...field } }) => (
						<TextField
							{...field}
							inputRef={ref}
							id={'witness_address_' + index}
							label='স্বাক্ষীর ঠিকানা'
							placeholder='ঠিকানা লিখুন '
							multiline
							variant='outlined'
							color='secondary'
							fullWidth
							rows={4}
							error={!!errors['witness_address_' + index]}
						/>
					)}
				/>
				<br />
				<Typography className={classes.errorMSG}>
					{errors['witness_address_' + index] && (
						<span>{errors['witness_address_' + index].message}</span>
					)}
				</Typography>
			</AccordionDetails>

			<AccordionDetails>
				<Controller
					name={'witness_nid_' + index}
					control={control}
					defaultValue={''}
					rules={{
						pattern: /[0-9]{10}/,
						minLength: { value: 10, message: 'Too Short' }, //TODO: need to fix according to original
						maxLength: { value: 20, message: 'Too Long' } //TODO: need to fix according to original
					}}
					render={({ field: { ref, ...field } }) => (
						<TextField
							{...field}
							inputRef={ref}
							id={'witness_nid_' + index}
							label='স্বাক্ষীর জাতীয় পরিচয়পত্র নাম্বার'
							variant='outlined'
							color='secondary'
							fullWidth
							error={!!errors['witness_nid_' + index]}
							//onChange={(e) => setName(e.target.value)}
						/>
					)}
				/>
				<br />
				<Typography className={classes.errorMSG}>
					{errors['witness_nid_' + index] && (
						<span>{errors['witness_nid_' + index].message}</span>
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
					name={'witness_mobile_no_' + index}
					control={control}
					defaultValue={''}
					rules={{
						maxLength: { value: 10, message: 'Invalid' },
						minLength: { value: 10, message: 'Invalid' },
						pattern: { value: /1[3-9][0-9]{8}/, message: 'Invalid' }
					}}
					render={({ field: { ref, ...field } }) => (
						<TextField
							{...field}
							inputRef={ref}
							id={'witness_mobile_no_' + index}
							label='স্বাক্ষীর ফোন নাম্বার *'
							variant='outlined'
							color='secondary'
							fullWidth
							error={!!errors['witness_mobile_no_' + index]}
							//onChange={(e) => setName(e.target.value)}
						/>
					)}
				/>
				<br />
				<Typography className={classes.errorMSG}>
					{errors['witness_mobile_no_' + index] && (
						<span>{errors['witness_mobile_no_' + index].message}</span>
					)}
				</Typography>
			</AccordionDetails>

			<AccordionDetails>
				<Controller
					name={'testimony_' + index}
					control={control}
					defaultValue={''}
					rules={{
						required: { value: true, message: 'Required' },
						minLength: { value: 40, message: 'Too Short' }
					}}
					render={({ field: { ref, ...field } }) => (
						<TextField
							{...field}
							inputRef={ref}
							id={'testimony_' + index}
							label='সাক্ষ্য*'
							placeholder='সাক্ষ্য লিখুন '
							multiline
							variant='outlined'
							color='secondary'
							fullWidth
							rows={8}
							error={!!errors['testimony_' + index]}
						/>
					)}
				/>
				<br />
				<Typography className={classes.errorMSG}>
					{errors['testimony_' + index] && (
						<span>{errors['testimony_' + index].message}</span>
					)}
				</Typography>
			</AccordionDetails>
		</React.Fragment>
	);
};

export default WitnessInfo;
