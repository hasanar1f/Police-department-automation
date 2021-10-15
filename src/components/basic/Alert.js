import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Dialog, DialogActions, DialogContent, Slide } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
	content: {
		display: 'flex',
		flexDirection: 'row'
	},
	icon: {
		width: '20%',
		height: '10vh'
	},
	tick: {
		color: 'green'
	},
	cross: {
		color: 'red'
	},
	message: {
		width: '65%',
		paddingTop: '12px'
	},
	button: {
		width: '30%',
		padding: '10px'
	}
}));

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction='up' ref={ref} {...props} />;
});

const Alert = ({ open, success, message, handleClose }) => {

	const classes = useStyles();

	return (
		<Dialog
			fullWidth
			maxWidth='sm'
			open={open}
			TransitionComponent={Transition}
			keepMounted
			onClose={handleClose}
			aria-labelledby='alert-dialog-slide-title'
			aria-describedby='alert-dialog-slide-description'
		>
			<DialogContent>
				<Grid container className={classes.content}>
					{
						success && <CheckCircleOutlineIcon className={`${classes.icon} ${classes.tick}`} />
					}
					{
						(!success) && <CancelOutlinedIcon className={`${classes.icon} ${classes.cross}`} />
					}
					<Typography className={classes.message} align='center' gutterBottom variant='h4' component='h1'>
						{message}
					</Typography>
				</Grid>
			</DialogContent>
			<DialogActions style={{ justifyContent: 'center' }}>
				<Button onClick={handleClose} className={classes.button} variant='contained' color='secondary'>
					Continue
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default Alert;
