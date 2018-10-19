import React, { Component } from 'react';

import {
    withStyles,
    Chip,
} from '@material-ui/core';

class ChipList extends Component {
    render() {
        const { elements, classes } = this.props;
        return(
            <div className={classes.chipContainer}>
                {elements.map(element => <Chip className={classes.chip} key={element} label={element}/>)}
                {elements.map(element => <Chip className={classes.chip} key={element} label={element}/>)}
                {elements.map(element => <Chip className={classes.chip} key={element} label={element}/>)}
                {elements.map(element => <Chip className={classes.chip} key={element} label={element}/>)}
                {elements.map(element => <Chip className={classes.chip} key={element} label={element}/>)}
                {elements.map(element => <Chip className={classes.chip} key={element} label={element}/>)}
                {elements.map(element => <Chip className={classes.chip} key={element} label={element}/>)}
                {elements.map(element => <Chip className={classes.chip} key={element} label={element}/>)}
                {elements.map(element => <Chip className={classes.chip} key={element} label={element}/>)}
                {elements.map(element => <Chip className={classes.chip} key={element} label={element}/>)}
            </div>
        );
    }
}

const styles = {
    chipContainer: {
        display: 'flex',
        flex: 1,
        overflowX: 'auto'
    },
    chip: {
        margin: '0 5px',
    }
}

export default withStyles(styles)(ChipList);