import green from '@material-ui/core/colors/green';
import blue from '@material-ui/core/colors/blue';
import red from '@material-ui/core/colors/red';
import yellow from '@material-ui/core/colors/yellow';
import purple from '@material-ui/core/colors/purple';
import orange from '@material-ui/core/colors/orange';
import indigo from '@material-ui/core/colors/indigo';
import brown from '@material-ui/core/colors/brown';




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

const getCourseColor = course => {
    if(course === 'Ingegneria Elettronica e Informatica') {
        return yellow[700];
    }

    if(course === 'Ingegneria Meccanica LT') {
        return red[700];
    }

    if(course === 'Ingegneria Civile e Ambientale') {
        return green[700];
    }

    if(course === 'Ingegneria Elettronica e delle Telecomunicazioni') {
        return purple[700];
    }

    if(course === 'Ingegneria Informatica e dell\' Automazione') {
        return blue[700];
    }

    if(course === 'Ingegneria Civile') {
        return brown[700];
    }

    if(course === 'Ingegneria Meccanica LM') {
        return orange[700];
    }
};

const getInitials = (firstName, lastName) => {
    return firstName.charAt(0)+lastName.charAt(0)
};

export {
    getStatusColor,
    getCourseColor,
    getInitials
}