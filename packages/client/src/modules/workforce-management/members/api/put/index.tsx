import axios from 'axios';
import { apiAuthenticationHeader } from '@HELPER/function';
import Cookies from 'js-cookie';

export const updateMember = async function (id, key, type) {
    return await axios.put(process.env.PROJECT_API + '/user/update?userId=' + id, 
    type === 'role' ? { role: key } : { permission: key }, {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};
export const updateMemberApi = async function (id, data) {
    return await axios.put(process.env.PROJECT_API + '/user/update?userId=' + id, data, {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};
export const restoreMemberById = async function (id) {
    return await axios.put(process.env.PROJECT_API + '/user/restore-users?userId=' + id,{},
    {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};
export const unblockMemberById = async function (id,data) {
    return await axios.put(process.env.PROJECT_API + '/user/user-suspend?userId=' + id,data,
    {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};
export const editRoleApi = async function (id,data) {
    return await axios.put(process.env.PROJECT_API + '/role/update?roleId=' + id,data,
    {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};
export const editClientCompany = async function (id,data) {
    return await axios.put(process.env.PROJECT_API + '/client/update-client?clientId=' + id,data,
    {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};
export const editCompanyDetails = async function (id,data) {
    return await axios.put(process.env.PROJECT_API + '/client/update-company?companyId=' + id,data,
    {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};
export const suspendedMember = async function (id, data) {
    return await axios.put(process.env.PROJECT_API + '/user/user-suspend?userId=' + id, data, {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};
