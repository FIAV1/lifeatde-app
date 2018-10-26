import React, { Component } from 'react';
import classNames from 'classnames';

import {
    withStyles,
    Snackbar,
    SnackbarContent,
    IconButton
} from '@material-ui/core';

import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import WarningIcon from '@material-ui/icons/Warning';

import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';

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
    queue = [];

    state = {
        open: false,
        variant: 'none',
        message: '',
    };
    
    componentDidMount() {
        showNotifierFn = this.createSnackbar;
    }
    
    createSnackbar = ({ messages, variant }) => {
        if(variant === 'error'){
            this.queue = messages.map(message => ({
                variant,
                message: message.detail,
                key: new Date().getTime()
            }))
        } else if(variant === 'success'){
            this.queue = messages.map(message => ({
                variant,
                message,
                key: new Date().getTime()
            }))
        }
      
        if (this.state.open) {
            this.setState({ open: false });
        } else {
            this.processQueue();
        }
    };

    processQueue = () => {
        if (this.queue.length > 0) {
            let { variant, message, key } = this.queue.shift();
            this.setState({
                open: true,
                variant,
                message,
                key
            }, () => Icon = variantIcon[this.state.variant]);
        }
    };
    
    handleClose = () => {
        this.setState({
            open: false,
        });
    };

    handleExited = () => {
        this.processQueue();
    };
    
    render() {
        const { classes } = this.props;

        return (
            <Snackbar
                key={this.state.key}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                open={this.state.open}
                autoHideDuration={3000}
                onClose={this.handleClose}
                onExited={this.handleExited}
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
        display: 'flex',
        flexWrap: 'nowrap',
        margin: theme.spacing.unit*2,
    }
});
        
export function showNotifier({ messages, variant }){
    showNotifierFn({messages, variant});
};

export default withStyles(styles)(Notifier);