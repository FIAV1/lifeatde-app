import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import WarningIcon from '@material-ui/icons/Warning';
import { withStyles } from '@material-ui/core/styles';

const variantIcon = {
    success: CheckCircleIcon,
    warning: WarningIcon,
    error: ErrorIcon,
    info: InfoIcon,
    none: ErrorIcon
};

let showNotifierFn;

let Icon = variantIcon['none'];

class Notifier extends Component {
    state = {
        open: false,
        variant: 'none',
        message: '',
    };
    
    componentDidMount() {
        showNotifierFn = this.showNotifier;
    }
    
    showNotifier = ({ message, variant }) => {
        this.setState({
            open: true,
            variant,
            message
        }, () => Icon = variantIcon[this.state.variant]);
    };
    
    handleClose = () => {
        this.setState({
            open: false,
        });
    };
    
    render() {
        const { classes } = this.props;

        return (
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                open={this.state.open}
                autoHideDuration={6000}
                onClose={this.handleClose}
            >
                <SnackbarContent
                    className={classNames(classes[this.state.variant], classes.margin)}
                    aria-describedby="client-snackbar"
                    message={
                        <span id="client-snackbar" className={classes.message}>
                            <Icon className={classNames(classes.icon, classes.iconVariant)} />
                            {this.state.message}
                        </span>
                    }
                    action={[
                        <IconButton
                            key="close"
                            aria-label="Close"
                            color="inherit"
                            className={classes.close}
                            onClick={this.handleClose}
                        >
                        <CloseIcon className={classes.icon} />
                        </IconButton>,
                    ]}
                />
            </Snackbar>
        );
    }
}

const styles = theme => ({
    success: {
        backgroundColor: green[600],
    },
    error: {
        backgroundColor: theme.palette.error.dark,
    },
    info: {
        backgroundColor: theme.palette.primary.dark,
    },
    warning: {
        backgroundColor: amber[700],
    },
    icon: {
        fontSize: 20,
    },
    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing.unit,
    },
    message: {
        display: 'flex',
        alignItems: 'center',
    },
    margin: {
        margin: theme.spacing.unit*2,
    }
});

Notifier.propTypes = {
    classes: PropTypes.object.isRequired,
    message: PropTypes.node,
};
        
export function showNotifier({ message, variant }) {
    showNotifierFn({ message, variant });
}

export default withStyles(styles)(Notifier);