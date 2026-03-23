import axios from 'axios';
import Cookies from 'js-cookie';

export const updateTask = async function (id: number, data: any) {
    return await axios.put(process.env.TASK_API + '/task/update/' + id, data, {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};
export const updateTaskDescription = async function (taskDetailsValue: any, taskId: string) {
    
    return await axios.put(
        process.env.TASK_API + '/task/update/' + taskId,taskDetailsValue,
        
        {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': Cookies.get('token'),
            },
        }
    );
};
export const updateTaskStatus = async function (statusValue:any, taskId: string) {
    return await axios.put(
        process.env.TASK_API + '/task/update/' + taskId,
        {
        taskStatus: statusValue.value,
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': Cookies.get('token'),
            },
        }
    );
};
export const updateTaskAttachement=async function ( attachmentValue, taskId: string) {
    return await axios.put(
        process.env.TASK_API + '/task/update/' + taskId,
    
        attachmentValue,
    
        {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': Cookies.get('token'),
            },
        }
    );
};
export const updateSubTaskAttachement=async function ( attachmentValue, taskId: string) {
    return await axios.put(
        process.env.TASK_API + '/subtask/update/' + taskId,
    
        attachmentValue,
    
        {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': Cookies.get('token'),
            },
        }
    );
};
export const updateTaskDate=async function ( attachmentValue, taskId: string) {
    return await axios.put(
        process.env.TASK_API + '/task/update/' + taskId,
    
        attachmentValue,
    
        {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': Cookies.get('token'),
            },
        }
    );
};
export const updateTaskassingedTo = async function (assignedValue: any, taskId: string) {
    return await axios.put(
        process.env.TASK_API + '/task/update/' + taskId,
        {
            assignedTo: assignedValue

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
export const updateCommentApi=async function (id: any,data: any,){
    let commenValue={
        comment:data,
    }
    let dataValue=JSON.stringify(commenValue);
    let config={
        method: 'put',
        maxBodyLength: Infinity,
        url: process.env.TASK_API + '/task/comment/update/'+id,
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
        data:dataValue,
    }
    let response=await axios.request(config)
    return response?.data ? response?.data : null 
  }