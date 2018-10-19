import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Moment from 'react-moment';
import 'moment/locale/it';

import LocalStorage from '../lib/LocalStorage';

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
import ChipList from './ChipList';

class ProjectCard extends Component {
    state = {
        anchorEl: null,
        authUser: LocalStorage.get('user').data,
    }

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
                <Card className={classes.card}>
                    <CardHeader
                        avatar={
                            <Avatar alt={`${admin.attributes.firstname} ${admin.attributes.lastname}`} src={admin.attributes.avatar.url} className={classes.avatar} />
                        }
                        title={`${admin.attributes.firstname} ${admin.attributes.lastname}`}
                        subheader={<Moment locale="it" fromNow>{project.attributes.created_at}</Moment>}
                        action={
                            this.state.authUser.id === admin.id ?
                                <IconButton
                                    aria-label="Opzioni"
                                    aria-owns={open ? 'options-menu' : null}
                                    aria-haspopup="true"
                                    onClick={this.handleClick}
                                >
                                    <MoreVertIcon />
                                </IconButton>
                            :
                                null
                        }
                    />
                    <CardActionArea className={classes.cardContent}>
                        <CardContent>
                            <Typography noWrap gutterBottom variant="title" component="h1">{project.attributes.title}</Typography>
                            <Typography noWrap component="p">{project.attributes.description}</Typography>
                        </CardContent>
                    </CardActionArea>
                    <CardActions>
                        <ChipList elements={project.attributes.categories} />
                    </CardActions>
                    <Menu
                        id="options-menu"
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
    
ProjectCard.propTypes = {
    classes: PropTypes.object.isRequired,
};
  
export default withStyles(styles)(ProjectCard);