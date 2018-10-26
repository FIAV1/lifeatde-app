import React, { Component } from 'react';

import { getStatusColor } from '../lib/Utils';

import Moment from 'react-moment';
import 'moment/locale/it';

import classnames from 'classnames';

import {
    withStyles,
    Chip,
    Divider,
    Grid,
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Button,
    Collapse,
    Typography,
} from '@material-ui/core';

import ReactMarkdown from 'react-markdown';
import ProjectTeam from './ProjectTeam';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

class Project extends Component {
    state = {
        expanded: false
    };

    handleExpandClick = () => {
        this.setState(state => ({ expanded: !state.expanded }));
    };

    render() {
        const { classes, project, team } = this.props;
        const { expanded } = this.state;
        return(
            <Grid container justify="center">
                <Grid item xs={12} md={10} lg={8}>
                    <Card className={classes.paper}>
                        <CardHeader
                            title={<Typography variant="h3">{project.attributes.title}</Typography>}
                            subheader={
                                <div>
                                    <Moment className={classes.moment} parse="YYYY-MM-DD HH:mm" locale="it" format="ll" >{project.attributes.created_at}</Moment>
                                    <Chip className={classes.status} style={{backgroundColor: getStatusColor(project.attributes.status)}} label={project.attributes.status} />
                                </div>
                            }
                        />
                        <Divider />
                        <CardContent>
                            <ReactMarkdown className={classes.markdown} source={project.attributes.description}/>
                        </CardContent>
                        <Divider />
                        <CardActions className={classes.actions} disableActionSpacing>
                            <Button
                                variant="text"
                                size="small"
                                onClick={this.handleExpandClick}
                                aria-expanded={expanded}
                                aria-label="Team"
                                className={classes.button}
                            >
                                Team
                                <ExpandMoreIcon 
                                    className={classnames(classes.expand, {
                                        [classes.expandOpen]: expanded,
                                    })}
                                />
                            </Button>
                        </CardActions>
                        <Collapse in={expanded} timeout="auto" unmountOnExit>
                            <CardContent>
                                <ProjectTeam team={team} />
                            </CardContent>
                        </Collapse>
                    </Card>
                </Grid>
            </Grid>
        );
    }
}

const styles = theme => ({
    actions: {
        display: 'flex',
    },
    button: {
        marginLeft: 'auto',
        textTransform: 'capitalize'
    },
    expand: {
        transform: 'rotate(0deg)',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
        marginLeft: 'auto',
        [theme.breakpoints.up('sm')]: {
            marginRight: -8,
        },
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
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

export default withStyles(styles)(Project);