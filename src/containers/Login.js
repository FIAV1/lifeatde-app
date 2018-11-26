import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';

import {
	withStyles,
	TextField,
	Typography,
	Grid,
	Button,
	IconButton,
	InputAdornment
} from '@material-ui/core';

import School from '@material-ui/icons/School';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import Authentication from '../lib/Authentication';
import Footer from '../components/common/Footer';

import { withSnackbar } from 'notistack';

const validationSchema = Yup.object().shape({
	email: Yup.string()
		.email('Email non valida')
        .required('Devi inserire un\'email'),
    password: Yup.string()
        .required('Devi inserire la password'),
});

const FORM_VALUES = {
	email: '',
	password: '',
}

class Login extends Component {
	state = {
		showPassword: false,
		redirectToPreviousRoute: false,
	};

	handleClickShowPassword = () => {
		this.setState(state => ({ showPassword: !state.showPassword }));
	};

	handleSubmit = (values, actions) => {
		actions.setSubmitting(false);

		let credentials = {
			email: values.email,
			password: values.password
		};

		Authentication.login(credentials).then(response => {
			let event = new CustomEvent('login', { detail: response });
			this.setState({ redirectToPreviousRoute: true }, () => window.document.dispatchEvent(event));
		}).catch(({errors}) => {
			errors.forEach(error => this.props.enqueueSnackbar(error.detail, {
				variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
			}))
		});
	};

    render() {
		const { classes } = this.props;
		const { from } = this.props.location.state || { from: { pathname: "/projects" } };
		const { redirectToPreviousRoute } = this.state;

		if (redirectToPreviousRoute || Authentication.isAuthenticated()) {
			return <Redirect to={from} />;
		}

        return(
			<div className={classes.wrapper}>
				<Grid container className={classes.content}>
					<Grid item xs={10} sm={4} xl={2}>
					<Typography variant="h3" align="center">
						LifeAtDe
					</Typography>
					<Formik
						initialValues={FORM_VALUES}
						onSubmit={this.handleSubmit}
						validationSchema={validationSchema}
						validateOnBlur
						render={props =>
							<form onSubmit={props.handleSubmit}>
								<TextField
									id="email"
									type="email"
									label="Email"
									onChange={props.handleChange}
									onBlur={props.handleBlur}
									value={props.values.email}
									helperText={props.touched.email ? props.errors.email : null}
									error={props.errors.email && props.touched.email}
									className={classes.textField}
									margin="dense"
									variant="outlined"
								/>
								<TextField
									id="password"
									type={this.state.showPassword ? 'text' : 'password'}
									label="Password"
									onChange={props.handleChange}
									onBlur={props.handleBlur}
									value={props.values.password}
									helperText={props.touched.password ? props.errors.password : null}
									error={props.errors.password && props.touched.password}
									className={classes.textField}
									margin="dense"
									variant="outlined"
									InputProps={{
										endAdornment: (
										<InputAdornment position="end">
											<IconButton
												type="button"
												aria-label="Toggle password visibility"
												onClick={this.handleClickShowPassword}
											>
												{this.state.showPassword ? <VisibilityOff /> : <Visibility />}
											</IconButton>
										</InputAdornment>
										),
									}}
								/>
								<Button
									variant="contained"
									color="primary"
									className={classes.button}
									type="submit"
								>
									Login
									<School className={classes.rightIcon} />
								</Button>
							</form>
						}
					/>
					</Grid>
				</Grid>
				<Footer />
			</div>
        )
    }
}

const styles = theme => ({
	wrapper: {
		display: 'flex',
		flex: 1,
		flexDirection: 'column'
	},
	content: {
		display: 'flex',
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		minHeight: '250px'
	},
	form: {
		flexWrap: 'wrap',
		flexDirection: 'column',
	},
	textField: {
		width: '100%',
	},
	button: {
		width: '100%',
		marginTop: theme.spacing.unit
	},
	rightIcon: {
		marginLeft: theme.spacing.unit
	}
});

export default withSnackbar(withStyles(styles)(Login));