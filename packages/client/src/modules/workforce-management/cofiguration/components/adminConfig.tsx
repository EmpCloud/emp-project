/* eslint-disable react-hooks/rules-of-hooks */
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { adminConfig } from '../api/post';
import toast from '../../../../components/Toster/index';
import { displayAdminConfig } from '@HELPER/function';
import { fetchAdminConfig } from '../api/get';
import { editAdminConfig } from '../api/put';
import { jwtDecode } from 'jwt-decode';
export const index = () => {
    const router = useRouter();

    useEffect(() => {
        // document.querySelector('body').classList.add('bg-slate-50');
    }, []);
    const [allConfig, setAllConfig] = useState(['projectFeature', 'taskFeature', 'subTaskFeature', /*'shortcutKeyFeature',*/ 'invitationFeature' /*'chatFeature', 'calendar'*/]);
    const [config, setConfig] = useState(['projectFeature']);
    const [selectCofiguration, setSelectCofiguration] = useState(['projectFeature']);
    const [type, setType] = useState(router.query);

    useEffect(()=>{
        if(router.isReady){
            setType(router.query);
        }
    },[router.isReady])

    const handleGetConfig = () => {
        if (type.type === 'edit') {
            fetchAdminConfig().then(response => {
                if (response.data.body.status === 'success') {
                    let data = response.data.body.data.isDataExist;
                    let selectCofiguration = [];
                    if(data.taskFeature === true)  selectCofiguration.push("taskFeature");
                    if(data.subTaskFeature === true) selectCofiguration.push("subTaskFeature");
                    if(data.shortcutKeyFeature === true) selectCofiguration.push("shortcutKeyFeature");
                    if(data.invitationFeature === true) selectCofiguration.push("invitationFeature");
                    if(data.chatFeature === true) selectCofiguration.push("chatFeature"); 
                    if(data.calendar === true) selectCofiguration.push("calendar"); 
                    setConfig(prevData => [...prevData, ...selectCofiguration])
                   setSelectCofiguration(prevData => [...prevData, ...selectCofiguration])
                }
            });
        }
    };
    const handleSubmit = event => {
        event.preventDefault();
        if (type.type === 'edit') {
            editAdminConfig(selectCofiguration)
                .then(response => {
                    if (response.data.statusCode == 200) {
                        toast({
                            type: 'success',
                            message: response ? response.data.body.message : 'Something went wrong, Try again !',
                        });
                        router.push('/w-m/dashboard');
                    } else {
                        toast({
                            type: 'error',
                            message: response ? response.data.body.message : 'Something went wrong, Try again !',
                        });
                    }
                })
                .catch(function (response) {
                    toast({
                        type: 'error',
                        message: response ? response.data.body.message : 'Something went wrong, Try again !',
                    });
                });
        } else {
            adminConfig(selectCofiguration)
                .then(response => {
                    if (response.data.statusCode == 200) {
                        const exp = jwtDecode(response.data.body.data.accessToken).exp;
                        const expiresAt = exp ? new Date(exp * 1000) : undefined;
                        
                        Cookies.set('token', response.data.body.data.accessToken,{ expires: expiresAt });
                        router.push('/w-m/select-dashboard');
                    } else {
                        setTimeout(() => {
                            router.push('/w-m/select-dashboard');
                        }, 3000);
                        toast({
                            type: 'error',
                            message: response ? response.data.body.message : 'Something went wrong, Try again !',
                        });
                    }
                })
                .catch(function (response) {
                    toast({
                        type: 'error',
                        message: response ? response.data.body.message : 'Something went wrong, Try again !',
                    });
                });
        }
    };

    const handleSelctedProducts = (event, configName) => {
        event.persist();

        if(config.includes(configName)) return true ;
        
        else{
            const configSelected = selectCofiguration;
            if (configName === 'subTaskFeature' && selectCofiguration.includes('taskFeature') != true) {
                return setSelectCofiguration(prevState => [...prevState, configName, 'taskFeature']);
            }

            configSelected.includes(configName)
                ? setSelectCofiguration(prevState => {
                    const allSelectedConfig = [...prevState];
                    const index = selectCofiguration.findIndex(con => con === configName);

                    if (configName === 'projectFeature') {
                        toast({
                            type: 'error',
                            message: 'Project feature is mandatory',
                        });
                        return allSelectedConfig;
                    } else if (configName === 'taskFeature' && selectCofiguration.includes('subTaskFeature')) {
                        toast({
                            type: 'error',
                            message: 'Cannot unselect task feature when subtask is selected',
                        });
                        return allSelectedConfig;
                    } else {
                        allSelectedConfig.splice(index, 1);
                        return allSelectedConfig;
                    }
                })
                : setSelectCofiguration(prevState => [...prevState, configName]);
        }
        
    };
    const displayTick = condition => {
        return condition ? (
            <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
                <path strokeLinecap='round' d='M5 13l4 4L19 7' />
            </svg>
        ) : null;
    };
    useEffect(() => {
        handleGetConfig();
    }, [type]);

    return (
        <div className='font-inter'>
            <section className=' mx-auto flex justify-center'>
                {/*-- container -- */}
                <div className='block place-content-center m-6 mb-20 w-[500px]  drop-shadow-xl  bg-white rounded-xl p-10' style={{ marginTop: '5.5rem' }} /*you can delete this style when other 3 un-used congigurations added */> 
                <h2 className='text-center mb-5'>Note:- Once Configured,Your Not Allowed To Reset The Configurations</h2>
                    <h2 className='text-left text-defaultTextColor font-bold text-2xl'>Enable Cofiguration</h2>
                    <div className='mt-8'>
                        <div className='wrapper relative'></div>
                    </div>
                    <form>
                        <div className='mb-8'>
                            {allConfig &&
                                allConfig.map(function (data, key) {
                                    return (
                                        <button
                                            key={key}
                                            onClick={e => handleSelctedProducts(e, data)}
                                            type='button'
                                            className={
                                                displayTick(selectCofiguration.includes(data))
                                                    ? 'flex mb-3 w-full bg-mediumBlue p-4 rounded-xl text-white mt-1 border border-mediumBlue transition-all'
                                                    : 'block mb-3 w-full bg-white p-4 rounded-xl text-defaultTextColor mt-1 border border-lightGrey hover:drop-shadow-[0_5px_5px_rgba(0,0,0,0.22)] transition-all'
                                            }>
                                            {displayTick(selectCofiguration.includes(data))}
                                            <h3 className={displayTick(selectCofiguration.includes(data)) ? 'ml-1 text-white text-left' : 'text-defaultTextColor text-left'}>
                                                {displayAdminConfig(data)}
                                            </h3>
                                        </button>
                                    );
                                })}
                        </div>
                        {/* <!-- Continue Btn --> */}
                        <div className='mt-6 flex items-center xs:flex-col xs:item-left'>
                            <button
                                type='button'
                                disabled={selectCofiguration.length <= 0}
                                onClick={event => {
                                    handleSubmit(event);
                                }}
                                className='small-button items-center xs:w-full flex'>
                                Configured
                                <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
                                    <path strokeLinecap='round' d='M9 5l7 7-7 7' />
                                </svg>
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    );
};
export default index;
