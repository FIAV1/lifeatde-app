import React, { Component } from 'react';

import {
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Dialog,
    Slide,
} from '@material-ui/core';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class DeleteConfirmationDialog extends Component {

    render() {
        const {
            title,
            body,
            open,
            onClose,
            onClickDelete
        } = this.props;

        return(
            <Dialog
                TransitionComponent={Transition}
                open={open}
                onClose={onClose}
                aria-labelledby={`alert-dialog-title`}
                aria-describedby={`alert-dialog-description`}
            >
                <DialogTitle id={`alert-dialog-title`}>{title}</DialogTitle>
                <DialogContent>
                    <DialogContentText id={`alert-dialog-description`}>
                        {body}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClickDelete} color="primary">
                        Elimina
                    </Button>
                    <Button onClick={onClose} color="secondary" autoFocus>
                        Annulla
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default DeleteConfirmationDialog;