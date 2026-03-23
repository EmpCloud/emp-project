import axios from 'axios';

import Cookies from 'js-cookie';
export const getTaskByUsers = async function (User) {
    try {
        return await axios.get(process.env.TASK_API + '/activity/fetch?ActivityType=' + User, {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': Cookies.get('token'),
            },
        });
    } catch (error) {
        return error;
    }
};
//need to change this limit and skip so on scrollbar we need to append more data
export const getAllProjectDetails = async function (condition = '') {
    try {
        return await axios.get(process.env.PROJECT_API + '/project/fetch' + condition, {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': Cookies.get('token'),
            },
        });
    } catch (error) {
        return error;
    }
};
export const getAllUserDetails = async function (condition = '') {
    try {
        return await axios.get(process.env.PROJECT_API + '/user/fetch' + condition, {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': Cookies.get('token'),
            },
        });
    } catch (error) {
        return error;
    }
};
export const getAllTaskDetails = async function () {
    return await axios.get(process.env.TASK_API + `/task-status/fetch?limit=${process.env.TOTAL_USERS}&order=updatedAt&sort=desc` , {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};
export const searchProject = async function (data) {
    try {
      return await axios.get(process.env.PROJECT_API + "/project/search?" + data, {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': Cookies.get('token'),
        },
      });
    } catch (error) {
      return error;
    }
  };