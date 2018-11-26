import React, { Component } from 'react';
import classNames from 'classnames';

import LocalStorage from '../lib/LocalStorage';
import Authentication from '../lib/Authentication';

import {
    withStyles,
    Drawer,
    AppBar,
    Toolbar,
    List,
    Divider,
    Icon,
    IconButton,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography
} from '@material-ui/core';

import ExitIcon from '@material-ui/icons/ExitToApp';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import SearchIcon from '@material-ui/icons/Search';
import AsyncAvatar from '../components/common/AsyncAvatar';
import Loader from '../components/common/Loader'

class AppContainer extends Component {
    state = {
        loading: true,
        user: null,
        open: false,
    };

    handleDrawerOpen = () => {
        this.setState({ open: true });
    };
    
    handleDrawerClose = () => {
        this.setState({ open: false });
    };

    componentDidMount() {
        window.document.addEventListener('updateProfile', event => {
            LocalStorage.set('user', event.detail);
            this.setState({user: event.detail.data});
        }, false);

        window.document.addEventListener('login', event => {
            this.setState({loading: false, user: event.detail.data});
        }, false);

        if(Authentication.isAuthenticated()) {
            let user = LocalStorage.get('user').data;
            this.setState({loading: false, user });
        }
    }
    
    render() {
        const { classes, theme, history } = this.props;
        const { loading, user } = this.state;

        if(!Authentication.isAuthenticated()) {
            return this.props.children;
        }

        if (loading) return <Loader />

        return (
            <div className={classes.root}>
                <AppBar
                    position="absolute"
                    className={classNames(classes.appBar, this.state.open && classes.appBarShift)}
                >
                    <Toolbar disableGutters={!this.state.open}>
                        <IconButton
                            color="inherit"
                            aria-label="Open drawer"
                            onClick={this.handleDrawerOpen}
                            className={classNames(classes.menuButton, this.state.open && classes.hide)}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            LifeAtDe
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Drawer
                    variant="permanent"
                    classes={{
                        paper: classNames(classes.drawerPaper, !this.state.open && classes.drawerPaperClose),
                    }}
                    open={this.state.open}
                >
                    <div className={classes.toolbar}>
                        <IconButton onClick={this.handleDrawerClose}>
                            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                        </IconButton>
                    </div>
                    <Divider />
                    <List>
                        <ListItem button onClick={() => history.push('/projects')}>
                            <ListItemIcon>
                                <Icon color="action" className={classNames(classes.icon, 'fas fa-drafting-compass')} />
                            </ListItemIcon>
                            <ListItemText primary="Progetti" />
                        </ListItem>
                        <ListItem button onClick={() => history.push('/study_groups')}>
                            <ListItemIcon>
                                <Icon color="action" className={classNames(classes.icon, 'fas fa-handshake')} />
                            </ListItemIcon>
                            <ListItemText primary="Studio" />
                        </ListItem>
                        <ListItem button onClick={() => history.push('/books')}>
                            <ListItemIcon>
                                <Icon color="action" className={classNames(classes.icon, 'fas fa-book')} />
                            </ListItemIcon>
                            <ListItemText primary="Libri" />
                        </ListItem>
                        <ListItem button onClick={() => history.push('/news')}>
                            <ListItemIcon>
                                <Icon color="action" className={classNames(classes.icon, 'fas fa-bullhorn')} />
                            </ListItemIcon>
                            <ListItemText primary="News" />
                        </ListItem>
                    </List>
                    <Divider />
                    <List>
                        <ListItem button onClick={() => history.push('/users/'+user.id)}>
                            <ListItemIcon>
                                <AsyncAvatar
                                    avatarClass={classes.avatar}
                                    user={user}
                                />
                            </ListItemIcon>
                            <ListItemText inset primary="Profilo" />
                        </ListItem>
                        <ListItem button onClick={Authentication.logout}>
                            <ListItemIcon>
                                <ExitIcon />
                            </ListItemIcon>
                            <ListItemText inset primary="Logout" />
                        </ListItem>
                        <ListItem button onClick={this.props.changeThemeType}>
                            <ListItemIcon>
                                <Icon color="action" className={classNames(classes.icon, 'fas fa-lightbulb')} />
                            </ListItemIcon>
                            <ListItemText inset primary="Tema scuro" />
                        </ListItem>
                    </List>
                    <Divider />
                    <List>
                        <ListItem button onClick={() => history.push('/search')}>
                            <ListItemIcon>
                                <SearchIcon />
                            </ListItemIcon>
                            <ListItemText inset primary="Cerca" />
                        </ListItem>
                    </List>
                </Drawer>
                <main className={classes.content}>
                    {this.props.children}
                </main>
            </div>
        );
    }
}

const drawerWidth = 200;

const styles = theme => ({
    root: {
        flexGrow: 1,
        zIndex: 1,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginLeft: theme.spacing.unit*2,
        marginRight: theme.spacing.unit*2,
        [theme.breakpoints.down('xs')]: {
            marginLeft: theme.spacing.unit,
            marginRight: theme.spacing.unit,
        }
    },
    hide: {
        display: 'none',
    },
    drawerPaper: {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing.unit * 7,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing.unit * 9,
        },
    },
    content: {
        flexGrow: 1,
        zIndex: theme.zIndex.drawer + 2,
        backgroundColor: theme.palette.background.default,
        marginTop: '64px',
        padding: theme.spacing.unit*2,
        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing.unit,
        },
        minWidth: 'calc(100vw - 72px)',
        [theme.breakpoints.down('xs')]: {
            minWidth: 'calc(100vw - 56px)',
            marginTop: '56px',
        },
        overflowY: 'auto'
    },
    title: {
        color: theme.palette.common.white,
    },
    avatar: {
        width: '28px',
        height: '28px',
        fontSize: '12px',
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
});

export default withStyles(styles, { withTheme: true })(AppContainer);