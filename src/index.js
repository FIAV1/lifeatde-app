import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';

import { Router } from 'react-router-dom';
import history from './lib/history'

import { MuiThemeProvider, CssBaseline } from '@material-ui/core';
import Theme from './lib/Theme';

import App from './App';

ReactDOM.render((
    <MuiThemeProvider theme={Theme}>
        <Router history={history}>
            <CssBaseline>
                <App/>
            </CssBaseline>
        </Router>
    </MuiThemeProvider>
), document.getElementById('root'));

registerServiceWorker();
