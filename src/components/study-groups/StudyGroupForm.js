import React, { Component } from 'react';

import {
	withStyles,
    Button,
    Grid,
    Typography,
    Chip,
    Divider,
} from '@material-ui/core';

import {
	ValidatorForm,
	TextValidator,
} from 'react-material-ui-form-validator';


import Api from '../../lib/Api';
import history from '../../lib/history';
import LocalStorage from '../../lib/LocalStorage';
import { getCourseColor } from '../../lib/Utils';
import { withSnackbar } from 'notistack';

class StudyGroupForm extends Component {
	state = {
		id: null || this.props.id,
		title: this.props.title || '',
        description: this.props.description || '',
        course: LocalStorage.get('user').included.find( item => item.type === 'course')
    }

    handleChange = value => event => {
        this.setState({[value]: event.target.value});
    }

    handleEditor = value => content => {
		this.setState({[value]: content});
    }
    
    handleSubmit = event => {
		event.preventDefault();

		const { id, title, description, course } = this.state;

        let course_id = course.id

        let params = {
            study_group:{
                title,
                description,
            }
        }
        
        if (this.props.edit) {
            Api.put(`/study_groups/${id}`, params).then(response => {
                response.meta.messages.forEach(message => this.props.enqueueSnackbar(message, {variant: 'success'}));
                history.push(`/study_groups/${response.data.id}`)
            }).catch(({errors}) => {
                errors.forEach(error => this.props.enqueueSnackbar(error.detail, {variant: 'error'}));
            })
        } else {
            Api.post(`/courses/${course_id}/study_groups/`, params).then(response => {
                response.meta.messages.forEach(message => this.props.enqueueSnackbar(message, {variant: 'success'}));
                history.push(`/study_groups/${response.data.id}`)
            }).catch(({errors}) => {
                errors.forEach(error => this.props.enqueueSnackbar(error.detail, {variant: 'error'}));
            });
        }
    }


    render() {
		const { classes, edit } = this.props;
		const { title, description, course } = this.state;

        return (
            <div id="news-cards-container">
                <Grid container justify='space-between'>
                    <Grid item >
                        <Typography className={classes.header} component="h1" variant="h4" xs={12} md={6} xl={4}>
                        {edit ? 'Modifica il gruppo di studio' : 'Crea un gruppo di studio'}
                        </Typography>
                    </Grid>
                    <Grid item className={classes.item} xs={12} sm={"auto"}>
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
                <ValidatorForm
                    ref={ref => this.form = ref}
                    className={classes.container}
                    onSubmit={this.handleSubmit}
                >
                    <TextValidator
                        margin="normal"
                        label="Titolo"
                        onChange={this.handleChange('title')}
                        name="title"
                        value={title}
                        validators={['required']}
                        errorMessages={['Dai un titolo al tuo gruppo di studio']}
                    />
                    <TextValidator
                        label="Descrizione"
                        onChange={this.handleChange('description')}
                        name="description"
                        value={description}
                        validators={['required']}
                        errorMessages={['Fai una descrizione del tuo gruppo di studio']}
                        multiline
                        rowMax="100"
                        variant="outlined"
                        margin="normal"
                    />
                <Button
                        type="submit"
                        onClick={this.handleValidation}
                        variant="contained"
                        color="secondary"
                        fullWidth
                        className={classes.button}
                    >
                        {edit ? 'Salva modifiche' : 'Crea gruppo di studio'}
                    </Button>
                </ValidatorForm>
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
	button: {
		marginTop: theme.spacing.unit * 2,
		marginBottom: theme.spacing.unit * 2,
    },
})

export default withSnackbar(withStyles(styles, { withTheme: true })(StudyGroupForm));