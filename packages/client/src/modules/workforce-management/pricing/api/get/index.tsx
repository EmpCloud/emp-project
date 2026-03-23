import axios from "axios";
import { apiAuthenticationHeader } from "@HELPER/function";
import Cookies from 'js-cookie';
export const getPlan = async function () {
    return await axios.get(process.env.PROJECT_API + "/plan/get" , {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};