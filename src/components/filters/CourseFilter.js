import React, { Component } from 'react';
import Api from '../../lib/Api';

import {
    withStyles,
    FormControl,
    InputLabel,
    Select,
} from '@material-ui/core';

class CourseFilter extends Component {
    state = {
        loading: true,
        coursesOptions: [],
        courses: '',
    }

    componentDidMount() {
        Api.get('/courses').then(response => {
            this.setState({
                coursesOptions: response.data,
                loading: false,
            });
        });
    }

    handleChange = property => event => {
        this.setState({[property]: event.target.value}, () => {
            console.log(this.state.coursesOptions.find(courseOption => courseOption.id === this.state[property]))
            this.props.filterFn({label: this.state.coursesOptions.find(courseOption => courseOption.id === this.state[property]).attributes.name, value: this.state[property]});
        });
    }

    render() {
        const { classes } = this.props;
        const {loading, courses, coursesOptions } = this.state;

        if (loading) return null;

        return (
            <FormControl style={{width: '100%'}}>
                <InputLabel htmlFor="courses-select">Corsi</InputLabel>
                <Select
                    classes={{
                        select: classes.select
                    }}
                    native
                    multiple
                    value={courses}
                    onChange={this.handleChange('courses')}
                    inputProps={{
                        name: 'courses',
                        id: 'courses-select',
                    }}
                >
                    <option value="" disabled/>
                    { coursesOptions.map(course =>
                        <option
                            key={course.id}
                            value={course.id}
                        >
                            {course.attributes.name}
                        </option>
                    )}
                </Select>
            </FormControl>
        )
    }
}

const styles = theme => ({
    select: {
        '&>option': {
            backgroundColor: theme.palette.background.paper,
        }
    }
});

export default withStyles(styles)(CourseFilter);