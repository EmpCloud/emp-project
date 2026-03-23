import axios from 'axios';
import { apiAuthenticationHeader, apiAuthenticationHeaderForFiles } from '../../../../../helper/function';
import Cookies from 'js-cookie';
export const createTaskApi = async function (data) {
    return await axios.post(process.env.TASK_API + '/task/create', data, {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};
export const uploadFilesInGCB = async function (data,category,id) {
    
        return await axios.post(process.env.PROJECT_API + `/upload/upload-file?category=${category}&categoryId=${id}`, data,  {
            headers: {
                'Content-Type': 'multipart/form-data',
                'x-access-token': Cookies.get('token'),
            },
        });
   
};
export const createSubtaskApi = async function (data) {
    return await axios.post(process.env.TASK_API + '/subtask/create', data, {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};
export const filterTaskApi = async function (condition,data: any) {
    if(!data) data = {}
    return await axios.post(process.env.TASK_API + '/task/filter'+condition, data, {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};
export const addTaskCategory = async function (data) {
    let dataValue = JSON.stringify(data);
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: process.env.TASK_API + '/task-category/create',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
        data: dataValue,
    }

    let response = await axios.request(config)
    return response?.data ? response?.data : null
};
export const filterActivityApi = async function (apiData,data) {
    return await axios.post(process.env.PROJECT_API + `/activity/filter${apiData}`, data, {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
  };
  export const createCommentApi = async function (data: any, id: any) {
    let dataValue=JSON.stringify(data);
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: process.env.TASK_API + '/task/comment/'+id,
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
        data:dataValue,
    }
  
    let response=await axios.request(config)
    return response?.data ? response?.data : null 
   
  }

   export const createReplyCommentApi = async function (data: any, id: any) {
    let dataValue=JSON.stringify(data);
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: process.env.TASK_API + '/task/add-reply/'+id,
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
        data:dataValue,
    }
  
    let response=await axios.request(config)
    return response?.data ? response?.data : null 
   
  }
  