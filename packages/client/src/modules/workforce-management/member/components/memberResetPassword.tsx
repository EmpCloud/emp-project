import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import validate from 'validate.js';
import { FloatingPasswordTextfield } from '../../../../components/FloatingPasswordTextfield';
import { displayErrorMessage } from '../../../../helper/function';
import toast from '../../../../components/Toster/index';
import { passwordSchema, confirmPasswordSchema, requiredSchema } from '../../../../helper/schema';
import FloatingTextfield from '../../../../components/FloatingTextfield';
import { resetPasswordMember } from '../api/put';
export const Index = ({ startLoading, stopLoading }) => {
    const router = useRouter();
    const { query } = useRouter();
    const initialState = {
        isValid: false,
        values: {},
        touched: {},
        errors: { password: null },
    };
    const schema = {
        password: passwordSchema,
        confirmPassword: confirmPasswordSchema,
        // orgId: requiredSchema,
    };
    const [formState, setFormState] = useState({ ...initialState });
    useEffect(() => {}, [query]);
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
    }, []);
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
    const handleSumbmit = e => {
        e.preventDefault();
        startLoading();
        resetPasswordMember({
            orgId:query.orgId,
            email: query.userMail,
           verifyToken: query.verifyToken,
            newPassword: formState.values.password,
        }).then(response => {
            if (response.data.statusCode === 200) {
                toast({
                    type: 'success',
                    message: response ? response.data.body.message : 'Something went wrong, Try again !',
                });
                setTimeout(() => {
                router.push('/w-m/admin/sign-in');
            }, 2000);
            } 
            else {
                toast({
                    type: 'error',
                    message: response ? response?.data?.body?.error?.details[0]?.message||response?.data?.body?.message : 'Something went wrong, Try again !',
                });
                stopLoading();
            }
            // setTimeout(() => {
            //     router.push('/w-m/admin/sign-in');
            // }, 2000);
        }).catch((error)=>{
            toast({
                type: 'error',
                message: error ? error?.data?.body?.error?.details[0]?.message||error?.data?.body?.message: 'Something went wrong, Try again !',
            });
            stopLoading();
        });
        stopLoading();
    };
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
    return (
        <div className='font-inter bg-slate-50'>
            <section className='mx-auto'>
                <div className='flex place-content-center mt-8'>
                    <img className='w-48' src='/imgs/logo.jpg' alt='EmpMonitor' />
                </div>
            </section>
            <section className=' mx-auto flex justify-center'>
                {/*-- container -- */}
                <div className='block place-content-center m-6 mb-20 w-[500px]  drop-shadow-xl  bg-white rounded-xl p-10'>
                    <h2 className='text-left text-defaultTextColor font-bold text-2xl'>Reset password</h2>
                    <form onSubmit={handleSumbmit}>
                        <div className='mt-8'>
                            {/* <div className='wrapper relative'>
                                <FloatingTextfield
                                    error={hasError('orgId')}
                                    errorMsg={displayErrorMessage(formState.errors.orgId)}
                                    name='orgId'
                                    label={'Your organization Id*'}
                                    value={formState.values.orgId || ''||query.orgId}
                                    onChange={handleChange}
                                />
                            </div> */}
                            <div className='wrapper relative'>
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
                            </div>
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
                                />
                            </div>
                        </div>
                        <button type='submit' className='mt-8 button' disabled={!formState.isValid}>
                            Reset Password
                        </button>
                        <div className='text-center mt-10'>
                            <p className='text-defaultTextColor'>
                                back to account?
                                <a onClick={() => router.push('/w-m/admin/sign-in')} className='text-brandBlue hover:text-lightBlue transition-all cursor-pointer'>
                                    {' '}
                                    Login
                                </a>
                            </p>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    );
};
export default Index;
