import axios from 'axios';
import { apiAuthenticationHeader } from '@HELPER/function';
import Cookies from 'js-cookie';

export const updateProject = async function (id: number, data: any) {
    return await axios.put(process.env.PROJECT_API + '/project/update/' + id, data, {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};
export const updateProjectStatus = async function (statusValue: any, ProjectId: string) {
    try {
        return await axios.put(process.env.PROJECT_API + '/project/update/' + ProjectId, 
            statusValue,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': Cookies.get('token'),
                },
            });
    } catch (error) {
        return error;
    }
};
export const updateDate = async function (statusValue: any, ProjectId: string) {
    try {
        return await axios.put(process.env.PROJECT_API + '/project/update/' + ProjectId, 
            statusValue,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': Cookies.get('token'),
                },
            });
    } catch (error) {
        return error;
    }
};
export const updateProjectassingedTo = async function (assignedValue: any, projectId: string) {
    return await axios.put(
        process.env.PROJECT_API + '/project/update/' + projectId,
        {
            userAssigned: assignedValue

        },
        {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': Cookies.get('token'),
            },
        }
    );
}; 
export const updateCommentApi = async function (id: any, data: any,) {
    let commenValue = {
        comment: data,
    }
    let dataValue = JSON.stringify(commenValue);
    let config = {
        method: 'put',
        maxBodyLength: Infinity,
        url: process.env.PROJECT_API + '/project/comment-update?commentId=' + id,
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
        data: dataValue,
    }
    let response = await axios.request(config)
    return response?.data ? response?.data : null
}
export const updateScreenConfig = async function (data) {
    return await axios.put(process.env.PROJECT_API + '/table-config/update-default-config',data, {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};