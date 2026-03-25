import axios from 'axios';
import Cookies from 'js-cookie';

const headers = () => ({
    'Content-Type': 'application/json',
    'x-access-token': Cookies.get('token'),
});

export const removeTaskFromSprint = async function (sprintId: string, taskId: string) {
    try {
        return await axios.delete(
            process.env.PROJECT_API + '/sprint/' + sprintId + '/tasks/' + taskId,
            { headers: headers() }
        );
    } catch (error) {
        return error;
    }
};
