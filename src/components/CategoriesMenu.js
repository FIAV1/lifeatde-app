import React, { Component } from 'react';

import {
    withStyles,
    Button,
    Menu,
    MenuItem,
} from '@material-ui/core';

class CategoriesMenu extends Component {
    state = {
        anchorEl: null,
    };
    
    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    };
    
    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    render() {
        const { classes, elements, id } = this.props;
        const { anchorEl } = this.state;

        return (
            <div>
                <Button
                    aria-owns={anchorEl ? `categories-menu-${id}` : null}
                    aria-haspopup="true"
                    onClick={this.handleClick}
                    variant="outlined"
                    size="small"
                >
                    Categorie
                    <div className={classes.div}>
                        {elements.length}
                    </div>
                </Button>
                <Menu
                    id={`categories-menu-${id}`}
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={this.handleClose}
                >
                    {elements.map(element => <MenuItem key={element} onClick={this.handleClose}>{element}</MenuItem>)}
                </Menu>
            </div>
        );
    }
}

const styles = theme => ({
    div: {
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
        marginLeft: theme.spacing.unit,
    }
});

export default withStyles(styles)(CategoriesMenu);