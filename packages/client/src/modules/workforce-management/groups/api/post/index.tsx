import axios from 'axios';
import { apiAuthenticationHeader } from '@HELPER/function';
import Cookies from 'js-cookie';
export const addGroupApi = async function (data) {
    return await axios.post(
        process.env.PROJECT_API + '/groups/create',
        {
            group: [
                {
                    ...data,
                },
            ],
        },
        {
      headers: {
          'Content-Type': 'application/json',
          'x-access-token': Cookies.get('token'),
      },
  }
    );
};
export const filterGroupApi = async function (ApiData,data) {
    return await axios.post(process.env.PROJECT_API + `/groups/filter${ApiData}`, data, {
      headers: {
          'Content-Type': 'application/json',
          'x-access-token': Cookies.get('token'),
      },
  });
};