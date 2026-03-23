import { apiAuthenticationHeader } from '@HELPER/function';
import axios from 'axios';
import Cookies from 'js-cookie';

export const updatePermission = async function (permissionName, permissionConfig, permissionId) {
    if (permissionName) {
        return await axios.put(
            process.env.PROJECT_API + '/permission/update?permissionId=' + permissionId,
            {
                permissionName: permissionName,
                permissionConfig: permissionConfig,
            },
            {
                headers: {
                'Content-Type': 'application/json',
                'x-access-token':await Cookies.get('token'),
                },
            }
        );
    } else {
        return await axios.put(
            process.env.PROJECT_API + '/permission/update?permissionId=' + permissionId,
            {
                permissionConfig: permissionConfig,
            },
           {
                headers: {
                'Content-Type': 'application/json',
                'x-access-token':await Cookies.get('token'),
                },
            }
        );
    }
};
