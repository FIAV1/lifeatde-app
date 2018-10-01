import React, { Component } from 'react';

import LocalStorage from '../lib/LocalStorage';

import {
    MuiThemeProvider,
    CssBaseline,
    createMuiTheme
} from '@material-ui/core';

import red from '@material-ui/core/colors/red';
import blue from '@material-ui/core/colors/blue';
import amber from '@material-ui/core/colors/amber';

const lightTheme = {
    palette: {
        type: 'light',
        primary: red,
        secondary: blue,
        error: amber,
        contrastThreshold: 3,
        tonalOffset: 0.2,
    },
};

const darkTheme = {
    palette: {
        type: 'dark',
        primary: red,
        secondary: blue,
        error: amber,
        contrastThreshold: 3,
        tonalOffset: 0.2,
    },
};

class ThemeWrapper extends Component{
    state = {
        theme: LocalStorage.get('theme') || lightTheme
    }

    changeThemeType = () => {
        if(this.state.theme.palette.type === 'light') {
            LocalStorage.set('theme', darkTheme)
            this.setState({
                theme: darkTheme
            });
        } else {
            LocalStorage.set('theme', lightTheme)
            this.setState({
                theme: lightTheme
            });
        }

    }

    getThemeType = () => {
        return LocalStorage.get('theme').palette.type;
    }

    render() {
        return(
            <MuiThemeProvider theme={createMuiTheme(this.state.theme)}
            >
                <CssBaseline>
                    {React.cloneElement(this.props.children, {changeThemeType: this.changeThemeType, getThemeType: this.getThemeType})}
                </CssBaseline>
            </MuiThemeProvider>
        )
    }
}

export default ThemeWrapper;