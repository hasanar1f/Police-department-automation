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

const BibadiInfo = ({
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
					name={'bibadi_name_' + index}
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
							id={'bibadi_name_' + index}
							label='নাম*'
							variant='outlined'
							color='secondary'
							fullWidth
							error={!!errors['bibadi_name_' + index]}
							//onChange={(e) => setName(e.target.value)}
						/>
					)}
				/>
				<br />
				<Typography className={classes.errorMSG}>
					{errors['bibadi_name_' + index] && (
						<span>{errors['bibadi_name_' + index].message}</span>
					)}
				</Typography>
			</AccordionDetails>

			<AccordionDetails>
				<Controller
					name={'bibadi_father_name_' + index}
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
							id={'bibadi_father_name_' + index}
							label='পিতার নাম*'
							variant='outlined'
							color='secondary'
							fullWidth
							error={!!errors['bibadi_father_name_' + index]}
							//onChange={(e) => setName(e.target.value)}
						/>
					)}
				/>
				<br />
				<Typography className={classes.errorMSG}>
					{errors['bibadi_father_name_' + index] && (
						<span>{errors['bibadi_father_name_' + index].message}</span>
					)}
				</Typography>
			</AccordionDetails>

			<AccordionDetails>
				<Controller
					name={'bibadi_address_' + index}
					control={control}
					defaultValue={''}
					rules={{
						required: { value: true, message: 'Required' }
					}}
					render={({ field: { ref, ...field } }) => (
						<TextField
							{...field}
							inputRef={ref}
							id={'bibadi_address_' + index}
							label='ঠিকানা*'
							placeholder='ঠিকানা লিখুন '
							multiline
							variant='outlined'
							color='secondary'
							fullWidth
							rows={4}
							error={!!errors['bibadi_address_' + index]}
						/>
					)}
				/>
				<br />
				<Typography className={classes.errorMSG}>
					{errors['bibadi_address_' + index] && (
						<span>{errors['bibadi_address_' + index].message}</span>
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
					name={'bibadi_mobile_no_' + index}
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
							id={'bibadi_mobile_no_' + index}
							label='ফোন নাম্বার'
							variant='outlined'
							color='secondary'
							fullWidth
							error={!!errors['bibadi_mobile_no_' + index]}
							//onChange={(e) => setName(e.target.value)}
						/>
					)}
				/>
				<br />
				<Typography className={classes.errorMSG}>
					{errors['bibadi_mobile_no_' + index] && (
						<span>{errors['bibadi_mobile_no_' + index].message}</span>
					)}
				</Typography>
			</AccordionDetails>
		</React.Fragment>
	);
};

export default BibadiInfo;
