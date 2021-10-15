import React, { useEffect, useState } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import { fade, makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import { Autocomplete } from '@material-ui/lab';
import { Icon, TextField } from '@material-ui/core';
import getOfficers from '../../../axios/Authentication/getOfficers';

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

const AssignOfficer = (props) => {

	// initially first 5ta officer show kortese.. search er por ei list database theke fetch kore rakhbe

	const classes = useStyles();

	// assigned officer der list
	const [officerList, setOfficerList] = useState([]);
	const [officers, setOfficers] = useState([]);
	const [selected, setSelected] = useState([]);
	let exclude = [];

	const onAssignSubmit = () => {
		props.setOfficers(officers);
		props.handleClose(false);
	};

	props.officers.map(officer => {
		exclude.push(officer.id);
	});

	useEffect(async () => {
		await getOfficers({
			exclude
		}, {
			Authorization: 'Officer ' + localStorage.getItem('token'),
			'content-type': 'application/json'
		}, (res, err) => {
			if (res) {
				setOfficerList(res);
			}
		});
	}, []);


	useEffect(() => {
		officerList.sort();
	}, [officerList]);


	const addOfficer = () => {


		if (officers.indexOf(selected) === -1) {
			setOfficers([...officers, selected]);

			setOfficerList(officerList.filter(value => {
				return value !== selected;
			}));

		}


	};

	const removeOfficer = (val) => {

		setOfficers(officers.filter(value => {
			return value !== val;
		}));

		setOfficerList([...officerList, val]);
	};

	return (

		<div>
			<AppBar position='static' padding={3}>
				<Toolbar>
					<Typography className={classes.title} variant='h6'>
						Select Officers
					</Typography>

					<Autocomplete className={classes.auto}
									  id='combo-box-demo'
									  options={officerList}
									  getOptionLabel={(option) => option.name+",  "+option.rank  }
									  style={{ width: 300 }}
									  renderInput={(params) => <TextField {...params} label='অফিসার নির্বাচন করুন'
																					  variant='outlined' />}
									  onChange={(event, value) => setSelected(value)}
					/>
					<Icon className={classes.plus}
							style={{ fontSize: 30 }}
							onClick={addOfficer}
					>
						add_circle
					</Icon>
					{/*<Icon className="fa fa-plus-circle" color={"primary"} style={{fontSize: 30}}/>*/}
				</Toolbar>
			</AppBar>

			{
				officers.length === 0 ?
					<List className={classes.emptyList} />

					:

					<List className={classes.root}>

						{

							officers.map((value) => {
								const labelId = `checkbox-list-secondary-label-${value}`;
								return (
									officers.length !== 0 &&

									<ListItem key={value._id}>
										<ListItemAvatar>
											<Avatar
												alt={value.name}
												src={`/static/images/avatar/${value.img}.jpg`}
											/>
										</ListItemAvatar>


										<ListItemText id={labelId} primary={`${value.name}`} />

										<ListItemSecondaryAction className={classes.removeButton}>
											<Icon
												style={{ fontSize: 30 }}
												onClick={e => removeOfficer(value)}
											>
												remove_circle
											</Icon>
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
				onClick={() => onAssignSubmit()}
			> জমা দিন </Button>

		</div>
	);
};

export default AssignOfficer;
