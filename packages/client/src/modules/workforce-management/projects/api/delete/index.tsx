import axios from "axios";
import { apiAuthenticationHeader } from "@HELPER/function";
import Cookies from 'js-cookie';

export const deleteProjectById = async function (id : string) {
    return await axios.delete(
      process.env.PROJECT_API + "/project/delete?id="+ id,{
    headers: {
        'Content-Type': 'application/json',
        'x-access-token': Cookies.get('token'),
    },
}
    );
};
export const deleteAllProject= async function () {
  return await axios.delete(
    process.env.PROJECT_API + "/project/delete/",{
    headers: {
        'Content-Type': 'application/json',
        'x-access-token': Cookies.get('token'),
    },
}
  );
};
export const deleteCommentApi = async function (id: any) {
  let config = {
      method: 'delete',
      maxBodyLength: Infinity,
      url: process.env.PROJECT_API + '/project/comment-delete?commentId=' + id,
      headers: {
          'Content-Type': 'application/json',
          'x-access-token': Cookies.get('token'),
      },
  }
  let response = await axios.request(config)
  return response?.data ? response?.data : null
}
export const deleteReplyCommentApi = async function (id: any) {
  let config = {
      method: 'delete',
      maxBodyLength: Infinity,
      url: process.env.PROJECT_API + '/project/reply-delete?replyedId=' + id,
      headers: {
          'Content-Type': 'application/json',
          'x-access-token': Cookies.get('token'),
      },
  }
  let response = await axios.request(config)
  return response?.data ? response?.data : null
}