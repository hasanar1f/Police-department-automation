import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import HearingForm from './HearingForm';


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

const InputHearing = withStyles(styles)(({ classes }) => (
	<div className={classes.root} id='GD'>
		<Grid container direction='column' spacing='10'>
			<Grid key={'1'} item container>
				<Grid key={'10'} item xs={0} sm={2} />

				<Grid key={'11'} item xs={12} sm={8}>
					<HearingForm key={'111'} />
				</Grid>

				{/* <Grid item xs={0} sm={2} /> */}
			</Grid>
		</Grid>
	</div>
));

export default InputHearing;
