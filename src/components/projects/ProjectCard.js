import React, { Component } from 'react';

import Moment from 'react-moment';
import 'moment/locale/it';

import LocalStorage from '../../lib/LocalStorage';

import history from '../../lib/history';

import { getInitials } from '../../lib/Utils';

import Api from '../../lib/Api';

import {
    withStyles,
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Avatar,
    Typography,
    Grid,
    Button,
    IconButton,
    Menu,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from '@material-ui/core';

import MoreVertIcon from '@material-ui/icons/MoreVert';
import WorkIcon from '@material-ui/icons/Work';
import CategoriesMenu from './CategoriesMenu';
import Anchor from "../common/Anchor";

import { withSnackbar } from 'notistack';

class ProjectCard extends Component {
    state = {
        dialogOpen: false,
        anchorEl: null,
        authUser: LocalStorage.get('user').data,
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
                this.props.removeProject(this.props.project.id, this.props.admin.id);
                Api.delete(`/projects/${this.props.project.id}`).then(response => {
                    response.meta.messages.forEach(message => this.props.enqueueSnackbar(message, {variant: 'success'}));
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

    render() {
        const { classes, project, admin } = this.props;
        const { anchorEl, dialogOpen } = this.state;
        const menuOpen = Boolean(anchorEl);

        if(!admin || !project) {
            return null;
        }

        return(
            <Grid item xs={12} md={6} xl={4}>
                <Card>
                    <CardHeader
                        avatar={
                            <Anchor to={`/users/${admin.id}`}>
                                <Avatar
                                    alt={`${admin.attributes.firstname} ${admin.attributes.lastname}`}
                                    src={admin.attributes.avatar ? admin.attributes.avatar.url : null}
                                >
                                    {!admin.attributes.avatar ? getInitials(admin.attributes.firstname, admin.attributes.lastname) : null}
                                </Avatar>
                            </Anchor>
                        }
                        title={
                            <Anchor to={`/users/${admin.id}`}>
                                {admin.attributes.firstname} {admin.attributes.lastname}
                            </Anchor>
                        }
                        subheader={<Moment parse="YYYY-MM-DD HH:mm" locale="it" fromNow>{project.attributes.created_at}</Moment>}
                        action={
                            this.state.authUser.id === admin.id ?
                                <IconButton
                                    aria-label="Opzioni"
                                    aria-owns={menuOpen ? `options-menu-${project.id}` : null}
                                    aria-haspopup="true"
                                    onClick={this.handleClick}
                                >
                                    <MoreVertIcon />
                                </IconButton>
                            :
                                null
                        }
                    />
                    <CardContent>
                        <Typography noWrap gutterBottom variant="h5">{project.attributes.title}</Typography>
                    </CardContent>
                    <CardActions>
                        <CategoriesMenu id={project.id} elements={project.attributes.categories} />
                        <Button
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            onClick={() => history.push(`/projects/${project.id}`)}
                        >
                            <WorkIcon className={classes.icon} />
                            vai al progetto
                        </Button>
                    </CardActions>
                    <Menu
                        id={`options-menu-${project.id}`}
                        anchorEl={anchorEl}
                        open={menuOpen}
                        onClose={this.handleClose('close')}
                    >
                        <MenuItem onClick={this.handleClose('edit')}>Modifica</MenuItem>
                        <MenuItem onClick={this.handleClose('dialog')}>Elimina</MenuItem>
                    </Menu>
                    <Dialog
                        open={dialogOpen}
                        onClose={this.handleClose('cancel')}
                        aria-labelledby={`alert-dialog-title-${project.id}`}
                        aria-describedby={`alert-dialog-description-${project.id}`}
                    >
                        <DialogTitle id={`alert-dialog-title-${project.id}`}>{"Vuoi eliminare il progetto?"}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id={`alert-dialog-description-${project.id}`}>
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
                </Card>
            </Grid>
        );
    }
}

const styles = theme => ({
    button:{
        marginLeft: 'auto',
    },
    icon: {
        marginRight: theme.spacing.unit,
    }
});
  
export default withSnackbar(withStyles(styles)(ProjectCard));