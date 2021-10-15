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
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import ImageShow from '../basic/ImageShow';
import QueryString from 'querystring';
import searchVerdictByID from '../../axios/verdict/searchByID';
import AccusedVerdictDetails from './AccusedVerdictDetails';
import { Divider } from '@material-ui/core';
function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box p={3}>
					<Typography>{children}</Typography>
				</Box>
			)}
		</div>
	);
}

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.any.isRequired,
	value: PropTypes.any.isRequired
};

function a11yProps(index) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`
	};
}

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
	tab_heading: {
		textAlign: 'center',
		fontSize: '20px',
		fontWeight: 'bold'
	},

	table: {
		fontSize: 16
	},
	text_card_header: {
		fontSize: '35px',
		fontWeight: 'bold',
		align: 'center,'
	},

}));

const ViewVerdict = props => {
	const classes = useStyles();
	const [loading, setLoading] = useState(true);
	const [verdict, setVerdict] = useState({});
	const [value, setValue] = React.useState(0);
	const history = useHistory();

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	const linkToFileName = link => {
		const tokens = link.split('/');
		return tokens[tokens.length - 1];
	};

	useEffect(async () => {
		await searchVerdictByID(
			QueryString.parse(props.location.search.substring(1)),
			{
				Authorization: 'Officer ' + localStorage.getItem('token'),
				'Content-type': 'application/json'
			},
			(res, err) => {
				if (res) {
					setVerdict(res);
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

	console.log(verdict);

	return (
		<div className={classes.root}>
			<AppBar className={classes.tab} color="transparent" fullWidth>
				<Paper elevation={3} className={classes.scrollbar}>
					<Tabs
						centered
						value={value}
						onChange={handleChange}
						aria-label="simple tabs example"
					>
						<Tab
							className={classes.tab_heading}
							label="রায়ের বিবরণ"
							{...a11yProps(0)}
						/>
						<Tab
							className={classes.tab_heading}
							label="অভিযুক্ত"
							{...a11yProps(1)}
						/>
						<Tab
							className={classes.tab_heading}
							label="সংযুক্তি"
							{...a11yProps(2)}
						/>
					</Tabs>
				</Paper>
			</AppBar>

			<TabPanel value={value} index={0}>
				<Card>
					<CardHeader
						align="center"
						classes={{
							title: classes.text_card_header,
							subheader: classes.text_card_header
						}}
						title="⚖️ রায়"
						subheader={`মামলা নংঃ ${verdict.case}`}
					/>
				</Card>
				<br />
				<br />
				<Grid>
					<Grid container spacing={3}>
						<Grid item xs={12} sm={2} />

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
													<Typography
														className={classes.text_regular}
													>
														<b>রায়ের তারিখ: </b>
														{new Date(
															verdict.date
														).toLocaleDateString()}
													</Typography>
												</ListItemText>
											</ListItem>
											<ListItem key={1}>
												<ListItemText align="center">
													<Typography
														className={classes.text_regular}
													>
														<b>রায় নং: </b>
														{verdict.verdict_no}
													</Typography>
												</ListItemText>
											</ListItem>
											<ListItem key={1}>
												<ListItemText align="center">
													<Typography
														className={classes.text_regular}
													>
														<b>আদালত: </b>
														{verdict.name_of_court}
													</Typography>
												</ListItemText>
											</ListItem>
											<ListItem key={1}>
												<ListItemText align="center">
													<Typography
														className={classes.text_regular}
													>
														<b>বিচারক: </b>
														{verdict.judge}
													</Typography>
												</ListItemText>
											</ListItem>

											<ListItem key={1}>
												<ListItemText align="center">
													<Typography
														className={classes.text_regular}
													>
														<b>রাষ্ট্রপক্ষের উকিলের নাম: </b>
														{verdict.state_lawyer}
													</Typography>
												</ListItemText>
											</ListItem>

											<ListItem key={1}>
												<ListItemText align="center">
													<Typography
														className={classes.text_regular}
													>
														<b>আসামীপক্ষের উকিলের নাম: </b>
														{verdict.defending_lawyer}
													</Typography>
												</ListItemText>
											</ListItem>

											<ListItem key={1}>
												<ListItemText align="center">
													<Typography
														className={classes.text_regular}
													>
														<b>রায়ের সংক্ষেপ: </b>
														{verdict.short_description}
													</Typography>
												</ListItemText>
											</ListItem>

											<ListItem key={1}>
												<ListItemText align="center">
													<Typography
														className={classes.text_regular}
													>
														<b>রায়ের বিস্তারিত: </b>
														{verdict.detailed_description}
													</Typography>
												</ListItemText>
											</ListItem>
										</List>
									</Paper>
								</CardContent>
							</Card>
						</Grid>
					</Grid>
				</Grid>
			</TabPanel>

			<TabPanel value={value} index={1}>
				<Grid>
					<Grid container spacing={3}>
						<Grid item xs={12} sm={2} />
						<Grid item xs={12} sm={8}>
							<Paper
								elevation={3}
								className={classes.paper}
								style={{
									minHeight: '30vh'
								}}
							>
								<Typography variant="h6" className={classes.title}>
									অভিযুক্ত
								</Typography>
								<Divider />
								<br />
								<Grid container direction="column" spacing={4}>
									<Grid item container spacing={4}>
										{verdict.criminals.map((person, index) => {
											return (
												<Grid item key={person._id} xs={12} sm={6}>
													<AccusedVerdictDetails
														accused={person}
													/>
												</Grid>
											);
										})}
									</Grid>
								</Grid>
							</Paper>
						</Grid>
					</Grid>
				</Grid>
			</TabPanel>

			<TabPanel value={value} index={2}>
				<Grid>
					<Grid container spacing={3}>
						<Grid item xs={12} sm={2} />
						<Grid item xs={12} sm={8}>
							<Card className={classes.card}>
								<CardContent>
									<Paper
										elevation={3}
										className={classes.paper}
										style={{
											height: '60vh'
										}}
									>
										<Typography
											variant="h6"
											className={classes.title}
										>
											সংযুক্তি
										</Typography>
										<br />
										<ImageShow images={verdict.primary_documents} />
										<Typography
											align="left"
											style={{ paddingLeft: '1.8rem' }}
											variant="h6"
										>
											রায়ের স্ক্যান কপি
										</Typography>
									</Paper>
								</CardContent>
							</Card>
						</Grid>
					</Grid>
				</Grid>
			</TabPanel>
		</div>
	);
};

export default ViewVerdict;
