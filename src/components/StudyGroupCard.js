import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
    withStyles,
    Card,
    CardHeader,
    CardContent,
    Avatar,
    Typography,
    Grid
} from '@material-ui/core';

class StudyGroupCard extends Component {

    render() {
        const { classes, study_group, user } = this.props;
        return(
            <Grid item xs={12}>
                <Card className={classes.card}>
                    <CardHeader
                        avatar={
                            <Avatar alt={`${user.attributes.firstname} ${user.attributes.lastname}`} src={user.attributes.avatar.url} className={classes.avatar} />
                        }
                        title={`${user.attributes.firstname} ${user.attributes.lastname}`}
                        subheader={'12 Sept 12.45'}
                    />
                    <CardContent>
                        <Typography gutterBottom variant="title" component="h1">{study_group.attributes.title}</Typography>
                        <Typography component="p">{study_group.attributes.description}</Typography>
                    </CardContent>
                </Card>
            </Grid>
        );
    }
}

const styles = theme => ({
    card: {
        margin: '0 auto 20px'
    }
});
    
StudyGroupCard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(StudyGroupCard);
