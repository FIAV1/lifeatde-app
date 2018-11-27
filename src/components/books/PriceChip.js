import React, { Component } from 'react';

import {
    withStyles,
    Chip,
} from '@material-ui/core';


import green from '@material-ui/core/colors/green';

class PriceChip extends Component {

    render() {
        const { price, classes, style } = this.props;

        let label = `${price} €`;
        // price is 0
        if (parseInt(price, 10) === 0) label = 'Gratis';
        // price is int
        else if (price % 1 === 0) label = `${parseInt(price, 10)} €`;

        return(
            <Chip
                className={classes.priceChip}
                label={label}
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
