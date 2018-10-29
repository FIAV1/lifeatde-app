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
import Notifier, { showNotifier } from '../components/Notifier';

import StudyGroupCardList from '../components/StudyGroupCardList';
import Loader from '../components/Loader';

class StudyGroupCardsContainer extends Component {

    state = {
        loading: true,
        course: null,
        studyGroups: null,
        users: null
    }

    componentDidMount() {
        document.title =  'LifeAtDe | Gruppi di Studio'

        let course = LocalStorage.get('user').included.find(item => item.type === 'course');

        Api.get('/courses/'+ course.id + '/study_groups').then(response =>{
            this.setState({
                studyGroups: response.data,
                users: response.included,
            })
        }).catch(({errors}) => {
            showNotifier({ messages: errors, variant: 'error' });
        });

        this.setState({
            course,
            loading: false,
        })
    }

    render() {

        const {loading, studyGroups, users} = this.state;
        const {classes} = this.props;

        if(loading) {
            return <Loader notifier={<Notifier />} />
        }

        return (
            <div id="studygroup-cards-container">
                <Typography className={classes.header} component="h1" variant="h4">
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
                <StudyGroupCardList studyGroups={studyGroups} users={users}/>
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