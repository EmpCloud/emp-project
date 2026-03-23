import axios from "axios";

import Cookies from 'js-cookie';
export const getProjectById = async function (condition = '') {
  try {
    return await axios.get(process.env.PROJECT_API + "/project/fetch" + condition, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': Cookies.get('token'),
      },
    });
  } catch (error) {
    return error;
  }
};
export const getAllProject = async function (condition = "") {
  try {
    return await axios.get(process.env.PROJECT_API + "/project/fetch" + condition, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': Cookies.get('token'),
      },
    });
  } catch (error) {
    return error;
  }
};
export const getAllCategory = async function () {
  return await axios.get(process.env.TASK_API + `/task-category/get?limit=${process.env.TOTAL_USERS}`, {
      headers: {
          'Content-Type': 'application/json',
          'x-access-token': Cookies.get('token'),
      },
  });
};
export const getAllStages = async function () {
  return await axios.get(process.env.TASK_API + `/task-stage/get?limit=${process.env.TOTAL_USERS}`, {
      headers: {
          'Content-Type': 'application/json',
          'x-access-token': Cookies.get('token'),
      },
  });
};
export const searchProject = async function (data) {
  try {
    return await axios.get(process.env.PROJECT_API + "/project/search" + data, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': Cookies.get('token'),
      },
    });
  } catch (error) {
    return error;
  }
};
export const projectExist = async function (name) {
  return await axios.get(process.env.PROJECT_API + "/project/exist?projectName=" + name, {
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': Cookies.get('token'),
    },
  });
};
export const getStatusStat = async function () {
  try {
    return await axios.get(process.env.PROJECT_API + `/project/status?limit=${process.env.TOTAL_USERS}`, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': Cookies.get('token'),
      },
    });
  } catch (error) {
    return error;
  }
};
export const getProjectActivity = async function (condition = "") {
  try {
    return await axios.get(process.env.PROJECT_API + "/project/get-activity" + condition, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': Cookies.get('token'),
      },
    });
  } catch (error) {
    return error;
  }
};
export const getCommentsApi = async function (condition = '') {

  let dataValue = '';
  let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: process.env.PROJECT_API + '/project/comment-get' + condition,
      headers: {
          'Content-Type': 'application/json',
          'x-access-token': Cookies.get('token'),
      },
      data: dataValue,
  }

  let response = await axios.request(config)
  return response?.data ? response?.data : null
}
export const getActivity = async function (condition = '') {
  return await axios.get(process.env.PROJECT_API + '/activity/fetch' + condition, {
      headers: {
          'Content-Type': 'application/json',
          'x-access-token': Cookies.get('token'),
      }
  })
}
export const searchtActivity = async function (data = '') {
  return await axios.get(process.env.PROJECT_API + '/activity/search' + data, {
      headers: {
          'Content-Type': 'application/json',
          'x-access-token': Cookies.get('token'),
      }
  })
}
export const getDefaultConfig = async function (data = '') {
  return await axios.get(process.env.PROJECT_API + '/table-config/fetch-default-config' + data, {
      headers: {
          'Content-Type': 'application/json',
          'x-access-token': Cookies.get('token'),
      }
  })
}

export const ClientReport = async function (condition) {
  return await axios.get(process.env.PROJECT_API + '/client/report' + condition ,{
      headers: {
          'Content-Type': 'application/json',
          'x-access-token': Cookies.get('token'),
      }
  })
}