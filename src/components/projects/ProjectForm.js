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
    Button,
    Grid,
    Divider,
} from '@material-ui/core';
import Autocomplete from '../common/Autocomplete';
import AsyncAutocomplete from '../common/AsyncAutocomplete';
import FileList from './FileList';
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
    description: Yup.string()
        .required('Devi inserire una descrizione del progetto'),
    status: Yup.string()
        .required('Devi scegliere lo stato del progetto'),
});

class ProjectForm extends Component {
    state = {
        categoriesOptions: [],
    };

    FORM_VALUES = {
        title: this.props.title || '',
        categories: this.props.edit ? this.props.categories.map(category => ({value: parseInt(category.id, 10), label: category.attributes.name})) : [],
        status: this.props.edit ? this.props.projectStatus.id : 1,
        description: this.props.description || '',
        documents: [],
        oldDocuments: this.props.documents || [],
        collaborators: this.props.edit ? this.props.collaborators.map(collaborator => ({value: parseInt(collaborator.id, 10), label: `${collaborator.attributes.firstname} ${collaborator.attributes.lastname}`})) : [],
        results: this.props.results || '',
    };

    componentDidMount() {
        document.title = `LifeAtDe | ${this.props.edit ? 'Modifica progetto' : 'Crea progetto'}`;

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
    };

    removeFiles = props => (fileId, fileIndex) => {
		let oldDocuments = props.values.oldDocuments;
        let newDocuments = props.values.documents;

		if (fileId) {
            props.setFieldValue('oldDocuments', oldDocuments.filter(oldFile => oldFile.id !== fileId));
		} else {
			props.setFieldValue('documents', newDocuments.filter((newDocument,index) => index !== fileIndex));
		}
    };

    deleteFiles = props => fileId => {
        let files = {
            documents: [fileId]
        };
        
        Api.delete(`/projects/${this.props.id}/documents`, files).then(response => {
            this.removeFiles(props)(fileId, null);
            response.meta.messages.forEach(message => this.props.enqueueSnackbar(message, {variant: 'success'}));
        }).catch(({errors}) => {
            errors.forEach(error => this.props.enqueueSnackbar(error.detail, {variant: 'error'}));
        });
    };

    handleAsyncOptions = endpoint => async inputValue => {
		return Api.get(endpoint+inputValue).then(response => {
			return response.data.filter(element => element.id !== LocalStorage.get('user').data.id).map(element => ({
                value: parseInt(element.id, 10),
                label: element.attributes.firstname + ' ' + element.attributes.lastname,
            }));
		}).catch(({errors}) => {
            errors.forEach(error => this.props.enqueueSnackbar(error.detail, {variant: 'error'}));
        });
	};

    handleSubmit = (values, actions) => {
        actions.setSubmitting(false);

        let formData = new FormData();
        let params = {
            title: values.title,
            description: values.description,
            project_status_id: values.status,
            categories: values.categories.map(category => category.value),
        };

        if (values.results) params.results = values.results;
        if (values.documents) params.documents = values.documents;
        if (values.collaborators) params.collaborators = values.collaborators.map(collaborator => collaborator.value);

        formData = formDataSerializer('project', params, formData);

        if (this.props.edit) {
            Api.put(`/projects/${this.props.id}`, formData).then(response => {
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
    };

    render() {
        const { classes, edit } = this.props;
        const { categoriesOptions } = this.state;

        return (
            <div id="project-form">
                <Typography component="h1" variant="h4" gutterBottom>
                { edit
                ? 'Modifica progetto'
                : 'Crea nuovo progetto'}
                </Typography>
                <Divider className={classes.divider} />
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
                                    classes={{
                                        select: classes.select
                                    }}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    value={props.values.status}
                                    inputProps={{
                                        id: 'status',
                                    }}
                                >
                                    <option value={1}>Aperto</option>
                                    <option value={2}>Chiuso</option>
                                    <option value={3}>Terminato</option>
                                </Select>
                                {props.touched.status && props.errors.status ? <FormHelperText>{props.errors.status}</FormHelperText> : null}
                            </FormControl>
                            <TextField
                                id="description"
                                label="Descrizione"
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                                value={props.values.description}
                                helperText={props.touched.description ? props.errors.description : null}
                                error={props.errors.description && props.touched.description}
                                className={classes.formField}
                                rows="5"
                                rowsMax="100"
                                multiline
                                variant="outlined"
                            />
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
                                label="Collaboratori"
                                onChange={value => props.setFieldValue('collaborators', value)}
                                onBlur={() => props.setFieldTouched('collaborators')}
                                value={props.values.collaborators}
                                loadOptions={this.handleAsyncOptions('/users?search=')}
                                placeholder="Aggiungi collaboratori..."
                                isMulti
                            />
                            { props.values.status === "3" && <TextField
                                id="results"
                                label="Risultati"
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                                value={props.values.results}
                                helperText={props.touched.results ? props.errors.results : null}
                                error={props.errors.results && props.touched.results}
                                className={classes.formField}
                                rows="5"
                                rowsMax="100"
                                multiline
                                variant="outlined"
                            /> }
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
                            <Grid container spacing={16}>
                                <Grid item xs={12} sm={6}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                    >
                                        {edit ? 'Salva modifiche' : 'Crea progetto'}
                                    </Button>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Button
                                        type="button"
                                        variant="contained"
                                        color="secondary"
                                        fullWidth
                                        onClick={() => history.push('/projects')}
                                    >
                                        Annulla
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    }
                />
            </div>
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
    divider: {
        marginBottom: theme.spacing.unit * 2,
    },
    button: {
        marginTop: theme.spacing.unit * 2,
        marginBottom: theme.spacing.unit * 2,
    },
    rightIcon: {
        marginLeft: theme.spacing.unit,
    },
    select: {
        '&>option': {
            backgroundColor: theme.palette.background.paper,
        }
    }
});

export default withSnackbar(withStyles(styles, {withTheme: true})(ProjectForm));