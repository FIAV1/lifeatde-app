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
} from '@material-ui/core';

import ReactMarkdown from 'react-markdown';
import ProjectTeam from './ProjectTeam';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PhoneIcon from '@material-ui/icons/Phone';
import EmailIcon from '@material-ui/icons/Email';
import DocumentList from './DocumentList';

import Api from '../../lib/Api';
import history from '../../lib/history';

import { withSnackbar } from 'notistack';
import EditDeleteActions from "../common/EditDeleteActions";
import DeleteConfirmationDialog from "../common/DeleteConfirmationDialog";

class Project extends Component {
    state = {
        teamExpanded: false,
        confirmationDialogIsOpen: false,
        projectId: null
    };

    handleExpandClick = () => {
        this.setState(state => ({ teamExpanded: !state.teamExpanded }));
    };

    handleClickEdit = () => {
        history.push(`/projects/${this.props.project.id}/edit`);
    };

    openConfirmationDialog = projectId => {
        this.setState({
            confirmationDialogIsOpen: true,
            projectId: projectId,
        });
    };

    deleteProject = () => {
        Api.delete(`/projects/${this.props.project.id}`).then(response => {
            response.meta.messages.forEach(message => this.props.enqueueSnackbar(message, {variant: 'success'}));
            history.push('/projects');
        }).catch(({errors}) => {
            errors.forEach(error => this.props.enqueueSnackbar(error.detail, {variant: 'error'}));
        });
    };

    isAdmin = admin => {
        return admin.id === LocalStorage.get('user').data.id
    };

    render() {
        const { classes, project, admin, collaborators } = this.props;
        const { teamExpanded } = this.state;

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
                                    <EditDeleteActions
                                        onClickEdit={this.handleClickEdit}
                                        onClickDelete={this.openConfirmationDialog}
                                    />
                                    <DeleteConfirmationDialog
                                        open={this.state.confirmationDialogIsOpen}
                                        title={"Vuoi eliminare il progetto?"}
                                        body={"Questa operazione è irrevesribile, una volta cancellato il progetto non sarai più in grado di ripristinarlo."}
                                        onClickDelete={this.deleteProject}
                                        onClose={() => {this.setState({confirmationDialogIsOpen: false})}}
                                    />
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
                                    <Typography variant="subtitle1" noWrap className={classes.contactInfo}>{`${admin.attributes.email}`}</Typography>
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
                                aria-expanded={teamExpanded}
                                aria-label="Team"
                                className={classes.button}
                            >
                                Team
                                <ExpandMoreIcon 
                                    className={classnames(classes.expand, {
                                        [classes.expandOpen]: teamExpanded,
                                    })}
                                />
                            </Button>
                        </CardActions>
                        <Collapse in={teamExpanded} timeout="auto" unmountOnExit>
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
};

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
    },
    contactInfo: {
        display: 'inline-flex',
        [theme.breakpoints.down('xs')]: {
            display: 'block',
            paddingLeft: '12px',
        }
    }
});

export default withSnackbar(withStyles(styles)(Project));