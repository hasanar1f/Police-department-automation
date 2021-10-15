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

const PersonDetails = ({ person }) => {
	const classes = useStyles();

	return (
		<Paper elevation={3} className={classes.paper}>
			<Card>
				<CardContent>
					<Typography variant="h5" className={classes.text_regular}>
						<b>{person.name}</b>
					</Typography>

					<Typography className={classes.text_regular}>
						<b>ঠিকানা: </b>
						{person.address}
					</Typography>
				</CardContent>
			</Card>
		</Paper>
	);
};

export default PersonDetails;
