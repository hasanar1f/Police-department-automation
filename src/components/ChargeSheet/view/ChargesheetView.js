import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
	Card,
	CardHeader,
	CircularProgress,
	Link,
	ListItem,
	Paper
} from '@material-ui/core';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import PersonDetails from './personDetails';
import GoodsDetails from './GoodsDetails';
import QueryString from 'querystring';
import searchChargeSheetByID from '../../../axios/ChargeSheet/searchByID';
import { useHistory } from 'react-router-dom';
import dateToReadable from '../../../utils/dateToReadable';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import { Divider } from '@material-ui/core';
import ImageShow from '../../basic/ImageShow';
import moment from 'moment';
import AccusedDetails from './AccusedDetails';
import DocumentShow from '../../basic/DocumentShow';
///////////// tab //////////////////////////////////

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

////////////////////////////////////////////////////

const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1,
		paddingLeft: '10vh',
		paddingTop: '8vh'
	},

	header: {
		fontSize: 30
	},

	subHeader: {
		fontSize: 22
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
	table: {
		minWidth: 650
	},

	main: {
		justifyContent: 'space-between'
	},

	title: {
		textAlign: 'center',
		fontSize: '30px',
		fontWeight: 'bold',
		color: 'black'
	},

	tab_heading: {
		textAlign: 'center',
		fontSize: '20px',
		fontWeight: 'bold'
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

	moreFontSize: {
		fontSize: 25
	},
	text_regular: {
		fontSize: '20px'
	},
	text_card_header: {
		fontSize: '35px',
		fontWeight: 'bold',
		align: 'center'
	}
}));

