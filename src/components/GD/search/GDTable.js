import React from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import * as QueryString from 'querystring';
import Crimes from '../../../utils/CrimeCategoryGD';
import gdStates from '../../../utils/gdStates';
import BanglaDate from '../../../utils/banglaDate';

const columns = [
	{ id: 'title', label: 'শিরোনাম', minWidth: 250, align: 'center' },

	{ id: 'type', label: 'ধরন', minWidth: 50, align: 'center' },

	{
		id: 'date',
		label: 'রিপোর্টের তারিখ',
		minWidth: 100,
		align: 'center'
	},

	{ id: 'status', label: 'বর্তমান অবস্থা', minWidth: 50 }
];

function createData(title, type, date, status) {
	date = new Date(date).toLocaleDateString();
	// date = BanglaDate(date);
	return { title, type, date, status };
}

const useStyles = makeStyles({
	root: {
		width: '90%'
	},
	container: {
		maxHeight: 400,
		minHeight: 400
	},
	cell: {
		cursor: 'pointer',
	}
});

const GDTable = props => {
	const classes = useStyles();
	const history = useHistory();
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleClick = (event, item) => {
		let historyParam = {
			_id: props.gds[item]._id
		};

		history.push({
			pathname: '/gd/view',
			search: '?' + QueryString.stringify(historyParam)
		});
	};

	const handleChangeRowsPerPage = event => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

	let rows = [];
	props.gds.map(gd => {
		const topicLabel = Crimes.map(c => {
			if (c.value === gd.topic) {
				return c.label;
			}
		});

		const statusLabel = gdStates.map(st => {
			if (st.value === gd.status) {
				return st.label;
			}
		});

		rows.push(createData(gd.title, topicLabel, gd.date, statusLabel));
	});

	console.log(rows);

	return (
		<Paper className={classes.root}>
			<TableContainer className={classes.container}>
				<Table stickyHeader aria-label="sticky table">
					<TableHead>
						<TableRow>
							{columns.map(column => (
								<TableCell
									key={column.id}
									className={classes.cell}
									align={column.align}
									style={{ minWidth: column.minWidth }}
								>
									<b>{column.label}</b>
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{rows
							.slice(
								page * rowsPerPage,
								page * rowsPerPage + rowsPerPage
							)
							.map((row, i) => {
								return (
									<TableRow
										hover
										role="checkbox"
										tabIndex={-1}
										key={i}
										onClick={event => handleClick(event, i)}
									>
										{columns.map(column => {
											const value = row[column.id];
											return (
												<TableCell
													className={classes.cell}
													key={column.id}
													align={column.align}
												>
													{value}
												</TableCell>
											);
										})}
									</TableRow>
								);
							})}
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				rowsPerPageOptions={[7, 13, 25]}
				labelRowsPerPage={'প্রতি পৃষ্ঠায় সারি সংখ্যা'}
				component="div"
				count={rows.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onChangePage={handleChangePage}
				onChangeRowsPerPage={handleChangeRowsPerPage}
			/>
		</Paper>
	);
};

export default GDTable;
