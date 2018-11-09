import React, { Component } from 'react';

import Moment from 'react-moment';
import 'moment/locale/it';

import LocalStorage from '../lib/LocalStorage';

import history from '../lib/history';

import { getInitials } from '../lib/Utils';

import {
    withStyles,
    Card,
    CardHeader,
    CardActionArea,
    CardContent,
    CardActions,
    Avatar,
    Typography,
    Grid,
    IconButton,
    Menu,
    MenuItem,
} from '@material-ui/core';

import MoreVertIcon from '@material-ui/icons/MoreVert';
import CategoriesMenu from './CategoriesMenu';
import Anchor from "./Anchor";

class ProjectCard extends Component {
    state = {
        anchorEl: null,
        authUser: LocalStorage.get('user').data,
    };

    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    render() {
        const { classes, project, admin } = this.props;
        const { anchorEl } = this.state;
        const open = Boolean(anchorEl);
        
        return(
            <Grid item xs={12} md={6} xl={4}>
                <Card>
                    <CardHeader
                        avatar={
                            <Anchor to={`/users/${admin.id}`}>
                                <Avatar
                                    alt={`${admin.attributes.firstname} ${admin.attributes.lastname}`}
                                    src={admin.attributes.avatar.id ? admin.attributes.avatar.url : null}
                                >
                                    {admin.attributes.avatar.id === null ? getInitials(admin.attributes.firstname, admin.attributes.lastname) : null}
                                </Avatar>
                            </Anchor>
                        }
                        title={
                            <Anchor to={`/users/${admin.id}`}>
                                {admin.attributes.firstname} {admin.attributes.lastname}
                            </Anchor>
                        }
                        subheader={<Moment parse="YYYY-MM-DD HH:mm" locale="it" fromNow>{project.attributes.created_at}</Moment>}
                        action={
                            this.state.authUser.id === admin.id ?
                                <IconButton
                                    aria-label="Opzioni"
                                    aria-owns={open ? `options-menu-${project.id}` : null}
                                    aria-haspopup="true"
                                    onClick={this.handleClick}
                                >
                                    <MoreVertIcon />
                                </IconButton>
                            :
                                null
                        }
                    />
                    <CardActionArea className={classes.cardContent} onClick={() => history.push(`/projects/${project.id}`)}>
                        <CardContent>
                            <Typography noWrap gutterBottom variant="h6">{project.attributes.title}</Typography>
                            <Typography noWrap variant="body1">{project.attributes.description}</Typography>
                        </CardContent>
                    </CardActionArea>
                    <CardActions>
                        <CategoriesMenu id={project.id} elements={project.attributes.categories} />
                    </CardActions>
                    <Menu
                        id={`options-menu-${project.id}`}
                        anchorEl={anchorEl}
                        open={open}
                        onClose={this.handleClose}
                    >
                        <MenuItem onClick={this.handleClose}>Modifica</MenuItem>
                        <MenuItem onClick={this.handleClose}>Elimina</MenuItem>
                    </Menu>
                </Card>
            </Grid>
        );
    }
}

const styles = theme => ({
    cardContent: {
        width: '100%'
    },
});
  
export default withStyles(styles)(ProjectCard);