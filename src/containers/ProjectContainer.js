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
        projects: null,
        categories: null,
        admin: null,
        collaborators: null,
        projectStatus: null,
    }
    
    getProjectStatus = projectStatusId => 
        this.state.included.find(item => item.type === 'project_status' && item.id === projectStatusId);

    getAdmin = adminIds =>
        this.state.included.filter(item => item.type === 'user' && adminIds.find(adminId => item.id === adminId.id))[0];

    getCollaborators = collaboratorIds =>
        this.state.included.filter(item => item.type === 'user' && collaboratorIds.find(collaboratorId => item.id === collaboratorId.id));

    getCategories = categoryIds =>
        this.state.included.filter(item => item.type === 'category' && categoryIds.find(categoryId => item.id === categoryId.id));

    componentDidMount() {
        Api.get('/projects/' + this.props.match.params.id).then(response => {
            this.setState({
                project: response.data,
                included: response.included,
                loading: false
            }, () => document.title = `LifeAtDe | ${this.state.project.attributes.title}`);
        }).catch(({errors}) => {
            errors.map(error => this.props.enqueueSnackbar(error.detail, {variant: 'error'}));
        });
    }

    render() {
        const { loading, project } = this.state;

        if(loading) {
            return <Loader />
        }

        return(
            <Grid container>
                <Grid item xs={12}>
                    <Project
                        project={project}
                        projectStatus={this.getProjectStatus(project.relationships.project_status.data.id)}
                        admin={this.getAdmin(project.relationships.admins.data)}
                        collaborators={this.getCollaborators(project.relationships.collaborators.data)}
                        categories={this.getCategories(project.relationships.categories.data)}
                    />
                </Grid>
            </Grid>
        );
    }
}

export default withSnackbar(ProjectContainer);