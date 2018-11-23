import React, { Component } from 'react'

import Api from '../lib/Api';
import LocalStorage from '../lib/LocalStorage';
import { formDataSerializer } from '../lib/Utils';

import {
    withStyles,
    Grid,
    Typography,
    Paper,
    InputBase,
    Button,
} from '@material-ui/core';
import { withSnackbar } from 'notistack';
import Loader from '../components/common/Loader';
import Tabs from '../components/user/Tabs';
import Autocomplete from '../components/common/Autocomplete';
import AsyncAvatar from '../components/common/AsyncAvatar';
import Moment from 'react-moment';
import 'moment/locale/it';

import CakeIcon from '@material-ui/icons/Cake';
import PhoneIcon from '@material-ui/icons/Phone';
import EmailIcon from '@material-ui/icons/Email';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import SchoolIcon from '@material-ui/icons/School';

class UserProfile extends Component {
    state = {
        loading: true,
        user: null,
        course: null,
        categories: null,
        errors: [],
    }

    componentDidMount() {
        Api.get(`/users/${this.props.match.params.id}`).then(response => {
            document.title = `LifeAtDe | ${response.data.attributes.firstname} ${response.data.attributes.lastname}`;
            this.setState({
                user: response.data,
                categories: response.included.filter(element => element.type === 'category').map(category => ({ value: parseInt(category.id, 10), label: category.attributes.name})),
                course: response.included.find(element => element.type === 'course'),
                loading: false,
            });
        }).catch(({errors}) => {
            errors.forEach(error => this.props.enqueueSnackbar(error.detail, {variant: 'error'}));
        }).finally(() => {
            this.setState({loading: false});
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.match.params.id !== this.props.match.params.id) {
            this.setState({loading: true});
            Api.get(`/users/${nextProps.match.params.id}`).then(response => {
                document.title = `LifeAtDe | ${response.data.attributes.firstname} ${response.data.attributes.lastname}`;
                this.setState({
                    user: response.data,
                    categories: response.included.filter(element => element.type === 'category').map(category => ({ value: parseInt(category.id, 10), label: category.attributes.name})),
                    course: response.included.find(element => element.type === 'course'),
                });
            }).catch(({errors}) => {
                errors.forEach(error => this.props.enqueueSnackbar(error.detail, {variant: 'error'}));
            }).finally(() => {
                this.setState({loading: false});
            });
        }
    }

    handleAutocomplete = name => value => {
        let params = {
            user: {
                categories: value.map(el => el.value)
            }
        }

        Api.put(`/users/${this.state.user.id}`, params).then(response => {
            this.setState({
                [name]: value,
            });
            let event = new CustomEvent('updateProfile', { detail: response });
            window.document.dispatchEvent(event);
            response.meta.messages.forEach(message => this.props.enqueueSnackbar(message, {variant: 'success'}));
        }).catch(({errors}) => {
            errors.forEach(error => this.props.enqueueSnackbar(error.detail, {variant: 'error'}));
        });
    };

    handleChange = value => event => {
        let user = this.state.user;
        user.attributes[value] = event.target.value;
        this.setState({ user });
    }

    handleBlur = value => event => {
        let params = {
            user: {
                [value]: event.target.value,
                categories: this.state.categories.map(category => category.value),
            }
        };

        Api.put(`/users/${this.state.user.id}`, params).then(response => {
            this.setState({
                user: response.data,
            });
            let event = new CustomEvent('updateProfile', { detail: response });
            window.document.dispatchEvent(event);
            response.meta.messages.forEach(message => this.props.enqueueSnackbar(message, {variant: 'success'}));
        }).catch(({errors}) => {
            errors.forEach(error => this.props.enqueueSnackbar(error.detail, {variant: 'error'}));
        });
    }

    handleFileChange = event => {
        let formData = new FormData();

        let params = {
            avatar: event.target.files[0],
            categories: this.state.categories.map(category => category.value),
        }

        formData = formDataSerializer('user', params, formData);

        Api.put(`/users/${this.state.user.id}`, formData).then(response => {
            this.setState({
                user: response.data
            });
            let event = new CustomEvent('updateProfile', { detail: response });
            window.document.dispatchEvent(event);
            response.meta.messages.forEach(message => this.props.enqueueSnackbar(message, {variant: 'success'}));
        }).catch(({errors}) => {
            errors.forEach(error => this.props.enqueueSnackbar(error, {variant: 'error'}));
        })
    }

    render() {
        const { loading, user, categories, course, errors } = this.state;
        const { classes } = this.props;

        if (loading) return <Loader />

        const authUserProfile = LocalStorage.get('user').data.id === user.id;

        return (
            <div>
                <Grid container alignItems="center" justify="center" spacing={16}>
                    <Grid item xs={6} sm={5} md={4} lg={3} xl={2}>
                        { authUserProfile ? <input
                            className={classes.input}
                            id="upload-file-button"
                            type="file"
                            onChange={this.handleFileChange}
                        /> : null}
                        <div className={classes.avatarWrapper}>
                            <AsyncAvatar
                                avatarClass={classes.avatar}
                                user={user}
                            />
                        </div>
                        { authUserProfile ? <Button
                            type="button"
                            component="label"
                            htmlFor="upload-file-button"
                            fullWidth
                        >
                            Modifica
                        </Button> : null }
                    </Grid>
                    <Grid item xs={12} sm={7} md={8} lg={9} xl={10}>
                        <Paper className={classes.paper}>
                            <Typography variant="h5" align="center" noWrap gutterBottom>{user.attributes.firstname} {user.attributes.lastname}</Typography>
                            <div className={classes.bioWrapper}>
                                <AccountCircleIcon className={classes.bioIcon} />
                                { authUserProfile ? <InputBase className={classes.bio} type="text" onBlur={this.handleBlur('bio')} onChange={this.handleChange('bio')} value={user.attributes.bio} multiline />
                                : <Typography className={classes.bio} variant="body1" align="justify" gutterBottom>{user.attributes.bio}</Typography> }
                            </div>
                            <Typography variant="body1" gutterBottom noWrap><SchoolIcon className={classes.icon} />{course.attributes.name}</Typography>
                            <Typography variant="body1" gutterBottom noWrap><EmailIcon className={classes.icon} />{user.attributes.email}</Typography>
                            { authUserProfile 
                                ? <div className={classes.phone}>
                                    <PhoneIcon className={classes.icon} />
                                    <InputBase type="number" max="15" onBlur={this.handleBlur('phone')} onChange={this.handleChange('phone')} value={user.attributes.phone} />
                                </div>
                                : <Typography variant="body1" gutterBottom noWrap><PhoneIcon className={classes.icon} />{user.attributes.phone}</Typography>}
                            <Typography variant="body1" gutterBottom noWrap><CakeIcon className={classes.icon} /><Moment parse="YYYY-MM-DD HH:mm" locale="it" format="LL" >{user.attributes.birthday}</Moment></Typography>
                            { authUserProfile ? <Autocomplete
                                label="Categorie"
                                name="categories"
                                endpoint="/categories"
                                values={categories}
                                handleAutocomplete={this.handleAutocomplete}
                                errors={errors}
                            /> : null }
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Tabs userId={user.id} />
                    </Grid>
                </Grid>
            </div>
        )
    }
}

const styles = theme => ({
    avatarWrapper: {
        position: 'relative',
        width: '100%',
        paddingBottom: '100%',
        borderRadius: '50%',
        marginBottom: theme.spacing.unit,
    },
    input: {
        display: 'none',
    },
    buttonLabel: {
        display: 'none',
        position: 'absolute',
        top: 'calc(50% - 12px)',
        zIndex: 1,
        '&:hover': {
            display: 'block',
            backgroundColor: 'white',
        }
    },
    avatar: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        margin: '0 auto',
        top: 0,
        left: 0,
    },
    paper: {
        padding: theme.spacing.unit * 2,
    },
    bioWrapper: {
        display: 'flex',
        justifyContent: 'stretch',
        position: 'relative',
        border: '1px dashed',
        borderColor: theme.palette.text.primary,
        borderRadius: theme.spacing.unit,
        padding: theme.spacing.unit,
        marginBottom: theme.spacing.unit * 2,
    },
    bio: {
        width: '100%',
    },
    editor: {
        color: theme.palette.text.primary,
    },
    bioIcon: {
        position: 'absolute',
        top: '-12px',
        left: '-12px',
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.background.paper,
    },
    phone: {
        display: 'flex',
        color: theme.palette.text.primary,
    },
    icon: {
        marginRight: theme.spacing.unit,
    },
});

export default withSnackbar(withStyles(styles)(UserProfile));