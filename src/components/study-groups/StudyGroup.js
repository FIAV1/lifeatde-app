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
    IconButton
} from '@material-ui/core';

import PhoneIcon from '@material-ui/icons/Phone';
import EmailIcon from '@material-ui/icons/Email';

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
                    <Card>
                        <CardHeader
                            title={<Typography variant="h3">{studyGroup.attributes.title}</Typography>}
                            subheader={
                                <div>
                                    <Moment className={classes.moment} parse="YYYY-MM-DD HH:mm" locale="it" format="ll" >{studyGroup.attributes.created_at}</Moment>
                                    <Chip style={{backgroundColor: getCourseColor(studyGroup.attributes.course)}} label={studyGroup.attributes.course} />
                                </div>
                            }
                        />
                        <Divider />
                        <CardContent>
                            <Typography variant="overline">Descrizione</Typography>
                            <ReactMarkdown className={classes.markdown} source={studyGroup.attributes.description}/>
                        </CardContent>
                        <Divider/>
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
                        <Divider/>
                       <Grid container className={classes.contactInfo}>
                            <Grid item xs={12}>
                                <Typography variant="overline">Contatta l'amministratore</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                {
                                    admin.attributes.phone
                                    ? <IconButton href={`tel:${admin.attributes.phone}`} aria-label="telefono">
                                        <PhoneIcon />
                                    </IconButton>
                                    : null
                                }
                                <IconButton href={`mailto:${admin.attributes.email}`} aria-label="email">
                                    <EmailIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
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
    markdown: {
        color: theme.palette.text.primary,
    },
    contactInfo:{
        padding: '16px 24px 16px 24px' 
    },
})

export default withStyles(styles)(StudyGroup);