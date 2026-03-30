import NewToolTip from '@COMPONENTS/NewToolTip';
import React, { useState, useEffect } from 'react';
import { AiOutlineEye } from 'react-icons/ai';
import { TiTickOutline } from 'react-icons/ti';
import { RxCross2 } from 'react-icons/rx';
import { capitalizeString } from '@HELPER/function';
import { transformForDisplay } from '@HELPER/permissions';
const index = ({ data }) => {
    const [open, setOpen] = useState(false);
    let updatedPermission = transformForDisplay(data.permissionConfig);
    
    
    return (
        <>
            {/* <NewToolTip direction='left' message={'permission'}> */}
                <a
                    onClick={() => {
                        setOpen(true);
                    }}>
                    {' '}
                    <AiOutlineEye />
                </a>
            {/* </NewToolTip> */}
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
                                        <p className='text-2xl font-bold text-darkTextColor my-2'>Permission View</p>
                                        <div className='flex flex-row'>
                                          
                                        </div>
                                    </div>

                                    <div className=' overflow-y-auto'>
                                    <table className='table-fixed min-w-[500px]'>
                                        <thead>
                                            <tr className=' !border-t-0'>
                                                <th className=''>
                                                    <div className=''>
                                                    Components
                                                    </div>
                                                    </th>
                                                <th><div className='flex justify-center'>
                                                    View
                                                    </div>
                                                    </th>
                                                <th><div className='flex justify-center'>
                                                    Create
                                                    </div>
                                                    </th>
                                                <th><div className='flex justify-center'>
                                                    Edit
                                                    </div>
                                                    </th>
                                                <th><div className='flex justify-center'>
                                                    Delete
                                                    </div>
                                                    </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data &&
                                                Object.entries(updatedPermission).map(function (t, k) {
                                                    return (
                                                        <tr key={t[0]}>
                                                            <td><div className='flex justify-start'>
                                                                {capitalizeString(t[0])}
                                                                </div>
                                                                </td>
                                                            <td>{t[1]['view'] ? <div className='flex justify-center'><TiTickOutline color='green' /></div> : <div className='flex justify-center'><RxCross2 color='red' /></div>}</td>
                                                            <td>{t[1]['create'] ? <div className='flex justify-center'><TiTickOutline color='green' /></div> : <div className='flex justify-center'><RxCross2 color='red' /></div>}</td>
                                                            <td>{t[1]['edit'] ? <div className='flex justify-center'><TiTickOutline color='green' /></div> : <div className='flex justify-center'><RxCross2 color='red' /></div>}</td>
                                                            <td>{t[1]['delete'] ? <div className='flex justify-center'><TiTickOutline color='green' /></div> : <div className='flex justify-center'><RxCross2 color='red' /></div>}</td>
                                                        </tr>
                                                    );
                                                })}
                                        </tbody>
                                    </table>
                                    </div>

                                    <div className='flex flex-col'>
                                        <div className=''>
                                            <div className='p-1.5 w-full inline-block align-middle'>
                                                <div className='overflow-hidden border rounded-lg '>
                                                    {/* {Object.entries(permission).map(function (t, k) {
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
                                                    })} */}
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
export default index;
