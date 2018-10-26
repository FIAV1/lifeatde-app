import React, { Component } from 'react';
import Api from '../lib/Api';

import {
    withStyles,
    CircularProgress,
    Typography,
    Chip,
    Divider,
    Grid
} from '@material-ui/core';

import LocalStorage from '../lib/LocalStorage';
import Notifier, { showNotifier } from '../components/Notifier';

import NewsCardList from '../components/NewsCardList';

class NewsCardsContainer extends Component {

    state = {
        loading: true,
        news: null,
        course: null,
    }

    componentDidMount() {
        document.title =  'LifeAtDe | News'

        let course = LocalStorage.get('user').included.find( item => item.type === 'course');

        Api.get('/courses/'+ course.id + '/news').then(response =>{
            this.setState({
                news: response.data,
            })
        }).catch(({errors}) => {
            showNotifier({ messages: errors, variant: 'error' });
        });

        this.setState({
            course: course,
            loading: false
        })
    }

    render() {

        const { loading, news, course } = this.state;
        const { classes } = this.props;

        if(loading) {
            return <CircularProgress size={80} color='primary'/>
        }

        return (
            <div id="news-cards-container">
                <Grid container justify='space-between'>
                    <Grid item >
                        <Typography className={classes.header} component="h1" variant="h4" xs={12} md={6} xl={4}>
                            News
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
                        />
                    </Grid>
                </Grid>
                <Divider className={classes.hr} />
                <NewsCardList newsList={news}/>
                <Notifier />
            </div>
        );
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
    }
});

export default withStyles(styles)(NewsCardsContainer);