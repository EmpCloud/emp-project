import axios from "axios";
import { apiAuthenticationHeader } from "@HELPER/function";
export const fetchChatApi = async function (firstId: string,secondId: string) {
    return await axios.get(process.env.PROJECT_API + "/chat/fetch-chats?firstId="+firstId+"&secondId="+secondId,apiAuthenticationHeader);
};
export const fetchChatUserApi = async function () {
    return await axios.get(process.env.PROJECT_API +
         "/chat/fetch-users",apiAuthenticationHeader);
};