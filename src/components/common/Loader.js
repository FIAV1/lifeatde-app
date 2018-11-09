import React, { Component } from 'react';
import { CircularProgress } from '@material-ui/core';

class Loader extends Component {
    render() {
        const { notifier } = this.props;
        
        return(
            <div style={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <CircularProgress />
                {notifier}
            </div>
        );
    }
}

export default Loader;