import React, { Component } from 'react';
import Api from '../lib/Api';

import {
    withStyles,
    Typography,
    Button,
    Divider
} from '@material-ui/core';

import AddIcon from '@material-ui/icons/Add';
import FilterListIcon from '@material-ui/icons/FilterList';

import LocalStorage from '../lib/LocalStorage';

import StudyGroupCardList from '../components/study-groups/StudyGroupCardList';
import Loader from '../components/common/Loader';


import history from '../lib/history';

import { withSnackbar } from 'notistack';

class StudyGroupCardsContainer extends Component {

    state = {
        loading: true,
        course: null,
        studyGroups: null,
        users: null
    };

    componentDidMount() {
        document.title =  'LifeAtDe | Gruppi di Studio';

        const courseId = LocalStorage.get('user').data.relationships.course.data.id;

        Api.get(`/courses/${courseId}/study_groups`).then(response => {
            this.setState({
                studyGroups: response.data,
                users: response.included,
                loading: false,
            })
        }).catch(({errors}) => {
            errors.forEach(error => this.props.enqueueSnackbar(error.detail, {variant: 'error' }));
        });
    }

    removeStudyGroup = (studyGroupId, userId) => {
        let books = this.state.studyGroups.filter(studyGroup => studyGroup.id !== studyGroupId);
        let users = this.state.users.filter(user => user.id !== userId);

        this.setState({
            books,
            users
        });
    };

    render() {

        const {loading, studyGroups, users} = this.state;
        const {classes} = this.props;

        if(loading) {
            return <Loader />
        }

        return (
            <div id="studygroup-cards-container">
                <Typography className={classes.header} component="h1" variant="h4">
                    Gruppi di Studio
                    <div>
                        <Button  onClick={() => history.push('/study_groups/new')} variant="fab" color="primary" aria-label="Add" className={classes.button}>
                            <AddIcon />
                        </Button>
                        <Button variant="fab" color="primary" aria-label="Add" className={classes.button}>
                            <FilterListIcon />
                        </Button>
                    </div>
                </Typography>
                <Divider className={classes.hr} />
                <StudyGroupCardList studyGroups={studyGroups} users={users} onStudyGroupDelete={this.removeStudyGroup}/>
            </div>
        );
    }
}

const styles = theme => ({
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    hr: {
        margin: '0 0 20px',
    },
    button: {
        width: '40px',
        height: '40px',
        margin: `${theme.spacing.unit}px 0 ${theme.spacing.unit}px ${theme.spacing.unit}px`,
    },
});

export default withSnackbar(withStyles(styles)(StudyGroupCardsContainer));