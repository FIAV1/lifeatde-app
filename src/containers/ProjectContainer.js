import React, { Component } from 'react';
import { Button } from '@material-ui/core';
import Notifier, { showNotifier } from '../components/Notifier';

import Api from '../lib/Api';

class ProjectContainer extends Component {
    test = () => {
        Api.get('/users/11').then(res => console.log(res)).catch(({errors}) => showNotifier({messages: errors, variant: 'error'}))
    }
    render() {
        return(
            <div>
                <Button
                    onClick={this.test}
                >
                    clicca
                </Button>
                <Notifier />
            </div>
        )
    }
}

export default ProjectContainer;