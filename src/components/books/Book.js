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
    IconButton,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    GridList,
    CircularProgress,
    GridListTile, Chip,
} from '@material-ui/core';

import ReactMarkdown from 'react-markdown';

import MoreVertIcon from '@material-ui/icons/MoreVert';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import PhoneIcon from '@material-ui/icons/Phone';
import EmailIcon from '@material-ui/icons/Email';
import Api from "../../lib/Api";
import imagePlaceholder from "../../img/image-placeholder.jpg";
import Lightbox from 'react-images';
import PriceChip from "./PriceChip";
import {createPhotoTiles, getCourseColor} from "../../lib/Utils";

class Book extends Component {
    state = {
        anchorEl: null,
        photoTiles: null,
        lightboxIsOpen: false,
        currentImage: 0
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
        const { anchorEl, photoTiles } = this.state;
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
                                        <Chip className={classes.courseChip} style={{backgroundColor: getCourseColor(book.attributes.course)}} label={book.attributes.course} />
                                        <PriceChip price={book.attributes.price}/>
                                    </div>
                                </div>
                            }
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
                            <Grid container>
                                <Grid item xs={12}>
                                    <Typography variant="overline">Contatta l'utente</Typography>
                                </Grid>
                                {
                                    user.attributes.phone
                                        ?
                                        <Grid item xs={12}>
                                            <IconButton href={`tel:${user.attributes.phone}`} aria-label="telefono">
                                                <PhoneIcon />
                                            </IconButton>
                                            <Typography variant="subtitle1" noWrap className={classes.contactInfo}>{`${user.attributes.phone}`}</Typography>
                                        </Grid>
                                        : null
                                }
                                <Grid item xs={12}>
                                    <IconButton href={`mailto:${user.attributes.email}`} aria-label="email">
                                        <EmailIcon />
                                    </IconButton>
                                    <Typography variant="subtitle1" noWrap className={classes.contactInfo}>{`${user.attributes.email}`}</Typography>
                                </Grid>
                            </Grid>
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
    courseChip: {
        margin: `${theme.spacing.unit}px 0px`,
        color: theme.palette.common.white,
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

export default withStyles(styles)(Book);