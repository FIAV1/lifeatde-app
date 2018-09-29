import React, { Component } from 'react';
import {
    withStyles,
    Typography,
} from '@material-ui/core'
import notfound from '../img/404.png'

class NoMatch extends Component {
    render() {
        const { classes } = this.props;
        return(
            <div className={classes.container}>
                <img src={notfound} className={classes.image} alt="loading..." />
                <Typography align="center" variant="headline" gutterBottom>404</Typography>
                <Typography align="center" variant="subheading">"Questa non è la pagina che stai cercando..."</Typography>
            </div>
        )
    }
}

const styles = theme => ({
    container: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        maxWidth: '100%',
        maxHeight: '100%'
    }
});

export default withStyles(styles)(NoMatch);