import React, { Component } from 'react';
import Api from '../lib/Api';

import {
    withStyles,
    CircularProgress,
    Typography,
    Button,
    Divider
} from '@material-ui/core';

import AddIcon from '@material-ui/icons/Add';
import FilterListIcon from '@material-ui/icons/FilterList';

import Notifier, { showNotifier } from '../components/Notifier';
import ProjectCardList from '../components/ProjectCardList';

class ProjectCardsContainer extends Component {
    state = {
        loading: true,
        projects: null,
        users: null
    };

    componentDidMount() {
        document.title =  'LifeAtDe | Progetti'

        Api.get('/projects').then((response) => {
            this.setState({
                projects: response.data,
                users: response.included,
                loading: false
            });
        }).catch(({errors}) => {
            showNotifier({ messages: errors, variant: 'error' })
        });
    }

    render() {
        const { loading, projects, users } = this.state;
        const { classes } = this.props;

        if(loading) {
            return <CircularProgress size={80} color="primary" />
        }

        return(
            <div id="project-cards-container">
                <Typography className={classes.header} component="h1" variant="display1">
                    Progetti
                    <div>
                        <Button variant="fab" color="primary" aria-label="Add" className={classes.button}>
                            <AddIcon />
                        </Button>
                        <Button variant="fab" color="primary" aria-label="Add" className={classes.button}>
                            <FilterListIcon />
                        </Button>
                    </div>
                </Typography>
                <Divider className={classes.hr} />
                <ProjectCardList projects={projects} users={users} />
                <Notifier />
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

export default withStyles(styles)(ProjectCardsContainer);