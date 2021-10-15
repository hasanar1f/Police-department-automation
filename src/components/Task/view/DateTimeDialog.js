import React, { useRef } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { KeyboardDateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import updateTask from '../../../axios/task/updateTask';

const DateTimeDialog = ({ open, date, id, handleClose }) => {

	const new_date = useRef(new Date());

	const handleUpdate = () => {
		updateTask({
			date: new_date.current
		}, {
			_id: id
		}, {
			'content-type': 'application/json'
		}, function(res, err) {
			handleClose();
		});
	};

	return (
		<div>
			<Dialog open={open} onClose={handleClose} aria-labelledby='form-dialog-title'>
				<DialogTitle id='form-dialog-title'>Due Date and Time</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Update due date and time
					</DialogContentText>
					<MuiPickersUtilsProvider utils={DateFnsUtils}>
						<KeyboardDateTimePicker
							variant='inline'
							ampm={false}
							label='New Time:'
							value={new Date()}
							disablePast
							onChange={e => {
								new_date.current = e;
							}}
							onError={console.log}
							format='yyyy/MM/dd HH:mm'
						/>
					</MuiPickersUtilsProvider>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color='primary'>
						বাতিল করুন
					</Button>
					<Button onClick={handleUpdate} color='primary'>
						হালনাগাদ করুন
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default DateTimeDialog;
