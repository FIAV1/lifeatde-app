import React, { Component } from 'react';

import { Grid, Typography } from '@material-ui/core';


import UserCard from './UserCard';

class UserCardList extends Component {

    getCourse = (user, courses) => {
        return courses.find( course => course.id === user.relationships.course.data.id);
    };

    render() {

        const { users, courses } = this.props;

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
                           course={this.getCourse(user, courses)}
                       />)
                }
            </Grid>
        )
    }
}

export default (UserCardList);
