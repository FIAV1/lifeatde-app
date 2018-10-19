import React, { Component } from 'react';

import { Grid, Typography } from '@material-ui/core';

import ProjectCard from './ProjectCard';

class ProjectCardList extends Component {

    getAdmin = (project, users) => {
        return users.filter(user => project.relationships.admins.data.filter(admin => admin.id === user.id).length > 0)[0]
    }

    render() {
        const { projects, users } = this.props;
        if((!projects || projects.length === 0) && (!users || users.length === 0)) {
            return(
                <Typography variant="subheading">
                    Non ci sono progetti da visualizzare.
                </Typography>
            )
        }

        return(
            <Grid container spacing={16}>
                {
                    projects.map(project => <ProjectCard key={project.id} project={project} admin={this.getAdmin(project, users)} />)
                }
                {
                    projects.map(project => <ProjectCard key={project.id} project={project} admin={this.getAdmin(project, users)} />)
                }
                {
                    projects.map(project => <ProjectCard key={project.id} project={project} admin={this.getAdmin(project, users)} />)
                }
                {
                    projects.map(project => <ProjectCard key={project.id} project={project} admin={this.getAdmin(project, users)} />)
                }
                {
                    projects.map(project => <ProjectCard key={project.id} project={project} admin={this.getAdmin(project, users)} />)
                }
            </Grid>

        );
    }
}

export default ProjectCardList;