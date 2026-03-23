import axios from "axios";

import Cookies from 'js-cookie';
export const getTaskById = async function (condition = " ") {
  try {
    return await axios.get(process.env.TASK_API + "/task/fetch" + condition, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': Cookies.get('token'),
      },
    });
  } catch (error) {
    return error;
  }
};
export const getAllTask = async function (condition = "") {
  try {
    return await axios.get(process.env.TASK_API + "/task/fetch" + condition, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': Cookies.get('token'),
      },
    });
  } catch (error) {
    return error;
  }
};
export const searchTask = async function (data) {
  try {
    return await axios.get(process.env.TASK_API + "/task/search" + data, {
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
export const getAllSubTask = async function (condition = "") {
  try {
    return await axios.get(process.env.TASK_API + "/subtask/getAll" + condition, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': Cookies.get('token'),
      },
    });
  } catch (error) {
    return error;
  }
};
export const getStatusCount = async function (condition = "") {
  try {
    return await axios.get(process.env.TASK_API + "/task/status" + condition, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': Cookies.get('token'),
      },
    });
  } catch (error) {
    return error;
  }
};

export const getTaskActivity = async function (id) {
  try {
    return await axios.get(process.env.TASK_API + "/task/activity/get/" + id, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': Cookies.get('token'),
      },
    });
  } catch (error) {
    return error;
  }
};
export const searchSubTask = async function (data) {
  try {
    return await axios.get(process.env.TASK_API + "/subtask/search?" + data, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': Cookies.get('token'),
      },
    });
  } catch (error) {
    return error;
  }
};
export const getSubTaskActivity = async function (id) {
  try {
    return await axios.get(process.env.TASK_API + "/subtask/get-activity/" + id, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': Cookies.get('token'),
      },
    });
  } catch (error) {
    return error;
  }
};
export const getTaskLables = async function () {
  try {
    return await axios.get(process.env.TASK_API + "/task-category/get", {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': Cookies.get('token'),
      },
    });
  } catch (error) {
    return error;
  }
}
export const getActivity = async function (condition = '') {
  return await axios.get(process.env.PROJECT_API + '/activity/fetch' + condition, {
      headers: {
          'Content-Type': 'application/json',
          'x-access-token': Cookies.get('token'),
      }
  })
}
export const getAllRoles = async function (condition="") {
  return await axios.get(process.env.PROJECT_API + `/role/fetch?`+condition , {
      headers: {
          'Content-Type': 'application/json',
          'x-access-token': Cookies.get('token'),
      },
  });
};
export const searchtActivity = async function (data = '') {
  return await axios.get(process.env.PROJECT_API + '/activity/search' + data, {
      headers: {
          'Content-Type': 'application/json',
          'x-access-token': Cookies.get('token'),
      }
  })
}

export const ClientReportTask = async function (data = '') {
  return await axios.get(process.env.TASK_API + '/task/fetch-report' + data, {
      headers: {
          'Content-Type': 'application/json',
          'x-access-token': Cookies.get('token'),
      }
  })
}
export const getCommentsApi=async function (condition='') {

  let dataValue='';
  let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: process.env.TASK_API + '/task/comment/get'+condition,
      headers: {
          'Content-Type': 'application/json',
          'x-access-token': Cookies.get('token'),
      },
      data:dataValue,
  }

  let response=await axios.request(config)
  return response?.data ? response?.data : null 
}

