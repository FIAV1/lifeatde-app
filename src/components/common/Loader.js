import React, { Component } from 'react';
import { CircularProgress } from '@material-ui/core';

class Loader extends Component {
    render() {
        return(
            <div style={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <CircularProgress />
            </div>
        );
    }
}

export default Loader;