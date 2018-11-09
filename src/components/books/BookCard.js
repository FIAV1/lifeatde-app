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
    CircularProgress,
    Divider,
    MenuItem,
    Grid,
    GridList,
    GridListTile,
    Typography,
    Menu,
} from '@material-ui/core';

import MoreVertIcon from '@material-ui/icons/MoreHoriz';
import LocalStorage from "../../lib/LocalStorage";
import Moment from "react-moment";
import Anchor from "../common/Anchor";
import history from '../../lib/history'
import green from '@material-ui/core/colors/green';
import { getCourseColor, getInitials } from "../../lib/Utils";
import imagePlaceholder from '../../img/image-placeholder.jpg';
import Api from "../../lib/Api";

class BookCard extends Component {

    getPhotoTiles = () => {
        if (this.props.book.attributes.photos) {
            return this.props.book.attributes.photos
                .slice(0, 3)
                .map((photo, index, array) => {
                    let cols = 3;
                    switch (array.length) {
                        case 2:
                            index === 0 ? cols = 2 : cols = 1;
                            break;
                        case 3:
                            cols = 1;
                            break;
                        default:
                            break;
                    }

                    return {
                        url: photo.url,
                        id: photo.id,
                        cols: cols,
                        loading: true,
                        file: null
                    }
                });
        } else {
            return null;
        }
    };

    state = {
        authUser: LocalStorage.get('user'),
        menuAnchorEl: null,
        photoTiles: this.getPhotoTiles()
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

    componentDidMount() {
        let { photoTiles } = this.state;

        if (photoTiles) {
            photoTiles.forEach((tile, index) => {
                Api.download(tile.url)
                    .then(file => {
                        photoTiles[index].file = file;
                        photoTiles[index].loading = false;
                        this.setState({photoTiles});
                    })
                    .catch(() => {
                        photoTiles[index].loading = false;
                        this.setState({photoTiles});
                    });
            });
        }
    }

    render() {
        const { book, user, classes } = this.props;
        const { menuAnchorEl, photoTiles } = this.state;
        const open = Boolean(menuAnchorEl);

        return (
            <Grid item xs={12} md={6} xl={4}>
                <Card>
                    <CardHeader
                        avatar={
                            <Anchor to={`/users/${user.id}`}>
                                <Avatar
                                    alt={`${user.attributes.firstname} ${user.attributes.lastname}`}
                                    src={user.attributes.avatar.id ? user.attributes.avatar.url : null}
                                >
                                    {user.attributes.avatar.id === null ? getInitials(user.attributes.firstname, user.attributes.lastname) : null}
                                </Avatar>
                            </Anchor>
                        }
                        title={
                            <Anchor to={`/users/${user.id}`}>
                                {user.attributes.firstname} {user.attributes.lastname}
                            </Anchor>
                        }
                        subheader={<Moment locale="it" parse="YYYY-MM-DD HH:mm" fromNow>{book.attributes.created_at}</Moment>}
                        action={
                            this.state.authUser.id === user.id ?
                                <IconButton
                                    aria-label="Opzioni"
                                    aria-owns={open ? 'options-menu' : null}
                                    aria-haspopup="true"
                                    onClick={this.handleClick}
                                >
                                    <MoreVertIcon/>
                                </IconButton>
                                :
                                null
                        }
                    />
                    <CardActionArea className={classes.cardContent} onClick={() => history.push(`/books/${book.id}`)}>
                        <CardContent>
                            <Typography noWrap gutterBottom variant="h6">{book.attributes.title}</Typography>
                            <Typography noWrap variant="body1">{book.attributes.description}</Typography>
                            <div className={classes.listContainer}>
                                <GridList className={classes.gridList} cellHeight={160} cols={3}>
                                    { photoTiles ?
                                        photoTiles.map(tile => {
                                            if (tile.loading) {
                                                return <div key={tile.id} style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                                    <CircularProgress size={50}/>
                                                </div>
                                            }
                                            if (tile.file) {
                                                return <GridListTile key={tile.id} cols={tile.cols}>
                                                    <img src={URL.createObjectURL(tile.file)} alt={`book-pic-${tile.id}`} />
                                                </GridListTile>
                                            }
                                            return <GridListTile key={tile.id} cols={tile.cols}>
                                                <img src={imagePlaceholder} alt='book-placeholder-img' />
                                            </GridListTile>
                                        })
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
                        <Chip key={book.attributes.course} style={{backgroundColor: getCourseColor(book.attributes.course)}} label={book.attributes.course}/>
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
