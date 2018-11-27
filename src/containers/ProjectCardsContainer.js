import React, { Component } from 'react';
import Api from '../lib/Api';

import {
    withStyles,
    Typography,
    Divider
} from '@material-ui/core';

import ProjectCardList from '../components/projects/ProjectCardList';
import Loader from '../components/common/Loader';
import ProjectFilters from '../components/filters/ProjectFilters';

import { withSnackbar } from 'notistack';

class ProjectCardsContainer extends Component {
    state = {
        loading: true,
        projects: null,
        users: null
    };

    componentDidMount() {
        document.title =  'LifeAtDe | Progetti';

        Api.get('/projects').then((response) => {
            this.setState({
                projects: response.data,
                users: response.included,
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

    handleFilter = property => filteredItems => {
        this.setState({[property]: filteredItems});
    }

    render() {
        const { loading, projects, users } = this.state;
        const { classes } = this.props;

        if(loading) {
            return <Loader />
        }

        return(
            <div id="project-cards-container">
                <Typography className={classes.header} variant="h4" gutterBottom>
                    Progetti
                </Typography>
                <ProjectFilters
                    filters={['categories']}
                    onFilter={this.handleFilter('projects')}
                />
                <Divider className={classes.hr} />
                <ProjectCardList projects={projects} users={users} removeProject={this.removeProject} />
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