import React, { Component } from 'react';

import {
	withStyles,
	Button,
	Typography,
	CircularProgress
} from '@material-ui/core';

class LoadMoreButton extends Component {
	render() {
		const { classes, endpoint, meta, loadingMore, loadMore } = this.props;

		return (
			<div>
			<div className={classes.wrapper}>
				<Button
					type="button"
					onClick={loadMore(`${endpoint}${meta.next}`)}
					color="primary"
					disabled={loadingMore}
					variant="text"
				>
					<Typography color="primary" variant="caption">Carica altri...</Typography>
				</Button>
				{loadingMore && <CircularProgress size={24} className={classes.buttonProgress} />}
			</div>
			</div>
		)
	}
}

const styles = theme => ({
	wrapper: {
		display: 'flex',
		position: 'relative',
		marginTop: theme.spacing.unit * 2,
		justifyContent: 'center',
	},
	buttonProgress: {
		position: 'absolute',
		top: '50%',
		left: '50%',
		marginTop: -12,
		marginLeft: -12,
	},
})

export default withStyles(styles)(LoadMoreButton);