import React, { useEffect, useState } from 'react';
import TaskTypeConfig from './taskTypeConfig';
import StagesConfig from './stagesConfig';
import Catagory from './catagory';
import Status from './status';
import Cookies from 'js-cookie';
import NoAccessCard from '@COMPONENTS/NoAccessCard';
import { fetchProfile } from '@WORKFORCE_MODULES/admin/api/get';
import NoSsr from '@COMPONENTS/NoSsr';

function Task({ startLoading, stopLoading }) {
    const [permission ,setPermission] = useState(null)
    const admin = Cookies.get('isAdmin');
    const handleProfileData = () => {
        fetchProfile().then(response => {
            if (response.data?.body.status === 'success') {
                setPermission(response.data.body.data.permissionConfig.task);
            }
        });
    };
    useEffect(()=>{
        if(admin === "false"){
            handleProfileData();
        }
    },[]);
    return (
        <>
        <NoSsr>
        {admin === "true" || permission?.create === true ||  permission?.edit === true || permission?.delete === true  ?
                <div >
                    <div className="my-4 lg:flex">
                        <Catagory {...{ startLoading, stopLoading }} />
                        <Status {...{ startLoading, stopLoading }} />
                    </div>
                    <div className="my-4 lg:flex">
                        <TaskTypeConfig {...{ startLoading, stopLoading }} />
                        <StagesConfig {...{ startLoading, stopLoading }} />
                    </div>
                </div> :
                <NoAccessCard />
            }
        </NoSsr>
            

        </>
    )
}
export default Task;