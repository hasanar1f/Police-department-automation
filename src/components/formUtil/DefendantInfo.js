import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
// import { useForm, Controller } from "react-hook-form";
import Select from 'react-select';
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

const DefendantInfo = ({
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
					name={'defendant_name_' + index}
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
							id={'defendant_name_' + index}
							label='নাম*'
							variant='outlined'
							color='secondary'
							fullWidth
							error={!!errors['defendant_name_' + index]}
							//onChange={(e) => setName(e.target.value)}
						/>
					)}
				/>
				<br />
				<Typography className={classes.errorMSG}>
					{errors['defendant_name_' + index] && (
						<span>{errors['defendant_name_' + index].message}</span>
					)}
				</Typography>
			</AccordionDetails>

			<AccordionDetails>
				<Controller
					name={'defendant_address_' + index}
					control={control}
					defaultValue={''}
					rules={{
						minLength: { value: 4, message: 'Too Short' }
					}}
					render={({ field: { ref, ...field } }) => (
						<TextField
							{...field}
							inputRef={ref}
							id={'defendant_address_' + index}
							label='ঠিকানা*'
							placeholder='ঠিকানা লিখুন '
							multiline
							variant='outlined'
							color='secondary'
							fullWidth
							rows={4}
							error={!!errors['defendant_address_' + index]}
						/>
					)}
				/>
				<br />
				<Typography className={classes.errorMSG}>
					{errors['defendant_address_' + index] && (
						<span>{errors['defendant_address_' + index].message}</span>
					)}
				</Typography>
			</AccordionDetails>
			<AccordionDetails>
				<Controller
					name={'arrest_state_' + index}
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
							onClick={handleArrestStateChange}
							className={classes.select}
							id={'arrest_state_' + index}
						>
							<Select
								{...field}
								inputRef={ref}
								placeholder='Select Arrest State'
								id={'arrest_state_' + index}
								options={DefendantState}
								getOptionLabel={x => x.label}
								getOptionValue={x => x.value}
								error={!!errors['arrest_state_' + index]}
							/>
						</div>
					)}
				/>
				<Typography className={classes.errorMSG}>
					{errors['arrest_state_' + index] && (
						<span>{errors['arrest_state_' + index].message}</span>
					)}
				</Typography>
			</AccordionDetails>
			<AccordionDetails>
				<div className={classes.hide} id={'after_arrest_box_' + index}>
					<Controller
						name={'after_arrest_state_' + index}
						control={control}
						defaultValue={''}
						rules={{}}
						render={({ field: { ref, ...field } }) => (
							<div
								onClick={handleAfterArrestStateChange}
								className={classes.select}
								id={'after_arrest_state_' + index}
							>
								<Select
									{...field}
									inputRef={ref}
									placeholder='Select Defendant State'
									id={'after_arrest_state_' + index}
									options={afterArrestState}
									getOptionLabel={x => x.label}
									getOptionValue={x => x.value}
									error={!!errors['after_arrest_state_' + index]}
								/>
							</div>
						)}
					/>
				</div>
				<Typography className={classes.errorMSG}>
					{errors['after_arrest_state_' + index] && (
						<span>{errors['after_arrest_state_' + index].message}</span>
					)}
				</Typography>
			</AccordionDetails>

			<AccordionDetails>
				<div className={classes.hide} id={'supervisor_' + index}>
					<Controller
						name={'supervisor_name_' + index}
						control={control}
						defaultValue={''}
						render={({ field: { ref, ...field } }) => (
							<TextField
								{...field}
								inputRef={ref}
								id={'supervisor_name_' + index}
								placeholder='কাহার তত্ত্বাবধানে রয়েছে*'
								variant='outlined'
								color='secondary'
								fullWidth
								error={!!errors['supervisor_name_' + index]}
								//onChange={(e) => setName(e.target.value)}
							/>
						)}
					/>
				</div>
				<br />
				<Typography className={classes.errorMSG}>
					{errors['supervisor_name_' + index] && (
						<span>{errors['supervisor_name_' + index].message}</span>
					)}
				</Typography>
			</AccordionDetails>
		</React.Fragment>
	);
};

export default DefendantInfo;
