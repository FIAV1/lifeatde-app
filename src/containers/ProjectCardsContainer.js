import React, { Component } from 'react';
import Api from '../lib/Api';

import {
    withStyles,
    Typography,
    Divider
} from '@material-ui/core';

import ProjectCardList from '../components/projects/ProjectCardList';
import Loader from '../components/common/Loader';
import LoadMoreButton from '../components/common/LoadMoreButton';
import ProjectFilters from '../components/filters/ProjectFilters';

import { withSnackbar } from 'notistack';

class ProjectCardsContainer extends Component {
    state = {
        loading: true,
        loadingMore: false,
        projects: null,
        included: null,
        meta: null,
    };

    componentDidMount() {
        document.title =  'LifeAtDe | Progetti';

        Api.get('/projects').then(response => {
            this.setState({
                projects: response.data,
                included: response.included,
                meta: response.meta,
                loading: false
            });
        }).catch(({errors}) => {
            errors.forEach(error => this.props.enqueueSnackbar(error.detail, {variant: 'error' }));
        });
    }

    removeProject = (projectId) => {
        let projects = this.state.projects.filter(project => project.id !== projectId);

        this.setState({
            projects,
        });
    };

    handleFilter = property => (filteredItems, filteredItemsIncluded, filteredItemsMeta) => {
        this.setState({
            [property]: filteredItems,
            included: filteredItemsIncluded,
            meta: filteredItemsMeta,
        });
    }

    loadMore = endpoint => () => {
        this.setState({loadingMore: true});
        Api.get(endpoint).then(response => {
            let projects = this.state.projects;
            let included = this.state.included;

            projects = projects.concat(response.data);
            response.included.forEach(newItem => {
                if (!included.find(oldItem => newItem.id === oldItem.id)) included.push(newItem);
            });

            this.setState({
                projects,
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
        const { loading, loadingMore, projects, included, meta } = this.state;
        const { classes } = this.props;

        if(loading) {
            return <Loader />
        }

        return(
            <div id="project-cards-container">
                <Typography className={classes.header} component="h1" variant="h4" gutterBottom>
                    Progetti in base alle preferenze
                </Typography>
                <ProjectFilters
                    filters={['categories']}
                    onFilter={this.handleFilter('projects')}
                />
                <Divider className={classes.hr} />
                <ProjectCardList
                    projects={projects}
                    included={included}
                    removeProject={this.removeProject}
                />
                { meta.next
                ? <LoadMoreButton
                    meta={meta}
                    endpoint="/projects?page="
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
        margin: `${theme.spacing.unit}px 0 ${theme.spacing.unit}px ${theme.spacing.unit}px`,
    },
});

export default withSnackbar(withStyles(styles)(ProjectCardsContainer));