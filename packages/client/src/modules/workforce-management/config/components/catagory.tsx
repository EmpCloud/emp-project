import React, { useEffect, useState } from 'react';
import { AiOutlineDelete } from 'react-icons/ai';
import { BiEditAlt } from 'react-icons/bi';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { CgPlayListAdd } from 'react-icons/cg';
import { ImCross } from 'react-icons/im';
import toast from '../../../../components/Toster/index';
import ContentEditable from '../../../../components/ContentEditable';
import DeleteConformation from '../../../../components/DeleteConformation';
import DropDown from '../../../../components/DropDown';
import SearchInput from '../../../../components/SearchInput';
import { capitalizeString, openUpgradePlan } from '../../../../helper/function';
import { getAllCategory, getSearchDefault } from '../api/get';
import { createCategory } from '../api/post';
import { updateTaskCategory } from '../api/put';
import { deleteTaskCategory, deleteTaskCategoryById } from '../api/delete';
import { downloadFiles } from '@HELPER/download';
import { Popover, PopoverHandler, PopoverContent, Button, Input, Typography } from '@material-tailwind/react';

const Category = ({ startLoading, stopLoading }) => {
    const [open, setOpen] = React.useState(false);
    const [custom, setCustomData] = React.useState('');
    const [id, setId] = useState();
    const [keys, setKeys] = useState();
    const [catagoryValues, setcatagoryValues] = useState(''); // State to store the manually entered option

    const handleClickOpen = (data, key, id) => {
        setOpen(true);
        setCustomData(data);
        setKeys(key);
        setId(id);
    };

    const handleClose = (event, reason) => {
        if (reason !== 'backdropClick') {
            setOpen(false);
        }
    };

    const [addCategory, setAddCategory] = useState(false);
    const [openDeleteModel, setOpenDeleteModel] = useState(false);
    const [deleteTaskId, setDeleteTaskId] = useState('');
    const [addValue, setAddValue] = useState(null);
    const [deleteMessage, setDeleteMessage] = useState('');
    const [categoryList, setCategoryList] = useState(null);
    const [openDeleteAllModel, setOpenDeleteAllModel] = useState(false);
    const [statusDetails, setStatusDetails] = useState(null);
    
    const download_data = [
        {
            text: 'Download CSV file',
            value: 'excel',
            onClick: () => {
                if (categoryList.length === 0) {
                    toast({
                        type: "error",
                        message: "Please add data before downloading.",
                      });
                } else {
                    downloadFiles('excel', 'Category', FinalDownloadData);
                }
            },
        },
        {
            text: 'Download PDF file',
            value: 'pdf',
            onClick: () => {
                if (categoryList.length === 0) {
                    toast({
                        type: "error",
                        message: "Please add data before downloading.",
                      });
    
                } else {
                    downloadFiles('pdf', 'Category', FinalDownloadData);
                }
            },
        },
        {
            text: 'Delete all',
            value: 2,
            onClick: (event, value, data, name) => {
                if (categoryList.length === 0) {
                    toast({
                        type: "error",
                        message: "Please add data before deleting.",
                      });
                } else {
                    setOpenDeleteAllModel(!openDeleteAllModel);
                }
            },
        },
    ];

    const handleGetAllCategory = () => {
        getAllCategory().then(response => {
            if (response.data.body.status === 'success') {
                setCategoryList(response.data.body.data.category);
            }
        });
    };
    const handleCreateCategory = () => {
        createCategory(capitalizeString(addValue))
            .then(response => {
                startLoading();
                if (response.data.body.status === 'success') {
                    handleGetAllCategory();
                    toast({ type: 'success', message: response.data.body.message });
                }
                stopLoading();
            })
            .catch(function ({ response }) {
                if (response?.response?.status === 429) {
                    openUpgradePlan();
                } else {
                    toast({
                        type: 'error',
                        message: response ? response.data.body.message : 'Something went wrong, Try again !',
                    });
                }
                stopLoading();
            });
    };
    const handleUpdateTaskCategory = (id, data) => {
        if (!data) {
            toast({
                type: 'info',
                message: 'No change in value!',
            });
            return;
        }
        updateTaskCategory(id, data).then(response => {
            startLoading();
            if (response.data.body.status === 'success') {
                toast({
                    type: 'success',
                    message: response ? response.data.body.message : 'Try again !',
                });
                handleGetAllCategory();
            } else {
                toast({
                  type: "error",
                  message: response ? response.data.body.message : "Error",
                });
            }
            stopLoading();
        })
        .catch(function ({ response }) {
                toast({
                    type: 'error',
                    message: response ? response.data.body.error : 'Something went wrong, Try again !',
                });
            stopLoading();
        });
    };
    useEffect(() => {
        handleGetAllCategory();
    }, []);
    const handleDeleteTaskCategoryById = id => {
        deleteTaskCategoryById(deleteTaskId)
            .then(function (result) {
                if (result.data.body.status == 'success') {
                    handleGetAllCategory();
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
                    message: e.response ? e.response.data.body.message : 'Something went wrong, Try again !',
                });
            });
        setOpenDeleteModel(false);
    };
    const handleDeleteAllTaskCategory = () => {
        deleteTaskCategory()
            .then(function (result) {
                if (result.data.body.status == 'success') {
                    handleGetAllCategory();
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
                    message: e.response ? e.response.data.body.message : 'Something went wrong, Try again !',
                });
            });
        setOpenDeleteAllModel(false);
    };

    const GroupFilterData = categoryList?.map((item) => {
        const { adminId,createdAt,createdBy,isDefault,isOverwrite,updatedAt,_id, ...rest } = item;
        return rest;
    });
    
    let FinalDownloadData = GroupFilterData?.map(data => {
        return {
            "Category": data?.taskCategory,
        }
    })

    return (
        <>
            <div className='card px-4 pt-2 pb-4 lg:w-1/2 lg:mr-5'>
                <div className='md:flex justify-between items-center mb-2'>
                    <h3 className='heading-medium font-semibold'>Category</h3>
                    <div className='flex items-center'>
                        <SearchInput
                            onChange={event => {
                                event.preventDefault();
                                getSearchDefault('category', event.target.value).then(response => {
                                    if (response.data.body.status === 'success') {
                                        setCategoryList(response.data.body.data.resp);
                                    }
                                });
                            }}
                            placeholder={'Search a category'}
                        />
                        <CgPlayListAdd
                            className='text-2xl grey-link'
                            onClick={() => {
                                setAddCategory(true);
                            }}
                        />
                            <DropDown
                                    data={download_data}
                                    defaultValue={''}
                                    name={'Category'}
                                    downloadData={FinalDownloadData}
                                    icon={
                                        <span className='text-xl grey-link bg-white p-2 rounded-lg'>
                                          <BsThreeDotsVertical />
                                        </span>
                                    }
                                    getData={undefined}
                                />
                    </div>
                </div>
                {addCategory && (
                    <>
                    <div className='px-3 py-1 mx-4 text-base border rounded my-2 flex items-center justify-between'>
                        <input
                            className='text-lightTextColor outline-none border-none w-full dark:bg-transparent'
                            placeholder='Write here'
                            onKeyPress={evt => {
                                var keyCode = evt.which ? evt.which : evt.keyCode;

                                // if ((keyCode < 65 || keyCode > 90) && (keyCode < 97 || keyCode > 123) && keyCode != 32) {
                                //     evt.preventDefault();
                                // }
                                // if (evt.target.value.length > 20) {
                                //     evt.preventDefault();
                                // }
                                if (keyCode === 13) {
                                    setAddCategory(false);
                                    setAddValue(null);
                                    handleCreateCategory();
                                }
                                return true;
                            }}
                            value={addValue}
                            onChange={event => {
                                setAddValue(event.target.value);
                            }}
                        />
                        <div className='flex gap-2 justify-between '>
                            <button
                                type='button'
                                className='small-button items-center xs:w-full py-2 flex h-7'
                                disabled={addValue == null}
                                onClick={() => {
                                    setAddCategory(false);
                                    setAddValue(null);
                                    handleCreateCategory();
                                }}>
                                Save
                            </button>
                            {'  '}
                            <button
                                onClick={() => {
                                    setAddCategory(false);
                                }}
                                className='px-2 cursor-pointer shadow-sm text-sm cancel-button flex items-center h-7 dark:text-black'>
                                {' '}
                                Cancel
                                {/* <ImCross />{' '} */}
                            </button>
                        </div>
                    </div>
                    </>
                    
                )}
                <div className='time-tracking-wrapper'>
                    {categoryList && categoryList.length === 0 && <div className=''>No data</div>}

                    {categoryList &&
                        categoryList.map(function (data, key) {
                            return (
                                <div key={key} className='flex items-center border-b-2 border-veryveryLightGrey py-2 gap-2 justify-between '>
                                    <div className='w-full'>
                                        {/* <h5 className="text-defaultTextColor text-base w-1/2 ml-6">{data.name}</h5> */}
                                        <ContentEditable name={data.taskCategory} id={data._id} value={data.taskCategory} className={'w-full'} disabled={true} />
                                    </div>
                                    <div className='flex text-xl justify-between  '>
                                        <button
                                            className='disabled:opacity-25 disabled:cursor-not-allowed'
                                            id={data._id}
                                            disabled={data.isDefault}
                                            onClick={() => {
                                                handleClickOpen(data.taskCategory, key, data._id);
                                            }}>
                                            <BiEditAlt size={20} className=' dark:text-gray-50' />
                                        </button>

                                        <Popover open={open} onClose={handleClose} placement='bottom'  style={{ background: 'black' }}>
                                            <PopoverContent
                                                className='justify-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-[999] outline-none bg-slate-400 shadow-none bg-opacity-5 focus:outline-none'>
                                                <div className='relative my-2  z-50 sm:w-[!20rem]'>
                                                    <div className='border-0 mb-7 sm:mt-8 rounded-2xl shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none'>
                                                        <div className='relative sm:px-3  md:p-6 flex-auto'>
                                                            <div className='relative sm:px-3  md:p-6 flex-auto'>
                                                                <button
                                                                    className='text-lightGrey hover:text-darkTextColor absolute -right-2 -top-2 rounded-full bg-veryLightGrey  uppercase  text-sm outline-none focus:outline-none p-1 ease-linear transition-all duration-150'
                                                                    type='button'
                                                                    onClick={() => {
                                                                        handleClose();
                                                                    }}>
                                                                    <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
                                                                        <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
                                                                    </svg>
                                                                </button>
                                                                <div className='rounded-lg bg-white'>
                                                                    <Typography variant='h6' color='blue-gray' className='mb-6'>
                                                                        Make the Changes for {custom} Field
                                                                    </Typography>
                                                                    {/* Adding a text field to manually enter a custom option */}
                                                                    <Input
                                                                        sx={{ m: 1, minWidth: 120 }}
                                                                        // label={custom}
                                                                        defaultValue={custom}
                                                                        // placeholder={custom}
                                                                        id={keys}
                                                                        onKeyPress={evt => {
                                                                            var keyCode = evt.which ? evt.which : evt.keyCode;

                                                                            // if ((keyCode < 65 || keyCode > 90) && (keyCode < 97 || keyCode > 123) && keyCode != 32) {
                                                                            //     evt.preventDefault();
                                                                            // }
                                                                            // if (evt.target.value.length > 20) {
                                                                            //     evt.preventDefault();
                                                                            // }
                                                                            return true;
                                                                        }}
                                                                        onChange={event => {
                                                                            setcatagoryValues(event.target.value);
                                                                        }}
                                                                        variant='outlined'
                                                                    />
                                                                    <div className='flex gap-6 pt-4'>
                                                                    <Button onClick={handleClose}>Cancel</Button>
                                                                    <Button
                                                                        onClick={() => {
                                                                            const catagoryValue = categoryList;
                                                                            catagoryValue[keys].taskCategory = catagoryValues;
                                                                            setCategoryList([...catagoryValue]);
                                                                            document.getElementById(id).setAttribute('currentValue', catagoryValues);
                                                                            handleUpdateTaskCategory(id, capitalizeString(document.getElementById(id).getAttribute('currentValue')));
                                                                            handleClose();
                                                                        }}>
                                                                        Ok
                                                                    </Button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </PopoverContent>
                                        </Popover>

                                        <button
                                            className='red-link pl-4 disabled:opacity-25 disabled:cursor-not-allowed'
                                            disabled={data.isDefault}
                                            onClick={() => {
                                                setDeleteMessage('Delete TaskCategory ' + '"' + data.taskCategory + '"');
                                                setDeleteTaskId(data._id);
                                                setOpenDeleteModel(true);
                                            }}>
                                            <AiOutlineDelete />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>
            <DeleteConformation open={openDeleteModel} close={() => setOpenDeleteModel(false)} message={deleteMessage} onClick={handleDeleteTaskCategoryById} />
            <DeleteConformation
                open={openDeleteAllModel}
                close={() => {
                    setOpenDeleteAllModel(!openDeleteAllModel);
                }}
                message={'Delete All Custom Task Category'}
                onClick={handleDeleteAllTaskCategory}
            />
        </>
    );
};
export default Category;
