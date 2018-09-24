import React, { Component } from 'react';

import Authentication from '../lib/Authentication';

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Footer from '../components/Footer';

class AppContainer extends Component {
    render() {
        const { classes } = this.props;

        return(
            <div>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="title" color="inherit" className={classes.grow}>
                            News
                        </Typography>
                        <Button color="inherit" onClick={() => Authentication.logout()}>Logout</Button>
                    </Toolbar>
                </AppBar>
                {this.props.children}
                <Footer />
            </div>
        )
    }
}

const styles = {
    root: {
      flexGrow: 1,
    },
    grow: {
      flexGrow: 1,
    },
    menuButton: {
      marginLeft: -12,
      marginRight: 20,
    },
};

export default withStyles(styles)(AppContainer);