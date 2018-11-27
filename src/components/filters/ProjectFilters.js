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
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

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
            this.props.onFilter(response.data, response.meta);
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
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography className={classes.typography} variant="caption"><FilterListIcon className={classes.icon} /> FILTRA</Typography>
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
    typography: {
        display:'flex',
        alignItems: 'center',
    },
    icon: {
        marginRight: theme.spacing.unit,
    }
})

export default withSnackbar(withStyles(styles)(Filter));