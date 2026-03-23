import axios from "axios";
import Cookies from 'js-cookie';

export const getAllConfigDetails = async function (condition) {
    try {
      return await axios.get(process.env.PROJECT_API + "/activity/fetch?ActivityType=Config&category=Created%2FUpdated" + condition,{
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': Cookies.get('token'),
      },
      });
    } catch (error) {
      return error;
    }
  };

  export const getAllPlanDetails = async function (condition) {
    try {
      return await axios.get(process.env.PROJECT_API + "/plan/get-history" + condition,{
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': Cookies.get('token'),
      },
    })
    } catch (error) {
      return error;
    }
  };