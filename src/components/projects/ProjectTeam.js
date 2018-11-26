import React, { Component } from 'react';

import {
    List,
    ListItem,
    ListItemText,
    Divider,
    Typography,
} from '@material-ui/core';


import Anchor from "../common/Anchor";
import AsyncAvatar from '../common/AsyncAvatar';

class ProjectTeam extends Component {
    render() {
        const { admin, collaborators } = this.props;
        return(
            <List>
                <ListItem>
                    <Anchor to={`/users/${admin.id}`}>
                        <AsyncAvatar user={admin} />
                    </Anchor>
                    <ListItemText
                        primary={
                            <div>
                                <Anchor to={`/users/${admin.id}`}>
                                    <Typography variant="body1" noWrap>
                                        {admin.attributes.firstname} {admin.attributes.lastname}
                                    </Typography>
                                </Anchor>
                            </div>
                        }
                        secondary={'Admin'}
                    />
                </ListItem>
                { 
                    collaborators.length > 0 ?
                        <Divider inset component="li" />
                    :
                        null
                }
            {collaborators.map( (collaborator, index) => {
                return (
                    <div key={collaborator.id}>
                        <ListItem>
                            <Anchor to={`/users/${collaborator.id}`}>
                            <AsyncAvatar user={collaborator} />
                            </Anchor>
                            <ListItemText
                                primary={
                                    <div>
                                        <Anchor to={`/users/${collaborator.id}`}>
                                            <Typography variant="body1" noWrap>
                                                {collaborator.attributes.firstname} {collaborator.attributes.lastname}
                                            </Typography>
                                        </Anchor>
                                    </div>
                                }
                            />
                        </ListItem>
                        { 
                            index !== collaborators.length - 1 ?
                                <Divider inset component="li" />
                            :
                                null
                        }
                    </div>
                );
            })}
            </List>
        );
    }
}

export default ProjectTeam;