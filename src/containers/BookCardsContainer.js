import React, { Component } from 'react';

import {
    Button,
    Divider,
    Typography,
    withStyles
} from '@material-ui/core';

import Api from '../lib/Api';
import LocalStorage from "../lib/LocalStorage";
import BookCardList from '../components/books/BookCardList';
import AddIcon from '@material-ui/icons/Add';
import FilterListIcon from '@material-ui/icons/FilterList';
import Loader from "../components/common/Loader";
import { withSnackbar } from 'notistack';

class BookCardsContainer extends Component {

    state = {
        books: null,
        included: null,
        loading: true
    };

    componentDidMount() {
        document.title =  'LifeAtDe | Libri';

        const courseId = LocalStorage.get('user').data.relationships.course.data.id;

        Api.get(`/courses/${courseId}/books`).then(response => {
            this.setState({
                books: response.data,
                included: response.included,
                loading: false
            });
        }).catch(({errors}) => {
            errors.forEach(error => this.props.enqueueSnackbar(error.detail, {variant: 'error'}));
        });
    }

    removeBook = (bookId) => {
        let books = this.state.books.filter(book => book.id !== bookId);

        this.setState({books});
    };

    render() {
        const { classes, history } = this.props;
        const { books, included, loading } = this.state;

        if (loading) {
            return (
                <Loader />
            )
        }

        return(
            <div id="book-cards-container">
                <Typography className={classes.header} component="h1" variant="h4">
                    Libri
                    <div>
                        <Button onClick={() => history.push('/books/new')} variant="fab" color="primary" aria-label="Add" className={classes.button}>
                            <AddIcon/>
                        </Button>
                        <Button variant="fab" color="primary" aria-label="Filter" className={classes.button}>
                            <FilterListIcon/>
                        </Button>
                    </div>
                </Typography>
                <Divider className={classes.hr} />
                <BookCardList books={books} included={included} onBookDelete={this.removeBook}/>
            </div>
        )
    }
}

const styles = theme => ({
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    button: {
        width: '40px',
        height: '40px',
        margin: `${theme.spacing.unit}px 0 ${theme.spacing.unit}px ${theme.spacing.unit}px`,
    },
    hr: {
        margin: '0 0 20px',
    },
});


export default withSnackbar(withStyles(styles)(BookCardsContainer));