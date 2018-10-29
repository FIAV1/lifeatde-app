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
    GridList,
    GridListTile,
    Typography,
    Menu,
} from '@material-ui/core';

import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import LocalStorage from "../lib/LocalStorage";
import Moment from "react-moment";
import { Link } from "react-router-dom";
import history from '../lib/history'
import green from '@material-ui/core/colors/green';
import {getInitials} from "../lib/Utils";
import imagePlaceholder from '../img/image-placeholder.jpg';

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
        const { menuAnchorEl } = this.state;
        const open = Boolean(menuAnchorEl);
        let photoTiles = null;

        if (book.attributes.photos) {
            photoTiles = book.attributes.photos.slice(0, 3).map((photo, index, array) => {
                let tile = {
                    id: photo.id,
                    src: photo.url,
                    cols: 3,
                };
                switch (array.length) {
                    case 2:
                        index === 0 ? tile.cols = 2 : tile.cols = 1;
                        break;
                    case 3:
                        tile.cols = 1;
                        break;
                    default:
                        break;
                }
                return tile;
            });

        }

        return (
            <Grid item xs={12} md={6} xl={4}>
                <Card>
                    <CardHeader
                        avatar={
                            <Link to={`/users/${user.id}`} className={classes.link}>
                                <Avatar
                                    alt={`${user.attributes.firstname} ${user.attributes.lastname}`}
                                    src={user.attributes.avatar.id ? user.attributes.avatar.url : null}
                                >
                                    {user.attributes.avatar.id === null ? getInitials(user.attributes.firstname, user.attributes.lastname) : null}
                                </Avatar>
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
                            <Typography noWrap gutterBottom variant="h6" component="h1">{book.attributes.title}</Typography>
                            <Typography noWrap variant="body1" component="p">{book.attributes.description}</Typography>
                            <div className={classes.listContainer}>
                                <GridList className={classes.gridList} cellHeight={160} cols={3}>
                                    { photoTiles ?
                                        photoTiles.map((tile, index) => (
                                            <GridListTile key={tile.id} cols={tile.cols}>
                                                <img src={tile.src} alt={`book-pic-${index}`} />
                                            </GridListTile>)
                                        )
                                        :
                                        <GridListTile cols={3}>
                                            <img src={imagePlaceholder} alt='book-placeholder-img' />
                                        </GridListTile>
                                    }
                                </GridList>
                            </div>
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
            color: theme.palette.primary.main,
        }
    },
    priceChip: {
        marginLeft: 'auto',
        backgroundColor: green[700],
        color: 'white',
    },
    listContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
        marginTop: '16px',
    },
    gridList: {
        width: '100%',
    },
});

export default withStyles(styles)(BookCard);