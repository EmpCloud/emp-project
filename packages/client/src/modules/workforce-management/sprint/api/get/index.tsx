import axios from 'axios';
import Cookies from 'js-cookie';

const headers = () => ({
    'Content-Type': 'application/json',
    'x-access-token': Cookies.get('token'),
});

export const getSprintsByProject = async function (projectId: string) {
    try {
        return await axios.get(
            process.env.PROJECT_API + '/sprint/fetch?projectId=' + projectId,
            { headers: headers() }
        );
    } catch (error) {
        return error;
    }
};

export const getSprintDetail = async function (sprintId: string) {
    try {
        return await axios.get(
            process.env.PROJECT_API + '/sprint/' + sprintId,
            { headers: headers() }
        );
    } catch (error) {
        return error;
    }
};

export const getBacklog = async function (projectId: string) {
    try {
        return await axios.get(
            process.env.PROJECT_API + '/sprint/backlog?projectId=' + projectId,
            { headers: headers() }
        );
    } catch (error) {
        return error;
    }
};

export const getVelocityChart = async function (projectId: string) {
    try {
        return await axios.get(
            process.env.PROJECT_API + '/sprint/velocity?projectId=' + projectId,
            { headers: headers() }
        );
    } catch (error) {
        return error;
    }
};

export const getBurndownData = async function (sprintId: string) {
    try {
        return await axios.get(
            process.env.PROJECT_API + '/sprint/' + sprintId + '/burndown',
            { headers: headers() }
        );
    } catch (error) {
        return error;
    }
};
