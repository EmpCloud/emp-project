import axios from "axios";
import { apiAuthenticationHeader } from "@HELPER/function";
import Cookies from 'js-cookie';

export const deleteAllTask = async function () {
  try {
    return await axios.delete(process.env.TASK_API + "/task/delete",{
      headers: {
          'Content-Type': 'application/json',
          'x-access-token': Cookies.get('token'),
      },
  });
  } catch (error) {
    return error;
  }
};
export const deleteTaskById = async function (id) {
  try {
    return await axios.delete(
      process.env.TASK_API + "/task/delete?id="+id,{
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    }
    );
  } catch (error) {
    return error;
  }
};
export const deleteSubTaskById = async function (id) {
  try {
    return await axios.delete(
      process.env.TASK_API + "/subtask/delete?subTaskId=" + id,{
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    }
    );
  } catch (error) {
    return error;
  }
};
export const deleteCommentApi=async function (id: any){ 
  let config={
      method: 'delete',
      maxBodyLength: Infinity,
      url: process.env.TASK_API + '/task/comment/delete?comment_id='+id,
      headers: {
          'Content-Type': 'application/json',
          'x-access-token': Cookies.get('token'),
      },
  }
  let response=await axios.request(config)
  return response?.data ? response?.data : null 
}
export const deleteReplyCommentApi=async function (id: any){ 
  let config={
      method: 'delete',
      maxBodyLength: Infinity,
      url: process.env.TASK_API + '/task/reply/delete?replyedId='+id,
      headers: {
          'Content-Type': 'application/json',
          'x-access-token': Cookies.get('token'),
      },
  }
  let response=await axios.request(config)
  return response?.data ? response?.data : null 
}
