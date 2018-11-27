import React, { Component } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';

import {
    withStyles,
    TextField,
    Button,
    Grid,
    Typography,
    Chip,
    Divider,
} from '@material-ui/core';

import Api from '../../lib/Api';
import history from '../../lib/history';
import LocalStorage from '../../lib/LocalStorage';
import { getCourseColor } from '../../lib/Utils';
import { withSnackbar } from 'notistack';

const validationSchema = Yup.object().shape({
    title: Yup.string()
        .max(50, 'Sono consentiti al massimo 50 caratteri per il titolo')
        .required('Devi inserire un titolo'),
    description: Yup.string()
        .required('Devi inserire una descrizione per il gruppo di studio'),
});

class StudyGroupForm extends Component {
    state = {
        course: LocalStorage.get('user').included.find( item => item.type === 'course'),
    }

    FORM_VALUES = {
        id: this.props.id || null,
		title: this.props.title || '',
        description: this.props.description || '',
    }

    handleSubmit = (values, actions) => {
        actions.setSubmitting(false);

        const courseId = this.state.course.id;

        let params = {
            study_group:{
                title: values.title,
                description: values.description,
            }
        }
        
        if (this.props.edit) {
            Api.put(`/study_groups/${values.id}`, params).then(response => {
                response.meta.messages.forEach(message => this.props.enqueueSnackbar(message, {variant: 'success'}));
                history.push(`/study_groups/${response.data.id}`)
            }).catch(({errors}) => {
                errors.forEach(error => this.props.enqueueSnackbar(error.detail, {variant: 'error'}));
            })
        } else {
            Api.post(`/courses/${courseId}/study_groups/`, params).then(response => {
                response.meta.messages.forEach(message => this.props.enqueueSnackbar(message, {variant: 'success'}));
                history.push(`/study_groups/${response.data.id}`)
            }).catch(({errors}) => {
                errors.forEach(error => this.props.enqueueSnackbar(error.detail, {variant: 'error'}));
            });
        }
    }

    componentDidMount() {
        document.title = `LifeAtDe | ${this.props.edit ? 'Modifica gruppo di studio' : 'Crea gruppo di studio'}`;
    }

    render() {
		const { classes, edit } = this.props;
		const { course } = this.state;

        return (
            <div id="study-group-form">
                <Grid container justify='space-between'>
                    <Grid item >
                        <Typography className={classes.header} component="h1" variant="h4" xs={12} sm={6}>
                        {edit ? 'Modifica il gruppo di studio' : 'Crea un gruppo di studio'}
                        </Typography>
                    </Grid>
                    <Grid item className={classes.item} xs={12} sm={4}>
                        <Chip  classes={{
                            root: classes.chipRoot,
                            label: classes.chipLabel
                        }}
                        label={
                            <Typography  variant='body1' noWrap>{course.attributes.name}</Typography>
                        }
                        style={{backgroundColor: getCourseColor(course.attributes.name)}}
                        />
                    </Grid>
                </Grid>
                <Divider className={classes.hr} />
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
                            <TextField
                                id="description"
                                label="Descrizione"
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                                value={props.values.description}
                                helperText={props.touched.description ? props.errors.description : null}
                                error={props.errors.description && props.touched.description}
                                className={classes.formField}
                                multiline
                                rowsMax="100"
                                variant="outlined"
                            />
                            <Grid container spacing={16}>
                                <Grid item xs={12} sm={6}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                    >
                                        {edit ? 'Salva modifiche' : 'Crea gruppo di studio'}
                                    </Button>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Button
                                        type="button"
                                        variant="contained"
                                        color="secondary"
                                        fullWidth
                                        onClick={() => history.push('/study_groups')}
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
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    hr: {
        margin: '0 0 20px',
    },
    item: {
        padding: `${theme.spacing.unit}px 0 ${theme.spacing.unit}px 0px`,
        marginLeft: 'auto'
    },
    chipRoot: {
        maxWidth: '100%',
    },
    chipLabel:{
        overflow: 'hidden',
        paddingRight: 0,
        marginRight: '12px',
    },
	container: {
		display: 'flex',
		flexWrap: 'wrap',
		flexDirection: 'column',
    },
    formField: {
        width: '100%',
        marginBottom: theme.spacing.unit * 2,
    },
})

export default withSnackbar(withStyles(styles, { withTheme: true })(StudyGroupForm));