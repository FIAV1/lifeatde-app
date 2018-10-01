import React, { Component } from 'react';

import { withStyles, Button } from '@material-ui/core';

import Notifier, { showNotifier } from '../components/Notifier';
import Api from '../lib/Api';

class ProjectContainer extends Component {
    test = () => {
        Api.get('/users/11').then(res => console.log(res)).catch(({errors}) => showNotifier({messages: errors, variant: 'error'}))
    }
    render() {
        const {classes} = this.props;
        return(
            <div>
                <Button
                    onClick={this.test}
                >
                    clicca
                </Button>
                {this.props.history.location.pathname === '/studygroups' ?
                    <div className={classes.test}>

                    </div>
                :
                    null
                }
                <Notifier />
            </div>
        )
    }
}

const styles = {
    test: {
        width: '100px',
        height: '100px',
        backgroundColor: 'red'
    }
}

export default withStyles(styles)(ProjectContainer);