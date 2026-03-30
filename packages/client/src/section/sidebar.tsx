import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Router from 'next/router';
import { logoSelectColor, routes1, routes2, routes3, size } from '../helper/sliderRoute';
import { logoSelectColorUser, userRoutes, userSize } from '../helper/sliderUserRoute';
import { MdOutlineHelp } from 'react-icons/md';
import { FaChartBar, FaHistory, FaUserLock,FaFileAlt } from 'react-icons/fa';
import { RiDashboardFill } from 'react-icons/ri';
import Cookies from 'js-cookie';
import NoSsr from '@COMPONENTS/NoSsr';
import { TbRuler2Off } from 'react-icons/tb';
import { fetchProfile } from '@WORKFORCE_MODULES/admin/api/get';
import { useSharedStateContext } from '@HELPER/function';

export const Slider = () => {
    let { sharedState, updateSharedState ,profileData} = useSharedStateContext();
    let admin = Cookies.get('isAdmin') === 'true'? true : false;
    

    const initial1 = {
        0: false,
        1: false,
        2: false,
        3: false,
    };
    const initial2 = {
        0: false,
        1: false,
        2: false,
        3: false,
    };
    const initial3 = {
        0: false,
        1: false,
    };
    const [permission, setPermission] = useState(null);
    const [sideBarExpand, setSideBarExpand] = useState('');
    const [openDropdown, setOpenDropdown] = useState(Cookies.get('openDropdown') ? JSON.parse(Cookies.get('openDropdown')) : { ...initial1 });
    const [openDropdown2, setOpenDropdown2] = useState(Cookies.get('openDropdown2') ? JSON.parse(Cookies.get('openDropdown2')) : { ...initial2 });
    const [openDropdown3, setOpenDropdown3] = useState(Cookies.get('openDropdown3') ? JSON.parse(Cookies.get('openDropdown3')) : { ...initial3 });
    const router = useRouter();
    const [openSideBar, setOpenSideBar] = useState(Cookies.get('openSideBar') ? JSON.parse(Cookies.get('openSideBar')) : true);
    useEffect(() => {
        Cookies.set('openSideBar', JSON.stringify(openSideBar));
        setOpenSideBar(JSON.parse(Cookies.get('openSideBar')));
        document.body.classList.toggle('open-sidebar', openSideBar);
        // document.querySelector('body').classList.add('bodyBg');
    }, [openSideBar, router.pathname]);
    useEffect(() => {
        Cookies.set('openDropdown', JSON.stringify(openDropdown));
        Cookies.set('openDropdown2', JSON.stringify(openDropdown2));
        Cookies.set('openDropdown3', JSON.stringify(openDropdown3));
    }, [openDropdown, openDropdown2, openDropdown3]);

    useEffect(() => {
        handleProfileData();
        setOpenDropdown(JSON.parse(Cookies.get('openDropdown')));
        setOpenDropdown2(JSON.parse(Cookies.get('openDropdown2')));
        setOpenDropdown3(JSON.parse(Cookies.get('openDropdown3')));
    }, []);

    const handleProfileData = () => {
        fetchProfile().then(response => {
            if (response?.data?.body.status === 'success') {
                setPermission(response.data.body.data.permissionConfig);
            }
        }).catch(error =>{
            console.error(error);
        }) 
    };
    useEffect(()=>{
        if(openSideBar===true){

            setSideBarExpand("")
        }else
        {
            setSideBarExpand('sidebar-collapsed')

        }
      },[openSideBar,sideBarExpand])
      return (
        <>
            <div
                className={`bg-white h-screen w-20 drop-shadow-xl z-[991] fixed top-0 sidebar ${sideBarExpand}`}
                id='sidenavSecExample'
            // onMouseOver={() => {
            //     setSideBarExpand(true);
            // }}
            // onMouseOut={() => setSideBarExpand(false)}
            // onMouseEnter={() => 
            //     setSideBarExpand(false)}
            >
                <div className='pt-6 pb-2 px-6'>
                    <a>
                        <div className='items-center'>
                            <div className='shrink-0'>
                                <img src='/imgs/icon.jpg' className='small-logo w-16' alt='EmpCloud' />
                            </div>
                            <span className=''>
                                <img src='/imgs/logo.jpg' className='big-logo w-[150px] dark:hidden' alt='EmpCloud' />
                                <img src='/imgs/login-img/emp.png' className={`big-logo w-[150px] h-[28px] hidden ${openSideBar && 'dark:block'}`} alt='EmpCloud' />
                            </span>
                        </div>
                    </a>
                    <div  onClick={() => {
                                setOpenSideBar(!openSideBar);}} className={`bg-veryveryLightGrey left-arrow drop-shadow-md drop shadow-black absolute w-[30px] h-[30px] rounded-full right-[-10px] !top-12 p-2 cursor-pointer ${openSideBar ==='true' ? '' : 'rotate-180'}`}>
                        <img
                            src='/imgs/left-arrow.svg'
                            className=''
                            alt='EmpCloud'
                                // setSideBarExpand(false); 
                        />
                    </div>
                </div>
                <ul className='relative px-2 my-4 overflow-y-auto 2xl:max-h-[89vh] xl:max-h-[82vh] max-h-[82vh]'>
                    <NoSsr>
                        {admin === true || permission?.dashboard?.view === true ? (
                            <li className='relative cursor-pointer'>
                                <a
                                    className='flex items-center text-base py-2 px-6 overflow-hidden  text-defaultTextColor dark:text-[#fff] hover:text-darkTextColor text-ellipsis whitespace-nowrap rounded-full hover:bg-veryLightBlue transition duration-300 ease-in-out'
                                    onClick={() => Router.push('/w-m/dashboard')}
                                    data-mdb-ripple='true'
                                    data-mdb-ripple-color='primary'>
                                    {router.pathname === '/w-m/dashboard' ? <RiDashboardFill color={logoSelectColor} size={size} /> : <RiDashboardFill size={size} />}
                                    <span className={router.pathname === '/w-m/dashboard' ? 'ml-3 cursor-pointer text-brandBlue' : 'ml-3 cursor-pointer'}>Dashboard</span>
                                </a>
                            </li>
                        ) : (
                            ''
                        )}
                        <li className='relative cursor-pointer my-2 ml-4 side-nav-text dark:text-[#fff] text-base font-semibold'>Project Management</li>{' '}
                        {routes1.map(function (data, key) {
                            return data.map(function (details) {
                                return (
                                    <><div>
                                        <li className='relative dropdown-item' key={key}>
                                            <a
                                                className='relative flex text-base items-center py-2 px-6 overflow-hidden text-defaultTextColor dark:text-[#fff]  hover:text-darkTextColor  cursor-pointer text-ellipsis whitespace-nowrap rounded-full hover:bg-veryLightBlue transition duration-300 ease-in-out'
                                                data-mdb-ripple='true'
                                                data-mdb-ripple-color='primary'
                                                onClick={() => {
                                                    setOpenDropdown(slider => ({
                                                        ...slider,
                                                        [key]: !openDropdown[key],
                                                    }));
                                                    setSideBarExpand('');
                                                        setOpenSideBar(true)
                                                    }}>
                                                {details.pathContains.includes(router.pathname) ? details.selectedLogo : details.logo}
                                                <span className={details.pathContains.includes(router.pathname) ? 'ml-3 text-brandBlue cursor-pointer ' : 'ml-3 cursor-pointer'}>
                                                    {details.name}
                                                    {typeof details.path === 'object' && (
                                                        <img src='/imgs/left-arrow.svg' alt='Arrow' className={`collapsed-arrow ${openDropdown[key] ? 'rotate-90 -mt-2 ml-4' : '-rotate-90 -mt-2 ml-4'}`} />
                                                    )}
                                                </span>
                                            </a>
                                            {typeof details.path === 'object' && (
                                                <ul className={`dropdown-menu py-1 text-base  ${openDropdown[key] ? 'open' : ''}`} aria-labelledby='dropdownDefault'>
                                                    {details.path &&
                                                        details.path.map(function (nestedPath, key) {
                                                            return (
                                                                <li key={key}>
                                                                    <a
                                                                        onClick={() => Router.push(nestedPath.path)}
                                                                        className='block rounded-full px-4 py-2 cursor-pointer hover:bg-veryLightBlue text-defaultTextColor dark:text-[#fff] hover:text-darkTextColor'>
                                                                        <span className={router.pathname === nestedPath.path ? 'text-brandBlue' : 'text-darkTextColo'}>{nestedPath.name} </span>
                                                                    </a>
                                                                </li>
                                                            );
                                                        })}
                                                </ul>
                                            )}
                                        </li>
                                    </div>
                                    </>
                                );
                            });
                        })}
                        {admin === true || admin === undefined || permission?.dashboard?.view === true ? (
                            <>
                            <li className='relative cursor-pointer my-2 ml-4 dark:text-[#fff] text-base side-nav-text font-semibold'>Project Insights</li>{' '}
                            {routes3.map(function (data, key) {
                            return data.map(function (details) {
                                return (
                                    <><div>
                                        <li className='relative dropdown-item' key={key}>
                                            <a
                                                className='relative flex text-base items-center py-2 px-6 overflow-hidden text-defaultTextColor dark:text-[#fff]  hover:text-darkTextColor  cursor-pointer text-ellipsis whitespace-nowrap rounded-full hover:bg-veryLightBlue transition duration-300 ease-in-out'
                                                data-mdb-ripple='true'
                                                data-mdb-ripple-color='primary'
                                                onClick={() => {
                                                    setOpenDropdown3(slider => ({
                                                        ...slider,
                                                        [key]: !openDropdown3[key],
                                                    }));
                                                    setSideBarExpand('');
                                                        setOpenSideBar(true)
                                                    }}>
                                                {details.pathContains.includes(router.pathname) ? details.selectedLogo : details.logo}
                                                <span className={details.pathContains.includes(router.pathname) ? 'ml-3 text-brandBlue cursor-pointer ' : 'ml-3 cursor-pointer'}>
                                                    {details.name}
                                                    {typeof details.path === 'object' && (
                                                        <img src='/imgs/left-arrow.svg' alt='Arrow' className={`collapsed-arrow ${openDropdown3[key] ? 'rotate-90 -mt-2 ml-4' : '-rotate-90 -mt-2 ml-4'}`} />
                                                    )}
                                                </span>
                                            </a>
                                            {typeof details.path === 'object' && (
                                                <ul className={`dropdown-menu py-1 text-base  ${openDropdown3[key] ? 'open' : ''}`} aria-labelledby='dropdownDefault'>
                                                    {details.path &&
                                                        details.path.map(function (nestedPath, key) {
                                                            return (
                                                                <li key={key}>
                                                                    <a
                                                                        onClick={() => Router.push(nestedPath.path)}
                                                                        className='block rounded-full px-4 py-2 cursor-pointer hover:bg-veryLightBlue text-defaultTextColor dark:text-[#fff] hover:text-darkTextColor'>
                                                                        <span className={router.pathname === nestedPath.path ? 'text-brandBlue' : 'text-darkTextColo'}>{nestedPath.name} </span>
                                                                    </a>
                                                                </li>
                                                            );
                                                        })}
                                                </ul>
                                            )}
                                        </li>
                                    </div>
                                    </>
                                );
                            });
                        })}
                            </>
                        ) : ("")}

                        <li className='relative cursor-pointer my-2 ml-4 dark:text-[#fff] side-nav-text text-base font-semibold'>Configuration</li>{' '}
                        {admin === true  || admin===undefined || permission?.permission?.view === true ? (
                            <li className='relative cursor-pointer'>
                                <a
                                    className='flex items-center text-base py-2 px-6 overflow-hidden  text-defaultTextColor dark:text-[#fff] hover:text-darkTextColor text-ellipsis whitespace-nowrap rounded-full hover:bg-veryLightBlue transition duration-300 ease-in-out'
                                    onClick={() => Router.push('/w-m/permissions/all')}
                                    data-mdb-ripple='true'
                                    data-mdb-ripple-color='primary'>
                                    {router.pathname === '/w-m/permissions/all' ? <FaUserLock color={logoSelectColor} size={size} /> : <FaUserLock size={size} />}
                                    <span className={router.pathname === '/w-m/permissions/all' ? 'ml-3 cursor-pointer text-brandBlue' : 'ml-3 cursor-pointer'}> Permission</span>
                                </a>
                            </li>
                        ) : ("")}

                        {routes2.map(function (data, key) {
                            return data.map(function (details) {
                                return (
                                    <><div>
                                        <li className='relative dropdown-item' key={key}>
                                            <a
                                                className='relative flex items-center text-base py-2 px-6 overflow-hidden text-defaultTextColor dark:text-[#fff] hover:text-darkTextColor  cursor-pointer text-ellipsis whitespace-nowrap rounded-full hover:bg-veryLightBlue transition duration-300 ease-in-out'
                                                data-mdb-ripple='true'
                                                data-mdb-ripple-color='primary'
                                                onClick={() => {
                                                    setOpenDropdown2(slider => ({
                                                        ...slider,
                                                        [key]: !openDropdown2[key],
                                                    }));
                                                        setSideBarExpand('');
                                                        setOpenSideBar(true)}}>
                                                {details.pathContains.includes(router.pathname) ? details.selectedLogo : details.logo}
                                                <span
                                                    className={details.pathContains.includes(router.pathname) ? 'ml-3 text-brandBlue cursor-pointer' : 'ml-3 cursor-pointer'}
                                                >
                                                    {details.name}
                                                    {typeof details.path === 'object' && (
                                                        <img src='/imgs/left-arrow.svg' alt='Arrow' className={`collapsed-arrow ${openDropdown2[key] ? 'rotate-90 -mt-2' : '-rotate-90 -mt-2'}`} />
                                                    )}
                                                </span>
                                            </a>
                                            {typeof details.path === 'object' && (
                                                <ul className={`dropdown-menu py-1 text-base  ${openDropdown2[key] ? 'open' : ''}`} aria-labelledby='dropdownDefault'>
                                                    {details.path &&
                                                        details.path.map(function (nestedPath, key) {
                                                            return (
                                                                <li key={key}>
                                                                    <a
                                                                        onClick={() => Router.push(nestedPath.path)}
                                                                        className='block rounded-full px-4 py-2 cursor-pointer hover:bg-veryLightBlue text-defaultTextColor dark:text-[#fff] hover:text-darkTextColor'>
                                                                        <span className={router.pathname === nestedPath.path ? 'text-brandBlue' : 'text-darkTextColo'}>{nestedPath.name} </span>
                                                                    </a>
                                                                </li>
                                                            );
                                                        })}
                                                </ul>
                                            )}
                                        </li>
                                    </div>
                                    </>
                                );
                            });
                        })}
                        {/* {admin === 'true' ? (
                            <li className='relative'>
                                <a
                                    className='flex items-center text-sm py-4 px-6 h-12 overflow-hidden  text-defaultTextColor dark:text-[#fff] hover:text-darkTextColor text-ellipsis whitespace-nowrap rounded-full hover:bg-veryLightBlue transition duration-300 ease-in-out'
                                    onClick={() => Router.push('/w-m/history')}
                                    data-mdb-ripple='true'
                                    data-mdb-ripple-color='primary'>
                                    {router.pathname === '/w-m/history' ? <FaHistory color={logoSelectColor} size={size} /> : <FaHistory size={size} />}
                                    <span className={router.pathname === '/w-m/history' ? 'ml-3 cursor-pointer text-brandBlue' : 'ml-3 cursor-pointer'}> Subscription History</span>
                                </a>
                            </li>
                        ) : (
                            ''
                        )} */}
                    </NoSsr>

                    {/* <li>
                        <span className='border-t-2 my-8 border-defaultTextColor block'></span>
                    </li>
                    <li className='relative'>
                        <a
                            className='flex items-center text-sm py-4 px-6 h-12 overflow-hidden  text-defaultTextColor dark:text-[#fff] hover:text-darkTextColor text-ellipsis whitespace-nowrap rounded-full hover:bg-veryLightBlue transition duration-300 ease-in-out'
                            onClick={() => Router.push('/w-m/help-and-support')}
                            data-mdb-ripple='true'
                            data-mdb-ripple-color='primary'>
                            {router.pathname === '/w-m/help-and-support' ? <MdOutlineHelp color={logoSelectColor} size={size} /> : <MdOutlineHelp size={size} />}
                            <span className={router.pathname === '/w-m/help-and-support' ? 'ml-3 cursor-pointer text-brandBlue' : 'ml-3 cursor-pointer'}> Help & Support</span>
                        </a>
                    </li> */}
                </ul>
            </div>
        </>
    );
};
export default Slider;
