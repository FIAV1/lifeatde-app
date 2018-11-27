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
import LoadMoreButton from '../common/LoadMoreButton';

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
        projectsMeta: null,
        studyGroups: null,
        studyGroupsUsers: null,
        studyGroupsMeta: null,
        books: null,
        booksUsers: null,
        booksMeta: null,
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
                projectsUsers: response.included,
                projectsMeta: response.meta,
            })
        }).catch(({errors}) => {
            errors.forEach(error => this.props.enqueueSnackbar(error.detail, {variant: 'error'}));
        });
        await Api.get(`/users/${this.props.userId}/books`).then(response => {
            this.setState({
                books: response.data,
                booksUsers: response.included,
                booksMeta: response.meta,
            })
        }).catch(({errors}) => {
            errors.forEach(error => this.props.enqueueSnackbar(error.detail, {variant: 'error'}));
        });
        await Api.get(`/users/${this.props.userId}/study_groups`).then(response => {
            this.setState({
                studyGroups: response.data,
                studyGroupsUsers: response.included,
                studyGroupsMeta: response.meta,
            })
        }).catch(({errors}) => {
            errors.forEach(error => this.props.enqueueSnackbar(error.detail, {variant: 'error'}));
        });

        this.setState({loading: false});
    }
    
    badgeValue = props => this.state[props] ? this.state[props].length : 0;

    removeProject = projectId => {
        let projects = this.state.projects.filter(project => project.id !== projectId);

        this.setState({
            projects,
        });
    }

    removeStudyGroup = studyGroupId => {
        let studyGroups = this.state.studyGroups.filter(studyGroup => studyGroup.id !== studyGroupId);

        this.setState({
            studyGroups,
        });
    };

    removeBook = (bookId) => {
        let books = this.state.books.filter(book => book.id !== bookId);

        this.setState({
            books,
        });
    };

    loadMore = endpoint => () => {
        this.setState({loadingMore: true});
        Api.get(endpoint).then(response => {
            switch (response.data[0].type) {
                case 'project':
                    let projects = this.state.projects;
                    let projectsUsers = this.state.projectsUsers;
        
                    projects = projects.concat(response.data);
                    response.included.forEach(user => {
                        if (!projectsUsers.find(el => el.id === user.id)) projectsUsers.push(user);
                    });
        
                    this.setState({
                        projects: projects,
                        projectsUsers: projectsUsers,
                        projectsMeta: response.meta,
                    });

                    this.swipeableActions.updateHeight();
                    break;
                case 'study_group':
                    let studyGroups = this.state.studyGroups;
                    let studyGroupsUsers = this.state.studyGroupsUsers;
        
                    studyGroups = studyGroups.concat(response.data);
                    response.included.forEach(user => {
                        if (!studyGroupsUsers.find(el => el.id === user.id)) studyGroupsUsers.push(user);
                    });
        
                    this.setState({
                        studyGroups: studyGroups,
                        studyGroupsUsers: studyGroupsUsers,
                        studyGroupsMeta: response.meta,
                    });

                    this.swipeableActions.updateHeight();
                    break;
                case 'book':
                    let books = this.state.books;
                    let booksUsers = this.state.booksUsers;
        
                    books = books.concat(response.data);
                    response.included.forEach(user => {
                        if (!booksUsers.find(el => el.id === user.id)) booksUsers.push(user);
                    });
        
                    this.setState({
                        books: books,
                        booksUsers: booksUsers,
                        booksMeta: response.meta,
                    });

                    this.swipeableActions.updateHeight();
                    break;
                default:
                    break;
            }
        }).catch(({errors}) => {
            errors.forEach(error => this.props.enqueueSnackbar(error, {variant: 'error'}));
        }).finally(() => {
            this.setState({loadingMore: false});
        });
    }

    render() {
        const {
            loading,
            loadingMore,
            projects,
            projectsUsers,
            projectsMeta,
            studyGroups,
            studyGroupsUsers,
            studyGroupsMeta,
            books,
            booksUsers,
            booksMeta,
        } = this.state;
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
                            action={actions => { this.swipeableActions = actions; }}
                        >
                            <TabContainer dir={theme.direction}>
                                <ProjectCardList
                                    projects={projects}
                                    users={projectsUsers}
                                    removeProject={this.removeProject}
                                />
                                { projectsMeta.next
                                ? <LoadMoreButton
                                    meta={projectsMeta}
                                    endpoint={`/users/${this.props.userId}/projects?page=`}
                                    loadingMore={loadingMore}
                                    loadMore={this.loadMore}
                                /> : null }
                            </TabContainer>
                            <TabContainer dir={theme.direction}>
                                <StudyGroupCardList
                                    studyGroups={studyGroups}
                                    users={studyGroupsUsers}
                                    removeStudyGroup={this.removeStudyGroup}
                                />
                                { studyGroupsMeta.next
                                ? <LoadMoreButton
                                    meta={studyGroupsMeta}
                                    endpoint={`/users/${this.props.userId}/study_groups?page=`}
                                    loadingMore={loadingMore}
                                    loadMore={this.loadMore}
                                /> : null }
                            </TabContainer>
                            <TabContainer dir={theme.direction}>
                                <BookCardList
                                    books={books}
                                    users={booksUsers}
                                    removeBook={this.removeBook}
                                />
                                { booksMeta.next
                                ? <LoadMoreButton
                                    meta={booksMeta}
                                    endpoint={`/users/${this.props.userId}/books?page=`}
                                    loadingMore={loadingMore}
                                    loadMore={this.loadMore}
                                /> : null }
                            </TabContainer>
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