import React, { Component } from 'react';

import { Grid, Typography } from '@material-ui/core';

import NewsCard from '../components/NewsCard';

class NewsCardList extends Component {

    render() {

        const {news_list} = this.props;
        
        if(!news_list || news_list.length === 0) {
            return(
                <Typography variant="subheading">
                    Non ci sono news da visualizzare.
                </Typography>
            )
        }

        return(
            <Grid container spacing={16}>
                {
                   news_list.map((news) => <NewsCard key={news.id} news={news} />)
                }
            </Grid>
        )
    }
}


export default (NewsCardList);
