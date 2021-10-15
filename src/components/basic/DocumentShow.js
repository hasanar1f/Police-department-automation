import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';


const useStyles = makeStyles((theme) => ({
	preview: {
		width: '100%',
		padding: '5px'
	},
	text: {
		fontSize: '2rem',
		color: 'teal',
		textShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.50)',
		cursor: 'pointer'
	}
}));

const DocumentShow = ({ documents }) => {

	const classes = useStyles();
	let count = 1;


	return (
		<div>
			<Grid container spacing={1}>
				{
					documents.map(document => {
						return (
							<Grid
								item xs={6} sm={4}
								key={document}
							>
								<div className={classes.preview}>
									<p className={classes.text}>
										<a href={document} download>
											Document {count++}
										</a>
									</p>
								</div>
							</Grid>
						);
					})
				}
			</Grid>
		</div>
	);

};

export default DocumentShow;
