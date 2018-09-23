import React, { Component } from 'react';
import classNames from 'classnames';
import {
    withStyles,
    Dialog,
    Slide,
    List,
    ListItem,
    Avatar,
    ListItemText,
    Divider,
    Button,
    Icon,
} from '@material-ui/core';

import AccessibleForwardIcon from '@material-ui/icons/AccessibleForward';

const animation = (props) => (
    <Slide direction="up" {...props}/>
)

class TeamModal extends Component {
    state = {
        open: false,
    };

    handleOpen = () => {
        this.setState({ open: true });
    };
    handleClose = () => {
        this.setState({ open: false });
    };

    render() {
        const { classes } = this.props;
        return(
            <div>
                <Button
                    type="button"
                    size="medium"
                    className={classes.button}
                    onClick={this.handleOpen}
                >
                    <Icon color="action" className={classNames(classes.icon, 'fab fa-pied-piper-pp')} />
                    Team
                </Button>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    TransitionComponent={animation}
                    aria-labelledby="pied-piper-team"
                    fullWidth
                    maxWidth="sm"
                >
                    <List>
                        <ListItem>
                            <Avatar>
                                <AccessibleForwardIcon />
                            </Avatar>
                            <ListItemText primary="Federico Frigo" secondary="Js lover <3" />
                        </ListItem>
                        <Divider />
                        <ListItem>
                            <Avatar>
                                <AccessibleForwardIcon />
                            </Avatar>
                            <ListItemText primary="Giovanni Fiorini" secondary="'Kiki, do you love me?" />
                        </ListItem>
                        <Divider />
                        <ListItem>
                            <Avatar>
                                <AccessibleForwardIcon />
                            </Avatar>
                            <ListItemText primary="Niccolò Fontana" secondary="Gonna fuck some names" />
                        </ListItem>
                    </List>
                </Dialog>
            </div>
        )
    }
}

const styles = theme => ({
    button: {
        textTransform: 'none'
    },
    icon: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit
    },
});

export default withStyles(styles)(TeamModal);