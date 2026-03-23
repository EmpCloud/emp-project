/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react';
import validate from 'validate.js';
import { useRouter } from 'next/router';
import { AiFillCheckCircle, AiFillCloseCircle } from 'react-icons/ai';
import { addMemberApi } from '../api/post';
import toast from '../../../../components/Toster/index';
import InputFile from '../../../../components/InputFiles';
import DropDown from '../../../../components/DropDown';
import { BsCamera } from 'react-icons/bs';
import { openUpgradePlan } from '@HELPER/function';
const addBulkMembers = ({ handleGetAllUser, bulkUserModel, roleDetail, type, permissionsDetails, setbulkUserModel, setInviteStatus, limit }) => {
    const router = useRouter();
    const noOfUser = 20;
    let defaultValue = [],
        defaultTouch = [],
        defaultError = [],
        loaderFalse = [],
        loaderTrue = [];
    const handleSetValue = () => {
        new Array(noOfUser).fill(noOfUser).map((_, i) => {
            defaultValue.push({
                email: '',
                firstName: '',
                lastName: '',
                role: '',
                permission: '',
                profilePic: '',
            });
            defaultTouch.push({ email: false, firstName: false, lastName: false, role: false, permission: false });
            defaultError.push({ email: [], firstName: [], lastName: [], role: [], permission: [] });
            loaderFalse.push(false);
            loaderTrue.push(true);
        });
    };
    handleSetValue();
    const [valuesState, setValueState] = useState([...defaultValue]);
    const [isValid, setIsValid] = useState(true);
    const [errorState, setErrorState] = useState([...defaultError]);
    const [touchedState, setTouchedState] = useState([...defaultTouch]);
    const [validateLoader, setValidate] = useState([...loaderTrue]);
    const [validAllFields, setValidAllFields] = useState([...loaderFalse]);
    const [existingUser, setExistingUser] = useState([]);
    const disabledNextButton = () => {};

    useEffect(() => {
        let hasValidUser = false;
        let hasPartialUser = false;
        for (let i = 0; i < valuesState.length; i++) {
          const user = valuesState[i];
          const errors = errorState[i];
          const isFilled =user.email !== '' && user.firstName !== '' && user.lastName !== '' && user.role !== '' && user.role !== 'null' && user.permission !== '' && user.permission !== 'null';

          const isValid =(!errors.email || errors.email.length === 0) && (!errors.firstName || errors.firstName.length === 0) && (!errors.lastName || errors.lastName.length === 0) && (!errors.role || errors.role.length === 0) && (!errors.permission || errors.permission.length === 0);

          const isPartial = (user.email !== '' || user.firstName !== '' || user.lastName !== '' || (user.role !== '' && user.role !== 'null') ||    (user.permission !== '' && user.permission !== 'null')) && !isFilled;

          if (isFilled && isValid) hasValidUser = true;
          if (isPartial || (isFilled && !isValid)) {
            hasPartialUser = true;
          }
        }
        setIsValid(!hasValidUser || hasPartialUser);
      }, [valuesState, errorState]);
    const hasErrorInEmail = (i: number) => !!(errorState[i].email && valuesState[i].email !== "");

    // const hasErrorInEmail = (i: number) => !!(touchedState[i].email && errorState[i].email);
    const hasErrorInFirstName = (i: number) => !!(touchedState[i].firstName && errorState[i].firstName);
    const hasErrorInLastName = (i: number) => !!(touchedState[i].lastName && errorState[i].lastName);
    const hasErrorInRole = (i: number) => !!(touchedState[i].role && errorState[i].role);
    const hasErrorInPermission = (i: number) => !!(touchedState[i].permission && errorState[i].role);
    const isValidAllField = (i: number) => {
        return (
            valuesState[i].email != '' &&
            errorState[i].email === null &&
            valuesState[i].firstName != '' &&
            errorState[i].firstName === null &&
            valuesState[i].lastName != '' &&
            errorState[i].lastName === null &&
            valuesState[i].role != '' &&
            errorState[i].role === null &&
            valuesState[i].permission != '' &&
            errorState[i].permission === null
        );
    };
    const upload_data = [
        { text: <InputFile />, value: 1 },
        { text: 'Remove profile photo', cssClass: 'text-[#F5997B]', value: 2 },
    ];
    const handleAddUser = () => {
        addMemberApi(valuesState)
            .then(function (result) {
                if (result.data.body.status == 'success' && result.data.statusCode === 200) {
                    setbulkUserModel(false);

                    setInviteStatus(0);
                    handleGetAllUser('?limit=' + limit + '&invitationStatus=' + 0);
                    setbulkUserModel(false);
                    setValueState([...defaultValue]);
                    setTouchedState([...defaultTouch]);
                    setValidate([...loaderTrue]);
                    toast({
                        type: 'success',
                        message: result ? result.data.body.message : 'Try again !',
                    });
                } else {
                    if (result.data.statusCode === 206) {
                        setExistingUser(
                            result.data.body.data.existUser.map(d => {
                                return d.email;
                            })
                        );
                        result.data.body.data.existUser.map(d => {
                            setValidate(current =>
                                current.filter(obj => {
                                    return obj.email !== d.email;
                                })
                            );
                        });
                    } else {
                        toast({
                            type: 'error',
                            message: result ? result.data.body.message : 'Error',
                        });
                    }
                }
            })
            .catch(function (e) {
                if(e?.response?.status===429){
                    openUpgradePlan();
                    setbulkUserModel(false);
                    
                }else{
                setbulkUserModel(false);
                toast({
                    type: 'error',
                    message: e.response ? (e.response.data.body.message == 'Validation failed.' ? e.response.data.body.error : e.response.data.body.message) : 'Something went wrong, Try again !',
                });
            }
            });
    };

    return (
        <>
            <button
                onClick={() => {
                    setbulkUserModel(true);
                    handleSetValue();
                    setIsValid(true);
                }}
                className='small-button items-center py-2 flex h-8'>
                <div className='flex items-center'>
                    <p className='m-0 p-0'>Add bulk Members</p>
                </div>
            </button>
            {bulkUserModel && (
                <>
                    <>
                        <div className='justify-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-[10000] outline-none focus:outline-none'>
                            <div className='relative my-2 mx-auto w-11/12 z-50'>
                                {/*content*/}
                                <div className='border-0 mb-7 sm:mt-8 rounded-2xl shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none'>
                                    {/*header*/}
                                    {/*body*/}
                                    <div className='relative py-5 sm:px-3 p-3 md:px-10 flex-auto'>
                                        <button
                                            className='text-lightGrey hover:text-darkTextColor absolute -right-2 -top-2 rounded-full bg-veryLightGrey  uppercase  text-sm outline-none focus:outline-none p-1 ease-linear transition-all duration-150'
                                            type='button'
                                            onClick={() => {
                                                setbulkUserModel(false);
                                                setTouchedState([...defaultTouch]);
                                                setValidate([...loaderTrue]);
                                                setValueState([...defaultValue]);
                                            }}>
                                            <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' stroke-width='2'>
                                                <path stroke-linecap='round' stroke-linejoin='round' d='M6 18L18 6M6 6l12 12' />
                                            </svg>
                                        </button>
                                        <div className='rounded-lg bg-white'>
                                            {/* body task popup start here */}
                                            <>
                                                <div className='flex justify-between'>
                                                    <h2 className='heading-big'>Add Associates / Members</h2>
                                                    <button
                                                        // disabled={existingUser.length !== 0}
                                                        className='small-button items-center xs:w-full py-2 flex h-9 mb-2'
                                                        onClick={handleAddUser}
                                                        disabled={isValid}
                                                        >
                                                        Add Member
                                                        <svg xmlns='http://www.w3.org/500/svg' className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
                                                            <path strokeLinecap='round' strokeLinejoin='round' d='M9 5l7 7-7 7'></path>
                                                        </svg>
                                                    </button>
                                                </div>
                                                <div className='card'>
                                                    <h3 className='heading-medium'>Onboard upto {noOfUser} Associates / Members</h3>
                                                    <div className='max-h-[calc(100vh-260px)] min-h-[calc(100vh-260px)] overflow-auto thin-scrollbar-firefox px-2.5 pb-2.5 -mx-2.5'>
                                                        {valuesState.map(function (value, i) {
                                                            return (
                                                                <div className='flex border-b border-lightGrey items-center justify-center' key={i}>
                                                                    <div className='w-[5%] mt-5 mb-2 mr-5'>
                                                                        <span className='text-darkTextColor w-[30px] h-[30px] flex items-center justify-center bg-veryLightBlue rounded-full'>
                                                                            {i + 1}
                                                                        </span>
                                                                    </div>
                                                                    <div className='flex w-[90%] justify-between flex-col lg:flex-row lg:flex-wrap mr-5'>
                                                                        <div
                                                                            className={
                                                                                hasErrorInEmail(i)
                                                                                    ? 'floating-label-group floating-error floated mt-5 mb-2 w-full lg:w-[28%] xl:w-[18%]'
                                                                                    : `floating-label-group mt-5 mb-2 w-full lg:w-[28%] xl:w-[18%] ${valuesState[i].email != '' ? 'floated' : ''}`
                                                                            }>
                                                                            <input
                                                                                type='text'
                                                                                className={
                                                                                    hasErrorInEmail(i)
                                                                                        ? 'rounded-full border border-redColor px-5 py-1 dark:bg-transparent  w-full font-normal text-defaultTextColor outline-none focus:border-redColor transition-all'
                                                                                        : 'rounded-full border border-lightBlue px-5 py-1  dark:bg-transparent w-full font-normal text-defaultTextColor outline-none focus:border-brandBlue transition-all'
                                                                                }
                                                                                onChange={event => {
                                                                                    setExistingUser([]); // Reset existing user list if any
                                                                                    event.preventDefault();
                                                                                    const value = event.target.value; // Get the email value from the input
                                                                                
                                                                                    // Perform validation only if the field is not empty
                                                                                    const errors = value !== '' 
                                                                                        ? validate(
                                                                                            { email: value },
                                                                                            {
                                                                                                email: {
                                                                                                    email: {  // Only validate email format if the field is not empty
                                                                                                        message: "doesn't look like a valid email",
                                                                                                    },
                                                                                                },
                                                                                            }
                                                                                        )
                                                                                        : {}; // If the field is empty, no validation errors
                                                                                
                                                                                    console.log(errors); // Log the validation result for debugging
                                                                                
                                                                                    const formStateValues = valuesState;
                                                                                    const formStateTouch = touchedState;
                                                                                    const formStatError = errorState;
                                                                                
                                                                                    // Update the value in the state
                                                                                    formStateValues[i].email = value;
                                                                                
                                                                                    // If the email field is empty, set error to null, otherwise apply validation errors
                                                                                    formStatError[i].email = value !== '' && errors?.email ? errors.email : null;
                                                                                
                                                                                    // Set the touched state to true for email field
                                                                                    formStateTouch[i].email = true;
                                                                                
                                                                                    // Update the state with new values, errors, and touched state
                                                                                    setErrorState([...formStatError]);
                                                                                    setTouchedState([...formStateTouch]);
                                                                                    setValueState([...formStateValues]);
                                                                                }}
                                                                                
                                                                            />
                                                                            <label className='floating-label'>Work email address<span className='text-red-500 ml-1'>*</span></label>
                                                                        </div>
                                                                        <div
                                                                            className={
                                                                                hasErrorInFirstName(i)
                                                                                    ? 'floating-label-group floating-error floated mt-5 mb-2 w-full lg:w-[28%] xl:w-[18%]'
                                                                                    : `floating-label-group mt-5 mb-2 w-full lg:w-[28%] xl:w-[18%] ${valuesState[i].firstName != '' ? 'floated' : ''}`
                                                                            }>
                                                                            <input
                                                                                type='text'
                                                                                className={
                                                                                    hasErrorInFirstName(i)
                                                                                        ? 'rounded-full border border-redColor px-5 py-1 w-full dark:bg-transparent font-normal text-defaultTextColor outline-none focus:border-redColor transition-all'
                                                                                        : 'rounded-full border border-lightBlue px-5 py-1 w-full  dark:bg-transparent font-normal text-defaultTextColor outline-none focus:border-brandBlue transition-all'
                                                                                }
                                                                                onChange={event => {
                                                                                    setExistingUser([]);
                                                                                    event.preventDefault();
                                                                                    const errors = validate(
                                                                                        { firstName: event.target.value },
                                                                                        {
                                                                                            firstName: {
                                                                                                presence: true,
                                                                                                format: {
                                                                                                    pattern: "[a-zA-Z0-9 !@#$%^&*()\-_=+<>?.,:;{}|]*" ,
                                                                                                    message: 'can only contain alphabets.',
                                                                                                    length: { minimum: 4, maximum: 20 },
                                                                                                },
                                                                                            },
                                                                                        }
                                                                                    );
                                                                                    const formStateValues = valuesState;
                                                                                    const formStateTouch = touchedState;
                                                                                    const formStatError = errorState;
                                                                                    formStateValues[i].firstName = event.target.value;
                                                                                    formStateValues[i].profilePic =
                                                                                        'https://api.dicebear.com/7.x/initials/svg?seed=' +
                                                                                        formStateValues[i].firstName +
                                                                                        formStateValues[i].lastName +
                                                                                        '.svg';
                                                                                    formStatError[i].firstName = errors ? errors.firstName : null;
                                                                                    formStateTouch[i].firstName = true;
                                                                                    setErrorState([...formStatError]);
                                                                                    setTouchedState([...formStateTouch]);
                                                                                    setValueState([...formStateValues]);
                                                                                }}
                                                                            />
                                                                            <label className='floating-label'>First name<span className='text-red-500 ml-1'>*</span></label>
                                                                        </div>
                                                                        <div
                                                                            className={
                                                                                hasErrorInLastName(i)
                                                                                    ? 'floating-label-group floating-error floated mt-5 mb-2 w-full lg:w-[28%] xl:w-[18%]'
                                                                                    : `floating-label-group mt-5 mb-2 w-full lg:w-[28%] xl:w-[18%] ${valuesState[i].lastName != '' ? 'floated' : ''}`
                                                                            }>
                                                                            <input
                                                                                type='text'
                                                                                className={
                                                                                    hasErrorInLastName(i)
                                                                                        ? 'rounded-full border border-redColor px-5 py-1  w-full dark:bg-transparent font-normal text-defaultTextColor outline-none focus:border-redColor transition-all'
                                                                                        : 'rounded-full border border-lightBlue px-5 py-1 w-full dark:bg-transparent font-normal text-defaultTextColor outline-none focus:border-brandBlue transition-all'
                                                                                }
                                                                                onChange={event => {
                                                                                    setExistingUser([]);
                                                                                    event.preventDefault();
                                                                                    const errors = validate(
                                                                                        { lastName: event.target.value },
                                                                                        {
                                                                                            lastName: {
                                                                                                presence: true,
                                                                                                format: {
                                                                                                    pattern: "[a-zA-Z0-9 !@#$%^&*()\-_=+<>?.,:;{}|]*" ,
                                                                                                    message: 'can only contain alphabets.',
                                                                                                    length: { minimum: 4, maximum: 20 },
                                                                                                },
                                                                                            },
                                                                                        }
                                                                                    );
                                                                                    const formStateValues = valuesState;
                                                                                    const formStateTouch = touchedState;
                                                                                    const formStatError = errorState;
                                                                                    formStateValues[i].lastName = event.target.value;
                                                                                    formStateValues[i].profilePic =
                                                                                        'https://api.dicebear.com/7.x/initials/svg?seed=' +
                                                                                        formStateValues[i].firstName +
                                                                                        formStateValues[i].lastName +
                                                                                        '.svg';
                                                                                    formStatError[i].lastName = errors ? errors.lastName : null;
                                                                                    formStateTouch[i].lastName = true;
                                                                                    setErrorState([...formStatError]);
                                                                                    setTouchedState([...formStateTouch]);
                                                                                    setValueState([...formStateValues]);
                                                                                }}
                                                                            />
                                                                            <label className='floating-label px-2'>Last name<span className='text-red-500 ml-1'>*</span></label>
                                                                        </div>
                                                                        <div
                                                                            className={
                                                                                hasErrorInLastName(i)
                                                                                    ? 'floating-label-group floating-error floated mt-5 mb-2 w-full lg:w-[45%] xl:w-[18%]'
                                                                                    : `floating-label-group mt-5 mb-2 w-full lg:w-[45%] xl:w-[18%] ${valuesState[i].lastName != '' ? 'floated' : ''}`
                                                                            }>
                                                                            <select
                                                                                className={
                                                                                    hasErrorInRole(i)
                                                                                        ? 'bg-white rounded-full border border-redColor px-5 py-1  w-full font-normal text-defaultTextColor outline-none focus:border-redColor transition-all'
                                                                                        : 'bg-white rounded-full border border-lightBlue px-5 py-1 w-full font-normal text-defaultTextColor outline-none focus:border-brandBlue transition-all'
                                                                                }
                                                                                onChange={event => {
                                                                                    setExistingUser([]);
                                                                                    event.preventDefault();
                                                                                    const errors = validate(
                                                                                        { role: event.target.value },
                                                                                        {
                                                                                            role: {
                                                                                                presence: true,
                                                                                            },
                                                                                        }
                                                                                    );
                                                                                    const formStateValues = valuesState;
                                                                                    const formStateTouch = touchedState;
                                                                                    const formStatError = errorState;
                                                                                    formStateValues[i].role = event.target.value;
                                                                                    formStatError[i].role = errors ? errors.role : null;
                                                                                    formStateTouch[i].role = true;
                                                                                    setErrorState([...formStatError]);
                                                                                    setTouchedState([...formStateTouch]);
                                                                                    setValueState([...formStateValues]);
                                                                            }}
                                                                            onFocus={(e) => {
                                                                            e.target.parentElement.classList.add('floated');
                                                                            }}
                                                                            onBlur={(e) => {
                                                                            const val = valuesState[i].role;
                                                                            if (val === '' || val === 'null') {
                                                                                e.target.parentElement.classList.remove('floated');
                                                                            }
                                                                                }}>
                                                                                <option value={"null"} className='dark:bg-gray-950 dark:text-[#fff]' selected={true} />
                                                                                {roleDetail &&
                                                                                    roleDetail.map((option, key) => (
                                                                                        <option key={key} value={option.value} className='dark:bg-gray-950 dark:text-[#fff] w-[4rem] truncate'>
                                                                                            {option && option.text && (
                                                                                                option.text.length > 28 ? option.text.substring(0, 28) + '...' : option.text
                                                                                                        )}
                                                                                        </option>
                                                                                    ))}
                                                                            </select>
                                                                            {valuesState[i].role === '' && <label className='floating-label'>Role<span className='text-red-500 ml-1'>*</span></label>}
                                                                        </div>
                                                                        <div
                                                                            className={
                                                                                hasErrorInLastName(i)
                                                                                    ? 'floating-label-group floating-error floated mt-5 mb-2 w-full lg:w-[45%] xl:w-[18%]'
                                                                                    : `floating-label-group mt-5 mb-2 w-full lg:w-[45%] xl:w-[18%] ${valuesState[i].lastName != '' ? 'floated' : ''}`
                                                                            }>
                                                                            <select
                                                                                className={
                                                                                    hasErrorInPermission(i)
                                                                                        ? 'bg-white rounded-full border border-redColor px-5 py-1 w-full font-normal text-defaultTextColor outline-none focus:border-redColor transition-all'
                                                                                        : 'bg-white rounded-full border border-lightBlue px-5 py-1 w-full font-normal text-defaultTextColor outline-none focus:border-brandBlue transition-all'
                                                                                }
                                                                                onChange={event => {
                                                                                    setExistingUser([]);
                                                                                    event.preventDefault();
                                                                                    const errors = validate(
                                                                                        { permission: event.target.value },
                                                                                        {
                                                                                            permission: {
                                                                                                presence: true,
                                                                                            },
                                                                                        }
                                                                                    );
                                                                                    const formStateValues = valuesState;
                                                                                    const formStateTouch = touchedState;
                                                                                    const formStatError = errorState;
                                                                                    formStateValues[i].permission = event.target.value;
                                                                                    formStatError[i].permission = errors ? errors.permission : null;
                                                                                    formStateTouch[i].permission = true;
                                                                                    setErrorState([...formStatError]);
                                                                                    setTouchedState([...formStateTouch]);
                                                                                    setValueState([...formStateValues]);
                                                                                }}
                                                                                onFocus={(e) => {
                                                                                e.target.parentElement.classList.add('floated');
                                                                                }}
                                                                                onBlur={(e) => {
                                                                                const val = valuesState[i].role;
                                                                                if (val === '' || val === 'null') {
                                                                                    e.target.parentElement.classList.remove('floated');
                                                                                } 
                                                                                }}>
                                                                                <option value={"null"} className='dark:bg-gray-950 dark:text-[#fff]' selected={true} />
                                                                                {permissionsDetails &&
                                                                                    permissionsDetails.map((option, key) => (
                                                                                        <option key={key} value={option.value} className='dark:bg-gray-950 dark:text-[#fff] w-[4rem] truncate'>
                                                                                            {option && option.text && (
                                                                                                option.text.length > 28 ? option.text.substring(0, 28) + '...' : option.text
                                                                                                        )}
                                                                                        </option>
                                                                                    ))}
                                                                            </select>
                                                                            {valuesState[i].permission === '' && <label className='floating-label'>Permission<span className='text-red-500 ml-1'>*</span></label>}
                                                                        </div>
                                                                    </div>
                                                                    <div className='flex justify-center items-center mt-5 mb-2 w-[5%]'>
                                                                    {/* {((validateLoader[i] &&
                                                                        (touchedState[i].email ||
                                                                            touchedState[i].lastName ||
                                                                            touchedState[i].firstName ||
                                                                            touchedState[i].role ||
                                                                            touchedState[i].permission) &&
                                                                        !isValidAllField(i)) ||
                                                                        validAllFields[i]) && (
                                                                        <svg
                                                                            role='status'
                                                                            className='w-6 h-6 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600'
                                                                            viewBox='0 0 100 101'
                                                                            fill='none'
                                                                            xmlns='http://www.w3.org/2000/svg'>
                                                                            <path
                                                                                d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                                                                                fill='currentColor'
                                                                            />
                                                                            <path
                                                                                d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                                                                                fill='currentFill'
                                                                            />
                                                                        </svg>
                                                                    )} */}
                                                                      {(valuesState[i].email !== '' || valuesState[i].firstName !== '' ||
                                                                        valuesState[i].lastName !== '' || (valuesState[i].role !== '' && valuesState[i].role !== 'null') || (valuesState[i].permission !== '' && valuesState[i].permission !== 'null')) && (isValidAllField(i) && !existingUser.includes(valuesState[i].email) && valuesState[i].role !== '' && valuesState[i].role !== 'null' && valuesState[i].permission !== '' && valuesState[i].permission !== 'null' ? (
                                                                            <span className='text-greenColor text-2xl'>
                                                                                <AiFillCheckCircle />
                                                                            </span>
                                                                        ) : (
                                                                            <span className='text-redColor text-2xl'>
                                                                            <AiFillCloseCircle />
                                                                            </span>
                                                                        )
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </>
                                            {/* body task popup end here */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='opacity-25 fixed inset-0 z-100 bg-black' onClick={() => setbulkUserModel(false)}></div>
                        </div>
                    </>
                </>
            )}
        </>
    );
};
export default addBulkMembers;
