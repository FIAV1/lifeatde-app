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
    Chip,
} from '@material-ui/core';

import MoreVertIcon from '@material-ui/icons/MoreVert';

class StudyGroupCard extends Component {

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
        const { classes, study_group, admin } = this.props;
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
                        subheader={<Moment locale="it" parse="YYYY-MM-DD HH:mm" fromNow>{study_group.attributes.created_at}</Moment>}
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
                            <Typography noWrap gutterBottom variant="title" component="h1">{study_group.attributes.title}</Typography>
                            <Typography noWrap component="p">{study_group.attributes.description}</Typography>
                        </CardContent>
                    </CardActionArea>
                    <CardActions>
                        <Chip className={classes.chip} key={study_group.attributes.course} label={study_group.attributes.course}/>)}
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
    card: {
        margin: '0 auto 20px'
    },
    cardContent: {
        width: '100%'
    },
});
    
StudyGroupCard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(StudyGroupCard);
