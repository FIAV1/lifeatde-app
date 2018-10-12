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

class ProjectCard extends Component {
    render() {
        const { classes, project, admin } = this.props;
        return(
            <Grid item xs={12}>
                <Card className={classes.card}>
                    <CardHeader
                        avatar={
                            <Avatar alt={`${admin.attributes.firstname} ${admin.attributes.lastname}`} src={admin.attributes.avatar.url} className={classes.avatar} />
                        }
                        title={`${admin.attributes.firstname} ${admin.attributes.lastname}`}
                        subheader={'12 Sept 12.45'}
                    />
                    <CardContent>
                        <Typography gutterBottom variant="title" component="h1">{project.attributes.title}</Typography>
                        <Typography component="p">{project.attributes.description}</Typography>
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
    
ProjectCard.propTypes = {
    classes: PropTypes.object.isRequired,
};
  
export default withStyles(styles)(ProjectCard);