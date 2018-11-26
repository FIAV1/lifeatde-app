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
    IconButton,
    Typography,
    CardContent,
    CardActions,
    Chip
} from '@material-ui/core';

import PhoneIcon from '@material-ui/icons/Phone';
import EmailIcon from '@material-ui/icons/Email';

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
                    <CardContent className={classes.cardContent}>
                        <Grid container>
                            {
                                user.attributes.phone
                                    ?
                                    <Grid item xs={12}>
                                        <IconButton href={`tel:${user.attributes.phone}`} aria-label="telefono">
                                            <PhoneIcon />
                                        </IconButton>
                                        <Typography variant="subtitle1" noWrap className={classes.contactInfo}>{`${user.attributes.phone}`}</Typography>
                                    </Grid>
                                    : null
                            }
                            <Grid item xs={12}>
                                <IconButton href={`mailto:${user.attributes.email}`} aria-label="email">
                                    <EmailIcon />
                                </IconButton>
                                <Typography variant="subtitle1" noWrap className={classes.contactInfo}>{`${user.attributes.email}`}</Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                    <CardActions>
                        <Chip  classes={{
                                root: classes.chipRoot,
                                label: classes.chipLabel
                            }}
                            key={course.id}
                            label={
                                <Typography  variant='body1' noWrap>{course.attributes.name}</Typography>
                            }
                            style={{backgroundColor: getCourseColor(course.attributes.name)}}
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
    }
});

export default withSnackbar(withStyles(styles)(UserCard));