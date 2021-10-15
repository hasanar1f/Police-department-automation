import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Card,
	CardHeader,
	CircularProgress,
	ListItem,
	ListItemText,
	Paper
} from '@material-ui/core';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Countdown from './countdown';
import AdditionalInfoDialog from './AdditionalInfoDialog';
import DateTimeDialog from './DateTimeDialog';
import searchTaskByID from '../../../axios/task/searchTaskByID';
import * as QueryString from 'querystring';

const useStyles = makeStyles((theme) => ({
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

	title: {},

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

	text: {
		fontSize: 27
	},

	table: {
		fontSize: 18
	}
}));

const TaskView = (props) => {

	const classes = useStyles();
	const [task, setTask] = useState({});
	const [infoDialogOpen, setInfoDialogOpen] = useState(false);
	const [dateDialogOpen, setDateDialogOpen] = useState(false);
	const [loading, setLoading] = useState(true);
	let date, time;

	useEffect(() => {
		searchTaskByID(QueryString.parse(props.location.search.substring(1))
			, {}, (res, err) => {
				setTask(res);
				setLoading(false);
			});
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

	const onEditInfo = () => {
		setInfoDialogOpen(true);
	};

	const onEditDate = () => {
		setDateDialogOpen(true);
	};


	return (

		<div className={classes.root}>

			<Card>
				<CardHeader classes={{
					title: classes.header,
					subheader: classes.subHeader
				}}
								title={task.title}
								subheader={`Task ID=${task._id}`}

				/>
				<CardContent classes={classes.main}>
					<Grid container spacing={3}>
						<Grid item xs={5}>
							<Paper elevation={3} className={classes.paper} style={{
								height: '60vh'
							}}>
								<Typography variant='h3' className={classes.title}>
									About this task
								</Typography>
								<List>
									<ListItem key={0}>
										<ListItemText classes={{
											primary: classes.text
										}}
														  primary={`Status : ${task.status}`}
										/>
									</ListItem>
									<ListItem key={1}>
										<ListItemText classes={{
											primary: classes.text
										}}
														  primary={`Due Date: ` + new Date(task.date).toLocaleDateString()}
										/>
									</ListItem>
									<ListItem key={2}>
										<ListItemText classes={{
											primary: classes.text
										}}
														  primary={`Due Date: ` + new Date(task.date).toLocaleTimeString()}
										/>
									</ListItem>
								</List>
								<div>
									<Countdown dueDate={task.date} />
								</div>
							</Paper>
						</Grid>

						<Grid item xs={7}>
							<Paper elevation={3} className={classes.paper} style={{
								height: '60vh'
							}}>
								<Typography variant='h3' className={classes.title}>
									Assigned officers
								</Typography>
								<TableContainer className={classes.scrollable}>

									<Table size='medium' aria-label='a dense table'>
										<TableHead>
											<TableRow>
												<TableCell className={classes.table} align='center'>Name</TableCell>
												<TableCell className={classes.table} align='center'>Badge</TableCell>
												<TableCell className={classes.table} align='center'>Rank</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{task.assigned_officers.map(officer => {
												return (
													<TableRow key={officer._id}>
														<TableCell component='th' scope='row'>
															{officer.name}
														</TableCell>
														<TableCell align='center'>{officer.badge_no}</TableCell>
														<TableCell align='center'>{officer.rank}</TableCell>
													</TableRow>
												);
											})}
										</TableBody>
									</Table>
								</TableContainer>
							</Paper>
						</Grid>

						<Grid item xs={12}>
							<Paper elevation={3} className={classes.paper} style={{
								minHeight: '40vh'
							}}>
								<Typography variant='h3' className={classes.title}>
									Task Details
								</Typography>
								<br />
								<Typography className={`${classes.scrollable} ${classes.table}`}>
									{task.description}
								</Typography>
							</Paper>
						</Grid>

						<Grid item xs={12}>
							<Paper elevation={3} className={classes.paper} style={{
								minHeight: '40vh'
							}}>
								<Typography variant='h3' className={classes.title}>
									Additional Informations
								</Typography>
								<br />
								{
									task.additional_info.map((info, index) => {
										return (
											<Accordion key={index}>
												<AccordionSummary
													expandIcon={<ExpandMoreIcon />}
													aria-controls='panel1a-content'
													id='panel1a-header'
												>
													<Typography className={classes.heading}>{`Edit ${index + 1}`}</Typography>
												</AccordionSummary>
												<AccordionDetails>
													<Typography>
														{info}
													</Typography>
												</AccordionDetails>
											</Accordion>
										);
									})
								}
							</Paper>
						</Grid>

						<Button
							variant='contained'
							size='large' color='primary'
							className={classes.margin}
							onClick={onEditInfo}
						>
							
							আরও তথ্য যুক্ত করুন
						</Button>

						<Button
							variant='contained'
							size='large' color='primary'
							className={classes.margin}
							onClick={onEditDate}
						>
						
							তারিখ ও সময় হালনাগাদ করুন
						</Button>
					</Grid>
				</CardContent>
				<AdditionalInfoDialog
					open={infoDialogOpen}
					info={task.additional_info}
					id={task._id}
					handleClose={() => {
						setInfoDialogOpen(false);
					}}
				/>
				<DateTimeDialog
					open={dateDialogOpen}
					date={task.date}
					id={task._id}
					handleClose={() => {
						setDateDialogOpen(false);
					}}
				/>
			</Card>

		</div>
	);
};

export default TaskView;
