import React, { useEffect, useState } from 'react'
import { getAllPlanDetails } from '../api/get';
import moment from 'moment';
import toast from '../../../../components/Toster/index';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';

function planHistory({ stopLoading, startLoading }) {

    const [planDetails, setPlanDetails] = useState(null);
    const [sorting, setSorting] = useState({
        planName: 'asc',
        duration: 'asc',
        startDate: 'asc',
        expireDate: 'asc',
    });
    useEffect(() => {
        // document.querySelector('body').classList.add('bg-slate-50');
    }, []);
    useEffect(() => {
        handlePlanData('?orderBy=startDate&sort=desc');
    }, []);
    const handlePlanData = (condition = '') => {
        getAllPlanDetails(condition).then(response => {
            if (response.data.body.status === 'success') {
                setPlanDetails(response.data.body.data);
            }
        }).catch(function (e) {
            toast({
                type: 'error',
                message: e.response ? e.response.data.body.message : 'Something went wrong, Try again !',
            });
        });
    };
    const handleShorting = (type, colValue) => {

        if (type === 'asc') {
            let condition = '?orderBy=' + colValue + '&sort=asc'
            getAllPlanDetails(condition).then(response => {
                if (response.data.body.status === 'success') {
                    setPlanDetails(response.data?.body?.data);
                }
            });
        } else {
            let condition = '?orderBy=' + colValue + '&sort=desc'
            getAllPlanDetails(condition).then(response => {
                if (response.data.body.status === 'success') {
                    setPlanDetails(response.data?.body?.data);
                }
            });
        }
    };

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="table-style min-w-[900px] text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-base text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Plan Name

                            {sorting.planName === 'desc' ? (
                                <button
                                    onClick={() => {
                                        handleShorting('desc', 'planName');
                                        setSorting({ ...sorting, planName: 'asc' });
                                    }}>
                                    <FaArrowDown className='cursor-pointer' />
                                </button>
                            ) : (
                                <button
                                    onClick={() => {
                                        handleShorting('asc', 'planName');
                                        setSorting({ ...sorting, planName: 'desc' });

                                    }}>
                                    <FaArrowUp className='cursor-pointer' />
                                </button>
                            )}

                        </th>
                        <th scope="col" className="px-6 py-3">
                            <div className="flex items-center">
                                Duration
                                {sorting.duration === 'desc' ? (
                                    <button
                                        onClick={() => {
                                            handleShorting('desc', 'duration');
                                            setSorting({ ...sorting, duration: 'asc' });
                                        }}>
                                        <FaArrowDown className='cursor-pointer' />
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => {
                                            handleShorting('asc', 'duration');
                                            setSorting({ ...sorting, duration: 'desc' });
                                        }}>
                                        <FaArrowUp className='cursor-pointer' />
                                    </button>
                                )}
                            </div>
                        </th>
                        <th scope="col" className="px-6 py-3">
                            <div className="flex items-center">
                                Start Date
                                {sorting.startDate === 'desc' ? (
                                    <button
                                        onClick={() => {
                                            handleShorting('desc', 'startDate');
                                            setSorting({ ...sorting, startDate: 'asc' });
                                        }}>
                                        <FaArrowDown className='cursor-pointer' />
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => {
                                            handleShorting('asc', 'startDate');
                                            setSorting({ ...sorting, startDate: 'desc' });
                                        }}>
                                        <FaArrowUp className='cursor-pointer' />
                                    </button>
                                )}
                            </div>
                        </th>
                        <th scope="col" className="px-6 py-3">
                            <div className="flex items-center">
                                Expiry Date
                                {sorting.expireDate === 'desc' ? (
                                    <button
                                        onClick={() => {
                                            handleShorting('desc', 'expireDate');
                                            setSorting({ ...sorting, expireDate: 'asc' });
                                        }}>
                                        <FaArrowDown className='cursor-pointer' />
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => {
                                            handleShorting('asc', 'expireDate');
                                            setSorting({ ...sorting, expireDate: 'desc' });
                                        }}>
                                        <FaArrowUp className='cursor-pointer' />
                                    </button>
                                )}
                            </div>
                        </th>
                        <th scope="col" className="px-6 py-3">
                            <div className="flex items-center">
                                Status
                            </div>
                        </th>
                        <th scope="col" className="px-6 py-3">
                            <div className="flex items-center">
                                Purchased By
                            </div>
                        </th>
                        <th scope="col" className="px-6 py-3">
                            <span className="sr-only">Edit</span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {planDetails && planDetails.length === 0 && <div className=''>No data</div>}
                    {planDetails && planDetails.map((plan) => (
                        <tr key={plan._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <td className="px-6 py-4">
                                {plan.planName}
                            </td>
                            <td className="px-6 py-4">
                                {plan?.durationValue + ' ' + plan?.durationType + '(S)'}
                            </td>
                            <td className="px-6 py-4">
                                {moment.utc(plan.startDate).local().format('YYYY-MM-DD HH:mm:ss')}
                            </td>
                            <td className="px-6 py-4">
                                {moment.utc(plan.expireDate).local().format('YYYY-MM-DD HH:mm:ss')}
                            </td>
                            <td className="px-6 py-4" style={{ color: plan.status === 'active' ? 'green' : 'red' }}>
                                <b>{plan.status}</b>
                            </td>
                            <td scope='row' className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                                <div className='flex gap-2 items-center'>
                                    <div>
                                        <span className='example-emoji' role='img' aria-label='duck emoji'>
                                            <div className='user-img-group'>
                                                <img src={plan.purchasedBy.profilePic ? plan.purchasedBy.profilePic : '/imgs/default.png'} className='user-img-sm' alt='user' />
                                            </div>
                                        </span>
                                    </div>
                                    <div className='flex flex-col  text-left'>
                                        <span className='pb-1 font-bold'>{plan.purchasedBy?.firstName + ' ' + plan.purchasedBy?.lastName}</span>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                                {/* <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a> */}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
export default planHistory