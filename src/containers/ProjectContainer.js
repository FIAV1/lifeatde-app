import React, { Component } from 'react';

import Api from '../lib/Api';

import {
    Grid,
    CircularProgress
} from '@material-ui/core';

import Project from '../components/Project';
import { showNotifier } from '../components/Notifier';

class ProjectContainer extends Component {
    state = {
        loading: true,
        project: null,
        team: null
    }

    componentDidMount() {
        Api.get('/projects/' + this.props.match.params.id).then(response => {
            this.setState({
                project: response.data,
                team: response.included,
                loading: false
            }, () => document.title = `LifeAtDe | ${this.state.project.attributes.title}`);
        }).catch(({errors}) => showNotifier({messages: errors, variant: 'error'}));
    }

    render() {
        const { loading, project, team} = this.state;

        if(loading) {
            return <CircularProgress />
        }

        return(
            <Grid container>
                <Grid item xs={12}>
                    <Project project={project} team={team} />
                </Grid>
            </Grid>
        );
    }
}

export default ProjectContainer;