import React from 'react';
import ReactDOM from 'react-dom';

import { Router } from 'react-router-dom';

import registerServiceWorker from './registerServiceWorker';
import history from './lib/history'
import ThemeWrapper from './components/ThemeWrapper';
import App from './App';

ReactDOM.render((
        <Router history={history}>
            <ThemeWrapper>
                <App history={history}/>
            </ThemeWrapper>
        </Router>
), document.getElementById('root'));

registerServiceWorker();
