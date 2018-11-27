import React, { Component } from 'react';

import {
    Grid,
} from '@material-ui/core';

import Api from '../lib/Api';
import { withSnackbar } from 'notistack';
import Loader from '../components/common/Loader';
import BookForm from "../components/books/BookForm";

class BookEditContainer extends Component {
    state = {
        title: '',
        description: '',
        price: null,
        course: null,
        photos: [],
        loading: true,
    };

    componentDidMount() {
        Api.get('/books/' + this.props.match.params.id).then(response => {
            let book = response.data;
            this.setState({
                id: book.id,
                title: book.attributes.title,
                description: book.attributes.description,
                photos: book.attributes.photos,
                course: response.included.find(relationship => relationship.type === 'course'),
                price: book.attributes.price,
                loading: false,
            });
        }).catch(({errors}) => {
            errors.forEach(error => this.props.enqueueSnackbar(error.detail, {variant: 'error'}));
        });
    }
    render() {
        const { id, title, description, photos, course, price, loading } = this.state;

        if (loading) return <Loader />;

        let free = false;
        if (parseInt(price, 10) === 0) free = true;

        return (
            <Grid container justify="center">
                <Grid item xs={12} md={8}>
                    <BookForm
                        id={id}
                        title={title}
                        description={description}
                        photos={photos}
                        courseId={course.id}
                        price={price}
                        free={free}
                        edit={true}
                    />
                </Grid>
            </Grid>
        )
    }
}

export default withSnackbar(BookEditContainer);