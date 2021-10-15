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
							label="স্বাক্ষীর নাম*"
							variant="outlined"
							color="secondary"
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
					name={'witness_address_' + index}
					control={control}
					defaultValue={''}
					rules={{
						required: { value: true, message: 'Required' }
					}}
					render={({ field: { ref, ...field } }) => (
						<TextField
							{...field}
							inputRef={ref}
							id={'witness_address_' + index}
							label="স্বাক্ষীর ঠিকানা*"
							placeholder="ঠিকানা লিখুন "
							multiline
							variant="outlined"
							color="secondary"
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
					name={'witness_testimony_' + index}
					control={control}
					defaultValue={''}
					rules={{
						required: { value: true, message: 'Required' }
					}}
					render={({ field: { ref, ...field } }) => (
						<TextField
							{...field}
							inputRef={ref}
							id={'witness_testimony_' + index}
							label="স্বাক্ষ্য*"
							placeholder="স্বাক্ষ্য লিখুন "
							multiline
							variant="outlined"
							color="secondary"
							fullWidth
							rows={8}
							error={!!errors['witness_testimony_' + index]}
						/>
					)}
				/>
				<br />
				<Typography className={classes.errorMSG}>
					{errors['witness_testimony_' + index] && (
						<span>{errors['witness_testimony_' + index].message}</span>
					)}
				</Typography>
			</AccordionDetails>
		</React.Fragment>
	);
};

export default WitnessInfo;
