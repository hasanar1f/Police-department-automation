import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
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
import PersonDetails from './personDetails';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import searchGDByID from '../../../axios/GD/searchbyID';
import * as QueryString from 'querystring';
import Dialog from '@material-ui/core/Dialog';
import AssignOfficer from '../../CaseEntry/view/assignOfficerModal';
import RemoveOfficerModal from '../../CaseEntry/view/removeOfficerModal';
import Button from '@material-ui/core/Button';
import dateToReadable from '../../../utils/dateToReadable';
import Divider from '@material-ui/core/Divider';
import Select from 'react-select';
import GdStates from '../../../utils/gdStates';
import assignOfficers from '../../../axios/GD/assignOfficers';
import updateGD from '../../../axios/GD/updateGD';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Reports from '../../../utils/ReportType';
import ImageShow from '../../basic/ImageShow';
import Crimes from '../../../utils/CrimeCategoryGD';
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

	tab: {
		paddingTop: '8px',
		width: '99.5%'
	},

	header: {
		fontSize: 25
	},

	subHeader: {
		fontSize: 18
	},

	paper: {
		padding: theme.spacing(2),
		textAlign: 'center',
		color: theme.palette.text.secondary
	},

	scrollbar: {
		padding: theme.spacing(0.5),
		textAlign: 'center',
		color: theme.palette.text.primary
	},

	description: {
		padding: theme.spacing(2),
		fontSize: 16,
		color: theme.palette.text.secondary
	},

	main: {
		justifyContent: 'space-between'
	},

	title: {
		textAlign: 'center',
		fontSize: '20px',
		fontWeight: 'bold',
		color: 'black'
	},

	tab_heading: {
		textAlign: 'center',
		fontSize: '20px',
		fontWeight: 'bold'
	},

	scrollable: {
		maxHeight: '75%',
		overflow: 'auto',
		minHeight: '75%'
	},

	listItem_primary: {
		backgroundColor: '#e9ebf2'
	},

	listItem_secondary: {
		backgroundColor: '#f5f6fa'
	},

	buttons: {
		position: 'flex',
		paddingLeft: '3%',
		paddingTop: '8%'
	},

	grid: {
		position: 'flex',
		paddingLeft: '13%'
	},

	button: {
		margin: theme.spacing(0.6),
		fontsize: '16px',
		fontWeight: ' '
	},

	text_regular: {
		fontSize: '16px',
		color: 'black'
	},

	text_table_header: {
		fontSize: '16px',
		fontWeight: 'bold'
	},
	text_card_header: {
		fontSize: '30px',
		fontWeight: 'bold',
		align: 'center'
	},
	stateButton: {
		marginLeft: theme.spacing(2),
		fontsize: '12px'
	}
}));

