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
        admins: null
    };

    componentDidMount() {
        Api.get('/study_groups/' + this.props.match.params.id).then(response => {
            this.setState({
                studyGroup: response.data,
                admins: response.included,
                loading: false
            }, () => document.title = `LifeAtDe | ${this.state.studyGroup.attributes.title}`);
        }).catch(({errors}) => {
            errors.forEach(error => this.props.enqueueSnackbar(error.detail, {variant: 'error'}));
        });
    }

    render() {
        const { loading, studyGroup, admins} = this.state;

        if(loading) {
            return <Loader />
        }

        return(
            <Grid container>
                <Grid item xs={12}>
                    <StudyGroup studyGroup={studyGroup} admins={admins} />
                </Grid>
            </Grid>
        );
    }
}

export default withSnackbar(StudyGroupContainer);