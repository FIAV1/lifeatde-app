import React, { Component } from 'react';

import {
    Grid,
    Typography,
} from '@material-ui/core';
import BookCard from '../components/BookCard';


class BookCardList extends Component {

    getBookOwner = (book, users) => {
        return users.find( user => user.id === book.relationships.user.data.id);
    };

    render() {
        const { books, users } = this.props;

        if (!books || books.length === 0) {
            return (
                <Typography variant="subtitle1">
                    Non ci sono libri da visualizzare.
                </Typography>
            )
        }

        return (
            <Grid container spacing={16}>
                {books.map(book => <BookCard key={book.id} book={book} user={this.getBookOwner(book, users)}/>)}
            </Grid>
        );
    }

}

export default BookCardList;