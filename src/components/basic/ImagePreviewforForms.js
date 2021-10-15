import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import CancelIcon from '@material-ui/icons/Cancel';

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		flexDirection: 'column'
	},
	imagePreview: {
		width: '100%',
		height: '11vh',
		border: '1px',
		borderColor: 'black',
		borderRadius: '5px',
		boxShadow:
			'0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.50)'
	},
	cancelButton: {
		position: 'absolute',
		top: '4%',
		left: '83%',
		cursor: 'pointer'
	},
	wrap: {
		position: 'relative',
		width: '100%'
	},
	icon: {
		background: 'white',
		borderRadius: '50%',
		boxShadow:
			'0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.50)'
	}
}));

const ImagePreviewForForms = ({ images, removeImage }) => {
	const classes = useStyles();
	return (
		<div className={classes.root} style={{ paddingTop: '20px' }}>
			<Grid container spacing={2}>
				{images.map((image) => {
					return (
						<Grid item xs={8} sm={4} key={URL.createObjectURL(image)}>
							<div>
								<div className={classes.wrap}>
									<img
										key={URL.createObjectURL(image)}
										className={classes.imagePreview}
										src={URL.createObjectURL(image)}
									/>
									<div
										className={classes.cancelButton}
										onMouseDown={(e) => removeImage(image)}
									>
										<CancelIcon className={classes.icon} />
									</div>
								</div>
							</div>
						</Grid>
					);
				})}
			</Grid>
		</div>
	);
};

export default ImagePreviewForForms;
