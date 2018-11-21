import React, { Component } from 'react';

import LocalStorage from '../../lib/LocalStorage';
import { getStatusColor } from '../../lib/Utils';

import Moment from 'react-moment';
import 'moment/locale/it';

import classnames from 'classnames';

import {
    withStyles,
    Chip,
    Divider,
    Grid,
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Button,
    Collapse,
    Typography,
    IconButton,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from '@material-ui/core';

import ReactMarkdown from 'react-markdown';
import ProjectTeam from './ProjectTeam';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import PhoneIcon from '@material-ui/icons/Phone';
import EmailIcon from '@material-ui/icons/Email';
import DocumentList from './DocumentList';

import Api from '../../lib/Api';
import history from '../../lib/history';

import { withSnackbar } from 'notistack';

class Project extends Component {
    state = {
        expanded: false,
        anchorEl: null,
        dialogOpen: false,
    };

    handleExpandClick = () => {
        this.setState(state => ({ expanded: !state.expanded }));
    };

    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    };
    
    handleClose = value => () => {
        switch (value) {
            case 'dialog':
                this.setState({
                    dialogOpen: true,
                });
                break;
            case 'edit':
                history.push(`/projects/${this.props.project.id}/edit`);
                break;
            case 'delete':
                Api.delete(`/projects/${this.props.project.id}`).then(response => {
                    response.meta.messages.forEach(message => this.props.enqueueSnackbar(message, {variant: 'success'}));
                    history.push('/projects');
                }).catch(({errors}) => {
                    errors.forEach(error => this.props.enqueueSnackbar(error.detail, {variant: 'error'}));
                });
                break;
            case 'cancel':
                this.setState({
                    dialogOpen: false,
                });
                break;
            case 'close':
                this.setState({
                    anchorEl: null,
                });
                break;
            default:
                break;
        }
    };

    isAdmin = admin => {
        return admin.id === LocalStorage.get('user').data.id
    };

    render() {
        const { classes, project, admin, collaborators } = this.props;
        const { expanded, anchorEl, dialogOpen } = this.state;

        if (!project || !admin) {
            return null;
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
                            title={<Typography className={classes.title} component="h1" noWrap>{project.attributes.title}</Typography>}
                            subheader={
                                <div>
                                    <Moment className={classes.moment} parse="YYYY-MM-DD HH:mm" locale="it" format="ll" >{project.attributes.created_at}</Moment>
                                    <Chip className={classes.status} style={{backgroundColor: getStatusColor(project.attributes.status.name)}} label={project.attributes.status.name} />
                                </div>
                            }
                            action={
                                this.isAdmin(admin)
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
                                            onClose={this.handleClose('close')}
                                        >
                                            <MenuItem onClick={this.handleClose('edit')}>
                                                <ListItemIcon>
                                                    <EditIcon />
                                                </ListItemIcon>
                                                <ListItemText inset primary="Modifica" />
                                            </MenuItem>
                                            <MenuItem onClick={this.handleClose('dialog')}>
                                                <ListItemIcon >
                                                    <DeleteIcon />
                                                </ListItemIcon>
                                                <ListItemText inset primary="Elimina" />
                                            </MenuItem>
                                        </Menu>
                                        <Dialog
                                            open={dialogOpen}
                                            onClose={this.handleClose('cancel')}
                                            aria-labelledby={`project-dialog-title-${project.id}`}
                                            aria-describedby={`project-dialog-description-${project.id}`}
                                        >
                                            <DialogTitle id={`project-dialog-title-${project.id}`}>{"Vuoi eliminare il progetto?"}</DialogTitle>
                                            <DialogContent>
                                                <DialogContentText id={`project-dialog-description-${project.id}`}>
                                                    Questa operazione è irrevesribile, una volta cancellato il progetto non sarai più in grado di ripristinarlo.
                                                </DialogContentText>
                                            </DialogContent>
                                            <DialogActions>
                                                <Button onClick={this.handleClose('delete')} color="primary">
                                                    Elimina progetto
                                                </Button>
                                                <Button onClick={this.handleClose('cancel')} color="primary" autoFocus>
                                                    Annulla
                                                </Button>
                                            </DialogActions>
                                        </Dialog>
                                    </div>
                                : null
                            }
                        />
                        <Divider />
                        <CardContent>
                            <Typography variant="overline">Descrizione del progetto</Typography>
                            <ReactMarkdown className={classes.markdown} source={project.attributes.description} escapeHtml={false}/>
                        </CardContent>
                        <Divider />
                        <CardContent>
                            <Typography variant="overline">Documenti</Typography>
                            {
                                project.attributes.documents
                                ? <DocumentList documents={project.attributes.documents} />
                                : <Typography variant="body1">Non è presente nessun documento.</Typography>
                            }
                        </CardContent>
                        <Divider />
                        <CardContent>
                            <Typography variant="overline">Risultati</Typography>
                            {
                                project.attributes.results
                                ? <ReactMarkdown className={classes.markdown} source={project.attributes.results} escapeHtml={false}/>
                                : <Typography variant="body1">L'amministratore non ha ancora pubblicato i risultati.</Typography>
                            }
                        </CardContent>
                        <Divider />
                        <CardContent>
                            <Grid container>
                                <Grid item xs={12}>
                                    <Typography variant="overline">Contatta l'amministratore</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    {
                                        admin.attributes.phone
                                        ? <IconButton href={`tel:${admin.attributes.phone}`} aria-label="telefono">
                                            <PhoneIcon />
                                        </IconButton>
                                        : null
                                    }
                                    <IconButton href={`mailto:${admin.attributes.email}`} aria-label="email">
                                        <EmailIcon />
                                    </IconButton>
                                    <Typography variant="subtitle1" noWrap className={classes.contactInfo}>{`${this.getAdmin(team).attributes.email}`}</Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                        <Divider />
                        <CardContent>
                            <Grid container>
                                <Grid item xs={12}>
                                    <Typography variant="overline">Categorie</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <ChipList categories={project.attributes.categories} classes={classes} />
                                </Grid>
                            </Grid>
                        </CardContent>
                        <Divider />
                        <CardActions className={classes.actions} disableActionSpacing>
                            <Button
                                variant="text"
                                size="small"
                                onClick={this.handleExpandClick}
                                aria-expanded={expanded}
                                aria-label="Team"
                                className={classes.button}
                            >
                                Team
                                <ExpandMoreIcon 
                                    className={classnames(classes.expand, {
                                        [classes.expandOpen]: expanded,
                                    })}
                                />
                            </Button>
                        </CardActions>
                        <Collapse in={expanded} timeout="auto" unmountOnExit>
                            <CardContent>
                                <ProjectTeam admin={admin} collaborators={collaborators} />
                            </CardContent>
                        </Collapse>
                    </Card>
                </Grid>
            </Grid>
        );
    }
}

const ChipList = ({categories, classes}) => {
    return categories.map(category =>
        <Chip
            key={category.id}
            label={category.name}
            className={classes.chip}
        />
    );
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
    actions: {
        display: 'flex',
    },
    button: {
        marginLeft: 'auto',
        textTransform: 'capitalize'
    },
    expand: {
        transform: 'rotate(0deg)',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
        marginLeft: 'auto',
        [theme.breakpoints.up('sm')]: {
            marginRight: -8,
        },
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    moment: {
        display: 'block',
        color: theme.palette.text.hint,
        margin: theme.spacing.unit,
    },
    status: {
        margin: theme.spacing.unit,
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
    chip: {
        margin: theme.spacing.unit,
    }
    contactInfo: {
        display: 'inline-flex',
        [theme.breakpoints.down('xs')]: {
            display: 'block',
            paddingLeft: '12px',
        }
    }
});

export default withSnackbar(withStyles(styles)(Project));