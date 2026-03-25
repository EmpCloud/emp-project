import axios from 'axios';
import Cookies from 'js-cookie';

const headers = () => ({
    'Content-Type': 'application/json',
    'x-access-token': Cookies.get('token'),
});

export const updateSprint = async function (sprintId: string, data: {
    name?: string;
    goal?: string;
    startDate?: string;
    endDate?: string;
    plannedPoints?: number;
}) {
    try {
        return await axios.put(
            process.env.PROJECT_API + '/sprint/' + sprintId,
            data,
            { headers: headers() }
        );
    } catch (error) {
        return error;
    }
};
