import axios from "axios";
import Cookies from 'js-cookie';

export const downgradeInfo = async function () {
    try {
        return await axios.get(process.env.PROJECT_API + '/plan/downgrade-info', {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': Cookies.get('token'),
            },
        });
    } catch (error) {
        return error;
    }
};