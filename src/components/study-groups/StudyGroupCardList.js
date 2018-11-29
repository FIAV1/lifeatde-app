import React, { Component } from 'react';

import { Grid, Typography } from '@material-ui/core';

import StudyGroupCard from './StudyGroupCard';

class StudyGroupCardList extends Component {

    getAdmin = adminId =>
        this.props.included.find(item => item.type === 'user' && item.id === adminId);

    getCourse = courseId =>
        this.props.included.find(item => item.type === 'course' && item.id === courseId);

    render() {

        const { studyGroups } = this.props;
        
        if(!studyGroups || studyGroups.length === 0) {
            return(
                <Typography variant="subtitle1">
                    Non ci sono gruppi di studio da visualizzare.
                </Typography>
            )
        }

        return(
            <Grid container spacing={16}>
                {
                   studyGroups.map((studyGroup) =>
                       <StudyGroupCard
                           key={studyGroup.id}
                           studyGroup={studyGroup}
                           admin={this.getAdmin(studyGroup.relationships.user.data.id)}
                           course={this.getCourse(studyGroup.relationships.course.data.id)}
                           removeStudyGroup={this.props.removeStudyGroup}
                       />)
                }
            </Grid>
        )
    }
}

export default (StudyGroupCardList);
