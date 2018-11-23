import React, { Component } from 'react';

import Moment from 'react-moment';
import 'moment/locale/it';

import { getInitials, getCourseColor } from '../../lib/Utils';

import {
    withStyles,
    Chip,
    Divider,
    Grid,
    Card,
    CardHeader,
    CardContent,
    Typography,
    Avatar,
} from '@material-ui/core';

import ReactMarkdown from 'react-markdown';
import Anchor from "../common/Anchor";
import EditDeleteActions from "../common/EditDeleteActions";
import DeleteConfirmationDialog from "../common/DeleteConfirmationDialog";
import LocalStorage from "../../lib/LocalStorage";
import history from "../../lib/history";
import Api from "../../lib/Api";
import { withSnackbar } from 'notistack';

class StudyGroup extends Component {

    state = {
        confirmationDialogIsOpen: false,
        studyGroupId: null,
    };

    isAuthUserAdmin = () => {
        return LocalStorage.get('user').data.id === this.props.user.id;
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
        const { classes, studyGroup, user } = this.props;

        return(
            <Grid container justify="center">
                <Grid item xs={12} md={10} lg={8}>
                    <Card className={classes.paper}>
                        <CardHeader
                            title={<Typography variant="h3">{studyGroup.attributes.title}</Typography>}
                            subheader={
                                <div>
                                    <Moment className={classes.moment} parse="YYYY-MM-DD HH:mm" locale="it" format="ll" >{studyGroup.attributes.created_at}</Moment>
                                    <Chip className={classes.couse} style={{backgroundColor: getCourseColor(studyGroup.attributes.course)}} label={studyGroup.attributes.course} />
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
                            <ReactMarkdown className={classes.markdown} source={studyGroup.attributes.description}/>
                        </CardContent>
                        <Divider />
                        <CardHeader 
                            avatar={
                                <Anchor to={`/users/${user.id}`}>
                                    <Avatar
                                        alt={`${user.attributes.firstname} ${user.attributes.lastname}`}
                                        src={user.attributes.avatar ? user.attributes.avatar.url : null}
                                    >
                                        {!user.attributes.avatar ? getInitials(user.attributes.firstname, user.attributes.lastname) : null}
                                    </Avatar>
                                </Anchor>
                            }
                            title={
                                <Anchor to={`/users/${user.id}`}>
                                    {user.attributes.firstname} {user.attributes.lastname}
                                </Anchor>
                            }
                        />
                    </Card>
                </Grid>
            </Grid>
        );
    }
}

const styles = theme => ({
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
});

export default withSnackbar(withStyles(styles)(StudyGroup));