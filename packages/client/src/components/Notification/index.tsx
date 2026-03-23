import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import { IoIosNotificationsOutline } from 'react-icons/io';
import { FiArrowRight } from 'react-icons/fi';
import { readAllNotifications, readSingleNotification } from '@WORKFORCE_MODULES/notification/api/put';
import { deleteNotification, deleteAllNotification } from '@WORKFORCE_MODULES/notification/api/delete';
import { BsThreeDotsVertical } from 'react-icons/bs';
import DropDown from '../../components/DropDown';
import toast from '../../components/Toster/index';
import DeleteConformation from '@COMPONENTS/DeleteConformation';
import { AiFillDelete } from 'react-icons/ai';
import { formatedDate, formattedDateTime } from '@HELPER/function';
import { useRouter } from 'next/router';
export default function MyModal({ getAllNotification, notification }) {
    const [isOpen, setIsOpen] = useState(false);
    const [unRead, setUnRead] = useState(0);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [showOptionsMenu, setShowOptionsMenu] = useState(false);
    const [showOnlyUnread, setShowOnlyUnread] = useState(false);
    const router = useRouter();

    useEffect(() => {
        unReadCount();
    }, [notification]);

    // Notification count
    const unReadCount = () => {
        let count = 0;
        notification
            ? notification.map(element => {
                  if (element.isRead === false) {
                      count++;
                  }
              })
            : 0;
        setUnRead(count);
    };

    const closeModal = () => {
        setIsOpen(false);
        setShowOptionsMenu(false)
    };
    const openModal = () => {
        setIsOpen(true);
    };
    const handleToggleOnlyUnread = () => {
        setShowOnlyUnread(!showOnlyUnread);
    };

    // Mark-Read Notification
    const markAllRead = () => {
        const getRead = notification.map(item => {
            return item._id;
        });
        readAllNotifications({ ids: getRead })
            .then(function (result) {
                if (result.data.body.status == 'success') {
                    getAllNotification();
                    toast({
                        type: 'success',
                        message: result ? result.data.body.message : 'Try again !',
                    });
                } else {
                    toast({
                        type: 'error',
                        message: result ? result.data.body.message : 'Error',
                    });
                }
            })
            .catch(function (e) {
                toast({
                    type: 'error',
                    message: e.response ? e.response.data.message : 'Something went wrong, Try again !',
                });
            });
    };
    const markOneRead = id => {
        readSingleNotification(id);
        getAllNotification();
    };

    // Delete Notification
    const handleDelete = id => {
        deleteNotification(id)
            .then(function (result) {
                if (result.data.body.status == 'success') {
                    getAllNotification();
                    toast({
                        type: 'success',
                        message: result ? result.data.body.message : 'Try again !',
                    });
                } else {
                    toast({
                        type: 'error',
                        message: result ? result.data.body.message : 'Error',
                    });
                }
            })
            .catch(function (e) {
                toast({
                    type: 'error',
                    message: e.response ? e.response.data.message : 'Something went wrong, Try again !',
                });
            });
    };
    const handleDeleteAll = () => {
        deleteAllNotification()
            .then(function (result) {
                if (result?.data?.body.status === 'success') {
                    getAllNotification();
                    setUnRead(0);
                    closeModal();
                    toast({
                        type: 'success',
                        message: result.data.body.message,
                    });
                } else {
                    toast({
                        type: 'error',
                        message: result.data.body.message,
                    });
                }
            })
            .catch(function (e) {
                toast({
                    type: 'error',
                    message: e.response ? e.response.data.message : 'Something went wrong, Try again!',
                });
            });
    };
    const handleViewClick = (item) => {
        if (item.projectId) {
            router.push(`/w-m/projects/${item.projectId}`);
        } else if (item.taskId) {
            router.push(`/w-m/tasks/${item.taskId}`);
        }
    };
    return (
        <>
            <div className='flex items-center justify-center text-sm p-2 h-12 overflow-hidden text-gray-700 text-ellipsis whitespace-nowrap transition duration-300 ease-in-out'>
                <button type='button' onClick={openModal}>
                    <IoIosNotificationsOutline size={24} className=' text-gray-500 dark:text-gray-300' />
                    {unRead > 0 && <span className='absolute top-1 right-3 p-1 translate-x-1/2 pt-[1px] bg-red-500 dark:text-[#fff] border border-white rounded-full text-sm text-white'>{unRead}</span>}
                </button>
            </div>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as='div' className='relative z-50' onClose={closeModal}>
                    <Transition.Child as={Fragment} enter='ease-out duration-300' enterFrom='opacity-0' enterTo='opacity-100' leave='ease-in duration-200' leaveFrom='opacity-100' leaveTo='opacity-0'>
                        <div className='fixed inset-0' />
                    </Transition.Child>

                    <div className='fixed inset-0'>
                        <div className='flex justify-end p-4 mt-12'>
                            <Transition.Child
                                as={Fragment}
                                enter='ease-out duration-300'
                                enterFrom='opacity-0 scale-95'
                                enterTo='opacity-100 scale-100'
                                leave='ease-in duration-200'
                                leaveFrom='opacity-100 scale-100'
                                leaveTo='opacity-0 scale-95'>
                                <Dialog.Panel className='w-full max-w-[20rem] transform  rounded-2xl p-4 text-left align-middle drop-shadow-xl bg-white  transition-all'>
                                    <div className='flex items-center justify-between py-2'>
                                        <div className='text-lg font-semibold font-inter text-gray-900 dark:text-[#fff]'>
                                            <span>Notifications</span>
                                        </div>
                                        <div className='flex items-center'>
                                        <span className='mr-2 text-sm dark:text-[#fff]'>Only unread</span>
                                            {/* <label className='switch'>
                                                <input
                                                    type="checkbox"
                                                    checked={showOnlyUnread}
                                                    onChange={handleToggleOnlyUnread}
                                                />
                                                <span className='slider'></span>
                                            </label> */}
                                            <label className="toggle-switch">
                                            <input type="checkbox"  
                                                    checked={showOnlyUnread}
                                                    onChange={handleToggleOnlyUnread}/>
                                            <div className="toggle-switch-background">
                                            <div className="toggle-switch-handle"></div>
                                            </div>
                                            </label>
                                            {/* <label className="switch-notfy">
                                                <input 
                                                    type="checkbox"  
                                                    checked={showOnlyUnread}
                                                    onChange={handleToggleOnlyUnread}
                                                />
                                                <span className="slider-notify"></span>
                                            </label> */}
                                        </div>
                                    <div className='relative'>
                                        <BsThreeDotsVertical
                                            className='cursor-pointer text-gray-500 dark:text-gray-300'
                                            onClick={() => setShowOptionsMenu(!showOptionsMenu)}
                                        />
                                        {showOptionsMenu && (
                                            <div className='absolute right-0 top-full mt-2 bg-white dark:bg-gray-800 shadow-md rounded-md overflow-hidden z-10 w-[110px]'>
                                                    {notification?.length && unRead > 0 && (
                                                        <button
                                                            type='button'
                                                            className='block w-full text-left px-4 py-2 text-sm font-medium text-blue-900 dark:text-[#fff] hover:bg-blue-100 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
                                                            onClick={() => {
                                                                closeModal();
                                                                markAllRead();
                                                                setUnRead(0);
                                                                setShowOptionsMenu(false);
                                                            }}>
                                                            Mark All As Read
                                                        </button>
                                                    )}
                                                    <button
                                                        type='button'
                                                        className='block w-full text-left px-4 py-2 text-sm font-medium text-red-900 dark:text-[#fff] hover:bg-red-100 dark:hover:bg-red-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2'
                                                        onClick={() => {
                                                            setShowDeleteConfirmation(true);
                                                            setShowOptionsMenu(false);
                                                        }}>
                                                        Delete All
                                                    </button>
                                            </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className=' overflow-y-auto h-[70vh] pr-2'>
                                        {notification && notification?.length ? (
                                            notification.map(item => {
                                                if (!showOnlyUnread || (showOnlyUnread && !item.isRead)) {
                                                return (
                                                    <>
                                                        <div
                                                            className={`overflow-x-hidden flex flex-col border px-2 border-gray-200 rounded-lg shadow md:max-w-xl mb-3 h-25 ${
                                                                item.isRead === true ? 'bg-white' : 'bg-blue-100 dark:bg-gray-600'
                                                            }`}
                                                            key={item._id}>
                                                            <div className='flex items-center justify-between rounded-lg my-1'>
                                                                <div className='flex items-center w-[42%]'>
                                                                    <img className='mr-2 w-6 h-6 rounded-full' src={item.sentBy[0]?.profilePic} alt='' />
                                                                    <h5 className='text-sm font-medium font-inter text-gray-900 dark:text-[#fff] my-0 w-36 truncate'>{item.sentBy[0]?.firstName + ' ' + item.sentBy[0]?.lastName}</h5>
                                                                </div>

                                                                <div className='flex items-center justify-end w-[60%]'>
                                                                    {!item.isRead && (
                                                                        <button
                                                                            type='button'
                                                                            className='mr-2 inline-flex justify-center rounded-md border border-transparent h-6 bg-blue-100 px-2 py-1 text-sm font-medium text-blue-900 hover:bg-blue-200 dark:border-blue-500 dark:bg-transparent dark:text-[#fff] dark:hover:bg-blue-400 dark:hover:text-[#fff] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
                                                                            onClick={() => markOneRead(item._id)}>
                                                                            Mark As Read
                                                                        </button>
                                                                    )}

                                                                    <button
                                                                        type='button'
                                                                        className='inline-flex justify-center rounded-md border border-transparent h-6 dark:border-red-500 dark:bg-transparent dark:text-[#fff] dark:hover:bg-red-500 dark:hover:text-[#fff] bg-red-100 px-2 py-1 text-sm font-medium text-red-500 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2'
                                                                        onClick={() => handleDelete(item._id)}>
                                                                        {/* <AiFillDelete /> */}
                                                                        Delete
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            {}
                                                            <div className='flex items-center rounded-lg md:max-w-xl'>
                                                                <FiArrowRight className='w-[10%]' color='gray'></FiArrowRight>
                                                                <div className='mb-1 font-normal text-sm break-words font-inter text-gray-700 dark:text-gray-300 w-[88%]'>{item.message}
                                                                    {item.isComment && (
                                                                        <>
                                                                            <span className='ml-2 inline-flex justify-center rounded-md border border-transparent h-6 bg-blue-100 px-2 py-1 text-sm font-medium text-blue-900 hover:bg-blue-200 dark:border-blue-500 dark:bg-transparent dark:text-[#fff] dark:hover:bg-blue-400 dark:hover:text-[#fff] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 cursor-pointer'
                                                                                onClick={() => handleViewClick(item)}>
                                                                                View
                                                                            </span>
                                                                            <br />
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className=' flex justify-between items-center'>
                                                                <div className=' mb-1 font-normal text-sm font-inter text-gray-700 dark:text-gray-300'>
                                                                    <div className='text-ellipsis inline-block whitespace-normal break-words w-full text-center'>
                                                                        {item?.createdAt ? formatedDate(item?.createdAt) : 'No Data'}
                                                                    </div>
                                                                </div>
                                                                <div className=' mb-1 font-normal text-sm font-inter text-gray-700 dark:text-gray-300'>
                                                                    <div className='text-ellipsis inline-block whitespace-normal break-words w-full text-center'>
                                                                        {formattedDateTime(item?.createdAt)}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                                );
                                             }
                                            })
                                        ) : (
                                            <div className='text-lg text-center font normal font sans text-gray-400'>No Notifications to display.</div>
                                        )}
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                    {notification?.length > 0 && (
                        <DeleteConformation
                            open={showDeleteConfirmation}
                            close={() => setShowDeleteConfirmation(false)}
                            message='Are you sure you want to delete all notifications?'
                            onClick={handleDeleteAll}
                        />
                    )}
                </Dialog>
            </Transition>
        </>
    );
}
