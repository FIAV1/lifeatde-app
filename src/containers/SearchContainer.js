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
import LoadMoreButton from '../components/common/LoadMoreButton';
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
        projectsIncluded: null,
        projectsMeta: null,
        users: null,
        usersIncluded: null,
        usersMeta: null,
        studyGroups: null,
        studyGroupsIncluded: null,
        studyGroupsMeta: null,
        books: null,
        booksIncluded: null,
        booksMeta: null,
    };

    componentDidMount() {
        document.title = 'LifeAtDe | Cerca in LifeAtDe...'
    }
    
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
                projectsIncluded: response.included,
                projectsMeta: response.meta,
            })
        }).catch(({errors}) => {
            errors.forEach(error => this.props.enqueueSnackbar(error.detail, {variant: 'error'}));
        });
        await Api.get(`/users?search=${this.state.searchString}`).then(response => {
            this.setState({
                users: response.data,
                usersIncluded: response.included,
                usersMeta: response.meta,
            })
        }).catch(({errors}) => {
            errors.forEach(error => this.props.enqueueSnackbar(error.detail, {variant: 'error'}));
        });
        await Api.get(`/books?search=${this.state.searchString}`).then(response => {
            this.setState({
                books: response.data,
                booksIncluded: response.included,
                booksMeta: response.meta,
            })
        }).catch(({errors}) => {
            errors.forEach(error => this.props.enqueueSnackbar(error.detail, {variant: 'error'}));
        });
        await Api.get(`/study_groups?search=${this.state.searchString}`).then(response => {
            this.setState({
                studyGroups: response.data,
                studyGroupsIncluded: response.included,
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
                    let projectsIncluded = this.state.projectsIncluded;
        
                    projects = projects.concat(response.data);
                    response.included.forEach(newItem => {
                        if (!projectsIncluded.find(oldItem => newItem.type === oldItem.type && newItem.id === oldItem.id)) projectsIncluded.push(newItem);
                    });
        
                    this.setState({
                        projects,
                        projectsIncluded,
                        projectsMeta: response.meta,
                    });

                    this.swipeableActions.updateHeight();
                    break;
                case 'study_group':
                    let studyGroups = this.state.studyGroups;
                    let studyGroupsIncluded = this.state.studyGroupsIncluded;
        
                    studyGroups = studyGroups.concat(response.data);
                    response.included.forEach(newItem => {
                        if (!studyGroupsIncluded.find(oldItem => newItem.type === oldItem.type && newItem.id === oldItem.id)) studyGroupsIncluded.push(newItem);
                    });
        
                    this.setState({
                        studyGroups,
                        studyGroupsIncluded,
                        studyGroupsMeta: response.meta,
                    });

                    this.swipeableActions.updateHeight();
                    break;
                case 'user':
                    let users = this.state.users;
                    let usersIncluded = this.state.usersIncluded;
                    
        
                    users = users.concat(response.data);
                    response.included.forEach(newItem => {
                        if (!usersIncluded.find(oldItem => newItem.type === oldItem.type && newItem.id === oldItem.id)) usersIncluded.push(newItem);
                    });
        
                    this.setState({
                        users,
                        usersIncluded,
                        usersMeta: response.meta,
                    });

                    this.swipeableActions.updateHeight();
                    break;
                case 'book':
                    let books = this.state.books;
                    let booksIncluded = this.state.booksIncluded;
        
                    books = books.concat(response.data);
                    response.included.forEach(newItem => {
                        if (!booksIncluded.find(oldItem => newItem.type === oldItem.type && newItem.id === oldItem.id)) booksIncluded.push(newItem);
                    });
        
                    this.setState({
                        books,
                        booksIncluded,
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
            projectsIncluded,
            projectsMeta,
            studyGroups,
            studyGroupsIncluded,
            studyGroupsMeta,
            books,
            booksIncluded,
            booksMeta,
            users,
            usersIncluded,
            usersMeta,
        } = this.state;
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
                                    action={actions => { this.swipeableActions = actions; }}
                                >
                                    <TabContainer dir={theme.direction}>
                                        <ProjectCardList
                                            projects={projects}
                                            included={projectsIncluded}
                                            removeProject={this.removeProject}
                                        />
                                        { projectsMeta && projectsMeta.next
                                        ? <LoadMoreButton
                                            meta={projectsMeta}
                                            endpoint={`/projects?search=${this.state.searchString}&page=`}
                                            loadingMore={loadingMore}
                                            loadMore={this.loadMore}
                                        /> : null }
                                    </TabContainer>
                                    <TabContainer dir={theme.direction}>
                                        <StudyGroupCardList
                                            studyGroups={studyGroups}
                                            included={studyGroupsIncluded}
                                            removeStudyGroup={this.removeStudyGroup}
                                        />
                                        { studyGroupsMeta && studyGroupsMeta.next
                                        ? <LoadMoreButton
                                            meta={studyGroupsMeta}
                                            endpoint={`/study_groups?search=${this.state.searchString}&page=`}
                                            loadingMore={loadingMore}
                                            loadMore={this.loadMore}
                                        /> : null }
                                    </TabContainer>
                                    <TabContainer dir={theme.direction}>
                                        <BookCardList
                                            books={books}
                                            included={booksIncluded}
                                            removeBook={this.removeBook}
                                        />
                                        { booksMeta && booksMeta.next
                                        ? <LoadMoreButton
                                            meta={booksMeta}
                                            endpoint={`/books?search=${this.state.searchString}&page=`}
                                            loadingMore={loadingMore}
                                            loadMore={this.loadMore}
                                        /> : null }
                                    </TabContainer>
                                    <TabContainer dir={theme.direction}>
                                        <UserCardList
                                            users={users}
                                            included={usersIncluded}
                                        />
                                        { usersMeta && usersMeta.next
                                        ? <LoadMoreButton
                                            meta={usersMeta}
                                            endpoint={`/users?search=${this.state.searchString}&page=`}
                                            loadingMore={loadingMore}
                                            loadMore={this.loadMore}
                                        /> : null }
                                    </TabContainer>
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