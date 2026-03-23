import axios from 'axios';
import { apiAuthenticationHeader } from '@HELPER/function';
import Cookies from 'js-cookie';
export const adminConfig = async function (data) {
    return await axios.post(
        process.env.PROJECT_API + '/admin-config/create',
        {
            projectFeature: data.includes('projectFeature'),
            taskFeature: data.includes('taskFeature'),
            subTaskFeature: data.includes('subTaskFeature'),
            shortcutKeyFeature: data.includes('shortcutKeyFeature'),
            invitationFeature: data.includes('invitationFeature'),
            chatFeature: data.includes('chatFeature'),
            calendar: data.includes('calendar'),
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': Cookies.get('token'),
            },
        }
    );
};
