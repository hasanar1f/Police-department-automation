import React from 'react';
import { fade, makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Checkbox from '@material-ui/core/Checkbox';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { AppBar } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
		fullWidth: '100%',
		backgroundColor: theme.palette.background.paper
	},
	search: {
		position: 'relative',
		borderRadius: theme.shape.borderRadius,
		backgroundColor: fade(theme.palette.common.white, 0.15),
		'&:hover': {
			backgroundColor: fade(theme.palette.common.white, 0.25)
		},
		marginLeft: 0,
		width: '100%',
		[theme.breakpoints.up('sm')]: {
			marginLeft: theme.spacing(10),
			width: 'auto'
		}
	},
	searchIcon: {
		padding: theme.spacing(0, 20),
		height: '100%',
		position: 'absolute',
		pointerEvents: 'none',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center'
	},

	auto: {
		backgroundColor: '#fff'
	},

	title: {
		marginRight: theme.spacing(5)
	},

	plus: {
		marginLeft: theme.spacing(5)
	},

	emptyList: {
		height: '40px'
	}
}));

const RemoveOfficerModal = (props) => {

	const classes = useStyles();
	const [checked, setChecked] = React.useState([]);
	let officers = [];
	props.officers.map(officer => {
		if (officer.to === undefined) {
			officers.push(officer);
		}
	});

	const onRemoveSubmit = () => {
		props.setOfficers(checked);
		props.handleClose(false);
	};

	const handleToggle = (value) => () => {
		const currentIndex = checked.indexOf(value);
		const newChecked = [...checked];

		if (currentIndex === -1) {
			newChecked.push(value);
		} else {
			newChecked.splice(currentIndex, 1);
		}

		setChecked(newChecked);
	};

	return (
		<div>
			<AppBar position='static' padding={1}>
				<Toolbar>
					<Typography className={classes.title} variant='h6'>
						Select Officers
					</Typography>
				</Toolbar>
			</AppBar>

			{
				officers.length === 0 ?
					<List className={classes.emptyList} />

					:

					<List dense className={classes.root}>
						{
							officers.map(officer => {
								return (
									<ListItem key={officer.id} button>
										<ListItemAvatar>
											<Avatar
												alt={officer.officer.name}
											/>
										</ListItemAvatar>
										<ListItemText id={officer.id} primary={officer.officer.name} />
										<ListItemSecondaryAction>
											<Checkbox
												edge='end'
												onChange={handleToggle(officer)}
												checked={checked.indexOf(officer) !== -1}
												inputProps={{ 'aria-labelledby': officer.id }}
											/>
										</ListItemSecondaryAction>
									</ListItem>
								);
							})
						}
					</List>

			}
			<Button
				fullWidth
				label='জমা দিন'
				variant='contained'
				color='primary'
				onClick={() => onRemoveSubmit()}
			> জমা দিন </Button>
		</div>

	);
};


export default RemoveOfficerModal;
