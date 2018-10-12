import React, { Component } from 'react';
import classNames from 'classnames';

import { withStyles } from '@material-ui/core'

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';

class StudyGroupCard extends Component {

    render() {
        const { classes, study_group, user } = this.props;
        return(
            <div>
                {console.log(study_group)}
                <h1>{study_group.attributes.title + ' ' + user.attributes.firstname}</h1>
                <Card className={classes.card}>
                    <CardHeader
                    avatar={
                        
                        <Avatar aria-label="Recipe" src={user.attributes.avatar.url} className={classes.avatar}/>
                    }
                    title={study_group.attributes.title}
                    />
                </Card>
            </div>
        )
    }
}

const styles = {
    card: {
        width: '70%',
        height: '20%',
    }
}

export default withStyles(styles)(StudyGroupCard);
