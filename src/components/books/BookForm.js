import React, { Component } from 'react';

import {
    withStyles,
    Button,
    TextField,
    FormControl,
    FormHelperText,
    Typography,
    Select,
    InputLabel,
    InputAdornment,
    FormControlLabel,
    Checkbox,
    Grid,
    Divider,
} from '@material-ui/core';
import {Formik} from "formik";
import * as Yup from "yup";
import { withSnackbar } from 'notistack';
import FileList from "../projects/FileList";

import Api from '../../lib/Api';
import LocalStorage from "../../lib/LocalStorage";
import history from '../../lib/history';
import { formDataSerializer } from '../../lib/Utils';

import CloudUploadIcon from '@material-ui/icons/CloudUpload';

const validationSchema = Yup.object().shape({
    title: Yup.string()
        .max(50, 'Sono consentiti al massimo 50 caratteri per il titolo')
        .required('Devi inserire un titolo'),
    course_id: Yup.string()
        .required('Devi scegliere il corso di studio del libro'),
    price: Yup.number()
        .positive('Devi inserire il prezzo del materiale'),
});

class BookForm extends Component {

    state = {
        availableCourses: [],
    };

    FORM_VALUES = {
        title: this.props.title || '',
        description: this.props.description || '',
        course_id: this.props.courseId || LocalStorage.get('user').included.find(relationship => relationship.type === 'course').id,
        price: this.props.price || '',
        photos: [],
        oldPhotos: this.props.photos || [],
        free: this.props.free || false,
    };

    setFree = props => {
        let free = props.values.free;

        props.setFieldValue('free', !free);
        if (free) {
            props.setFieldValue('price', '');
        } else {
            props.setFieldValue('price', 0);
        }
    };

    addFiles = props => event => {
        let uploadedFiles = event.target.files;
        let photoList = [];
        const re = new RegExp('image/\\S+\\b');

        for (let i = 0; i < uploadedFiles.length; i++) {
            let file = uploadedFiles.item(i);

            if (re.test(file.type)) {
                if (file.size > 16 * Math.pow(2, 20)) {
                    this.props.enqueueSnackbar(`File "${file.name}" ignorato. Dimensione massima consentita 16MB`, {variant: 'warning'});
                } else {
                    photoList.push(file);
                }
            } else {
                this.props.enqueueSnackbar(`File "${file.name}" ignorato. Puoi caricare solamente delle immagini`, {variant: 'warning'});
            }
        }
        let photos = [...props.values.photos, ...Object.keys(photoList).map(key => photoList[key])];
        props.setFieldValue('photos', photos);
    };

    removeFiles = props => (fileId, fileIndex) => {
        let oldPhotos = props.values.oldPhotos;
        let newPhotos = props.values.photos;

        if (fileId) {
            props.setFieldValue('oldPhotos', oldPhotos.filter(oldFile => oldFile.id !== fileId));
        } else {
            props.setFieldValue('photos', newPhotos.filter((newDocument,index) => index !== fileIndex));
        }
    };

