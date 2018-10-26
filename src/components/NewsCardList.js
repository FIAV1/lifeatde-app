import React, { Component } from 'react';

import { Grid, Typography } from '@material-ui/core';

import NewsCard from '../components/NewsCard';

class NewsCardList extends Component {

    render() {

        const { newsList } = this.props;
        
        if(!newsList || newsList.length === 0) {
            return(
                <Typography variant="subheading">
                    Non ci sono news da visualizzare.
                </Typography>
            )
        }

        return(
            <Grid container spacing={16}>
                {
                   newsList.map((news) => <NewsCard key={news.id} news={news} />)
                }
            </Grid>
        )
    }
}

export default (NewsCardList);
