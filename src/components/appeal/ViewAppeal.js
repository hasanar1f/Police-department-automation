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
import searchAppealByID from '../../axios/appeal/searchByID';
import QueryString from 'querystring';
import { useHistory } from 'react-router-dom';
import ImageShow from '../basic/ImageShow';

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

	table: {
		fontSize: 16
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
	text_card_header: {
		fontSize: '35px',
		fontWeight: 'bold',
		align: 'center'
	}
}));

const ViewAppeal = props => {
	const classes = useStyles();
	const [loading, setLoading] = useState(true);
	const [appeal, setAppeal] = useState({});
	const history = useHistory();

	useEffect(async () => {
		await searchAppealByID(
			QueryString.parse(props.location.search.substring(1)),
			{
				Authorization: 'Officer ' + localStorage.getItem('token'),
				'Content-type': 'application/json'
			},
			(res, err) => {
				if (res) {
					setAppeal(res);
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

	const linkToFileName = link => {
		const tokens = link.split('/');
		return tokens[tokens.length - 1];
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
		<div className={classes.root}>
			<Card>
				<CardHeader
					align="center"
					classes={{
						title: classes.text_card_header,
						subheader: classes.text_card_header
					}}
					title="🗒 আদালতের নিকট আপিল আবেদন"
					subheader={appeal.case}
				/>
			</Card>
			<br />
			<br />
			<Grid container spacing={3}>
				<Grid item xs={12} sm={6}>
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
										<ListItemText>
											<Typography className={classes.text}>
												<b>আপিল আবেদনের তারিখ: </b>
												{new Date(appeal.date).toLocaleDateString()}
											</Typography>
										</ListItemText>
									</ListItem>
									<ListItem key={1}>
										<Typography className={classes.text}>
											<b>আবেদনকারীর নাম: </b>
											{appeal.applicant}
										</Typography>
									</ListItem>
									<ListItem key={2}>
										<Typography className={classes.text}>
											<b>আদালতের নাম: </b>
											{appeal.court}
										</Typography>
									</ListItem>
									<ListItem key={3}>
										<Typography className={classes.text}>
											<b>আবেদন: </b>
											{appeal.application}
										</Typography>
									</ListItem>
								</List>
							</Paper>
						</CardContent>
					</Card>
				</Grid>

				<Grid item xs={12} sm={6}>
					<Card className={classes.card}>
						<CardContent>
							<Paper
								elevation={3}
								className={classes.paper}
								style={{
									height: '60vh'
								}}
							>
								<Typography variant="h6" className={classes.title}>
									সংযুক্তি
								</Typography>
								<br />
								<ImageShow images={appeal.documents} />
								<Typography
									align="left"
									style={{ paddingLeft: '1.8rem' }}
									variant="h6"
								>
									আবেদনের স্ক্যান কপি
								</Typography>
							</Paper>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</div>
	);
};

export default ViewAppeal;
