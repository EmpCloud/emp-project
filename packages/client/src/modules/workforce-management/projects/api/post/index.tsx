import axios from 'axios';
import Cookies from 'js-cookie';
export const createProjectApi = async function (data) {
    return await axios.post(process.env.PROJECT_API + '/project/create', data, {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};
export const filterProjectApi = async function (condition, data) {
    return await axios.post(process.env.PROJECT_API + '/project/filter'+condition, data, {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};
export const updateConfigFields = async function (data) {
    return await axios.post(process.env.PROJECT_API + '/admin-config/fields/view/update', data, {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};
export const filterActivityApi = async function (data = '') {
    return await axios.post(process.env.PROJECT_API + '/activity/filter', data, {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};
export const createCommentApi = async function (data: any, id: any) {
    let dataValue = JSON.stringify(data);
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: process.env.PROJECT_API + '/project/comment-post?projectId=' + id,
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
        data: dataValue,
    }

    let response = await axios.request(config)
    return response?.data ? response?.data : null

}
export const createReplyCommentApi = async function (data: any, id: any) {
    let dataValue = JSON.stringify(data);
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: process.env.PROJECT_API + '/project/comment-reply?commentId=' + id,
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
        data: dataValue,
    }

    let response = await axios.request(config)
    return response?.data ? response?.data : null

}
