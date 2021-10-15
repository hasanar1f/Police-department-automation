import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1,
		flexDirection: 'row',
		paddingLeft: '10px'
	},
	imagePreview: {
		width: '100%',
		height: '11vh',
		border: '1px',
		borderColor: 'black',
		borderRadius: '5px',
		boxShadow:
			'0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.50)',
		cursor: 'pointer'
	}
}));

const ImageShow = ({ images }) => {
	const classes = useStyles();

	return (
		<Grid
			container
			direction="row"
			alignItems="center"
			justifyContent="flex-start"
			spacing={4}
			style={{ padding: '20px' }}
		>
			{images.map(image => {
				return (
					<Grid item xs={6} sm={3} key={image}>
						<div>
							<a href={image} target="_blank" download>
								<img
									key={image}
									className={classes.imagePreview}
									src={image}
									download
								/>
							</a>
						</div>
					</Grid>
				);
			})}
		</Grid>
	);
};

export default ImageShow;
