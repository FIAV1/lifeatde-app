import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';

import {
	withStyles,
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

class Login extends Component {
	state = {
		email: '',
		password: '',
		showPassword: false,
		redirectToPreviousRoute: false,
	};

	handleChange = prop => event => {
		this.setState({ [prop]: event.target.value });
	};
	
	handleClickShowPassword = () => {
		this.setState(state => ({ showPassword: !state.showPassword }));
	};

	handleSubmit = event => {
		event.preventDefault();

		let credentials = {
			email:this.state.email,
			password: this.state.password
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
						<ValidatorForm
							className={classes.form}
							ref="form"
							onSubmit={this.handleSubmit}
						>
							<Typography variant="h3" align="center">
								LifeAtDe
							</Typography>
							<TextValidator
								label="Email"
								className={classes.textField}
								type="email"
								name="email"
								margin="dense"
								variant="outlined"
								value={this.state.email}
								onChange={this.handleChange('email')}
								validators={['required', 'isEmail']}
								errorMessages={['Questo campo è richiesto', 'Email non valida']}
							/>
							<TextValidator
								label="Password"
								name="password"
								className={classes.textField}
								type={this.state.showPassword ? 'text' : 'password'}
								margin="dense"
								variant="outlined"
								value={this.state.password}
								onChange={this.handleChange('password')}
								validators={['required']}
								errorMessages={['Questo campo è richiesto']}
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
						</ValidatorForm>
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