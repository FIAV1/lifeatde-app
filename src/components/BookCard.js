import React, { Component } from 'react';

import {
    withStyles,
    Avatar,
    IconButton,
    Card,
    CardHeader,
    CardContent,
    CardActionArea,
    CardActions,
    Chip,
    Divider,
    MenuItem,
    Grid,
    Typography,
    Menu,
} from '@material-ui/core';

import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import LocalStorage from "../lib/LocalStorage";
import Moment from "react-moment";
import { Link } from "react-router-dom";
import history from '../lib/history'
import green from '@material-ui/core/colors/green';

class BookCard extends Component {
    state = {
        authUser: LocalStorage.get('user'),
        menuAnchorEl: null
    };

    handleClick = event => {
        this.setState({ menuAnchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ menuAnchorEl: null });
    };

    handleDelete = () => {
        /**
         * @TODO Create a Dialog component for confirmation and display that dialog
         */
    };

    render() {
        const { book, user, classes } = this.props;
        const {menuAnchorEl} = this.state;
        const open = Boolean(menuAnchorEl);

        return (
            <Grid item xs={12} md={6} xl={4}>
                <Card>
                    <CardHeader
                        avatar={
                            <Link to={`/users/${user.id}`} className={classes.link}>
                                <Avatar src={user.attributes.avatar.url} aria-label="user-avatar"/>
                            </Link>
                        }
                        title={
                            <Link to={`/users/${user.id}`} className={classes.link}>
                                {user.attributes.firstname} {user.attributes.lastname}
                            </Link>
                        }
                        subheader={<Moment locale="it" parse="YYYY-MM-DD HH:mm"
                                           fromNow>{book.attributes.created_at}</Moment>}
                        action={
                            this.state.authUser.id === user.id ?
                                <IconButton
                                    aria-label="Opzioni"
                                    aria-owns={open ? 'options-menu' : null}
                                    aria-haspopup="true"
                                    onClick={this.handleClick}
                                >
                                    <MoreHorizIcon/>
                                </IconButton>
                                :
                                null
                        }
                    />
                    <CardActionArea className={classes.cardContent} onClick={() => history.push(`/books/${book.id}`)}>
                        <CardContent>
                            <Typography noWrap gutterBottom variant="title" component="h1">{book.attributes.title}</Typography>
                            <Typography noWrap component="p">{book.attributes.description}</Typography>
                        </CardContent>
                    </CardActionArea>
                    <Divider/>
                    <CardActions>
                        <Chip key={book.attributes.course} label={book.attributes.course}/>
                        <Chip className={classes.priceChip} label={`${book.attributes.price} €`}/>
                    </CardActions>

                    <Menu
                        id="options-menu"
                        anchorEl={menuAnchorEl}
                        open={open}
                        onClose={this.handleClose}
                    >
                        <MenuItem onClick={() => history.push(`/books/${book.id}/edit`)}>Modifica</MenuItem>
                        <MenuItem onClick={this.handleDelete}>Elimina</MenuItem>
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
    link: {
        color: theme.palette.text.primary,
        textDecoration: 'none',
        '&:hover': {
            color: theme.palette.primary.light,
        }
    },
    priceChip: {
        marginLeft: 'auto',
        backgroundColor: green[700],
        color: 'white',
    }
});

export default withStyles(styles)(BookCard);