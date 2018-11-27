import React, { Component } from 'react';

import { intToBytes, bytesToSize } from '../../lib/Utils';

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
import DeleteConfirmationDialog from "../common/DeleteConfirmationDialog";
import { withSnackbar } from 'notistack';

import PermMediaIcon from '@material-ui/icons/PermMedia';
import DeleteIcon from '@material-ui/icons/Delete';

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

    handleDelete = () => {
        this.props.deleteFiles(this.state.fileId);

        this.setState({confirmationDialogIsOpen: false});
    };

    render() {
        const { files, old, removeFiles } = this.props;

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
                                    <IconButton onClick={old ? this.openConfirmationDialog(file.id) : () => removeFiles(null, index)} aria-label="Elimina">
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
                    onClickDelete={this.handleDelete}
                    onClose={() => {this.setState({confirmationDialogIsOpen: false})}}
                />

            </div>
        )
    }
}


export default withSnackbar(FileList);