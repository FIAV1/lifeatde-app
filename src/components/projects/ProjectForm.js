import React, { Component } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';

import Api from '../../lib/Api';
import LocalStorage from '../../lib/LocalStorage';
import history from '../../lib/history';
import { formDataSerializer } from '../../lib/Utils';

import {
    withStyles,
    TextField,
    FormControl,
    InputLabel,
    Select,
    FormHelperText,
    Typography,
    Button
} from '@material-ui/core';
import Autocomplete from '../common/Autocomplete';
import AsyncAutocomplete from '../common/AsyncAutocomplete';
import FileList from './FileList';
import { Editor } from '@tinymce/tinymce-react';
import { withSnackbar } from 'notistack';

import CloudUploadIcon from '@material-ui/icons/CloudUpload';

const validationSchema = Yup.object().shape({
    title: Yup.string()
        .max(50, 'Sono consentiti al massimo 50 caratteri per il titolo')
        .required('Devi inserire un titolo'),
    categories: Yup.array()
        .min(1, 'Devi scegliere almeno una categoria')
        .of(
            Yup.object().shape({
                label: Yup.string().required(),
                value: Yup.string().required(),
            })
        ),
    status: Yup.string()
        .required('Devi scegliere lo stato del progetto'),
    description: Yup.string()
        .required('Devi inserire una descrizione per il progetto'),
});

class ProjectForm extends Component {
    state = {
        categoriesOptions: [],
    }

    FORM_VALUES = {
        id: this.props.id || '',
        title: this.props.title || '',
        categories: this.props.categories || [],
        status: this.props.status || '',
        description: this.props.description || '',
        documents: [],
        oldDocuments: this.props.documents || [],
        collaborators: this.props.collaborators || [],
        edit: this.props.edit || false,
    }

    componentDidMount() {
		Api.get('/categories').then(response => {
            this.setState({
                categoriesOptions: response.data.map(category => ({
                    value: parseInt(category.id, 10),
                    label: category.attributes.name
                })),
                loading: false,
            });
        });
    }

    addFiles = props => event => {
        let documents = props.values.documents;
        let entries = Object.keys(event.target.files).map(key => event.target.files[key]);
        
        props.setFieldValue('documents', documents.concat(entries));
    }

    removeFiles = props => (fileId, fileIndex) => {
		let oldDocuments = props.values.oldDocuments;
        let newDocuments = props.values.documents;

		let updatedFiles;

		if (fileId) {
            updatedFiles = oldDocuments.filter(oldFile => oldFile.id !== fileId);
            props.setFieldValue('oldDocuments', updatedFiles);
		} else {
			updatedFiles = newDocuments.filter((newDocument,index) => index !== fileIndex);
			props.setFieldValue('documents', updatedFiles);
		}
    }

    deleteFiles = props => fileId => {
        let files = {
            documents: [fileId]
        };
        
        Api.delete(`/projects/${props.values.id}/documents`, files).then(response => {
            this.removeFiles(props)(fileId, null);
            response.meta.messages.forEach(message => this.props.enqueueSnackbar(message, {variant: 'success'}));
        }).catch(({errors}) => {
            errors.forEach(error => this.props.enqueueSnackbar(error.detail, {variant: 'error'}));
        });
    }

    handleAsyncOptions = endpoint => async inputValue => {
		return Api.get(endpoint+inputValue).then(response => {
			return response.data.filter(element => element.id !== LocalStorage.get('user').data.id).map(element => ({
                value: element.id,
                label: element.attributes.firstname + ' ' + element.attributes.lastname,
            }));
		}).catch(({errors}) => {
            errors.forEach(error => this.props.enqueueSnackbar(error.detail, {variant: 'error'}));
        });
	}

    handleSubmit = (values, actions) => {
        actions.setSubmitting(false);

        let formData = new FormData();
        let params = {
            title: values.title,
            description: values.description,
            project_status_id: values.status,
            categories: values.categories.map(category => category.value),
        }

        if (values.results) params.results = values.results;
        if (values.documents) params.documents = values.documents;
        if (values.collaborators) params.collaborators = values.collaborators.map(collaborator => collaborator.value);

        formData = formDataSerializer('project', params, formData);

        if (values.edit) {
            Api.put(`/projects/${values.id}`, formData).then(response => {
                response.meta.messages.forEach(message => this.props.enqueueSnackbar(message, {variant: 'success'}));
                history.push(`/projects/${response.data.id}`);
            }).catch(({errors}) => {
                errors.forEach(error => this.props.enqueueSnackbar(error.detail, {variant: 'error'}));
            })
        } else {
            Api.post('/projects', formData).then(response => {
                response.meta.messages.forEach(message => this.props.enqueueSnackbar(message, {variant: 'success'}));
                history.push(`/projects/${response.data.id}`);
            }).catch(({errors}) => {
                errors.forEach(error => this.props.enqueueSnackbar(error.detail, {variant: 'error'}));
            });
        }
    }