const ChargesheetView = props => {
	const classes = useStyles();
	const [report, setReport] = useState({});
	const [loading, setLoading] = useState(true);
	const history = useHistory();

	////////////// tab //////////////////////////////////
	const [value, setValue] = React.useState(0);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};
	////////////////////////////////////////////////////

	useEffect(async () => {
		await searchChargeSheetByID(
			QueryString.parse(props.location.search.substring(1)),
			{
				Authorization: 'Officer ' + localStorage.getItem('token'),
				'Content-type': 'application/json'
			},
			(res, err) => {
				if (res) {
					setReport(res);
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

	///////////////////// array //////////////////////

	let assigned_officers = [],
		against = [],
		good = [];

	const linkToFileName = link => {
		const tokens = link.split('/');
		return tokens[tokens.length - 1];
	};

	var item = {
		name: 'আইপ্যাড ৬ষ্ঠ জেনারেশন ৩২ জিবি',
		amount: '1',
		place: 'বকশিবাজার',
		foundFrom: 'গৌরাব সাহা',
		FoundBy: 'হাসান আরিফ',
		isMagistrate: true
	};

	var person1 = {
		name: 'মেহেদি হাসান',
		father_name: 'মেহেদি কাঁদান',
		address: 'রংপুর',
		nid: '100120333'
	};
	good.push(item);
	against.push(person1);

	let documents = [...report.primary_documents, ...report.optional_documents];
	console.log(report);

	return (
		<div className={classes.root}>
			<AppBar
				className={classes.tab}
				position="static"
				color="transparent"
				fullWidth
			>
				<Paper elevation={3} className={classes.scrollbar}>
					<Tabs
						centered
						value={value}
						onChange={handleChange}
						aria-label="simple tabs example"
					>
						<Tab
							className={classes.tab_heading}
							label="📜 বিবরণ"
							{...a11yProps(0)}
						/>
						<Tab
							className={classes.tab_heading}
							label="🗣 তথ্য প্রদানকারী"
							{...a11yProps(1)}
						/>
						<Tab
							className={classes.tab_heading}
							label="👥 সাক্ষী"
							{...a11yProps(2)}
						/>
						<Tab
							className={classes.tab_heading}
							label="🗞 প্রাপ্ত প্রমান"
							{...a11yProps(3)}
						/>
						<Tab
							className={classes.tab_heading}
							label="⚠️ অভিযুক্ত"
							{...a11yProps(4)}
						/>
						<Tab
							className={classes.tab_heading}
							label="🔗 সংযুক্তি"
							{...a11yProps(5)}
						/>
					</Tabs>
				</Paper>
			</AppBar>

			<TabPanel value={value} index={0}>
				<Grid container direction="column" spacing="10">
					<Grid key={'1'} item container>
						<Grid key={'10'} item xs={0} sm={2} />

						<Grid key={'11'} item xs={12} sm={8}>
							<Card>
								<CardHeader
									title={'মামলা নাম্বারঃ ' + report.case}
									align="center"
									subheader={
										'ধারাঃ ' +
										report.dhara +
										'	| তারিখঃ ' +
										moment(report.date).format('DD/MM/YYYY')
									}
									classes={{
										title: classes.text_card_header,
										subheader: classes.text_card_header
									}}
								/>
								<CardContent classes={classes.main}>
									<Paper
										elevation={3}
										className={classes.description}
										style={{
											height: '40vh'
										}}
									>
										<Typography
											variant="h5"
											className={classes.title}
										>
											অভিযোগ তদন্তের ফলাফল
										</Typography>
										<Divider />
										<br />

										<Typography
											variant="h6"
											align="center"
											className={classes.text_regular}
										>
											<b>অভিযুক্ত ধারাঃ </b>
											{report.dhara_of_accusation}
										</Typography>
										<br />
										<Typography
											align="center"
											className={classes.text_regular}
										>
											<b>অভিযোগঃ </b>
											{report.accusation}
										</Typography>
										<br />

										<Typography
											align="center"
											className={classes.text_regular}
										>
											<b>অপরাধঃ </b>
											{report.crime}
										</Typography>
										<br />
									</Paper>
								</CardContent>
							</Card>

							<Card>
								<CardHeader
									title={'ঘটনার বিবরনঃ'}
									align="center"
									classes={{
										title: classes.header,
										subheader: classes.subHeader
									}}
								/>
								<CardContent classes={classes.main}>
									<Paper
										elevation={3}
										className={classes.description}
										style={{
											height: '40vh'
										}}
									>
										<Typography className={classes.text_regular}>
											{report.description}
										</Typography>
									</Paper>
								</CardContent>
							</Card>
						</Grid>
					</Grid>
				</Grid>
			</TabPanel>

			<TabPanel value={value} index={1}>
				<Grid container direction="column" spacing="10">
					<Grid key={'1'} item container>
						<Grid key={'10'} item xs={0} sm={2} />

						<Grid key={'11'} item xs={12} sm={8}>
							<Paper
								elevation={3}
								className={classes.paper}
								style={{
									minHeight: '30vh'
								}}
							>
								<Typography variant="h6" className={classes.title}>
									তথ্য প্রদানকারী
								</Typography>
								<Divider />
								<br />
								<Grid container direction="column" spacing={4}>
									<Grid item container spacing={4}>
										{report.info_provider.map((person, index) => {
											return (
												<Grid item key={person._id} xs={12} sm={4}>
													<PersonDetails person={person} />
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
				<Grid container direction="column" spacing="10">
					<Grid key={'1'} item container>
						<Grid key={'10'} item xs={0} sm={2} />

						<Grid key={'11'} item xs={12} sm={8}>
							<Paper
								elevation={3}
								className={classes.paper}
								style={{
									minHeight: '30vh'
								}}
							>
								<Typography variant="h6" className={classes.title}>
									স্বাক্ষীর তথ্য
								</Typography>
								<Divider />
								<br />
								<Grid container direction="column" spacing={4}>
									<Grid item container spacing={4}>
										{report.witness.map((person, index) => {
											return (
												<Grid item key={person._id} xs={12} sm={4}>
													<PersonDetails person={person} />
												</Grid>
											);
										})}
									</Grid>
								</Grid>
							</Paper>
							<br />
							<Paper
								elevation={3}
								className={classes.paper}
								style={{
									minHeight: '40vh'
								}}
							>
								<Typography variant="h6" className={classes.title}>
									সাক্ষ্য সমূহ
								</Typography>

								<Divider />
								<br />

								<List className={classes.scrollable}>
									{report.witness.map(person => {
										console.log(person);
										return (
											<ListItem key={person._id}>
												<Typography
													className={classes.text_regular}
												>
													<b> {person.name} : </b>
													{person.testimony}
												</Typography>
												<br />
											</ListItem>
										);
									})}
								</List>
							</Paper>
						</Grid>
					</Grid>
				</Grid>
			</TabPanel>

			<TabPanel value={value} index={3}>
				<Grid container direction="column" spacing="10">
					<Grid key={'1'} item container>
						<Grid key={'10'} item xs={0} sm={2} />

						<Grid key={'11'} item xs={12} sm={8}>
							<Paper
								elevation={3}
								className={classes.paper}
								style={{
									minHeight: '30vh'
								}}
							>
								<Typography variant="h6" className={classes.title}>
									প্রাপ্ত প্রমাণ
								</Typography>
								<Divider />
								<br />
								<Grid container direction="column" spacing={4}>
									<Grid item container spacing={4}>
										{report.acquired_items.map((good, index) => {
											return (
												<Grid item key={good._id} xs={12} sm={6}>
													<GoodsDetails good={good} />
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

			<TabPanel value={value} index={4}>
				<Grid container direction="column" spacing="10">
					<Grid key={'1'} item container>
						<Grid key={'10'} item xs={0} sm={2} />

						<Grid key={'11'} item xs={12} sm={8}>
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
										{report.accused.map((person, index) => {
											return (
												<Grid item key={person._id} xs={12} sm={4}>
													<AccusedDetails accused={person} />
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

			<TabPanel value={value} index={5}>
				<Grid container direction="column" spacing={3}>
					<Grid item container>
						<Grid item xs={0} sm={2} />

						<Grid item xs={12} sm={8}>
							<Paper
								elevation={3}
								className={classes.paper}
								style={{
									minHeight: '35vh'
								}}
							>
								<Typography variant="h6" className={classes.title}>
									স্ক্যান কপি
								</Typography>
								<Divider />
								<br />
								<ImageShow images={report.primary_documents} />
								<Typography
									align="left"
									style={{ paddingLeft: '2rem' }}
									variant="h6"
								>
									অভিযোগপত্রের স্ক্যান কপি
								</Typography>
							</Paper>
						</Grid>

						<Grid item xs={0} sm={2} />
					</Grid>

					<Grid item container>
						<Grid item xs={0} sm={2} />

						<Grid item xs={12} sm={8}>
							<Paper
								elevation={3}
								className={classes.paper}
								style={{
									minHeight: '35vh'
								}}
							>
								<Typography variant="h6" className={classes.title}>
									ছবি সমূহ
								</Typography>
								<Divider />
								<br />
								<ImageShow images={report.optional_images} />
							</Paper>
						</Grid>

						<Grid item xs={0} sm={2} />
					</Grid>

					<Grid item container>
						<Grid item xs={0} sm={2} />

						<Grid item xs={12} sm={8}>
							<Paper
								elevation={3}
								className={classes.paper}
								style={{
									minHeight: '35vh'
								}}
							>
								<Typography variant="h6" className={classes.title}>
									প্রয়োজনীয় কাগজপত্র সমূহ
								</Typography>
								<Divider />
								<br />
								<DocumentShow documents={report.optional_documents} />
							</Paper>
						</Grid>

						<Grid item xs={0} sm={2} />
					</Grid>
				</Grid>
			</TabPanel>
			<br />
		</div>
	);
};

export default ChargesheetView;
