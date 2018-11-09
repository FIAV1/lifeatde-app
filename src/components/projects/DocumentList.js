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

import Notifier, { showNotifier } from '../common/Notifier';

class DocumentList extends Component {
    downloadFile = (url, filename) => () => {
        Api.download(url)
            .then(file => {
                const data = window.URL.createObjectURL(file);
                let link = window.document.createElement('a');
                link.href = data;
                link.download = filename;
                link.click();
                link.remove();
            }).catch(({errors}) => {
                showNotifier({messages: errors, variant: 'error'});
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
                                    onClick={this.downloadFile(document.url, document.filename)}
                                >
                                    <ListItemAvatar>
                                    <Avatar>
                                        <PermMediaIcon />
                                    </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={document.filename}
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