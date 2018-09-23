import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';

import { BrowserRouter } from 'react-router-dom';

import { MuiThemeProvider, CssBaseline } from '@material-ui/core';
import Theme from './lib/Theme';

import App from './App';

ReactDOM.render((
    <MuiThemeProvider theme={Theme}>
        <BrowserRouter>
            <CssBaseline>
                <App/>
            </CssBaseline>
        </BrowserRouter>
    </MuiThemeProvider>
), document.getElementById('root'));

registerServiceWorker();
