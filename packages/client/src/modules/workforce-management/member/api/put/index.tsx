import axios from 'axios';
export const resetPasswordMember = async function (data) {
    return await axios.put(process.env.PROJECT_API + '/reset-password', data);
};
