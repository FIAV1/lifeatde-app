import React, { Component } from 'react';

import { Avatar } from '@material-ui/core';
import Api from '../../lib/Api';
import Loader from './Loader';

import { getInitials } from '../../lib/Utils';

export default class AsyncAvatar extends Component {
    state = {
        loading: true,
        url: null,
    }

    componentDidMount() {
        const avatar = this.props.user.attributes.avatar;

        if (avatar) {
            Api.download(avatar.url).then(response => {
                this.setState({
                    loading: false,
                    url: response
                });
            }).catch(() => {
                this.setState({loading: false});
            });
        } else {
            this.setState({loading: false});
        }
    }

    componentWillReceiveProps(nextProps) {
        const oldAvatar = this.props.user.attributes.avatar;
        const newAvatar = nextProps.user.attributes.avatar;

        if (oldAvatar && newAvatar) {
            if (oldAvatar.id !== newAvatar.id) {
                Api.download(newAvatar.url).then(response => {
                    this.setState({
                        loading: false,
                        url: response
                    });
                }).catch(() => {
                    this.setState({loading: false});
                });
            }
        }
    }

    render() {
        const { user, avatarClass } = this.props;
        const { loading, url } = this.state;

        if (loading) return <Loader />

        return (
            <Avatar
                className={avatarClass}
                alt={`${user.attributes.firstname} ${user.attributes.lastname}`}
                src={url}
            >
                {getInitials(user.attributes.firstname, user.attributes.lastname)}
            </Avatar>
        )
    }
}
    