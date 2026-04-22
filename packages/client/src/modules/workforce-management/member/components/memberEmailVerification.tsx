/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { memberEmailVerification, setPasswordMember } from '../api/post';
import toast from '@COMPONENTS/Toster/index';
import { FloatingPasswordTextfield } from '@COMPONENTS/FloatingPasswordTextfield';
import FloatingTextfield from '@COMPONENTS/FloatingTextfield';
import { displayErrorMessage } from '@HELPER/function';
import { confirmPasswordSchema, emailSchema, passwordSchema, requiredSchema } from '@HELPER/schema';
import validate from 'validate.js';
import _ from 'lodash';

export function index({ startLoading, stopLoading }) {
    const router = useRouter();
    const [status, setStatus] = useState(true);
    const [email, setEmail] = useState(null);
    const { query } = useRouter();
    const [emailVerify , setEmailVerify] = useState('')

    useEffect(() => {
        if (query.userMail && query.activationLink && query.orgId && query.invitation) {
            setFormState(formState => ({
                ...formState,
                values: {
                    ...formState.values,
                    userMail: query.userMail,
                    orgId: query.orgId,
                },
                touched: {
                    ...formState.touched,
                    userMail: true,
                    orgId: true,
                },
            }));

            let data = {
                userMail: query.userMail,
                activationLink: query.activationLink,
                orgId: query.orgId,
                invitation: +query.invitation,
            };
            memberEmailVerification(data)
                .then(response => {
                    if (response.data.statusCode === 200) {
                        setStatus(true);
                        setEmail(query.userMail);
                        toast({
                            type: 'success',
                            message: response ? response.data.body.message : null,
                        });
                    } else {
                        setStatus(false);
                        toast({
                            type: 'error',
                            message: response ? response.data.body.message : null,
                        });
                        // setTimeout(() => {
                        //     router.push('/w-m/member/login');
                        // }, 2000);
                        
                            setEmailVerify(response.data.body.message)
                       
                    }
                })
                .catch(function (e) {
                    toast({
                        type: 'error',
                        message: e.response ? e.response.data.message : 'Something went wrong, Try again !',
                    });
                    // setTimeout(() => {
                    //     router.push('/w-m/member/login');
                    // }, 2000);
                });
        }
    }, [query]);
    const [showIcon, setShowIcon] = useState(false);
    const initialState = {
        isValid: false,
        values: { userMail: null, password: null, orgId: null },
        touched: {},
        errors: { userMail: null, password: null, orgId: null },
    };
    const schema = {
        userMail: emailSchema,
        password: passwordSchema,
        orgId: requiredSchema,

        confirmPassword: confirmPasswordSchema,
    };
    const [formState, setFormState] = useState({ ...initialState });
    useEffect(() => {
        const errors = validate(formState.values, schema);
        setFormState(prevFormState => ({
            ...prevFormState,
            isValid: !errors,
            errors: errors || {},
        }));
    }, [formState.values, formState.isValid]);
    useEffect(() => {
        // document.querySelector('body').classList.add('bg-slate-50');
    }, [showIcon]);

    const handleChange = event => {
        event.persist();
        setFormState(formState => ({
            ...formState,
            values: {
                ...formState.values,
                [event.target.name]: event.target.value,
            },
            touched: {
                ...formState.touched,
                [event.target.name]: true,
            },
        }));
    };
    const hasError = field => !!(formState.touched[field] && formState.errors[field]);
    const [visibility, setVisibility] = useState({
        password: false,
        confirmPassword: false,
    });
    const handleClickShowPassword = () => {
        setVisibility({ ...visibility, password: !visibility.password });
    };
    const handleClickShowConfirmPassword = () => {
        setVisibility({
            ...visibility,
            confirmPassword: !visibility.confirmPassword,
        });
    };
    const handleSumbmit = event => {
        event.preventDefault();
        setPasswordMember({
            ..._.omit({ ...formState.values }, ['confirmPassword']),
        })
            .then(response => {
                if (response.data.statusCode == 200) {
                    toast({
                        type: 'success',
                        message: response ? response.data.body.message : null,
                    });
                    setTimeout(() => {
                        router.push('/w-m/member/login');
                    }, 2000);
                }
            })
            .catch(function (e) {
                toast({
                    type: 'error',
                    message: e.response ? e.response.data.message : 'Something went wrong, Try again !',
                });
            });
    };
     const handlePaste = (e) =>{
        e.preventDefault()
    } 
    return (
        <>
            {status? (
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
                                    <img className='sm:h-20 h-20 md:h-20 -mr-7' src='/imgs/email-verified.svg' alt='Verified' />
                                </div>
                                <p
                                    className='text-center font-bold w-full
            text-2xl sm:my-5 my-1 text-darkTextColor'>
                                    Successfully verified
                                </p>
                                <p className='text-center m-auto text-base text-lightTextColor w-full'>
                                    Your email id <span className='text-defaultTextColor font-bold'>{email}</span> has been successfully verified.Kindly set password
                                </p>
                                 <div className='text-center mt-6'>
                                    {/* <a onClick={() => router.push('/w-m/member/login')} className='button items-center xs:w-full'> */}
                                    {/* Login */}
                                    {/* </a> */}

                                    <form onSubmit={handleSumbmit}>
                                        <div className='mt-4'>
                                            <div className='mt-2'>
                                            <FloatingTextfield
                                                type='text'
                                                error={hasError('orgId')}
                                                errorMsg={displayErrorMessage(formState.errors.orgId)}
                                                name='orgId'
                                                disabled={true}
                                                label={'Organization Id*'}
                                                value={formState.values.orgId || ''}
                                                onChange={handleChange}
                                                />
                                                </div>
                                                <div className='mt-5'>
                                            <FloatingTextfield
                                                type='email'
                                                disabled={true}
                                                error={hasError('userMail')}
                                                errorMsg={displayErrorMessage(formState.errors.userMail)}
                                                name='userMail'
                                                label={'Your work email address*'}
                                                value={formState.values.userMail || ''}
                                                onChange={handleChange}
                                                />
                                                </div>
                                            <div className='mt-5 wrapper relative'>
                                                <FloatingPasswordTextfield
                                                    name='password'
                                                    state={visibility.password}
                                                    label={'Your password'}
                                                    value={formState.values.password || ''}
                                                    onClick={handleClickShowPassword}
                                                    onChange={handleChange}
                                                    error={hasError('password')}
                                                    errorMsg={displayErrorMessage(formState.errors.password)}
                                                />
                                            </div>{' '}
                                            <div className='mt-5 wrapper relative'>
                                                <FloatingPasswordTextfield
                                                    name='confirmPassword'
                                                    state={visibility.confirmPassword}
                                                    label={'Confirm password'}
                                                    value={formState.values.confirmPassword || ''}
                                                    onClick={handleClickShowConfirmPassword}
                                                    onChange={handleChange}
                                                    error={hasError('confirmPassword')}
                                                    errorMsg={displayErrorMessage(formState.errors.confirmPassword)}
                                                    onPaste={(e) => handlePaste(e)}
                                                />
                                            </div>
                                        </div>

                                        <button type='submit' className='mt-8 button' disabled={!formState.isValid}>
                                            Set password
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <>
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
                                        <img className='sm:h-20 h-20 md:h-20 -mr-7' src='/imgs/email-verified.svg' alt='Verified' />
                                    </div>
                                    <p
                                        className='text-center font-bold w-full
            text-2xl sm:my-5 my-1 text-darkTextColor'>
                                        {emailVerify?emailVerify:"Successfully Removed"}
                                    </p>
                                   {emailVerify?null:<> <p className='text-center m-auto text-base text-lightTextColor w-full'>
                                        Your email id <span className='text-defaultTextColor font-bold'>{email}</span> has been successfully removed. If done by mistake or wish to join WM again.....
                                    </p>
                                    <div className='text-center mt-10'>
                                        {/* <a onClick={() => router.push('/w-m/member/login')} className='button items-center xs:w-full'> */}
                                        {/* Login */}
                                        {/* </a> */}
                                        <button type='submit' className='mt-8 button' disabled={!formState.isValid}>
                                            Re-Verify
                                        </button>
                                    </div></>}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
export default index;
