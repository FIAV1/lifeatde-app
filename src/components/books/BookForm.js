import React, { Component } from 'react';

import {
    withStyles,
    Button,
} from '@material-ui/core';

import {
    ValidatorForm,
    TextValidator,
} from 'react-material-ui-form-validator';

import { formDataSerializer } from '../../lib/Utils';

import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Api from '../../lib/Api';
import history from '../../lib/history';
import { withSnackbar } from 'notistack';
import Select from "@material-ui/core/Select/Select";
import InputLabel from "@material-ui/core/InputLabel/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment/InputAdornment";
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox/Checkbox";
import FileList from "../projects/FileList";
import LocalStorage from "../../lib/LocalStorage";

class BookForm extends Component {

    state = {
        id: this.props.id || null,
        title: this.props.title || '',
        description: this.props.description || '',
        course_id: this.props.courseId || LocalStorage.get('user').included.find(relationship => relationship.type === 'course').id,
        price: this.props.price || '',
        photos: [],
        oldPhotos: this.props.photos || [],
        availableCourses: [],
        free: this.props.free || false,
    };

    handleChange = value => event => {
        switch (value) {
            case 'photos':
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
                let photos = [...this.state.photos, ...Object.keys(photoList).map(key => photoList[key])];
                this.setState({photos});
                break;
            case 'free':
                let free = this.state.free;
                if (free) {
                    this.setState({
                        free: !free,
                        price: ''
                    });
                } else {
                    this.setState({
                        free: !free,
                        price: 0
                    });
                }
                break;
            default:
                this.setState({[value]: event.target.value});
                break;
        }
    };

    handleSubmit = event => {
        event.preventDefault();

        const { id, title, description, price, course_id, photos } = this.state;

        let formData = new FormData();
        let params = {
            title,
            description,
            price,
            course_id
        };

        if (photos.length > 0) params.photos = photos;

        formData = formDataSerializer('book', params, formData);

        if (this.props.edit) {
            Api.put(`/books/${id}`, formData).then(response => {
                response.meta.messages.forEach(message => this.props.enqueueSnackbar(message, {variant: 'success'}));
                history.push(`/books/${response.data.id}`)
            }).catch(({errors}) => {
                errors.forEach(error => this.props.enqueueSnackbar(error.detail, {variant: 'error'}));
            })
        } else {
            Api.post(`/courses/${course_id}/books`, formData).then(response => {
                response.meta.messages.forEach(message => this.props.enqueueSnackbar(message, {variant: 'success'}));
                history.push(`/books/${response.data.id}`)
            }).catch(({errors}) => {
                errors.forEach(error => this.props.enqueueSnackbar(error.detail, {variant: 'error'}));
            });
        }
    };

    removeFile = (fileId, fileIndex) => {
        const { oldPhotos, photos } = this.state;

        if (fileId) {
            this.setState({oldPhotos: oldPhotos.filter(oldFile => oldFile.id !== fileId)});
        } else {
            this.setState({photos: photos.filter((file, index) => index !== fileIndex)});
        }
    };

    deleteFile = fileId => {
        let files = {
            photos: [fileId]
        };

        Api.delete(`/books/${this.state.id}/photos`, files).then(response => {
            response.meta.messages.forEach(message => this.props.enqueueSnackbar(message, {variant: 'success'}));
        }).catch(({errors}) => {
            errors.forEach(error => this.props.enqueueSnackbar(error.detail, {variant: 'error'}));
        });
    };

    componentDidMount() {
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
        const { title, description, price, course_id, availableCourses, free, photos, oldPhotos } = this.state;

        return (
            <ValidatorForm
                className={classes.container}
                onSubmit={this.handleSubmit}
            >
                <TextValidator
                    id="title"
                    label="Titolo"
                    onChange={this.handleChange('title')}
                    name="title"
                    value={title}
                    className={classes.mT}
                    validators={['required']}
                    errorMessages={['Dai un titolo al tuo progetto']}
                />
                <TextValidator
                    id="description"
                    label="Descrizione"
                    multiline
                    rowsMax="100"
                    rows="5"
                    value={description}
                    name="description"
                    onChange={this.handleChange('description')}
                    className={classes.mT}
                    variant="outlined"
                />
                <InputLabel htmlFor="course-select" className={classes.mT}>Corso</InputLabel>
                <Select
                    native
                    value={course_id}
                    onChange={this.handleChange('course_id')}
                    inputProps={{
                        name: 'course_id',
                        id: 'course-select',
                    }}
                    required
                >
                    {
                        availableCourses.map(course => (
                            <option key={course.id} value={course.id}>{course.attributes.name}</option>
                        ))
                    }
                </Select>
                <TextValidator
                    id="price"
                    label="Prezzo"
                    value={price}
                    name="price"
                    onChange={this.handleChange('price')}
                    className={classes.priceText}
                    InputProps = {{
                        endAdornment: <InputAdornment position="end">€</InputAdornment>,
                    }}
                    disabled={free}
                    validators={['required', 'isFloat']}
                    errorMessages={['Inserisci il prezzo', 'Il prezzo deve essere nel formato €.€']}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={free}
                            onChange={this.handleChange('free')}
                            value="free"
                            color="primary"
                        />
                    }
                    label="Gratis"
                />
                <FileList removeFile={this.removeFile} deleteFile={this.deleteFile} files={photos} />
                <FileList removeFile={this.removeFile} deleteFile={this.deleteFile} files={oldPhotos} old />
                <input
                    id="upload-file-button"
                    className={classes.input}
                    multiple
                    type="file"
                    onChange={this.handleChange('photos')}
                />
                <label htmlFor="upload-file-button">
                    <Button
                        type="button"
                        variant="contained"
                        color="primary"
                        component="span"
                        fullWidth
                        className={classes.mT}
                    >
                        Carica foto
                        <CloudUploadIcon className={classes.rightIcon} />
                    </Button>
                </label>
                <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    fullWidth
                    className={classes.button}
                >
                    {edit ? 'Salva modifiche' : 'Metti in vendita'}
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
        marginBottom: theme.spacing.unit * 4,
    },
    mT: {
        marginTop: theme.spacing.unit * 4,
    },
    button: {
        marginTop: theme.spacing.unit * 4,
        marginBottom: theme.spacing.unit * 2,
    },
    input: {
        display: 'none',
    },
    rightIcon: {
        marginLeft: theme.spacing.unit,
    },
    priceText: {
        width: '100px',
        marginTop: theme.spacing.unit * 4,
    },
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
    },
});

export default withSnackbar(withStyles(styles, { withTheme: true })(BookForm));