const GDview = props => {
	const classes = useStyles();
	const history = useHistory();
	const [report, setReport] = useState({});
	const [loading, setLoading] = useState(true);
	const [assignOfficersOpen, setAssignOfficerOpen] = useState(false);
	const [removeOfficersOpen, setRemoveOfficerOpen] = useState(false);
	const [GdState, setGdState] = useState('');
	const [statusLabel, setStatusLabel] = useState('');
	const [reportState, setReportState] = useState(
		GdStates[0].submittable_report
	);
	const [reportPath, setReportPath] = useState('');
	const [topicLabel, setTopicLabel] = useState('');

	////////////// tab //////////////////////////////////
	const [value, setValue] = React.useState(0);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};
	////////////////////////////////////////////////////

	const handleGdStateChange = async obj => {
		setGdState(obj);
		setReportState('');
		setReportState(obj.submittable_report);

		if (obj.value === 'escalated' || obj.value === 'resolved') {
			let remaining = [];
			report.assigned_officers.map(officer => {
				if (officer.to === undefined) {
					remaining.push(officer);
				}
			});

			await unassignOfficers(remaining);
		}
	};

	const handleGdStateChangeButton = async () => {
		await updateGD(
			{
				_id: report._id
			},
			{
				status: GdState.value
			},
			{
				Authorization: 'Officer ' + localStorage.getItem('token'),
				'Content-type': 'application/json'
			},
			(res, err) => {
				if (res) {
					if (GdState.value === 'escalated') {
						history.push({
							pathname: '/CaseEntry/create',
							state: {
								gd_no: report._id.toString()
							}
						});
					} else {
						window.location.reload();
					}
				} else {
					console.log(err);
				}
			}
		);
	};

	useEffect(() => {
		GdStates.map(st => {
			if (report.status === st.value) {
				setReportState(st.submittable_report);
				setStatusLabel(st.label);
			}
		});
		// console.log(report);
	});

	useEffect(() => {
		Crimes.map(c => {
			if (report.topic === c.value) {
				setTopicLabel(c.label);
			}
		});
		// console.log(report);
	});

	const handleReportStateChange = obj => {
		console.log(obj);
		setReportPath(obj.path);
	};

	const handleReportStateChangeButton = () => {
		console.log(reportPath);
		if (reportPath !== undefined && reportPath !== '') {
			history.push({
				pathname: reportPath,
				state: {
					gd_no: report._id.toString()
				}
			});
		}
	};

	const handleStateUpdate = () => {
		setValue(6);
	};

	const handleTimeLineView = (e, documentType, id) => {
		Reports.map(r => {
			if (r.type === documentType) {
				let historyParam = {
					_id: id
				};

				history.push({
					pathname: r.viewPath,
					search: '?' + QueryString.stringify(historyParam)
				});
				// console.log(r.viewPath);
			}
		});
	};

	useEffect(async () => {
		await searchGDByID(
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

	let date = new Date(report.date);
	report.date = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();

	const linkToFileName = link => {
		const tokens = link.split('/');
		return tokens[tokens.length - 1];
	};

	const addOfficers = () => {
		setAssignOfficerOpen(true);
	};

	const removeOfficer = () => {
		setRemoveOfficerOpen(true);
	};

	const unassignOfficers = async officers => {
		let assigned_officers = [];
		report.assigned_officers.map(officer => {
			if (officers.includes(officer)) {
				officer = { ...officer, to: Date.now() };
			}
			assigned_officers.push(officer);
		});

		await assignOfficers(
			{
				_id: report._id
			},
			{
				assigned_officers
			},
			{
				Authorization: 'Officer ' + localStorage.getItem('token'),
				'Content-type': 'application/json'
			},
			(res, err) => {
				if (res) {
					window.location.reload();
				} else {
					console.log(err);
				}
			}
		);
	};

	const updateOfficers = async officers => {
		let assigned_officers = [...report.assigned_officers];
		officers.map(officer => {
			assigned_officers.push({
				id: officer._id,
				from: Date.now()
			});
		});

		await assignOfficers(
			{
				_id: report._id
			},
			{
				assigned_officers
			},
			{
				Authorization: 'Officer ' + localStorage.getItem('token'),
				'Content-type': 'application/json'
			},
			(res, err) => {
				if (res) {
					window.location.reload();
				} else {
					console.log(err);
				}
			}
		);
	};

	// let documents = [...report.primary_documents, ...report.optional_documents];
	// console.log(report);
	return (
		<div className={classes.root}>
			<Dialog
				fullWidth="fullWidth"
				open={assignOfficersOpen}
				onClose={e => setAssignOfficerOpen(false)}
				aria-labelledby="max-width-dialog-title"
			>
				<AssignOfficer
					setOfficers={updateOfficers}
					officers={report.assigned_officers}
					handleClose={setAssignOfficerOpen}
				/>
			</Dialog>
			<Dialog
				fullWidth="fullWidth"
				open={removeOfficersOpen}
				onClose={e => setRemoveOfficerOpen(false)}
				aria-labelledby="max-width-dialog-title"
			>
				<RemoveOfficerModal
					setOfficers={unassignOfficers}
					officers={report.assigned_officers}
					handleClose={setRemoveOfficerOpen}
				/>
			</Dialog>

			<AppBar
				className={classes.tab}
				position="static"
				color="transparent"
				fullWidth
			>
				<div style={{ paddingLeft: '15px' }}>
					<Typography
						variant="h4"
						color="textPrimary"
						className={classes.text_card_header}
						align="center"
					>
						{report.title}
					</Typography>
					<Typography
						variant="h5"
						color="textSecondary"
						className={classes.text_card_header}
						align="center"
					>
						{'জিডি নম্বর: ' + report._id.toString()}
					</Typography>
				</div>
				<br />
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
							label="👮🏽‍♂️ তদন্তকারী কর্মকর্তা"
							{...a11yProps(1)}
						/>
						<Tab
							className={classes.tab_heading}
							label="🔗 সংযুক্তি"
							{...a11yProps(2)}
						/>
						<Tab
							className={classes.tab_heading}
							label="👥 বাদী-বিবাদী"
							{...a11yProps(3)}
						/>
						<Tab
							className={classes.tab_heading}
							label="📝 রিপোর্ট হালনাগাদ"
							{...a11yProps(4)}
						/>
						<Tab
							className={classes.tab_heading}
							label="📆 টাইমলাইন"
							{...a11yProps(5)}
						/>

						<Tab style={{ display: 'none' }} label="" {...a11yProps(6)} />
					</Tabs>
				</Paper>
			</AppBar>

			<TabPanel value={value} index={0}>
				<Grid container direction="column" spacing="10">
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
									জিডির তথ্য
								</Typography>
								<Divider />
								<List className={classes.scrollable}>
									<Typography
										className={classes.text_regular}
										align="center"
									>
										<b>জিডির ধরন: </b>
										{topicLabel}
									</Typography>
									<br />
									<Typography
										className={classes.text_regular}
										align="center"
									>
										<b>জিডির অবস্থা: </b>
										{statusLabel}
										<Button
											variant="contained"
											disabled={
												report.status === 'escalated' ||
												report.status === 'resolved'
											}
											color="primary"
											className={classes.stateButton}
											onClick={handleStateUpdate}
										>
											আপডেট করুন
										</Button>
									</Typography>
									<br />
									<Typography
										align="center"
										className={classes.text_regular}
									>
										<b>জিডি দাখিলের তারিখ: </b>
										{moment(report.date).format('DD/MM/YYYY')}
									</Typography>
									<br />
									{/*<ListItem>*/}
									{/*	<ListItemText*/}
									{/*		primary={`jiDir নিষ্পত্তির তারিখ: ${report.closed_date}`}*/}
									{/*	/>*/}
									{/*</ListItem>*/}
									{/*<ListItem>*/}
									{/*	<ListItemText*/}
									{/*		primary={`রায় (সংক্ষেপ): ${report.verdict}`}*/}
									{/*	/>*/}
									{/*</ListItem>*/}
								</List>
							</Paper>

							<br />

							<Paper
								elevation={3}
								className={classes.description}
								style={{
									height: '40vh'
								}}
							>
								<Typography variant="h6" className={classes.title}>
									জিডির বিবরণ
								</Typography>
								<Divider />
								<br />
								<Typography className={classes.text_regular}>
									{report.description}
								</Typography>
							</Paper>
						</Grid>
						<Grid item xs={0} sm={2} />
					</Grid>
				</Grid>
			</TabPanel>

			<TabPanel value={value} index={1}>
				<Paper
					elevation={3}
					className={classes.paper}
					style={{
						height: '40vh'
					}}
				>
					<Typography variant="h6" className={classes.title}>
						তদন্তকারী কর্মকর্তা
					</Typography>
					<Divider />
					<br />

					<TableContainer className={classes.scrollable}>
						<Table
							className={classes.table}
							size="small"
							aria-label="a dense table"
						>
							<TableHead>
								<TableRow>
									<TableCell
										className={classes.text_table_header}
										align="center"
									>
										পদবী
									</TableCell>
									<TableCell
										className={classes.text_table_header}
										align="center"
									>
										নাম
									</TableCell>
									<TableCell
										className={classes.text_table_header}
										align="center"
									>
										ব্যাজ নাম্বার
									</TableCell>
									<TableCell
										className={classes.text_table_header}
										align="center"
									>
										শুরুর তারিখ
									</TableCell>
									<TableCell
										className={classes.text_table_header}
										align="center"
									>
										অব্যহতির তারিখ
									</TableCell>
								</TableRow>
							</TableHead>

							<TableBody>
								{report.assigned_officers.map(officer => {
									return (
										<TableRow key={officer.name}>
											<TableCell component="th" scope="row">
												{officer.officer.rank}
											</TableCell>
											<TableCell component="th" scope="row">
												{officer.officer.name}
											</TableCell>
											<TableCell align="center">
												{officer.officer.badge_no}
											</TableCell>
											<TableCell align="center">
												{dateToReadable(officer.from)}
											</TableCell>
											<TableCell align="center">
												{dateToReadable(officer.to)}
											</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					</TableContainer>

					<div className={classes.buttons}>
						<Button
							className={classes.button}
							disabled={
								report.status === 'escalated' ||
								report.status === 'resolved'
							}
							variant="contained"
							onClick={addOfficers}
						>
							অফিসার নিযুক্ত করুন
						</Button>
						<Button
							className={classes.button}
							disabled={
								report.status === 'escalated' ||
								report.status === 'resolved'
							}
							variant="contained"
							onClick={removeOfficer}
						>
							অফিসারকে অব্যহতি দিন
						</Button>
					</div>
				</Paper>
			</TabPanel>

			<TabPanel value={value} index={2}>
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
									জিডির স্ক্যান কপি
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

			<TabPanel value={value} index={3}>
				<Grid container direction="column" spacing={3}>
					<Grid item container>
						<Grid item xs={0} sm={2} />

						<Grid item xs={12} sm={8}>
							<Paper
								elevation={3}
								className={classes.paper}
								style={{
									minHeight: '40vh'
								}}
							>
								<Typography variant="h6" className={classes.title}>
									বাদীর তথ্য
								</Typography>

								<Divider />
								<br />
								<Grid container direction="column" spacing={4}>
									<Grid item container spacing={4}>
										{report.for.map((person, index) => {
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
									বিবাদীর তথ্য
								</Typography>

								<Divider />
								<br />

								<Grid container direction="column" spacing={4}>
									<Grid item container spacing={4}>
										{report.against.map((person, index) => {
											return (
												<Grid item key={person._id} xs={12} sm={4}>
													<PersonDetails person={person} />
												</Grid>
											);
										})}
									</Grid>
								</Grid>
								{/* <List className={classes.scrollable}></List> */}
							</Paper>
						</Grid>

						<Grid item xs={0} sm={2} />
					</Grid>
				</Grid>
			</TabPanel>

			<TabPanel value={value} index={4}>
				<br />
				<Grid container className={classes.grid} spacing={2}>
					<Grid item xs={3}></Grid>

					<Grid item xs={5}>
						<Paper
							elevation={3}
							className={classes.description}
							style={{
								height: '60vh'
							}}
							align="center"
						>
							<Typography variant="h6" className={classes.title}>
								জিডির রিপোর্ট জমা
							</Typography>
							<Divider variant="middle" />
							<br />
							<br />
							<br />
							<br />
							<br />

							<Typography variant="h4" className={classes.title}>
								<b>রিপোর্ট যোগ করুন </b>
							</Typography>

							<br />
							<Select
								placeholder="রিপোর্ট জমা দিন"
								id="report_select"
								onChange={handleReportStateChange}
								options={reportState}
								getOptionLabel={x => x.label}
								getOptionValue={x => x.value}
							/>

							<br />

							<Button
								variant="contained"
								disabled={
									report.status === 'escalated' ||
									report.status === 'resolved'
								}
								color="primary"
								size="large"
								onClick={handleReportStateChangeButton}
								id="add_report_button"
							>
								রিপোর্ট যুক্ত করুন
							</Button>
						</Paper>
					</Grid>
				</Grid>
			</TabPanel>

			<TabPanel value={value} index={6}>
				<br />
				<Grid container className={classes.grid} spacing={2}>
					<Grid item xs={3}></Grid>
					<Grid item xs={5}>
						<Paper
							elevation={3}
							className={classes.description}
							style={{
								height: '60vh'
							}}
							align="center"
						>
							<Typography variant="h6" className={classes.title}>
								জিডির অবস্থা পরিবর্তন
							</Typography>
							<Divider variant="middle" />
							<br />
							<Typography variant="h5" className={classes.title}>
								<b>জিডির বর্তমান অবস্থা</b>
							</Typography>
							<br />
							<Typography variant="h5" className={classes.text_regular}>
								<b>
									<i>{statusLabel}</i>
								</b>
							</Typography>
							<br />
							<Typography variant="h5" className={classes.title}>
								<b>অবস্থা পরিবর্তন করুন </b>
							</Typography>

							<br />

							<Select
								placeholder="জিডির অবস্থা বেছে নিন"
								id="case_state_select"
								onChange={handleGdStateChange}
								options={GdStates}
								getOptionLabel={x => x.label}
								getOptionValue={x => x.value}
							/>

							<br />

							<Button
								variant="contained"
								color="primary"
								size="large"
								onClick={handleGdStateChangeButton}
								id="change_case_button"
							>
								অবস্থা পরিবর্তন
							</Button>
						</Paper>
					</Grid>
				</Grid>
			</TabPanel>

			<TabPanel value={value} index={5}>
				<Paper
					elevation={3}
					className={classes.description}
					style={{
						minHeight: '60vh'
					}}
					align="center"
				>
					<Typography variant="h6" className={classes.title}>
						মামলার অগ্রগতি
					</Typography>

					<Divider />
					<br />

					<TableContainer className={classes.scrollable}>
						<Table
							className={classes.table}
							size="small"
							aria-label="a dense table"
						>
							<TableHead>
								<TableRow>
									<TableCell
										className={classes.text_table_header}
										align="center"
									>
										রিপোর্টের ধরন
									</TableCell>
									<TableCell
										className={classes.text_table_header}
										align="center"
									>
										অফিসারের নাম
									</TableCell>
									<TableCell
										className={classes.text_table_header}
										align="center"
									>
										সময়
									</TableCell>
									<TableCell
										className={classes.text_table_header}
										align="center"
									>
										রিপোর্ট লিংক
									</TableCell>
								</TableRow>
							</TableHead>
							<br />
							<TableBody>
								{report.links.map(link => {
									return (
										<TableRow key={link._id}>
											{Reports.map(r => {
												if (link.documentType == r.type) {
													return (
														<TableCell
															className={classes.text_regular}
															align="center"
														>
															{r.label}
														</TableCell>
													);
												}
											})}

											<TableCell
												className={classes.text_regular}
												align="center"
											>
												{link.recordedBy.name}
											</TableCell>

											<TableCell
												className={classes.text_regular}
												align="center"
											>
												{moment(link.recordedOn).format(
													'DD/MM/YYYY'
												)}
											</TableCell>

											<TableCell align="center">
												<Button
													label="Submit"
													variant="contained"
													color="primary"
													size="medium"
													onClick={e =>
														handleTimeLineView(
															e,
															link.documentType,
															link.id
														)
													}
												>
													দেখুন
												</Button>
											</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					</TableContainer>
				</Paper>
			</TabPanel>
		</div>
	);
};

export default GDview;
