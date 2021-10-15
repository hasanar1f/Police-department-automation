import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import CancelIcon from '@material-ui/icons/Cancel';

const useStyles = makeStyles((theme) => ({
	preview: {
		// paddingTop:"2rem",
		// paddingLeft:"0.7rem",
		// borderColor: 'black',
		// borderRadius: '5px',
		position: 'relative',
		width: '100%'
	},
	text: {
		fontSize: '1.1rem',
		color: 'teal',
		textShadow:
			'0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.50)',
		cursor: 'pointer'
	},
	cancelButton: {
		position: 'absolute',
		top: '0%',
		left: '83%',
		cursor: 'pointer'
	},
	icon: {
		background: 'white',
		borderRadius: '50%',
		boxShadow:
			'0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.50)'
	},
	linkText: {
		color: 'green',
		fontSize: '1.5rem'
	}
}));

const DocumentPreviewforForms = ({ documents, removeDoc }) => {
	const classes = useStyles();

	return (
		<div>
			<Grid container spacing={3}>
				{documents.map((document) => {
					return (
						<Grid item xs={10} sm={10} key={URL.createObjectURL(document)}>
							<div>
								<div className={classes.preview}>
									<div
										className={classes.cancelButton}
										onMouseDown={(e) => removeDoc(document)}
									>
										<CancelIcon className={classes.icon} />
									</div>

									<p className={classes.text}>
										<a
											href={URL.createObjectURL(document)}
											target='_blank'
											download
											className={classes.linkText}
										>
											{document.name.slice(0, 14) + '...'}
										</a>
									</p>
								</div>
							</div>
						</Grid>
					);
				})}
			</Grid>
		</div>
	);
};

export default DocumentPreviewforForms;
