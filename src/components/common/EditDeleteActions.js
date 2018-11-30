import React, { Component } from 'react';
import 'moment/locale/it';
import {
    IconButton,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
} from '@material-ui/core';

import MoreVertIcon from '@material-ui/icons/MoreVert';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

class EditDeleteActions extends Component {
    state = {
        anchorEl: null,
    };

    handleClick = event => {
        this.setState({ anchorEl: this.state.anchorEl ? null : event.currentTarget});
    };

    render() {
        const { onClickEdit, onClickDelete } = this.props;
        const { anchorEl } = this.state;

        return(
            <div>
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
                    onClose={this.handleClick}
                    onScrollCapture={this.handleClick}
                >
                    <MenuItem onClick={onClickEdit} value="modifica">
                        <ListItemIcon>
                            <EditIcon />
                        </ListItemIcon>
                        <ListItemText inset primary="Modifica" />
                    </MenuItem>
                    <MenuItem onClick={onClickDelete} value="elimina">
                        <ListItemIcon >
                            <DeleteIcon />
                        </ListItemIcon>
                        <ListItemText inset primary="Elimina" />
                    </MenuItem>
                </Menu>
            </div>
        );
    }
}

export default EditDeleteActions;