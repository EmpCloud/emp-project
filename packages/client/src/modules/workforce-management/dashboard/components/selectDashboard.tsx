import React from 'react';
import { createDashboardConfig } from '../api/post';
import router from 'next/router';
import Cookies from 'js-cookie';
import toast from '../../../../components/Toster/index';
import { jwtDecode } from 'jwt-decode';
const selectDashboard = ({ startLoading, stopLoading }) => {
    const handleCreateDashboard = type => {
        startLoading();
        createDashboardConfig(type)
            .then(response => {
                if (response.data.statusCode == 200) {
                    const exp = jwtDecode(response.data.body.data.accessToken).exp;
                    const expiresAt = exp ? new Date(exp * 1000) : undefined;
                    Cookies.set('token', response.data.body.data.accessToken,{ expires: expiresAt });
                    router.push('/w-m/dashboard');
                }
            })
            .catch(function ({ response }) {
                stopLoading();
                toast({
                    type: 'error',
                    message: response ? response.data.body.message : 'Something went wrong, Try again !',
                });
            });
        stopLoading();
    };
    return (
        <main className='max-w-6xl mx-auto pt-10 pb-36 px-8'>
            <div className='max-w-md mx-auto mb-14 text-center'>
                <h1 className='text-4xl font-semibold mb-6 lg:text-5xl'>
                    <span className='text-indigo-600'>Select</span> Dashboard
                </h1>
            </div>
            <div className='flex flex-col justify-between items-center lg:flex-row lg:items-start'>
                <div className='w-full flex-1 mt-8 p-8 order-2 bg-white shadow-xl rounded-3xl sm:w-96 lg:w-full lg:order-1 lg:rounded-r-none'>
                    <div className='mb-7 pb-7 flex items-center border-b border-gray-300'>
                        <img src='https://res.cloudinary.com/williamsondesign/abstract-1.jpg' alt='' className='rounded-3xl w-20 h-20' />
                        <div className='ml-5'>
                            <span className='block text-2xl font-semibold'>Project + Task </span>
                        </div>
                    </div>
                    <ul className='mb-7 font-medium text-gray-500'>
                        <li className='flex text-lg mb-2'>
                            <img src='https://res.cloudinary.com/williamsondesign/check-grey.svg' />
                            <span className='ml-3'>
                                Config <span className='text-black'>Project</span>
                            </span>
                        </li>
                        <li className='flex text-lg mb-2'>
                            <img src='https://res.cloudinary.com/williamsondesign/check-grey.svg' />
                            <span className='ml-3'>
                                Config<span className='text-black'>Task</span>
                            </span>
                        </li>
                        <li className='flex text-lg'>
                            <img src='https://res.cloudinary.com/williamsondesign/check-grey.svg' />
                            <span className='ml-3'>
                                <span className='text-black'>Customised Dashboard : </span> Yes
                            </span>
                        </li>
                    </ul>
                    <button
                        onClick={() => {
                            handleCreateDashboard(1);
                        }}
                        className='flex justify-center items-center bg-indigo-600 rounded-xl py-5 px-4 text-center text-white text-xl'>
                        Choose Dashboard
                        <img src='https://res.cloudinary.com/williamsondesign/arrow-right.svg' className='ml-2' />
                    </button>
                </div>
                <div className='w-full flex-1 p-8 order-1 shadow-xl rounded-3xl bg-gray-900 text-gray-400 sm:w-96 lg:w-full lg:order-2 lg:mt-0'>
                    <div className='mb-8 pb-8 flex items-center border-b border-gray-600'>
                        <img src='https://res.cloudinary.com/williamsondesign/abstract-2.jpg' alt='' className='rounded-3xl w-20 h-20' />
                        <div className='ml-5'>
                            <span className='block text-3xl font-semibold text-white'>All</span>
                        </div>
                    </div>
                    <ul className='mb-10 font-medium text-xl'>
                        <li className='flex mb-6'>
                            <img src='https://res.cloudinary.com/williamsondesign/check-white.svg' />
                            <span className='ml-3'>
                                All features in <span className='text-white'>All dashboard</span>
                            </span>
                        </li>
                        <li className='flex mb-6'>
                            <img src='https://res.cloudinary.com/williamsondesign/check-white.svg' />
                            <span className='ml-3'>
                                Congif : <span className='text-white'>Yes</span>
                            </span>
                        </li>
                        <li className='flex'>
                            <img src='https://res.cloudinary.com/williamsondesign/check-white.svg' />
                            <span className='ml-3'>
                                Customize : <span className='text-white'></span> Yes
                            </span>
                        </li>
                    </ul>
                    <button
                        onClick={() => {
                            handleCreateDashboard(3);
                        }}
                        className='flex justify-center items-center bg-indigo-600 rounded-xl py-6 px-4 text-center text-white text-2xl'>
                        Choose Dashboard
                        <img src='https://res.cloudinary.com/williamsondesign/arrow-right.svg' className='ml-2' />
                    </button>
                </div>
                <div className='w-full flex-1 mt-8 p-8 order-3 bg-white shadow-xl rounded-3xl sm:w-96 lg:w-full lg:order-3 lg:rounded-l-none'>
                    <div className='mb-7 pb-7 flex items-center border-b border-gray-300'>
                        <img src='https://res.cloudinary.com/williamsondesign/abstract-3.jpg' alt='' className='rounded-3xl w-20 h-20' />
                        <div className='ml-5'>
                            <span className='block text-2xl font-semibold'>Task + Member</span>
                        </div>
                    </div>
                    <ul className='mb-7 font-medium text-gray-500'>
                        <li className='flex text-lg mb-2'>
                            <img src='https://res.cloudinary.com/williamsondesign/check-grey.svg' />
                            <span className='ml-3'>
                                Config <span className='text-black'> Task</span>
                            </span>
                        </li>
                        <li className='flex text-lg mb-2'>
                            <img src='https://res.cloudinary.com/williamsondesign/check-grey.svg' />
                            <span className='ml-3'>
                                Config <span className='text-black'>Member</span>
                            </span>
                        </li>
                        <li className='flex text-lg'>
                            <img src='https://res.cloudinary.com/williamsondesign/check-grey.svg' />
                            <span className='ml-3'>
                                <span className='text-black'>Customised Dashboard :</span> Yes
                            </span>
                        </li>
                    </ul>
                    <button
                        onClick={() => {
                            handleCreateDashboard(2);
                        }}
                        className='flex justify-center items-center bg-indigo-600 rounded-xl py-5 px-4 text-center text-white text-xl'>
                        Choose Dashboard
                        <img src='https://res.cloudinary.com/williamsondesign/arrow-right.svg' className='ml-2' />
                    </button>
                </div>
            </div>
        </main>
    );
};
export default selectDashboard;
