import React, { Component } from 'react';

import Api from '../../lib/Api';
import { encodeSearchString } from '../../lib/Utils';

import {
    withStyles,
    ExpansionPanel,
    ExpansionPanelSummary,
    Typography,
    ExpansionPanelDetails,
} from '@material-ui/core';
import { withSnackbar } from 'notistack';
import CategoryFilter from './CategoryFilter';

import FilterListIcon from '@material-ui/icons/FilterList';

class Filter extends Component {
    state =  {
        categoryFilters: null,
        byCategories: null,
    }

    filterByCategory = property => filters => {
        this.setState({[property]: filters});

        let params = {
            categories: filters,
        }
        let searchString = encodeSearchString('project', params);

        Api.get(`/projects${searchString ? '/by_categories?' + searchString : ''}`).then(response => {
            this.props.onFilter(response.data);
            this.setState({byCategories: response});
        }).catch(({errors}) => {
            errors.forEach(error => this.props.enqueueSnackbar(error.detail, {variant: 'error'}));
        })

        
    }

    render() {
        const { loading } = this.state;
        const { classes, filters } = this.props;

        if (loading) return null;

        return (
            <ExpansionPanel>
                <ExpansionPanelSummary expandIcon={<FilterListIcon />}>
                    <Typography variant="caption"  className={classes.heading}>FILTRA</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    { filters.find(filter => filter === 'categories')
                    ? <CategoryFilter
                        filterFn={this.filterByCategory('categoryFilters')}
                    /> : null }
                </ExpansionPanelDetails>
            </ExpansionPanel>
        )
    }
}
 
const styles = theme => ({

})

export default withSnackbar(withStyles(styles)(Filter));