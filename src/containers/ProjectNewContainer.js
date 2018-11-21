import React, { Component } from 'react'

import {
    Grid,
} from '@material-ui/core';

import ProjectForm from '../components/projects/ProjectForm';

class ProjectNewContainer extends Component {
    render() {
        return (
            <Grid container justify="center">
                <Grid item xs={12} md={8}>
                    <ProjectForm />
                </Grid>
            </Grid>
        )
    }
}

export default ProjectNewContainer;