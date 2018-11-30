import React, { Component } from 'react';

import Api from '../../lib/Api';

import {
    withStyles,
    ExpansionPanel,
    ExpansionPanelSummary,
    Typography,
    ExpansionPanelDetails,
} from '@material-ui/core';
import { withSnackbar } from 'notistack';
import CourseFilter from './CourseFilter';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FilterListIcon from '@material-ui/icons/FilterList';

class BooksFilters extends Component {
    state =  {
        courseFilter: null,
    }

    filterByCourse = property => filter => {
        this.setState({[property]: filter.value});

        Api.get(`/courses/${filter.value}/books`).then(response => {
            this.props.onFilter(response.data, response.included, response.meta, filter.label);
        }).catch(({errors}) => {
            errors.forEach(error => this.props.enqueueSnackbar(error.detail, {variant: 'error'}));
        });
    }

    render() {
        const { loading } = this.state;
        const { classes, filters } = this.props;

        if (loading) return null;

        return (
            <ExpansionPanel>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography className={classes.typography} variant="caption">
                        <FilterListIcon className={classes.icon} />
                        FILTRA
                    </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    { filters.find(filter => filter === 'courses')
                    ? <CourseFilter
                        filterFn={this.filterByCourse('courseFilter')}
                    /> : null }
                </ExpansionPanelDetails>
            </ExpansionPanel>
        )
    }
}

const styles = theme => ({
    typography: {
        display:'flex',
        alignItems: 'center',
    },
    icon: {
        marginRight: theme.spacing.unit,
    }
})

export default withSnackbar(withStyles(styles)(BooksFilters));