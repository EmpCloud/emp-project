import Cookies from 'js-cookie';
import toast from '@COMPONENTS/Toster/index';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import router from 'next/router';
import React, { useState  , createContext, useContext } from 'react';
export const displayErrorMessage = function (msg) {
    if (msg) {
        if (typeof msg === 'object') {
            if (msg.length == 1) {
                return msg[0];
            }
            return msg[0]?.substring(0, msg[0]?.indexOf('.'));
        }
    }
    return msg;
};
export const displayAdminConfig = function (product) {
    switch (product) {
        case 'projectFeature':
            return 'Projects';
        case 'taskFeature':
            return 'Tasks';
        case 'subTaskFeature':
            return 'Sub-Task';
        case 'shortcutKeyFeature':
            return 'Shortcut';
        case 'invitationFeature':
            return 'Invitation Member';
        case 'chatFeature':
            return 'Chat Feature';
        case 'calendar':
            return 'Calendar';
        default:
            return '';
    }
};
export const displayDate = function (dateString) {
    let dateObj = new Date(dateString);
    return dateObj.toDateString();
};
export const formatedDate = function (dateString) {
    return typeof dateString === 'string' ? dateString.split('T')[0] : dateString;
};
export const formattedDateTime = (dateTimeString) => { 
    const dateTime = new Date(dateTimeString);
    const formattedTime = dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Format time with hours and minutes

    return `${formattedTime}`;
};

export const handleUserClick= (user ,id ,isSuspended)=>{
    const permissionDataString = (Cookies.get('permission'));
    if (user===false && isSuspended === false){
    
    if(permissionDataString?.user?.view===true||Cookies.get('isAdmin') === 'true'){
        router.push('/w-m/members/' + id);
    }
    }
    else if(isSuspended === true){
        toast({
            type: 'error',
            message: 'This user is Suspended !',
        });
    }
    else{
        toast({
            type: 'error',
            message: 'Access denied',
        });
    }

}

export const secondsToHms = function (d) {
    d = Number(d);
    let h = Math.floor(d / 3600);
    let m = Math.floor((d % 3600) / 60);
    let s = Math.floor((d % 3600) % 60);
    return ('0' + h).slice(-2) + ':' + ('0' + m).slice(-2) + ':' + ('0' + s).slice(-2) + ' hr';
};
export const formatDate = function (date) {
    return date.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
};
export const destructureFormateDate = function (date) {
    return date.replace(/-/g, '');
};
export const apiAuthenticationHeader = {
    headers: {
        'Content-Type': 'application/json',
        'x-access-token': Cookies.get('token'),
    },
};
export const apiAuthenticationHeaderForFiles = {
    headers: {
        'Content-Type': 'multipart/form-data',
        'x-access-token': Cookies.get('token'),
    },
};
export const apiIsNotWorking = function (response) {
    toast({
        type: 'error',
        message: 'Not working' + response.config.url,
    });
};
export const selectedValuesMuliSelectorDate = function (data) {
    return Array.isArray(data)
        ? data.map(function (d) {
              if (d.key) {
                  return d;
              } else {
                  return { id: d._id ,key: d.groupName ? d.groupName : d.firstName + '' + d.lastName, value: d };
              }
          })
        : [];
};
export const capitalizeString = function (string) {
    return string ? string.toLowerCase()[0].toUpperCase() + string.toLowerCase().slice(1) : string;
};
export const openUpgradePlan = function () {
    const MySwal = withReactContent(Swal);
    return MySwal.fire({
        title: 'Limit Reached!',
        icon: 'info',
        text: 'Please contact Team to upgrade your plan ',
        position: 'top-end',
        // cancelButtonColor: '#d33',
        // confirmButtonText: 'Upgrade Plan!',
        allowOutsideClick: false,
        showCancelButton: false,
        showClass: {
            popup: 'animate__animated animate__fadeInDown',
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp',
        },
    }).then(result => {
        // if (result.isConfirmed) {
        //     Router.push('/w-m/pricing');
        // }
    });
};
export const openCreateProjectAlert = function (operation) {
    const MySwal = withReactContent(Swal);
    return MySwal.fire({
        allowOutsideClick: false,
        showCancelButton: true,
        confirmButtonText: 'Create',
        title: 'Create Poject',
        icon: 'info',
        text: 'No project is present , create project now',
        position: 'center',
        cancelButtonColor: '#d33',
        showClass: {
            popup: 'animate__animated animate__fadeInDown',
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp',
        },
    }).then(result => {
        if (result.isConfirmed) {
            operation();
        }
    });
};
export const openCreateTaskAlert = function (operation) {
    const MySwal = withReactContent(Swal);
    return MySwal.fire({
        allowOutsideClick: false,
        showCancelButton: true,
        confirmButtonText: 'Create',
        title: 'Create Task',
        icon: 'info',
        text: 'No task is present , create task now',
        position: 'center',
        cancelButtonColor: '#d33',
        showClass: {
            popup: 'animate__animated animate__fadeInDown',
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp',
        },
    }).then(result => {
        if (result.isConfirmed) {
            operation();
        }
    });
};
export const openCreateMemberAlert = function (operation) {
    const MySwal = withReactContent(Swal);
    return MySwal.fire({
        allowOutsideClick: false,
        showCancelButton: true,
        confirmButtonText: 'Add',
        title: 'Add Member',
        icon: 'info',
        text: 'No member is present , add member now',
        position: 'center',
        cancelButtonColor: '#d33',
        showClass: {
            popup: 'animate__animated animate__fadeInDown',
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp',
        },
    }).then(result => {
        if (result.isConfirmed) {
            operation();
        }
    });
};
export const checkPermission = function (component = null) {
    if (Cookies.get('isAdmin') === 'true') {
        return true;
    } else {
        return false;
    }
};
export const uniqueArrays = function (arr1 = [], arr2 = []) {
    const arr2Array = Array.isArray(arr2) ? arr2 : [];
    let combined = [...arr1, ...arr2Array];
    const uniqueArr = combined.reduce((acc, obj) => {
        const found = acc.find(item => item.id === obj.id);
        if (!found) {
          acc.push(obj);
        }
        return acc;
      }, []);
     return uniqueArr;
};
export const uniqueMembers = function (arr1 = [], arr2 = []) {
    let combined = [...arr1, ...arr2];
    const arrObj = combined.filter((elem, index, arr) =>
    index === arr.findIndex((t) => (
        t._id === elem._id
    ))
    )
    return arrObj;
};
  
export const disableFutureDates = function () {
    const today = new Date();
    const isoDate = today.toISOString().split('T')[0];
    return isoDate;
};

export const filterMembers = (data) =>{
    return data?.filter(d => d?.role === 'member'||d?.role !== 'owner'&&d?.role !== 'manager'&&d?.role !== 'sponsor');
}
export const filterOwner = (data) =>{
    return data?.filter(d => d?.role === 'owner');
}
export const filterManager = (data) =>{
    return data?.filter(d => d?.role === 'manager');
}
export const filterSponser = (data) =>{
    return data?.filter(d => d?.role === 'sponsor');
}


// Create a context with an initial value (undefined in this case)
const SharedStateContext = createContext(undefined);

// Export the context for use in other files
export const useSharedStateContext = () => {
  return useContext(SharedStateContext);
};

// Export the context itself for use in the provider
export const SharedStateContextProvider = SharedStateContext.Provider;
