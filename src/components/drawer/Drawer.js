import React from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/Home';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import ForumIcon from '@material-ui/icons/Forum';
import WhatshotIcon from '@material-ui/icons/Whatshot';
import Grid from '@material-ui/core/Grid';
import ImportContactsIcon from '@material-ui/icons/ImportContacts';
import {
	createMuiTheme,
	withStyles,
	ThemeProvider
} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { blue } from '@material-ui/core/colors';
import logout from '../../axios/Authentication/logout';
import { Redirect, withRouter } from 'react-router-dom';
import login from '../../axios/Authentication/login';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex'
	},
	appBar: {
		zIndex: theme.zIndex.drawer + 1,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen
		})
	},
	appBarShift: {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen
		})
	},
	menuButton: {
		drawer: {
			marginRight: 36
		},
		hide: {
			display: 'none'
		},
		width: drawerWidth,
		flexShrink: 0,
		whiteSpace: 'nowrap'
	},
	drawerOpen: {
		width: drawerWidth,
		transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen
		})
	},
	drawerClose: {
		transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen
		}),
		overflowX: 'hidden',
		width: theme.spacing(7) + 1,
		[theme.breakpoints.up('sm')]: {
			width: theme.spacing(9) + 1
		}
	},
	toolbar: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-end',
		padding: theme.spacing(0, 1),
		// necessary for content to be below app bar
		...theme.mixins.toolbar
	},
	content: {
		flexGrow: 2,
		padding: theme.spacing(3)
	},

	iconCustom: {
		height: '4rem',
		transform: 'translate(20px, 10px) scale(1.5)'
	},

	iconText: {
		height: '4rem',
		transform: 'scale(1.2)',
		padding: '0.33rem 1.8rem'
	}
}));

const ColorButton = withStyles(theme => ({
	root: {
		color: '#4a148c',
		backgroundColor: '#e0f2f1',
		'&:hover': {
			backgroundColor: '#29b6f6'
		}
	}
}))(Button);

const Dashboard = props => {
	const classes = useStyles();
	const theme = useTheme();
	const [open, setOpen] = React.useState(false);
	const { history } = props;
	const officer = JSON.parse(localStorage.getItem('officer'));

	const handleLogout = () => {
		logout(
			{
				Authorization: 'Officer ' + localStorage.getItem('token')
			},
			function (res, err) {
				if (res) {
					localStorage.clear();
					history.push('/login');
				}
			}
		);
	};

	const handleDrawerOpen = () => {
		setOpen(true);
	};

	const handleDrawerClose = () => {
		setOpen(false);
	};

	const fields = [
		{
			text: '🌎 হোম',
			icon: <HomeIcon />,
			onClick: () => history.push('/home')
		},
		{
			text: '🗒 জিডি সমূহ',
			icon: <LibraryBooksIcon />,
			onClick: () => history.push('/Gd/records')
		},
		{
			text: '🗃 মামলা সমূহ',
			icon: <ForumIcon />,
			onClick: () => history.push('/CaseEntry/records')
		},
		{
			text: '📊 পরিসংখ্যান',
			icon: <WhatshotIcon />,
			onClick: () => history.push('/visualize/map')
		},
		{
			text: '📝 জিডি করুন',
			icon: <ImportContactsIcon />,
			onClick: () => history.push('/GD/create')
		},
		{
			text: '🔖 মামলা করুন',
			icon: <BorderColorIcon />,
			onClick: () => history.push('/CaseEntry/create')
		}
	];
	return (
		<div className={classes.root}>
			<CssBaseline />
			<AppBar
				position="fixed"
				className={clsx(classes.appBar, {
					[classes.appBarShift]: open
				})}
			>
				<Toolbar>
					<IconButton
						color="inherit"
						aria-label="open drawer"
						onClick={handleDrawerOpen}
						edge="start"
						className={clsx(classes.menuButton, {
							[classes.hide]: open
						})}
					>
						<MenuIcon />
					</IconButton>

					<Grid
						container
						direction="row"
						justifyContent="space-between"
						alignItems="center"
						spacing={10}
					>
						<Grid item xs={12} sm={10}>
							<Typography variant="h4"> 🇧🇩 বাংলাদেশ পুলিশ</Typography>
						</Grid>
						<Grid item xs={12} sm={2}>
							{officer && (
								<ColorButton
									variant="contained"
									color="primary"
									onClick={() => handleLogout()}
								>
									লগ আউট
								</ColorButton>
							)}
						</Grid>
					</Grid>
				</Toolbar>
			</AppBar>
			<Drawer
				variant="permanent"
				className={clsx(classes.drawer, {
					[classes.drawerOpen]: open,
					[classes.drawerClose]: !open
				})}
				classes={{
					paper: clsx({
						[classes.drawerOpen]: open,
						[classes.drawerClose]: !open
					})
				}}
			>
				<div className={classes.toolbar}>
					<IconButton onClick={handleDrawerClose}>
						{theme.direction === 'rtl' ? (
							<ChevronRightIcon />
						) : (
							<ChevronLeftIcon />
						)}
					</IconButton>
				</div>
				<Divider />
				<List>
					{fields.map(item => (
						<ListItem button key={item.text} onClick={item.onClick}>
							<ListItemIcon className={classes.iconCustom}>
								{item.icon}
							</ListItemIcon>
							<ListItemText
								className={classes.iconText}
								primary={item.text}
							/>
						</ListItem>
					))}
				</List>
			</Drawer>

			<main>
				{/* <div className={classes.toolbar} /> */}
				{props.children}
			</main>
		</div>
	);
};

export default withRouter(Dashboard);
