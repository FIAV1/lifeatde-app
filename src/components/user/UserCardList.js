import React, { Component } from 'react';

import { Grid, Typography } from '@material-ui/core';


import UserCard from './UserCard';

class UserCardList extends Component {

    getCourse = courseId =>
        this.props.included.find(item => item.type === 'course' && item.id === courseId);

    render() {

        const { users } = this.props;
      
        if(!users || users.length === 0) {
            return(
                <Typography variant="subtitle1">
                    Non ci sono utenti da visualizzare.
                </Typography>
            )
        }

        return(
            <Grid container spacing={16}>
                {
                   users.map((user) =>
                       <UserCard
                           key={user.id}
                           user={user}
                           course={this.getCourse(user.relationships.course.data.id)}
                       />)
                }
            </Grid>
        )
    }
}

export default (UserCardList);
