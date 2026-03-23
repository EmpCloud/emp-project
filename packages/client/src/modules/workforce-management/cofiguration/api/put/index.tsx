import axios from 'axios';
import Cookies from 'js-cookie';
export const editAdminConfig = async function (data) {
    return await axios.put(
        process.env.PROJECT_API + '/admin-config/update',
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
