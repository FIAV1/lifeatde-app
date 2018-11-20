import React, { Component } from 'react';

import { getInitials } from '../../lib/Utils';

import {
    List,
    ListItem,
    ListItemText,
    Divider,
    Typography,
    Avatar,
} from '@material-ui/core';


import Anchor from "../common/Anchor";

class ProjectTeam extends Component {
    render() {
        const { admin, collaborators } = this.props;
        return(
            <List>
                <ListItem>
                    <Anchor to={`/users/${admin.id}`}>
                        <Avatar
                            alt={`${admin.attributes.firstname} ${admin.attributes.lastname}`}
                            src={admin.attributes.avatar ? admin.attributes.avatar.url : null}
                        >
                            {!admin.attributes.avatar ? getInitials(admin.attributes.firstname, admin.attributes.lastname) : null}
                        </Avatar>
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
                                <Avatar
                                    alt={`${collaborator.attributes.firstname} ${collaborator.attributes.lastname}`}
                                    src={collaborator.attributes.avatar ? collaborator.attributes.avatar.url : null}
                                >
                                    {!collaborator.attributes.avatar ? getInitials(collaborator.attributes.firstname, collaborator.attributes.lastname) : null}
                                </Avatar>
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