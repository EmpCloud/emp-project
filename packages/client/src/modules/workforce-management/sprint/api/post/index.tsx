import axios from 'axios';
import Cookies from 'js-cookie';

const headers = () => ({
    'Content-Type': 'application/json',
    'x-access-token': Cookies.get('token'),
});

export const createSprint = async function (data: {
    projectId: string;
    name: string;
    goal?: string;
    startDate: string;
    endDate: string;
}) {
    try {
        return await axios.post(
            process.env.PROJECT_API + '/sprint/create',
            data,
            { headers: headers() }
        );
    } catch (error) {
        return error;
    }
};

export const startSprint = async function (sprintId: string) {
    try {
        return await axios.post(
            process.env.PROJECT_API + '/sprint/' + sprintId + '/start',
            {},
            { headers: headers() }
        );
    } catch (error) {
        return error;
    }
};

export const completeSprint = async function (sprintId: string, moveToSprintId?: string) {
    try {
        return await axios.post(
            process.env.PROJECT_API + '/sprint/' + sprintId + '/complete',
            { moveToSprintId },
            { headers: headers() }
        );
    } catch (error) {
        return error;
    }
};

export const addTaskToSprint = async function (sprintId: string, taskId: string) {
    try {
        return await axios.post(
            process.env.PROJECT_API + '/sprint/' + sprintId + '/tasks',
            { taskId },
            { headers: headers() }
        );
    } catch (error) {
        return error;
    }
};
