import axios from 'axios';
import Cookies from 'js-cookie';
export const createTaskApi = async function (data) {
    return await axios.post(process.env.TASK_API + '/task/create?order=createdAt', data, {
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
    return await axios.post(process.env.TASK_API + '/subtask/create?order=createdAt', data, {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};
export const createStatus = async function (data) {
    return await axios.post(process.env.TASK_API + "/task-status/create",{
      taskStatus: data
      }, {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};
export const filterTaskApi = async function (data: any) {
    return await axios.post(process.env.TASK_API + '/task/filter', data, {
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
export const filterActivityApi = async function (data = '') {
    return await axios.post(process.env.PROJECT_API + '/activity/filter', data, {
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
  export const getTaskReview = async function (dataValue: any) { 
  let data = JSON.stringify({
    "taskStatus": dataValue
  });
  
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: process.env.TASK_API + '/task/filter',
    headers: { 
      'x-access-token': Cookies.get('token'), 
      'Content-Type': 'application/json'
    },
    data : data
  };
  
  let response=await axios.request(config)
  return response?.data ? response?.data : null 
  }