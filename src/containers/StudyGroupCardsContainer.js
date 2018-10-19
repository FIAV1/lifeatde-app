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

import LocalStorage from '../lib/LocalStorage';
import Notifier, { showNotifier } from '../components/Notifier';

import StudyGroupCardList from '../components/StudyGroupCardList';

class StudyGroupCardsContainer extends Component {

    state = {
        loading: true,
        course: LocalStorage.get('user').included[3],
        study_groups: null,
        users: null
    }

    componentDidMount() {
        document.title =  'LifeAtDe | Gruppi di Studio'

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

        const {loading, study_groups, users} = this.state;
        const {classes} = this.props;

        if(loading) {
            return <CircularProgress size={80} color='primary'/>
        }

        return (
            <div id="studygroup-cards-container">
                <Typography className={classes.header} component="h1" variant="display1">
                    Gruppi di Studio
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
                <StudyGroupCardList study_groups={study_groups} users={users}/>
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

export default withStyles(styles)(StudyGroupCardsContainer);