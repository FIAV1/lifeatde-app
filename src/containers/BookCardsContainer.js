import React, { Component } from 'react';

import {
    Divider,
    Typography,
    withStyles
} from '@material-ui/core';

import Api from '../lib/Api';
import LocalStorage from "../lib/LocalStorage";
import BookCardList from '../components/books/BookCardList';
import Loader from "../components/common/Loader";
import LoadMoreButton from '../components/common/LoadMoreButton';
import BooksFilters from '../components/filters/BooksFilters';

import { withSnackbar } from 'notistack';

import InfoIcon from '@material-ui/icons/Info';

class BookCardsContainer extends Component {

    state = {
        loading: true,
        loadingMore: false,
        courseId: LocalStorage.get('user').data.relationships.course.data.id,
        books: null,
        included: null,
        meta: null,
        currentFilter: null
    };

    componentDidMount() {
        document.title =  'LifeAtDe | Libri';

        Api.get(`/courses/${this.state.courseId}/books`).then(response => {
            this.setState({
                books: response.data,
                included: response.included,
                meta: response.meta,
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

    handleFilter = property => (filteredItems, filteredItemsIncluded, filteredItemsMeta, filters) => {
        this.setState({
            [property]: filteredItems,
            included: filteredItemsIncluded,
            meta: filteredItemsMeta,
            currentFilter: filters,
        });
    }

    loadMore = endpoint => () => {
        this.setState({loadingMore: true});
        Api.get(endpoint).then(response => {
            let books = this.state.books;
            let included = this.state.included;

            books = books.concat(response.data);
            response.included.forEach(newItem => {
                if (!included.find(oldItem => newItem.id === oldItem.id)) included.push(newItem);
            });

            this.setState({
                books,
                included,
                meta: response.meta,
            });
        }).catch(({errors}) => {
            errors.forEach(error => this.props.enqueueSnackbar(error, {variant: 'error'}));
        }).finally(() => {
            this.setState({loadingMore: false});
        });
    }

    render() {
        const { classes } = this.props;
        const { books, included, meta, loading, loadingMore, currentFilter } = this.state;

        if (loading) {
            return (
                <Loader />
            )
        }

        return(
            <div id="book-cards-container">
                <Typography className={classes.header} component="h1" variant="h4" gutterBottom>
                    Materiale in vendita
                </Typography>
                <Typography className={classes.info} component="h2" variant="caption" gutterBottom>
                    <InfoIcon className={classes.icon} />
                    { currentFilter
                    ? `Il materiale in vendita è mostrato in base al corso di studi: ${currentFilter}`
                    : 'Il materiale in vendita è mostrato in base al tuo corso di studi.' }
                </Typography>
                <BooksFilters
                    filters={['courses']}
                    onFilter={this.handleFilter('books')}
                />
                <Divider className={classes.hr} />
                <BookCardList
                    books={books}
                    included={included}
                    removeBook={this.removeBook}
                />
                { meta.next
                ? <LoadMoreButton
                    meta={meta}
                    endpoint={`/courses/${this.state.courseId}/books`}
                    loadingMore={loadingMore}
                    loadMore={this.loadMore}
                /> : null }
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
    info: {
        display: 'flex',
        alignItems: 'center',
    },
    icon: {
        marginRight: theme.spacing.unit,
    },
});

export default withSnackbar(withStyles(styles)(BookCardsContainer));