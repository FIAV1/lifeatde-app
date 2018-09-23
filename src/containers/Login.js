import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Authentication from '../lib/Authentication';

import {
	withStyles,
	Typography,
	Grid,
	TextField,
	Button,
	IconButton,
	InputAdornment
} from '@material-ui/core';
import School from '@material-ui/icons/School';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Notifier, { showNotifier } from '../components/Notifier';
import Footer from '../components/Footer';

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

		Authentication.login(this.props.history, credentials).then(user => {
			this.setState({ redirectToPreviousRoute: true });
		}).catch(({errors}) => {
			showNotifier({ message: errors[0].detail, variant: 'error' });
		});
	};

    render() {
		const { classes } = this.props;
		const { from } = this.props.state || { from: { pathname: "/" } };
		const { redirectToPreviousRoute } = this.state;

		if (redirectToPreviousRoute || Authentication.isAuthenticated()) {
			return <Redirect to={from} />;
		}

        return(
			<Grid className={classes.container} container >
				<Grid item xs={10} sm={4} xl={2}>
					<form className={classes.form} noValidate autoComplete="off" onSubmit={this.handleSubmit}>
						<Typography variant="display2" align="center">
							LifeAtDe
						</Typography>
						<TextField
							id="outlined-email-input"
							label="Email"
							className={classes.textField}
							type="email"
							name="email"
							autoComplete="email"
							margin="dense"
							variant="outlined"
							value={this.state.email}
							onChange={this.handleChange('email')}
						/>
						<TextField
							id="outlined-password-input"
							label="Password"
							className={classes.textField}
							type={this.state.showPassword ? 'text' : 'password'}
							autoComplete="current-password"
							margin="dense"
							variant="outlined"
							value={this.state.password}
							onChange={this.handleChange('password')}
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
				</Grid>
				<Footer />
				<Notifier />
			</Grid>
        )
    }
}

const styles = theme => ({
	container: {
		height: '100vh',
		width: '100vw',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center'
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

export default withStyles(styles)(Login);