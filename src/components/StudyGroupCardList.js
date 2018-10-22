import React, { Component } from 'react';

import { Grid, Typography } from '@material-ui/core';

import StudyGroupCard from '../components/StudyGroupCard';

class StudyGroupCardList extends Component {

    getAdmin = (study_groups, users) => {
        return users.filter(user => study_groups.relationships.user.data.id === user.id)[0]
    }

    render() {

        const {study_groups, users} = this.props;
        
        if((!study_groups || study_groups.length === 0) && (!users || users.length === 0)) {
            return(
                <Typography variant="subheading">
                    Non ci sono gruppi di studio da visualizzare.
                </Typography>
            )
        }

        return(
            <Grid container spacing={16}>
                {
                   study_groups.map((study_group) => <StudyGroupCard key={study_group.id} study_group={study_group} admin={this.getAdmin(study_group, users)} />)
                }
            </Grid>
        )
    }
}


export default (StudyGroupCardList);
