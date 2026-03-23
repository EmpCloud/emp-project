/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react';
import { passwordSchema, confirmPasswordSchema } from '@HELPER/schema';
import { changeAdminPassword, changeUserPassword } from './../api/put';
import validate from 'validate.js';
import toast from './../../../../components/Toster/index';
import Cookies from 'js-cookie';
import { displayErrorMessage } from '@HELPER/function';
import { ChangePasswordField } from '@COMPONENTS/ChangePasswordTextField';

const resetPassword = () => {
    const initialState = {
        isValid: false,
        values: { oldPassword: '', password: '', confirmPassword: '' },
        touched: {},
        errors: { email: null, password: null, confirmPassword: null },
    };
    const schema = {
        oldPassword: passwordSchema,
        password: passwordSchema,
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
    const handleSubmit = e => {
        e.preventDefault();
        if( Cookies.get('isAdmin') === 'true'){
        changeAdminPassword({
            oldPassword: formState.values.oldPassword,
            newPassword: formState.values.password,
        }).then(response => {
            if (response.data.statusCode == 200) {
                toast({
                    type: 'success',
                    message: response ? response.data.body.message : 'Something went wrong, Try again !',
                });
                setFormState(initialState);
                setOpen(false);
            } else {
                toast({
                    type: 'error',
                    message: response ? response.data.body.message : 'Something went wrong, Try again !',
                });
                setFormState(initialState);
            }
        });
    }else{
        
        changeUserPassword({
            oldPassword: formState.values.oldPassword,
            newPassword: formState.values.password,
        }).then(response => {
            if (response.data.statusCode === 200) {
                toast({
                    type: 'success',
                    message: response ? response.data.body.message : 'Something went wrong, Try again !',
                });
                setFormState(initialState);
                setOpen(false);
            } else {
                toast({
                    type: 'error',
                    message: response ? response.data.body.message : 'Something went wrong, Try again !',
                });
                setFormState(initialState);
            }
        });
    }
    };
    const [visibility, setVisibility] = useState({
        password: false,
        confirmPassword: false,
    });
    const handleClickShowOldPassword = () => {
        setVisibility({
            ...visibility,
            oldPassword: !visibility.oldPassword,
        });
    };
    const handleClickShowPassword = () => {
        setVisibility({ ...visibility, password: !visibility.password });
    };
    const handleClickShowConfirmPassword = () => {
        setVisibility({
            ...visibility,
            confirmPassword: !visibility.confirmPassword,
        });
    };

    const [open, setOpen] = useState(false);
    return (
        <>
            <div className='flex items-center gap-5 sm:flex-nowrap flex-wrap'>
                <button
                    className='small-button items-center xs:w-full py-2 flex h-9'
                    onClick={() => {
                        setOpen(true);
                        setFormState(initialState);
                    }}>
                    Change Password
                </button>
            </div>

            {open && (
                <form onSubmit={handleSubmit} style={{ padding: '0px -3000px 0px 0px' }}>
                    <div className='justify-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-[999] outline-none focus:outline-none'>
                        <div className='relative my-2  md:w-4/12 z-50 sm:w-[!20rem]'>
                            {/*content*/}
                            <div className='border-0 mb-7 sm:mt-8 rounded-2xl shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none'>
                                {/*header*/}
                                {/*body*/}
                                <div className='relative sm:px-3  md:p-6 flex-auto'>
                                    <button
                                        className='text-lightGrey hover:text-darkTextColor absolute -right-2 -top-2 rounded-full bg-veryLightGrey  uppercase  text-sm outline-none focus:outline-none p-1 ease-linear transition-all duration-150'
                                        type='button'
                                        onClick={() => {
                                            setOpen(false);
                                        }}>
                                        <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
                                            <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
                                        </svg>
                                    </button>
                                    <div className='rounded-lg bg-white'>
                                        <div className=''>
                                            <h1 className='heading-medium text-center'>Reset Password</h1>
                                            <div className='lg:flex flex items-center justify-center gap-4 lg:gap-7 mt-4lg:m-2 m-5'>
                                                <div className='lg:basis-2/3 lg:m-0 m-5' style={{ margin: '10px' }}>
                                                    <div className='input_box flex flex-col lg:w-3/2'>
                                                        <div className='wrapper relative'>
                                                            <ChangePasswordField
                                                                name='oldPassword'
                                                                state={visibility.oldPassword}
                                                                label={'Your password'}
                                                                onCopy={(e) => e.preventDefault()} 
                                                                value={formState.values.oldPassword || ''}
                                                                onClick={handleClickShowOldPassword}
                                                                onChange={handleChange}
                                                                error={hasError('oldPassword')}
                                                                errorMsg={displayErrorMessage(formState.errors.oldPassword)}
                                                            />
                                                        </div>

                                                        <div className='wrapper relative mt-5'>
                                                            <ChangePasswordField
                                                                name='password'
                                                                state={visibility.password}
                                                                label={'New Password'}
                                                                value={formState.values.password || ''}
                                                                onClick={handleClickShowPassword}
                                                                onChange={handleChange}
                                                                onCopy={(e) => e.preventDefault()} 
                                                                error={hasError('password')}
                                                                errorMsg={displayErrorMessage(formState.errors.password)}
                                                            />
                                                        </div>

                                                        <div className='wrapper relative mt-5'>
                                                            <ChangePasswordField
                                                                name='confirmPassword'
                                                                state={visibility.confirmPassword}
                                                                label={'Confirm password'}
                                                                value={formState.values.confirmPassword || ''}
                                                                onClick={handleClickShowConfirmPassword}
                                                                onChange={handleChange}
                                                                onCopy={(e) => e.preventDefault()} 
                                                                error={hasError('confirmPassword')}
                                                                errorMsg={displayErrorMessage(formState.errors.confirmPassword)}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='lg:flex flex items-center justify-center mx-20'>
                                            <button type='submit' disabled={!formState.isValid} className='button items-center xs:w-full flex sm:text-md text-sm py-2 lg:px-8 lg:my-0 my-3'>
                                                <span className=''>Update Password</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            className='opacity-25 fixed inset-0 z-40 bg-black'
                            onClick={() => {
                                setOpen(false);
                            }}></div>
                    </div>
                </form>
            )}
        </>
    );
};

export default resetPassword;
