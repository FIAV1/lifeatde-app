import React, { Component } from 'react';
import {
    withStyles,
    Typography
} from '@material-ui/core'

const biasme = [
    'dio porco',
    'dio can',
    'dio mas-cio',
    'madonna cagna',
    'dio sgnagno',
    'madonna véra',
    'dio demone',
    'salve salvino, dio fungo porcino',
    'salve salvino, dio mostro assassino'
]

class NoMatch extends Component {
    render() {
        const { classes } = this.props;
        return(
            <div className={classes.container}>
                <Typography variant="display4">
                {
                    biasme[Math.floor(Math.random() * biasme.length)]
                }
                </Typography>
            </div>
        )
    }
}

const styles = theme => ({
    container: {
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default withStyles(styles)(NoMatch);