import axios from "axios";
import { apiAuthenticationHeader } from "@HELPER/function";
import Cookies from 'js-cookie';

export const getAllGroups = async function (condition = "") {
    try {
        return await axios.get(process.env.PROJECT_API + "/groups/fetch"+condition, {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': Cookies.get('token'),
            },
        });
    } catch (error) {
        return error;
    }
};
export const searchGroups = async function (data) {
    try {
      return await axios.get(process.env.PROJECT_API + "/groups/search?"+data,{
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
    }  catch (error) {
        return error;
      }
  };
