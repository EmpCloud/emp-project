import React, { useEffect, useState } from 'react';
import { getAllConfigDetails } from '../api/get';
import toast from '../../../../components/Toster/index';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import moment from 'moment';

const configHistory = () => {
    const [configDetails, setConfigDetails] = useState(null);
    const handleGetConfigDetails = (condition = '') => {
        getAllConfigDetails(condition).then(response => {
            if (response.data?.body?.status === 'success') {
                setConfigDetails(response.data?.body?.data?.activity);
            }
        }).catch(function (e) {
                toast({
                    type: 'error',
                    message: e.response ? e.response.data.body.message : 'Something went wrong, Try again !',
                });
            });
    };
    const [sorting, setSorting] = useState({
        createdAt: 'asc',
        activity: 'asc',
      });
    useEffect(() => {
        handleGetConfigDetails();
    }, []);
    const handleShorting = (type, colValue) => {
       
        if (type === 'asc') {
            let condition = '&orderBy=' + colValue + '&sort=asc'
            getAllConfigDetails(condition).then(response => {
                if (response.data.body.status === 'success') {
                    setConfigDetails(response.data?.body?.data?.activity);
                 } 
            });
        } else {
            let condition = '&orderBy=' + colValue + '&sort=desc'
            getAllConfigDetails(condition).then(response => {
                if (response.data.body.status === 'success') {
                    setConfigDetails(response.data?.body?.data?.activity);
                }   
            });
        }
    };
    return (
        <>
            <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
                <table className='table-style min-w-[900px] '>
                    <thead className='text-base text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                        <tr>
                            <th scope='col' className='px-6 py-3'>
                                CREATED BY
                            </th>
                            <th scope='col' className='px-6 py-3'>
                                <div className='flex items-center'>
                                    CREATED AT
                                    {sorting.createdAt === 'desc' ? (
                                    <button
                                        onClick={() => {
                                            handleShorting('desc', 'createdAt');
                                            setSorting({ ...sorting, createdAt: 'asc' });
                                        }}>
                                        <FaArrowDown className='cursor-pointer' />
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => {
                                            handleShorting('asc', 'createdAt');
                                            setSorting({ ...sorting, createdAt: 'desc' });
                                        }}>
                                        <FaArrowUp className='cursor-pointer' />
                                    </button>
                                )}  
                                </div>
                            </th>
                            <th scope='col' className='px-6 py-3'>
                                <div className='flex items-center'>
                                    ACTIVITY DETAILS
                                    {sorting.activity === 'desc' ? (
                                    <button
                                        onClick={() => {
                                            handleShorting('desc', 'activity');
                                            setSorting({ ...sorting, activity: 'asc' });
                                        }}>
                                        <FaArrowDown className='cursor-pointer' />
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => {
                                            handleShorting('asc', 'activity');
                                            setSorting({ ...sorting, activity: 'desc' });
                                        }}>
                                        <FaArrowUp className='cursor-pointer' />
                                    </button>
                                )}  
                                </div>
                            </th>
                            <th scope='col' className='px-6 py-3'>
                                {/* <div className='px-6 py-4 text-center'>ACTION</div> */}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {configDetails && configDetails.length === 0 && <div className=''>No data</div>}
                        {configDetails &&
                            configDetails.map(function (data) {
                                return (
                                    <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'>
                                        <td scope='row' className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                                            <div className='flex gap-2 items-center'>
                                                <div>
                                                    <span className='example-emoji' role='img' aria-label='duck emoji'>
                                                        <div className='user-img-group'>
                                                            <img src={data.userDetails.profilePic ? data.userDetails.profilePic : '/imgs/default.png'} className='user-img-sm' alt='user' />
                                                        </div>
                                                    </span>
                                                </div>
                                                <div className='flex flex-col  text-left'>
                                                    <span className='pb-1 font-bold'>{data.userDetails?.name}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className='px-6 py-4'>{moment.utc(data?.createdAt).local().format('YYYY-MM-DD HH:mm:ss')}</td>
                                        <td className='px-6 py-4'>{data.activity}</td>
                                        <td className='px-6 py-4 text-center'>
                                            {/* <button
                                                onClick={() => {
                                                    setDeleteMessage('Delete Activity Config?');
                                                    setDeleteConfig(data._id);
                                                    setOpenDeleteModel(true);
                                                }}
                                                className='red-link'>
                                                <AiOutlineDelete />
                                            </button> */}
                                        </td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
            </div>
        </>
    );
};
export default configHistory;
