import React, { Component } from 'react';
import {
    withStyles,
    Typography
} from '@material-ui/core'
import notfound from '../img/404.gif'

class NoMatch extends Component {
    render() {
        const { classes } = this.props;
        return(
            <div className={classes.container}>
                <Typography className={classes.item} variant="display4">
                    404 - Not found
                    <img src={notfound} alt="loading..." />
                </Typography>
            </div>
        )
    }
}

const styles = theme => ({
    container: {
        display: 'flex',
        height: '100vh',
        width: '100vw',
        alignItems: 'center',
        justifyContent: 'center'
    },
    item: {
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column'
    }
});

export default withStyles(styles)(NoMatch);