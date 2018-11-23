import React, { Component } from 'react';

import {
    Grid,
} from '@material-ui/core';

import StudyGroupForm from '../components/study-groups/StudyGroupForm';
import Api from '../lib/Api';
import { withSnackbar } from 'notistack';
import Loader from '../components/common/Loader';

class StudyGroupEditContainer extends Component {
	state = {
		title: '',
        description: '',
		loading: true,
	}

	componentDidMount() {
		Api.get('/study_groups/' + this.props.match.params.id).then(response => {
			let study_groups = response.data;
			this.setState({
				id: study_groups.id,
				title: study_groups.attributes.title,
				description: study_groups.attributes.description,
				study_groups: response.data,
				loading: false,
			});
		}).catch(({errors}) => {
			errors.forEach(error => this.props.enqueueSnackbar(error.detail, {variant: 'error'}));
		});
	}
	render() {
		const { id, title, description, loading } = this.state;

		if (loading) return <Loader />;

		return (
			<Grid container justify="center">
                <Grid item xs={12} md={8}>
                    <StudyGroupForm
						id={id}
						title={title}
						description={description}
						edit={true}
					/>
                </Grid>
            </Grid>
		)
	}
}
	
export default withSnackbar(StudyGroupEditContainer);