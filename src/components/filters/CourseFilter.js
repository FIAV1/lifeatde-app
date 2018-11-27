import React, { Component } from 'react';
import Api from '../../lib/Api';

import {
    FormControl,
    InputLabel,
    Select,
} from '@material-ui/core';

export default class CourseFilter extends Component {
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
            this.props.filterFn(this.state[property]);
        });
    }

    render() {
        const {loading, courses, coursesOptions } = this.state;

        if (loading) return null;

        return (
            <FormControl>
                <InputLabel htmlFor="courses-select">Corsi</InputLabel>
                <Select
                    native
                    multiple
                    value={courses}
                    onChange={this.handleChange('courses')}
                    inputProps={{
                        name: 'courses',
                        id: 'courses-select',
                    }}
                >
                    <option value="a" />
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
    