import React, { Component } from 'react';

import LocalStorage from '../lib/LocalStorage';
import Authentication from '../lib/Authentication';

import {
    withStyles,
    SwipeableDrawer,
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
import SearchIcon from '@material-ui/icons/Search';
import AsyncAvatar from '../components/common/AsyncAvatar';
import Loader from '../components/common/Loader'
import SpeedDials from '../components/common/SpeedDials';

const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);

class AppContainer extends Component {
    state = {
        loading: true,
        user: null,
        open: false,
    };

    toggleDrawer = open => () => {
        this.setState({ open });
    };

    handleClick = route => () => {
        this.props.history.push(route);
        this.setState({open: false});
    }

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
        const { classes } = this.props;
        const { loading, user } = this.state;

        if(!Authentication.isAuthenticated()) {
            return this.props.children;
        }

        if (loading) return <Loader />

        return (
            <div className={classes.root}>
                <AppBar
                    position="absolute"
                    className={classes.appBar}
                >
                    <Toolbar disableGutters>
                        <IconButton
                            color="inherit"
                            aria-label="Open drawer"
                            onClick={this.toggleDrawer(true)}
                            className={classes.menuButton}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            LifeAtDe
                        </Typography>
                    </Toolbar>
                </AppBar>
                <SwipeableDrawer
                    anchor="left"
                    open={this.state.open}
                    onClose={this.toggleDrawer(false)}
                    onOpen={this.toggleDrawer(true)}
                    disableBackdropTransition={!iOS}
                    disableDiscovery={iOS}
                >
                    <List>
                        <ListItem button onClick={this.handleClick('/projects')}>
                            <ListItemIcon>
                                <Icon color="action" className={'fas fa-drafting-compass'} />
                            </ListItemIcon>
                            <ListItemText primary="Progetti" />
                        </ListItem>
                        <ListItem button onClick={this.handleClick('/study_groups')} >
                            <ListItemIcon>
                                <Icon color="action" className={'fas fa-handshake'} />
                            </ListItemIcon>
                            <ListItemText primary="Studio" />
                        </ListItem>
                        <ListItem button onClick={this.handleClick('/books')} >
                            <ListItemIcon>
                                <Icon color="action" className={'fas fa-book'} />
                            </ListItemIcon>
                            <ListItemText primary="Libri" />
                        </ListItem>
                        <ListItem button onClick={this.handleClick('/news')} >
                            <ListItemIcon>
                                <Icon color="action" className={'fas fa-bullhorn'} />
                            </ListItemIcon>
                            <ListItemText primary="News" />
                        </ListItem>
                    </List>
                    <Divider />
                    <List>
                        <ListItem button onClick={this.handleClick(`/users/${user.id}`)} >
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
                                <Icon color="action" className={'fas fa-lightbulb'} />
                            </ListItemIcon>
                            <ListItemText inset primary="Tema scuro" />
                        </ListItem>
                    </List>
                    <Divider />
                    <List>
                        <ListItem button onClick={this.handleClick('/search')} >
                            <ListItemIcon>
                                <SearchIcon />
                            </ListItemIcon>
                            <ListItemText inset primary="Cerca" />
                        </ListItem>
                    </List>
                </SwipeableDrawer>
                <main className={classes.content}>
                    {this.props.children}
                    <div className={classes.spacer}></div>
                </main>
                <SpeedDials />
            </div>
        );
    }
}

const styles = theme => ({
    root: {
        flexGrow: 1,
        zIndex: 1,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
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
    content: {
        position: 'relative',
        flexGrow: 1,
        zIndex: theme.zIndex.drawer + 2,
        backgroundColor: theme.palette.background.default,
        marginTop: '64px',
        padding: theme.spacing.unit*2,
        paddingBottom: 0,
        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing.unit,
            paddingBottom: 0,
        },
        [theme.breakpoints.down('xs')]: {
            marginTop: '56px',
        },
        overflowY: 'auto'
    },
    spacer: {
        width: '100%',
        height: `${theme.spacing.unit * 3 + 56}px`,
    },
    title: {
        color: theme.palette.common.white,
    },
    avatar: {
        width: '24px',
        height: '24px',
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