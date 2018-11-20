import React, { Component } from 'react';

import Api from '../lib/Api';

import {
    Grid,
} from '@material-ui/core';

import Book from '../components/books/Book';
import Notifier, { showNotifier } from '../components/common/Notifier';
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
                user: response.included.shift(),
                loading: false
            }, () => document.title = `LifeAtDe | ${this.state.book.attributes.title}`);
        }).catch(({errors}) => {
            showNotifier({messages: errors, variant: 'error'})
        });
    }

    render() {
        const { loading, book, user} = this.state;

        if(loading) {
            return <Loader notifier={<Notifier />} />
        }

        return(
            <Grid container>
                <Grid item xs={12}>
                    <Book book={book} user={user} />
                </Grid>
                <Notifier />
            </Grid>
        );
    }
}

export default BookContainer;