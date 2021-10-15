import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TaskAdderForm from './TaskAdderForm';

const styles = theme => ({
	root: {
		flexGrow: 1
	},
	paper: {
		padding: theme.spacing(2),
		textAlign: 'center',
		color: theme.palette.text.secondary
	}
});

const TaskCreator = withStyles(styles)(({ classes }) => (

	<div className={classes.root} id='GD'>
		<Grid container direction='column' spacing='10'>

			<Grid item container>
				<Grid item xs={0} sm={3} />

				<Grid item xs={12} sm={6}>
					<TaskAdderForm />
				</Grid>

				<Grid item xs={0} sm={3} />
			</Grid>
		</Grid>

	</div>

));

export default TaskCreator;


