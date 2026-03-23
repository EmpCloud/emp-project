import axios from "axios";
import { apiAuthenticationHeader } from "../../../../../helper/function";
import Cookies from 'js-cookie';

export const getDashboardConfig = async function (id) {
    return await axios.get(process.env.PROJECT_API +"/dashboard-view/config-get?id="+id, {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'), 
        },
    });
};
export const getAllActivity = async function (condition="") {
    return await axios.get(process.env.PROJECT_API +"/activity/fetch" + condition
    , {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};
export const getAllActivitySearching = async function (condition="") {
    return await axios.get(process.env.PROJECT_API +"/activity/search?" + condition
    , {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};