    deleteFiles = props => fileId => {
        let files = {
            photos: [fileId]
        };

        Api.delete(`/books/${this.props.id}/photos`, files).then(response => {
            this.removeFiles(props)(fileId, null);
            response.meta.messages.forEach(message => this.props.enqueueSnackbar(message, {variant: 'success'}));
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
            price: values.price,
            course_id: values.course_id
        };

        if (values.photos) params.photos = values.photos;

        formData = formDataSerializer('book', params, formData);

        if (this.props.edit) {
            Api.put(`/books/${this.props.id}`, formData).then(response => {
                response.meta.messages.forEach(message => this.props.enqueueSnackbar(message, {variant: 'success'}));
                history.push(`/books/${response.data.id}`)
            }).catch(({errors}) => {
                errors.forEach(error => this.props.enqueueSnackbar(error.detail, {variant: 'error'}));
            })
        } else {
            Api.post(`/courses/${values.course_id}/books`, formData).then(response => {
                response.meta.messages.forEach(message => this.props.enqueueSnackbar(message, {variant: 'success'}));
                history.push(`/books/${response.data.id}`)
            }).catch(({errors}) => {
                errors.forEach(error => this.props.enqueueSnackbar(error.detail, {variant: 'error'}));
            });
        }
    };

    componentDidMount() {
        document.title = `LifeAtDe | ${this.props.edit ? 'Modifica annuncio libro' : 'Crea annuncio libro'}`;

        Api.get('/courses').then(response => {
            this.setState({
                availableCourses: response.data
            });
        }).catch(({errors}) => {
            errors.forEach(error => this.props.enqueueSnackbar(error.detail, {variant: 'error'}));
        });
    }

    render() {
        const { classes, edit } = this.props;
        const { availableCourses } = this.state;

        return(
            <div id="book-form">
                <Typography component="h1" variant="h4" gutterBottom>
                { edit
                ? 'Modifica annuncio libro'
                : 'Crea annuncio libro' }
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
                                value={props.values.title}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                                helperText={props.touched.title ? props.errors.title : null}
                                error={props.errors.title && props.touched.title}
                                className={classes.formField}
                            />
                            <TextField
                                id="description"
                                label="Descrizione"
                                value={props.values.description}
                                variant="outlined"
                                multiline
                                rows="5"
                                rowsMax="100"
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                                helperText={props.touched.description ? props.errors.description : null}
                                error={props.errors.description && props.touched.description}
                                className={classes.formField}
                            />
                            <FormControl
                                error={props.errors.course_id && props.touched.course_id}
                                className={classes.formField}
                            >
                                <InputLabel htmlFor="course_id">Corso</InputLabel>
                                <Select
                                    native
                                    value={props.values.course_id}
                                    inputProps={{
                                        id: 'course_id',
                                    }}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                >
                                    {
                                        availableCourses.map(course => (
                                            <option key={course.id} value={course.id}>{course.attributes.name}</option>
                                        ))
                                    }
                                </Select>
                                {props.touched.course_id && props.errors.course_id ? <FormHelperText>{props.errors.course_id}</FormHelperText> : null}
                            </FormControl>
                            <TextField
                                id="price"
                                label="Prezzo"
                                value={props.values.price}
                                InputProps = {{
                                    endAdornment: <InputAdornment position="end">€</InputAdornment>,
                                }}
                                disabled={props.values.free}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                                helperText={props.touched.price ? props.errors.price : null}
                                className={classes.priceText}
                            />
                            <FormControlLabel
                                className={classes.checkbox}
                                label="Gratis"
                                control={
                                    <Checkbox
                                        value="free"
                                        checked={props.values.free}
                                        onChange={() => this.setFree(props)}
                                        color="primary"
                                    />
                                }
                            />
                            <FileList
                                deleteFiles={this.deleteFiles(props)}
                                removeFiles={this.removeFiles(props)}
                                files={props.values.oldPhotos}
                                old
                            />
                            <FileList
                                removeFiles={this.removeFiles(props)}
                                files={props.values.photos}
                            />
                            <label htmlFor="upload-file-button">
                                <Button
                                    type="button"
                                    variant="contained"
                                    component="span"
                                    fullWidth
                                    className={classes.button}
                                >
                                    Carica foto
                                    <CloudUploadIcon className={classes.rightIcon} />
                                </Button>
                            </label>
                            <input
                                id="upload-file-button"
                                type="file"
                                multiple
                                onChange={this.addFiles(props)}
                                onBlur={() => props.setFieldTouched('photos')}
                                className={classes.input}
                            />
                            <Grid container spacing={16}>
                                <Grid item xs={12} sm={6}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                    >
                                        {edit ? 'Salva modifiche' : 'Metti in vendita'}
                                    </Button>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Button
                                        type="button"
                                        variant="contained"
                                        color="secondary"
                                        fullWidth
                                        onClick={() => history.push('/books')}
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
        marginBottom: theme.spacing.unit * 4,
    },
    button: {
        marginTop: theme.spacing.unit * 2,
        marginBottom: theme.spacing.unit * 2,
    },
    input: {
        display: 'none',
    },
    divider: {
        marginBottom: theme.spacing.unit * 2,
    },
    rightIcon: {
        marginLeft: theme.spacing.unit,
    },
    checkbox: {
        width: '100%',
    },
    priceText: {
        width: '100px',
    },
});

export default withSnackbar(withStyles(styles, { withTheme: true })(BookForm));