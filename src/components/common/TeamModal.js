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

import fimage from "../../img/federico_frigo.jpg";
import gimage from "../../img/giovanni_fiorini.jpg";
import nimage from "../../img/niccolò_fontana.jpg";
import russ from "../../img/russ.jpg";

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
                            <Avatar alt="Russ Hanneman" src={russ}/>
                            <ListItemText primary="Russ Hanneman" secondary="Major Investor" />
                        </ListItem>
                        <Divider />
                        <ListItem>
                            <Avatar alt="Federico Frigo" src={fimage}/>
                            <ListItemText primary="Federico Frigo" secondary="Chief Design Officer" />
                        </ListItem>
                        <Divider />
                        <ListItem>
                            <Avatar alt="Giovanni Fiorini" src={gimage}/>   
                            <ListItemText primary="Giovanni Fiorini" secondary="Chief Operating Officer" />
                        </ListItem>
                        <Divider />
                        <ListItem>
                            <Avatar alt="Niccolò Fontana" src={nimage}/>  
                            <ListItemText primary="Niccolò Fontana" secondary="Chief Technology Officer" />
                        </ListItem>
                    </List>
                </Dialog>
            </div>
        )
    }
}

const styles = theme => ({
    button: {
        textTransform: 'none',
        [theme.breakpoints.down('lg')]: {
            fontSize: '12px',
        },
    },
    icon: {
        marginRight: theme.spacing.unit,
        [theme.breakpoints.down('lg')]: {
            fontSize: '14px',
        },
    },
});

export default withStyles(styles)(TeamModal);