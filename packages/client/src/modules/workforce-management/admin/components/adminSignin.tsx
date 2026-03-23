import React, { useEffect, useState } from 'react';
import Router, { useRouter } from 'next/router';
import validate from 'validate.js';
import Cookies from 'js-cookie';
import toast from '@COMPONENTS/Toster/index';
import { loginAdmin } from '../api/post';
import { FloatingPasswordTextfield } from '../../../../formcomponent/FloatingPasswordTextfield';
import FloatingTextfield from '../../../../formcomponent/FloatingTextfield';
import { displayErrorMessage } from '@HELPER/function';
import { emailSchema, requiredSchema } from '@HELPER/schema';
import getFingerprint from '@HELPER/getFingerprint';
import { jwtDecode } from 'jwt-decode';
import { fetchProfile } from '../api/get';
// import {
//   getAndRedirectGoogle,
//   getAndRedirectFacebook,
//   getAndRedirectTwitter,
// } from "@HELPER/socialhelper";
import { CgAsterisk } from 'react-icons/cg';
import { adminConfig } from '@WORKFORCE_MODULES/cofiguration/api/post';
import Link from 'next/link';
import Image from 'next/image';
import { FiMail } from 'react-icons/fi';
import { getPermisssion } from '../api/get';
import { useSharedStateContext } from "../../../../helper/function"
// import Head from 'next/head';
export const Index = ({ startLoading, stopLoading }) => {
    const { sharedState, updateSharedState , profileData,setProfileData} = useSharedStateContext();

    const router = useRouter();
    const [showIcon, setShowIcon] = useState(false);
    const [isLoader, setIsLoader] = useState(false);
    //remember-me
    const [rememberMe, setRememberMe] = useState(Cookies.get('rememberMe') ? Cookies.get('rememberMe') : false);
    const allConfig = ['projectFeature', 'taskFeature', 'subTaskFeature', 'invitationFeature'];
    useEffect(() => {
        if (rememberMe) {
            setFormState(formState => ({
                ...formState,
                values: {
                    ...formState.values,
                    email: Cookies.get('email') || '',
                    password: Cookies.get('password') || '',
                },
            }));
        }

        // setRememberMe(Cookies.get("rememberMe") || "");
        if (Cookies.get('token') != null) Router.push('/w-m/dashboard');
    }, []);
    const initialState = {
        isValid: false,
        values: {
            email: null,
            password: null,
        },
        touched: {},
        errors: { email: null, password: null },
    };
    const schema = {
        email: requiredSchema,
        password: requiredSchema,
    };
    const [formState, setFormState] = useState({ ...initialState });
    useEffect(() => {
        const errors = validate(formState.values, schema);
        if (!formState.values.email) {
            errors.email = 'Email or Username is required';
        } 
        setFormState(prevFormState => ({
            ...prevFormState,
            isValid: !errors,
            errors: errors || {},
        }));
    }, [formState.values, formState.isValid]);
    useEffect(() => {
        // document.querySelector('body').classList.add('bg-slate-50');
    }, [showIcon]);
    const handleChangeIcon = event => {
        event.preventDefault();
        setShowIcon(!showIcon);
    };
    useEffect(() => { }, [isLoader]);
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
        loginAdmin(formState.values, getFingerprint()).then(response => {
            if (response.data.statusCode == 200) {
                const exp = jwtDecode(response.data.body.data.accessToken).exp;
                const expiresAt = exp ? new Date(exp * 1000) : undefined;
                Cookies.set('token', response.data.body.data.accessToken, { expires: expiresAt });
                Cookies.set('adminData', JSON.stringify(response.data.body.data.userData));
                Cookies.set('id', response.data?.body?.data?.userData._id);
                Cookies.set('isAdmin', response.data.body.data.userData.isAdmin);
                Cookies.set('isEmpAdmin', response.data.body.data.userData.isEmpMonitorUser);
                Cookies.set('planName', response.data.body.data.userData.planName);
                Cookies.set('profilePic',response.data.body.data.userData.profilePic);
                updateSharedState(response.data.body.data.userData.profilePic);
                handleProfileData();

                if (!response.data.body.data.userData.isConfigSet) {
                    handleConfigSet();
                }
                if (response.data.body.data.userData.isConfigSet) {
                    Router.push('/w-m/dashboard');
                }

                // Router.push('/w-m/dashboard');
                setTimeout(() => {
                    Cookies.remove('token');
                    Cookies.remove('adminData');
                    Cookies.remove('id');
                    Cookies.remove('isAdmin');
                    Cookies.remove('isEmpAdmin');
                    Router.push('/w-m/admin/sign-in');
                }, 86160000); // logout after 23hrs 58min
            } else {
                toast({
                    type: 'error',
                    message: response ? response.data.body.message : 'Something went wrong, Try again !',
                });
                stopLoading();
            }
            if (rememberMe) {
                Cookies.set('email', formState.values.email);
                Cookies.set('password', formState.values.password);
                Cookies.set('rememberMe', true);
            } else {
                Cookies.remove('email');
                Cookies.remove('password');
                Cookies.remove('rememberMe');
            }
        });

        stopLoading();
    };
    const handleProfileData = () => {
        fetchProfile().then(response => {
          if (response && response.data?.body.status === 'success') {
            // Create a context with an initial value (undefined in this case)
            setProfileData(response.data.body.data);
            
            const permissionData = response.data.body.data.permissionConfig;
            Cookies.set('permission', JSON.stringify(permissionData));
          }
        });
      };
    const handleConfigSet = () => {
        adminConfig(allConfig)
            .then(response => {
                if (response.data.statusCode == 200) {
                    Cookies.remove('token');
                    Cookies.set('token', response.data.body.data.accessToken);
                    Router.push('/w-m/dashboard');
                }
            })
            .catch(function (response) {
                toast({
                    type: 'error',
                    message: response ? response.data.body.message : 'Something went wrong, Try again !',
                });
            });
    };
    const handleRememberMeChange = () => {
        setRememberMe(!rememberMe);
    };
    return (
        <>
            <div className="login-8">
                <div className="w-[90%] md:w-[70%]">
                    <div className="flex justify-center login-box">
                        <div className=" w-[100%] lg:w-[54%] !py-[5rem] pt-10 form-info text-base">
                            <div className="form-section">
                                <div className="logo clearfix flex justify-center">
                                    <Link href="/">
                                        <Image height={160} width={160} src="/imgs/logo.jpg" alt="logo" />
                                    </Link>
                                </div>
                                <h3>Sign Into Your Account</h3>
                                <div className="login-inner-form mb-0">
                                    <form onSubmit={handleSumbmit}>
                                        <div className="form-group form-box">
                                            <FloatingTextfield 
                                                className="form-control w-full" 
                                                aria-label="Email Address"
                                                type='text'
                                                error={hasError('email')}
                                                errorMsg={displayErrorMessage(formState.errors.email)}
                                                name='email'
                                                label={''}
                                                value={formState.values.email || ''}
                                                onChange={handleChange}
                                                placeholder={'User Name / Email Address'}
                                            />
                                            <i><FiMail className="h-5 w-5 text-defaultTextColor"/></i>
                                        </div>
                                        <div className="form-group form-box">
                                            <FloatingPasswordTextfield 
                                                type="password" 
                                                className="form-control w-full" 
                                                autoComplete="off" 
                                                aria-label="Password"
                                                name='password'
                                                state={showIcon}
                                                label={''}
                                                value={formState.values.password || ''}
                                                onClick={handleChangeIcon}
                                                onChange={handleChange}
                                                error={hasError('password')}
                                                errorMsg={displayErrorMessage(formState.errors.password)}
                                                onPaste={undefined}
                                                margin={'mt-7'}
                                                topPosition={'-top-1'}
                                                placeholder={'Password'}
                                            />
                                            {/* <i className="flaticon-password"></i> */}
                                            {/* <i className="fa-solid fa-lock text-2xl"></i> */}
                                        </div>
                                        <div className="checkbox form-group form-box">
                                            <div className="form-check checkbox-theme">
                                                <input className="form-check-input" value=""
                                                    id='rememberMeCheck'
                                                    type='checkbox'
                                                    checked={rememberMe}
                                                    onChange={handleRememberMeChange}
                                                     />
                                                <label className="form-check-label cursor-pointer" htmlFor="rememberMeCheck" >Remember me</label>
                                            </div>
                                            <span className=' cursor-pointer font-semibold text-[#2b5fc0] float-right' onClick={() => router.push('/w-m/admin/forgot-password')}>Forgot Password</span>
                                        </div>
                                        <div className="form-group mb-0">
                                            <button
                                                type='submit'
                                                className={`text-md w-full flex justify-center py-1 px-4 border border-transparent font-medium rounded text-[#1f3a78] 
                                        ${!formState.isValid ? 'opacity-50' : 'opacity-100'} 
                                        ${!formState.isValid ? '' : 'hover:bg-gradient-to-r hover:text-white hover:from-[#239ed9] hover:to-[#1f3a78] hover:drop-shadow-none'
                                                    } bg-blue-400 focus:outline-none shadow-lg drop-shadow-[0_5px_5px_rgba(0,0,0,0.22)] transition-all  
                                          `}
                                                disabled={!formState.isValid}
                                            >Login</button>
                                        </div>
                                        <p className="">Don&apos;t have an account?
                                        <span className=' cursor-pointer font-semibold text-[#2b5fc0]' 
                                        onClick={() => router.push('/w-m/admin/sign-up')}> 
                                        {" "} Register here
                                        </span>
                                        </p>
                                <p className=' !mt-0 pt-1 '>
                                     Didn’t get verification Mail?
                                     <span
                                        onClick={() => router.push('/w-m/admin/resendMail')}
                                        className='cursor-pointer font-semibold text-[#2b5fc0]'>
                                        {' '}
                                        Generate
                                    </span>
                                </p>
                            <p className=' !mt-0 pt-1'>
                                Manager/Teamlead/Employee?{' '}
                                 <span
                                    onClick={() => router.push('/w-m/member/login')}
                                    className='cursor-pointer font-semibold text-[#2b5fc0]'>
                                    {' '}
                                    Login
                                </span>
                            </p>
                                    </form>
                                </div>
                            </div>
                        </div>
                        {/* <div className='bg-img'> */}
                        <div className=" w-[46%] bg-img">
                            <div className="info">
                                <div className="btn-section clearfix">
                                <span className=" text-xl font-semibold mr-2 text-white">Admin</span>
                                    <span className="link-btn active btn-1 default-bg mr-2 cursor-pointer" onClick={() => router.push('/w-m/admin/sign-in')}>Login</span>
                                    <span className="link-btn btn-1 cursor-pointer" onClick={() => router.push('/w-m/admin/sign-up')}>Register</span>
                                </div>
                                <div className="info-text">
                                    <div className="waviy">
                                        <span style={{ "--i": "1" }}>W</span>
                                        <span style={{ "--i": "2" }}>e</span>
                                        <span style={{ "--i": "3" }}>l</span>
                                        <span style={{ "--i": "4" }}>c</span>
                                        <span style={{ "--i": "5" }}>o</span>
                                        <span style={{ "--i": "6" }}>m</span>
                                        <span style={{ "--i": "7" }}>e</span>
                                        <span className="color-yellow ml-2" style={{ "--i": "8" }}>t</span>
                                        <span className="color-yellow mr-2" style={{ "--i": "9" }}>o</span>
                                        <span style={{ "--i": "10" }}></span>
                                        <span style={{ "--i": "11" }}>E</span>
                                        <span style={{ "--i": "12" }}>M</span>
                                        <span style={{ "--i": "13" }}>P</span>
                                    </div>
                                    <h3 className=' font-black text-[20px] text-white'>
                                        Elevate Your Workflow, Master Your Projects
                                    </h3>
                                    <p className=' text-base'>Empower your team and boost their efficiency with EmpMonitor&apos;s intuitive project management solution, designed to enhance collaboration and streamline project
                                        workflows effectively.</p>
                                </div>
                                <ul className="social-list">
                                    <li>
                                        <a href="https://www.facebook.com/EmpMonitor/" className="facebook-bg">
                                            <i className="fa-brands fa-facebook text-xl"></i>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="https://twitter.com/empmonitor" className="twitter-bg">
                                            <i className="fa-brands fa-x-twitter text-xl"></i>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="https://www.youtube.com/channel/UCh2X5vn5KBkN-pGY5PxJzQw" className="google-bg">
                                            <i className="fa-brands fa-youtube text-xl"></i>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="https://www.linkedin.com/company/empmonitor/" className="linkedin-bg">
                                            <i className="fa-brands fa-linkedin text-xl"></i>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="skype:empmonitorsupport" className="skype-bg">
                                            <i className="fa-brands fa-skype text-xl"></i>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        {/* </div> */}
                    </div>
                </div>
            </div>
        </>
    );
};
export default Index;