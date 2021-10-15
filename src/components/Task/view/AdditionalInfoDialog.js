import React, { useRef } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Slide } from '@material-ui/core';
import updateTask from '../../../axios/task/updateTask';

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction='up' ref={ref} {...props} />;
});

const AdditionalInfoDialog = ({ open, info, id, handleClose }) => {


	const new_info = useRef('');

	const handleUpdate = () => {
		info.push(new_info.current);
		console.log(info);
		updateTask({
			additional_info: info
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
			<Dialog
				open={open}
				onClose={handleClose}
				aria-labelledby='form-dialog-title'
				TransitionComponent={Transition}
				fullWidth={true}
				maxWidth={'sm'}
			>
				<DialogTitle id='form-dialog-title'>Additional Info</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Add additional info for the assigned officers
					</DialogContentText>
					<TextField
						autoFocus
						margin='dense'
						id='name'
						label='Additional information'
						onChange={event => {
							new_info.current = event.target.value;
						}}
						type='text'
						fullWidth
						multiline
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color='primary'>
						বাতিল
					</Button>
					<Button onClick={handleUpdate} color='primary'>
						জমা দিন
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default AdditionalInfoDialog;
