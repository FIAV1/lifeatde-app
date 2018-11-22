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

import ProjectCardList from '../components/projects/ProjectCardList';
import Loader from '../components/common/Loader';

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

    removeProject = (projectId, adminId) => {
        let projects = this.state.projects.filter(project => project.id !== projectId);
        let users = this.state.users.filter(user => user.id !== adminId);

        this.setState({
            projects,
            users,
        });
    };

    render() {
        const { loading, projects, users } = this.state;
        const { classes, history } = this.props;

        if(loading) {
            return <Loader />
        }

        return(
            <div id="project-cards-container">
                <Typography className={classes.header} variant="h4">
                    Progetti
                    <div>
                        <Button onClick={() => history.push('/projects/new')} variant="fab" mini color="primary" aria-label="Aggiungi" className={classes.button}>
                            <AddIcon />
                        </Button>
                        <Button variant="fab" mini color="primary" aria-label="Filtra" className={classes.button}>
                            <FilterListIcon />
                        </Button>
                    </div>
                </Typography>
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