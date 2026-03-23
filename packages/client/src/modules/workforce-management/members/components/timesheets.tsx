// import React, { useEffect, useState } from 'react';
// import { AiOutlineEdit } from 'react-icons/ai';
// import { BsDownload } from 'react-icons/bs';
// import DropDown from '../../../../components/DropDown';
// import NewToolTip from '../../../../components/NewToolTip';
// import TooltipProfile from '../../../../components/TooltipProfile';
// function Timesheets() {
//     useEffect(() => {
//         document.querySelector("body").classList.add("bodyBg");
//     });
//     // Dropdown
//     const download_data = [
//         { text: "Download CSV file", value: 1 },
//         { text: "Download PDF file", value: 2 },
//     ];
//     //   Member seleection and there role
//     const member_data = [
//         { text: "Roles & permissiions", value: 1 },
//         { text: "Rules", value: 2 },
//         { text: "Delete this member", value: 3 },
//     ];
//     // Filter top head
//     const filter = [
//         { name: 'Filter' },
//         { name: 'Filter 1' },
//         { name: 'Filter 2' },
//         { name: 'Filter 3' }
//     ]
//     //sort top head
//     const sort = [
//         { name: 'High Performance' },
//         { name: 'performance 1' },
//         { name: 'performance 2' },
//         { name: 'performance 3' }
//     ]
//     const [showModalTask, setShowModalTask] = useState(false);
//     const [showModalTaskDrop, setShowModalTaskDrop] = useState(false);
//     const [showTaskModal, setTaskShowModal] = useState(false);
//     const [showModalViewAttach, setShowModalViewAttach] = useState(false);
//     // Attachment Model
//     const [showModal, setShowModal] = useState(false);
//     return (
//         <>
//             <div className='font-inter'>
//                 <div className='flex items-center justify-between my-2 mb-4 flex-wrap'>
//                     <div className='font-bold mb-0 heading-big text-darkTextColor '>
//                         Timesheets
//                     </div>
//                     <NewToolTip direction='left' message={"Download"}>
//                         <DropDown data={download_data} defaultValue={""}
//                             icon={<span className="text-2xl grey-link bg-white p-2 rounded-lg"><BsDownload /></span>}
//                         />
//                     </NewToolTip>
//                 </div>
//                 <div className='card'>
//                     <div className=''>
//                         <div className='flex items-center justify-between md:flex-nowrap flex-wrap gap-4'>
//                             <form className='w-60'>
//                                 <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-gray-300">Search</label>
//                                 <div className="relative">
//                                     <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
//                                         <svg className="w-5 h-5 text-lightTextColor" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
//                                     </div>
//                                     <input type="search" id="default-search" className="block p-4 pl-10 w-full text-sm h-8 border-none outline-none rounded-full text-lightTextColor bg-veryveryLightGrey border-lightBlue  " placeholder="Search..." />
//                                 </div>
//                             </form>
//                             <div className='flex items-center'>
//                                 <div className='relative mr-3 w-52'>
//                                     {/* <PopoverDropdown icon={<FiFilter className='mr-2 text-defaultTextColor' />} /> */}
//                                 </div>
//                                 <NewToolTip direction='left' message={"Edit Table"}> <div className='xs:hidden border border-veryLightGrey text-2xl px-3 py-2 rounded-lg cursor-pointer' onClick={() => setShowModalViewAttach(true)}><AiOutlineEdit className='text-defaultTextColor' /></div></NewToolTip>
//                             </div>
//                         </div>
//                     </div>
//                     <div className="flex">
//                         <div className="w-52 timesheet-wrapper">
//                             <table className="table-style stylesheet-wrapper">
//                                 <thead>
//                                     <tr>
//                                         <th className='w-[180px]'>Member</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody className="max-h-[calc(100vh-250px)]">
//                                     <tr>
//                                         <td className='w-[180px] pb-3.5 pt-3.5'>
//                                             <div className='flex gap-2 items-center'>
//                                                 <div>
//                                                     <TooltipProfile name="Amal Jay" job="Web designer" btnName='View Profile' direction="right" imgpath="/imgs/user/user1.png">
//                                                         <span className="example-emoji" role="img" aria-label="duck emoji">
//                                                             <div className="user-img-group">
//                                                                 <img src="/imgs/user/user1.png" className="user-img-sm" alt="user" />
//                                                             </div>
//                                                         </span>
//                                                     </TooltipProfile>
//                                                 </div>
//                                                 <div className='flex flex-col  text-left'>
//                                                     <span className='pb-1 font-bold'>Amal Jay</span>
//                                                     <span className='text-base'>Web designer</span>
//                                                 </div>
//                                             </div>
//                                         </td>
//                                     </tr>
//                                     <tr>
//                                         <td className='w-[180px] !pb-3.5 !pt-3.5'>
//                                             <div className='flex gap-2 items-center'>
//                                                 <div>
//                                                     <TooltipProfile name="Amal Jay" job="Web designer" btnName='View Profile' direction="right" imgpath="/imgs/user/user1.png">
//                                                         <span className="example-emoji" role="img" aria-label="duck emoji">
//                                                             <div className="user-img-group">
//                                                                 <img src="/imgs/user/user1.png" className="user-img-sm" alt="user" />
//                                                             </div>
//                                                         </span>
//                                                     </TooltipProfile>
//                                                 </div>
//                                                 <div className='flex flex-col  text-left'>
//                                                     <span className='pb-1 font-bold'>Amal Jay</span>
//                                                     <span className='text-base'>Web designer</span>
//                                                 </div>
//                                             </div>
//                                         </td>
//                                     </tr>
//                                     <tr>
//                                         <td className='w-[180px] pb-3.5 pt-3.5'>
//                                             <div className='flex gap-2 items-center'>
//                                                 <div>
//                                                     <TooltipProfile name="Amal Jay" job="Web designer" btnName='View Profile' direction="right" imgpath="/imgs/user/user1.png">
//                                                         <span className="example-emoji" role="img" aria-label="duck emoji">
//                                                             <div className="user-img-group">
//                                                                 <img src="/imgs/user/user1.png" className="user-img-sm" alt="user" />
//                                                             </div>
//                                                         </span>
//                                                     </TooltipProfile>
//                                                 </div>
//                                                 <div className='flex flex-col  text-left'>
//                                                     <span className='pb-1 font-bold'>Amal Jay</span>
//                                                     <span className='text-base'>Web designer</span>
//                                                 </div>
//                                             </div>
//                                         </td>
//                                     </tr>
//                                     <tr>
//                                         <td className='w-[180px] !pb-3.5 !pt-3.5'>
//                                             <div className='flex gap-2 items-center'>
//                                                 <div>
//                                                     <TooltipProfile name="Amal Jay" job="Web designer" btnName='View Profile' direction="right" imgpath="/imgs/user/user1.png">
//                                                         <span className="example-emoji" role="img" aria-label="duck emoji">
//                                                             <div className="user-img-group">
//                                                                 <img src="/imgs/user/user1.png" className="user-img-sm" alt="user" />
//                                                             </div>
//                                                         </span>
//                                                     </TooltipProfile>
//                                                 </div>
//                                                 <div className='flex flex-col  text-left'>
//                                                     <span className='pb-1 font-bold'>Amal Jay</span>
//                                                     <span className='text-base'>Web designer</span>
//                                                 </div>
//                                             </div>
//                                         </td>
//                                     </tr>
//                                 </tbody>
//                             </table>
//                         </div>
//                         <div className="overflow-x-auto">
//                             <table className="table-style stylesheet-wrapper">
//                                 <thead>
//                                     <tr>
//                                         <th className='w-[180px]'>Email ID</th>
//                                         <th className='w-[130px]'>Location</th>
//                                         <th className='w-[100px]'>Clock in</th>
//                                         <th className='w-[100px]'>Clock out</th>
//                                         <th className='w-[100px]'>Total hrs</th>
//                                         <th className='w-[100px]'>Office hrs</th>
//                                         <th className='w-[100px]'>Active hrs</th>
//                                         <th className='w-[150px]'>Productive hrs</th>
//                                         <th className='w-[150px]'>Unproductive hrs</th>
//                                         <th className='w-[120px]'>Neutral hrs</th>
//                                         <th className='w-[100px]'>Ideal hrs</th>
//                                         <th className='w-[100px]'>Offline hrs</th>
//                                         <th className='w-[150px]'>Productivity</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody className="max-h-[calc(100vh-250px)]">
//                                     <tr>
//                                         <td className='w-[180px]'>
//                                             <div className='flex gap-2 items-center'>
//                                                 catharine@globussoft.in
//                                             </div>
//                                         </td>
//                                         <td className='w-[130px]'>Bangalore</td>
//                                         <td className='w-[100px]'>10:04 am</td>
//                                         <td className='w-[100px]'>07:26 pm</td>
//                                         <td className='w-[100px]'>09:22 hr</td>
//                                         <td className='w-[100px]'>08:23 hr</td>
//                                         <td className='w-[100px]'>07:34 hr</td>
//                                         <td className='w-[150px]'>06:12 hr</td>
//                                         <td className='w-[150px]'>00:00 hr</td>
//                                         <td className='w-[120px]'>01:21 hr</td>
//                                         <td className='w-[100px]'>00:49 hr</td>
//                                         <td className='w-[100px]'>00:58 hr</td>
//                                         <td className='w-[150px]'>
//                                             {/* progressbar */}
//                                             <span className=' text-defaultTextColor text-base'>85%</span>
//                                             <div className="w-full bg-veryLightGrey h-2 rounded-full dark:bg-veryLightGrey">
//                                                 <div className="bg-brandBlue text-[0.5rem] h-2 font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={{ width: '85%' }}></div>
//                                             </div>
//                                         </td>
//                                     </tr>
//                                     <tr>
//                                         <td className='w-[180px]'>
//                                             <div className='flex gap-2 items-center'>
//                                                 catharine@globussoft.in
//                                             </div>
//                                         </td>
//                                         <td className='w-[130px]'>Bangalore</td>
//                                         <td className='w-[100px]'>10:04 am</td>
//                                         <td className='w-[100px]'>07:26 pm</td>
//                                         <td className='w-[100px]'>09:22 hr</td>
//                                         <td className='w-[100px]'>08:23 hr</td>
//                                         <td className='w-[100px]'>07:34 hr</td>
//                                         <td className='w-[150px]'>06:12 hr</td>
//                                         <td className='w-[150px]'>00:00 hr</td>
//                                         <td className='w-[120px]'>01:21 hr</td>
//                                         <td className='w-[100px]'>00:49 hr</td>
//                                         <td className='w-[100px]'>00:58 hr</td>
//                                         <td className='w-[150px]'>
//                                             {/* progressbar */}
//                                             <span className=' text-defaultTextColor text-base'>85%</span>
//                                             <div className="w-full bg-veryLightGrey h-2 rounded-full dark:bg-veryLightGrey">
//                                                 <div className="bg-brandBlue text-[0.5rem] h-2 font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={{ width: '85%' }}></div>
//                                             </div>
//                                         </td>
//                                     </tr>
//                                     <tr>
//                                         <td className='w-[180px]'>
//                                             <div className='flex gap-2 items-center'>
//                                                 catharine@globussoft.in
//                                             </div>
//                                         </td>
//                                         <td className='w-[130px]'>Bangalore</td>
//                                         <td className='w-[100px]'>10:04 am</td>
//                                         <td className='w-[100px]'>07:26 pm</td>
//                                         <td className='w-[100px]'>09:22 hr</td>
//                                         <td className='w-[100px]'>08:23 hr</td>
//                                         <td className='w-[100px]'>07:34 hr</td>
//                                         <td className='w-[150px]'>06:12 hr</td>
//                                         <td className='w-[150px]'>00:00 hr</td>
//                                         <td className='w-[120px]'>01:21 hr</td>
//                                         <td className='w-[100px]'>00:49 hr</td>
//                                         <td className='w-[100px]'>00:58 hr</td>
//                                         <td className='w-[150px]'>
//                                             {/* progressbar */}
//                                             <span className=' text-defaultTextColor text-base'>85%</span>
//                                             <div className="w-full bg-veryLightGrey h-2 rounded-full dark:bg-veryLightGrey">
//                                                 <div className="bg-brandBlue text-[0.5rem] h-2 font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={{ width: '85%' }}></div>
//                                             </div>
//                                         </td>
//                                     </tr>
//                                     <tr>
//                                         <td className='w-[180px]'>
//                                             <div className='flex gap-2 items-center'>
//                                                 catharine@globussoft.in
//                                             </div>
//                                         </td>
//                                         <td className='w-[130px]'>Bangalore</td>
//                                         <td className='w-[100px]'>10:04 am</td>
//                                         <td className='w-[100px]'>07:26 pm</td>
//                                         <td className='w-[100px]'>09:22 hr</td>
//                                         <td className='w-[100px]'>08:23 hr</td>
//                                         <td className='w-[100px]'>07:34 hr</td>
//                                         <td className='w-[150px]'>06:12 hr</td>
//                                         <td className='w-[150px]'>00:00 hr</td>
//                                         <td className='w-[120px]'>01:21 hr</td>
//                                         <td className='w-[100px]'>00:49 hr</td>
//                                         <td className='w-[100px]'>00:58 hr</td>
//                                         <td className='w-[150px]'>
//                                             {/* progressbar */}
//                                             <span className=' text-defaultTextColor text-base'>85%</span>
//                                             <div className="w-full bg-veryLightGrey h-2 rounded-full dark:bg-veryLightGrey">
//                                                 <div className="bg-brandBlue text-[0.5rem] h-2 font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={{ width: '85%' }}></div>
//                                             </div>
//                                         </td>
//                                     </tr>
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             {/* =================================================================== */}
//             {/* MODEL FOR edit START */}
//             {/* Pricing Modal */}
//             {showModalViewAttach && (
//                 <>
//                     <div
//                         className="justify-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
//                         <div className="relative my-2 mx-auto w-11/12 md:w-1/2 z-50">
//                             {/*content*/}
//                             <div className="border-0 mb-7 sm:mt-8 rounded-2xl shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
//                                 {/*header*/}
//                                 {/*body*/}
//                                 <div className="relative sm:px-3  md:p-6 flex-auto">
//                                     <button
//                                         className="text-lightGrey hover:text-darkTextColor absolute -right-2 -top-2 rounded-full bg-veryLightGrey  uppercase  text-sm outline-none focus:outline-none p-1 ease-linear transition-all duration-150"
//                                         type="button"
//                                         onClick={() => setShowModalViewAttach(false)}
//                                     >
//                                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
//                                             <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
//                                         </svg>
//                                     </button>
//                                     <div className="rounded-lg bg-white">
//                                         <div className='lg:flex'>
//                                             <div className='w-1/3'>
//                                                 <div className="flex items-center mb-4">
//                                                     <input id="checkbox-all1" type="checkbox" className="w-4 h-4 text-brandBlue bg-veryveryLightGrey border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
//                                                     <label htmlFor="checkbox-all1" className="ml-2">Time in minutes</label>
//                                                 </div>
//                                                 <div className="flex items-center mb-4">
//                                                     <input id="checkbox-all2" type="checkbox" className="w-4 h-4 text-brandBlue bg-veryveryLightGrey border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
//                                                     <label htmlFor="checkbox-all2" className="ml-2">Time in total</label>
//                                                 </div>
//                                                 <div className="flex items-center mb-4">
//                                                     <input id="checkbox-all3" type="checkbox" className="w-4 h-4 text-brandBlue bg-veryveryLightGrey border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
//                                                     <label htmlFor="checkbox-all3" className="ml-2">Average</label>
//                                                 </div>
//                                                 <div className="flex items-center mb-4">
//                                                     <input id="checkbox-all4" type="checkbox" className="w-4 h-4 text-brandBlue bg-veryveryLightGrey border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
//                                                     <label htmlFor="checkbox-all4" className="ml-2">Absent users</label>
//                                                 </div>
//                                                 <div className="flex items-center mb-4">
//                                                     <input id="checkbox-all5" type="checkbox" className="w-4 h-4 text-brandBlue bg-veryveryLightGrey border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
//                                                     <label htmlFor="checkbox-all5" className="ml-2">Assigned list</label>
//                                                 </div>
//                                                 <div className="flex items-center mb-4">
//                                                     <input id="checkbox-all6" type="checkbox" className="w-4 h-4 text-brandBlue bg-veryveryLightGrey border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
//                                                     <label htmlFor="checkbox-all6" className="ml-2">Split sheet</label>
//                                                 </div>
//                                                 <div className="flex items-center mb-4">
//                                                     <input checked id="checkbox-all7" type="checkbox" className="w-4 h-4 text-brandBlue bg-veryveryLightGrey border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
//                                                     <label htmlFor="checkbox-all7" className="ml-2">Email ID</label>
//                                                 </div>
//                                             </div>
//                                             <div className='w-1/3'>
//                                                 <div className="flex items-center mb-4">
//                                                     <input checked id="checkbox-all8" type="checkbox" className="w-4 h-4 text-brandBlue bg-veryveryLightGrey border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
//                                                     <label htmlFor="checkbox-all8" className="ml-2">Location</label>
//                                                 </div>
//                                                 <div className="flex items-center mb-4">
//                                                     <input checked id="checkbox-all9" type="checkbox" className="checkmark w-4 h-4 text-brandBlue bg-veryveryLightGrey border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
//                                                     <label htmlFor="checkbox-all9" className="ml-2">Department</label>
//                                                 </div>
//                                                 <div className="flex items-center mb-4">
//                                                     <input checked id="checkbox-all4" type="checkbox" className="w-4 h-4 text-brandBlue bg-veryveryLightGrey border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
//                                                     <label htmlFor="checkbox-all4" className="ml-2">Clock in</label>
//                                                 </div>
//                                                 <div className="flex items-center mb-4">
//                                                     <input checked id="checkbox-all3" type="checkbox" className="w-4 h-4 text-brandBlue bg-veryveryLightGrey border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
//                                                     <label htmlFor="checkbox-all3" className="ml-2">Clock out</label>
//                                                 </div>
//                                                 <div className="flex items-center mb-4">
//                                                     <input checked id="checkbox-all4" type="checkbox" className="w-4 h-4 text-brandBlue bg-veryveryLightGrey border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
//                                                     <label htmlFor="checkbox-all4" className="ml-2">Total hours</label>
//                                                 </div>
//                                                 <div className="flex items-center mb-4">
//                                                     <input checked id="checkbox-all4" type="checkbox" className="w-4 h-4 text-brandBlue bg-veryveryLightGrey border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
//                                                     <label htmlFor="checkbox-all4" className="ml-2">Office hours</label>
//                                                 </div>
//                                                 <div className="flex items-center mb-4">
//                                                     <input checked id="checkbox-all4" type="checkbox" className="w-4 h-4 text-brandBlue bg-veryveryLightGrey border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
//                                                     <label htmlFor="checkbox-all4" className="ml-2">Active hours</label>
//                                                 </div>
//                                             </div>
//                                             <div className='w-1/3'>
//                                                 <div className="flex items-center mb-4">
//                                                     <input checked id="checkbox-all19" type="checkbox" className="w-4 h-4 text-brandBlue bg-veryveryLightGrey border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
//                                                     <label htmlFor="checkbox-all19" className="ml-2">Productive</label>
//                                                 </div>
//                                                 <div className="flex items-center mb-4">
//                                                     <input checked id="checkbox-all6" type="checkbox" className="w-4 h-4 text-brandBlue bg-veryveryLightGrey border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
//                                                     <label htmlFor="checkbox-all6" className="ml-2">Unproductive</label>
//                                                 </div>
//                                                 <div className="flex items-center mb-4">
//                                                     <input checked id="checkbox-all6" type="checkbox" className="w-4 h-4 text-brandBlue bg-veryveryLightGrey border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
//                                                     <label htmlFor="checkbox-all6" className="ml-2">Idle</label>
//                                                 </div>
//                                                 <div className="flex items-center mb-4">
//                                                     <input checked id="checkbox-all5" type="checkbox" className="w-4 h-4 text-brandBlue bg-veryveryLightGrey border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
//                                                     <label htmlFor="checkbox-all5" className="ml-2">Neutral</label>
//                                                 </div>
//                                                 <div className="flex items-center mb-4">
//                                                     <input checked id="checkbox-all6" type="checkbox" className="w-4 h-4 text-brandBlue bg-veryveryLightGrey border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
//                                                     <label htmlFor="checkbox-all6" className="ml-2">Offline hours</label>
//                                                 </div>
//                                                 <div className="flex items-center mb-4">
//                                                     <input checked id="checkbox-all6" type="checkbox" className="w-4 h-4 text-brandBlue bg-veryveryLightGrey border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
//                                                     <label htmlFor="checkbox-all6" className="ml-2">Productivity</label>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         <div className='flex items-center justify-center gap-5 mt-4'>
//                                             <button className="text-darkBlue border text-sm font-bold px-8 py-2 rounded-full border-darkBlue cursor-pointer">
//                                                 Reset
//                                             </button>
//                                             <button type="submit" className="small-button items-center xs:w-full flex sm:text-md text-sm py-2 px-8">
//                                                 <span className=''>Apply</span>
//                                             </button>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="opacity-25 fixed inset-0 z-40 bg-black" onClick={() => setShowModalViewAttach(false)}></div>
//                     </div>
//                 </>
//             )}
//         </>
//     )
// }
// export default Timesheets;
import React from 'react'
const timesheets = () => {
  return (
    <div>timesheets</div>
  )
}
export default timesheets