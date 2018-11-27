import React, { Component } from 'react';

import {
    withStyles,
    Card,
    CardHeader,
    CardContent,
    CardActionArea,
    CardActions,
    Chip,
    CircularProgress,
    Divider,
    Grid,
    GridList,
    GridListTile,
    Typography,
} from '@material-ui/core';

import LocalStorage from "../../lib/LocalStorage";
import Moment from "react-moment";
import Anchor from "../common/Anchor";
import PriceChip from "./PriceChip";
import history from '../../lib/history'
import { getCourseColor, createPhotoTiles } from "../../lib/Utils";
import imagePlaceholder from '../../img/image-placeholder.jpg';
import Api from "../../lib/Api";
import EditDeleteActions from "../common/EditDeleteActions";
import DeleteConfirmationDialog from "../common/DeleteConfirmationDialog";
import AsyncAvatar from '../common/AsyncAvatar';
import { withSnackbar } from 'notistack';

class BookCard extends Component {

    state = {
        photoTiles: null,
        confirmationDialogIsOpen: false,
        bookId: null
    };

    handleClickEdit = () => {
        history.push(`/books/${this.props.book.id}/edit`);
    };

    openConfirmationDialog = bookId => {
        this.setState({
            confirmationDialogIsOpen: true,
            bookId: bookId,
        });
    };

    deleteBook = () => {
        Api.delete(`/books/${this.props.book.id}`, null).then(response => {
            this.props.removeBook(this.props.book.id);
            response.meta.messages.forEach(message => this.props.enqueueSnackbar(message, {variant: 'success'}));
        }).catch(({errors}) => {
            errors.forEach(error => this.props.enqueueSnackbar(error.detail, {variant: 'error'}));
        });
    };

    isAuthUserAdmin = () => {
        return LocalStorage.get('user').data.id === this.props.user.id;
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

    render() {
        const { book, user, classes } = this.props;
        const { photoTiles } = this.state;
        
        if(!user || !book) {
            return null;
        }

        return (
            <Grid item xs={12} md={6} xl={4}>
                <Card>
                    <CardHeader
                        avatar={
                            <Anchor to={`/users/${user.id}`}>
                                <AsyncAvatar user={user} />
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
                                    <EditDeleteActions
                                        onClickEdit={this.handleClickEdit}
                                        onClickDelete={this.openConfirmationDialog}
                                    />
                                    <DeleteConfirmationDialog
                                        open={this.state.confirmationDialogIsOpen}
                                        title={"Vuoi togliere il materiale dalla vendita?"}
                                        body={"Questa operazione è irreversibile, una volta eliminato l'annuncio non sarà più possibile recuperarlo."}
                                        onClickDelete={this.deleteBook}
                                        onClose={() => {this.setState({confirmationDialogIsOpen: false})}}
                                    />
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
                        <Grid container>
                            <Grid className={classes.item} item xs={12} sm={8}>
                                <Chip 
                                    classes={{
                                        root: classes.chipRoot,
                                        label: classes.chipLabel
                                    }}
                                    label={
                                        <Typography  variant='body1' noWrap>{book.attributes.course}</Typography>
                                    }
                                    style={{backgroundColor: getCourseColor(book.attributes.course)}}
                                />
                            </Grid>
                            <Grid className={classes.item} item xs={12} sm={4}>
                                <PriceChip price={book.attributes.price} style={{marginLeft: 'auto'}}/>
                            </Grid>
                        </Grid>
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
    item: {
        display: 'flex',
        paddingRight: theme.spacing.unit,
    },
    chipRoot: {
        maxWidth: '100%',
        marginBottom: theme.spacing.unit
    },
    chipLabel:{
        overflow: 'hidden',
        paddingRight: 0,
        marginRight: '12px',
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

export default withSnackbar(withStyles(styles)(BookCard));
