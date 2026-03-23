import axios from "axios";
import { apiAuthenticationHeader } from "@HELPER/function";
import Cookies from 'js-cookie';
export const updateTaskType = async function (id,data) {
    return await axios.put(process.env.TASK_API + "/task-type/update/"+ id,{
      taskType: data
      }, {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};
export const updateTaskStatus = async function (id,data) {
  return await axios.put(process.env.TASK_API + "/task-status/update/"+ id,{
    taskStatus: data
    }, {
      headers: {
          'Content-Type': 'application/json',
          'x-access-token': Cookies.get('token'),
      },
  });
};
export const updateTaskCategory = async function (id,data) {
  return await axios.put(process.env.TASK_API + "/task-category/update/"+ id,{
    taskCategory: data
    }, {
      headers: {
          'Content-Type': 'application/json',
          'x-access-token': Cookies.get('token'),
      },
  });
};
export const updateTaskStage = async function (id,data) {
  return await axios.put(process.env.TASK_API + "/task-stage/update/"+ id,{
    taskStage: data
    }, {
      headers: {
          'Content-Type': 'application/json',
          'x-access-token': Cookies.get('token'),
      },
  });
};
export const updateShortcuts = async function (id,data) {
  return await axios.put(process.env.PROJECT_API + "/shortcut-key/update?id=" + id, {
    keystroke:data
  }, {
    headers: {
        'Content-Type': 'application/json',
        'x-access-token': Cookies.get('token'),
    },
});
};
