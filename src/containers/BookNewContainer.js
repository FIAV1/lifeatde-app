import React, { Component } from 'react'

import {
    Grid,
} from '@material-ui/core';

import BookForm from '../components/books/BookForm';

class BookNewContainer extends Component {
    render() {
        return (
            <Grid container justify="center">
                <Grid item xs={12} md={8}>
                    <BookForm />
                </Grid>
            </Grid>
        )
    }
}

export default BookNewContainer;