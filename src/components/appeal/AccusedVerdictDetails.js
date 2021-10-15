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

const AccusedVerdictDetails = ({ accused }) => {
	const classes = useStyles();

	return (
		<Paper elevation={3} className={classes.paper}>
			<Card>
				<CardContent>
					<Typography variant="h5" className={classes.text_regular}>
						<b>অভিযুক্তের নাম: </b>
						{accused.name}
					</Typography>

					<Typography className={classes.text_regular}>
						<b>আনত অভিযোগ: </b>
					</Typography>

					<Typography className={classes.text_regular}>
						{accused.accusation}
					</Typography>

					<Typography className={classes.text_regular}>
						<b>অভিযোগ তদন্তের ফলাফল:</b>
					</Typography>

					<Typography className={classes.text_regular}>
						{accused.result}
					</Typography>

					<Typography className={classes.text_regular}>
						<b>রায়: </b>
					</Typography>

					<Typography className={classes.text_regular}>
						{accused.verdict}
					</Typography>
				</CardContent>
			</Card>
		</Paper>
	);
};

export default AccusedVerdictDetails;
