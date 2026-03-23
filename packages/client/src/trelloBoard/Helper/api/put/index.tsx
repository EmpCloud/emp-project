import axios from 'axios';
import Cookies from 'js-cookie';
import toast from '../../../../components/Toster';

export const updateTask = async function (id: number, data: any) {
    return await axios.put(process.env.TASK_API + '/task/update/' + id, data, {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};
export const updateTaskPriority = async function (priorityValue: any, taskId: string) {
    return await axios.put(
        process.env.TASK_API + '/task/update/' + taskId,
        {
            priority: priorityValue,
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': Cookies.get('token'),
            },
        }
    );
};

export const updateTaskStatus = async function (data: any, taskId: any,performDataFetch:any,projectId:any) {
    try {
        let config = {
            method: 'put',
            maxBodyLength: Infinity,
            url: process.env.TASK_API + `/task/update/${taskId}`,
            headers: {
                'x-access-token': Cookies.get('token'),
                'Content-Type': 'application/json',
            },
            data: data,
        };
        // fetchData(projectId);
        const response = await axios.request(config);
        return response
    } catch (error) {
        
        if (error?.response) {
            toast({
                type: 'error',
                message: error ? error.response.data.body.status : 'Try again !',
            });
            performDataFetch();
        } else if (error.request) {
            // The request was made but no response was received
            toast({
                type: 'warn',
                message: error ? error.response.data.body.status : 'Try again !',
            });
            console.log('No response received:', error.request);
        } else {
            toast({
                type: 'warn',
                message: error ? error?.response?.data?.body?.status : 'Try again !',
            });
            console.log(error);
            
            // Something happened in setting up the request that triggered an Error
            console.log('Error:', error.message);
        }
        throw error; // Re-throw the error if needed
    }
};

export const UpdateSubTaskStatusById = async function (statusValue: any, taskId: string, updateCardValues: any) {
    let data = JSON.stringify({
        subTaskStatus: statusValue,
    });

    try {
        let config = {
            method: 'put',
            maxBodyLength: Infinity,
            url: process.env.TASK_API + `/subtask/update/${taskId}`,
            headers: {
                'x-access-token': Cookies.get('token'),
                'Content-Type': 'application/json',
            },
            data: data,
        };
        const response = await axios.request(config);
        return response.data; // Return the response data or whatever is relevant to your use case
    } catch (error) {
        // Handle errors here
        if (error?.response) {
            toast({
                type: 'error',
                message: error ? error.response.data.body.status : 'Try again !',
            });
            updateCardValues();
            return error;
            // Handle specific error cases based on status codes or response data
        } else if (error.request) {
            // The request was made but no response was received
            console.log('Request:', error.request);

            return error.response;
        } else {
            // Something happened in setting up the request that triggered an error
            console.log('Error:', error.message);

        }
        // Return an appropriate error or throw it further
        throw error;
    }
};

export const updateTaskassingedTo = async function (assignedValue: any, taskId: string) {
    return await axios.put(
        process.env.TASK_API + '/task/update/' + taskId,
        {
            assignedTo: assignedValue,
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': Cookies.get('token'),
            },
        }
    );
};

export const updateSubTask = async function (id: number, data: any) {
    return await axios.put(process.env.TASK_API + '/subtask/update/' + id, data, {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};
export const updateSubTaskStatus = async function (statusValue: any, _id: any) {
    return await axios.put(
        process.env.TASK_API + '/subtask/update/' + _id,
        {
            subTaskStatus: statusValue.value,
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': Cookies.get('token'),
            },
        }
    );
};

export const updateBoardName = async function (boardName, taskId) {
    return await axios.put(
        process.env.TASK_API + '/task-status/update/' + taskId,
        {
            taskStatus: boardName,
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': Cookies.get('token'),
            },
        }
    );
};
export const updateCommentApi = async function (id: any, data: any) {
    let commenValue = {
        comment: data,
    };
    let dataValue = JSON.stringify(commenValue);
    let config = {
        method: 'put',
        maxBodyLength: Infinity,
        url: process.env.TASK_API + '/task/comment/update/' + id,
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
        data: dataValue,
    };
    let response = await axios.request(config);
    return response?.data ? response?.data : null;
};
