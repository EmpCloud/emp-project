import axios from 'axios';
import { OrgId } from '../../../../../helper/exportData';
import { apiAuthenticationHeader } from '@HELPER/function';
import Cookies from 'js-cookie';

export const getAllUsers = async function (condition = '') {
    return await axios.get(process.env.PROJECT_API + '/user/fetch' + condition, {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};
export const getUserStat = async function (id) {
    return await axios.get(process.env.PROJECT_API + '/user/stat?userId=' + id, {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};
export const getUserById = async function (condition) {
    return await axios.get(process.env.PROJECT_API + '/user/fetch' + condition, {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};
export const getAllRoles = async function (condition="") {
    return await axios.get(process.env.PROJECT_API + `/role/fetch?`+condition , {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};
export const getAllRolesBySorting = async function (condition) {
    return await axios.get(process.env.PROJECT_API + `/role/fetch?`+condition, {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};
export const getEmpUsers = async function (condition = '') {
    return await axios.get(process.env.PROJECT_API + '/user/fetch-emp-users' + condition, {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};
export const getUsersByRole = async function () {
    return await axios.get(process.env.PROJECT_API + '/role/fetch/' + OrgId, {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};
export const searchMember = async function (data = '') {
    return await axios.get(process.env.PROJECT_API + '/user/search' + data, {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};
export const searchRole = async function (data = '') {
    return await axios.get(process.env.PROJECT_API + '/role/search' + data, {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};
export const getMembersByRole = async function (condition = '') {
    return await axios.get(process.env.PROJECT_API + '/user/fetch-users-by-roles' + condition, {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};
export const getAllDeletedUsers = async function (condition) {
    return await axios.get(process.env.PROJECT_API + '/user/recoverable-users'+condition , {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};
export const getClientComapny = async function (condition = '') {
    return await axios.get(process.env.PROJECT_API + '/client/fetch-client' + condition, {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};
export const getClientDetails = async function (condition = '') {
    return await axios.get(process.env.PROJECT_API + '/client/fetch-company' + condition, {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};
export const getAllSuspendedUsers = async function (condition) {
    return await axios.get(process.env.PROJECT_API + '/user/fetch/suspend'+condition , {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};