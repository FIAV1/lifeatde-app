import React, { Component } from 'react';
import Api from '../lib/Api';

import {
    withStyles,
    Typography,
    Divider
} from '@material-ui/core';

import LocalStorage from '../lib/LocalStorage';

import StudyGroupCardList from '../components/study-groups/StudyGroupCardList';
import Loader from '../components/common/Loader';
import LoadMoreButton from '../components/common/LoadMoreButton';

import { withSnackbar } from 'notistack';

class StudyGroupCardsContainer extends Component {

    state = {
        loading: true,
        loadingMore: false,
        courseId: LocalStorage.get('user').data.relationships.course.data.id,
        studyGroups: null,
        users: null,
        meta: null,
    };

    componentDidMount() {
        document.title =  'LifeAtDe | Gruppi di Studio';

        Api.get(`/courses/${this.state.courseId}/study_groups`).then(response => {
            this.setState({
                studyGroups: response.data,
                users: response.included,
                meta: response.meta,
                loading: false,
            })
        }).catch(({errors}) => {
            errors.forEach(error => this.props.enqueueSnackbar(error.detail, {variant: 'error' }));
        });
    }

    removeStudyGroup = (studyGroupId) => {
        let books = this.state.studyGroups.filter(studyGroup => studyGroup.id !== studyGroupId);

        this.setState({
            books,
        });
    };

    loadMore = endpoint => () => {
        this.setState({loadingMore: true});
        Api.get(endpoint).then(response => {
            let studyGroups = this.state.studyGroups;
            let users = this.state.users;

            studyGroups = studyGroups.concat(response.data);
            response.included.forEach(user => {
                if (!users.find(el => el.id === user.id)) users.push(user);
            });

            this.setState({
                studyGroups: studyGroups,
                users: users,
                meta: response.meta,
            });
        }).catch(({errors}) => {
            errors.forEach(error => this.props.enqueueSnackbar(error, {variant: 'error'}));
        }).finally(() => {
            this.setState({loadingMore: false});
        });
    }

    render() {

        const { loading, loadingMore, studyGroups, users, meta } = this.state;
        const { classes } = this.props;

        if(loading) {
            return <Loader />
        }

        return (
            <div id="studygroup-cards-container">
                <Typography className={classes.header} component="h1" variant="h4">
                    Gruppi di Studio in base al corso
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
                <StudyGroupCardList studyGroups={studyGroups} users={users} removeStudyGroup={this.removeStudyGroup}/>
                { meta.next
                ? <LoadMoreButton
                    meta={meta}
                    endpoint={`/courses/${this.state.courseId}/study_groups?page=`}
                    loadingMore={loadingMore}
                    loadMore={this.loadMore}
                /> : null }
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