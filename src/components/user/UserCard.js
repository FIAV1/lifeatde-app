import React, { Component } from 'react';

import history from '../../lib/history';

import { withSnackbar } from 'notistack';

import AsyncAvatar from '../common/AsyncAvatar';

import { getCourseColor } from '../../lib/Utils';

import {
    withStyles,
    Card,
    CardHeader,
    CardActionArea,
    Grid,
    Typography,
    CardContent,
    CardActions,
    Chip
} from '@material-ui/core';

import ContactInfo from "../common/ContactInfo";

class UserCard extends Component {

    render() {
        const { classes, user, course } = this.props;

        if(!user) {
            return null;
        }

        return(
            <Grid item xs={12} sm={6} md={6} lg={4}>
                <Card className={classes.card}>
                    <CardActionArea className={classes.cardActionArea} onClick={() => history.push(`/users/${user.id}`)}>
                        <CardHeader
                            classes={{
                                title: classes.cardHeaderTitle
                            }}
                            avatar={ <AsyncAvatar user={user} /> }
                            title={ <Typography  variant='body1' noWrap>{user.attributes.firstname + " " + user.attributes.lastname}</Typography> }
                        />
                    </CardActionArea>
                    <CardContent >
                        <ContactInfo phone={user.attributes.phone} email={user.attributes.email} admin={false}/>
                    </CardContent>
                    <CardActions>
                        <Chip
                            classes={{
                                root: classes.chipRoot,
                                label: classes.chipLabel
                            }}
                            key={course.id}
                            label={
                                <Typography  variant='body1' noWrap>{course.attributes.name}</Typography>
                            }
                            style={{backgroundColor: getCourseColor(course.id)}}
                        />
                    </CardActions>
                </Card>
            </Grid>
        );
    }
}

const styles = theme => ({
    cardActionArea: {
        width: '100%',
    },
    contactInfo: {
        display: 'inline-flex',
        [theme.breakpoints.down('xs')]: {
            display: 'block',
            paddingLeft: '12px',
        }
    },
    cardHeaderTitle:{
        overflow: 'hidden',
        paddingRight: 0,
        marginRight: '12px'
    },
    chipRoot: {
        maxWidth: '100%',
    },
    chipLabel:{
        overflow: 'hidden',
        paddingRight: 0,
        marginRight: '12px',
        color: theme.palette.common.white,
    }
});

export default withSnackbar(withStyles(styles)(UserCard));