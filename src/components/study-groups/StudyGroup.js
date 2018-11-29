import React, { Component } from 'react';

import Moment from 'react-moment';
import 'moment/locale/it';

import { getCourseColor } from '../../lib/Utils';

import {
    withStyles,
    Chip,
    Divider,
    Grid,
    Card,
    CardHeader,
    CardContent,
    Typography,
} from '@material-ui/core';

import Anchor from "../common/Anchor";
import EditDeleteActions from "../common/EditDeleteActions";
import DeleteConfirmationDialog from "../common/DeleteConfirmationDialog";
import AsyncAvatar from '../common/AsyncAvatar';
import ContactInfo from "../common/ContactInfo";

import LocalStorage from "../../lib/LocalStorage";
import history from "../../lib/history";
import Api from "../../lib/Api";
import { withSnackbar } from 'notistack';

class StudyGroup extends Component {
    state = {
        confirmationDialogIsOpen: false,
        studyGroupId: null,
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
        Api.delete(`/study_groups/${this.props.studyGroup.id}`, null).then(response => {
            response.meta.messages.forEach(message => this.props.enqueueSnackbar(message, {variant: 'success'}));
            history.push('/study_groups');
        }).catch(({errors}) => {
            errors.forEach(error => this.props.enqueueSnackbar(error.detail, {variant: 'error'}));
        });
    };

    render() {
        const { classes, studyGroup, admin, course } = this.props;

        if (!studyGroup) return null;

        const isAdmin = LocalStorage.get('user').data.id === admin.id;

        return(
            <Grid container justify="center">
                <Grid item xs={12} md={10} lg={8}>
                    <Card>
                        <CardHeader
                            classes={{
                                content: classes.headerContent,
                                action: classes.headerAction,
                            }}
                            title={<Typography component="h1" variant="h4">{studyGroup.attributes.title}</Typography>}
                            subheader={
                                <div>
                                    <Moment className={classes.moment} parse="YYYY-MM-DD HH:mm" locale="it" format="ll" >{studyGroup.attributes.created_at}</Moment>
                                    <Chip style={{backgroundColor: getCourseColor(course.attributes.name)}} label={course.attributes.name} />
                                </div>
                            }
                            action={
                                isAdmin
                                    ? <div>
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
                                    : null
                            }
                        />
                        <Divider />
                        <CardContent>
                            <Typography variant="overline">Descrizione</Typography>
                            <Typography variant="body1">{studyGroup.attributes.description}</Typography>
                        </CardContent>
                        <Divider/>
                        <CardHeader 
                            avatar={
                                <Anchor to={`/users/${admin.id}`}>
                                    <AsyncAvatar user={admin} />
                                </Anchor>
                            }
                            title={
                                <Anchor to={`/users/${admin.id}`}>
                                    {admin.attributes.firstname} {admin.attributes.lastname}
                                </Anchor>
                            }
                        />
                        <Divider/>
                        <CardContent>
                            <ContactInfo phone={admin.attributes.phone} email={admin.attributes.email} admin={false}/>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        );
    }
}

const styles = theme => ({
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
})

export default withSnackbar(withStyles(styles)(StudyGroup));