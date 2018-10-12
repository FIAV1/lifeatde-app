import React, { Component } from 'react';

import { Grid } from '@material-ui/core';

import ProjectCard from './ProjectCard';

class ProjectCardList extends Component {

    getAdmin = (project, users) => {
        return users.filter(user => project.relationships.admins.data.filter(admin => admin.id === user.id).length > 0)[0]
    }

    render() {
        const { projects, users } = this.props;
        
        return(
            <Grid container>
                {
                    projects.map(project => <ProjectCard key={project.id} project={project} admin={this.getAdmin(project, users)} />)
                }
            </Grid>

        );
    }
}

export default ProjectCardList;