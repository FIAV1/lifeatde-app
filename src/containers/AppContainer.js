import React, { Component } from 'react';

import {
    withStyles
} from '@material-ui/core';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import Authentication from '../lib/Authentication';

class AppContainer extends Component {
    render() {
        if(!Authentication.isAuthenticated()) {
            return this.props.children
        }

        const { classes, ...others } = this.props;

        return(
            <div className={classes.wrapper}>
                <Navbar {...others}/>
                <div className={classes.wrapper}>
                    {this.props.children}
                </div>
                <Footer className={classes.footer}/>
            </div>
        )
    }
}

const styles = {
    wrapper: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        minHeight: '500px'
    }
}

export default withStyles(styles)(AppContainer);