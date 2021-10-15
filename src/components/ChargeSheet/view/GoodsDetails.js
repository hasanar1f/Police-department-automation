import React from 'react';
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	ListItem
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import { Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent } from '@material-ui/core';
import moment from 'moment';

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

const GoodsDetails = ({ good }) => {
	const classes = useStyles();

	return (
		<Paper elevation={3} className={classes.paper}>
			<Card>
				<CardContent>
					<Typography variant="h5" className={classes.text_regular}>
						<b>মালামালের ধরণ: </b>
						{good.nature}
					</Typography>

					<Typography className={classes.text_regular}>
						<b>পরিমাণ: </b>
						{good.quantity}
					</Typography>

					<Typography className={classes.text_regular}>
						<b>তারিখ: </b>
						{moment(good.date).format('DD/MM/YYYY')}
					</Typography>

					<Typography className={classes.text_regular}>
						<b>প্রাপ্তির স্থান: </b>
						{good.location}
					</Typography>

					<Typography className={classes.text_regular}>
						<b>যার কাছে পাওয়া যায়: </b>
						{good.collected_from}
					</Typography>

					<Typography className={classes.text_regular}>
						<b>যার দ্বারা উদ্ধার হয়: </b>
						{good.collected_by}
					</Typography>

					{good.sent_to_magistrate ? (
						<Typography className={classes.text_regular}>
							<b>ম্যাজিস্ট্রেটের নিকট পাঠানো হয়েছে: </b>
							✅ হ্যাঁ
						</Typography>
					) : (
						<Typography className={classes.text_regular}>
							<b>ম্যাজিস্ট্রেটের নিকট পাঠানো হয়েছে: </b>
							⛔️ না
						</Typography>
					)}
				</CardContent>
			</Card>
		</Paper>
	);
};

export default GoodsDetails;
