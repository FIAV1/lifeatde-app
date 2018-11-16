import green from '@material-ui/core/colors/green';
import blue from '@material-ui/core/colors/blue';
import red from '@material-ui/core/colors/red';
import yellow from '@material-ui/core/colors/yellow';
import purple from '@material-ui/core/colors/purple';
import orange from '@material-ui/core/colors/orange';
import blueGrey from '@material-ui/core/colors/blueGrey';

const getStatusColor = status => {
    switch (status) {

        case 'Aperto':
            return green[700];

        case 'Chiuso':
            return blue[700]; 
            
        case 'Terminato':
            return red[700];
        default:
            break;
    }
};

const getCourseColor = course => {
    switch (course) {

        case 'Ingegneria Elettronica e Informatica':
            return yellow[700];

        case 'Ingegneria Meccanica LT':
            return red[700];

        case 'Ingegneria Civile e Ambientale':
            return green[700];

        case 'Ingegneria Elettronica e delle Telecomunicazioni':
            return purple[700];

        case 'Ingegneria Informatica e dell\' Automazione':
            return blue[700];

        case 'Ingegneria Civile':
            return blueGrey[700];

        case 'Ingegneria Meccanica LM':
            return orange[700];
        default:
            break;
    }
};

const createPhotoTiles = (photos, limit = null) => {
    if (photos && limit) {
        photos = photos.slice(0, limit)
    }

    if (photos) {
        return photos.map((photo, index, array) => {
            let cols = 1;
            switch (array.length % 3) {
                case 0:
                    cols = 1;
                    break;
                case 1:
                    index === array.length - 1 ? cols = 3 : cols = 1;
                    break;
                case 2:
                    index === array.length - 2 ? cols = 2 : cols = 1;
                    break;
                default:
                    break;
            }

            return {
                id: photo.id,
                activeStorageUrl: photo.url,
                fileUrl: null,
                cols: cols,
                loading: true
            }
        });
    } else {
        return [];
    }
};

const getInitials = (firstName, lastName) => {
    return firstName.charAt(0)+lastName.charAt(0)
};

export {
    getStatusColor,
    getCourseColor,
    getInitials,
    createPhotoTiles
}