import React, { Component } from 'react';

import PropTypes from 'prop-types';
import classNames from 'classnames';

import { withStyles, CircularProgress } from '@material-ui/core'

import LocalStorage from '../lib/LocalStorage';
import Notifier, { showNotifier } from '../components/Notifier';

import Api from '../lib/Api';

import StudyGroupList from '../components/StudyGroupList';

class StudyGroupContainer extends Component {

    state = {
        loading: true,
        course: LocalStorage.get('user').included[3],
        study_groups: null,
        users: null
    }

    componentDidMount() {
        Api.get('/courses/'+ this.state.course.id + '/study_groups').then(response =>{
            this.setState({
                study_groups: response.data,
                users: response.included,
                loading: false
            })
        }).catch(({errors}) => {
            showNotifier({ messages: errors, variant: 'error' });
        });
    }

    render() {

        const {classes} = this.props;
        const {loading} = this.state;

        if(loading) {
            return <CircularProgress size={80} color='primary'/>
        }

        return (
            <div>
                <Notifier/>
                <StudyGroupList study_groups={this.state.study_groups} users={this.state.users}/>
            </div>
            
        )
    }
}

const styles = {
    test: {
        width: '100px',
        height: '100px',
        backgroundColor: 'red'
    }
}

export default withStyles(styles)(StudyGroupContainer);