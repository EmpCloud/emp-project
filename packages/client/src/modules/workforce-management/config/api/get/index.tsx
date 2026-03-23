import axios from 'axios';
import { apiAuthenticationHeader } from '@HELPER/function';
import Cookies from 'js-cookie';

export const getAllTaskType = async function () {
    return await axios.get(process.env.TASK_API + `/task-type/fetch?limit=${process.env.TOTAL_USERS}`, {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};
export const getAllStatus = async function () {
    return await axios.get(process.env.TASK_API + `/task-status/fetch?limit=${process.env.TOTAL_USERS}`, {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};
export const getAllCategory = async function () {
    return await axios.get(process.env.TASK_API + `/task-category/get?limit=${process.env.TOTAL_USERS}`, {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};
export const getAllStages = async function () {
    return await axios.get(process.env.TASK_API + `/task-stage/get?limit=${process.env.TOTAL_USERS}`, {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};
export const searchTaskType = async function (condition = '') {
    return await axios.get(process.env.TASK_API + '/task-type/search' + condition, {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};
export const searchStatus = async function (condition = '') {
    return await axios.get(process.env.TASK_API + '/task-status/search' + condition, {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};
export const searchCategory = async function (condition = '') {
    return await axios.get(process.env.TASK_API + '/task-category/search' + condition, {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};
export const searchStages = async function (condition = '') {
    return await axios.get(process.env.TASK_API + '/task-stage/search' + condition, {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};
export const getAllShortcutKeys = async function () {
    return await axios.get(process.env.PROJECT_API + '/shortcut-key/get', {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};
export const getSearchDefault = async function (category, keyword) {
    return await axios.get(process.env.TASK_API + '/task/search-default-values?category=' + category + '&keyword=' + keyword, {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};
