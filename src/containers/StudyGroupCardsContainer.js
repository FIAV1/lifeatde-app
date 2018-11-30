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
import StudyGroupFilters from '../components/filters/StudyGroupFilters';
import LoadMoreButton from '../components/common/LoadMoreButton';

import { withSnackbar } from 'notistack';

import InfoIcon from '@material-ui/icons/Info';

class StudyGroupCardsContainer extends Component {

    state = {
        loading: true,
        loadingMore: false,
        courseId: LocalStorage.get('user').data.relationships.course.data.id,
        studyGroups: null,
        included: null,
        meta: null,
        currentFilter: '',
    };

    componentDidMount() {
        document.title =  'LifeAtDe | Gruppi di Studio';

        Api.get(`/courses/${this.state.courseId}/study_groups`).then(response => {
            this.setState({
                studyGroups: response.data,
                included: response.included,
                meta: response.meta,
                loading: false,
            })
        }).catch(({errors}) => {
            errors.forEach(error => this.props.enqueueSnackbar(error.detail, {variant: 'error' }));
        });
    }

    removeStudyGroup = (studyGroupId) => {
        let studyGroups = this.state.studyGroups.filter(studyGroup => studyGroup.id !== studyGroupId);

        this.setState({
            studyGroups,
        });
    };

    handleFilter = property => (filteredItems, filteredItemsIncluded, filteredItemsMeta, filters) => {
        this.setState({
            [property]: filteredItems,
            included: filteredItemsIncluded,
            meta: filteredItemsMeta,
            currentFilter: filters,
        });
    }

    loadMore = endpoint => () => {
        this.setState({loadingMore: true});
        Api.get(endpoint).then(response => {
            let studyGroups = this.state.studyGroups;
            let included = this.state.included;

            studyGroups = studyGroups.concat(response.data);
            response.included.forEach(newItem => {
                if (!included.find(oldItem => newItem.id === oldItem.id)) included.push(newItem);
            });

            this.setState({
                studyGroups,
                included,
                meta: response.meta,
            });
        }).catch(({errors}) => {
            errors.forEach(error => this.props.enqueueSnackbar(error, {variant: 'error'}));
        }).finally(() => {
            this.setState({loadingMore: false});
        });
    }

    render() {

        const { loading, loadingMore, studyGroups, included, meta, currentFilter } = this.state;
        const { classes } = this.props;

        if(loading) {
            return <Loader />
        }

        return (
            <div id="studygroup-cards-container">
                <Typography className={classes.header} component="h1" variant="h4" gutterBottom>
                    Gruppi di studio
                </Typography>
                <Typography className={classes.info} component="h2" variant="caption" gutterBottom>
                    <InfoIcon className={classes.icon} />
                    { currentFilter
                    ? `I gruppi di studio sono mostrati in base al corso di studi: ${currentFilter}`
                    : 'I gruppi di studio sono mostrati in base al tuo corso di studi.' }
                </Typography>
                <StudyGroupFilters
                    filters={['courses']}
                    onFilter={this.handleFilter('studyGroups')}
                />
                <Divider className={classes.hr} />
                <StudyGroupCardList
                    studyGroups={studyGroups}
                    included={included}
                    removeStudyGroup={this.removeStudyGroup}
                />
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
    info: {
        display: 'flex',
        alignItems: 'center',
    },
    icon: {
        marginRight: theme.spacing.unit,
    },
    button: {
        width: '40px',
        height: '40px',
        margin: `${theme.spacing.unit}px 0 ${theme.spacing.unit}px ${theme.spacing.unit}px`,
    },
});

export default withSnackbar(withStyles(styles)(StudyGroupCardsContainer));