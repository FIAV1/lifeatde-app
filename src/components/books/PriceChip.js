import React, { Component } from 'react';

import {
    withStyles,
    Chip,
} from '@material-ui/core';


import green from '@material-ui/core/colors/green';

class PriceChip extends Component {

    render() {
        const { price, classes, style } = this.props;

        return(
            <Chip
                className={classes.priceChip}
                label={price && parseInt(price, 10) !== 0 ? `${price} €` : 'Gratis'}
                style={style}
            />
        );
    }

}

const styles = theme => ({
    priceChip: {
        backgroundColor: green[700],
        color: theme.palette.common.white,
        marginBottom: theme.spacing.unit,
    },
});

export default withStyles(styles)(PriceChip);
