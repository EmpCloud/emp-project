import axios from 'axios';

import Cookies from 'js-cookie';
export const getTaskById = async function (condition = ' ') {
    try {
        return await axios.get(process.env.TASK_API + '/task/fetch' + condition, {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': Cookies.get('token'),
            },
        });
    } catch (error) {
        return error;
    }
};
export const fetchProfile = async function () {
    return await axios.get(process.env.PROJECT_API + '/profile/fetch', {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};
export const getAllTaskType = async function () {
    return await axios.get(process.env.TASK_API + '/task-type/fetch', {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};
export const getAllStages = async function () {
    return await axios.get(process.env.TASK_API + '/task-stage/get', {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};
export const getAllTask = async function (condition = '') {
    try {
        return await axios.get(process.env.TASK_API + `/task/fetch?${condition}&limit=5000&sort=desc&order=createdAt`, {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': Cookies.get('token'),
            },
        });
    } catch (error) {
        return error;
    }
};
export const getAllDummyTask = async function (data) {
    try {
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: process.env.TASK_API + `/task/filter?limit=5000&sort=desc&order=createdAt`,
            headers: {
                'x-access-token': Cookies.get('token'),
                'Content-Type': 'application/json',
            },
            data:data,
        };
        // fetchData(projectId);
        const response = await axios.request(config);
        return response;
    } catch (error) {
        return error;
    }
};
export const getAllTaskByMemberId = async function (data) {
    try {
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: process.env.TASK_API + `/task/fetch/by-userId`,
            headers: {
                'x-access-token': Cookies.get('token'),
                'Content-Type': 'application/json',
            },
            data:data,
        };
        // fetchData(projectId);
        const response = await axios.request(config);
        return response;
    } catch (error) {
        return error;
    }
};
export const searchMember = async function (data = '') {
    return await axios.get(process.env.PROJECT_API + '/user/search?' + data, {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};
export const getAllProject = async function (condition = '') {
    try {
        return await axios.get(process.env.PROJECT_API + `/project/fetch?orderBy=createdAt&limit=${process.env.TOTAL_USERS}` + condition, {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': Cookies.get('token'),
            },
        });
    } catch (error) {
        return error;
    }
};
export const getAllUsers = async function (condition = '') {
    return await axios.get(process.env.PROJECT_API + '/user/fetch' + condition, {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};
export const getAllUserTasks = async function (condition = '') {
    try {
        return await axios.get(process.env.PROJECT_API + `/user/fetch?userId=${condition}`, {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': Cookies.get('token'),
            },
        });
    } catch (error) {
        return error;
    }
};
export const searchTask = async function (data) {
    try {
        return await axios.get(process.env.TASK_API + '/task/search?limit=5000&sort=desc&order=createdAt' + data, {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': Cookies.get('token'),
            },
        });
    } catch (error) {
        return error;
    }
};
export const getAllSubTask = async function (condition = '') {
    try {
        return await axios.get(process.env.TASK_API + '/subtask/getAll' + condition, {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': Cookies.get('token'),
            },
        });
    } catch (error) {
        return error;
    }
};
export const getTaskStatus = async function (condition = '') {
    try {
        return await axios.get(process.env.TASK_API + `/task-status/fetch?limit=5000` + condition, {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': Cookies.get('token'),
            },
        });
    } catch (error) {
        return error;
    }
};
export const getTaskActivity = async function (id) {
    try {
        return await axios.get(process.env.TASK_API + '/task/activity/get/' + id, {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': Cookies.get('token'),
            },
        });
    } catch (error) {
        return error;
    }
};
export const searchSubTask = async function (data) {
    try {
        return await axios.get(process.env.TASK_API + '/subtask/search?' + data, {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': Cookies.get('token'),
            },
        });
    } catch (error) {
        return error;
    }
};
export const getSubTaskActivity = async function (id) {
    try {
        return await axios.get(process.env.TASK_API + '/subtask/get-activity/' + id, {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': Cookies.get('token'),
            },
        });
    } catch (error) {
        return error;
    }
};
export const getTaskLables = async function () {
    try {
        return await axios.get(process.env.TASK_API + '/task-category/get', {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': Cookies.get('token'),
            },
        });
    } catch (error) {
        return error;
    }
};
export const getActivity = async function (condition = '') {
    return await axios.get(process.env.PROJECT_API + '/activity/fetch' + condition, {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};
export const searchtActivity = async function (data = '') {
    return await axios.get(process.env.PROJECT_API + '/activity/search' + data, {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};

export const getCommentsApi = async function (condition = '') {
    let dataValue = '';
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: process.env.TASK_API + '/task/comment/get' + condition,
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
        data: dataValue,
    };

    let response = await axios.request(config);
    return response?.data ? response?.data : null;
};
