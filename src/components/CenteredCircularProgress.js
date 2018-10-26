import React, { Component } from 'react';

import {
    withStyles,
    CircularProgress,

} from '@material-ui/core';

class CenteredCircularProgress extends Component {

    render() {
        const { size, classes } = this.props;

        return (
            <div className={classes.progressWrapper}>
                <CircularProgress size={size} color="primary" />
            </div>
        )
    }
}

const styles = ({
    progressWrapper: {
        display: 'flex',
        minHeight: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default withStyles(styles)(CenteredCircularProgress);