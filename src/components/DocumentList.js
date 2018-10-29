import React, { Component } from 'react';

import Api from '../lib/Api';

import {
    Grid,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
} from '@material-ui/core';

import PermMediaIcon from '@material-ui/icons/PermMedia';

import Notifier, { showNotifier } from './Notifier';

class DocumentList extends Component {
    getFileName = url => {
        let a = url.split('/');
        return a[a.length-1];
    }

    downloadFile = url => () => {
        let fileName = this.getFileName(url);

        let errors = [{
            detail: 'C\'è stato un problema durante il download, riprova più tardi',
            status: 500
        }];

        Api.download(url)
            .then(file => {
                const data = window.URL.createObjectURL(file);
                let link = window.document.createElement('a');
                link.href = data;
                link.download = fileName;
                link.click();
                link.remove();
            }).catch(() => {
                showNotifier({messages: errors, variant: 'error'});
            });
    }

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
                                    onClick={this.downloadFile(document.url)}
                                >
                                    <ListItemAvatar>
                                    <Avatar>
                                        <PermMediaIcon />
                                    </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={this.getFileName(document.url)}
                                    />
                                </ListItem>
                            )
                        }
                    </List>
                    <Notifier />
                </Grid>
            </Grid>
        );
    }
}

export default DocumentList;