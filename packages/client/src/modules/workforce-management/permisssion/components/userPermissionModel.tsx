import FloatingTextfield from '@COMPONENTS/FloatingTextfield';
import React, { useState, useEffect } from 'react';
import { HiKey } from 'react-icons/hi';
import NewToolTip from '../../../../components/NewToolTip';
const userDetails = ({ data }) => {
    const [open, setOpen] = useState(false);
    const [permission, setPermission] = useState(data);
    useEffect(() => {}, [permission, data]);
    const handleSetValue = (event, key, subKey) => {
        let temp = permission[key];
        temp[subKey] = !permission[key][subKey];
        setPermission({ ...permission, ...{ [key]: temp } });
    };
    const handleSetAll = (event, k) => {
        let temp = permission[k];
        let checkbox = document.getElementById(k + '_all');
        //
        if (event.target.checked === false) {
            temp['view'] = false;
            temp['create'] = false;
            temp['edit'] = false;
            temp['delete'] = false;
            setPermission({ ...permission, ...{ [k]: temp } });
            checkbox.indeterminate = false;
        } else {
            temp['view'] = true;
            temp['create'] = true;
            temp['edit'] = true;
            temp['delete'] = true;
            setPermission({ ...permission, ...{ [k]: temp } });
            checkbox.indeterminate = true;
        }
    };
    const handleAllPermission = event => {
        Object.entries(permission).map(function (t) {
            let checkbox = document.getElementById(t[0] + '_all');
            let checkboxAllpermission = document.getElementById('allpermission');
            let temp = permission[t[0]];
            if (event.target.checked === false) {
                temp['view'] = false;
                temp['create'] = false;
                temp['edit'] = false;
                temp['delete'] = false;
                setPermission({ ...permission, ...{ [t[0]]: temp } });
                checkbox.indeterminate = false;
                checkboxAllpermission.indeterminate = false;
            } else {
                temp['view'] = true;
                temp['create'] = true;
                temp['edit'] = true;
                temp['delete'] = true;
                setPermission({ ...permission, ...{ [t[0]]: temp } });
                checkbox.indeterminate = true;
                checkboxAllpermission.indeterminate = true;
            }
        });
    };
    return (
        <>
            <NewToolTip direction='left' message={'permission'}>
                <a
                    onClick={() => {
                        setOpen(true);
                    }}>
                    {' '}
                    <HiKey />
                </a>
            </NewToolTip>
            {open && (
                <>
                    <div className='justify-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-[10000] outline-none focus:outline-none'>
                        <div className='relative my-2 mx-auto w-11/12 lg:w-8/12 z-50'>
                            {/*content*/}
                            <div className='border-0 mb-7 sm:mt-8 rounded-2xl shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none'>
                                {/*header*/}
                                {/*body*/}
                                <button
                                    className='text-lightGrey hover:text-darkTextColor absolute -right-2 -top-2 rounded-full bg-veryLightGrey  uppercase  text-sm outline-none focus:outline-none p-1 ease-linear transition-all duration-150'
                                    type='button'
                                    onClick={() => {
                                        setOpen(false);
                                    }}>
                                    <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' stroke-width='2'>
                                        <path stroke-linecap='round' stroke-linejoin='round' d='M6 18L18 6M6 6l12 12' />
                                    </svg>
                                </button>
                                <div className='card xs:p-4'>
                                    <div className='flex flex-row justify-between '>
                                        <p className='text-2xl font-bold text-darkTextColor my-2'>Permission Details</p>
                                        <div className='flex flex-row'>
                                            <div className='flex justify-center'>
                                                <div>
                                                    <div className='flex items-center pl-3'>
                                                        <input
                                                            onClick={handleAllPermission}
                                                            id='allpermission'
                                                            type='checkbox'
                                                            value=''
                                                            className='w-4 h-4 text-blue-600 bg-gray-100  rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500'
                                                        />
                                                        <label htmlFor='edit' className='w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
                                                            All permission
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            {'   '}
                                            <button
                                                data-modal-toggle='popup-modal'
                                                type='button'
                                                onClick={() => {
                                                    setOpen(false);
                                                }}
                                                className='small-button items-center py-2 flex h-9'>
                                                Update Permission
                                            </button>
                                        </div>
                                    </div>
                                    <div className='flex flex-col'>
                                        <div className=''>
                                            <FloatingTextfield
                                                type='text'
                                                placeholder={''}
                                                label={'Permisssion name'}
                                                // error={hasError("permissionName")}
                                                // errorMsg={displayErrorMessage(
                                                // formState.errors.permissionName
                                                // )}
                                                name='permissionName'
                                                // value={formState.values.permissionName || ""}
                                                // onChange={handleChange}
                                            />
                                            <div className='p-1.5 w-full inline-block align-middle'>
                                                <div className='overflow-hidden border rounded-lg '>
                                                    {Object.entries(permission).map(function (t, k) {
                                                        return (
                                                            <>
                                                                <p className='font-bold text-darkTextColor my-2'>{t[0][0].toUpperCase() + t[0].substring(1)}</p>
                                                                <ul className='items-center w-full text-sm font-medium text-gray-900 bg-white  sm:flex dark:bg-gray-700 dark:text-white'>
                                                                    <li className='w-full border-bsm:border-b-0 sm:border-r dark:border-gray-600'>
                                                                        <div className='flex items-center pl-3'>
                                                                            <input
                                                                                onClick={event => {
                                                                                    handleSetAll(event, t[0]);
                                                                                }}
                                                                                id={t[0] + '_all'}
                                                                                type='checkbox'
                                                                                className='w-4 h-4 text-blue-600 bg-gray-100  rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500'
                                                                            />
                                                                            <label htmlFor='all' className='w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
                                                                                All
                                                                            </label>
                                                                        </div>
                                                                    </li>
                                                                    <li className='w-full border-bsm:border-b-0 sm:border-r dark:border-gray-600'>
                                                                        <div className='flex items-center pl-3'>
                                                                            <input
                                                                                id='view'
                                                                                onClick={event => {
                                                                                    handleSetValue(event, t[0], 'view');
                                                                                }}
                                                                                checked={t[1]['view']}
                                                                                type='checkbox'
                                                                                value=''
                                                                                className='w-4 h-4 text-blue-600 bg-gray-100  rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500'
                                                                            />
                                                                            <label htmlFor='view' className='w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
                                                                                View
                                                                            </label>
                                                                        </div>
                                                                    </li>
                                                                    <li className='w-full border-bsm:border-b-0 sm:border-r dark:border-gray-600'>
                                                                        <div className='flex items-center pl-3'>
                                                                            <input
                                                                                id='create'
                                                                                onClick={event => {
                                                                                    handleSetValue(event, t[0], 'create');
                                                                                }}
                                                                                checked={t[1]['create']}
                                                                                type='checkbox'
                                                                                value=''
                                                                                className='w-4 h-4 text-blue-600 bg-gray-100  rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500'
                                                                            />
                                                                            <label htmlFor='create' className='w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
                                                                                Create
                                                                            </label>
                                                                        </div>
                                                                    </li>
                                                                    <li className='w-full border-bsm:border-b-0 sm:border-r dark:border-gray-600'>
                                                                        <div className='flex items-center pl-3'>
                                                                            <input
                                                                                id='edit'
                                                                                checked={t[1]['edit']}
                                                                                onClick={event => {
                                                                                    handleSetValue(event, t[0], 'edit');
                                                                                }}
                                                                                type='checkbox'
                                                                                value=''
                                                                                className='w-4 h-4 text-blue-600 bg-gray-100  rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500'
                                                                            />
                                                                            <label htmlFor='edit' className='w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
                                                                                Edit
                                                                            </label>
                                                                        </div>
                                                                    </li>
                                                                    <li className='w-full dark:border-gray-600'>
                                                                        <div className='flex items-center pl-3'>
                                                                            <input
                                                                                id='delete'
                                                                                checked={t[1]['delete']}
                                                                                onClick={event => {
                                                                                    handleSetValue(event, t[0], 'delete');
                                                                                }}
                                                                                type='checkbox'
                                                                                value=''
                                                                                className='w-4 h-4 text-blue-600 bg-gray-100  rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500'
                                                                            />
                                                                            <label htmlFor='delete' className='w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
                                                                                Delete
                                                                            </label>
                                                                        </div>
                                                                    </li>
                                                                </ul>
                                                            </>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* <div className="p-6 text-center">
                                        <button data-modal-toggle="popup-modal" type="button" onClick={() => { setOpen(false) }}
                                            className="small-button items-center py-2 flex h-9"
                                        >
                                            Close
                                        </button>
                                    </div> */}
                            </div>
                        </div>
                        <div className='opacity-25 fixed inset-0 z-100 bg-black'></div>
                    </div>
                </>
            )}
        </>
    );
};
export default userDetails;
