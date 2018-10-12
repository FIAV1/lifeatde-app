import React, { Component } from 'react';

import { Grid } from '@material-ui/core';

import StudyGroupCard from '../components/StudyGroupCard';

class StudyGroupCardList extends Component {

    render() {

        const {study_groups, users} = this.props;
        
        return(
            <Grid container>
                {
                   study_groups.map((study_group) =>
                        <StudyGroupCard study_group={study_group} user={users.find((owner) =>  
                            owner.id === study_group.relationships.user.data.id)}/>)
                }
            </Grid>
        )
    }
}


export default (StudyGroupCardList);
