import React, { Component } from 'react';

import Moment from 'react-moment';
import 'moment/locale/it';

import history from '../../lib/history';

import LocalStorage from '../../lib/LocalStorage';

import { getCourseColor } from '../../lib/Utils';

import {
    withStyles,
    Card,
    CardHeader,
    CardActionArea,
    CardContent,
    CardActions,
    Typography,
    Grid,
    Chip,
} from '@material-ui/core';

import Anchor from "../common/Anchor";
import EditDeleteActions from "../common/EditDeleteActions";
import DeleteConfirmationDialog from "../common/DeleteConfirmationDialog";
import AsyncAvatar from '../common/AsyncAvatar';

import Api from "../../lib/Api";
import {withSnackbar} from "notistack";

class StudyGroupCard extends Component {

    state = {
        confirmationDialogIsOpen: false,
        studyGroupId: null
    };

    handleClickEdit = () => {
        history.push(`/study_groups/${this.props.studyGroup.id}/edit`);
    };

    openConfirmationDialog = studyGroupId => {
        this.setState({
            confirmationDialogIsOpen: true,
            studyGroupId: studyGroupId,
        });
    };

    deleteStudyGroup = () => {
        Api.delete(`/study_groups/${this.props.studyGroup.id}`).then(response => {
            this.props.removeStudyGroup(this.props.studyGroup.id, this.props.user.id);
            response.meta.messages.forEach(message => this.props.enqueueSnackbar(message, {variant: 'success'}));
        }).catch(({errors}) => {
            errors.forEach(error => this.props.enqueueSnackbar(error.detail, {variant: 'error'}));
        });
    };

    isAuthUserAdmin = () => {
        return LocalStorage.get('user').data.id === this.props.user.id;
    };

    render() {
        const { classes, studyGroup, user } = this.props;

        if(!user || !studyGroup) {
            return null;
        }

        return(
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
                        subheader={<Moment locale="it" parse="YYYY-MM-DD HH:mm" fromNow>{studyGroup.attributes.created_at}</Moment>}
                        action={
                            this.isAuthUserAdmin() ?
                                <div>
                                    <EditDeleteActions
                                        onClickEdit={this.handleClickEdit}
                                        onClickDelete={this.openConfirmationDialog}
                                    />
                                    <DeleteConfirmationDialog
                                        open={this.state.confirmationDialogIsOpen}
                                        title={"Vuoi eliminare il gruppo di studio?"}
                                        body={"Questa operazione è irreversibile, una volta eliminato il gruppo di studio non sarà più possibile recuperarlo."}
                                        onClickDelete={this.deleteStudyGroup}
                                        onClose={() => {this.setState({confirmationDialogIsOpen: false})}}
                                    />
                                </div>
                            :
                                null
                        }
                    />
                    <CardActionArea className={classes.cardContent} onClick={() => history.push(`/study_groups/${studyGroup.id}`)}>
                        <CardContent>
                            <Typography noWrap gutterBottom variant="h6" component="h1">{studyGroup.attributes.title}</Typography>
                            <Typography noWrap variant="body1" component="p">{studyGroup.attributes.description}</Typography>
                        </CardContent>
                    </CardActionArea>
                    <CardActions>
                        <Chip  classes={{
                                root: classes.chipRoot,
                                label: classes.chipLabel
                            }}
                            key={studyGroup.attributes.course}
                            label={
                                <Typography  variant='body1' noWrap>{studyGroup.attributes.course}</Typography>
                            }
                            style={{backgroundColor: getCourseColor(studyGroup.attributes.course)}}
                            />
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
    chipRoot: {
        maxWidth: '100%',
    },
    chipLabel:{
        overflow: 'hidden',
        paddingRight: 0,
        marginRight: '12px',
    }
});

export default withSnackbar(withStyles(styles)(StudyGroupCard));
