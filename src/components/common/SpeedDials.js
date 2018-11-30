import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { capitalize } from '@material-ui/core/utils/helpers';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import Icon from '@material-ui/core/Icon';
import history from '../../lib/history';

const styles = theme => ({
	speedDial: {
		position: 'absolute	',
		zIndex: 2000,
		'&$directionUp, &$directionLeft': {
			bottom: theme.spacing.unit * 2,
			right: theme.spacing.unit * 3,
		},
		'&$directionDown, &$directionRight': {
			top: theme.spacing.unit * 2,
      		left: theme.spacing.unit * 3,
		},
	},
	directionUp: {},
	directionRight: {},
	directionDown: {},
	directionLeft: {},
	speedDialAction: {
		position: 'relative',
		zIndex: 2000,
	}
});

const actions = [
	{ icon: <Icon color="action" className={'fas fa-book'} />, name: 'Nuovo libro', route: '/books/new' },
	{ icon: <Icon color="action" className={'fas fa-handshake'} />, name: 'Nuovo gruppo di studio', route: '/study_groups/new' },
	{ icon: <Icon color="action" className={'fas fa-drafting-compass'} />, name: 'Nuovo progetto', route: '/projects/new' },
];

class SpeedDials extends React.Component {
	state = {
		direction: 'up',
		open: false,
		hidden: false,
	};
	
	handleClick = route => () => {
		this.setState(state => ({
			open: !state.open,
		}), () => {
			if (route) history.push(route);
		});
	};
	
	handleClose = () => {
		this.setState({ open: false });
	};
	
	handleOpen = () => {
		this.setState({ open: true });
	};
	
	render() {
		const { classes } = this.props;
		const { direction, hidden, open } = this.state;
		
		const speedDialClassName = classNames(
			classes.speedDial,
			classes[`direction${capitalize(direction)}`],
		);
		
		return (
			<SpeedDial
				ariaLabel="SpeedDial"
				className={speedDialClassName}
				ButtonProps={classes.speedDialButton}
				hidden={hidden}
				icon={<SpeedDialIcon />}
				onBlur={this.handleClose}
				onClick={this.handleClick()}
				onClose={this.handleClose}
				onFocus={this.handleOpen}
				onMouseEnter={this.handleOpen}
				onMouseLeave={this.handleClose}
				open={open}
				direction={direction}
			>
			{actions.map((action) => (
				<SpeedDialAction
					className={classes.speedDialAction}
					key={action.name}
					icon={action.icon}
					tooltipTitle={action.name}
					tooltipOpen
					onClick={this.handleClick(action.route)}
				/>
			))}
			</SpeedDial>
		);
	}
}
			
SpeedDials.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SpeedDials);
			