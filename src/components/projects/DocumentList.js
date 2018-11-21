import React, { Component } from 'react';

import Api from '../../lib/Api';

import {
    Grid,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
} from '@material-ui/core';

import PermMediaIcon from '@material-ui/icons/PermMedia';
import { withSnackbar } from 'notistack';

class DocumentList extends Component {
    downloadFile = (url, filename) => () => {
        Api.download(url)
            .then(fileUrl => {
                let link = window.document.createElement('a');
                link.href = fileUrl;
                link.download = filename;
                link.click();
                link.remove();
            }).catch(({errors}) => {
                errors.forEach(error => this.props.enqueueSnackbar(error.detail, {variant: 'error'}));
            });
    };

    render() {
        const { documents } = this.props;
        return(
            <Grid container spacing={16}>
                <Grid item xs={12}>
                    <List>
                        {
                            documents.map(document =>
                                <ListItem
                                    button
                                    key={document.id}
                                    onClick={this.downloadFile(document.url, document.name)}
                                >
                                    <ListItemAvatar>
                                        <Avatar>
                                            <PermMediaIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={document.name}
                                    />
                                </ListItem>
                            )
                        }
                    </List>
                </Grid>
            </Grid>
        );
    }
}

export default withSnackbar(DocumentList);