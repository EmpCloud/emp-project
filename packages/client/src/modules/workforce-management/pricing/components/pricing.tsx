import React, { useEffect, useState } from 'react';
import { getPlan } from '../api/get';
import toast from '../../../../components/Toster/index';
import Cookies from 'js-cookie';
import { selectPlan } from '../api/post';
import{ useRouter } from 'next/router';
import { HiArrowNarrowLeft } from "react-icons/hi";
const pricing = ({ stopLoading, startLoading }) => {
    const router = useRouter();

    const [plan, setPlan] = useState(null);
    const [adminPlan, setAdminPlan] = useState(Cookies.get('planName'));
    const [type, setType] = useState(router.query);

    useEffect(()=>{
        if(router.isReady){
            setType(router.query);
        }
    },[router.isReady])

    useEffect(() => {
        handleGetPlans();
    }, [adminPlan]);

    const handleSelectPlan = (event, planName, planId) => {
        Cookies.set('planName', planName);
        setAdminPlan(Cookies.get('planName'));
        startLoading();
        selectPlan(planName)
            .then(response => {
                if (response.data.statusCode == 200) {
                    stopLoading();
                    toast({
                        type: 'success',
                        message: response ? response.data.body.message : '',
                    });

                    Cookies.set('token', response.data.body.data.accessToken);
                    Cookies.set('adminData', JSON.stringify(response.data.body.data.filteredData));
                } else {
                    toast({
                        type: 'error',
                        message: response ? response.data.body.message : 'Error',
                    });
                    stopLoading();
                }
            })
            .catch(function ({ response }) {
                stopLoading();
                toast({
                    type: 'error',
                    message: response ? response.data.body.message : 'Something went wrong, Try again !',
                });
            });
            if(type.type === 'edit'){
                router.push('/w-m/dashboard');
            }else{
                router.push('/w-m/cofiguration');
            }
    };
    const handleGetPlans = () => {
        getPlan()
            .then(response => {
                if (response.data.body.status === 'success') {
                    setPlan(response.data.body.data);
                }
            })
            .catch(function (e) {
                toast({
                    type: 'error',
                    message: e.response ? e.response.data.message : 'Something went wrong, Try again !',
                });
            });
    };
    const planName = Cookies.get('planName');
    const allowedPlanNames = ['Basic', 'Gold', 'Premium'];
    return (
        <>
            <main className='max-w-6xl mx-auto pt-10 pb-36 px-8'>
                <div className='max-w-md mx-auto mb-14 text-center'>
                    <h1 className='text-4xl font-semibold mb-6 lg:text-5xl'>
                        <span className='text-indigo-600'>Price</span> Plans
                    </h1>
                </div>              
                {allowedPlanNames.includes(planName) && (
                    <a className='flex items-center cursor-pointer hover:text-brandBlue'>
                         <HiArrowNarrowLeft className='mr-2' />
                            <span onClick={() => { router.push("/w-m/dashboard") }}> Back to Dashboard</span>
                    </a>
                )}
                <div className='flex flex-col justify-between items-center lg:flex-row lg:items-start'>
                    {/* --------------------------- premium [2]--------------------------------- */}
                    <div className='w-full flex-1 mt-8 p-8 order-2 bg-white shadow-xl rounded-3xl sm:w-96 lg:w-full lg:order-1 lg:rounded-r-none'>
                        <div className='mb-7 pb-7 flex items-center border-b border-gray-300'>
                            <img src='https://res.cloudinary.com/williamsondesign/abstract-1.jpg' alt='' className='rounded-3xl w-20 h-20' />
                            <div className='ml-5'>
                                <span className='block text-2xl font-semibold'>{plan && plan[2].planName}</span>
                                <span>
                                    <span className='font-medium text-gray-500 text-xl align-top'>{plan && plan[2].currencyLogo}&thinsp;</span>
                                    <span className='text-3xl font-bold'>{plan && plan[2].planPrice}</span>
                                </span>
                                <span className='text-gray-500 font-medium'> /month </span>
                            </div>
                        </div>
                        <ul className='mb-7 font-medium text-gray-500'>
                            <li className='flex text-lg mb-2'>
                                <img src='https://res.cloudinary.com/williamsondesign/check-grey.svg' />
                                <span className='ml-3'>
                                    <span className='text-black'>No. of Users</span> allowed <span className='text-black'>{plan && plan[2].userFeatureCount}</span>
                                </span>
                            </li>
                            <li className='flex text-lg mb-2'>
                                <img src='https://res.cloudinary.com/williamsondesign/check-grey.svg' />
                                <span className='ml-3'>
                                    <span className='text-black'>No. of Project</span> allowed <span className='text-black'>{plan && plan[2].projectFeatureCount}</span>
                                </span>
                            </li>
                            <li className='flex text-lg mb-2'>
                                <img src='https://res.cloudinary.com/williamsondesign/check-grey.svg' />
                                <span className='ml-3'>
                                    <span className='text-black'>No. of Tasks</span> allower/project <span className='text-black'>{plan && plan[2].taskFeatureCount}</span>
                                </span>
                            </li>
                            <li className='flex text-lg'>
                                <img src='https://res.cloudinary.com/williamsondesign/check-grey.svg' />
                                <span className='ml-3'>
                                    <span className='text-black'>Subtask</span> allowed per task <span className='text-black'>{plan && plan[2].subTaskFeatureCount}</span>
                                </span>
                            </li>
                        </ul>
                        <div>
                            {plan && plan[2].planName === adminPlan ? (
                                <button disabled={true} className=' cursor-not-allowed w-full  flex justify-center items-center bg-green-600 rounded-xl py-5 px-4 text-center text-white text-xl'>
                                    Active
                                </button>
                            ) : (
                                <button
                                    onClick={event => {
                                        handleSelectPlan(event, plan[2].planName, plan[2]._id);
                                    }}
                                    className='flex justify-center items-center bg-indigo-600 rounded-xl py-5 px-4 text-center text-white text-xl'>
                                    Choose Plan
                                    <img src='https://res.cloudinary.com/williamsondesign/arrow-right.svg' className='ml-2' />
                                </button>
                            )}
                        </div>
                    </div>
                    {/*-------------------- gold [1]-------------------------------- */}
                    <div className='w-full z-[99] flex-1 p-8 order-1 shadow-xl rounded-3xl bg-white sm:w-96 lg:w-full lg:order-2 lg:mt-0 '>
                        <div className='mb-8 pb-8 flex items-center border-b border-gray-300'>
                            <img src='https://res.cloudinary.com/williamsondesign/abstract-2.jpg' alt='' className='rounded-3xl w-20 h-20' />
                            <div className='ml-5'>
                                <span className='block text-3xl font-semibold'>{plan && plan[1].planName}</span>
                                <span>
                                    <span className='font-medium text-gray-500 text-xl align-top'>{plan && plan[1].currencyLogo}&thinsp;</span>
                                    <span className='text-3xl font-bold'>{plan && plan[1].planPrice} </span>
                                </span>
                                <span className='text-gray-500 font-medium'> /month </span>
                            </div>
                        </div>
                        <ul className='mb-10 font-medium  text-gray-500 text-xl'>
                            <li className='flex text-lg mb-2'>
                                <img src='https://res.cloudinary.com/williamsondesign/check-grey.svg' />
                                <span className='ml-3'>
                                    <span className='text-black'>No. of Users</span> allowed <span className='text-black'>{plan && plan[1].userFeatureCount}</span>
                                </span>
                            </li>
                            <li className='flex text-lg mb-2'>
                                <img src='https://res.cloudinary.com/williamsondesign/check-grey.svg' />
                                <span className='ml-3'>
                                    <span className='text-black'>No. of Project</span> allowed <span className='text-black'>{plan && plan[1].projectFeatureCount}</span>
                                </span>
                            </li>
                            <li className='flex text-lg mb-2'>
                                <img src='https://res.cloudinary.com/williamsondesign/check-grey.svg' />
                                <span className='ml-3'>
                                    <span className='text-black'>No. of Tasks</span> allower/project <span className='text-black'>{plan && plan[1].taskFeatureCount}</span>
                                </span>
                            </li>
                            <li className='flex text-lg'>
                                <img src='https://res.cloudinary.com/williamsondesign/check-grey.svg' />
                                <span className='ml-3'>
                                    <span className='text-black'>Subtask</span> allowed per task <span className='text-black'>{plan && plan[1].subTaskFeatureCount}</span>
                                </span>
                            </li>
                        </ul>
                        <div>
                            {plan && plan[1].planName === adminPlan ? (
                                <button disabled={true} className=' cursor-not-allowed w-full flex justify-center items-center bg-green-600 rounded-xl py-5 px-4 text-center text-white text-xl'>
                                    Active
                                </button>
                            ) : (
                                <button
                                    onClick={event => {
                                        handleSelectPlan(event, plan[1].planName, plan[1]._id);
                                    }}
                                    className='flex justify-center items-center bg-indigo-600 rounded-xl py-5 px-4 text-center text-white text-xl'>
                                    Choose Plan
                                    <img src='https://res.cloudinary.com/williamsondesign/arrow-right.svg' className='ml-2' />
                                </button>
                            )}
                        </div>
                    </div>
                    {/* --------------------------------------- basic [3]------------------------------------------*/}
                    <div className='w-full z-99 flex-1 mt-8 p-8 order-3 bg-white shadow-xl rounded-3xl sm:w-96 lg:w-full lg:order-3 lg:rounded-l-none'>
                        <div className='mb-7 pb-7 flex items-center border-b border-gray-300'>
                            <img src='https://res.cloudinary.com/williamsondesign/abstract-3.jpg' alt='' className='rounded-3xl w-20 h-20' />
                            <div className='ml-5'>
                                <span className='block text-2xl font-semibold'>{plan && plan[0].planName}</span>
                                <span>
                                    <span className='font-medium text-gray-500 text-xl align-top'>{plan && plan[0].currencyLogo}&thinsp;</span>
                                    <span className='text-3xl font-bold'>{plan && plan[0].planPrice}</span>
                                </span>
                                <span className='text-gray-500 font-medium'> /month </span>
                            </div>
                        </div>
                        <ul className='mb-7 font-medium text-gray-500'>
                            <li className='flex text-lg mb-2'>
                                <img src='https://res.cloudinary.com/williamsondesign/check-grey.svg' />
                                <span className='ml-3'>
                                    <span className='text-black'>No. of Users</span> allowed <span className='text-black'>{plan && plan[0].userFeatureCount}</span>
                                </span>
                            </li>
                            <li className='flex text-lg mb-2'>
                                <img src='https://res.cloudinary.com/williamsondesign/check-grey.svg' />
                                <span className='ml-3'>
                                    <span className='text-black'>No. of Project</span> allowed <span className='text-black'>{plan && plan[0].projectFeatureCount}</span>
                                </span>
                            </li>
                            <li className='flex text-lg mb-2'>
                                <img src='https://res.cloudinary.com/williamsondesign/check-grey.svg' />
                                <span className='ml-3'>
                                    <span className='text-black'>No. of Tasks</span> allower/project <span className='text-black'>{plan && plan[0].taskFeatureCount}</span>
                                </span>
                            </li>
                            <li className='flex text-lg'>
                                <img src='https://res.cloudinary.com/williamsondesign/check-grey.svg' />
                                <span className='ml-3'>
                                    <span className='text-black'>Subtask</span> allowed per task <span className='text-black'>{plan && plan[0].subTaskFeatureCount}</span>
                                </span>
                            </li>
                        </ul>
                        <div>
                            {plan && plan[0].planName === adminPlan ? (
                                <button disabled={true} className=' cursor-not-allowed w-full flex justify-center items-center bg-green-600 rounded-xl py-5 px-4 text-center text-white text-xl'>
                                    Active
                                </button>
                            ) : (
                                <button
                                    onClick={event => {
                                        handleSelectPlan(event, plan[0].planName, plan[0]._id);
                                    }}
                                    className='flex justify-center items-center bg-indigo-600 rounded-xl py-5 px-4 text-center text-white text-xl'>
                                    Choose Plan
                                    <img src='https://res.cloudinary.com/williamsondesign/arrow-right.svg' className='ml-2' />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};
export default pricing;
