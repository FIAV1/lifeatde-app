import React, { Component } from 'react';

import {
    withStyles,
    TextField,
    InputAdornment,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

class Searchbar extends Component {
    state = {
        search: ''
    }

    handleSubmit = (event) => {
        event.preventDefault();

        // logica richiesta api
    }

    handleChange = event => this.setState({search: event.target.value})

    render() {
        const { classes } = this.props;
        return(
            <form noValidate onSubmit={this.handleSubmit} className={classes.form}>
                <TextField
                    id="global-search"
                    onChange={this.handleChange}
                    value={this.state.search}
                    variant="outlined"
                    label="Cerca in LifeAtDe"
                    fullWidth
                    InputProps={{
                        endAdornment: <InputAdornment position="end"><SearchIcon /></InputAdornment>,
                    }}
                />
            </form>
        );
    }
}
    
const styles = theme => ({
    form: {
        margin: '10px 20px',
        [theme.breakpoints.up('sm')]: {
            width: '60%',
            margin: '10px auto'
        },
        [theme.breakpoints.up('lg')]: {
            width: '50%'
        }
    },
})

export default withStyles(styles)(Searchbar);