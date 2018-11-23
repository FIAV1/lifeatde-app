import React, { Component } from 'react';
import Api from '../../lib/Api';

import {
    withStyles,
    Grid,
    AppBar,
    Tabs,
    Tab,
    Badge,
} from '@material-ui/core';

import SwipeableViews from 'react-swipeable-views';
import Loader from '../common/Loader';

import ProjectCardList from '../projects/ProjectCardList';
import StudyGroupCardList from '../study-groups/StudyGroupCardList';
import BookCardList from "../books/BookCardList";

import { withSnackbar } from 'notistack';

function TabContainer({ children, dir }) {
  return (
    <div dir={dir} style={{ paddingTop: 8*2, paddingBottom: 8*2, paddingRight: 8, paddingLeft: 8}}>
      {children}
    </div>
  );
}

class SearchContainer extends Component {
    state = {
        value: 0,
        loading: true,
        projects: null,
        projectsUsers: null,
        studyGroups: null,
        studyGroupsUsers: null,
        books: null,
        booksUsers: null,
    };
    
    handleChangeTab = (event, value) => {
        this.setState({ value });
    };
    
    handleChangeIndex = index => {
        this.setState({ value: index });
    };

    async componentDidMount() {
        await Api.get(`/users/${this.props.userId}/projects`).then(response => {
            this.setState({
                projects: response.data,
                projectsUsers: response.included
            })
        }).catch(({errors}) => {
            errors.forEach(error => this.props.enqueueSnackbar(error.detail, {variant: 'error'}));
        });
        await Api.get(`/users/${this.props.userId}/books`).then(response => {
            this.setState({
                books: response.data,
                booksUsers: response.included,
            })
        }).catch(({errors}) => {
            errors.forEach(error => this.props.enqueueSnackbar(error.detail, {variant: 'error'}));
        });
        await Api.get(`/users/${this.props.userId}/study_groups`).then(response => {
            this.setState({
                studyGroups: response.data,
                studyGroupsUsers: response.included
            })
        }).catch(({errors}) => {
            errors.forEach(error => this.props.enqueueSnackbar(error.detail, {variant: 'error'}));
        });

        this.setState({loading: false});
    }
    
    badgeValue = props => this.state[props] ? this.state[props].length : 0;

    removeProject = (projectId, adminId) => {
        let projects = this.state.projects.filter(project => project.id !== projectId);
        let users = this.state.projectsUsers.filter(user => user.id !== adminId);

        this.setState({
            projects,
            users,
        });
    }

    render() {
        const { loading, projects, projectsUsers, studyGroups, studyGroupsUsers, books, booksUsers} = this.state;
        const { classes, theme } = this.props;

        return(
            <Grid container spacing={16}>
                <Grid item xs={12}>
                    <AppBar position="static" color="default">
                        <Tabs
                            classes={{ root: classes.tabsRoot }}
                            value={this.state.value}
                            onChange={this.handleChangeTab}
                            indicatorColor="primary"
                            textColor="primary"
                            fullWidth
                            scrollable
                        >
                            <Tab 
                                label={
                                    <Badge className={classes.badge} color="primary" badgeContent={this.badgeValue('projects')}>
                                        Progetti
                                    </Badge>
                                }
                                classes={{ root: classes.tabRoot }}
                            />
                            <Tab 
                                label={
                                    <Badge className={classes.badge} color="primary" badgeContent={this.badgeValue('studyGroups')}>
                                        Studio
                                    </Badge>
                                }
                                classes={{ root: classes.tabRoot }}
                            />
                            <Tab 
                                label={
                                    <Badge className={classes.badge} color="primary" badgeContent={this.badgeValue('books')}>
                                        Libri
                                    </Badge>
                                }
                                classes={{ root: classes.tabRoot }}
                            />
                        </Tabs>
                    </AppBar>
                    {
                        loading
                        ? <Loader />
                        : <SwipeableViews
                                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                                index={this.state.value}
                                onChangeIndex={this.handleChangeIndex}
                                animateHeight
                            >
                                <TabContainer dir={theme.direction}><ProjectCardList removeProject={this.removeProject} projects={projects} users={projectsUsers}/></TabContainer>
                                <TabContainer dir={theme.direction}><StudyGroupCardList studyGroups={studyGroups} users={studyGroupsUsers}/></TabContainer>
                                <TabContainer dir={theme.direction}><BookCardList books={books} users={booksUsers}/></TabContainer>
                            </SwipeableViews>
                    }
                </Grid>
            </Grid>
        );
    }
}

const styles = theme => ({
    item: {
        display: 'flex',
        justifyContent: 'center',
    },
    tabRoot: {
        minWidth: 'fit-content',
    },
    badge: {
        padding: `0 ${theme.spacing.unit * 2}px 0 0`,
    },
})

export default withSnackbar(withStyles(styles, {withTheme: true})(SearchContainer));