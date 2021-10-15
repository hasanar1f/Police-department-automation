import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { Grid } from '@material-ui/core';
import { useHistory, useLocation } from 'react-router-dom';

const useStyles = makeStyles({
	root: {
		maxWidth: 650,
		marginTop: '15%',
		marginLeft: '40%',
		width: '70%',
		padding: '20px'
	},
	media: {
		height: '400'
	},
	button: {
		// transform: 'scale(1.5)',
		height: '6rem',
		width: '16rem',
		fontSize: '1.5rem'
	}
});

const VisualizeSelect = props => {
	const classes = useStyles();
	const history = useHistory();

	const handleClick = goto => {
		history.push('/visualize/' + goto);
	};

	return (
		<div className={classes.root}>
			<Grid>
				<Grid container direction="column" align="center" spacing={5}>
					{/* <Grid item display="flex" justify="center" xs={12} sm={6}>
						<Button
							className={classes.button}
							size="large"
							variant="contained"
							color="primary"
							onClick={e => handleClick('AllTime')}
						>
							মোট রিপোর্ট
						</Button>
					</Grid> */}

					<Grid item display="flex" justify="center" xs={12} sm={6}>
						<Button
							className={classes.button}
							size="large"
							variant="contained"
							color="primary"
							onClick={e => handleClick('map')}
						>
							মানচিত্র
						</Button>
					</Grid>
				</Grid>
			</Grid>
		</div>
	);
};

export default VisualizeSelect;
