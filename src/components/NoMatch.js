import React, { Component } from 'react';

import {
    withStyles,
    Typography,
    Grid
} from '@material-ui/core'
import notfound from '../img/404.png'

class NoMatch extends Component {
    render() {
        const { classes } = this.props;
        return(
            <Grid container className={classes.container}>
                <Grid item xs={8} sm={4}>
                    <img src={notfound} className={classes.image} alt="loading..." />
                    <Typography align="center" variant="headline" gutterBottom>404</Typography>
                    <Typography align="center" variant="subheading">"Questa non è la pagina che stai cercando..."</Typography>
                </Grid>
            </Grid>
        )
    }
}

const styles = theme => ({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    image: {
        display: 'block',
        margin: 'auto',
        maxWidth: '100%',
    }
});

export default withStyles(styles)(NoMatch);