import React, { Component } from 'react';

import Api from '../lib/Api';

import {
    Grid,
} from '@material-ui/core';

import StudyGroup from '../components/study-groups/StudyGroup';
import Loader from '../components/common/Loader';

import { withSnackbar } from 'notistack';

class StudyGroupContainer extends Component {
    state = {
        loading: true,
        studyGroup: null,
        included: null,
    };

    componentDidMount() {
        Api.get('/study_groups/' + this.props.match.params.id).then(response => {
            this.setState({
                studyGroup: response.data,
                included: response.included,
                loading: false
            }, () => document.title = `LifeAtDe | ${this.state.studyGroup.attributes.title}`);
        }).catch(({errors}) => {
            errors.forEach(error => this.props.enqueueSnackbar(error.detail, {variant: 'error'}));
        });
    }

    getAdmin = adminId =>
        this.state.included.find(item => item.type === 'user' && item.id === adminId);

    getCourse = courseId =>
        this.state.included.find(item => item.type === 'course' && item.id === courseId);

    render() {
        const { loading, studyGroup} = this.state;

        if(loading) {
            return <Loader />
        }

        return(
            <Grid container>
                <Grid item xs={12}>
                    <StudyGroup
                        studyGroup={studyGroup}
                        admin={this.getAdmin(studyGroup.relationships.user.data.id)}
                        course={this.getCourse(studyGroup.relationships.course.data.id)}
                    />
                </Grid>
            </Grid>
        );
    }
}

export default withSnackbar(StudyGroupContainer);