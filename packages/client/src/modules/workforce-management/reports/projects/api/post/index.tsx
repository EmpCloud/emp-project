import axios from 'axios';
import Cookies from 'js-cookie';


export const filterTaskApi = async function (pagination,data) {
    return await axios.post(process.env.TASK_API + '/task/filter'+pagination, data, {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};
