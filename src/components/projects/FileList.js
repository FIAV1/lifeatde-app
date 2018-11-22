import React, { Component } from 'react';

import {
    Typography,
    IconButton,
	List,
	ListItem,
	ListItemAvatar,
	Avatar,
	ListItemText,
	ListItemSecondaryAction,
} from '@material-ui/core';

import { intToBytes, bytesToSize } from '../../lib/Utils';

import PermMediaIcon from '@material-ui/icons/PermMedia';
import DeleteIcon from '@material-ui/icons/Delete';
import Api from '../../lib/Api';
import { withSnackbar } from 'notistack';
import DeleteConfirmationDialog from "../common/DeleteConfirmationDialog";

class FileList extends Component {
    state = {
        confirmationDialogIsOpen: false,
        fileId: null,
    };

    openConfirmationDialog = fileId => () => {
        this.setState({
            confirmationDialogIsOpen: true,
            fileId: fileId,
        });
    };

    deleteFile = fileId => {
        let files = {
            documents: [fileId]
        };

        Api.delete(`/projects/${this.props.projectId}/documents`, files).then(response => {
            this.props.removeFile(fileId, null);
            response.meta.messages.forEach(message => this.props.enqueueSnackbar(message, {variant: 'success'}));
        }).catch(({errors}) => {
            errors.forEach(error => this.props.enqueueSnackbar(error.detail, {variant: 'error'}));
        });
        this.setState({
            confirmationDialogIsOpen: false,
            fileId: null,
        });
    };

    render() {
        const { files, old } = this.props;

        if (!files) return null;

        return (
            <div>
                {
                    files.map((file, index) =>
                        <List key={index}>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar>
                                        <PermMediaIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={<Typography variant="body1" noWrap>{file.name}</Typography>}
                                    secondary={<Typography variant="body1" noWrap>{file.size ? intToBytes(file.size) : bytesToSize(file.byte_size)}</Typography>}
                                />
                                <ListItemSecondaryAction>
                                    <IconButton onClick={old ? this.openConfirmationDialog(file.id) : () => this.props.removeFile(null, index)} aria-label="Elimina">
                                        <DeleteIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        </List>
                    )
                }
                <DeleteConfirmationDialog
                    open={this.state.confirmationDialogIsOpen}
                    title={"Eliminare il file?"}
                    body={"Questa operazione è irreversibile, una volta eliminato il file non sarà più possibile recuperarlo."}
                    target={this.state.fileId}
                    onClickDelete={this.deleteFile}
                    onClose={() => {this.setState({confirmationDialogIsOpen: false})}}
                />

            </div>
        )
    }
}


export default withSnackbar(FileList);