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
}

const getInitials = (firstName, lastName) => {
    let fn = firstName.split(' ').map(name => name.charAt(0)).join('');
    let ln = lastName.split(' ').map(name => name.charAt(0)).join('');
    return fn+ln;
}

export {
    getStatusColor,
    getInitials
}