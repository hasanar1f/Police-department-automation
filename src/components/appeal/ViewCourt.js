import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
	Card,
	CardHeader,
	CircularProgress,
	Link,
	ListItem,
	ListItemText,
	Paper
} from '@material-ui/core';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import { useHistory } from 'react-router-dom';
import QueryString from 'querystring';
import searchCourtByID from '../../axios/Court/searchByID';

const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1,
		flexDirection: 'column',
		paddingLeft: '10vh',
		paddingTop: '8vh'
	},

	header: {
		fontSize: 50
	},

	subHeader: {
		fontSize: 35
	},

	paper: {
		padding: theme.spacing(2),
		textAlign: 'center',
		color: theme.palette.text.secondary
	},

	description: {
		padding: theme.spacing(2),
		fontSize: 18,
		color: theme.palette.text.secondary
	},

	main: {
		justifyContent: 'space-between',
		flex: 1,
		flexDirection: 'column'
	},

	margin: {
		margin: theme.spacing(1)
	},

	extendedIcon: {
		marginRight: theme.spacing(1)
	},

	scrollable: {
		maxHeight: '90%',
		overflow: 'auto'
	},

	listItem_primary: {
		backgroundColor: '#e9ebf2'
	},

	listItem_secondary: {
		backgroundColor: '#f5f6fa'
	},

	title: {
		textAlign: 'center',
		fontSize: '30px',
		fontWeight: 'bold',
		color: 'black'
	},
	card: {
		background: '#FFDDEE'
	},
	text: {
		fontSize: '20px'
	},

	table: {
		fontSize: 16
	},
	text_card_header: {
		fontSize: '35px',
		fontWeight: 'bold',
		align: 'center'
	},
	text_regular: {
		fontSize: '20px'
	}
}));

// const Court = {
// 	case: '123',
// 	date: new Date('12/04/21'),
// 	court_name: 'abcd',
// 	judge_name: 'mnp',
// 	prosecutor_name: 'ppp',
// 	defense_name: 'ddd'
// };

const ViewCourt = props => {
	const classes = useStyles();
	const [loading, setLoading] = useState(true);
	const [Court, setCourt] = useState({});
	const history = useHistory();

	const linkToFileName = link => {
		const tokens = link.split('/');
		return tokens[tokens.length - 1];
	};

	useEffect(async () => {
		await searchCourtByID(
			QueryString.parse(props.location.search.substring(1)),
			{
				Authorization: 'Officer ' + localStorage.getItem('token'),
				'Content-type': 'application/json'
			},
			(res, err) => {
				if (res) {
					setCourt(res);
					setLoading(false);
				} else {
					history.push({
						pathname: '/error',
						authenticated: true,
						message: err.message,
						status: err.errorCode
					});
				}
			}
		);
	}, []);

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
	console.log(Court);
	return (
		<div className={classes.root}>
			<Card>
				<CardHeader
					align="center"
					classes={{
						title: classes.text_card_header,
						subheader: classes.text_card_header
					}}
					title="⚖️ আদালত"
					subheader={`মামলা নংঃ ${Court.case}`}
				/>
			</Card>
			<br />
			<br />

			<Grid container spacing={3}>
				<Grid item xs={12} sm={2}></Grid>
				<Grid item xs={12} sm={8}>
					<Card className={classes.card}>
						<CardContent classes={classes.main}>
							<Paper
								elevation={3}
								className={classes.paper}
								style={{
									height: '60vh'
								}}
							>

								<List>
									<ListItem key={0}>
										<ListItemText align="center">
											<Typography className={classes.text_regular}>
												<b>আদালতে দাখিলের তারিখ: </b>
												{new Date(Court.date).toLocaleDateString()}
											</Typography>
										</ListItemText>
									</ListItem>

									<ListItem key={1}>
										<ListItemText align="center">
											<Typography className={classes.text_regular}>
												<b>আদালত: </b>
												{Court.name_of_court}
											</Typography>
										</ListItemText>
									</ListItem>
									<ListItem key={1}>
										<ListItemText align="center">
											<Typography className={classes.text_regular}>
												<b>বিচারক: </b>
												{Court.judge}
											</Typography>
										</ListItemText>
									</ListItem>

									<ListItem key={1}>
										<ListItemText align="center">
											<Typography className={classes.text_regular}>
												<b>রাষ্ট্রপক্ষের উকিলের নাম: </b>
												{Court.state_lawyer}
											</Typography>
										</ListItemText>
									</ListItem>

									<ListItem key={1}>
										<ListItemText align="center">
											<Typography className={classes.text_regular}>
												<b>আসামীপক্ষের উকিলের নাম: </b>
												{Court.defending_lawyer}
											</Typography>
										</ListItemText>
									</ListItem>
								</List>
							</Paper>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</div>
	);
};

export default ViewCourt;
