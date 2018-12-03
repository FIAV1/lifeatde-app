import React, { Component } from 'react';

import {
    Grid,
} from '@material-ui/core';

import StudyGroupForm from '../components/study-groups/StudyGroupForm';
import Api from '../lib/Api';
import { withSnackbar } from 'notistack';
import Loader from '../components/common/Loader';
import LocalStorage from "../lib/LocalStorage";
import history from "../lib/history";

class StudyGroupEditContainer extends Component {
	state = {
		id: null,
		title: null,
        description: null,
		loading: true,
	}

	componentDidMount() {
		Api.get(`/study_groups/${this.props.match.params.id}`).then(response => {
            const adminId = response.data.relationships.user.data.id;
            if (adminId !== LocalStorage.get('user').data.id) {
                history.push(`/study_groups/${this.props.match.params.id}`);
            } else {
                let studyGroups = response.data;
                this.setState({
                    id: studyGroups.id,
                    title: studyGroups.attributes.title,
                    description: studyGroups.attributes.description,
                    loading: false,
                });
            }
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
						edit
					/>
                </Grid>
            </Grid>
		)
	}
}
	
export default withSnackbar(StudyGroupEditContainer);