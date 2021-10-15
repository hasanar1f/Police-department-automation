import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles({
	root: {
		maxWidth: 650,
		marginTop: '10%',
		marginLeft: '45%',
		width: '70%',
		padding: '20px'
	},
	media: {
		height: '400'
	},
	button: {
		transform: 'scale(2.0)'
	}
});

const MediaCard = props => {
	const classes = useStyles();
	const { history } = props;

	const handleClick = goto => {
		history.push('/CaseEntry/' + goto);
	};

	return (
		<div className={classes.root}>
			<Button
				className={classes.button}
				size="large"
				variant="outlined"
				color="primary"
				onClick={e => handleClick('create')}
			>
				মামলা তৈরি করুন
			</Button>
			<br />
			<br />
			<br />
			<br />
			<br />
			<br />
			<br />
			<Button
				className={classes.button}
				size="large"
				variant="outlined"
				color="primary"
				onClick={e => handleClick('records')}
			>
				মামলা সমূহ দেখুন
			</Button>
		</div>
	);
};

export default MediaCard;
