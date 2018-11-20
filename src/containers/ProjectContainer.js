import React, { Component } from 'react';

import Api from '../lib/Api';

import {
    Grid,
} from '@material-ui/core';

import Project from '../components/projects/Project';
import Loader from '../components/common/Loader';

import { withSnackbar } from 'notistack';

class ProjectContainer extends Component {
    state = {
        loading: true,
        project: null,
        admin: null,
        collaborators: null,
    }
    
    getCollaborators = (collaborators, team) => {
        let collaboratorsKey = collaborators.data.map(collaborator => collaborator.id);

        return team.filter(member => collaboratorsKey.indexOf(member.id) > -1);
    }

    getAdmin = (admins, team) => {
        let adminsKey = admins.data.map(admin => admin.id);

        return team.filter(member => adminsKey.indexOf(member.id) > -1)[0];
    }

    componentDidMount() {
        Api.get('/projects/' + this.props.match.params.id).then(response => {
            this.setState({
                project: response.data,
                collaborators: this.getCollaborators(response.data.relationships.collaborators, response.included),
                admin: this.getAdmin(response.data.relationships.admins, response.included),
                loading: false
            }, () => document.title = `LifeAtDe | ${this.state.project.attributes.title}`);
        }).catch(({errors}) => {
            errors.map(error => this.props.enqueueSnackbar(error.detail, {variant: 'error'}));
        });
    }

    render() {
        const { loading, project, admin, collaborators} = this.state;

        if(loading) {
            return <Loader />
        }

        return(
            <Grid container>
                <Grid item xs={12}>
                    <Project project={project} admin={admin} collaborators={collaborators} />
                </Grid>
            </Grid>
        );
    }
}

export default withSnackbar(ProjectContainer);