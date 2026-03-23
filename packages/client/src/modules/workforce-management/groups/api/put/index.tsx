import axios from 'axios';
import { apiAuthenticationHeader } from '@HELPER/function';
import Cookies from 'js-cookie';
export const updateGroupApi = async function (id, data) {
    return await axios.put(
        process.env.PROJECT_API + '/groups/update?groupId=' + id,
        {
            groupName: data.groupName,
            groupDescription: data.groupDescription,
            groupLogo:  data.groupLogo,
            assignedMembers: data.assignedMembers.map(function (d) {
                return { userId: d.userId._id };
            }),
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': Cookies.get('token'),
            },
        }
    );
};
