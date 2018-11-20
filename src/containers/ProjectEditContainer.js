import React, { Component } from 'react';

import {
    Grid,
} from '@material-ui/core';

import ProjectForm from '../components/projects/ProjectForm';
import Api from '../lib/Api';
import { withSnackbar } from 'notistack';
import Loader from '../components/common/Loader';

class ProjectEditContainer extends Component {
	state = {
		title: '',
		description: '',
		status: '',
		files: [],
		categories: [],
		admin: '',
		collaborators: [],
		results: '',
		loading: true,
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
			let project = response.data;
			this.setState({
				id: project.id,
				title: project.attributes.title,
				description: project.attributes.description,
				status: project.attributes.status.id,
				files: project.attributes.documents,
				categories: project.attributes.categories.map(category => ({value: parseInt(category.id, 10), label: category.name})),
				project: response.data,
                collaborators: this.getCollaborators(response.data.relationships.collaborators, response.included).map(collaborator => ({value: parseInt(collaborator.id, 10), label: `${collaborator.attributes.firstname} ${collaborator.attributes.lastname}`})),
                admin: this.getAdmin(response.data.relationships.admins, response.included),
				results: project.attributes.results,
				loading: false,
			});
		}).catch(({errors}) => {
			errors.forEach(error => this.props.enqueueSnackbar(error.detail, {variant: 'error'}));
		});
	}
	render() {
		const { id, title, description, status, files, categories, admin, collaborators, results, loading } = this.state;

		if (loading) return <Loader />;

		return (
			<Grid container justify="center">
                <Grid item xs={12} md={8}>
                    <ProjectForm
						id={id}
						title={title}
						description={description}
						status={status}
						files={files}
						categories={categories}
						collaborators={collaborators}
						admin={admin}
						results={results}
						edit={true}
					/>
                </Grid>
            </Grid>
		)
	}
}
	
export default withSnackbar(ProjectEditContainer);