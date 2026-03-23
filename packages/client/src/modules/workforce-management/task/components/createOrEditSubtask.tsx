import { AiOutlineLink } from "react-icons/ai"; 
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState ,useMemo} from 'react';
import validate from 'validate.js';
import { FloatingSelectfield } from '../../../../components/FloatingSelectfield';
import FloatingTextfield from '../../../../components/FloatingTextfield';
import { TextArea } from '../../../../components/TextArea';
import { displayErrorMessage, formatedDate, openUpgradePlan, uniqueArrays, uniqueMembers } from '../../../../helper/function';
import { updateSubTask, updateSubTaskAttachement } from '../api/put';
import toast from '../../../../components/Toster/index';
import { createSubtaskApi, uploadFilesInGCB } from '../api/post';
import { actualHoursSchema, subTaskDetailsSchema, estimationHoursSchema, requiredSchema, taskTitleSchema } from '../../../../helper/schema';
import MultiSelectDropDown from '../../../../components/MultiSelectDropDown';
import { MdEditNote } from 'react-icons/md';
import { AiOutlinePlus } from 'react-icons/ai';
import moment from 'moment';
import { CgAsterisk } from 'react-icons/cg';
import LabelWithRefresh from '@COMPONENTS/labelWithRefresh';
import _ from 'lodash';
import TinnySpinner from '../../../../components/TinnySpinner';
import Cookies from 'js-cookie';
import dynamic from 'next/dynamic';
import { fetchProfile } from '@WORKFORCE_MODULES/admin/api/get';

