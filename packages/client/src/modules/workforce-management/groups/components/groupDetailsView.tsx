import React, { useState } from 'react';
import { AiOutlineEye } from 'react-icons/ai';
import NewToolTip from '../../../../components/NewToolTip';
const groupDetails = ({ data }) => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <NewToolTip direction='top' message={'View'}>
                <a
                    className='text-xl cursor-pointer'
                    onClick={() => {
                        setOpen(true);
                    }}>
                    {' '}
                    <AiOutlineEye />
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
                                    <p className='text-2xl font-bold text-darkTextColor my-2'>Group Details</p>
                                    <div className='flex flex-col'>
                                        <div className='overflow-x-auto'>
                                            <div className='p-1.5 w-full inline-block align-middle'>
                                                <div className='overflow-hidden border rounded-lg'>
                                                    <table className='min-w-full divide-y divide-gray-200'>
                                                        <thead className='bg-gray-50 dark:bg-gray-900'>
                                                            <tr>
                                                                <th scope='col' className='px-6 py-3 text-base font-bold text-left text-gray-500 uppercase '>
                                                                    Group Name
                                                                </th>
                                                                <th scope='col' className='px-6 py-3 text-base font-bold text-left text-gray-500 uppercase '>
                                                                    Description
                                                                </th>
                                                                <th scope='col' className='px-6 py-3 text-base font-bold text-left text-gray-500 uppercase '>
                                                                    Assigned Members
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className='divide-y divide-gray-200'>
                                                            <tr>
                                                                <td className='px-6 py-4 text-sm font-medium text-gray-800 break-all'>{data.groupName}</td>
                                                                <td className='px-6 py-4 text-sm text-gray-800 break-all'>{data.groupDescription}</td>
                                                                <td className='px-6 py-4 text-sm text-gray-800 break-all'>
                                                                    {data.assignedMembers.map(function (d) {
                                                                        return (
                                                                            <button className='text-white bg-blue-700 bg-opacity-40 border-2 dark:text-gray-50 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mx-2 mb-2 '>
                                                                                <p>{d.firstName + ' ' + d.lastName}</p>
                                                                            </button>
                                                                        );
                                                                    })}
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='p-6 text-center'>
                                    <button
                                        data-modal-toggle='popup-modal'
                                        type='button'
                                        onClick={() => {
                                            setOpen(false);
                                        }}
                                        className='text-white bg-blue-700 hover:bg-blue-800 dark:text-gray-50 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'>
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className='opacity-25 fixed inset-0 z-100 bg-black'></div>
                    </div>
                </>
            )}
        </>
    );
};
export default groupDetails;
