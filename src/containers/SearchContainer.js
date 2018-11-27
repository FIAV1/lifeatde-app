import React, { Component } from 'react';
import Api from '../lib/Api';

import {
    withStyles,
    Grid,
    InputBase,
    AppBar,
    Tabs,
    Tab,
    Badge,
    Paper
} from '@material-ui/core';

import SwipeableViews from 'react-swipeable-views';
import Loader from '../components/common/Loader';
import SearchIcon from '@material-ui/icons/Search';

import ProjectCardList from '../components/projects/ProjectCardList';
import StudyGroupCardList from '../components/study-groups/StudyGroupCardList';
import BookCardList from "../components/books/BookCardList";
import UserCardList from "../components/user/UserCardList";

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
        searchString: '',
        value: 0,
        loading: false,
        projects: null,
        projectsUsers: null,
        users: null,
        usersCourses: null,
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

    handleChange = event => {
        this.setState({searchString: event.target.value});
    }

    handleSubmit = async event => {
        event.preventDefault();

        if (this.state.searchString.length === 0 || !this.state.searchString.trim()) return;

        this.setState({loading: true});

        await Api.get(`/projects?search=${this.state.searchString}`).then(response => {
            this.setState({
                projects: response.data,
                projectsUsers: response.included.filter(item => item.type === 'user')
            })
        }).catch(({errors}) => {
            errors.forEach(error => this.props.enqueueSnackbar(error.detail, {variant: 'error'}));
        });
        await Api.get(`/users?search=${this.state.searchString}`).then(response => {
            this.setState({
                users: response.data,
                usersCourses: response.included.filter(item => item.type === 'course')
            })
        }).catch(({errors}) => {
            errors.forEach(error => this.props.enqueueSnackbar(error.detail, {variant: 'error'}));
        });
        await Api.get(`/books?search=${this.state.searchString}`).then(response => {
            this.setState({
                books: response.data,
                booksUsers: response.included.filter(item => item.type === 'user'),
            })
        }).catch(({errors}) => {
            errors.forEach(error => this.props.enqueueSnackbar(error.detail, {variant: 'error'}));
        });
        await Api.get(`/study_groups?search=${this.state.searchString}`).then(response => {
            this.setState({
                studyGroups: response.data,
                studyGroupsUsers: response.included.filter(item => item.type === 'user')
            })
        }).catch(({errors}) => {
            errors.forEach(error => this.props.enqueueSnackbar(error.detail, {variant: 'error'}));
        });

        this.setState({loading: false});
    }
    
    badgeValue = props => this.state[props] ? this.state[props].length : 0;

    removeProject = (projectId, adminId) => {
        let projects = this.state.projects.filter(project => project.id !== projectId);
        let users = this.state.users.filter(user => user.id !== adminId);

        this.setState({
            projects,
            users,
        });
    };

    render() {
        const { loading, projects, projectsUsers, studyGroups, studyGroupsUsers, books, booksUsers, users, usersCourses} = this.state;
        const { classes, theme } = this.props;

        return(
            <div id="global-search">
                <Grid container spacing={16}>
                    <Grid item xs={12}>
                        <Paper>
                            <form onSubmit={this.handleSubmit}>
                                <div className={classes.search}>
                                    <div className={classes.searchIcon}>
                                        <SearchIcon />
                                    </div>
                                    <InputBase
                                        placeholder="Cerca in LifeAtDe..."
                                        onChange={this.handleChange}
                                        classes={{
                                            root: classes.inputRoot,
                                            input: classes.inputInput,
                                        }}
                                    />
                                </div>
                            </form>
                        </Paper>
                    </Grid>
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
                                <Tab 
                                    label={
                                        <Badge className={classes.badge} color="primary" badgeContent={this.badgeValue('users')}>
                                            Utenti
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
                                    <TabContainer dir={theme.direction}><ProjectCardList projects={projects} users={projectsUsers} removeProject={this.removeProject}/></TabContainer>
                                    <TabContainer dir={theme.direction}><StudyGroupCardList studyGroups={studyGroups} users={studyGroupsUsers}/></TabContainer>
                                    <TabContainer dir={theme.direction}><BookCardList books={books} users={booksUsers}/></TabContainer>
                                    <TabContainer dir={theme.direction}><UserCardList users={users} courses={usersCourses}/></TabContainer>
                                </SwipeableViews>
                        }
                    </Grid>
                </Grid>
            </div>
        );
    }
}

const styles = theme => ({
    item: {
        display: 'flex',
        justifyContent: 'center',
    },
    button: {
        backgroundColor: theme.palette.background.paper,
        margin: theme.spacing.unit,
        color: theme.palette.action.active
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: theme.palette.background.paper,
        marginLeft: 0,
        width: '100%',
    },
    searchIcon: {
        width: theme.spacing.unit * 5,
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
        width: '100%',
    },
    inputInput: {
        paddingTop: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
        paddingLeft: theme.spacing.unit * 6,
        width: '100%',
    },
    tabRoot: {
        minWidth: 'fit-content',
    },
    badge: {
        padding: `0 ${theme.spacing.unit * 2}px 0 0`,
    },
})

export default withSnackbar(withStyles(styles, {withTheme: true})(SearchContainer));