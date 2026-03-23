// /permission/delete
import { apiAuthenticationHeader } from "@HELPER/function";
import axios from "axios";
import Cookies from 'js-cookie';
export const deletePermissionById = async function (id) {
    return await axios.delete(process.env.PROJECT_API + "/permission/delete?permissionId="+id,{
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};
export const deleteAllPermissions = async function () {
    return await axios.delete(process.env.PROJECT_API + "/permission/delete",{
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};