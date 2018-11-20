import React, { Component } from 'react';

import {
    Slide,
    Typography,
    Button,
    IconButton,
	List,
	ListItem,
	ListItemAvatar,
	Avatar,
	ListItemText,
	ListItemSecondaryAction,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from '@material-ui/core';

import { intToBytes, bytesToSize } from '../../lib/Utils';

import PermMediaIcon from '@material-ui/icons/PermMedia';
import DeleteIcon from '@material-ui/icons/Delete';
import Api from '../../lib/Api';
import { withSnackbar } from 'notistack';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class FileList extends Component {
    state = {
        open: false,
        fileId: null,
    };
    
    handleClickOpen = (fileId, index) => () => {
        this.setState({
            open: true,
            fileId: fileId,
        });
    };
    
    handleClose = value => () => {
        const { fileId } = this.state;

        let files = {
            documents: [fileId]
        }

        switch (value) {
            case 'delete':
                Api.delete(`/projects/${this.props.projectId}/documents`, files).then(response => {
                    this.props.removeFile(fileId, null);
                    response.meta.messages.forEach(message => this.props.enqueueSnackbar(message, {variant: 'success'}));
                }).catch(({errors}) => {
                    errors.forEach(error => this.props.enqueueSnackbar(error, {variant: 'error'}));
                });
                this.setState({
                    open: false,
                    fileId: null,
                });
                break;
            default:
                this.setState({
                    open: false,
                    fileId: null,
                });
                break;
        }
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
                                    <IconButton onClick={old ? this.handleClickOpen(file.id, index) : () => this.props.removeFile(null, index)} aria-label="Elimina">
                                        <DeleteIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        </List>
                    )
                }
                <Dialog
                    TransitionComponent={Transition}
                    open={this.state.open}
                    onClose={this.handleClose('dialog')}
                    aria-labelledby={`alert-dialog-title`}
                    aria-describedby={`alert-dialog-description`}
                >
                    <DialogTitle id={`alert-dialog-title`}>{"Eliminare il file?"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id={`alert-dialog-description`}>
                            Questa operazione è irreversibile, una volta eliminato il file non sarà più possibile recuperarlo.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose('delete')} color="primary">
                            Elimina
                        </Button>
                        <Button onClick={this.handleClose('cancel')} color="secondary" autoFocus>
                            Annulla
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}


export default withSnackbar(FileList);