/* eslint-disable react-hooks/rules-of-hooks */
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import toast from '@COMPONENTS/Toster/index';
import { adminEmailVerificationApi } from '../api/post';
const adminEmailVerification = ({ startLoading, stopLoading }) => {
    const router = useRouter();
    const [status, setStatus] = useState(false);
    const [email, setEmail] = useState(null);
    const { query } = useRouter();
    useEffect(() => {
        startLoading();
        if (query.adminMail && query.activationLink && query.orgId) {
            let data = {
                adminMail: query.adminMail,
                activationLink: query.activationLink,
                orgId: query.orgId,
            };
            adminEmailVerificationApi(data)
                .then(response => {
                    if (response.data.statusCode == 200) {
                        setEmail(query.userMail);
                        setStatus(true);
                        toast({
                            type: 'success',
                            message: response ? response.data.body.message : null,
                        });
                    } else {
                        toast({
                            type: 'error',
                            message: response ? response.data.body.message : null,
                        });
                        setTimeout(() => {
                            router.push('/w-m/admin/sign-in');
                        }, 2000);
                    }
                })
                .catch(function (e) {
                    toast({
                        type: 'error',
                        message: e.response ? e.response.data.message : 'Something went wrong, Try again !',
                    });
                    setTimeout(() => {
                        router.push('/w-m/admin/sign-in');
                    }, 2000);
                });
        }
        stopLoading();
    }, [query]);
    return (
        <>
            {status ? (
                <div className='font-inter'>
                    <section className='mx-auto'>
                        <div className='flex place-content-center mt-8'>
                            <img className='w-48' src='https://empcloud.com/wp-content/uploads/2024/10/EMPCloud-New-Logo-colored-1200x280.webp' alt='EmpMonitor' />
                        </div>
                    </section>
                    <div className='container m-auto'>
                        <div className='flex flex-col justify-center  m-auto items-center sm:w-1/2 w-full'>
                            <div className='p-20 rounded-2xl bg-white drop-shadow-xl m-5'>
                                <div className='flex justify-center'>
                                    <img className='sm:h-28 h-20 md:h-40 -mr-7' src='/imgs/email-verified.svg' alt='Verified' />
                                </div>
                                <p
                                    className='text-center font-bold w-full
                                                text-2xl sm:my-5 my-1 text-darkTextColor'>
                                    Successfully verified
                                </p>
                                <p className='text-center m-auto text-base text-lightTextColor w-full'>
                                    Your email id <span className='text-defaultTextColor font-bold'>{email}</span> has been successfully verified. Please login.
                                </p>
                                <div className='text-center mt-10'>
                                    <a onClick={() => router.push('/w-m/admin/sign-in')} className='button items-center xs:w-full cursor-pointer'>
                                        Login
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <></>
            )}
        </>
    );
};
export default adminEmailVerification;
