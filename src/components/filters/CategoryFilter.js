import React, { Component } from 'react';

import Api from '../../lib/Api';
import Autocomplete from '../common/Autocomplete';

export default class CategoryFilter extends Component {
    state = {
        loading: true,
        categoriesOptions: [],
        categories: null,
    }

    componentDidMount() {
        Api.get('/categories').then(response => {
            this.setState({
                categoriesOptions: response.data.map(category => ({
                    value: parseInt(category.id, 10),
                    label: category.attributes.name
                })),
                loading: false,
            });
        });
    }

    handleAutocomplete = property => value => {
        this.setState({[property]: value}, () => {
            this.props.filterFn(this.state[property]);
        });
    }

    render() {
        const {loading, categories, categoriesOptions } = this.state;

        if (loading) return null;

        return (
            <Autocomplete
                onChange={this.handleAutocomplete('categories')}
                options={categoriesOptions}
                value={categories}
                label="Categorie"
                placeholder="Seleziona una categoria..."
                isMulti
                name="categories"
            />
        )
    }
}
    