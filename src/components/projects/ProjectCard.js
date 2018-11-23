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
    CardActionArea,
    Avatar,
    Typography,
    Grid,
} from '@material-ui/core';

import CategoriesMenu from './CategoriesMenu';
import Anchor from "../common/Anchor";

import { withSnackbar } from 'notistack';
import EditDeleteActions from "../common/EditDeleteActions";
import DeleteConfirmationDialog from "../common/DeleteConfirmationDialog";

class ProjectCard extends Component {
    state = {
        authUser: LocalStorage.get('user').data,
        confirmationDialogIsOpen: false,
        projectId: null,
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
            this.props.removeProject(this.props.project.id, this.props.admin.id);
            response.meta.messages.forEach(message => this.props.enqueueSnackbar(message, {variant: 'success'}));
        }).catch(({errors}) => {
            errors.forEach(error => this.props.enqueueSnackbar(error.detail, {variant: 'error'}));
        });
    };

    render() {
        const { classes, project, admin } = this.props;

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
                                <div>
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
                            :
                                null
                        }
                    />
                    <CardActionArea className={classes.cardActionArea} onClick={() => history.push(`/projects/${project.id}`)}>
                        <CardContent>
                            <Typography noWrap gutterBottom variant="h5">{project.attributes.title}</Typography>
                        </CardContent>
                    </CardActionArea>
                    <CardActions>
                        <CategoriesMenu id={project.id} elements={project.attributes.categories} />
                    </CardActions>
                </Card>
            </Grid>
        );
    }
}

const styles = theme => ({
    cardActionArea: {
        width: '100%'
    },
    button:{
        marginLeft: 'auto',
    },
    icon: {
        marginRight: theme.spacing.unit,
    }
});
  
export default withSnackbar(withStyles(styles)(ProjectCard));