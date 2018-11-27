import React, { Component } from 'react';

import Api from '../lib/Api';

import {
    Grid,
} from '@material-ui/core';
import Book from '../components/books/Book';
import { withSnackbar } from 'notistack';
import Loader from '../components/common/Loader';

class BookContainer extends Component {
    state = {
        loading: true,
        book: null,
        user: null,
    };

    componentDidMount() {
        Api.get('/books/' + this.props.match.params.id).then(response => {
            this.setState({
                book: response.data,
                user: response.included.find(relationship => relationship.type === 'user'),
                course: response.included.find(relationship => relationship.type === 'course'),
                loading: false
            }, () => document.title = `LifeAtDe | ${this.state.book.attributes.title}`);
        }).catch(({errors}) => {
            errors.forEach(error => this.props.enqueueSnackbar(error.detail, {variant: 'error'}));
        });
    }

    render() {
        const { loading, book, user, course } = this.state;

        if(loading) {
            return <Loader />
        }

        return(
            <Grid container>
                <Grid item xs={12}>
                    <Book book={book} user={user} course={course} />
                </Grid>
            </Grid>
        );
    }
}

export default withSnackbar(BookContainer);