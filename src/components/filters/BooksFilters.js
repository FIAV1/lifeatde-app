import React, { Component } from 'react';

import Api from '../../lib/Api';

import {
    ExpansionPanel,
    ExpansionPanelSummary,
    Typography,
    ExpansionPanelDetails,
} from '@material-ui/core';
import { withSnackbar } from 'notistack';
import CourseFilter from './CourseFilter';

import FilterListIcon from '@material-ui/icons/FilterList';

class BooksFilters extends Component {
    state =  {
        courseFilter: null,
        byCourse: null,
    }

    filterByCourse = property => filter => {
        this.setState({[property]: filter});

        Api.get(`/courses/${filter}/books`).then(response => {
            console.log(response)
            this.props.onFilter(response.data, response.meta);
            this.setState({byCourse: response});
        }).catch(({errors}) => {
            errors.forEach(error => this.props.enqueueSnackbar(error.detail, {variant: 'error'}));
        })

        
    }

    render() {
        const { loading } = this.state;
        const { filters } = this.props;

        if (loading) return null;

        return (
            <ExpansionPanel>
                <ExpansionPanelSummary expandIcon={<FilterListIcon />}>
                    <Typography variant="caption">FILTRA</Typography>
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

export default withSnackbar(BooksFilters);