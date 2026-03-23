import axios from 'axios';
import { OrgId } from '../../../../../helper/exportData';
import { apiAuthenticationHeader } from '@HELPER/function';
import Cookies from 'js-cookie';
export const addMemberApi = async function (data) {
    const memberData = data.filter(d => {
        if (d.firstName != '' && d.lastName != '' && d.role != '') {
            return d;
        }
    });

    return await axios.post(
        process.env.PROJECT_API + '/user/create',
        {
            users: memberData,
        },
        {
      headers: {
          'Content-Type': 'application/json',
          'x-access-token': Cookies.get('token'),
      },
  }
    );
};
export const addRoleApi = async function (data) {
    return await axios.post(
        process.env.PROJECT_API + '/role/create',
        {
            roles: [data],
        },
        {
      headers: {
          'Content-Type': 'application/json',
          'x-access-token': Cookies.get('token'),
      },
  }
    );
};

export const memberFilterApi = async function (condition,data) {
    return await axios.post(process.env.PROJECT_API + '/user/filter'+condition, data, {
      headers: {
          'Content-Type': 'application/json',
          'x-access-token': Cookies.get('token'),
      },
  });
};
export const roleFilterApi = async function (Apidata,data) {
    return await axios.post(process.env.PROJECT_API + `/role/filter${Apidata}`, data, {
      headers: {
          'Content-Type': 'application/json',
          'x-access-token': Cookies.get('token'),
      },
  });
};
export const resendMailUser = async function (id) {
    return await axios.post(process.env.PROJECT_API + '/user/resend-verify-mail?userId=' + id,{}, {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};
export const createClient = async function (data) {
    return await axios.post(process.env.PROJECT_API + '/client/add-client' ,data, {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};
export const creatCompany = async function (data) {
    return await axios.post(process.env.PROJECT_API + '/client/add-company' ,data, {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};