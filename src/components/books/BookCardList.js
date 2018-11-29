import React, { Component } from 'react';

import {
    Grid,
    Typography,
} from '@material-ui/core';
import BookCard from './BookCard';


class BookCardList extends Component {

    getBookOwner = (book, included) =>
        included.find(relationship => relationship.type === 'user' && relationship.id === book.relationships.user.data.id);

    getBookCourse = (book, included) =>
        included.find(relationship => relationship.type === 'course' && relationship.id === book.relationships.course.data.id);

    render() {
        const { books, included } = this.props;

        if (!books || books.length === 0) {
            return (
                <Typography variant="subtitle1">
                    Non ci sono libri da visualizzare.
                </Typography>
            )
        }

        return (
            <Grid container spacing={16}>
                {
                    books.map(book =>
                        <BookCard
                            key={book.id}
                            book={book}
                            user={this.getBookOwner(book, included)}
                            course={this.getBookCourse(book, included)}
                            removeBook={this.props.removeBook}
                        />)
                }
            </Grid>
        );
    }

}

export default BookCardList;