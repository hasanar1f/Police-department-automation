import React from 'react';
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	ListItem,
	Paper
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

const useStyles = makeStyles(theme => ({
	paper: {
		padding: theme.spacing(2),
		textAlign: 'center',
		color: theme.palette.text.primary,
		background: '#FFDDEE'
		// width: '100%'
	},
	text_regular: {
		fontSize: '20px'
	}
}));

const AccusedDetails = ({ accused }) => {
	const classes = useStyles();

	return (
		<Paper elevation={3} className={classes.paper}>
			<Card>
				<CardContent>
					<Typography variant="h5" className={classes.text_regular}>
						<b>{accused.name}</b>
					</Typography>

					<Typography className={classes.text_regular}>
						<b>ঠিকানা: </b>
						{accused.address}
					</Typography>

					{accused.status === 'arrested' ? (
						<Typography className={classes.text_regular}>
							<b>অভিযুক্ত: </b>
							গ্রেপ্তারকৃত
						</Typography>
					) : accused.status === 'not_arrested' ? (
						<Typography className={classes.text_regular}>
							<b>অভিযুক্ত: </b>
							অগ্রেপ্তারকৃত
						</Typography>
					) : (
						<Typography className={classes.text_regular}>
							<b>অভিযুক্ত: </b>
							পলাতক
						</Typography>
					)}

					{accused.afterArrestState === 'under_supervision' ? (
						<Typography className={classes.text_regular}>
							<b>অবস্থান: </b>
							সোর্পদকৃত
						</Typography>
					) : accused.afterArrestState === 'bail' ? (
						<Typography className={classes.text_regular}>
							<b>অবস্থান: </b>
							জামিনপ্রাপ্ত
						</Typography>
					) : (
						<Typography className={classes.text_regular}>
							<b>অবস্থান: </b>
							মুচলেকা
						</Typography>
					)}

					{/* {accused.supervisor &
					(
						<Typography className={classes.text_regular}>
							<b>যার তত্ত্বাবধানে রয়েছে:</b>
							{accused.supervisor}
						</Typography>
					)} */}
				</CardContent>
			</Card>
		</Paper>
	);
};

export default AccusedDetails;
