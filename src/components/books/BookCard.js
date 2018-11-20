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
    Menu, ListItemIcon, ListItemText,
} from '@material-ui/core';

import MoreVertIcon from '@material-ui/icons/MoreVert';
import LocalStorage from "../../lib/LocalStorage";
import Moment from "react-moment";
import Anchor from "../common/Anchor";
import PriceChip from "./PriceChip";
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import history from '../../lib/history'
import { getCourseColor, getInitials, createPhotoTiles } from "../../lib/Utils";
import imagePlaceholder from '../../img/image-placeholder.jpg';
import Api from "../../lib/Api";

class BookCard extends Component {

    state = {
        anchorEl: null,
        photoTiles: null
    };

    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    handleSelected = value => () => {
        this.setState({ anchorEl: null });

        switch(value) {
            case 'modifica':
                console.log('modifica');
                /**
                 * @TODO Handle edit
                 */
                break;
            case 'elimina':
                console.log('elimina');
                /**
                 * @TODO Handle delete
                 */
                break;
            default:
                console.log('ciao');
                break;
        }
    };

    componentDidMount() {
        let photoTiles = createPhotoTiles(this.props.book.attributes.photos, 3);

        photoTiles.forEach((tile, index) => {
            Api.download(tile.activeStorageUrl)
                .then(fileUrl => {
                    photoTiles[index].fileUrl = fileUrl;
                    photoTiles[index].loading = false;
                    this.setState({photoTiles});
                })
                .catch(() => {
                    photoTiles[index].loading = false;
                    this.setState({photoTiles});
                });
        });
    }

    isAuthUserAdmin = () => {
        return LocalStorage.get('user').data.id === this.props.user.id;
    };

    render() {
        const { book, user, classes } = this.props;
        const { anchorEl, photoTiles } = this.state;
        const open = Boolean(anchorEl);

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
                            this.isAuthUserAdmin()
                                ? <div>
                                    <IconButton
                                        onClick={this.handleClick}
                                        aria-owns={anchorEl ? 'options-menu' : null}
                                        aria-haspopup="true"
                                    >
                                        <MoreVertIcon />
                                    </IconButton>
                                    <Menu
                                        id="options-menu"
                                        anchorEl={anchorEl}
                                        open={Boolean(anchorEl)}
                                        onClose={this.handleClose}
                                    >
                                        <MenuItem onClick={this.handleSelected('modifica')} value="modifica">
                                            <ListItemIcon>
                                                <EditIcon />
                                            </ListItemIcon>
                                            <ListItemText inset primary="Modifica" />
                                        </MenuItem>
                                        <MenuItem onClick={this.handleSelected('elimina')} value="elimina">
                                            <ListItemIcon >
                                                <DeleteIcon />
                                            </ListItemIcon>
                                            <ListItemText inset primary="Elimina" />
                                        </MenuItem>
                                    </Menu>
                                </div>
                                : null
                        }
                    />
                    <CardActionArea className={classes.cardContent} onClick={() => history.push(`/books/${book.id}`)}>
                        <CardContent>
                            <Typography noWrap gutterBottom variant="h6">{book.attributes.title}</Typography>
                            <Typography noWrap variant="body1">{book.attributes.description}</Typography>
                                <div className={classes.gridListContainer}>
                                    { photoTiles ?
                                        <GridList className={classes.gridList} cellHeight={160} cols={3}>
                                            { photoTiles.map(tile => {
                                                if (tile.loading) {
                                                    return <div key={tile.id} style={{
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center'
                                                    }}>
                                                        <CircularProgress size={50}/>
                                                    </div>
                                                }
                                                if (tile.fileUrl) {
                                                    return <GridListTile key={tile.id} cols={tile.cols}>
                                                        <img src={tile.fileUrl} alt={`book-pic-${tile.id}`}/>
                                                    </GridListTile>
                                                }
                                                return <GridListTile key={tile.id} cols={tile.cols}>
                                                    <img src={imagePlaceholder} alt='book-placeholder-img'/>
                                                </GridListTile>
                                            })
                                            }
                                        </GridList>
                                        : null
                                    }
                                </div>
                        </CardContent>
                    </CardActionArea>
                    <Divider/>
                    <CardActions>
                        <Chip className={classes.courseChip} style={{backgroundColor: getCourseColor(book.attributes.course)}} label={book.attributes.course}/>
                        <PriceChip price={book.attributes.price} style={{marginLeft: 'auto'}}/>
                    </CardActions>
                </Card>
            </Grid>
        );
    }

}

const styles = theme => ({
    cardContent: {
        width: '100%'
    },
    courseChip: {
        color: theme.palette.common.white,
    },
    gridListContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
        marginTop: '16px',
        [theme.breakpoints.up('md')]: {
            height: '160px',
        },
    },
    gridList: {
        width: '100%',
    },
});

export default withStyles(styles)(BookCard);
