import React, { Component } from 'react';
import Api from '../lib/Api';

import {
    withStyles,
    CircularProgress,
    Typography,
    Button,
    Chip,
    Divider,
    Grid
} from '@material-ui/core';

import AddIcon from '@material-ui/icons/Add';
import FilterListIcon from '@material-ui/icons/FilterList';

import LocalStorage from '../lib/LocalStorage';
import Notifier, { showNotifier } from '../components/Notifier';

import NewsCardList from '../components/NewsCardList';

class NewsCardsContainer extends Component {

    state = {
        loading: true,
        course: LocalStorage.get('user').included[3],
        news: null,
    }

    componentDidMount() {
        document.title =  'LifeAtDe | News'

        Api.get('/courses/'+ this.state.course.id + '/news').then(response =>{
            this.setState({
                news: response.data,
                loading: false
            })
        }).catch(({errors}) => {
            showNotifier({ messages: errors, variant: 'error' });
        });
    }

    render() {

        const {loading, news, course} = this.state;
        const {classes} = this.props;
        console.log(course.attributes.name)
        console.log(course.id)


        if(loading) {
            return <CircularProgress size={80} color='primary'/>
        }

        return (
            <div id="news-cards-container">
                <Grid container justify='space-between'>
                    <Grid item >
                        <Typography className={classes.header} component="h1" variant="display1" xs={12} md={6} xl={4}>
                            News
                        </Typography>
                    </Grid>
                    <Grid item className={classes.item} xs={12} sm={"auto"}>
                        <Chip  classes={{
                            root: classes.chipRoot,
                            label: classes.chipLabel
                        }} 
                        key={course.id} 
                        label={
                            <Typography  variant='body1' noWrap>Ingegneria Elettronica e delle Telecomunicazioni</Typography>
                        }
                        />
                    </Grid>
                </Grid>
                <Divider className={classes.hr} />
                <NewsCardList news_list={news}/>
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