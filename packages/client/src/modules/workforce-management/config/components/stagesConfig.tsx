import React, { useEffect, useState } from 'react';
import { AiOutlineDelete } from 'react-icons/ai';
import { BiEditAlt } from 'react-icons/bi';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { CgPlayListAdd } from 'react-icons/cg';
import { ImCross } from 'react-icons/im';
import ContentEditable from '../../../../components/ContentEditable';
import DeleteConformation from '../../../../components/DeleteConformation';
import DropDown from '../../../../components/DropDown';
import SearchInput from '../../../../components/SearchInput';
import toast from '../../../../components/Toster/index';
import { capitalizeString, openUpgradePlan } from '../../../../helper/function';
import { deleteTaskStage, deleteTaskStageById } from '../api/delete';
import { getAllStages, getSearchDefault } from '../api/get';
import { createStage } from '../api/post';
import { updateTaskStage } from '../api/put';
import { downloadFiles } from '@HELPER/download';
import { Popover, PopoverHandler, PopoverContent, Button, Input, Typography } from '@material-tailwind/react';

const stageConfig = ({ startLoading, stopLoading }) => {
    const [open, setOpen] = useState(false);
    const [custom, setCustomData] = useState('');
    const [id, setId] = useState();
    const [keys, setKeys] = useState();
    const [catagoryValues, setcatagoryValues] = useState('');

    const handleClickOpen = (data, key, id) => {
        setOpen(true);
        setCustomData(data);
        setKeys(key);
        setId(id);
    };

    const handleClose = () => {
        
            setOpen(false);
        
    };

    const download_data = [
        {
            text: 'Download CSV file',
            value: 'excel',
            onClick: () => {
                if (stageList.length === 0) {
                    toast({
                        type: "error",
                        message: "Please add data before downloading.",
                      });
                } else {
                    downloadFiles('excel', 'Stages', FinalDownloadData);
                }
            },
        },
        {
            text: 'Download PDF file',
            value: 'pdf',
            onClick: () => {
                if (stageList.length === 0) {
                    toast({
                        type: "error",
                        message: "Please add data before downloading.",
                      });
    
                } else {
                    downloadFiles('pdf', 'Stages', FinalDownloadData);
                }
            },
        },
        {
            text: 'Delete all',
            value: 2,
            onClick: (event, value, data, name) => {
                if (stageList.length === 0) {
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
    const [stageList, setStageList] = useState(null);
    const [addValue, setAddValue] = useState(null);
    const [addStage, setAddStage] = useState(false);
    const [openDeleteModel, setOpenDeleteModel] = useState(false);
    const [deleteTaskId, setDeleteTaskId] = useState('');
    const [deleteMessage, setDeleteMessage] = useState('');
    const [openDeleteAllModel, setOpenDeleteAllModel] = useState(false);
    const handleGetAllStage = () => {
        getAllStages().then(response => {
            if (response.data.body.status === 'success') {
                setStageList(response.data.body.data.stage);
            }
        });
    };
    useEffect(() => {
        handleGetAllStage();
    }, []);

    const handleCreateStage = () => {
        createStage(capitalizeString(addValue))
            .then(response => {
                startLoading();
                if (response.data.body.status === 'success') {
                    handleGetAllStage();
                    toast({ type: 'success', message: response.data.body.message });
                }
                stopLoading();
            })
            .catch(function ({ response }) {
                if (response.status === 429) {
                    openUpgradePlan();
                } else {
                    toast({
                        type: 'error',
                        message: response ? response.data.body.message : 'Something went wrong, Try again !',
                    });
                }
            });
    };
    const handleUpdateTaskStage = (id, data) => {
        if (!data) {
            toast({
                type: 'info',
                message: 'No change in value!',
            });
            return;
        }
        updateTaskStage(id, data).then(response => {
            startLoading();
            if (response.data.body.status === 'success') {
                toast({
                    type: 'success',
                    message: response ? response.data.body.message : 'Try again !',
                });
                handleGetAllStage();
            } else {
                toast({
                  type: "error",
                  message: response ? response.data.body.message : "Error",
                });
            }
            stopLoading();
        }).catch(function ({ response }) {
                toast({
                    type: 'error',
                    message: response ? response.data.body.error : 'Something went wrong, Try again !',
                });
        });
    };
    const handleDeleteTaskStageById = id => {
        deleteTaskStageById(deleteTaskId)
            .then(function (result) {
                if (result.data.body.status == 'success') {
                    handleGetAllStage();
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
    const handleDeleteAllTaskStage = () => {
        deleteTaskStage()
            .then(function (result) {
                if (result.data.body.status == 'success') {
                    handleGetAllStage();
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

    const GroupFilterData = stageList?.map((item) => {
        const { adminId,createdAt,createdBy,isDefault,isOverwrite,updatedAt,_id, ...rest } = item;
        return rest;
    });
    
    let FinalDownloadData = GroupFilterData?.map(data => {
        return {
            "Stages": data?.taskStage,
        }
    })
    return (
        <>
            <div className='card p-4 lg:w-1/2 mt-5 xs:mt-5 md:mt-5 lg:mt-0'>
                <div className='md:flex justify-between items-center  mb-4'>
                    <h3 className='heading-medium dark:text-darkTitleColor font-semibold'>Stages</h3>
                    <div className='flex items-center'>
                        <SearchInput
                            onChange={event => {
                                event.preventDefault();
                                getSearchDefault('stage', event.target.value).then(response => {
                                    if (response.data.body.status === 'success') {
                                        setStageList(response.data.body.data.resp);
                                    }
                                });
                            }}
                            placeholder={'Search a stage'}
                        />
                        <CgPlayListAdd
                            className='text-2xl grey-link'
                            onClick={() => {
                                setAddStage(true);
                            }}
                        />
                        <DropDown
                            data={download_data}
                            defaultValue={''}
                            icon={
                                <span className='text-xl grey-link'>
                                    <BsThreeDotsVertical />
                                </span>
                            }
                        />
                    </div>
                </div>
                
                    {addStage && (
                        <div className='border rounded py-1 flex items-center justify-between px-4 mx-4 mb-2 text-base '>
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
                                        setAddStage(false);
                                        setAddValue(null);
                                        handleCreateStage();
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
                                        setAddStage(false);
                                        setAddValue(null);
                                        handleCreateStage();
                                    }}>
                                    Save
                                </button>
                                {'  '}
                                <button
                                    onClick={() => {
                                        setAddStage(false);
                                    }}
                                    className='px-2 cursor-pointer shadow-sm text-sm cancel-button flex items-center h-7 dark:text-black'>                                    
                                    {' '}
                                    Cancel
                                    {/* <ImCross />{' '} */}
                                </button>
                            </div>
                        </div>
                    )}
                    {stageList && stageList.length === 0 && <div className=''>No data</div>}

                    <div className='time-tracking-wrapper'>
                    {stageList &&
                        stageList.map(function (data, key) {
                            return (
                                <div key={key} className='flex items-center border-b-2 border-veryveryLightGrey py-2.5 pb-2 pt-2 gap-2 justify-between '>
                                    <div className='w-full'>
                                        <ContentEditable
                                            disabled={data.isDefault}
                                            name={data.taskStage}
                                            className={'w-full'}
                                            value={data.taskStage}
                                            id={data._id}
                                            onChange={event => {
                                                handleClickOpen(data.taskStage, key, data._id);
                                            }}
                                        />
                                    </div>
                                    <div className='flex text-xl   justify-between '>
                                        <button
                                            className='disabled:opacity-25 disabled:cursor-not-allowed'
                                            disabled={data.isDefault}
                                            onClick={() => {
                                                handleClickOpen(data.taskStage, key, data._id);
                                            }}>
                                            <BiEditAlt size={20} className=' dark:text-gray-50' />
                                        </button>
                                        <Popover open={open} onClose={handleClose}>
                                            <PopoverContent
                                                component='form'
                                                sx={{ display: 'flex', flexWrap: 'wrap' }}
                                                style={{ background: 'rgba(255, 255, 255, 0.5)' }}
                                                className='justify-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-[999] bg-slate-400 bg-opacity-5 shadow-none outline-none focus:outline-none'>
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
                                                                        id={keys}
                                                                        // placeholder={custom}
                                                                        defaultValue={custom}
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
                                                                    <div className=' flex gap-6 pt-4'>
                                                                    <Button onClick={handleClose}>Cancel</Button>
                                                                    <Button
                                                                        onClick={() => {
                                                                            const statusTypeDetail = stageList;
                                                                            statusTypeDetail[key].taskStatus = catagoryValues;
                                                                            setStageList([...statusTypeDetail]);
                                                                            document.getElementById(id).setAttribute('currentValue', catagoryValues);
                                                                            handleClose();
                                                                            handleUpdateTaskStage(id, capitalizeString(document.getElementById(id).getAttribute('currentValue')));
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
                                                setDeleteMessage('Delete TaskStage ' + '"' + data.taskStage + '"');
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
            <DeleteConformation open={openDeleteModel} close={() => setOpenDeleteModel(false)} message={deleteMessage} onClick={handleDeleteTaskStageById} />
            <DeleteConformation
                open={openDeleteAllModel}
                close={() => {
                    setOpenDeleteAllModel(!openDeleteAllModel);
                }}
                message={'Delete All Custom Task Stage'}
                onClick={handleDeleteAllTaskStage}
            />
        </>
    );
};
export default stageConfig;
