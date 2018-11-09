import React, { Component } from 'react';

import { withStyles } from '@material-ui/core';
import { Link } from "react-router-dom";

class Anchor extends Component {

    render() {
        const { to, children, classes } = this.props;

        return (
            <Link to={to} className={classes.link} >{children}</Link>
        );
    }

}

const styles = theme => ({
    link: {
        color: theme.palette.text.primary,
        textDecoration: 'none',
        '&:hover': {
            color: theme.palette.primary.main,
        }
    }
});

export default withStyles(styles)(Anchor);
