import React, { Component } from 'react';
import { Button } from '@material-ui/core';
import Notifier, { showNotifier } from '../components/Notifier';

import Api from '../lib/Api';

class ProjectContainer extends Component {
    test = () => {
        Api.get(this.props.history, '/users/11').then(res => console.log(res)).catch(({errors}) => showNotifier({message: errors[0].detail, variant: 'error'}))
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