import React, { Component } from 'react';
import classNames from 'classnames';

import StudyGroupCard from '../components/StudyGroupCard';

class StudyGroupList extends Component {

   

    render() {

        const {classes, study_groups, users} = this.props;


        const StudyGroups = study_groups.map((study_group, index) =>
            <StudyGroupCard study_group={study_group} user={users.find((owner) =>  
                owner.id === study_group.relationships.user.data.id)}/>
        );
        
        return(
            <div>
                <ul>{StudyGroups}</ul>
            </div>
        )
    }
}


export default (StudyGroupList);
