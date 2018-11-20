import React, { Component } from 'react';

import {
	withStyles,
	MenuItem,
	Button,
	Typography,
} from '@material-ui/core';

import {
	ValidatorForm,
	TextValidator,
} from 'react-material-ui-form-validator';

import FileList from './FileList';

import { Editor } from '@tinymce/tinymce-react';

import { formDataSerializer, getError } from '../../lib/Utils';

import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Autocomplete from '../common/Autocomplete';
import AsyncAutocomplete from '../common/AsyncAutocomplete';
import Api from '../../lib/Api';
import history from '../../lib/history';
import { withSnackbar } from 'notistack';

class ProjectForm extends Component {
	state = {
		id: null || this.props.id,
		title: this.props.title || '',
		description: this.props.description || '',
		status: this.props.status || '',
		files: null,
		oldFiles: this.props.files || [],
		categories: this.props.categories || [],
		admin: this.props.admin || '',
		collaborators: this.props.collaborators || [],
		results: this.props.results || null,
		errors: [],
	}

	handleChange = value => event => {
		let fileList = event.target.files;

		if (fileList) {
			let files = Object.keys(fileList).map(key => fileList[key]);
			this.setState({files});
		} else {
			this.setState({[value]: event.target.value});
		}
	}
	
	handleAutocomplete = name => value => {
        this.setState({
            [name]: value,
        });
    };

	handleEditor = value => content => {
		this.setState({[value]: content});
	}

	handleValidation = () => {
		const { categories, errors, description } = this.state;
		let newErrors = [];

		if (categories.length < 1) {
			newErrors.push({categories: 'Devi scegliere almeno una categoria'});
		}

		if (!description) {
			newErrors.push({description: 'Devi inserire una descrizione del tuo progetto'});
		}

		this.setState({errors: newErrors.concat(errors)});
	}

	handleSubmit = event => {
		event.preventDefault();

		const { id, title, description, status, files, categories, collaborators, results, errors } = this.state;

		if (errors.length < 1) {
			let formData = new FormData();
			let params = {
				title,
				description,
				project_status_id: status,
				categories: categories.map(category => category.value),
			}

			if (results) params.results = results;
			if (files) params.documents = files;
			if (collaborators) params.collaborators = collaborators.map(collaborator => collaborator.value);

			formData = formDataSerializer('project', params, formData);

			if (this.props.edit) {
				Api.put('/projects/'+id, formData).then(response => {
					response.meta.messages.forEach(message => this.props.enqueueSnackbar(message, {variant: 'success'}));
					history.push(`/projects/${response.data.id}`)
				}).catch(({errors}) => {
					errors.forEach(error => this.props.enqueueSnackbar(error.detail, {variant: 'error'}));
				})
			} else {
				Api.post('/projects', formData).then(response => {
					response.meta.messages.forEach(message => this.props.enqueueSnackbar(message, {variant: 'success'}));
					history.push(`/projects/${response.data.id}`)
				}).catch(({errors}) => {
					errors.forEach(error => this.props.enqueueSnackbar(error.detail, {variant: 'error'}));
				});
			}
		}
	}

	removeErrors = value => () => {
		const { errors } = this.state;
		let newErrors = errors.filter(error => Object.keys(error)[0] !== value);
		this.setState({ errors: newErrors });
	}
	
	removeFile = (fileId, fileIndex) => {
		const { oldFiles, files } = this.state;

		let updatedFiles;

		if (fileId) {
			updatedFiles = oldFiles.filter(oldFile => oldFile.id !== fileId);
			this.setState({oldFiles: updatedFiles});
		} else {
			updatedFiles = files.filter((file,index) => index !== fileIndex);
			this.setState({files: updatedFiles});	
		}
	}

