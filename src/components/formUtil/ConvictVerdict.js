import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
// import { useForm, Controller } from "react-hook-form";
import Typography from '@material-ui/core/Typography';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import DefendantState from '../../utils/DefendantState';

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
	select: {
		width: '100%',
		fontWeight: 'bolder'
	},

	paper: {},
	hide: {
		display: 'none'
	},

	show: {
		display: 'block'
	}
}));

const ConvictVerdict = ({
									handleSubmit,
									control,
									reset,
									errors,
									Controller,
									getValues,
									setValue,
									index
								}) => {
	const classes = useStyles();

	const [selectedDate, setSelectedDate] = React.useState(
		new Date('2014-08-18T21:11:54')
	);

	const [afterArrestState, setAfterArrestState] = useState([]);

	const handleDateChange = date => {
		setSelectedDate(date);
	};
	const handleArrestStateChange = obj => {
		const s = getValues('arrest_state_' + index);
		//console.log(s);

		if (s !== undefined) {
			const aas = document.getElementById('after_arrest_box_' + index);
			if (s.value === 'arrested') {
				aas.classList.remove(classes.hide);
				aas.classList.add(classes.show);
				aas.classList.add(classes.select);
			} else {
				aas.classList.remove(classes.show);
				aas.classList.add(classes.hide);
			}
			DefendantState.map(item => {
				// console.log(item);
				if (item.value === s.value) {
					const ss = item.states;
					console.log(ss);
					setAfterArrestState(ss);
					setValue('after_arrest_state_' + index, '');
				}
			});
		}

		const sup = document.getElementById('supervisor_' + index);
		console.log(sup);
		sup.classList.remove(classes.show);
		sup.classList.add(classes.hide);
	};

	const handleAfterArrestStateChange = obj => {
		const s = getValues('after_arrest_state_' + index);
		const sup = document.getElementById('supervisor_' + index);
		console.log(sup);
		if (s.value === 'under_supervision') {
			sup.classList.remove(classes.hide);
			sup.classList.add(classes.show);
		} else {
			sup.classList.remove(classes.show);
			sup.classList.add(classes.hide);
		}
	};

	//   console.log(errors);

	return (
		<React.Fragment>
			<AccordionDetails>
				<Controller
					name={'convict_name_' + index}
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
							id={'convict_name_' + index}
							label='অভিযুক্তের নাম*'
							variant='outlined'
							color='secondary'
							fullWidth
							error={!!errors['convict_name_' + index]}
							//onChange={(e) => setName(e.target.value)}
						/>
					)}
				/>
				<br />
				<Typography className={classes.errorMSG}>
					{errors['convict_name_' + index] && (
						<span>{errors['convict_name_' + index].message}</span>
					)}
				</Typography>
			</AccordionDetails>

			<AccordionDetails>
				<Controller
					name={'accusation_' + index}
					control={control}
					defaultValue={''}
					rules={{
						minLength: { value: 10, message: 'Too Short' }
					}}
					render={({ field: { ref, ...field } }) => (
						<TextField
							{...field}
							inputRef={ref}
							id={'accusation_' + index}
							label='আনত অভিযোগ*'
							placeholder='অভিযুক্তের বিপক্ষে আনত অভিযোগ লিখুন '
							multiline
							variant='outlined'
							color='secondary'
							fullWidth
							rows={4}
							error={!!errors['accusation_' + index]}
						/>
					)}
				/>
				<br />
				<Typography className={classes.errorMSG}>
					{errors['accusation_' + index] && (
						<span>{errors['accusation_' + index].message}</span>
					)}
				</Typography>
			</AccordionDetails>

			<AccordionDetails>
				<Controller
					name={'investigation_result_' + index}
					control={control}
					defaultValue={''}
					rules={{
						minLength: { value: 10, message: 'Too Short' }
					}}
					render={({ field: { ref, ...field } }) => (
						<TextField
							{...field}
							inputRef={ref}
							id={'investigation_result_' + index}
							label='অভিযোগ তদন্তের ফলাফল*'
							placeholder='আনত অভিযোগ তদন্তের ফলাফল লিখুন '
							multiline
							variant='outlined'
							color='secondary'
							fullWidth
							rows={4}
							error={!!errors['investigation_result_' + index]}
						/>
					)}
				/>
				<br />
				<Typography className={classes.errorMSG}>
					{errors['investigation_result_' + index] && (
						<span>{errors['investigation_result_' + index].message}</span>
					)}
				</Typography>
			</AccordionDetails>

			<AccordionDetails>
				<Controller
					name={'verdict_' + index}
					control={control}
					defaultValue={''}
					render={({ field: { ref, ...field } }) => (
						<TextField
							{...field}
							inputRef={ref}
							id={'verdict_' + index}
							placeholder='রায়*'
							variant='outlined'
							color='secondary'
							fullWidth
							error={!!errors['verdict_' + index]}
							//onChange={(e) => setName(e.target.value)}
						/>
					)}
				/>
				<br />
				<Typography className={classes.errorMSG}>
					{errors['verdict_' + index] && (
						<span>{errors['verdict_' + index].message}</span>
					)}
				</Typography>
			</AccordionDetails>
		</React.Fragment>
	);
};

export default ConvictVerdict;
