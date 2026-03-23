import axios from "axios";
import { apiAuthenticationHeader } from "../../../../../helper/function";
import Cookies from 'js-cookie';
export const createDashboardConfig = async function (id) {
    return await axios.post(process.env.PROJECT_API + "/dashboard-view/config?id="+id,{}, {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};
