import Cookies from 'js-cookie';
import axios from 'axios';

export const fetchProfile = async function () {
    return await axios.get(process.env.PROJECT_API + '/profile/fetch', {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};
