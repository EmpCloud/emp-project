import router from 'next/router'
import React, { useState, useEffect, Fragment } from 'react'
import Modal from 'react-modal';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';
import { AiOutlineDashboard, AiOutlineEye, AiOutlineSubnode } from 'react-icons/ai'
import { TbSubtask } from 'react-icons/tb'
import { GiSandsOfTime } from 'react-icons/gi'
import { GrUserAdmin } from 'react-icons/gr'
import { HiOutlineBriefcase, HiOutlineMail } from 'react-icons/hi'
import { IoMdRemoveCircle } from 'react-icons/io'
import { VscCalendar, VscListSelection } from 'react-icons/vsc'
import NewToolTip from '../../../../components/NewToolTip'
import { getUserById } from '../api/get'
import { USER_AVTAR_URL } from '@HELPER/avtar'
import { Popover, Transition } from '@headlessui/react'
import { BsFiletypeCsv, BsFiletypePdf } from 'react-icons/bs'
import { ChevronDown } from 'react-feather'
import EditTableCol from '@COMPONENTS/EditTableCol'
import { FloatingSelectfield } from '@COMPONENTS/FloatingSelectfield'
import { BiSearch } from 'react-icons/bi'
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md'
const userDetails = ({ data, handleGetAllUser }) => {
    const [open, setOpen] = useState(false)
    const [userDetails, setUserDetails] = useState(null)
    const [showModal, setShowModal] = useState(false)

    // calendar handel
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRange, setSelectedRange] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection',
        },
    ]);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleDateChange = (ranges) => {
        // Handle date range selection
        setSelectedRange([ranges.selection]);
    };


    useEffect(() => {
        setUserDetails(data)
    }, [data])

    return (
        <>
            <NewToolTip direction='left' message={"View/Edit"}><a onClick={() => { setOpen(true) }} > <AiOutlineEye /></a></NewToolTip>
            {
                open && (
                    <>
                        <div
                            className="justify-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-[999] outline-none focus:outline-none"
                        >
                            <div className="relative my-2 mx-auto w-11/12 lg:w-9/12 z-[999]">
                                {/*content*/}
                                <div className="border-0 mb-7 sm:mt-8 rounded-2xl shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                    {/*header*/}
                                    {/*body*/}
                                    <button
                                        className="text-lightGrey hover:text-darkTextColor absolute -right-2 -top-2 rounded-full bg-veryLightGrey  uppercase  text-sm outline-none focus:outline-none p-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={() => { setOpen(false) }}
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
                                    <div className=' xs:p-4 py-6'>
                                        <div className="lg:flex items-center">
                                            <div className='flex items-center'>
                                                <div className='ml-5 pr-5 lg:border-r-2 border-veryveryLightGrey'>
                                                    <div className='mt-2'>
                                                        <span className='example-emoji' role='img' aria-label='duck emoji'>
                                                            <div className='members-details relative w-36'>
                                                                <img src={data.profilePic ?? USER_AVTAR_URL + data?.firstName + ".svg"} className='w-36 h-32 rounded-lg' alt='user' />
                                                            </div>
                                                        </span>
                                                    </div>
                                                    <h3 className='text-darkTextColor text-xl font-bold mt-4'>{data.firstName + " " + data.lastName}</h3>
                                                    <div className="user-deatils mt-3">
                                                        <p className='flex items-center text-defaultTextColor'><HiOutlineMail className='mr-1' />{data.email}</p>
                                                        <p className='flex items-center mt-1 text-defaultTextColor'><GrUserAdmin className='mr-1' /> {data.role}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            {userDetails &&
                                                <div className='w-full lg:pl-10'>
                                                    <div className="flex flex-row flex-wrap xs:mt-5 md:mt-5 lg:mt-0">
                                                        <div className='md:flex lg:basis-1/5 basis-1/2  flex-col items-center'>
                                                            <p className='text-defaultTextColor'>Total projects</p>
                                                            <span className='text-darkTextColor mt-1 text-2xl font-bold flex items-center'> <HiOutlineBriefcase className='mr-2 text-darkBlue font-normal font-base' />{userDetails?.Project_details.TotalProjectCount}</span>
                                                        </div>
                                                        <div className='md:flex lg:basis-1/5 basis-1/2  flex-col items-center'>
                                                            <p className='text-defaultTextColor'>Total tasks</p>
                                                            <span className='text-darkTextColor mt-1 text-2xl font-bold flex items-center'> <VscListSelection className='mr-2 text-darkBlue font-normal font-base' />{userDetails.task_details?.TotalTaskCount}</span>
                                                        </div>
                                                        <div className='md:flex lg:basis-1/5 basis-1/2 flex-col items-center'>
                                                            <p className='text-defaultTextColor'>Pending tasks</p>
                                                            <span className='text-darkTextColor mt-1 text-2xl font-bold flex items-center'> <GiSandsOfTime className='mr-2 text-darkBlue font-normal font-base' />{userDetails?.PendingTasks}</span>
                                                        </div>
                                                        <div className='md:flex lg:basis-1/5 basis-1/2 flex-col items-center'>
                                                            <p className='text-defaultTextColor'>Total Sub-task</p>
                                                            <span className='text-darkTextColor mt-1 text-2xl font-bold flex items-center'> <TbSubtask className='mr-2 text-darkBlue font-normal font-base' />{userDetails?.subTask_details.TotalSubtaskCount}</span>
                                                        </div>
                                                        <div className='md:flex lg:basis-1/5 basis-1/2 flex-col items-center'>
                                                            <p className='text-defaultTextColor'>Performance</p>
                                                            <span className='text-darkTextColor mt-1 text-2xl font-bold flex items-center'> <AiOutlineDashboard className='mr-2 text-darkBlue font-normal font-base' />{userDetails?.progress ?? 0}%</span>
                                                        </div>
                                                    </div>
                                                    <div className=' flex justify-center mt-8'>
                                                        {/* <button className=' small-button h-9 flex items-center' onClick={()=>setShowModal(!showModal)}>View</button> */}
                                                    </div>
                                                </div>
                                            }

                                            {showModal &&
                                                <div className=' absolute rounded-xl inset-0 bg-slate-700 bg-opacity-20'>
                                                    <div className=' bg-white shadow-md shadow-gray-950 rounded-xl px-8 py-6 absolute z-50 top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]  w-[80%]'>
                                                        {/* header */}
                                                        <div className=' flex justify-between items-center py-2'>
                                                            <h1 className=' font-bold text-2xl text-center py-4'>Member Report</h1>
                                                            {/* <button className=' float-right small-button h-9 flex items-center' onClick={handleOpenModal}>Download</button> */}
                                                            <Popover className="relative">
                                                                {({ open }) => (
                                                                    <>
                                                                        <Popover.Button
                                                                            className={`
                                                                                    ${open ? '' : 'text-opacity-90'}
                                                                                    inline-flex gap-2 h-9 items-center small-button !px-3 `}
                                                                        >
                                                                            <span>Download</span>
                                                                            <ChevronDown
                                                                                className={`${open ? '' : 'text-opacity-70'}
                                                                                    text-orange-300 text-white transition duration-150 ease-in-out group-hover:text-opacity-80`}
                                                                                aria-hidden="true"
                                                                            />
                                                                        </Popover.Button>
                                                                        <Transition
                                                                            as={Fragment}
                                                                        //   enter="transition ease-out duration-200"
                                                                        //   enterFrom="opacity-0 translate-y-1"
                                                                        //   enterTo="opacity-100 translate-y-0"
                                                                        //   leave="transition ease-in duration-150"
                                                                        //   leaveFrom="opacity-100 translate-y-0"
                                                                        //   leaveTo="opacity-0 translate-y-1"
                                                                        >
                                                                            <Popover.Panel className={` absolute -left-20 z-10 mt-3 max-w-sm px-2 sm:px-0 lg:max-w-3xl `}>
                                                                                <div className="py-3 px-2 w-full min-w-[14rem] flex justify-center flex-col items-center bg-white rounded-lg shadow-lg">
                                                                                    <div className=' '>
                                                                                        <button onClick={handleOpenModal} className='flex justify-between gap-2 items-center py-1 bg-white hover:bg-slate-200 rounded px-4'>
                                                                                            <span><VscCalendar className=' text-xl' /></span>
                                                                                            Set Duration
                                                                                        </button>
                                                                                        <Modal
                                                                                            isOpen={isModalOpen}
                                                                                            onRequestClose={handleCloseModal}
                                                                                            // contentLabel="Date Picker Modal"
                                                                                            className=" relative flex justify-center items-center h-[127vh] rounded modal-bg "
                                                                                        >
                                                                                            {/* <h2>Date Picker Modal</h2> */}
                                                                                            <div className=' bg-white px-10 py-6 rounded-xl shadow-md shadow-black'>
                                                                                                <DateRangePicker
                                                                                                    onChange={handleDateChange}
                                                                                                    showSelectionPreview={true}
                                                                                                    moveRangeOnFirstSelection={false}
                                                                                                    months={2}
                                                                                                    ranges={selectedRange}
                                                                                                    direction="horizontal"
                                                                                                    className=" rounded-xl"
                                                                                                />
                                                                                                <div className='flex justify-center gap-4'>
                                                                                                    {/* <div>
                                                                                                    <button className='  small-button h-9 flex items-center'>
                                                                                                        Set
                                                                                                    </button>
                                                                                                    </div> */}
                                                                                                    <div>
                                                                                                        <button className='  small-button h-9 flex items-center' onClick={handleCloseModal}>
                                                                                                            Done
                                                                                                        </button>
                                                                                                    </div>
                                                                                                    <div>
                                                                                                        <button onClick={handleCloseModal} className='px-4 py-1 rounded-full font-bold text-white hover:bg-red-600 bg-red-500 h-9 flex items-center '>
                                                                                                            Cancel
                                                                                                        </button>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </Modal>
                                                                                    </div>
                                                                                    <div className=" py-1 bg-white relative cursor-pointer">
                                                                                        <Popover className="relative">
                                                                                            <Popover.Button>
                                                                                                <button className='gap-2 flex justify-between items-center rounded outline-none focus:hidden hover:bg-slate-200 px-4 py-1'>
                                                                                                    <span><BsFiletypeCsv className=' text-xl' /></span>
                                                                                                    Download CSV
                                                                                                </button>
                                                                                            </Popover.Button>
                                                                                            <Popover.Panel>
                                                                                                <div className='flex flex-col'>
                                                                                                    <label>
                                                                                                        <input
                                                                                                            type="checkbox"
                                                                                                            name="selectAll"
                                                                                                            className="border"
                                                                                                        // checked={areAllCheckboxesSelected}
                                                                                                        // onChange={handleSelectAllChange}
                                                                                                        />
                                                                                                        Select All
                                                                                                    </label>
                                                                                                    {/* {filteredTaskTableList && filteredTaskTableList.map((d, index) => ( */}
                                                                                                    <label
                                                                                                    // key={index}
                                                                                                    >
                                                                                                        <input type="checkbox"
                                                                                                        // name={d.name} 
                                                                                                        // id={`checkbox-${index}`} 
                                                                                                        // className='border' 
                                                                                                        // checked={selectedCheckboxes[d.name] || false}
                                                                                                        // onChange={handleCheckboxChange} 
                                                                                                        />
                                                                                                        {/* {d.name} */}
                                                                                                        name
                                                                                                    </label>
                                                                                                    {/* ))} */}
                                                                                                    <button className='small-button h-9 flex justify-center items-center'
                                                                                                    // onClick={createDownLoadData}
                                                                                                    >Download</button>
                                                                                                </div>
                                                                                            </Popover.Panel>
                                                                                        </Popover>

                                                                                    </div>
                                                                                    <div className=" py-1 bg-white ">

                                                                                        <Popover className="relative">
                                                                                            <Popover.Button>
                                                                                                <button className='gap-2 flex justify-between items-center rounded outline-none focus:hidden hover:bg-slate-200 px-4 py-1'>
                                                                                                    <span><BsFiletypePdf className=' text-xl' /></span>
                                                                                                    Download PDF</button>
                                                                                            </Popover.Button>
                                                                                            <Popover.Panel>
                                                                                                <div className='flex flex-col'>
                                                                                                    <label>
                                                                                                        <input
                                                                                                            type="checkbox"
                                                                                                            name="selectAll"
                                                                                                            className="border"
                                                                                                        // checked={areAllCheckboxesSelected}
                                                                                                        // onChange={handleSelectAllChange}
                                                                                                        />
                                                                                                        Select All
                                                                                                    </label>
                                                                                                    {/* {filteredTaskTableList && filteredTaskTableList.map((d, index) => ( */}
                                                                                                    <label
                                                                                                    // key={index
                                                                                                    // }
                                                                                                    >
                                                                                                        <input type="checkbox"
                                                                                                            // name={d.name} 
                                                                                                            // id={`checkbox-${index}`}
                                                                                                            className='border'
                                                                                                        // checked={selectedCheckboxes[d.name] || false}
                                                                                                        // onChange={handleCheckboxChange} 
                                                                                                        // {d.name}

                                                                                                        />
                                                                                                        name
                                                                                                    </label>
                                                                                                    {/* ))} */}
                                                                                                    <button className='small-button h-9 flex justify-center items-center'
                                                                                                    // onClick={()=> datadownloadOne('pdf', 'Task', filteredDataTwo)}
                                                                                                    >Download</button>
                                                                                                </div>
                                                                                            </Popover.Panel>
                                                                                        </Popover>

                                                                                    </div>
                                                                                </div>
                                                                            </Popover.Panel>
                                                                        </Transition>
                                                                    </>
                                                                )}
                                                            </Popover>
                                                        </div>
                                                        {/* Table top funtionalities */}

                                            <div className='flex justify-between items-center py-2'>
                            <h3 className='heading-medium'>
                                <div className='flex items-center '>
                                    <p className='p-0 m-0 text-lightTextColor text-base'>Show</p>
                                    <select
                                        // value={sortTable.limit}
                                        onChange={event => {
                                            // setSortTable({ ...sortTable, limit: event.target.value,pageNo: 1 });
                                        }}
                                        className='border py-1  rounded-md outline-none w-15 text-base px-2 mx-1'>
                                        <option value={10}>10</option>
                                        <option value={25}>25</option>
                                        <option value={50}>50</option>
                                        <option value={100}>100</option>
                                        <option value={500}>500</option>
                                    </select>
                                    <p className='p-0 m-0 text-lightTextColor text-base'>Entries</p>
                                </div>{' '}
                            </h3>
                            <div className='flex items-center gap-1 border rounded-full px-2'>
                                <BiSearch className=' text-gray-400'/>
                                <input type="text" className=' outline-none py-1 ' placeholder='Search a member' />
                                
                            </div>
                                            </div>

                                                        {/* Table */}
                                                        <div className='overflow-x-auto relative shadow-md sm:rounded-lg'>
                                                            <table className='table-style'>
                                                                <thead className='!border-b-0'>
                                                                    <tr className='text-gray-700 uppercase bg-blue-300  border-0 dark:bg-gray-700 dark:text-gray-400'>
                                                                        <th scope='col' className='py-3 px-6 text-base'>
                                                                            <div className='flex items-center'>
                                                                                Projects
                                                                            </div>
                                                                        </th>
                                                                        <th scope='col' className='py-3 px-6 text-base'>
                                                                            <div className='flex items-center justify-center'>
                                                                                Tasks
                                                                            </div>
                                                                        </th>
                                                                        <th scope='col' className='py-3 px-6 text-base'>
                                                                            <div className='flex items-center justify-center'>
                                                                                Subtasks
                                                                            </div>
                                                                        </th>
                                                                        <th scope='col' className='py-3 px-6 text-base'>
                                                                            <div className='flex items-center justify-center w-[180px]'>
                                                                                Independent Tasks
                                                                            </div>
                                                                        </th>
                                                                        <th scope='col' className='py-3 px-6 text-base'>
                                                                            <div className='flex items-center justify-center'>
                                                                                Status
                                                                            </div>
                                                                        </th>
                                                                        <th scope='col' className='py-3 px-6 text-base'>
                                                                            <div className='flex items-center justify-center'>
                                                                                Progress
                                                                            </div>
                                                                        </th>
                                                                    </tr>
                                                                </thead>

                                                                <tbody className='max-h-[calc(100vh-360px)] overflow-y-auto'>
                                                                    <tr className=' !text-lg !font-semibold'>
                                                                        <td>
                                                                            <div className='items-center justify-start'>
                                                                                <h5 className='capitalize'>Name</h5>
                                                                            </div>
                                                                        </td>
                                                                        <td>
                                                                            <div className=' flex justify-center'>

                                                                                Data
                                                                            </div>
                                                                        </td>
                                                                        <td className='!w-auto'>
                                                                            <div className=' flex justify-center'>

                                                                                Data
                                                                            </div>
                                                                        </td>
                                                                        <td>
                                                                            <div className=' flex justify-center'>

                                                                                Data
                                                                            </div>
                                                                        </td>
                                                                        <td>
                                                                            <div className=' flex justify-center'>

                                                                                Data
                                                                            </div>
                                                                        </td>
                                                                        <td>
                                                                            <div className=' flex justify-center'>

Data
</div>
                                                    </td>
                                                </tr>
                                </tbody>
                            </table>
                                            </div>
                                            {/* Pagination bottom */}
                                            <div className='flex justify-between items-center'>
                                <p className='p-0 m-0 text-lightTextColor text-base sm:my-4 my-2'>
                                    Showing 0 to 100
                                </p>
                                <div className='flex items-center '>
                                    <button
                                        // disabled={sortTable.pageNo == 1}
                                        onClick={() => {
                                            // handlePaginationTasks('?skip=' + ((sortTable.limit*sortTable.pageNo)-(sortTable.limit*2)) + '&limit=' + sortTable.limit);
                                            // setSortTable({ ...sortTable, pageNo: sortTable.pageNo - 1 ,skip: (sortTable.limit*sortTable.pageNo)-(sortTable.limit*2)});
                                        }}
                                        className='disabled:opacity-25  disabled:cursor-not-allowed  arrow_left border mx-1 bg-veryveryLightGrey cursor-pointer hover:bg-defaultTextColor hover:text-white'>
                                        <MdKeyboardArrowLeft />
                                    </button>
                                    <div className='pages'>
                                        <p className='p-0 m-0 text-lightTextColor text-base sm:my-4 my-2'>
                                            Page <span>0</span>
                                        </p>
                                    </div>
                                    <button
                                        // disabled={sortTable.pageNo === Math.ceil(taskCount / sortTable.limit)}
                                        onClick={() => {
                                            // handlePaginationTasks('?skip=' + sortTable.limit*sortTable.pageNo + '&limit=' + sortTable.limit);
                                            // setSortTable({
                                            //     ...sortTable,
                                            //     pageNo: sortTable.pageNo + 1,
                                            //     skip: sortTable.pageNo * sortTable.limit,
                                            // });
                                        }}
                                        className='disabled:cursor-not-allowed  arrow_right border mx-1 bg-veryveryLightGrey cursor-pointer hover:bg-defaultTextColor hover:text-white'>
                                        <MdKeyboardArrowRight />
                                    </button>
                                </div>
                                            </div>
                                            <div className=' flex justify-center pt-3'>
                                            <button onClick={()=>setShowModal(false)} className=' px-4 py-2 rounded-xl bg-slate-200 hover:bg-gray-300 font-semibold duration-100 hover:text-white'>Close</button>
                                            </div>
                                         </div>
                                         <Modal
                                                            isOpen={isModalOpen}
                                                            onRequestClose={handleCloseModal}
                                                            // contentLabel="Date Picker Modal"
                                                            className=" relative flex justify-center items-center h-[127vh] rounded modal-bg "
                                                        >
                                                            {/* <h2>Date Picker Modal</h2> */}
                                                            <div className=' bg-white px-10 py-6 rounded-xl shadow-md shadow-black'>
                                                            <DateRangePicker
                                                                onChange={handleDateChange}
                                                                showSelectionPreview={true}
                                                                moveRangeOnFirstSelection={false}
                                                                months={2}
                                                                ranges={selectedRange}
                                                                direction="horizontal"
                                                                className=" rounded-xl"
                                                            />
                                                            <div className='flex justify-center gap-4'>
                                                                {/* <div>
                                                            <button className='  small-button h-9 flex items-center'>
                                                                Set
                                                            </button>
                                                            </div> */}
                                                                <div>
                                                                    <button className='  small-button h-9 flex items-center' onClick={handleCloseModal}>
                                                                        Done
                                                                    </button>
                                                                </div>
                                                                <div>
                                                                    <button onClick={handleCloseModal} className='px-4 py-1 rounded-full font-bold text-white hover:bg-red-600 bg-red-500 h-9 flex items-center '>
                                                                        Cancel
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Modal>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                    <div className="mt-5 lg:flex ml-4">
                                        <div className=" p-4 lg:w-1/2 lg:mr-5 ml-4">
                                            <div className="md:flex justify-between items-start  mb-5">
                                                <h3 className="heading-medium ">Project and Task</h3>
                                            </div>
                                            <div className="time-tracking-wrapper">
                                                {data.Project_details && data.Project_details.projects && data.Project_details.projects.length === 0 && (
                                                    <div className="flex items-center border-b-2 border-veryveryLightGrey py-2.5">
                                                        <div className="w-1/2"> No Projects   </div>
                                                    </div>
                                                )}
                                                {userOneDetails && userOneDetails.Project_details.map((data, key)=> {
                                                        return (
                                                            <div key={key} className="flex items-center border-b-2 border-veryveryLightGrey py-2.5">
                                                                <div className="w-1/5">
                                                                    <h5 className="text-defaultTextColor text-base truncate">{data.projectName}</h5>
                                                                    <p className="text-lightGrey text-sm mb-1 truncate">
                                                                     {data.projectCode}
                                                                    </p>
                                                                </div>
                                                                <div className="w-3/5 ml-6">
                                                                    <span className=' text-defaultTextColor text-base'>{data.projectProgress}%</span>
                                                                    <div className="w-full bg-veryLightGrey h-2 rounded-full dark:bg-veryLightGrey">
                                                                        <div className="bg-redColor text-[0.5rem] h-2 font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={{ width: `${data.projectProgress}%` }}></div>
                                                                    </div>
                                                                </div>
                                                                <div className="text-base font-bold w-1/5 ml-6">Tasks({data.TotalTaskCount})</div>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>
                                        <div className=" p-4 lg:w-1/2 xs:mt-5 md:mt-5 lg:mt-0">
                                            <div className="md:flex justify-between items-start  mb-5">
                                                <h3 className="heading-medium dark:text-darkTitleColor">Independent Tasks</h3>
                                            </div>
                                            <div className="time-tracking-wrapper">
                                            {userOneDetails && userOneDetails.Task_details && userOneDetails.Task_details.independentTask ? (
                                                userOneDetails.Task_details.independentTask.length === 0 ? (
                                                    <div className="flex items-center border-b-2 border-veryveryLightGrey py-2.5">
                                                        <div className="w-1/2"> No Tasks  </div>
                                                    </div>
                                                ) : (
                                                 userOneDetails.Task_details.independentTask.map(function (data, key) {
                                                        return (
                                                            <div key={key} className="flex items-center border-b-2 border-veryveryLightGrey py-2.5">
                                                                <div className="w-1/5">
                                                                    <h5 className="text-defaultTextColor text-base truncate">{data.taskTitle}</h5>
                                                                    <p className="text-lightGrey text-sm mb-1 truncate">
                                                                    </p>
                                                                </div>
                                                                <div className="w-3/5 ml-6">
                                                                    <span className=' text-defaultTextColor text-base'>{data.TaskProgress}%</span>
                                                                    <div className="w-full bg-veryLightGrey h-2 rounded-full dark:bg-veryLightGrey">
                                                                        <div className="bg-redColor text-[0.5rem] h-2 font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={{ width: `${data.TaskProgress}%` }}></div>
                                                                    </div>
                                                                </div>
                                                                <div >
                                                                    <div className="text-base font-bold w-1/5 ml-6">SubTasks({data.Totalsubtasks})</div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })
                                                )
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-6 text-center">
                                        <button data-modal-toggle="popup-modal" type="button"
                                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mr-2"
                                            onClick={() => { setOpen(false) }} >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="opacity-25 fixed inset-0 z-40 bg-black" onClick={() => { setOpen(false) }}></div>
                        </div>
                    </>
                )}
        </>
    )
}
export default userDetails