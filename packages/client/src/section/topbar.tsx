/* eslint-disable react-hooks/rules-of-hooks */
'use client'
import React, { useEffect, useState } from 'react';
import ToolTip from '../components/ToolTip';
import DropDown from '../components/DropDown';
import Notification from '../components/Notification';
import toast from '../components/Toster/index';
import { fetchNotification } from '@WORKFORCE_MODULES/notification/api/get';
import { HiFlag, HiOutlineChatAlt2 } from 'react-icons/hi';
import { IoContractOutline, IoSettingsOutline } from 'react-icons/io5';
import { AiOutlineUser } from 'react-icons/ai';
import { HiOutlineLogout } from 'react-icons/hi';
import Cookies from 'js-cookie';
import { useTour } from '@reactour/tour';
import Router from 'next/router';
import io from 'socket.io-client';
import { FaExpand } from 'react-icons/fa';
import { USER_AVTAR_URL } from '@HELPER/avtar';
let socket;
const ENDPOINT = 'https://empsockets.globusdemos.com';
import { useSharedStateContext } from './../helper/function';

let toolbar_data;
const handleSelectStatus = (event, v) => {
    event.preventDefault;
};

const Header = () => {
    const { sharedState, updateSharedState } = useSharedStateContext();
    // Check if localStorage is available
    const storedTheme = typeof localStorage !== 'undefined' ? localStorage.getItem("theme") : null;

    const [theme, setTheme] = useState(storedTheme ? storedTheme : "light");
    const { setIsOpen } = useTour();
    const [notification, setNotification] = useState([]);
    const [initials, setInitials] = useState();
    const [isFullScreen, setIsFullScreen] = useState(false);

    const toggleFullScreen = () => {
        if (!isFullScreen) {
            // Enter full-screen mode for different browsers
            const element = document.documentElement;
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen();
            } else if (element.msRequestFullscreen) {
                element.msRequestFullscreen();
            }
        } else {
            // Exit full-screen mode for different browsers
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    };
    useEffect(() => {
        const handleFullScreenChange = () => {
            setIsFullScreen(document.fullscreenElement !== null);
        };

        document.addEventListener('fullscreenchange', handleFullScreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullScreenChange);
        };
    }, []);


    useEffect(() => {
        localStorage.setItem("theme", theme);
        const localTheme = localStorage.getItem("theme");
        document.querySelector("html").classList.add(localTheme);
      }, [theme]);

    // socket = io(ENDPOINT);
    // socket.on('connect', () => {
    //     console.log('User connected to socket');
    // });
    // socket.emit('setup', Cookies.get('id'));
    // socket.on('notification', value => {
    //     getAllNotification();
    // });

    // Receive Notifications
    const getAllNotification = () => {
        fetchNotification()
            .then(response => {
                setNotification(response.data.body.data);
            })
            .catch(function (e) {
                toast({
                    type: 'error',
                    message: e.response ? e.response.data.body.message : 'Something went wrong, Try again !',
                });
            });
    };

    useEffect(() => {
        getAllNotification();
        toolbar_data = [
            {
                text: 'My profile',
                cssClass: '',
                value: 1,
                icon: <AiOutlineUser className='mr-2' />,
                onClick: (event, value, downloadData, name, getData) => {
                    Router.push('/w-m/admin/view');
                },
            },
            {
                text: 'Logout',
                cssClass: 'text-[#F5997B]',
                value: 5,
                icon: <HiOutlineLogout className='mr-2 text-[#F5997B]' />,
                onClick: () => {
                    if(Cookies.get("isAdmin") === "true"){
                        Router.push('/w-m/admin/sign-in');
                        Cookies.remove('token');
                        Cookies.remove('adminData');
                        Cookies.remove('id');
                        Cookies.remove('isAdmin');
                        Cookies.remove('isEmpAdmin');
                    }else{
                        Router.push('/w-m/member/login');
                        Cookies.remove('token');
                        Cookies.remove('userData');
                        Cookies.remove('id');
                        Cookies.remove('isAdmin');
                    }
                    
                },
            },
        ];
        let userData = null;
const adminData = Cookies.get('adminData');
const userDataCookie = Cookies.get('userData');
        if(Cookies.get('isAdmin') === 'true' && adminData) {
            userData = JSON.parse(Cookies.get('adminData'))
            if (Cookies.get('isAdmin') === 'true' && Cookies.get('isEmpAdmin') === 'true') {
                toolbar_data.splice(1, 0, {
                    text: 'Switch to EMP',
                    cssClass: '',
                    value: 2,
                    onClick: (event, value, downloadData, name, getData) => {
                        window.open('https://app.empmonitor.com/admin/dashboard', '_blank');
                    },
                });
            }
        }else if(userDataCookie){ userData = JSON.parse(userDataCookie)}
        // User Name Initials
        setInitials((userData?.firstName?.charAt(0) + userData?.lastName?.charAt(0)));
        // setInitials((userData?.firstName?.charAt(0) + userData?.lastName?.charAt(0))?.toUpperCase());
    }, []);

    return (
        <header className='bg-white w-full top-0 header-wrapper z-[99]'>
            <div className='w-full flex justify-between flex-wrap px-5 py-1 flex-col md:flex-row'>
                <div className='md:py-1 md:pl-4	flex flex-wrap items-center text-sm justify-center'>
                    {/* <div className='wrapper relative xs:hidden'>
                        <div className='absolute left-4 bottom-3 cursor-pointer text-placeholderGrey '>
                            <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
                                <path strokeLinecap='round' strokeLinejoin='round' d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                            </svg>
                        </div>
                        <input
                            className='md:w-96 border border-white focus:border-lightGrey  transition-all rounded-full pr-5 pl-12 py-3 w-full font-normal bg-veryveryLightGrey text-defaultTextColor outline-none'
                            type='text'
                            placeholder='Search...'
                        />
                    </div> */}
                </div>
                <div className='flex justify-end'>
                    <ul className='relative px-2 flex items-center'>
                        {/*Product tour flag starts here */}
                        {/* <li className='relative'>
                            <label className='tooltip_position'>
                                <ToolTip message={'Start tour'}>
                                    <a
                                        onClick={() => setIsOpen(true)}
                                        className='flex rounded-full items-center justify-center text-sm p-2 h-12 overflow-hidden text-gray-700 text-ellipsis whitespace-nowrap transition duration-300 ease-in-out'
                                        href='#!'
                                        data-mdb-ripple='true'
                                        data-mdb-ripple-color='primary'>
                                        <span className='small-button p-2 rounded-md flag flash'>
                                            <span className='flag_button'></span>
                                            <span className='flag_button'></span>
                                            <span className='flag_button'></span>
                                            <span className='flag_button'></span>
                                            <HiFlag className='text-lg' />
                                        </span>
                                    </a>
                                </ToolTip>
                            </label>
                        </li> */}
                        {/* <li className='relative'>
                            <a
                                onClick={() => {
                                    Router.push('/w-m/chat');
                                }}
                                className='flex items-center justify-center text-sm p-2 h-12 overflow-hidden text-gray-700 text-ellipsis whitespace-nowrap transition duration-300 ease-in-out'
                                href='#!'
                                data-mdb-ripple='true'
                                data-mdb-ripple-color='primary'>
                                <HiOutlineChatAlt2 size={30} color={'grey'} />
                                <span className='absolute top-0 right-0 px-2 py-1 translate-x-1/2 bg-red-500 border border-white rounded-full text-base text-white'>12</span>{' '}
                            </a>
                        </li> */}
                        {/* <li className=' flex items-center gap-2'> */}
                        <li>
                          <label className='switch'>
                            <input
                              type="checkbox"
                              checked={theme === "dark"}
                              onClick={(e) => {
                                if (e.target.checked) {
                                  setTheme("dark");
                                } else {
                                  document.querySelector("html").classList.remove("dark");
                                  setTheme("light");
                                }
                              }}
                            />
                            <span className='slider'></span>
                           
                          </label>
                          {/* <span className=' text-base dark:text-[#fff]'>{theme==='dark'?"Dark Theme":"Light Theme"}</span> */}
                        </li>
                        <li className='relative'>
                            <Notification {...{ getAllNotification, notification }} />
                        </li>
                        {/*Product tour flag ends here */}
                        <li className='relative'>
                            <a
                                className='flex items-center justify-center text-sm p-2 h-6 overflow-hidden text-gray-700 text-ellipsis whitespace-nowrap transition duration-300 ease-in-out cursor-pointer'
                                onClick={toggleFullScreen}
                                data-mdb-ripple='true'
                                data-mdb-ripple-color='primary'>
                                {isFullScreen ? <IoContractOutline className='text-gray-400 dark:text-gray-300' size={18} /> : <FaExpand className='text-gray-400 dark:text-gray-300' size={18} />}
                            </a>
                        </li>
                        {/* <li className='relative'>
                            <a
                                id='filter-switch'
                                className='flex items-center justify-center text-sm h-12 overflow-hidden text-gray-700 text-ellipsis whitespace-nowrap transition duration-300 ease-in-out'
                                href='#!'
                                data-mdb-ripple='true'
                                data-mdb-ripple-color='primary'>
                                <svg
                                    className='dropdown__filter-selected text-defaultTextColor'
                                    aria-current='true'
                                    width='39'
                                    height='39'
                                    fill='#D8D8D8'
                                    viewBox='0 0 39 39'
                                    fill='none'
                                    xmlns='http://www.w3.org/2000/svg'>
                                    <path
                                        d='M25.4916 27.615H10.423C9.86495 27.615 9.37661 27.3406 9.09756 26.8604C8.81852 26.3802 8.88828 25.8313 9.16733 25.3511L9.93471 24.1849C11.1904 22.3326 11.8183 20.2059 11.8183 18.0106C11.8183 15.4724 13.4926 13.1399 15.9342 12.3166C16.3528 11.562 17.1202 11.1504 17.9573 11.1504C18.7945 11.1504 19.5619 11.562 19.9804 12.3166C22.4221 13.1399 24.0964 15.4724 24.0964 18.0106C24.0964 20.2059 24.7242 22.3326 25.98 24.1849L26.7473 25.3511C27.0264 25.8313 27.0962 26.3802 26.8171 26.8604C26.6078 27.3406 26.0497 27.615 25.4916 27.615Z'
                                        fill='#D8D8D8'
                                    />
                                    <path d='M14.5391 28.9871C14.8879 30.5649 16.2831 31.7312 17.9574 31.7312C19.6317 31.7312 21.0269 30.5649 21.3757 28.9871H14.5391Z' fill='#D8D8D8' />
                                </svg>
                                //  <span>Non-collapsible link</span> 
                            </a>
                        </li> */}
                        {/* <li className='relative'>
                            <a
                                id='filter-switch'
                                className='flex items-center justify-center text-sm p-2 h-12 overflow-hidden text-gray-700 text-ellipsis whitespace-nowrap transition duration-300 ease-in-out'
                                href='#!'
                                data-mdb-ripple='true'
                                data-mdb-ripple-color='primary'>
                                <svg
                                    className='dropdown__filter-selected text-defaultTextColor'
                                    aria-current='true'
                                    width='28'
                                    height='28'
                                    fill='#D8D8D8'
                                    xmlns='http://www.w3.org/2000/svg'
                                    viewBox='0 0 20 20'>
                                    <path d='M16 6H3.5v-.5l11-.88v.88H16V4c0-1.1-.891-1.872-1.979-1.717L3.98 3.717C2.891 3.873 2 4.9 2 6v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2zm-1.5 7.006a1.5 1.5 0 1 1 .001-3.001 1.5 1.5 0 0 1-.001 3.001z' />
                                </svg>
                                // <span>Non-collapsible link</span> 
                            </a>
                        </li> */}
                        <li className='relative flex items-center p-2'>
                           {sharedState?
                            <DropDown
                            data={toolbar_data}
                            defaultValue={''}
                            onClick={handleSelectStatus}
                            icon={
                                <span
                                        className=''
                                        href='#!'
                                        data-mdb-ripple='true'
                                        data-mdb-ripple-color='primary'>
                                        <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${initials}`} className='flex bg-mediumBlue text-white rounded-full items-center justify-center text-sm w-6 h-6 hover:bg-lightBlue transition duration-300 ease-in-out'alt='user' />
                                      
                                    </span>
                            }
                        />:
                        <DropDown
                        data={toolbar_data}
                        defaultValue={''}
                        onClick={handleSelectStatus}
                        icon={
                            <span
                                className='flex bg-mediumBlue text-white rounded-full items-center justify-center text-sm w-6 h-6 hover:bg-lightBlue transition duration-300 ease-in-out'
                                href='#!'
                                data-mdb-ripple='true'
                                data-mdb-ripple-color='primary'>
                                <span className='font-bold text-base'>{initials}</span>
                            </span>
                        }
                    />

                            }
                        </li>
                    </ul>
                </div>
            </div>
        </header>
    );
};
export default Header;