	render() {
		const { theme, classes, edit } = this.props;
		const { id, title, description, status, oldFiles, files, categories, collaborators, results, errors } = this.state;

		return (
			<ValidatorForm
				ref={ref => this.form = ref}
				className={classes.container}
                onSubmit={this.handleSubmit}
            >
				<TextValidator
					className={classes.mB}
					label="Titolo"
                    onChange={this.handleChange('title')}
                    name="title"
                    value={title}
                    validators={['required']}
                    errorMessages={['Dai un titolo al tuo progetto']}
                />
				<TextValidator
					className={classes.mB}
					label="Stato"
					select
                    onChange={this.handleChange('status')}
                    name="status"
                    value={status}
                    validators={['required']}
                    errorMessages={['Decidi lo stato del tuo progetto']}
					>
					<MenuItem value={1}>
						Aperto
					</MenuItem>
					<MenuItem value={2}>
						Chiuso
					</MenuItem>
					<MenuItem value={3}>
						Terminato
					</MenuItem>
				</TextValidator>
				<Typography color={getError('description', errors) ? 'error' : 'default'} variant="h6">Descrizione:</Typography>
				<Editor
					apiKey="rbu4hj5ircwmuxgzfztjdj2bouzq9l16er0056w2zzw43kvv"
					initialValue={description}
					init={{
						menubar: false,
						elementpath: false,
						skin_url: `${process.env.PUBLIC_URL}/tinymce/material-${theme.palette.type}`,
						plugins: 'lists, link, emoticons, fullscreen',
						toolbar: 'fullscreen | undo redo | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist formatselect | blockquote link unlink | emoticons',
						min_height: 280,
					}}
					onEditorChange={this.handleEditor('description')}
					onFocus={this.removeErrors('description')}
				/>
				<Typography variant="caption" color="error">{getError('description', errors)}</Typography>
				<input
					className={classes.input}
					id="upload-file-button"
					multiple
					type="file"
					onChange={this.handleChange('files')}
				/>
				{status === 3 && <div>
					<Typography className={classes.mT} variant="h6">Conclusioni:</Typography>
					<Editor
						apiKey="rbu4hj5ircwmuxgzfztjdj2bouzq9l16er0056w2zzw43kvv"
						initialValue={results}
						init={{
							menubar: false,
							elementpath: false,
							skin_url: `${process.env.PUBLIC_URL}/tinymce/material-${theme.palette.type}`,
							plugins: 'lists, link, emoticons, fullscreen',
							toolbar: 'fullscreen | undo redo | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist formatselect | blockquote link unlink | emoticons',
							min_height: 280,
						}}
						onEditorChange={this.handleEditor('results')}
					/>
				</div>}
				<Autocomplete
					label="Categorie"
					name="categories"
					endpoint="/categories"
					values={categories}
					handleAutocomplete={this.handleAutocomplete}
					errors={errors}
					onFocus={this.removeErrors('categories')}
				/>
				<AsyncAutocomplete
					label="Membri"
					name="collaborators"
					endpoint="/users?search="
					values={collaborators}
					handleAutocomplete={this.handleAutocomplete}
				/>
				<label htmlFor="upload-file-button">
					<Button
						type="button"
						variant="contained"
						color="primary"
						component="span"
						fullWidth
						className={classes.button}
					>
						Carica file
						<CloudUploadIcon className={classes.rightIcon} />
					</Button>
				</label>
				<FileList removeFile={this.removeFile} projectId={id} files={files} />
				<FileList removeFile={this.removeFile} projectId={id} files={oldFiles} old />
				<Button
					type="submit"
					onClick={this.handleValidation}
					variant="contained"
					color="secondary"
					fullWidth
					className={classes.button}
				>
					{edit ? 'Salva modifiche' : 'Crea progetto'}
				</Button>
			</ValidatorForm>
		)
	}
}

const styles = theme => ({
	container: {
		display: 'flex',
		flexWrap: 'wrap',
		flexDirection: 'column',
	},
	mB: {
		marginBottom: theme.spacing.unit * 2,
	},
	mT: {
		marginTop: theme.spacing.unit * 2,
	},
	button: {
		marginTop: theme.spacing.unit * 2,
		marginBottom: theme.spacing.unit * 2,
	},
	input: {
		display: 'none',
	},
	rightIcon: {
		marginLeft: theme.spacing.unit,
	},
	formControl: {
		margin: theme.spacing.unit,
		minWidth: 120,
		maxWidth: 300,
	},
	  chips: {
		display: 'flex',
		flexWrap: 'wrap',
	},
	  chip: {
		margin: theme.spacing.unit / 4,
	},
})

export default withSnackbar(withStyles(styles, { withTheme: true })(ProjectForm));