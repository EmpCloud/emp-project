import axios from "axios";
import { apiAuthenticationHeader } from "@HELPER/function";
import Cookies from 'js-cookie';

export const deleteUserById = async function (id) {
    return await axios.delete(process.env.PROJECT_API + "/user/delete?userId="+id , {
    headers: {
        'Content-Type': 'application/json',
        'x-access-token': Cookies.get('token'),
    },
});
};
export const deleteAllUser = async function (id) {
    return await axios.delete(process.env.PROJECT_API + "/user/delete?invitationStatus="+id , {
    headers: {
        'Content-Type': 'application/json',
        'x-access-token': Cookies.get('token'),
    },
});
};
export const deleteRoleById = async function (id) {
    return await axios.delete(process.env.PROJECT_API + "/role/delete?roleId="+id , {
    headers: {
        'Content-Type': 'application/json',
        'x-access-token': Cookies.get('token'),
    },
});
};
export const forceDeleteUserById = async function (id) {
    return await axios.delete(process.env.PROJECT_API + "/user/force-delete-users?userId="+id , {
    headers: {
        'Content-Type': 'application/json',
        'x-access-token': Cookies.get('token'),
    },
});
}
export const forceDeleteAllUser = async function () {
    return await axios.delete(process.env.PROJECT_API + "/user/force-delete-users?softDeleted=true" , {
    headers: {
        'Content-Type': 'application/json',
        'x-access-token': Cookies.get('token'),
    },
});
}
export const deleteAllRoles = async function () {
    return await axios.delete(process.env.PROJECT_API + "/role/delete", {
    headers: {
        'Content-Type': 'application/json',
        'x-access-token': Cookies.get('token'),
    },
});
}
export const deleteClientById = async function (id) {
        return await axios.delete(process.env.PROJECT_API + "/client/delete-client?clientId="+id , {
    headers: {
        'Content-Type': 'application/json',
        'x-access-token': Cookies.get('token'),
    },
    });
}

export const deleteCompanyById = async function (id) {
    return await axios.delete(process.env.PROJECT_API + "/client/delete-client?companyId="+id , {
headers: {
    'Content-Type': 'application/json',
    'x-access-token': Cookies.get('token'),
},
});
}