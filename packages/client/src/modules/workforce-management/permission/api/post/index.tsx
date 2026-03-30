import { apiAuthenticationHeader } from "@HELPER/function";
import axios from "axios";
import Cookies from 'js-cookie';


export const createPermission = async function (permissionName,permissionConfig) {
  return await axios.post(process.env.PROJECT_API + "/permission/create",{
      permissionName:permissionName,
      permissionConfig:permissionConfig,
    }, {
      headers: {
          'Content-Type': 'application/json',
          'x-access-token': Cookies.get('token'),
      },
  });
};