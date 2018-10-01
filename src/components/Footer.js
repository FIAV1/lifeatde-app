import React, { Component } from 'react';
import classNames from 'classnames';

import {
    withStyles,
    Grid,
    Icon,
    Typography,
    Divider,
} from '@material-ui/core'
import TeamModal from './TeamModal';
import RailsIcon from './RailsIcon'

class Footer extends Component {
    state = {
        open: false
    }

    render() {
        const { classes } = this.props;
        return(
            <footer className={classes.footer} >
                <Grid container direction="row">
                    <Grid item xs={12}>
                        <Divider className={classes.divider} />
                    </Grid>
                </Grid>
                <Grid container direction="row" justify="space-around" className={classes.container}>
                    <Grid item className={classes.item} xs={7} sm={6}>
                        <Typography className={classes.typography}>Crafted with</Typography>
                        <RailsIcon color="action" className={classes.icon} />
                        <Icon color="action" className={classNames(classes.icon, 'fab fa-react')} />
                        <Icon color="action" className={classNames(classes.icon, 'fas fa-heart')} />
                    </Grid>
                    <Grid item className={classes.item} xs={5} sm={6}>
                        <TeamModal />
                    </Grid>
                </Grid>
            </footer>
        )
    }
}

const styles = theme => ({
    footer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: '80px',
        display: 'flex',
        flexDirection: 'column',
    },
    container: {
        flex: 1
    },
    item: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    button: {
        textTransform: 'none'
    },
    typography: {
        [theme.breakpoints.down('sm')]: {
            fontSize: '12px'
        },
    },
    icon: {
        marginLeft: theme.spacing.unit,
        [theme.breakpoints.down('sm')]: {
            fontSize: '14px',
        },
    },
    divider: {
        display:'flex',
        marginLeft: '10%',
        marginRight: '10%',
    },
})

export default withStyles(styles)(Footer);