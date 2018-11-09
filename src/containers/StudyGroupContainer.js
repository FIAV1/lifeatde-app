import React, { Component } from 'react';

import Api from '../lib/Api';

import {
    Grid,
    CircularProgress
} from '@material-ui/core';

import StudyGroup from '../components/StudyGroup';
import { showNotifier } from '../components/Notifier';
import  Loader  from '../components/Loader';
import Notifier  from '../components/Notifier';

class StudyGroupContainer extends Component {
    state = {
        loading: true,
        studyGroup: null,
        admins: null
    }

    componentDidMount() {
        Api.get('/study_groups/' + this.props.match.params.id).then(response => {
            this.setState({
                studyGroup: response.data,
                admins: response.included,
                loading: false
            }, () => document.title = `LifeAtDe | ${this.state.studyGroup.attributes.title}`);
        }).catch(({errors}) => {
            showNotifier({messages: errors, variant: 'error'})
        });
    }

    render() {
        const { loading, studyGroup, admins} = this.state;

        if(loading) {
            return <Loader notifier={<Notifier />} />
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

export default StudyGroupContainer;