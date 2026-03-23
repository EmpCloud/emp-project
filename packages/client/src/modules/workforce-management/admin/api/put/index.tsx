import Cookies from 'js-cookie';
import axios from 'axios';

export const editProfile = async function (data) {
    return await axios.put(process.env.PROJECT_API + '/admin/update', data, {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};
export const editUserProfile = async function (data,id) {
    return await axios.put(process.env.PROJECT_API + '/user/update-profile?userId='+id, data, {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};

export const changeAdminPassword = async function(data){
    return await axios.put(process.env.PROJECT_API + '/admin/update-password', data,{
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    } )
}
export const changeUserPassword = async function(data){
    return await axios.put(process.env.PROJECT_API + '/user/update-password', data,{
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    } )
}
