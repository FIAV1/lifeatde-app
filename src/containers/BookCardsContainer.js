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
import LoadMoreButton from '../components/common/LoadMoreButton';
import { withSnackbar } from 'notistack';

class BookCardsContainer extends Component {

    state = {
        loading: true,
        loadingMore: false,
        courseId: LocalStorage.get('user').data.relationships.course.data.id,
        books: null,
        users: null,
        meta: null,
    };

    componentDidMount() {
        document.title =  'LifeAtDe | Libri';

        Api.get(`/courses/${this.state.courseId}/books`).then(response => {
            this.setState({
                books: response.data,
                users: response.included,
                meta: response.meta,
                loading: false
            });
        }).catch(({errors}) => {
            errors.forEach(error => this.props.enqueueSnackbar(error.detail, {variant: 'error'}));
        });
    }

    removeBook = (bookId) => {
        let books = this.state.books.filter(book => book.id !== bookId);

        this.setState({
            books,
        });
    };

    loadMore = endpoint => () => {
        this.setState({loadingMore: true});
        Api.get(endpoint).then(response => {
            let books = this.state.books;
            let users = this.state.users;

            books = books.concat(response.data);
            response.included.forEach(user => {
                if (!users.find(el => el.id === user.id)) users.push(user);
            });

            this.setState({
                books: books,
                users: users,
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
        const { books, users, meta, loading, loadingMore } = this.state;

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
                        <Button variant="fab" color="primary" aria-label="Add" className={classes.button}>
                            <AddIcon/>
                        </Button>
                        <Button variant="fab" color="primary" aria-label="Filter" className={classes.button}>
                            <FilterListIcon/>
                        </Button>
                    </div>
                </Typography>
                <Divider className={classes.hr} />
                <BookCardList books={books} users={users} removeBook={this.removeBook}/>
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
});


export default withSnackbar(withStyles(styles)(BookCardsContainer));