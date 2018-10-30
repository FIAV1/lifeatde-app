import React, { Component } from 'react';

import LocalStorage from '../lib/LocalStorage';
import { getStatusColor } from '../lib/Utils';

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

class Project extends Component {
    state = {
        expanded: false,
        anchorEl: null,
    };

    handleExpandClick = () => {
        this.setState(state => ({ expanded: !state.expanded }));
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
                break;
            case 'elimina':
                console.log('elimina');
                break;
            default:
            console.log('ciao')
                break;
        }
    };

    isAdmin = team => {
        return team.find(member => member.attributes.admin).id === LocalStorage.get('user').data.id
    };

    getAdmin = team => {
        return team.find(member => member.attributes.admin);
    }

    render() {
        const { classes, project, team } = this.props;
        const { expanded, anchorEl } = this.state;
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
                                    <Chip className={classes.status} style={{backgroundColor: getStatusColor(project.attributes.status)}} label={project.attributes.status} />
                                </div>
                            }
                            action={
                                !this.isAdmin(team)
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
                            <Typography variant="overline">Descrizione del progetto</Typography>
                            <ReactMarkdown className={classes.markdown} source={project.attributes.description}/>
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
                                ? <ReactMarkdown className={classes.markdown} source={project.attributes.results}/>
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
                                        this.getAdmin(team).attributes.phone
                                        ? <IconButton href={`tel:${this.getAdmin(team).attributes.phone}`} aria-label="telefono">
                                            <PhoneIcon />
                                        </IconButton>
                                        : null
                                    }
                                    <IconButton href={`mailto:${this.getAdmin(team).attributes.email}`} aria-label="email">
                                        <EmailIcon />
                                    </IconButton>
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
                                Membri
                                <ExpandMoreIcon 
                                    className={classnames(classes.expand, {
                                        [classes.expandOpen]: expanded,
                                    })}
                                />
                            </Button>
                        </CardActions>
                        <Collapse in={expanded} timeout="auto" unmountOnExit>
                            <CardContent>
                                <ProjectTeam team={team} />
                            </CardContent>
                        </Collapse>
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
})

export default withStyles(styles)(Project);