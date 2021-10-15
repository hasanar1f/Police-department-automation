import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import login from '../../axios/Authentication/login';
import { makeStyles } from '@material-ui/core/styles';
import { Alert, AlertTitle } from '@material-ui/lab';
import { Snackbar } from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';



const useStyles = makeStyles(theme => ({
	login: {
		marginTop: '20%',
		marginLeft: '15%',
		marginRight: '15%',
		width: '70%'
	},

	textBox: {
		width: '100vh'
	}
}));

const Login = props => {
	const classes = useStyles();
	const history = useHistory();
	const [badgeNo, setBadgeNo] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);


	let successVal;
	if (props.location === undefined) {
		successVal = {
			status: '',
			message: ''
		};
	} else {
		successVal = props.location.state;
	}
	const [success, setSuccess] = useState(successVal);
	const [alertOpen, setAlertOpen] = useState(false);

	useEffect(() => {
		if (success.status === 'Error') {
			setAlertOpen(true);
		}
	}, [success]);

	const submitLoginInfo = () => {
		setLoading(true);
		login(
			{
				badge_no: badgeNo,
				password: password
			},
			{
				'content-type': 'application/json'
			},
			function (res, err) {
				if (res) {

					// gourab
					props.setAuth(true);
					localStorage.setItem('token', res.token);
					localStorage.setItem('officer', JSON.stringify(res.officer));
					setLoading(false);
					history.push({
						pathname: '/home',
						authenticated: true,
						loggedIn: true
					});
				} else {
					setLoading(false);
					setSuccess({
						status: 'Error',
						message: err.error
					});
				}
			}
		);
	};

	const handleClose = () => {
		setAlertOpen(false);
	};

	if (loading) {
		return (
			<div
				style={{
					position: 'absolute',
					left: '50%',
					top: '50%',
					transform: 'translate(-50%, -50%)'
				}}
			>
				<CircularProgress color="secondary" />
			</div>
		);
	}

	return (


			<div>
				{success.status === 'Error' && (
					<Snackbar
						bodyStyle={{
							height: 500,
							width: 500
						}}
						open={alertOpen}
						autoHideDuration={2000}
						onClose={handleClose}
					>
						<Alert severity="error">
							<AlertTitle>{success.status}</AlertTitle>
							{success.message}
						</Alert>
					</Snackbar>
				)}

				<form className={`${classes.login} ui form`}>
					<div className={`field ${classes.textBox}`}>
						<label>ব্যাজ নম্বর: </label>
						<input
							type="text"
							key="badge no"
							placeholder="Enter your badge number"
							onChange={e => {
								setBadgeNo(e.target.value);
							}}
						></input>
					</div>

					<div className={`field ${classes.textBox}`}>
						<label>পাসওয়ার্ড: </label>
						<input
							type="password"
							key="password"
							placeholder="Enter password"
							onChange={e => {
								setPassword(e.target.value);
							}}
						></input>
					</div>

					<div className="field">
						<button
							className="ui button"
							type="button"
							onClick={
									submitLoginInfo
							}
						>
							লগ ইন
						</button>
					</div>
				</form>
			</div>


	);
};

export default Login;
