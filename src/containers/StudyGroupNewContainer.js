import React, { Component } from 'react'

import {
    Grid,
} from '@material-ui/core';

import StudyGroupForm from '../components/study-groups/StudyGroupForm';

class StudyGroupNewContainer extends Component {
    render() {
        return (
            <Grid container justify="center">
                <Grid item xs={12} md={8}>
                    <StudyGroupForm />
                </Grid>
            </Grid>
        )
    }
}

export default StudyGroupNewContainer;