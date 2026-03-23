import React from 'react'
import { AiOutlineDashboard } from 'react-icons/ai';
import { FcHighPriority } from 'react-icons/fc';
import { GiSandsOfTime } from 'react-icons/gi';
import { GrUserAdmin } from 'react-icons/gr';
import { HiOutlineBriefcase, HiOutlineLocationMarker, HiOutlineMail } from 'react-icons/hi';
import { IoMdRemoveCircle } from 'react-icons/io';
import { VscListSelection, VscGraphLine } from 'react-icons/vsc';
import NewToolTip from '../../../../components/NewToolTip';
const UserDetailsWithProjects = ({ open, close, onClick, data }) => {

    return (
        <>
            {
                data && open && (
                    <>
                        <div
                            className="justify-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                        >
                            <div className="relative my-2 mx-auto w-11/12 lg:w-9/12 z-50">
                                {/*content*/}
                                <div className="border-0 mb-7 sm:mt-8 rounded-2xl shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                    {/*header*/}
                                    {/*body*/}
                                    <button
                                        className="text-lightGrey hover:text-darkTextColor absolute -right-2 -top-2 rounded-full bg-veryLightGrey  uppercase  text-sm outline-none focus:outline-none p-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={close}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            stroke-width="2"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </button>
                                    <div className='card xs:p-4'>
                                        <div className="lg:flex items-center">
                                            <div className='flex items-center'>
                                                <div className='ml-5 pr-5 lg:border-r-2 border-veryveryLightGrey'>
                                                    <h3 className='text-darkTextColor text-xl font-bold'>{data.firstName + " " + data.lastName}</h3>
                                                    <span className='text-placeholderGrey font-normal text-base'>Web designer</span>
                                                    <div className="user-deatils mt-3">
                                                        <p className='flex items-center text-defaultTextColor'><HiOutlineMail className='mr-1' />{data.email}</p>
                                                        <p className='flex items-center mt-1 text-defaultTextColor'><GrUserAdmin className='mr-1' /> {data.role}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='w-full lg:pl-10'>
                                                <div className="flex flex-row flex-wrap xs:mt-5 md:mt-5 lg:mt-0">
                                                    <div className='md:flex lg:basis-1/5 basis-1/2  flex-col items-center'>
                                                        <p className='text-defaultTextColor'>Total projects</p>
                                                        <span className='text-darkTextColor mt-1 text-2xl font-bold flex items-center'> <HiOutlineBriefcase className='mr-2 text-darkBlue font-normal font-base' />04</span>
                                                    </div>
                                                    <div className='md:flex lg:basis-1/5 basis-1/2  flex-col items-center'>
                                                        <p className='text-defaultTextColor'>Total tasks</p>
                                                        <span className='text-darkTextColor mt-1 text-2xl font-bold flex items-center'> <VscListSelection className='mr-2 text-darkBlue font-normal font-base' />10</span>
                                                    </div>
                                                    <div className='md:flex lg:basis-1/5 basis-1/2 flex-col items-center'>
                                                        <p className='text-defaultTextColor'>Pending tasks</p>
                                                        <span className='text-darkTextColor mt-1 text-2xl font-bold flex items-center'> <GiSandsOfTime className='mr-2 text-darkBlue font-normal font-base' />20</span>
                                                    </div>
                                                    <div className='md:flex lg:basis-1/5 basis-1/2 flex-col items-center'>
                                                        <p className='text-defaultTextColor'>High priority</p>
                                                        <span className='text-darkTextColor mt-1 text-2xl font-bold flex items-center'> <FcHighPriority className='mr-2 text-darkBlue font-normal font-base' />3</span>
                                                    </div>
                                                    <div className='md:flex lg:basis-1/5 basis-1/2 flex-col items-center'>
                                                        <p className='text-defaultTextColor'>Performance</p>
                                                        <span className='text-darkTextColor mt-1 text-2xl font-bold flex items-center'> <AiOutlineDashboard className='mr-2 text-darkBlue font-normal font-base' />51%</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-5 lg:flex">
                                        <div className="card p-4 lg:w-1/2 lg:mr-5">
                                            <div className="md:flex justify-between items-start  mb-5">
                                                <h3 className="heading-medium ">Project</h3>
                                            </div>
                                            <div className="time-tracking-wrapper">
                                                <div className="flex items-center border-b-2 border-veryveryLightGrey py-2.5">
                                                    <div className="w-1/5">
                                                        <h5 className="text-defaultTextColor text-base truncate">Emp Monitor</h5>
                                                        <p className="text-lightGrey text-sm mb-1 truncate">
                                                            Emp-101
                                                        </p>
                                                    </div>
                                                    <div className="w-3/5 ml-6">
                                                        <span className=' text-defaultTextColor text-base'>50%</span>
                                                        <div className="w-full bg-veryLightGrey h-2 rounded-full dark:bg-veryLightGrey">
                                                            <div className="bg-redColor text-[0.5rem] h-2 font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={{ width: "50%" }}></div>
                                                        </div>
                                                    </div>
                                                    <div className="text-base font-bold w-1/5 ml-6">Tasks(5)</div>
                                                    <NewToolTip direction={"left"} message={"Remove"}>
                                                        <button className=""><IoMdRemoveCircle size={30} /></button>
                                                    </NewToolTip>                                                </div>
                                                <div className="flex items-center border-b-2 border-veryveryLightGrey py-2.5">
                                                    <div className="w-1/5">
                                                        <h5 className="text-defaultTextColor text-base truncate">Power Add-spay</h5>
                                                        <p className="text-lightGrey text-sm mb-1 truncate">
                                                            PWD-102
                                                        </p>
                                                    </div>
                                                    <div className="w-3/5 ml-6">
                                                        <span className=' text-defaultTextColor text-base'>50%</span>
                                                        <div className="w-full bg-veryLightGrey h-2 rounded-full dark:bg-veryLightGrey">
                                                            <div className="bg-redColor text-[0.5rem] h-2 font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={{ width: "50%" }}></div>
                                                        </div>
                                                    </div>
                                                    <div className="text-base font-bold w-1/5 ml-6">Tasks(5)</div>
                                                    <NewToolTip direction={"left"} message={"Remove"}>
                                                        <button className=""><IoMdRemoveCircle size={30} /></button>
                                                    </NewToolTip>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card p-4 lg:w-1/2 xs:mt-5 md:mt-5 lg:mt-0">
                                            <div className="md:flex justify-between items-start  mb-5">
                                                <h3 className="heading-medium dark:text-darkTitleColor">Tasks</h3>
                                            </div>
                                            <div className="time-tracking-wrapper">
                                                <div className="flex items-center border-b-2 border-veryveryLightGrey py-2.5">
                                                    <div className="w-1/5">
                                                        <h5 className="text-defaultTextColor text-base truncate">Emp monitor</h5>
                                                        <p className="text-lightGrey text-sm mb-1 truncate">
                                                            Create Ui in task
                                                        </p>
                                                    </div>
                                                    <div className="w-3/5 ml-6">
                                                        <span className=' text-defaultTextColor text-base'>50%</span>
                                                        <div className="w-full bg-veryLightGrey h-2 rounded-full dark:bg-veryLightGrey">
                                                            <div className="bg-redColor text-[0.5rem] h-2 font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={{ width: "50%" }}></div>
                                                        </div>
                                                    </div>
                                                    <div >
                                                        <p className={"priority-with-bg text-priority1Color bg-priority1bg"}>High</p>
                                                    </div>
                                                    <NewToolTip direction={"left"} message={"Remove"}>
                                                        <button className=""><IoMdRemoveCircle size={30} /></button>
                                                    </NewToolTip>
                                                </div>       <div className="flex items-center border-b-2 border-veryveryLightGrey py-2.5">
                                                    <div className="w-1/5">
                                                        <h5 className="text-defaultTextColor text-base truncate">Emp monitor</h5>
                                                        <p className="text-lightGrey text-sm mb-1 truncate">
                                                            Create Ui in task
                                                        </p>
                                                    </div>
                                                    <div className="w-3/5 ml-6">
                                                        <span className=' text-defaultTextColor text-base'>50%</span>
                                                        <div className="w-full bg-veryLightGrey h-2 rounded-full dark:bg-veryLightGrey">
                                                            <div className="bg-redColor text-[0.5rem] h-2 font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={{ width: "50%" }}></div>
                                                        </div>
                                                    </div>
                                                    <div >
                                                        <p className={"priority-with-bg text-priority1Color bg-priority1bg"}>High</p>
                                                    </div>
                                                    <NewToolTip direction={"left"} message={"Remove"}>
                                                        <button className=""><IoMdRemoveCircle size={30} /></button>
                                                    </NewToolTip>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-6 text-center">
                                        <button data-modal-toggle="popup-modal" type="button"
                                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                        >
                                            Done
                                        </button>
                                        <button onClick={close} data-modal-toggle="popup-modal" type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">No, cancel</button>
                                    </div>
                                </div>
                            </div>
                            <div className="opacity-25 fixed inset-0 z-40 bg-black" onClick={close}></div>
                        </div>
                    </>
                )}
        </>
    )
}
export default UserDetailsWithProjects;