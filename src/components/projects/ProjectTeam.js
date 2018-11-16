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
        const { team } = this.props;
        return(
            <List>
            {team.map( (member, index) => {
                return (
                    <div key={member.id}>
                        <ListItem>
                            <Anchor to={`/users/${member.id}`}>
                                <Avatar
                                    alt={`${member.attributes.firstname} ${member.attributes.lastname}`}
                                    src={member.attributes.avatar.id ? member.attributes.avatar.url : null}
                                >
                                    {member.attributes.avatar.id === null ? getInitials(member.attributes.firstname, member.attributes.lastname) : null}
                                </Avatar>
                            </Anchor>
                            <ListItemText
                                primary={
                                    <div>
                                        <Typography variant="body1" noWrap>
                                            <Anchor to={`/users/${member.id}`}>
                                                {member.attributes.firstname} {member.attributes.lastname}
                                            </Anchor>
                                        </Typography>
                                    </div>
                                }
                                secondary={member.attributes.admin ? 'Admin' : null}
                            />
                        </ListItem>
                        { 
                            index !== team.length - 1 ?
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