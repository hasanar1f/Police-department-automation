import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import { Alert, AlertTitle } from '@material-ui/lab';
import { Avatar, Snackbar } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import ThanaList from '../../utils/ThanaList';

const useStyles = makeStyles({
	root: {
		maxWidth: 650,
		marginTop: '10%',
		marginLeft: '30%',
		width: '70%',
		padding: '20px',
		alignItems: 'center'
	},
	media: {
		height: '400'
	},
	avatar: {
		backgroundColor: '#' + ((Math.random() * 0xffffff) << 0).toString(16),
		height: '20vh',
		width: '20vh',
		fontSize: 120
	}
});

const Welcome = props => {
	let loggedIn = props.location.loggedIn;
	const classes = useStyles();
	const officer = JSON.parse(localStorage.getItem('officer'));
	const [alertOpen, setAlertOpen] = useState(loggedIn);

	const [divisionLabel, setDivisionLabel] = useState('');
	const [districtLabel, setDistrictLabel] = useState('');
	const [thanaLabel, setThanaLabel] = useState('');

	useEffect(() => {
		ThanaList.map(div => {
			if (officer && officer.thana.division === div.name) {
				setDivisionLabel(div.label);
				div.districts.map(dis => {
					if (officer && officer.thana.district === dis.name) {
						setDistrictLabel(dis.label);
						dis.thanas.map(th => {
							if (officer && officer.thana.thana === th.name) {
								setThanaLabel(th.label);
							}
						});
					}
				});
			}
		});
	});

	// gourab

	// if (!props.location.authenticated) {
	// 	return <Redirect to={'/login'} />;
	// }
	if (!officer) {
		return <Redirect to={'/login'} />;
	}

	const handleClose = () => {
		setAlertOpen(false);
	};

	return (
		<div>
			<Snackbar
				bodyStyle={{
					height: 200,
					width: 200
				}}
				open={alertOpen}
				autoHideDuration={2000}
				onClose={handleClose}
			>
				<Alert severity="success">
					<AlertTitle>{'Success'}</AlertTitle>
					{'Successfully logged in'}
				</Alert>
			</Snackbar>

			<Card className={classes.root}>
				<Grid
					item
					xs
					container
					direction="column"
					alignItems="center"
					spacing={5}
				>
					<Grid item>
						<Avatar
							src="./src.img"
							alt={officer.name}
							className={classes.avatar}
						/>
					</Grid>
					<Grid item xs={12} sm container>
						<Grid
							item
							xs
							container
							direction="column"
							alignItems="center"
							spacing={5}
						>
							<Grid item xs>
								<Typography gutterBottom variant="h4">
									<b> 👋 স্বাগতম </b>, {officer.name}
								</Typography>
								<Typography gutterBottom variant="h5">
									<b> 🔤 ব্যাজ নম্বর:</b> {officer.badge_no}
								</Typography>
								<Typography gutterBottom variant="h5">
									<b >🎖 র‍্যাংক: </b>
									{officer.rank}
								</Typography>
								{/* <Typography gutterBottom variant="h5">
									<b>থানা: </b>
									{officer.thana.thana}, {officer.thana.district}
								</Typography> */}
								<Typography gutterBottom variant="h5">
									<b>🏪 থানা: </b>
									{thanaLabel} থানা,{districtLabel},{divisionLabel}
								</Typography>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Card>
		</div>
	);
};

export default Welcome;
