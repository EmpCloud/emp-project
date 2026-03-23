/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react';
import { HiArrowNarrowLeft, HiOutlineMail, HiOutlineLocationMarker, HiOutlineBriefcase, HiOutlineClipboardList ,HiOutlineOfficeBuilding} from 'react-icons/hi';
import { AiOutlineDashboard } from 'react-icons/ai';
import { GiSandsOfTime } from 'react-icons/gi';
import { VscListSelection } from 'react-icons/vsc';
import { TiTickOutline } from 'react-icons/ti';
import router from 'next/router';
import EditProfileModal from './editProfileModal';
import { fetchProfile } from '../api/get';
import Cookies from 'js-cookie';
import NoSsr from '@COMPONENTS/NoSsr';
import ResetPassword from './resetPassword';
import ViewUserPermission from './viewUserPermission';
import {  generateDicebearUrl } from '@HELPER/avtar';
function index({ stopLoading, startLoading }) {
    const [adminDetails, setAdminDetails] = useState(null);
    useEffect(() => {
        // document.querySelector('body').classList.add('bg-slate-50');
    }, []);
    useEffect(() => {
        handleprofileData();
    }, []);

    const handleprofileData = () => {
        fetchProfile().then(response => {
            if (response.data.body.status === 'success') {
                setAdminDetails(response.data.body.data);
                Cookies.set('adminPermission',response?.data?.body?.data?.adminPermission)
            }
        });
    }; 
    function getProfilePicUrl(adminDetails) {
        if (
          adminDetails?.profilePic &&
          typeof adminDetails?.profilePic === 'string' &&
          adminDetails.profilePic?.startsWith('https://api.dicebear.com/7.x/initials/svg?seed')
        ) {
          return  `${generateDicebearUrl(adminDetails && adminDetails?.firstName ,adminDetails && adminDetails?.lastName)}`+ '.svg';
        } else {
          return adminDetails?.profilePic??  `${generateDicebearUrl( adminDetails?.firstName , adminDetails?.lastName)}`+ '.svg';;
        }
      }
      
      const profilePicUrl = getProfilePicUrl(adminDetails);
      
      
      
    return (
        <>
            <div className='font-inter'>
                <div className='flex items-center justify-between my-2 mb-4 flex-wrap'>
                    <div className='mb-0 text-base text-lightTextColor '>
                        <NoSsr>
                            {Cookies.get('isAdmin') === 'true' ? (
                                <a
                                    onClick={() => {
                                        router.push('/w-m/dashboard');
                                    }}
                                    className='flex items-center cursor-pointer'>
                                    <HiArrowNarrowLeft className='mr-2 cursor-pointer' /> Back
                                </a>
                            ) : (
                                <a></a>
                            )}
                        </NoSsr>
                    </div>
                    <div className='flex items-center'>
                        <div className='relative mr-3' id='step1'>
                            <NoSsr> <ResetPassword /> </NoSsr>
                        </div>
                        <div className='relative mr-3' id='step2'>
                            <EditProfileModal data={adminDetails} {...{ stopLoading, startLoading, handleprofileData }} />
                        </div>
                    </div>
                </div>
                <div className='bg-white py-6 px-4 rounded-xl xs:p-4'>
                    <div className='lg:flex items-center'>
                        <div className='flex items-center'>
                            <div className='members-details relative pl-4'>
                                <img src={profilePicUrl} alt='User-Img' className='w-36 h-32 rounded-lg' />
                            </div>
                            <div className='ml-5 pr-5 '>
                                <div className='flex'>
                                    <h3 className='text-darkTextColor text-xl font-bold'>{adminDetails && adminDetails.firstName + ' ' + adminDetails.lastName}</h3>
                                    <div>
                                    <NoSsr>{Cookies.get('isAdmin') === 'false' ? <ViewUserPermission data={adminDetails} /> : <></>}</NoSsr>
                                    </div>
                                </div>
                                <span className='text-placeholderGrey font-normal text-base'>{adminDetails && adminDetails.role}</span>
                                <div className='user-deatils mt-3'>
                                    <p className='flex items-center text-defaultTextColor'>
                                        <HiOutlineOfficeBuilding className='mr-1' /> {adminDetails && adminDetails.orgId}
                                    </p>
                                    <p className='flex items-center text-defaultTextColor'>
                                        <HiOutlineMail className='mr-1' /> {adminDetails && adminDetails.email}
                                    </p>
                                    <p className='flex items-center mt-1 text-defaultTextColor'>
                                        <HiOutlineLocationMarker className='mr-1' />
                                        {adminDetails && adminDetails.state + ',' + adminDetails.country}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                        <div className='w-full lg:pl-4 py-4'>
                            <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 md:grid-rows-2 lg:grid-rows-1 gap-4 xs:mt-5 md:mt-5 lg:mt-0'>
                                <div className='flex col-span-1 md:col-span-1 justify-center px-4 py-4 rounded-2xl bg-slate-100 dark:bg-gray-800 items-center'>
                                        <HiOutlineBriefcase className='mr-2 text-darkBlue font-normal text-3xl font-base' />
                                    <div className=' flex flex-col'>
                                    <span className='text-darkTextColor mt-1 text-2xl font-bold flex items-center'>
                                        {' '}
                                        {adminDetails && adminDetails.totalProject}
                                    </span>
                                    <p className='text-defaultTextColor text-md font-semibold'>Total projects</p>
                                    </div>
                                </div>
                                <div className='flex col-span-1 md:col-span-1 justify-center px-4 py-4 rounded-2xl bg-slate-100 dark:bg-gray-800 items-center'>
                                        <HiOutlineClipboardList className='mr-2 text-darkBlue font-normal text-3xl font-base' />
                                    <div className=' flex flex-col'>
                                    <span className='text-darkTextColor mt-1 text-2xl font-bold flex items-center'>
                                        {' '}
                                        {adminDetails && adminDetails.totalTask}
                                    </span>
                                    <p className='text-defaultTextColor text-md font-semibold'>Total tasks</p>
                                    </div>
                                </div>
                                <div className='flex col-span-1 md:col-span-1 lg:col-span-1 justify-center px-4 py-4 rounded-2xl bg-slate-100 dark:bg-gray-800 items-center'>
                                        <VscListSelection className='mr-2 text-darkBlue font-normal text-3xl font-base' />
                                    <div className=' flex flex-col'>
                                    <span className='text-darkTextColor mt-1 text-2xl font-bold flex items-center'>
                                        {' '}
                                        {adminDetails && adminDetails.ongoingTasks}
                                    </span>
                                    <p className='text-defaultTextColor text-md font-semibold'>Ongoing tasks</p>
                                    </div>
                                </div>
                                <div className='flex col-span-1 md:col-span-1 lg:col-span-1 justify-center px-4 py-4 rounded-2xl bg-slate-100 dark:bg-gray-800 items-center'>
                                        <GiSandsOfTime className='mr-2 text-darkBlue font-normal text-3xl font-base' />
                                    <div className=' flex flex-col'>
                                    <span className='text-darkTextColor mt-1 text-2xl font-bold flex items-center'>
                                        {' '}
                                        {adminDetails && adminDetails.pendingTasks}
                                    </span>
                                    <p className='text-defaultTextColor text-md font-semibold'>Pending tasks</p>
                                    </div>
                                </div>
                                <div className='flex col-span-1 md:col-span-1 lg:col-span-1 justify-center px-4 py-4 rounded-2xl bg-slate-100 dark:bg-gray-800 items-center'>
                                        <TiTickOutline className='mr-2 text-darkBlue font-normal text-3xl font-base' />
                                    <div className=' flex flex-col'>
                                    <span className='text-darkTextColor mt-1 text-2xl font-bold flex items-center'>
                                        {' '}
                                        {adminDetails && adminDetails.completedTasks}
                                    </span>
                                    <p className='text-defaultTextColor text-md font-semibold'>Completed tasks</p>
                                    </div>
                                </div>
                                <div className='flex col-span-1 md:col-span-1 lg:col-span-1 justify-center px-4 py-4 rounded-2xl bg-slate-100 dark:bg-gray-800 items-center'>
                                        <AiOutlineDashboard className='mr-2 text-darkBlue font-normal text-3xl font-base' />
                                    <div className=' flex flex-col'>
                                    <span className='text-darkTextColor mt-1 text-2xl font-bold flex items-center'>
                                        {' '}
                                        {adminDetails && adminDetails.progress}%
                                    </span>
                                    <p className='text-defaultTextColor text-md font-semibold'>Total progress</p>
                                    </div>
                                </div>
                                {/* <div className='md:flex lg:basis-1/6 basis-1/2 border px-4 py-4 rounded bg-slate-100  flex-col items-center'>
                                    <p className='text-defaultTextColor'>Total tasks</p>
                                    <span className='text-darkTextColor mt-1 text-2xl font-bold flex items-center'>
                                        {' '}
                                        <HiOutlineClipboardList className='mr-2 text-darkBlue font-normal font-base' />
                                        {adminDetails && adminDetails.totalTask}
                                    </span>
                                </div> */}
                                {/* <div className='md:flex lg:basis-1/6 basis-1/2 border px-4 py-4 rounded bg-slate-100  flex-col items-center'>
                                    <p className='text-defaultTextColor'>Ongoing tasks</p>
                                    <span className='text-darkTextColor mt-1 text-2xl font-bold flex items-center'>
                                        {' '}
                                        <VscListSelection className='mr-2 text-darkBlue font-normal font-base' />
                                        {adminDetails && adminDetails.ongoingTasks}
                                    </span>
                                </div> */}
                                {/* <div className='md:flex lg:basis-1/6 basis-1/2 border px-4 py-4 rounded bg-slate-100 flex-col items-center'>
                                    <p className='text-defaultTextColor'>Pending tasks</p>
                                    <span className='text-darkTextColor mt-1 text-2xl font-bold flex items-center'>
                                        {' '}
                                        <GiSandsOfTime className='mr-2 text-darkBlue font-normal font-base' />
                                        {adminDetails && adminDetails.pendingTasks}
                                    </span>
                                </div> */}
                                {/* <div className='md:flex lg:basis-1/6 basis-1/2 border px-4 py-4 rounded bg-slate-100 flex-col items-center'>
                                    <p className='text-defaultTextColor'>Completed tasks</p>
                                    <span className='text-darkTextColor mt-1 text-2xl font-bold flex items-center'>
                                        {' '}
                                        <TiTickOutline className='mr-2 text-darkBlue font-normal font-base' />
                                        {adminDetails && adminDetails.completedTasks}
                                    </span>
                                </div> */}
                                {/* <div className='md:flex lg:basis-1/6 basis-1/2 border px-4 py-4 rounded bg-slate-100 flex-col items-center'>
                                    <p className='text-defaultTextColor'>Progress</p>
                                    <span className='text-darkTextColor mt-1 text-2xl font-bold flex items-center'>
                                        {' '}
                                        <AiOutlineDashboard className='mr-2 text-darkBlue font-normal font-base' />
                                        {adminDetails && adminDetails.progress}%
                                    </span>
                                </div> */}
                            </div>
                        </div>
                </div>
                {/* <div className='mt-5'>
                    <TabsRender />
                </div> */}
            </div>
            {/* =================================================================== */}
            {/* MODEL FOR edit START */}
            {/* {showModaleditDetails && (
                
                <>
                    <div className='justify-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-[999] outline-none focus:outline-none'>
                        <div className='relative my-2 w-10/12 md:w-8/12 z-50 sm:w-[!20rem]'>
                            <div className='border-0 mb-7 sm:mt-8 rounded-2xl shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none'>
                              
                                <div className='relative sm:px-3  md:p-6 flex-auto'>
                                    <button
                                        className='text-lightGrey hover:text-darkTextColor absolute -right-2 -top-2 rounded-full bg-veryLightGrey  uppercase  text-sm outline-none focus:outline-none p-1 ease-linear transition-all duration-150'
                                        type='button'
                                        onClick={() => setshowModaleditDetails(false)}>
                                        <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
                                            <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
                                        </svg>
                                    </button>
                                    <div className='rounded-lg bg-white'>
                                        <div className=''>
                                            <h2 className='heading-medium text-center'>Edit Profile</h2>
                                            <div className='lg:flex'>
                                                <div className='relative flex lg:basis-1/3 lg:flex items-center justify-center'>
                                                    <img src='/imgs/user/user4.png' alt='User-Img' className='text-center rounded-lg' />
                                                    <div className='absolute right-[150px] lg:right-[65px] lg:bottom-[20px] bottom-[0px]'>
                                                        <DropDown
                                                            data={upload_data}
                                                            defaultValue={''}
                                                            icon={
                                                                <span className='text-2xl bg-brandBlue p-2 rounded-full text-white shadow-md'>
                                                                    <BsCamera />
                                                                </span>
                                                            }
                                                            getData={undefined}
                                                        />
                                                    </div>
                                                </div>
                                                <div className='lg:basis-2/3 lg:m-0 m-5'>
                                                    <div className='lg:flex lg:w-full'>
                                                        <div className='input_box flex flex-col lg:w-1/2'>
                                                            <label className='text-sm py-2 text-darkTextColor' htmlFor=''>
                                                                First Name{' '}
                                                            </label>
                                                            <div className='remove_margin'>
                                                                <FloatingTextfield
                                                                    type='text'
                                                                    label={''}
                                                                    name='firstName'
                                                                    value={formState.values.firstName || ''}
                                                                    onChange={handleChange}
                                                                    autoComplete={undefined}
                                                                    onPaste={undefined}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className='input_box flex flex-col lg:w-1/2 lg:ml-3'>
                                                            <label className='text-sm py-2 text-darkTextColor' htmlFor=''>
                                                                Last Name{' '}
                                                            </label>
                                                            <div className='remove_margin'>
                                                                <FloatingTextfield
                                                                    type='text'
                                                                    label={''}
                                                                    name='lastName'
                                                                    value={formState.values.lastName || ''}
                                                                    onChange={handleChange}
                                                                    autoComplete={undefined}
                                                                    onPaste={undefined}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='lg:flex lg:w-full'>
                                                        <div className='input_box flex flex-col lg:w-1/2'>
                                                            <label className='text-sm py-2 text-darkTextColor' htmlFor=''>
                                                                Work email address{' '}
                                                            </label>
                                                            <div className='remove_margin'>
                                                                <FloatingTextfield
                                                                    type='email'
                                                                    label={''}
                                                                    name='workEmailAddress'
                                                                    value={formState.values.workEmailAddress || ''}
                                                                    onChange={handleChange}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className='input_box flex flex-col lg:w-1/2 lg:ml-3'>
                                                            <label className='text-sm py-2 text-darkTextColor' htmlFor=''>
                                                                Mobile number (optional){' '}
                                                            </label>
                                                            <div className='remove_margin'>
                                                                <FloatingTextfield
                                                                    type='text'
                                                                    label={''}
                                                                    name='mobileNumber'
                                                                    value={formState.values.phoneNumber || ''}
                                                                    onChange={handleChange}
                                                                    autoComplete={undefined}
                                                                    onPaste={undefined}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className='input_box flex flex-col lg:w-1/2 lg:ml-3'>
                                                            <label className='text-sm py-2 text-darkTextColor' htmlFor=''>
                                                                Country{' '}
                                                            </label>
                                                            <div className='remove_margin'>
                                                                <FloatingSelectfield
                                                                   
                                                                    optionsGroup={countryList}
                                                                    name={'country'}
                                                                    value={formState.values.country || ''}
                                                                    onChange={e => {
                                                                        setSelectedCountry(e.target.value);
                                                                        handleChange(e)
                                                                    }}
                                                                    error={hasError('projectId')}
                                                                    errorMsg={displayErrorMessage(formState.errors.projectId)}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='lg:flex lg:m-0 mx-5'>
                                                <div className='input_box flex flex-col lg:basis-1/3'>
                                                    <label className='text-sm py-2 text-darkTextColor' htmlFor=''>
                                                        Date of Birth ( optional ){' '}
                                                    </label>
                                                    <div className='remove_margin'>
                                                        <FloatingTextfield type='date' label={''} name='dateOfBirth' value={formState.values.dateOfBirth || ''} onChange={handleChange} />
                                                    </div>
                                                </div>
                                                <div className='input_box flex flex-col lg:ml-3 lg:basis-1/3'>
                                                    <label className='text-sm py-2 text-darkTextColor' htmlFor=''>
                                                        State{' '}
                                                    </label>
                                                    <div className='remove_margin'>
                                                        <FloatingSelectfield
                                                            optionsGroup={stateList}
                                                            name={'state'}
                                                            value={formState.values.state || ''}
                                                            onChange={e => {setSelectedState(e.target.value);
                                                            handleChange(e)}}
                                                             error={hasError('projectId')}
                                                             errorMsg={displayErrorMessage(formState.errors.projectId)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className='input_box flex flex-col lg:ml-3 lg:basis-1/3'>
                                                    <label className='text-sm py-2 text-darkTextColor' htmlFor=''>
                                                        City{' '}
                                                    </label>
                                                    <div className='remove_margin'>
                                                        <FloatingSelectfield
                                                            optionsGroup={cityList}
                                                            name={'city'}
                                                            value={formState.values.city || ''}
                                                            onChange={e => {
                                                                handleChange(e)}}
                                                             error={hasError('projectId')}
                                                             errorMsg={displayErrorMessage(formState.errors.projectId)}
                                                        />
                                                    </div>
                                                </div>

                                                <div className='input_box flex flex-col lg:ml-3 lg:basis-1/3'>
                                                    <label className='text-sm py-2 text-darkTextColor' htmlFor=''>
                                                        Zip Code
                                                    </label>
                                                    <div className='remove_margin'>
                                                        <FloatingTextfield
                                                            type='text'
                                                            label={''}
                                                            name='mobileNumber'
                                                            value={formState.values.mobileNumber || ''}
                                                            onChange={handleChange}
                                                            autoComplete={undefined}
                                                            onPaste={undefined}
                                                        />
                                                    </div>
                                                </div>
                                                <div className='input_box flex flex-col lg:ml-3 lg:basis-1/3'>
                                                    <label className='text-sm py-2 text-darkTextColor' htmlFor=''>
                                                        Timezone{' '}
                                                    </label>
                                                    <div className='remove_margin'>
                                                        <SelectDropDown data={timeZone} roundedSelect={true} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='lg:flex lg:m-0 mx-5'>
                                                <div className='input_box flex flex-col lg:ml-3 lg:basis-1/3'>
                                                    <label className='text-sm py-2 text-darkTextColor' htmlFor=''>
                                                        Date of joining{' '}
                                                    </label>
                                                    <div className='remove_margin'>
                                                        <FloatingTextfield type='date' label={''} name='dateOfBirth' value={formState.values.dateOfBirth || ''} onChange={handleChange} />
                                                    </div>
                                                </div>
                                                <div className='input_box flex flex-col lg:ml-3 lg:basis-1/3'>
                                                    <label className='text-sm py-2 text-darkTextColor' htmlFor=''>
                                                        Role{' '}
                                                    </label>
                                                    <div className='remove_margin'>
                                                        <SelectDropDown data={deptRole} roundedSelect={true} />
                                                    </div>
                                                </div>
                                                <div className='input_box flex flex-col lg:ml-3 lg:basis-1/3'>
                                                    <label className='text-sm py-2 text-darkTextColor' htmlFor=''>
                                                        Department{' '}
                                                    </label>
                                                    <div className='remove_margin'>
                                                        <SelectDropDown data={department} roundedSelect={true} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='lg:flex lg:m-0 mx-5'>
                                                <div className='input_box flex flex-col lg:ml-3 lg:basis-1/3'>
                                                    <label className='text-sm py-2 text-darkTextColor' htmlFor=''>
                                                        Superior role ( optional ){' '}
                                                    </label>
                                                    <SelectDropDown data={superiorRule} roundedSelect={true} />
                                                </div>
                                                <div className='input_box flex flex-col lg:ml-3 lg:basis-1/3'>
                                                    <label className='text-sm py-2 text-darkTextColor' htmlFor=''>
                                                        Selected superior role members (optional){' '}
                                                    </label>
                                                    <div className='remove_margin'>
                                                        <SelectDropDown data={deptRole} roundedSelect={true} />
                                                    </div>
                                                </div>
                                                <div className='input_box flex flex-col lg:ml-3 lg:basis-1/3'>
                                                    <label className='text-sm py-2 text-darkTextColor' htmlFor=''>
                                                        Select shift ( optional ){' '}
                                                    </label>
                                                    <div className='remove_margin'>
                                                        <SelectDropDown data={selectShift} roundedSelect={true} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='lg:flex lg:m-0 mx-5'>
                                                <div className='mt-2 sm:mb-1 taskTextArea lg:basis-2/3 sm:basis-1/4'>
                                                    <p className='text-sm text-darkTextColor pt-2'>Address ( optional )</p>
                                                    <TextArea type='text' label={''} error={hasError('address')} name='address' value={formState.values.address || ''} onChange={handleChange} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className='lg:flex flex items-center justify-center gap-2 lg:gap-5 mt-4lg:m-0 m-5'>
                                            <button className='text-darkBlue border text-sm font-bold px-8 py-2 rounded-full border-darkBlue cursor-pointer'>Cancel</button>
                                            <button type='submit' className='small-button items-center xs:w-full flex sm:text-md text-sm py-2 lg:px-8 lg:my-0 my-3'>
                                                <span className=''>Save Changes</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='opacity-25 fixed inset-0 z-40 bg-black' onClick={() => setshowModaleditDetails(false)}></div>
                    </div>
                </>
            )} */}
        </>
    );
}
export default index;
