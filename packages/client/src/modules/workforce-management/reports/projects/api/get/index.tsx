import axios from "axios";
import Cookies from 'js-cookie';
import { apiAuthenticationHeader } from '@HELPER/function';

export const getProjectDetails = async function (condition="") {
    return await axios.get(process.env.PROJECT_API +"/project/userdetails" + condition
    , {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};

export const getAllUsers = async function (condition = '') {
    return await axios.get(process.env.PROJECT_API + '/user/fetch' + condition, {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};
export const getAllStatus = async function () {
    return await axios.get(process.env.TASK_API + '/task-status/fetch', {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};

export const getTaskStatusDetails = async function (id) {
  try {
    return await axios.get(process.env.TASK_API + "/task/status?projectId=" + id, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': Cookies.get('token'),
      },
    });
  } catch (error) {
    return error;
  }
};
export const getSubtaskDetails = async function (id) {
  try {
    return await axios.get(process.env.TASK_API + "/task/status" + id, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': Cookies.get('token'),
      },
    });
  } catch (error) {
    return error;
  }
};
export const getAllTaskAnalytics = async function (id) {
  try {
    return await axios.get( process.env.PROJECT_API + "/project/analytics?projectId=" + id, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': Cookies.get('token'),
      },
    });
  } catch (error) {
    return error;
  }
};