import React from 'react';
import Select from 'react-select';
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

const SeizedGoodInfo = ({
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
					name={'goods_type_' + index}
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
							id={'goods_type_' + index}
							label='মালামালের ধরন*'
							variant='outlined'
							color='secondary'
							fullWidth
							error={!!errors['goods_type_' + index]}
							//onChange={(e) => setName(e.target.value)}
						/>
					)}
				/>
				<br />
				<Typography className={classes.errorMSG}>
					{errors['goods_type_' + index] && (
						<span>{errors['goods_type_' + index].message}</span>
					)}
				</Typography>
			</AccordionDetails>

			<AccordionDetails>
				<Controller
					name={'goods_quantity_' + index}
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
							id={'goods_quantity_' + index}
							label='পরিমান*'
							variant='outlined'
							color='secondary'
							fullWidth
							error={!!errors['goods_quantity_' + index]}
							//onChange={(e) => setName(e.target.value)}
						/>
					)}
				/>
				<br />
				<Typography className={classes.errorMSG}>
					{errors['goods_quantity_' + index] && (
						<span>{errors['goods_quantity_' + index].message}</span>
					)}
				</Typography>
			</AccordionDetails>

			<AccordionDetails>
				<Typography
					className={classes.heading}
					style={{ paddingTop: '2rem', paddingRight: '1rem' }}
				>
					উদ্ধারের তারিখ*
				</Typography>
				<MuiPickersUtilsProvider utils={DateFnsUtils}>
					<Controller
						name={'goods_date_' + index}
						control={control}
						rules={{
							required: { value: true, message: 'Required' }
						}}
						render={({ field: { ref, ...rest } }) => (
							<KeyboardDatePicker
								inputRef={ref}
								margin='normal'
								id={'goods_date_' + index}
								label='উদ্ধারের তারিখ'
								format='dd/MM/yyyy'
								KeyboardButtonProps={{
									'aria-label': 'change date'
								}}
								error={!!errors['goods_date_' + index]}
								{...rest}
							/>
						)}
					/>
				</MuiPickersUtilsProvider>
				<Typography className={classes.errorMSG}>
					{errors['goods_date_' + index] && (
						<span>{errors['goods_date_' + index].message}</span>
					)}
				</Typography>
			</AccordionDetails>
			<br />

			<AccordionDetails>
				<Controller
					name={'goods_where_' + index}
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
							id={'goods_where_' + index}
							label='উদ্ধারের স্থান*'
							variant='outlined'
							color='secondary'
							fullWidth
							error={!!errors['goods_where_' + index]}
							//onChange={(e) => setName(e.target.value)}
						/>
					)}
				/>
				<br />
				<Typography className={classes.errorMSG}>
					{errors['goods_where_' + index] && (
						<span>{errors['goods_where_' + index].message}</span>
					)}
				</Typography>
			</AccordionDetails>
			<AccordionDetails>
				<Controller
					name={'goods_from_' + index}
					control={control}
					defaultValue={''}
					render={({ field: { ref, ...field } }) => (
						<TextField
							{...field}
							inputRef={ref}
							id={'goods_from_' + index}
							label='কার হতে পাওয়া গিয়েছে'
							variant='outlined'
							color='secondary'
							fullWidth
							error={!!errors['goods_from_' + index]}
							//onChange={(e) => setName(e.target.value)}
						/>
					)}
				/>
				<br />
				<Typography className={classes.errorMSG}>
					{errors['goods_from_' + index] && (
						<span>{errors['goods_from_' + index].message}</span>
					)}
				</Typography>
			</AccordionDetails>
			<AccordionDetails>
				<Controller
					name={'goods_recovered_by_' + index}
					control={control}
					defaultValue={''}
					render={({ field: { ref, ...field } }) => (
						<TextField
							{...field}
							inputRef={ref}
							id={'goods_recovered_by_' + index}
							label='কাহার দ্বারা উদ্ধার হয়েছে'
							variant='outlined'
							color='secondary'
							fullWidth
							error={!!errors['goods_recovered_by_' + index]}
							//onChange={(e) => setName(e.target.value)}
						/>
					)}
				/>
				<br />
				<Typography className={classes.errorMSG}>
					{errors['goods_recovered_by_' + index] && (
						<span>{errors['goods_recovered_by_' + index].message}</span>
					)}
				</Typography>
			</AccordionDetails>
			<AccordionDetails>
				<Controller
					name={'goods_submitted_' + index}
					control={control}
					defaultValue={''}
					render={({ field: { ref, ...field } }) => (
						<div>
							<Typography
								className={classes.heading}
								style={{
									paddingTop: '2rem',
									paddingRight: '3rem',
									fontSize: '1.2rem'
								}}
							>
								ম্যাজিস্ট্রেটের নিকট পাঠানো হয়েছে
							</Typography>
							<Select
								{...field}
								inputRef={ref}
								placeholder='Select'
								id={'goods_submitted_' + index}
								options={[
									{ label: '✅ হ্যাঁ', value: true },
									{ label: '⛔️ না', value: false }
								]}
								getOptionLabel={x => x.label}
								getOptionValue={x => x.value}
								error={!!errors['goods_submitted_' + index]}
							/>
						</div>
					)}
				/>
				<br />
				<Typography className={classes.errorMSG}>
					{errors['goods_submitted_' + index] && (
						<span>{errors['goods_submitted_' + index].message}</span>
					)}
				</Typography>
			</AccordionDetails>
		</React.Fragment>
	);
};

export default SeizedGoodInfo;
