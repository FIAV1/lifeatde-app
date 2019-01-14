import React, { Component } from 'react';
import Api from '../../lib/Api';

import {
    withStyles,
    Grid,
    AppBar,
    Tabs,
    Tab,
    Badge,
    FormGroup,
    FormControlLabel,
    Switch,
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
        projectsIncluded: null,
        projectsMeta: null,
        studyGroups: null,
        studyGroupsIncluded: null,
        studyGroupsMeta: null,
        books: null,
        booksIncluded: null,
        booksMeta: null,
        adminFilter: true,
        statusFilter: false,
    };
    
    handleChangeTab = (event, value) => {
        this.setState({ value });
    };
    
    handleChangeIndex = index => {
        this.setState({ value: index });
    };

    getProjectEndpoint = type => {
        let endpoint = `/users/${this.props.user.id}/projects`;
        
        if (this.state.adminFilter && this.state.statusFilter) {
            endpoint += '?status=open&admin=1';
        } else if (this.state.statusFilter) {
            endpoint += '?status=open';
        } else if (this.state.adminFilter) {
            endpoint += '?admin=1'
        }
        
        switch (type) {
            case 'switch':
                return endpoint;
            case 'loadmore':
                this.state.statusFilter || this.state.adminFilter ? endpoint += '&' : endpoint += '?'
                return endpoint += 'page=';
            default:
                break;
        }
        
    }

    handleSwitch = property => () => {
        this.setState({[property]: !this.state[property]}, () =>
            Api.get(this.getProjectEndpoint('switch')).then(response => {
                this.setState({
                    projects: response.data,
                    projectsIncluded: response.included,
                    projectsMeta: response.meta,
                });
                this.swipeableActions.updateHeight();
            }).catch(({errors}) => {
                errors.forEach(error => this.props.enqueueSnackbar(error.detail, {variant: 'error'}));
            })
        );
    }

    async componentDidMount() {
        await Api.get(`/users/${this.props.user.id}/projects?admin=1`).then(response => {
            this.setState({
                projects: response.data,
                projectsIncluded: response.included,
                projectsMeta: response.meta,
            })
        }).catch(({errors}) => {
            errors.forEach(error => this.props.enqueueSnackbar(error.detail, {variant: 'error'}));
        });
        await Api.get(`/users/${this.props.user.id}/books`).then(response => {
            this.setState({
                books: response.data,
                booksIncluded: response.included,
                booksMeta: response.meta,
            })
        }).catch(({errors}) => {
            errors.forEach(error => this.props.enqueueSnackbar(error.detail, {variant: 'error'}));
        });
        await Api.get(`/users/${this.props.user.id}/study_groups`).then(response => {
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
                        if (!projectsIncluded.find(oldItem => newItem.id === oldItem.id)) projectsIncluded.push(newItem);
                    });
        
                    this.setState({
                        projects: projects,
                        projectsIncluded: projectsIncluded,
                        projectsMeta: response.meta,
                    });

                    this.swipeableActions.updateHeight();
                    break;
                case 'study_group':
                    let studyGroups = this.state.studyGroups;
                    let studyGroupsIncluded = this.state.studyGroupsIncluded;
        
                    studyGroups = studyGroups.concat(response.data);
                    response.included.forEach(newItem => {
                        if (!studyGroupsIncluded.find(oldItem => newItem.id === oldItem.id)) studyGroupsIncluded.push(newItem);
                    });
        
                    this.setState({
                        studyGroups: studyGroups,
                        studyGroupsIncluded: studyGroupsIncluded,
                        studyGroupsMeta: response.meta,
                    });

                    this.swipeableActions.updateHeight();
                    break;
                case 'book':
                    let books = this.state.books;
                    let booksIncluded = this.state.booksIncluded;
        
                    books = books.concat(response.data);
                    response.included.forEach(newItem => {
                        if (!booksIncluded.find(oldItem => newItem.id === oldItem.id)) booksIncluded.push(newItem);
                    });
        
                    this.setState({
                        books: books,
                        booksIncluded: booksIncluded,
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
        } = this.state;
        const { classes, theme, user } = this.props;

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
                                <div>
                                    <FormGroup>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={this.state.adminFilter}
                                                    onChange={this.handleSwitch('adminFilter')}
                                                    value="adminFilter"
                                                    color="primary"
                                                />
                                            }
                                            label={`Creati da ${user.attributes.firstname}`}
                                        />
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={this.state.statusFilter}
                                                    onChange={this.handleSwitch('statusFilter')}
                                                    value="statusFilter"
                                                    color="primary"
                                                />
                                            }
                                            label="Mostra solo aperti"
                                        />
                                    </FormGroup>
                                </div>
                                <ProjectCardList
                                    projects={projects}
                                    included={projectsIncluded}
                                    removeProject={this.removeProject}
                                />
                                { projectsMeta.next
                                ? <LoadMoreButton
                                    meta={projectsMeta}
                                    endpoint={this.getProjectEndpoint('loadmore')}
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
                                { studyGroupsMeta.next
                                ? <LoadMoreButton
                                    meta={studyGroupsMeta}
                                    endpoint={`/users/${this.props.user.id}/study_groups?page=`}
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
                                { booksMeta.next
                                ? <LoadMoreButton
                                    meta={booksMeta}
                                    endpoint={`/users/${this.props.user.id}/books?page=`}
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