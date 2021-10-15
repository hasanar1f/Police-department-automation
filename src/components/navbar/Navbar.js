import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';


const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1
	},
	paper: {
		padding: theme.spacing(2),
		textAlign: 'center',
		color: theme.palette.text.secondary
	}
}));


const Navbar = () => {
	const classes = useStyles();

	return (
		<div className={classes.root}>
			<Grid container spacing={1}>
				<Grid item xs>
					<Link to='/dashboard'>
						<Button> হোম </Button>
					</Link>
				</Grid>
				<Grid item xs>
					<Link to='/gd/view'>
						<Button> জিডি দেখুন </Button>
					</Link>
				</Grid>
				<Grid item xs>
					<Link to='/gd/search'>
						<Button> জিডির খোঁজ করুন </Button>
					</Link>
				</Grid>
				<Grid item xs>
					<Link to='/gd/create'>
						<Button> জিডি তৈরি করুন </Button>
					</Link>
				</Grid>
				<Grid item xs>
					<Link to='/'>
						<Button> লগ আউট </Button>
					</Link>
				</Grid>
			</Grid>
		</div>
	);
};

export default Navbar;

