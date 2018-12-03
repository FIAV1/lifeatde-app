import React, { Component } from 'react';

import {
    Grid,
} from '@material-ui/core';

import ProjectForm from '../components/projects/ProjectForm';
import Api from '../lib/Api';
import { withSnackbar } from 'notistack';
import Loader from '../components/common/Loader';
import LocalStorage from "../lib/LocalStorage";
import history from "../lib/history";

class ProjectEditContainer extends Component {
	state = {
		loading: true,
		project: null,
		included: null,
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
		Api.get(`/projects/${this.props.match.params.id}`).then(response => {
			const adminId = response.data.relationships.admins.data[0].id;
            if (adminId !== LocalStorage.get('user').data.id) {
                history.push(`/projects/${this.props.match.params.id}`, 302);
            } else {
                this.setState({
                    loading: false,
                    project: response.data,
                    included: response.included,
                });
            }
		}).catch(({errors}) => {
			errors.forEach(error => this.props.enqueueSnackbar(error.detail, {variant: 'error'}));
		});
	}
	render() {
		const { loading, project } = this.state;

		if (loading) return <Loader />;

		return (
			<Grid container justify="center">
                <Grid item xs={12} md={8}>
                    <ProjectForm
						id={project.id}
						title={project.attributes.title}
						description={project.attributes.description}
						projectStatus={this.getProjectStatus(project.relationships.project_status.data.id)}
						documents={project.attributes.documents}
						categories={this.getCategories(project.relationships.categories.data)}
						collaborators={this.getCollaborators(project.relationships.collaborators.data)}
						admin={this.getAdmin(project.relationships.admins.data)}
						results={project.attributes.results}
						edit
					/>
                </Grid>
            </Grid>
		)
	}
}
	
export default withSnackbar(ProjectEditContainer);