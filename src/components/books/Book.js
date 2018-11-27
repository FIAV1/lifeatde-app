import React, { Component } from 'react';

import LocalStorage from '../../lib/LocalStorage';

import Moment from 'react-moment';
import 'moment/locale/it';

import {
    withStyles,
    Divider,
    Grid,
    Card,
    CardHeader,
    CardContent,
    Typography,
    GridList,
    CircularProgress,
    GridListTile, Chip,
} from '@material-ui/core';

import ReactMarkdown from 'react-markdown';

import ContactInfo from "../common/ContactInfo";
import Api from "../../lib/Api";
import imagePlaceholder from "../../img/image-placeholder.jpg";
import Lightbox from 'react-images';
import PriceChip from "./PriceChip";
import {createPhotoTiles, getCourseColor} from "../../lib/Utils";
import EditDeleteActions from "../common/EditDeleteActions";
import history from "../../lib/history";
import DeleteConfirmationDialog from "../common/DeleteConfirmationDialog";
import { withSnackbar } from 'notistack';

class Book extends Component {

    state = {
        photoTiles: null,
        lightboxIsOpen: false,
        currentImage: 0,
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
            response.meta.messages.forEach(message => this.props.enqueueSnackbar(message, {variant: 'success'}));
            history.push('/books');
        }).catch(({errors}) => {
            errors.forEach(error => this.props.enqueueSnackbar(error.detail, {variant: 'error'}));
        });
    };

    isAuthUserAdmin = () => {
        return LocalStorage.get('user').data.id === this.props.user.id;
    };

    closeLightbox = () => {
        this.setState({ lightboxIsOpen: false });
    };

    gotoPrevLightboxImage = () => {
        this.setState({ currentImage: this.state.currentImage - 1 });
    };

    gotoNextLightboxImage = () => {
        this.setState({ currentImage: this.state.currentImage + 1 });
    };

    componentDidMount() {
        let photoTiles = createPhotoTiles(this.props.book.attributes.photos);

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
        const { classes, book, user } = this.props;
        const { photoTiles } = this.state;
        let lightboxImageSet = null;

        if (photoTiles) {
            lightboxImageSet = photoTiles.filter((tile) => !tile.loading ).map((tile) => ({src: tile.fileUrl}));
        }

        return(
            <Grid container justify="center">
                <Grid item xs={12} md={10} lg={8}>
                    <Card className={classes.paper}>
                        <CardHeader
                            classes={{
                                content: classes.headerContent,
                                action: classes.headerAction,
                            }}
                            title={<Typography className={classes.title} component="h1">{book.attributes.title}</Typography>}
                            subheader={
                                <div>
                                    <Moment className={classes.moment} parse="YYYY-MM-DD HH:mm" locale="it" format="ll" >{book.attributes.created_at}</Moment>
                                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap'}}>
                                        <Chip
                                            classes={{
                                                root: classes.courseChipRoot,
                                                label: classes.courseChipLabel
                                            }}
                                            style={{backgroundColor: getCourseColor(book.attributes.course)}}
                                            label={<Typography noWrap variant={'body'}>{book.attributes.course}</Typography>}
                                        />
                                        <PriceChip price={book.attributes.price}/>
                                    </div>
                                </div>
                            }
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
                        <Divider />
                        <CardContent>
                            <Typography variant="overline">Descrizione</Typography>
                            <ReactMarkdown className={classes.markdown} source={book.attributes.description}/>
                        </CardContent>
                        <Divider />
                        <CardContent>
                            <Typography variant="overline">Foto</Typography>
                            {
                                book.attributes.photos
                                    ? <div className={classes.listContainer}>
                                        <GridList className={classes.gridList} cellHeight={160} cols={3}>
                                            { photoTiles ?
                                                photoTiles.map((tile, index) => {
                                                    if (tile.loading) {
                                                        return <div key={tile.id} style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                                            <CircularProgress size={50}/>
                                                        </div>
                                                    }
                                                    if (tile.fileUrl) {
                                                        return <GridListTile
                                                            key={tile.id}
                                                            cols={tile.cols}
                                                            style={{cursor: 'pointer'}}
                                                            onClick={() => this.setState({
                                                                lightboxIsOpen: true,
                                                                currentImage: index,
                                                            })}
                                                        >
                                                            <img src={tile.fileUrl} alt={`book-pic-${tile.id}`} />
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
                                        {lightboxImageSet ?
                                        <Lightbox
                                            images={lightboxImageSet}
                                            currentImage={this.state.currentImage}
                                            isOpen={this.state.lightboxIsOpen}
                                            onClickPrev={this.gotoPrevLightboxImage}
                                            onClickNext={this.gotoNextLightboxImage}
                                            onClose={this.closeLightbox}
                                            backdropClosesModal
                                            imageCountSeparator = " di "
                                        />
                                    : null}
                                    </div>
                                    : <Typography variant="body1">Non è presente nessuna foto.</Typography>
                            }
                        </CardContent>
                        <Divider />
                        <CardContent>
                            <ContactInfo phone={user.attributes.phone} email={user.attributes.email} admin={false}/>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        );
    }
}

const styles = theme => ({
    title: {
        fontSize: '2rem',
        [theme.breakpoints.up('md')]: {
            fontSize: '3rem'
        }
    },
    headerContent: {
        width: `calc(100% - ${theme.spacing.unit*2}px - 72px)`,
    },
    headerAction: {
        width: 'auto',
    },
    moment: {
        display: 'block',
        color: theme.palette.text.hint,
        margin: theme.spacing.unit,
    },
    courseChipRoot: {
        maxWidth: '100%',
        color: theme.palette.common.white,
        margin: `${theme.spacing.unit}px 0px`,
    },
    courseChipLabel:{
        overflow: 'hidden',
        paddingRight: 0,
        marginRight: '12px',
    },
    markdown: {
        color: theme.palette.text.primary,
    },
    icon: {
        marginRight: theme.spacing.unit,
    },
    delete: {
        marginLeft: theme.spacing.unit,
    },
    contactInfo: {
        display: 'inline-flex',
        [theme.breakpoints.down('xs')]: {
            display: 'block',
            paddingLeft: '12px',
        }
    }
});

export default withSnackbar(withStyles(styles)(Book));