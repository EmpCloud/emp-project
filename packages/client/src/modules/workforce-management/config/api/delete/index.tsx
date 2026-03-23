import axios from 'axios';
import { apiAuthenticationHeader } from '@HELPER/function';
import Cookies from 'js-cookie';
export const deleteAllTaskType = async function () {
    return await axios.delete(process.env.TASK_API + '/task-type/delete', {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};
export const deleteTaskTypeById = async function (id) {
    return await axios.delete(process.env.TASK_API + '/task-type/delete?id=' + id, {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};
export const deleteAllStatus = async function () {
    return await axios.delete(process.env.TASK_API + '/task-status/delete', {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};
export const deleteStatusById = async function (id) {
    return await axios.delete(process.env.TASK_API + '/task-status/delete?id=' + id, {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};
export const deleteTaskCategoryById = async function (id) {
    return await axios.delete(process.env.TASK_API + '/task-category/delete?id=' + id, {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};
export const deleteTaskCategory = async function () {
    return await axios.delete(process.env.TASK_API + '/task-category/delete', {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};
export const deleteTaskStageById = async function (id) {
    return await axios.delete(process.env.TASK_API + '/task-stage/delete?id=' + id, {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};
export const deleteTaskStage = async function () {
    return await axios.delete(process.env.TASK_API + '/task-stage/delete', {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};
