import React, { Component } from 'react';

import {
    withStyles,
    Grid,
    Typography,
    IconButton,
} from '@material-ui/core';

import PhoneIcon from '@material-ui/icons/Phone';
import EmailIcon from '@material-ui/icons/Email';


class ContactInfo extends Component {

    render() {

        const { classes, phone, email, admin } = this.props;
        
        return(
            <Grid container>
                <Grid item xs={12}>
                    <Typography variant="overline">Contatta {admin ? "l'amministratore" : "l'utente"}</Typography>
                </Grid>
                {
                   phone
                        ?
                        <Grid item xs={12}>
                            <IconButton href={`tel:${phone}`} aria-label="telefono">
                                <PhoneIcon />
                            </IconButton>
                            <Typography variant="subtitle1" noWrap className={classes.contactInfo}>{`${phone}`}</Typography>
                        </Grid>
                        : null
                }
                <Grid item xs={12}>
                    <IconButton href={`mailto:${email}`} aria-label="email">
                        <EmailIcon />
                    </IconButton>
                    <Typography variant="subtitle1" noWrap className={classes.contactInfo}>{`${email}`}</Typography>
                </Grid>
            </Grid>
        );
    }
}
const styles = theme => ({
    contactInfo: {
        display: 'inline-flex',
        [theme.breakpoints.down('xs')]: {
            display: 'block',
            paddingLeft: '12px',
        }
    }
});

export default withStyles(styles)(ContactInfo);