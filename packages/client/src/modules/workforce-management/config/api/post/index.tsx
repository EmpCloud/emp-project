import axios from "axios";
import { apiAuthenticationHeader } from "@HELPER/function";
import Cookies from 'js-cookie';

export const createTaskType = async function (data) {
    return await axios.post(process.env.TASK_API + "/task-type/create",{
        taskType: data
      }, {
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
export const createCategory = async function (data) {
  return await axios.post(process.env.TASK_API + "/task-category/create",{
    taskCategory: data
    }, {
      headers: {
          'Content-Type': 'application/json',
          'x-access-token': Cookies.get('token'),
      },
  });
};
export const createStage = async function (data) {
  return await axios.post(process.env.TASK_API + "/task-stage/create",{
    taskStage: data
    }, {
      headers: {
          'Content-Type': 'application/json',
          'x-access-token': Cookies.get('token'),
      },
  });
};