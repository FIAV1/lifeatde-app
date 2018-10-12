import React, { Component } from 'react';

import {
    withStyles
} from '@material-ui/core';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import Authentication from '../lib/Authentication';
import Searchbar from '../components/Searchbar';

class AppContainer extends Component {
    render() {
        if(!Authentication.isAuthenticated()) {
            return this.props.children
        }

        const { classes, ...others } = this.props;

        return(
            <div className={classes.container}>
                <div className={classes.header}>
                    <Navbar className={classes.navbar} {...others}/>
                    <Searchbar className={classes.searchbar}/>
                </div>
                <div className={classes.wrapper}>
                    {this.props.children}
                </div>
                <Footer className={classes.footer}/>
            </div>
        )
    }
}

const styles = theme => ({
    container: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        minHeight: '390px',
    },
    wrapper: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        minHeight: '390px',
        margin: '120px 20px 0',
        [theme.breakpoints.up('sm')]: {
            width: '60%',
            margin: '130px auto 0',
        },
        [theme.breakpoints.up('lg')]: {
            width: '50%'
        }
    },
    header: {
        position: 'fixed',
        backgroundColor: theme.palette.background.default,
        zIndex: 1,
        top: 0,
        right: 0,
        left: 0,
    }
});

export default withStyles(styles)(AppContainer);