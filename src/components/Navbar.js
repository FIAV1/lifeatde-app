import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import LocalStorage from '../lib/LocalStorage';
import Authentication from '../lib/Authentication';

import {
    withStyles,
    Paper,
    Tabs,
    Tab,
    Icon,
    Avatar,
    Popper,
    Grow,
    ClickAwayListener,
    MenuList,
    MenuItem,
    ListItemIcon,
    ListItemText,
    ListItemSecondaryAction,
    Switch
} from '@material-ui/core';

import AccountIcon from '@material-ui/icons/AccountBox';
import ExitIcon from '@material-ui/icons/ExitToApp';
import PaletteIcon from '@material-ui/icons/Palette';

class Navbar extends Component {
    state = {
        user: LocalStorage.get('user').data,
        open: false,
        checked: this.props.getThemeType() === 'dark'
    };

    
    handleToggle = () => {
        this.setState(state => ({ open: !state.open }));
    };
    
    handleClose = event => {
        if (this.anchorEl.contains(event.target)) {
            return;
        }
    
        this.setState({ open: false });
    };

    handleChange = () => {
        this.props.changeThemeType();
        let checked = this.props.getThemeType() === 'dark';
        this.setState({ checked });
    };

    handleClick = callbackFn => event => {
        if(callbackFn) {
            callbackFn();
        }
        this.handleClose(event);
    }

    getPath = history => {
        if(history.location.pathname === '/') {
            return '/projects';
        }
        return history.location.pathname;
    }

    render() {
        const { classes, history } = this.props;
        
        return (
            <Paper square className={classes.root}>
                <Tabs
                    classes={{
                        root: classes.tabsRoot,
                        indicator: classes.tabsIndicator
                    }}
                    value={this.getPath(history)}
                    fullWidth
                >
                    <Tab
                        classes={{
                            root: classes.tabRoot,
                            label: classes.label,
                            selected: classes.tabSelected,
                            labelContainer: classes.labelContainer
                        }}
                        icon={<Icon color="action" className={classNames(classes.icon, 'fas fa-drafting-compass')} />}
                        label="Progetti"
                        value={'/projects'}
                        onClick={() => history.push('/projects')}
                    />
                    <Tab
                        classes={{
                            root: classes.tabRoot,
                            label: classes.label,
                            selected: classes.tabSelected,
                            labelContainer: classes.labelContainer
                        }}
                        icon={<Icon color="action" className={classNames(classes.icon, 'fas fa-handshake')} />}
                        label="Studio"
                        value={'/studygroups'}
                        onClick={() => history.push('/studygroups')}
                    />
                    <Tab
                        classes={{
                            root: classes.tabRoot,
                            label: classes.label,
                            selected: classes.tabSelected,
                            labelContainer: classes.labelContainer
                        }}
                        icon={<Icon color="action" className={classNames(classes.icon, 'fas fa-book')} />}
                        value={'/books'}
                        label="Libri"
                    />
                    <Tab
                        classes={{
                            root: classes.tabRoot,
                            label: classes.label,
                            selected: classes.tabSelected,
                            labelContainer: classes.labelContainer
                        }}
                        icon={<Icon color="action" className={classNames(classes.icon, 'fas fa-newspaper')} />}
                        value={'/news'}
                        label="News"
                    />
                    <Tab
                        classes={{
                            root: classes.tabRoot,
                            label: classes.label,
                            selected: classes.tabSelected,
                            labelContainer: classes.labelContainer
                        }}
                        buttonRef={node => {
                            this.anchorEl = node;
                        }}
                        aria-haspopup="true"
                        onClick={this.handleToggle}
                        icon={<Avatar alt="user-avatar" src={this.state.user.attributes.avatar.url} className={classes.avatar} />}
                        value={'/user/'+this.state.user.id}
                    />
                </Tabs>
                <Popper open={this.state.open} anchorEl={this.anchorEl} transition placement="bottom-end">
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        id="menu-list-grow"
                        style={{ transformOrigin: placement === 'bottom' ? 'center bottom' : 'center top' }}
                    >
                        <Paper>
                        <ClickAwayListener onClickAway={this.handleClose}>
                            <MenuList className={classes.menuList}>
                                <MenuItem onClick={this.handleClick((() => history.push('/user/'+this.state.user.id)))}>
                                    <ListItemIcon>
                                        <AccountIcon />
                                    </ListItemIcon>
                                    <ListItemText inset primary="Profilo" />
                                </MenuItem>
                                <MenuItem onClick={this.handleClick(Authentication.logout)}>
                                    <ListItemIcon>
                                        <ExitIcon />
                                    </ListItemIcon>
                                    <ListItemText inset primary="Logout" />
                                </MenuItem>
                                <MenuItem onClick={this.handleClick()}>
                                    <ListItemIcon>
                                        <PaletteIcon />
                                    </ListItemIcon>
                                    <ListItemText inset primary="Tema scuro" />
                                    <ListItemSecondaryAction>
                                        <Switch
                                            checked={this.state.checked}
                                            onChange={this.handleChange}
                                            color="primary"
                                        />
                                    </ListItemSecondaryAction>
                                </MenuItem>
                            </MenuList>
                        </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
                </Popper>
            </Paper>
        );
    }
}

const styles = theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.primary.dark,
    },
    avatar: {
        width: '35px',
        height: '35px',
        [theme.breakpoints.down('sm')]: {
            width: '20px',
            height: '20px',
        },
    },
    icon: {
        color: theme.palette.grey[50],
        [theme.breakpoints.down('sm')]: {
            fontSize: '14px',
        },
    },
    tabsRoot: {
        flex: 1,
        color: theme.palette.grey[50]
    },
    tabRoot: {
        flex:1,
        [theme.breakpoints.down('sm')]: {
            minWidth: 'unset',
            minHeight: '48px'
        },
        '&$tabSelected': {
            color: theme.palette.grey[50]
        },
    },
    label: {
        [theme.breakpoints.down('sm')]: {
            fontSize: '10px',
        },
    },
    tabSelected: {},
    tabsIndicator: {
        backgroundColor: theme.palette.grey[50]
    },
    labelContainer: {
        [theme.breakpoints.down('sm')]: {
            padding: 0,
        },
    },
    menuList: {
        minWidth: '250px'
    }
});

Navbar.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Navbar);