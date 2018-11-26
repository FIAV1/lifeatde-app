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

const intToBytes = (bytes,decimals) => {
    if(bytes === 0) return '0 Bytes';
    let k = 1024,
        dm = decimals <= 0 ? 0 : decimals || 2,
        sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

const bytesToSize = (bytes) => {
    let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Bytes';
    let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
 };

const formDataSerializer = (prefix, object, formData) => {
    let result = '';
    
    if (object) {
        Object.keys(object).forEach(key => {
            if (typeof object[key] === 'object' && !Array.isArray(object[key]) && !object[key] instanceof File) {
                result += formDataSerializer(`${prefix}[${key}]`, object[key]);
            } else {
                if (Array.isArray(object[key])) {
                    if (object[key].length > 0) {
                        result += `${prefix}[${key}][]`;
                        object[key].forEach(el => {
                            formData.append(result, el);
                        });
                    }
                } else {
                    result += `${prefix}[${key}]`;
                    formData.append(result, object[key]);
                }
                result = '';
            }
        });
    }
    
    return formData;
};

const encodeSearchString = (prefix, object) => {
    let params = [];

    if (object) {
        Object.keys(object).forEach(key => {
            if (typeof object[key] === 'object' && !Array.isArray(object[key])) {
                encodeSearchString(`${prefix}[${key}]`, object[key]);
            } else {
                if (Array.isArray(object[key])) {
                    if (object[key].length > 0) {
                        let result = '';
                        object[key].forEach((el, index) => {
                            if (index > 0) {
                                result += '&';
                            }
                            result += `${prefix}[${key}][]=${el}`;
                        });
                        params.push(result);
                    }
                } else {
                    params.push(`${prefix}[${key}]=${object[key]}`);
                }
            }
        });
    }

    return params.join('&');
}

const getError = (value, errors) => {
    let temp = errors.find(error => error[value]);

    return temp ? temp[value] : null;
}

export {
    getStatusColor,
    getCourseColor,
    getInitials,
    intToBytes,
    bytesToSize,
    formDataSerializer,
    encodeSearchString,
    getError,
    createPhotoTiles
}