    render() {
        const { theme, classes } = this.props;
        const { categoriesOptions } = this.state;

        return (
            <Formik
                initialValues={this.FORM_VALUES}
                onSubmit={this.handleSubmit}
                validationSchema={validationSchema}
                validateOnBlur
                render={props =>
                    <form onSubmit={props.handleSubmit}>
                        <TextField
                            id="title"
                            label="Titolo"
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            value={props.values.title}
                            helperText={props.touched.title ? props.errors.title : null}
                            error={props.errors.title && props.touched.title}
                            className={classes.formField}
                        />
                        <FormControl
                            error={props.errors.status && props.touched.status}
                            className={classes.formField}
                        >
                            <InputLabel htmlFor="status">Status</InputLabel>
                            <Select
                                native
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                                value={props.values.status}
                                inputProps={{
                                    id: 'status',
                                }}
                            >
                                <option value="" disabled />
                                <option value={1}>Aperto</option>
                                <option value={2}>Chiuso</option>
                                <option value={3}>Terminato</option>
                            </Select>
                            {props.touched.status && props.errors.status ? <FormHelperText>{props.errors.status}</FormHelperText> : null}
                        </FormControl>
                        <Typography color={props.touched.description && props.errors.description ? 'error' : 'default'} variant="h6">Descrizione:</Typography>
                        <Editor
                            id="description"
                            apiKey="rbu4hj5ircwmuxgzfztjdj2bouzq9l16er0056w2zzw43kvv"
                            initialValue={props.values.description}
                            init={{
                                menubar: false,
                                elementpath: false,
                                skin_url: `${process.env.PUBLIC_URL}/tinymce/material-${theme.palette.type}`,
                                plugins: 'lists, link, emoticons, fullscreen',
                                toolbar: 'fullscreen | undo redo | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist formatselect | blockquote link unlink | emoticons',
                                min_height: 280,
                            }}
                            onEditorChange={value => props.setFieldValue('description', value)}
                            onBlur={props.handleBlur}
                        />
                        { props.touched.description && props.errors.description
                        ? <Typography variant="caption" color="error">{props.errors.description}</Typography>
                        : null }
                        <Autocomplete
                            id="categories"
                            label="Categorie"
                            onChange={value => props.setFieldValue('categories', value)}
                            onBlur={() => props.setFieldTouched('categories')}
                            value={props.values.categories}
                            helperText={props.touched.categories ? props.errors.categories : null}
                            error={props.errors.categories && props.touched.categories}
                            options={categoriesOptions}
                            placeholder="Seleziona una categoria..."
                            isMulti
                        />
                        <AsyncAutocomplete
                            id="collaborators"
                            label="Membri"
                            onChange={value => props.setFieldValue('collaborators', value)}
                            onBlur={() => props.setFieldTouched('collaborators')}
                            value={props.values.collaborators}
                            loadOptions={this.handleAsyncOptions('/users?search=')}
                            placeholder="Seleziona una categoria..."
                            isMulti
                        />
                        {props.values.status === "3" && <div>
                            <Typography className={classes.mT} variant="h6">Conclusioni:</Typography>
                            <Editor
                                id="results"
                                apiKey="rbu4hj5ircwmuxgzfztjdj2bouzq9l16er0056w2zzw43kvv"
                                initialValue={props.values.results}
                                init={{
                                    menubar: false,
                                    elementpath: false,
                                    skin_url: `${process.env.PUBLIC_URL}/tinymce/material-${theme.palette.type}`,
                                    plugins: 'lists, link, emoticons, fullscreen',
                                    toolbar: 'fullscreen | undo redo | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist formatselect | blockquote link unlink | emoticons',
                                    min_height: 280,
                                }}
                                onEditorChange={value => props.setFieldValue('results', value)}
                                onBlur={props.handleBlur}
                            />
                        </div>}
                        <FileList
                            deleteFiles={this.deleteFiles(props)}
                            removeFiles={this.removeFiles(props)}
                            files={props.values.oldDocuments}
                            old
                        />
                        <label htmlFor="files">
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
                        <input
                            id="files"
                            type="file"
                            onChange={this.addFiles(props)}
                            onBlur={() => props.setFieldTouched('documents')}
                            className={classes.input}
                            multiple
                        />
                        <FileList
                            removeFiles={this.removeFiles(props)}
                            files={props.values.documents}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            className={classes.button}
                        >
                            {props.values.edit ? 'Salva modifiche' : 'Crea progetto'}
                        </Button>
                        <Button
                            type="button"
                            variant="contained"
                            color="secondary"
                            fullWidth
                            className={classes.button}
                            onClick={() => history.push('/projects')}
                        >
                            Annulla
                        </Button>
                    </form>
                }
            />
        )
    }
}

const styles = theme => ({
    formField : {
        width: '100%',
        marginBottom: theme.spacing.unit * 2,
    },
    input: {
        display: 'none',
    },
    button: {
        marginTop: theme.spacing.unit * 2,
        marginBottom: theme.spacing.unit * 2,
    }
});

export default withSnackbar(withStyles(styles, {withTheme: true})(ProjectForm));