import React, { Component } from 'react';

import { Grid, Typography } from '@material-ui/core';

import StudyGroupCard from './StudyGroupCard';

class StudyGroupCardList extends Component {

    getAdmin = (studyGroups, users) => {
        return users.filter(user => studyGroups.relationships.user.data.id === user.id)[0]
    }

    render() {

        const { studyGroups, users } = this.props;
        
        if((!studyGroups || studyGroups.length === 0) && (!users || users.length === 0)) {
            return(
                <Typography variant="subtitle1">
                    Non ci sono gruppi di studio da visualizzare.
                </Typography>
            )
        }

        return(
            <Grid container spacing={16}>
                {
                   studyGroups.map((studyGroup) => <StudyGroupCard key={studyGroup.id} studyGroup={studyGroup} admin={this.getAdmin(studyGroup, users)} />)
                }
            </Grid>
        )
    }
}

export default (StudyGroupCardList);