const createOrEditSubtask = ({ subtaskType, handleSearchTask, handleGetFilterTask, handleGetAllTask, data, taskDetails, taskTypeDetails, users, groupList,roleList,stageList,categoryList, startLoading, stopLoading,searchKeyword,sortTable,filterType,taskList,statusDetails }) => {
    
    const initialState = {
        isValid: false,
        values: {
            subTaskCategory: data ? data.subTaskCategory ?? 'Default' : 'Default',
            projectId: data ? data.projectId : null,
            taskId: data ? (subtaskType === 'edit' ? data.taskId : data._id) : null,
            subTaskStageName: data ? data.subTaskStageName ? data.subTaskStageName : 'Default' : 'Default',
            subTaskTitle: data ? data.subTaskTitle : null,
            subTaskType: data ? data.subTaskType ? data.subTaskType: 'Default' : 'Default',
            subTaskStatus: data ? data.subTaskStatus : 'Todo',
            subTaskDetails: data ? data.subTaskDetails : '',
            reason: data ? data.reason : null,
            dueDate: subtaskType === 'edit' ?(data ? formatedDate(data.dueDate) : moment(moment()).add(30, 'd').format('YYYY-MM-DD')):moment().add(30, 'd').format('YYYY-MM-DD'),
            estimationDate: subtaskType === 'edit' ? (data ? formatedDate(data.estimationDate) : moment().format('YYYY-MM-DD')) : moment().format('YYYY-MM-DD'),
            completedDate: data ? formatedDate(data.completedDate) : moment().format('YYYY-MM-DD'),
            estimationTime: data ? data.estimationTime : '18:00',
            actualHours: data ? data.actualHours : '00:00',
            subTaskAssignedTo: data ? data?.subTaskAssignedTo?.filter((d)=>{return d.role === 'member'}) : [],
            customUsers: data ? data?.subTaskAssignedTo?.filter((d)=>{return d.role !== 'member'}) : [],
            attachment: subtaskType === 'edit' ? (data ? data?.attachment : []) : [],
            epicLink:  [],
            priority: data ? data.priority : 'Low', 
            group: data ? data.group : [],
        },
        touched: {},
        errors: {
            taskId: null,
            dueDate: null,
            subTaskDetails: '',
            reason: null,
            subTaskStageName: null,
            subTaskCategory:null,
            subTaskTitle: null,
            subTaskType: null,
            subTaskStatus: null,
            subTaskAssignedTo: null,
            estimationDate: null,
            completedDate: null,
            estimationTime: null,
            actualHours: null,
            priority: null,
            subTaskCreator: null,
        },
    };
    const schema = {
        taskId: requiredSchema,
        subTaskTitle: taskTitleSchema,
        subTaskDetails: '',
        dueDate: requiredSchema,
        subTaskType: requiredSchema,
        priority: requiredSchema,
        // subTaskAssignedTo: requiredSchema,
        estimationDate: requiredSchema,
        estimationTime: estimationHoursSchema,
        actualHours: actualHoursSchema,
        subTaskStageName: requiredSchema,
        subTaskCategory:requiredSchema,
    
    };
    const [showModal, setShowModal] = useState(false);
    const [filAttachmente, setFileAttachment] = useState(null);
    const [tinySpinner, setTinySpinner] = useState(false);
    const [selectedRole, setSelectedRole] = useState("member");
    const [permission, setPermission] = useState(null);
    const [formState, setFormState] = useState({ ...initialState });
    

    const handleCloseModel = () => {
        setShowDynamicInput(false);
        setShowModal(false);
        setFormState({ ...initialState });
    };
    useEffect(()=>{
        setFormState({ ...initialState })
        handleProfileData();
    },[data]);
    useEffect(() => {
        const errors = validate(formState.values, schema);
        setFormState(prevFormState => ({
            ...prevFormState,
            isValid: !errors,
            errors: errors || {},
        }));
    }, [formState.values, formState.isValid]);

    const handleChange = event => {
        event.persist();
        setFormState(formState => ({
            ...formState,
            values: {
                ...formState.values,
                [event.target.name]: event.target.getAttribute('formate') === 'array' ? [event.target.value] : event.target.value,
            },
            touched: {
                ...formState.touched,
                [event.target.name]: true,
            },
        }));
    };
    const handleDescription = event =>{

        setFormState(formState => ({
            ...formState,
            values: {
                ...formState.values,
                subTaskDetails: event,
            },
        }));
    }
    const handleEpicLink = event =>{

        setFormState(formState => ({
            ...formState,
            values: {
                ...formState.values,
                epicLink: [event.target.value],
            },
        }));
    }
    const handleChangeRole = e => {
        setSelectedRole(e.target.value);
    };
    const hasError = field => !!(formState.touched[field] && formState.errors[field]);

    const handleFileUploadInPublic = event => {
        setTinySpinner(true);
        const category = 'SubTask';
        event.persist();
        let formdata = new FormData();
        let maxSizePerFile;
        let files = event.target.files;
        // Define maximum file size based on file type
        const maxSizeForVideo = 500 * 1024 * 1024; // 500MB for video files
        const maxSizeForOther = 500 * 1024 * 1024; // 500MB for other files


        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            // Check if the file is a video
            if (file.type.includes('video')) {
                maxSizePerFile = maxSizeForVideo;
            } else {
                maxSizePerFile = maxSizeForOther;
            }

            if (file.size <= maxSizePerFile) {
                formdata.append('files', file);
            } else {
                toast({
                    type: 'warning',
                    message: file.type.includes('video') ? 'Video file size should be less than 50MB!' : 'File size should be less than 10MB!',
                });
                setTinySpinner(false);
                return; // Stop processing if any file exceeds size limit
            }
        }

        if (formdata.getAll('files').length > 0) {
            uploadFilesInGCB(formdata, category, data?._id)
                .then(response => {
                    if (response?.data?.code === 200) {
                        const uploadedUrls = response.data.data.filesUrls.map(fileUrl => fileUrl.url);
                        
                         
                        setFormState(formState => ({
                            ...formState,
                            values: {
                                ...formState?.values,
                                attachment: [...uploadedUrls,  ...(data?.attachment || [])],
                            },
                            touched: {
                                ...formState?.touched,
                                attachment: true,
                            },
                        }));
                        setTinySpinner(false);
                    } else {
                        toast({
                            type: 'error',
                            message: response ? response.data.body.error : 'Try again !',
                        });
                        setTinySpinner(false);
                    }
                })
                .catch(error => {
                    toast({
                        type: 'error',
                        message: error ? error.data.body.error : 'Try again !',
                    });
                    setTinySpinner(false);
                });
        }
    };
    const handleDeleteTaskAttachment = deleteData => {
        const attachments = formState?.values?.attachment?.filter(obj => deleteData !== obj);
        updateSubTaskAttachement({ attachment: attachments }, data?._id).then(response => {
            if (response?.data?.body?.status === 'success') {
                toast({
                    type: 'success',
                    message: response ? response?.data?.body?.message : 'Try again !',
                });
                setFileAttachment(null);
                handleGetAllTask(`?limit=10`);
            } else {
                toast({
                    type: 'error',
                    message: response ? response?.data?.body?.message : 'Try again !',
                });
            }
        });
    };
    const handleCreateOrEditSubtask = event => {
        let assignToObj = formState.values.subTaskAssignedTo
            ? formState.values.subTaskAssignedTo
                  .concat(formState.values.customUsers)
                  .filter(d => d && d._id)
                  .map(d => {
                      return { id: d._id };
                  })
            : [];
            let stateA = []
            let stateB = formState?.values.epicLink;
            let stateC= []
            
            stateA =data?.epicLink? data?.epicLink.concat(stateB):stateB;
            stateC = Array.from(new Set(stateA));
        let apiData = {
            ..._.omit({ ...formState.values, subTaskAssignedTo: assignToObj ,epicLink:stateC}, ['group','customUsers']),
        };
        delete apiData.id;
        if (subtaskType === 'edit') {
            updateSubTask(data._id, apiData)
                .then(function (result) {
                    if (result.data && result.data.body.status === 'success') {
                        toast({
                            type: 'success',
                            message: result ? result.data.body.message : 'Try again !',
                        });
                        if(filterType === "search"){
                            handleSearchTask('?keyword=' + searchKeyword +'&limit=' + sortTable.limit + "&skip=" + sortTable.skip);
                        }else
                        if(filterType === "filter"){
                            handleGetFilterTask('?limit=' + sortTable.limit + "&skip=" + sortTable.skip)
                        }else
                        handleGetAllTask('?limit=' + sortTable.limit + "&skip=" + sortTable.skip);
                        setShowModal(false);
                    }
                })
                .catch(function (e) {
                    toast({
                        type: 'error',
                        message: e.response ? e.response.data.body.message : 'Something went wrong, Try again !',
                    });
                });
        } else {
            let id = taskDetails && taskDetails.filter(d => d._id == formState.values.taskId)[0].projectId;
            let data = { ...apiData, projectId: id };
            createSubtaskApi({ ...data })
                .then(function (result) {
                        if (result.data && result.data.body.status === 'success') {
                            toast({
                            type: 'success',
                            message: result ? result.data.body.message : 'Try again !',
                        });
                        if(filterType === "search"){
                            handleSearchTask('?keyword=' + searchKeyword +'&limit=' + sortTable.limit + "&skip=" + sortTable.skip);
                        }else
                        if(filterType === "filter"){
                            handleGetFilterTask('?limit=' + sortTable.limit + "&skip=" + sortTable.skip)
                        }else
                        handleGetAllTask('?limit=' + sortTable.limit);
                        
                        setShowModal(false);
                        setFormState(initialState);
                    }
                    else if(result.data.body.error === '\"subTaskAssignedTo[3]\" contains a duplicate value' ){
                        toast({
                            type: 'error',
                            message: 'Please dont duplicate users',
                        });
                    }
                     else {
                        toast({
                            type: 'error',
                            message: result.data.body.message,
                        });
                        setShowModal(false);
                    }
                })
                .catch(function ({ response }) {
                    setShowModal(false);
                    if (response?.status === 429) {
                        openUpgradePlan();
                    }
               
                     else if(response?.data.body.error){
                        toast({
                            type: 'error',
                            message: response?.data?.body?.message,
                        });
                        setShowModal(false);
                    }
                });
        }
    };
    const handleChangeMultiSelector = (data, name, type) => {
        if (name === 'group' && type === 'select') {
            let temp = [];
            let tempCustomMembers = [];

            data.map(function (d1) {
                d1.value.assignedMembers
                    .filter(d2 => {
                        return d2.role === 'member';
                    })
                    .map(d3 => {
                        temp.push(d3);
                    });

                d1.value.assignedMembers
                    .filter(d2 => {
                        return d2.role !== 'member';
                    }).map(d3 => {
                        tempCustomMembers.push(d3);
                    });
            });

            setFormState(formState => ({
                ...formState,
                values: {
                    ...formState.values,
                    subTaskAssignedTo: uniqueMembers([...(formState.values.subTaskAssignedTo || []), ...temp]),
                    customUsers: uniqueMembers([...(formState.values.customUsers || []), ...tempCustomMembers]),
                },
            }));
        }
        var finalData = data.map(function (val) {
            return val.value;
        });
        setFormState(formState => ({
            ...formState,
            values: {
                ...formState.values,
                [name]: finalData,
            },
            touched: {
                ...formState.touched,
                [name]: true,
            },
        }));
    };
    const handleProfileData = () => {
        fetchProfile().then(response => {
            if (response.data?.body.status === 'success') {
                setPermission(response.data.body.data.permissionConfig);
            }
        });
    };
    const DynamicCustomInput =useMemo(()=> dynamic(()=>import('@COMPONENTS/ReactQuillTextEditor'), { ssr: false }),[]);

    const displayValue = () => {
        // Use DOMParser to parse HTML and extract text content
        const parser = new DOMParser();
        
        const parsedHtml = parser.parseFromString(formState.values.subTaskDetails, 'text/html');
        if(parsedHtml.body.textContent==='undefined'){
        
        return  "";
        }else{
        return parsedHtml.body.textContent || "";
        }
      };
      const [showDynamicInput, setShowDynamicInput] = useState(false);

      const handleTextAreaClick = () => {
        // Toggle the state to switch between TextArea and DynamicCustomInput
        setShowDynamicInput(!showDynamicInput);
      };
    
    return (
        <>
            {subtaskType === 'add' ? (
                <button
                    className='small-button items-center xs:w-full py-2 flex h-8'
                    onClick={() => {
                        setShowModal(true);
                    }}>
                    Create Sub-task
                </button>
            ) : subtaskType === 'edit' ? (
                <button
                    className='grey-link mr-4'
                    onClick={() => {
                        setShowModal(true);
                    }}>
                    <MdEditNote />
                </button>
            ) : subtaskType === undefined ?(
                <button
                    className='small-button items-center xs:w-full py-2 flex h-8'
                    onClick={() => {
                        setShowModal(true);
                    }}>
                    Create Sub-task
                </button>
            ):(
                <button
                className='grey-link mr-4'
                onClick={() => {
                    setShowModal(true);
                }}>
                <AiOutlinePlus />

                </button>
            )}
            {showModal && (
                <>
                    <div className='justify-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-[999] outline-none focus:outline-none'>
                        <div className='relative my-2 mx-auto w-11/12 lg:w-7/12 z-[999]'>
                            {/*content*/}
                            <div className='border-0 mb-7 sm:mt-8 rounded-2xl shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none'>
                                {/*header*/}
                                {/*body*/}
                                <div className='relative py-5 sm:px-3 p-3 md:px-10 flex-auto'>
                                    <button
                                        className='text-lightGrey hover:text-darkTextColor absolute -right-2 -top-2 rounded-full bg-veryLightGrey  uppercase  text-base outline-none focus:outline-none p-1 ease-linear transition-all duration-150'
                                        type='button'
                                        onClick={handleCloseModel}>
                                        <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
                                            <path strokeWidth='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
                                        </svg>
                                    </button>
                                    <div className='rounded-lg bg-white'>
                                        {/* body task popup start here */}
                                        <div className=''>
                                            <div className=''>
                                                <p className='text-darkTextColor sm:text-xl text-2xl font-bold'>
                                                    {subtaskType === 'add' ? ' Create Sub Task' : subtaskType === 'edit' ? 'Edit Sub Task' : ' Create Sub Task'}
                                                </p>
                                                        <label className='text-base my-2 font-bold text-darkTextColor flex' htmlFor=''>
                                                            Required Fileds are marked with an asterisk <CgAsterisk color='red' />
                                                        </label>
                                                {subtaskType === 'add' ? (
                                                    <div className='sm:flex gap-5'>
                                                        <div className='input_box flex flex-col sm:w-2/4 '>
                                                            <label className='text-base my-2 font-bold text-darkTextColor flex' htmlFor=''>
                                                                 Task <CgAsterisk color='red' />
                                                            </label>
                                                                <FloatingSelectfield
                                                                    label={'Select the Task '}
                                                                    selectedOptionStyle={'font-semibold'}
                                                                    optionsGroup={taskList}
                                                                    name={'taskId'}
                                                                    value={formState.values.taskId || ''}
                                                                    onChange={handleChange}
                                                                    error={hasError('taskId')}
                                                                    errorMsg={displayErrorMessage(formState.errors.taskId)}
                                                                />
                                                        </div>

                                                        <div className='input_box flex flex-col sm:w-2/4 '>
                                                                                                                 <label className='text-base my-2 font-bold text-darkTextColor flex' htmlFor=''>
                                                                 Sub-Task title <CgAsterisk color='red' /> <span className='text-base'>(upto 100 characters)</span>
                                                            </label>
                                                                <FloatingTextfield
                                                                    titleStyle={'!font-bold !text-black dark:!text-gray-50'}
                                                                    type='text'
                                                                    placeholder={'Subtask title '}
                                                                    label={''}
                                                                    error={hasError('subTaskTitle')}
                                                                    errorMsg={displayErrorMessage(formState.errors.subTaskTitle)}
                                                                    name='subTaskTitle'
                                                                    value={formState.values.subTaskTitle || ''}
                                                                    onChange={handleChange}
                                                                />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className='input_box flex flex-col sm:w-full'>
                                                        <label className='text-base my-2 font-bold text-darkTextColor flex' htmlFor=''>
                                                                Sub-Task title <CgAsterisk color='red' /> <span className='text-base'>(upto 100 characters)</span>
                                                        </label>
                                                            <FloatingTextfield
                                                                type='text'
                                                                placeholder={'Subtask title '}
                                                                label={''}
                                                                error={hasError('subTaskTitle')}
                                                                errorMsg={displayErrorMessage(formState.errors.subTaskTitle)}
                                                                name='subTaskTitle'
                                                                value={formState.values.subTaskTitle || ''}
                                                                onChange={handleChange}
                                                            />
                                                    </div>
                                                )}
                                                <div className='sm:flex gap-5'>
                                                    <div className='input_box sm:w-2/4 mt-2'>
                                                        <label className='text-base my-2 font-bold text-darkTextColor flex' htmlFor=''>
                                                                Subtask type <CgAsterisk color='red' />{' '}
                                                        </label>
                                                            <FloatingSelectfield
                                                                label={''}
                                                                optionsGroup={taskTypeDetails}
                                                                name={'subTaskType'}
                                                                value={formState.values.subTaskType || ''}
                                                                onChange={handleChange}
                                                                error={hasError('subTaskType')}
                                                                errorMsg={displayErrorMessage(formState.errors.subTaskType)}
                                                            />
                                                    </div>
                                                    <div className='input_box sm:w-2/4 mt-2'>
                                                        <label className='text-base my-2 font-bold text-darkTextColor flex' htmlFor=''>
                                                                Category<CgAsterisk color='red' />{' '}
                                                        </label>
                                                            <FloatingSelectfield
                                                                label={''}
                                                                optionsGroup={categoryList}
                                                                name={'subTaskCategory'}
                                                                value={formState.values.subTaskCategory || ''}
                                                                onChange={handleChange}
                                                                error={hasError('subTaskCategory')}
                                                                errorMsg={displayErrorMessage(formState.errors.subTaskCategory)}
                                                            />
                                                    </div>
                                                </div>

                                                <div className='mt-2 sm:mb-6 taskTextArea'>
                                                    <label className='text-base my-2 font-bold text-darkTextColor flex'>
                                                    Subtask details
                                                    </label>
                                                    {/* <TextArea
                                                        type='text'
                                                        label={''}
                                                        error={hasError('subTaskDetails')}
                                                        errorMsg={displayErrorMessage(formState.errors.subTaskDetails)}
                                                        name='subTaskDetails'
                                                        value={formState.values.subTaskDetails || ''}
                                                        onChange={handleChange}
                                                    /> */}
                                                     {showDynamicInput ? (
                                                    <DynamicCustomInput
                                                    type='text'
                                                    name='taskDetails'
                                                    value={formState.values.subTaskDetails || ''}
                                                    onChange={handleDescription}
                                                    />
                                                     ):(
                                                        <div onClick={handleTextAreaClick}>
                                                        <TextArea
                                                        type='text'
                                                        name='taskDetails'
                                                        backgroundColor={'darkGray'}
                                                        className='text-sm border rounded-md w-full p-3 bg-gray-100/50 outline-brandBlue'
                                                        value={displayValue()}
                                                        />
                                                        </div>
                                                     )}
                                                </div>
                                                <div className="input_box flex flex-col">                                                    
                                                    <label className="text-base my-2 font-bold text-darkTextColor flex">
                                                        SubTask Status
                                                        <CgAsterisk color="red" />
                                                        </label>
                                                    
                                                    <FloatingSelectfield
                                                        label={""}
                                                        optionsGroup={
                                                            statusDetails &&
                                                            statusDetails.map(d => {
                                                                return { text: d.taskStatus, value: d.taskStatus };
                                                            })
                                                        }
                                                        name={"subTaskStatus"}
                                                        value={formState?.values?.subTaskStatus}
                                                        onChange={(event) =>
                                                            handleChange(event)
                                                        }
                                                    
                                                    />
                                                        </div>
                                                {subtaskType === "edit" && new Date() > new Date(formState.values.dueDate) ? (
                                                <div className='input_box flex flex-col'>
                                                    <label className='text-base my-2 font-bold text-darkTextColor flex'>
                                                        Reason
                                                    </label>
                                                    <TextArea
                                                        type='text'
                                                        label={''}
                                                        error={hasError('reason')}
                                                        errorMsg={displayErrorMessage(formState.errors.reason)}
                                                        name='reason'
                                                        value={formState.values.reason || ''}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                                 ) : (
                                                    <></>
                                                  )}
                                                <div className='sm:flex gap-5 items-center'>
                                                    <div className='flex flex-col sm:w-full'>
                                                        <label className='text-base my-2 font-bold text-darkTextColor flex' htmlFor=''>
                                                                 Stage<CgAsterisk color='red' />{' '}
                                                        </label>
                                                            <FloatingSelectfield
                                                                label={''}
                                                                optionsGroup={stageList}
                                                                name={'subTaskStageName'}
                                                                value={formState.values.subTaskStageName || ''}
                                                                onChange={handleChange}
                                                                error={hasError('subTaskStageName')}
                                                                errorMsg={displayErrorMessage(formState.errors.subTaskStageName)}
                                                            />
                                                    </div>
                                                </div>
                                                <div className='sm:flex gap-5 '>
                                                <div className='input_box flex flex-col sm:w-2/4'>
                                                        <label className='text-base my-2 font-bold text-darkTextColor flex' htmlFor=''>
                                                                Due date <CgAsterisk color='red' />{' '}
                                                        </label>
                                                            <FloatingTextfield
                                                                type='date'
                                                                min={formState.values.estimationDate || ''}
                                                                name={'dueDate'}
                                                                value={formState.values.dueDate}
                                                                onChange={handleChange}
                                                                error={hasError('dueDate')}
                                                                errorMsg={displayErrorMessage(formState.errors.dueDate)}
                                                            />
                                                    </div>
                                                    <div className='input_box flex flex-col sm:w-2/4'>
                                                        <label className='text-base my-2 font-bold text-darkTextColor flex' htmlFor=''>
                                                                Estimated Date <CgAsterisk color='red' />{' '}
                                                        </label>
                                                            <FloatingTextfield
                                                                type='date'
                                                                min={formState.values.estimationDate || ''}
                                                                name={'estimationDate'}
                                                                error={hasError('estimationDate')}
                                                                errorMsg={displayErrorMessage(formState.errors.estimationDate)}
                                                                value={formState.values.estimationDate}
                                                                onChange={handleChange}
                                                            />
                                                    </div>
                                                </div>

                                                <div className="sm:flex gap-5">
                                                    {subtaskType === 'edit' ? (
                                                        <>                                                            <div className='input_box flex flex-col sm:w-2/4'>
                                                                <label className='text-base my-2 font-bold text-darkTextColor flex' htmlFor=''>
                                                                        <b>Completed Date</b>{' '}
                                                                </label>
                                                                    <FloatingTextfield
                                                                        type='date'
                                                                        min={formState.values.estimationDate || ''}
                                                                        name={'completedDate'}
                                                                        error={hasError('completedDate')}
                                                                        errorMsg={displayErrorMessage(formState.errors.completedDate)}
                                                                        value={formState.values.completedDate}
                                                                        onChange={handleChange}
                                                                    />
                                                            </div>
                                                        <div className='input_box flex flex-col sm:w-2/4'>
                                                            <label className='text-base my-2 font-bold text-darkTextColor flex' htmlFor=''>
                                                                    Actual Time(HH:MM)
                                                            </label>
                                                                <FloatingTextfield
                                                                    type='text'
                                                                    name={'actualHours'}
                                                                    error={hasError('actualHours')}
                                                                    errorMsg={displayErrorMessage(formState.errors.actualHours)}
                                                                    value={formState.values.actualHours}
                                                                    onChange={handleChange}
                                                                />
                                                        </div>
                                                        </>

                                                    ) : (
                                                        <>                                                            <div className='input_box flex flex-col sm:w-1/2'>
                                                                <label className='text-base my-2 font-bold text-darkTextColor flex' htmlFor=''>
                                                                        Estimated Time(HH:MM) <CgAsterisk color='red' />{' '}
                                                                </label>
                                                                    <FloatingTextfield
                                                                        type='text'
                                                                        name={'estimationTime'}
                                                                        error={hasError('estimationTime')}
                                                                        errorMsg={displayErrorMessage(formState.errors.estimationTime)}
                                                                        value={formState.values.estimationTime}
                                                                        onChange={handleChange}
                                                                    />
                                                            </div>
                                                            <div className='input_box flex flex-col sm:w-1/2'>
                                                                <label className='text-base my-2 font-bold text-darkTextColor flex' htmlFor=''>
                                                                        Actual Time(HH:MM)
                                                                </label>
                                                                    <FloatingTextfield
                                                                        type='text'
                                                                        name={'actualHours'}
                                                                        error={hasError('actualHours')}
                                                                        errorMsg={displayErrorMessage(formState.errors.actualHours)}
                                                                        value={formState.values.actualHours}
                                                                        onChange={handleChange}
                                                                    />
                                                            </div>
                                                            </>
                                                    )}
                                                    </div>

                                                {/* ----------------------------------------- */}
                                                <div className='sm:flex flex-col'>
                                                    <div className='input_box flex flex-col sm:w-full'>
                                                    {/* <b><LabelWithRefresh label={'Filter by Group'} onClick={handleGetAllGroup} /></b> */}
                                                        <label className='text-base my-2 font-bold text-darkTextColor flex' htmlFor=''>
                                                                Filter by Group
                                                        </label>
                                                            <MultiSelectDropDown
                                                                handleChangeMultiSelector={handleChangeMultiSelector}
                                                                value={formState.values.group}
                                                                name={'group'}
                                                                selectedValues={formState.values.group}
                                                                option={groupList}
                                                                label={undefined}
                                                                error={undefined}
                                                                type={undefined}
                                                            />
                                                    </div>
                                                    <div className='flex flex-col sm:w-full'>
                                                    {/* <b><LabelWithRefresh label={' Subtask Assigned To'} onClick={handleGetAllUsers} /></b> */}
                                                        <label className='text-base my-2 font-bold text-darkTextColor flex' htmlFor=''>
                                                                Subtask Assigned To
                                                        </label>
                                                            <MultiSelectDropDown
                                                                handleChangeMultiSelector={handleChangeMultiSelector}
                                                                name={'subTaskAssignedTo'}
                                                                option={users?.filter(function (d) {
                                                                    return d.role === 'member';
                                                                })}
                                                                value={formState.values.subTaskAssignedTo}
                                                                selectedValues={formState.values.subTaskAssignedTo}
                                                                type={undefined}
                                                                label={undefined}
                                                                error={undefined}
                                                            />
                                                    </div>
                                                </div>
                                                <div className='sm:flex flex-col'>
                                                <div className='input_box flex flex-col sm:w-full'>
                                                        <label className='text-base my-2 font-bold text-darkTextColor flex' htmlFor=''>
                                                            Select Role (optional)
                                                        </label>
                                                        <FloatingSelectfield 
                                                            optionsGroup={roleList} 
                                                            name={'category'} 
                                                            value={selectedRole} 
                                                            onChange={handleChangeRole} />
                                                    </div>
                                                    <div className='input_box flex flex-col sm:w-full'>
                                                        <label className='text-base my-2 font-bold text-darkTextColor flex' htmlFor=''>
                                                            Users (optional)
                                                        </label>
                                                            <MultiSelectDropDown
                                                                selectedValues={formState.values.customUsers}
                                                                handleChangeMultiSelector={handleChangeMultiSelector}
                                                                name={'customUsers'}
                                                                option={users?.filter(function (d) {
                                                                    return d.role === selectedRole;
                                                                })}
                                                                value={formState.values.customUsers}
                                                                label={undefined}
                                                                disable={selectedRole ? false : true}
                                                            />
                                                    </div>
                                                    
                                                </div>
                                                {/* ----------------------------------------- */}

                                                <div className='sm:flex items-start gap-10 mt-2'>
                                                    <div className=' w-2/4 m-auto  sm:m-0'>
                                                        <label className='text-base my-2 font-bold text-darkTextColor flex'>Attachment</label>
                                                        <label className='flex sm:h-32 h-24 justify-center w-full h-full px-4 transition bg-white border-[3px] border-dashed rounded-md appearance-none cursor-pointer  focus:outline-none'>
                                                            {filAttachmente ? (
                                                                <span className='items-center w-[8rem] space-x-2  justify-center text-center font-medium text-lightTextColor overflow-x-hidden flex flex-col'>
                                                                    {filAttachmente}
                                                                </span> 
                                                            ) : tinySpinner === true ? (
                                                                <TinnySpinner />
                                                            ) : (
                                                                <span className='items-center space-x-2  justify-center text-center font-medium text-lightTextColor flex flex-col'>
                                                                    <svg
                                                                        xmlns='http://www.w3.org/2000/svg'
                                                                        className='w-6 h-6 text-lightTextColor'
                                                                        fill='none'
                                                                        viewBox='0 0 24 24'
                                                                        stroke='currentColor'
                                                                        strokeWidth='2'>
                                                                        <path
                                                                            strokeWidth='round'
                                                                            strokeLinejoin='round'
                                                                            d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
                                                                        />
                                                                    </svg>
                                                                    {subtaskType === 'edit' ? (
                                                                        <span className='font-medium text-lightTextColor flex flex-col'>
                                                                            Drag & drop to upload,
                                                                            <span className='text-blueColor '>or browse</span>
                                                                        </span>
                                                                    ) : (
                                                                        <span className='font-medium text-lightTextColor flex flex-col'>
                                                                            You can add the Attachment Once Task is Created
                                                                            <span className='text-blueColor '>in the Edit SubTask.</span>
                                                                        </span>
                                                                    )}
                                                                </span>
                                                            )}
                                                            <input
                                                                type='file'
                                                                name='attachment'
                                                                className='hidden'
                                                                disabled={subtaskType === 'edit' ? false : true}
                                                                multiple
                                                                onChange={event => {
                                                                    handleFileUploadInPublic(event);
                                                                }}
                                                            />
                                                        </label>
                                                    </div>
                                                    <div className='flex flex-col sm:w-2/4'>
                                                        <div className='flex flex-col '>
                                                            <label className='text-base my-2 font-bold text-darkTextColor flex' htmlFor=''>
                                                                Epic Link <span className='text-base'>(optional)</span>{' '}
                                                            </label>
                                                                {' '}
                                                                <FloatingTextfield
                                                                    formate='array'
                                                                    type='text'
                                                                    name={'epicLink'}
                                                                    error={hasError('epicLink')}
                                                                    errorMsg={displayErrorMessage(formState.errors.epicLink)}
                                                                    value={formState.values.epicLink}
                                                                    onChange={handleEpicLink}
                                                                />
                                                        </div>
                                                        <div className='input_box'>
                                                            <label htmlFor='' className='text-base my-2 font-bold text-darkTextColor flex'>
                                                                     Priority <CgAsterisk color='red' />{' '}
                                                            </label>
                                                            <div className='sm:flex items-center mt-2 '>
                                                                <div className='flex items-center sm:px-0 px-2 '>
                                                                    <input
                                                                        className='cursor-pointer h-5 w-5'
                                                                        type='radio'
                                                                        name='priority'
                                                                        id='high'
                                                                        value={'High'}
                                                                        onChange={handleChange}
                                                                        checked={formState.values.priority == 'High'}
                                                                    />
                                                                    <label htmlFor='high' className='text-base px-2 w-full text-[#FC4343] cursor-pointer'>
                                                                        High
                                                                    </label>
                                                                </div>
                                                                <div className='flex items-center sm:px-2 px-2 '>
                                                                    <input
                                                                        className='cursor-pointer h-5 w-5'
                                                                        type='radio'
                                                                        name='priority'
                                                                        id='Medium'
                                                                        value={'Medium'}
                                                                        onChange={handleChange}
                                                                        checked={formState.values.priority == 'Medium'}
                                                                    />
                                                                    <label htmlFor='medium' className='text-base px-2 w-full  text-[#F4B968] cursor-pointer'>
                                                                        Medium
                                                                    </label>
                                                                </div>
                                                                <div className='flex items-center sm:px-2 px-2 '>
                                                                    <input
                                                                        className='cursor-pointer h-5 w-5'
                                                                        type='radio'
                                                                        name='priority'
                                                                        id='Low'
                                                                        value={'Low'}
                                                                        onChange={handleChange}
                                                                        checked={formState.values.priority == 'Low'}
                                                                    />
                                                                    <label htmlFor='low' className='text-base w-full px-2 text-[#66CDDA] cursor-pointer'>
                                                                        Low
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='flex py-4 items-center justify-between gap-4 text-base'>
                                                    {Cookies.get('isAdmin') === 'true' || permission&&permission?.upload?.view === true ? (
                                                    formState?.values?.attachment?.length
                                                        ? formState?.values?.attachment?.map((data, index) => (
                                                            <>
                                                              <div className='attachment-thumbnail w-[36%]' key={index}>
                                                                  <a
                                                                      className='attachment-thumbnail-preview js-open-viewer '
                                                                      href={data}
                                                                      target='_blank'
                                                                      title={typeof data === 'string'&&data?.substring(data?.lastIndexOf('/') + 1)}
                                                                      rel='noreferrer nofollow noopener'>
                                                                       {data?.endsWith('.jpg') || data?.endsWith('.png') || data?.endsWith('.jpeg') ? (
                                                                        <img src={data} alt="thumbnail" className="attachment-thumbnail-preview-ext bg-contain" />
                                                                        ) : (
                                                                            <span className="attachment-thumbnail-preview-ext">{data?.substring(data?.lastIndexOf('.') + 1)}</span>
                                                                        )}
                                                                  </a>
                                                              </div>
                                                                  <div className='attachment-thumbnail-details !p-0 js-open-viewer w-[54%] flex items-center gap-2'>
                                                                      <span className='attachment-thumbnail-name'>{data?.substring(data?.lastIndexOf('/') + 1)}</span>
                                                                      <a
                                                                          className='attachment-thumbnail-details-title-action dark-hover js-attachment-action js-direct-link'
                                                                          href={data}
                                                                          target='_blank'
                                                                          rel='noreferrer nofollow noopener'>
                                                                            <AiOutlineLink />
                                                                      </a>
                                                                  </div>
                                                                      <div className='u-block quiet attachment-thumbnail-details-title-options w-[10%]'>
                                                                          <span>
                                                                              <a className='attachment-thumbnail-details-title-options-item dark-hover js-confirm-delete' href='#'>
                                                                                 {Cookies.get('isAdmin') === 'true' || permission&&permission?.upload?.delete === true ? (
                                                                                  <span className='attachment-thumbnail-details-options-item-text border border-red-300 hover:bg-red-500 hover:text-white py-1 px-4 rounded' onClick={() => handleDeleteTaskAttachment(data)}>
                                                                                      Delete
                                                                                  </span>):('')}
                                                                              </a>
                                                                          </span>
                                                                      </div>
                                                            </>
                                                          ))
                                                        : null):('')}
                                                </div>
                                                <div className='float-right sm:mt-8 my-2'>
                                                    <div className='flex items-center sm:gap-5 gap-4 '>
                                                        <div onClick={handleCloseModel} className='hover:text-darkBlue cursor-pointer text-lightTextColor'>
                                                            Cancel
                                                        </div>

                                                        <button
                                                            type='button'
                                                            disabled={!formState.isValid}
                                                            className='small-button items-center xs:w-full flex sm:text-md text-base'
                                                            onClick={handleCreateOrEditSubtask}>
                                                            {subtaskType === 'add' ? ' Create' : subtaskType === 'edit' ? ' Edit' : 'Create'}
                                                            <svg
                                                                xmlns='http://www.w3.org/2000/svg'
                                                                className='h-5 w-5 Sm:h-5 sm:w-5 '
                                                                fill='none'
                                                                viewBox='0 0 24 24'
                                                                stroke='currentColor'
                                                                strokeWidth='2'>
                                                                <path strokeLinecap='round' strokeLinejoin='round' d='M9 5l7 7-7 7' />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* body task popup end here */}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='opacity-25 fixed inset-0 z-40 bg-black' onClick={handleCloseModel}></div>
                    </div>
                </>
            )}
        </>
    );
};
export default createOrEditSubtask;
