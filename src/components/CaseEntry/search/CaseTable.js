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
import Crimes from '../../../utils/CrimeCategoryCase';
import CaseStates from '../../../utils/CaseState';
import moment from 'moment';

const columns = [
	{ id: 'title', label: 'শিরোনাম', minWidth: 250, align: 'center' },

	{ id: 'type', label: 'ধরণ', minWidth: 50, align: 'center' },

	{
		id: 'date',
		label: 'রিপোর্টের তারিখ',
		minWidth: 100,
		align: 'center'
	},

	{ id: 'status', label: 'অবস্থা', minWidth: 50 },

	// {
	// 	id: 'closed_date',
	// 	label: 'রায়ের তারিখ',
	// 	minWidth: 50,
	// 	align: 'center'
	// },

	{
		id: 'verdict',
		label: 'রায়',
		minWidth: 80,
		align: 'center'
	}
];

function createData(title, type, date, status, verdict) {
	date = new Date(date).toLocaleDateString();
	// if (closed_date) {
	// 	closed_date = new Date(closed_date).toLocaleDateString();
	// } else {
	// 	closed_date = '-';
	// }

	if (verdict === null) {
		verdict = 'N/A';
	}
	return { title, type, date, status, verdict };
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
		cursor: 'pointer'
	}
});

const CaseTable = props => {
	const classes = useStyles();
	const history = useHistory();
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);
	// const [caseTypeLabel, setCaseTypeLabel] = useState('');
	// const [caseStatusLabel, setCaseStatusLabel] = useState('');

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleClick = (event, item) => {
		let historyParam = {
			_id: props.cases[item]._id
		};

		history.push({
			pathname: '/CaseEntry/view',
			search: '?' + QueryString.stringify(historyParam)
		});
	};

	const handleChangeRowsPerPage = event => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

	let rows = [];
	props.cases.map(_case => {
		const typeLabel = Crimes.map(c => {
			if (c.value === _case.type) {
				return c.label;
			}
		});

		const statusLabel = CaseStates.map(st => {
			if (st.value === _case.status) {
				return st.label;
			}
		});
		rows.push(
			createData(
				_case.subject,
				typeLabel,
				_case.date,
				statusLabel,
				// _case.closed_date,
				_case.verdict
			)
		);
	});

	return (
		<Paper className={classes.root}>
			<TableContainer className={classes.container}>
				<Table stickyHeader aria-label="sticky table">
					<TableHead>
						<TableRow>
							{columns.map(column => (
								<TableCell
									className={classes.cell}
									key={column.id}
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

export default CaseTable;
