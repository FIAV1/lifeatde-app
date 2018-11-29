import React, { Component } from 'react';

import {
    withStyles,
    Button,
    Menu,
    MenuItem,
    Typography,
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
                    <Typography variant="overline" style={{lineHeight: 0}}>Categorie</Typography>
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
                    {elements.map(element => <MenuItem key={element.id} onClick={this.handleClose}>{element.attributes.name}</MenuItem>)}
                </Menu>
            </div>
        );
    }
}

const styles = theme => ({
    div: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '22px',
        height: '22px',
        borderRadius: '50%',
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
        marginLeft: theme.spacing.unit,
    }
});

export default withStyles(styles)(CategoriesMenu);