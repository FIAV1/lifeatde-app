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
    LinearProgress,
    Paper
} from '@material-ui/core';
import SwipeableViews from 'react-swipeable-views';

import SearchIcon from '@material-ui/icons/Search';
import ProjectCardList from '../components/ProjectCardList';
import Notifier, {showNotifier} from '../components/Notifier';
import StudyGroupCardList from '../components/StudyGroupCardList';

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
        users: null,
        books: null,
        studyGroups: null,
        projectsUsers: null,
        studyGroupsUsers: null,
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

        this.setState({loading: true});

        await Api.get(`/projects?search=${this.state.searchString}`).then(response => {
            this.setState({
                projects: response.data,
                projectsUsers: response.included
            })
        }).catch(({errors}) => showNotifier({messages: errors, variant: 'error'}));
        await Api.get(`/users?search=${this.state.searchString}`).then(response => {
            this.setState({users: response.data})
        }).catch(({errors}) => showNotifier({messages: errors, variant: 'error'}));
        await Api.get(`/books?search=${this.state.searchString}`).then(response => {
            this.setState({books: response.data})
        }).catch(({errors}) => showNotifier({messages: errors, variant: 'error'}));
        await Api.get(`/study_groups?search=${this.state.searchString}`).then(response => {
            this.setState({
                studyGroups: response.data,
                studyGroupsUsers: response.included
            })
        }).catch(({errors}) => showNotifier({messages: errors, variant: 'error'}));

        this.setState({loading: false});
    }
    
    badgeValue = props => this.state[props] ? this.state[props].length : 0

    render() {
        const { loading, projects, projectsUsers, studyGroups, studyGroupsUsers } = this.state;
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
                            loading ?
                                <LinearProgress variant="query" />
                            :
                                <SwipeableViews
                                    axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                                    index={this.state.value}
                                    onChangeIndex={this.handleChangeIndex}
                                    animateHeight
                                >
                                    <TabContainer dir={theme.direction}><ProjectCardList projects={projects} users={projectsUsers}/></TabContainer>
                                    <TabContainer dir={theme.direction}><StudyGroupCardList studyGroups={studyGroups} users={studyGroupsUsers}/></TabContainer>
                                    <TabContainer dir={theme.direction}>Libri</TabContainer>
                                    <TabContainer dir={theme.direction}>Utenti</TabContainer>
                                </SwipeableViews>
                        }
                    </Grid>
                </Grid>
                <Notifier />
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

export default withStyles(styles, {withTheme: true})(SearchContainer);