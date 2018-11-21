import React, { Component } from 'react';

import Moment from 'react-moment';
import 'moment/locale/it';

import { getInitials, getCourseColor } from '../../lib/Utils';

import {
    withStyles,
    Chip,
    Divider,
    Grid,
    Card,
    CardHeader,
    CardContent,
    Typography,
    Avatar,
} from '@material-ui/core';

import ReactMarkdown from 'react-markdown';
import Anchor from "../common/Anchor";

class StudyGroup extends Component {

    getAdmin = (studyGroups, users) => {
        return users.filter(user => studyGroups.relationships.user.data.id === user.id)[0]
    }
    
    render() {
        const { classes, studyGroup, admins } = this.props;
        const admin  = this.getAdmin(studyGroup, admins);
        return(
            <Grid container justify="center">
                <Grid item xs={12} md={10} lg={8}>
                    <Card className={classes.paper}>
                        <CardHeader
                            title={<Typography variant="h3">{studyGroup.attributes.title}</Typography>}
                            subheader={
                                <div>
                                    <Moment className={classes.moment} parse="YYYY-MM-DD HH:mm" locale="it" format="ll" >{studyGroup.attributes.created_at}</Moment>
                                    <Chip className={classes.couse} style={{backgroundColor: getCourseColor(studyGroup.attributes.course)}} label={studyGroup.attributes.course} />
                                </div>
                            }
                        />
                        <Divider />
                        <CardContent>
                            <ReactMarkdown className={classes.markdown} source={studyGroup.attributes.description}/>
                        </CardContent>
                        <Divider />
                        <CardHeader 
                            avatar={
                                <Anchor to={`/users/${admin.id}`}>
                                    <Avatar
                                        alt={`${admin.attributes.firstname} ${admin.attributes.lastname}`}
                                        src={admin.attributes.avatar ? admin.attributes.avatar.url : null}
                                    >
                                        {!admin.attributes.avatar ? getInitials(admin.attributes.firstname, admin.attributes.lastname) : null}
                                    </Avatar>
                                </Anchor>
                            }
                            title={
                                <Anchor to={`/users/${admin.id}`}>
                                    {admin.attributes.firstname} {admin.attributes.lastname}
                                </Anchor>
                            }
                            subheader="Admin"
                        />
                    </Card>
                </Grid>
            </Grid>
        );
    }
}

const styles = theme => ({
    moment: {
        display: 'block',
        color: theme.palette.text.hint,
        margin: theme.spacing.unit,
    },
    status: {
        margin: theme.spacing.unit,
        color: theme.palette.common.white,
    },
    markdown: {
        color: theme.palette.text.primary,
    },
})

export default withStyles(styles)(StudyGroup);