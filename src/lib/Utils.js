import green from '@material-ui/core/colors/green';
import blue from '@material-ui/core/colors/blue';
import red from '@material-ui/core/colors/red';

const getStatusColor = status => {
    if(status === 'Aperto') {
        return green[700];
    }

    if(status === 'Chiuso') {
        return blue[700];
    }

    if(status === 'Terminato') {
        return red[700];
    }
};

const getInitials = (firstName, lastName) => {
    return firstName.charAt(0)+lastName.charAt(0)
};

export {
    getStatusColor,
    getInitials
}