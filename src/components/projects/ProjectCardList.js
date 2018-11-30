import React, { Component } from 'react';

import { Grid, Typography } from '@material-ui/core';

import ProjectCard from './ProjectCard';

class ProjectCardList extends Component {
    getProjectStatus = projectStatusId => 
        this.props.included.find(item => item.type === 'project_status' && item.id === projectStatusId);

    getAdmin = adminIds =>
        this.props.included.filter(item => item.type === 'user' && adminIds.find(adminId => item.id === adminId.id))[0];

    getCategories = categoryIds =>
        this.props.included.filter(item => item.type === 'category' && categoryIds.find(categoryId => item.id === categoryId.id));

    render() {
        const { projects } = this.props;

        if(!projects || projects.length === 0) {
            return(
                <Typography variant="subtitle1">
                    Non ci sono progetti da visualizzare.
                </Typography>
            )
        }

        return(
            <Grid container spacing={16}>
                { 
                    projects.map(project =>
                        <ProjectCard
                            key={project.id}
                            project={project}
                            projectStatus={this.getProjectStatus(project.relationships.project_status.data.id)}
                            admin={this.getAdmin(project.relationships.admins.data)}
                            categories={this.getCategories(project.relationships.categories.data)}
                            removeProject={this.props.removeProject}
                        />)
                }
            </Grid>

        );
    }
}

export default ProjectCardList;