/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState ,useMemo} from 'react';
import { AiOutlineEdit } from '@react-icons/all-files/ai/AiOutlineEdit';
import validate from 'validate.js';
import { FloatingSelectfield } from '../../../../components/FloatingSelectfield';
import FloatingTextfield from '../../../../components/FloatingTextfield';
import { TextArea } from '../../../../components/TextArea';
import { displayErrorMessage, formatedDate, openUpgradePlan, uniqueArrays, uniqueMembers } from '../../../../helper/function';
import { updateTask, updateTaskAttachement, updateTaskStatus } from '../api/put';
import toast from '../../../../components/Toster/index';
import { createTaskApi, uploadFilesInGCB } from '../api/post';
import { actualHoursSchema, subTaskDetailsSchema, estimationHoursSchema, requiredSchema, taskTitleSchema } from '../../../../helper/schema';
import MultiSelectDropDown from '../../../../components/MultiSelectDropDown';
import _ from 'lodash';
import moment from 'moment';
import { CgAsterisk } from 'react-icons/cg';
import LabelWithRefresh from '@COMPONENTS/labelWithRefresh';
import { DatasetController } from 'chart.js';
import TinnySpinner from '../../../../components/TinnySpinner';
import Cookies from 'js-cookie';
import { getAllCategory, getAllStages } from '@WORKFORCE_MODULES/config/api/get';
import { idText } from 'typescript';
import { getAllRoles } from '@WORKFORCE_MODULES/members/api/get';
import dynamic from 'next/dynamic';
import { fetchProfile } from '@WORKFORCE_MODULES/admin/api/get';
import ReactQuillTextEditor from '@COMPONENTS/ReactQuillTextEditor';
const createTaskModel = ({ type, handleGetAllUsers, handleGetAllGroup, handleGetAllTask, projectList, taskTypeDetails, data, stopLoading, users, groupList, roleList,stageList,categoryList,projectNames,projectId,handleGetProjectById,statusDetails,handleGetUpdatedData, startLoading}) => {
    
    const initialState = {
        isValid: false,
        values: {
            category: data ? data.category ? data.category : "Default" : 'Default',
            attachment: data ? data.attachment : [],
            epicLink: [],
            dueDate: data ? formatedDate(data.dueDate) : moment(moment()).add(30, 'd').format('YYYY-MM-DD'),
            completedDate: data ? formatedDate(data.completedDate) : moment().format('YYYY-MM-DD'),
            estimationDate: data ? formatedDate(data.estimationDate) : moment().format('YYYY-MM-DD'),
            estimationTime: data ? data.estimationTime : '18:00',
            actualHours: data ? data.actualHours : '00:00',
            taskDetails: data ? data.taskDetails : '',
            reason: data ? data.reason : null,
            stageName: data ? data.stageName? data.stageName: "Default" : 'Default',
            taskTitle: data ? data.taskTitle : null,
            taskType: data ? data.taskType?data.taskType:"Default" : 'Default',
            projectId:data ? data.projectId : null,
            assignedTo: data
                ? data.assignedTo.filter(d => {
                      return d.role === 'member';
                  })
                : [],
            customUsers: data
                ? data.assignedTo.filter(d => {
                      return d.role !== 'member';
                  })
                : [],
            priority: data ? data.priority : null,
            group: data ? data.group : [],
            taskStatus: data ? data.taskStatus : "Todo",
        },
        touched: {},
        errors: {
            attachment: null,
            epicLink: null,
            dueDate: null,
            completedDate: null,
            taskDetails: '',
            reason: null,
            stageName: null,
            taskTitle: null,
            taskType: null,
            projectId: null,
            assignedTo: null,
            estimationTime: null,
            actualHours: null,
            estimationDate: null,
            priority: null,
        },
    };
    const schema = {
        category: requiredSchema,
        taskTitle: taskTitleSchema,
        taskDetails: '',
        dueDate: requiredSchema,
        taskType: requiredSchema,
        priority: requiredSchema,
        estimationDate: requiredSchema,
        estimationTime: estimationHoursSchema,
        actualHours: actualHoursSchema,
        stageName: requiredSchema,
    };
    const [tinySpinner, setTinySpinner] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [filAttachmente, setFileAttachment] = useState(null);
    const [attachments,setAttachment]=useState(data?.attachment);
    const [formState, setFormState] = useState({ ...initialState });
    const [selectedRole, setSelectedRole] = useState('member');
    const [permission, setPermission] = useState(null);

    const handleCloseModel = () => {
        setShowDynamicInput(false);
        setShowModal(false);
        setFormState({ ...initialState });
    };
    useEffect(() => {
        setFormState({ ...initialState });
    }, [data]);
    useEffect(() => {
        const errors = validate(formState.values, schema);
        setFormState(prevFormState => ({
            ...prevFormState,
            isValid: !errors,
            errors: errors || {},
        }));
    }, [formState.values, formState.isValid]);


    const handleChange = event => {
        event?.persist();
        
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
        setFormState((formState) => ({
            ...formState,
            values: {
              ...formState.values,
              [event.target.name]:
                event.target.type === "radio"
                  ? event.target.value
                  : event.target.value,
            },
            touched: {
              ...formState.touched,
              [event.target.name]: true,
            },
          }));
    };

    const handleEpicLink = event =>{

        setFormState(formState => ({
            ...formState,
            values: {
                ...formState.values,
                epicLink: [event.target.value],
            },
        }));
    }
    // const statusDetails = [
    //     { text: "Todo", value: "Todo" },
    //     { text: "Done", value: "Done" },
    //     { text: "Inprogress", value: "Inprogress" },
    //     { text: "Onhold", value: "Onhold" },
    //     { text: "Inreview", value: "Inreview" },
        
    //   ];

    const handleDescription = event =>{

        setFormState(formState => ({
            ...formState,
            values: {
                ...formState.values,
                taskDetails: event,
            },
        }));
    }
    
    const handleChangeRole = e => {
        setSelectedRole(e.target.value);
    };
    const hasError = field => !!(formState.touched[field] && formState.errors[field]);
    const handleFileUploadInPublic = event => {
        setTinySpinner(true);
        const category = 'Task';
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
                                attachment: [...uploadedUrls, ...(data?.attachment || [])],
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
    
    const handleCreateOrEditTask = event => {
        event.persist();
        let assignToObj = formState.values.assignedTo.concat(formState.values.customUsers).map(d => {
            return { id: d._id };
        });
        
        let stateA = []
        let stateB = formState?.values.epicLink
        let stateC= []
        stateA = (data?.epicLink || []).concat(stateB || []);
        stateC = Array.from(new Set(stateA));
        

        let apiData = {
            ..._.omit({ ...formState.values, assignedTo: assignToObj ,epicLink:stateC}, ['group', 'customUsers']),
        };
        delete apiData.id;
        if (type === 'edit') {
            updateTask(data._id, apiData)
                .then(function (result) {
                                        if (result.data && result.data.body.status === 'success') {
                        toast({
                            type: 'success',
                            message: result ? result.data.body.message : 'Try again !',
                        });
                        // handleGetAllTask();
                        handleGetUpdatedData()
                        setShowModal(false);
                    } else {
                        toast({
                            type: 'error',
                            message: result ? result.data.body.message : 'Try again !',
                        });
                    }
                })
                .catch(function (e) {
                    toast({
                        type: 'error',
                        message: e.response ? e.response.data.body.error : 'Something went wrong, Try again !',
                    });
                });
            // handleGetAllTask();
        } else {
            
            if(type === 'projectName'){
                apiData.projectId = projectId;

            }
            
            createTaskApi(apiData)
                .then(function (result) {
                    if (result.data && result.data.body.status === 'success') {
                        toast({
                            type: 'success',
                            message: result ? result.data.body.message : 'Try again !',
                        });
                        // handleGetAllTask();
                        handleGetUpdatedData()
                        setShowModal(false);
                        if(type === 'projectName'){
                            handleGetProjectById('?id='+projectId)
                        }
                    } else {
                        toast({
                            type: 'error',
                            message: result ? result.data.body.message : 'Something went wrong, Try again !',
                        });
                    }
                })
                .catch(function ({ response }) {
                    setShowModal(false);
                    if (response.status === 429) {
                        openUpgradePlan();
                    } else {
                        toast({
                            type: 'error',
                            message: response ? response.data.body.message : 'Something went wrong, Try again !',
                        });
                    }
                    stopLoading();
                });
            // handleGetAllTask();
            setFormState(initialState);
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
                    })
                    .map(d3 => {
                        tempCustomMembers.push(d3);
                    });
            });

            setFormState(formState => ({
                ...formState,
                values: {
                    ...formState.values,
                    assignedTo: uniqueMembers([...formState.values.assignedTo, ...temp]),
                    customUsers: uniqueMembers([...formState.values.customUsers, ...tempCustomMembers]),
                },
            }));
        }
        var finalData = data.map(function (val) {
          return val.value;
        });
           setFormState(formState => {
            const newValues = {
                ...formState.values,
                [name]: finalData,
            };
            return {
                ...formState,
                values: newValues,
                touched: {
                    ...formState.touched,
                    [name]: true,
                },
            }});
    };
    useEffect(() => {
        
 
        type != 'edit' &&
            setFormState({
                isValid: false,
                values: {
                    id: data ? data._id : null,
                    category: data ? data.category : 'Default',
                    attachment: data ? data.attachment : [],
                    epicLink:  [],
                    dueDate: data ? formatedDate(data.dueDate) : moment(moment()).add(30, 'd').format('YYYY-MM-DD'),
                    taskDetails: data ? data.taskDetails : '',
                    reason: data ? data.reason : null,
                    stageName: data ? data.stageName : 'Default',
                    taskTitle: data ? data.taskTitle : null,
                    taskType: data ? data.taskType : 'Default',
                    projectId: data ? data.projectId : null,
                    assignedTo: data
                        ? data.assignedTo.filter(d => {
                              return d.role === 'member';
                          })
                        : [],
                    customUsers: data
                        ? data.assignedTo.filter(d => {
                              return d.role !== 'member';
                          })
                        : [],
                    estimationTime: data ? data.estimationTime : '18:00',
                    actualHours: data ? data.actualHours : '00:00',
                    estimationDate: data ? formatedDate(data.estimationDate) : moment().format('YYYY-MM-DD'),
                    completedDate: data ? formatedDate(data.completedDate) : moment(moment()).add(30, 'd').format('YYYY-MM-DD'),
                    priority: data ? data.priority : 'Low',
                    group: [],
                },
                touched: {},
                errors: {
                    attachment: null,
                    epicLink: null,
                    dueDate: null,
                    taskDetails: '',
                    reason: null,
                    stageName: null,
                    taskTitle: null,
                    taskType: null,
                    projectId: null,
                    assignedTo: null,
                    estimationDate: null,
                    completedDate: null,
                    estimationTime: null,
                    actualHours: null,
                    priority: null,
                },
            });

            handleProfileData();
    }, []);
    const handleDeleteTaskAttachment = deleteData => {
        const attachments = formState?.values?.attachment?.filter(obj => deleteData !== obj);
        updateTaskAttachement({ attachment: attachments }, data?._id).then(response => {
            if (response?.data?.body?.status === 'success') {
                // toast({
                //     type: 'success',
                //     message: response ? response?.data?.body?.message : 'Try again !',
                // });
                setFileAttachment(null)
                handleGetAllTask(`?limit=10`);
            } else {
                toast({
                    type: 'error',
                    message: response ? response?.data?.body?.message : 'Try again !',
                });
            }
        });
    };
    const handleProfileData = () => {
        fetchProfile().then(response => {
            if (response.data?.body.status === 'success') {
                setPermission(response.data.body.data.permissionConfig);
            }
        });
    };
    const DynamicCustomInput =useMemo(()=> dynamic(()=>import('@COMPONENTS/ReactQuillTextEditor'), { ssr: false }),[]);

    const [showDynamicInput, setShowDynamicInput] = useState(false);

  const handleTextAreaClick = () => {
    // Toggle the state to switch between TextArea and DynamicCustomInput
    setShowDynamicInput(!showDynamicInput);
  };
  const displayValue = () => {
    // Use DOMParser to parse HTML and extract text content
    const parser = new DOMParser();
    const parsedHtml = parser.parseFromString(formState.values.taskDetails, 'text/html');
    return parsedHtml.body.textContent || "";
  };
    
    return (
        <>
            {type === 'edit' ? (
                <button
                    className='grey-link mr-4'
                    onClick={() => {
                        setShowModal(true);
                    }}>
                    <AiOutlineEdit />
                </button>
            ) : (
                <button
                    className='small-button items-center xs:w-full py-2 flex h-8'
                    onClick={() => {
                        setShowModal(true);
                    }}>
                    Create
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
                                                <p className='text-darkTextColor sm:text-xl text-2xl font-bold'>{type === 'edit' ? 'Edit Task' : 'Create Task'}</p>
                                                    <label className='text-base my-2 font-bold text-darkTextColor flex' htmlFor=''>
                                                            Required Fileds are marked with an asterisk <CgAsterisk color='red' />
                                                        </label>

                                                <div className='sm:flex gap-5 items-center justify-between'>

                                                    <div className='input_box sm:w-2/4'>
                                                        <label className='text-base my-2 font-bold text-darkTextColor flex' htmlFor=''>
                                                            Project <span className='text-base'>(optional)</span>{' '}
                                                        </label>
                                                            <FloatingSelectfield
                                                                label={type === 'projectName'?projectNames:'Select the project'}
                                                                optionsGroup={projectList}
                                                                name={'projectId'}
                                                                value={formState.values.projectId || ''}
                                                                onChange={handleChange}
                                                                error={hasError('projectId')}
                                                                errorMsg={displayErrorMessage(formState.errors.projectId)}
                                                            />
                                                    </div>

                                                    <div className='input_box sm:w-2/4'>
                                                        <label className='text-base my-2 font-bold text-darkTextColor flex' htmlFor=''>
                                                                Category<CgAsterisk color='red' />
                                                        </label>
                                                            <FloatingSelectfield
                                                                label={'Select the Category '}
                                                                optionsGroup={categoryList}
                                                                name={'category'}
                                                                value={formState.values.category || ''}
                                                                onChange={handleChange}
                                                                error={hasError('category')}
                                                                errorMsg={displayErrorMessage(formState.errors.category)}
                                                            />
                                                    </div>
                                                </div>

                                                <div className='input_box flex flex-col'>
                                                    <label className='text-base my-2 font-bold text-darkTextColor flex' htmlFor=''>
                                                            Task title <CgAsterisk color='red' /> <span className='text-base'>(upto 100 characters)</span>{' '}
                                                    </label>
                                                        <FloatingTextfield
                                                            type='text'
                                                            placeholder={'task nnnn'}
                                                            label={''}
                                                            error={hasError('taskTitle')}
                                                            errorMsg={displayErrorMessage(formState.errors.taskTitle)}
                                                            name='taskTitle'
                                                            value={formState.values.taskTitle || ''}
                                                            onChange={handleChange}
                                                        />
                                                </div>

                                                <div className='input_box flex flex-col'>
                                                    <label className='text-base my-2 font-bold text-darkTextColor flex'>
                                                            Task details
                                                    </label>
                                                   
                                                     {showDynamicInput ? (

                                                    <DynamicCustomInput 
                                                    type='text'
                                                    name='taskDetails'
                                                    value={formState.values.taskDetails || ''}
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
                                                        Task Status <CgAsterisk color='red' />
                                                        </label>
                              
                                                        <FloatingSelectfield
                                                        label={""}
                                                        optionsGroup={ 
                                                            statusDetails && statusDetails.map(d=>{ 
                                                                return { text: d.taskStatus, value: d.taskStatus }
                                                            })
                                                        }
                                                        name={"taskStatus"}
                                                        value={type === "edit" ?formState?.values?.taskStatus:'Todo'}
                                                        disabled={type === "edit" ?false:true}
                                                        onChange={(event) =>
                                                        handleChange(event)
                                                        }
                                                        />
                                                </div>                                                {type === "edit" && new Date() > new Date(formState.values.dueDate) ? (
                                                <div className='input_box flex flex-col'>
                                                    <label className='text-base my-2 font-bold text-darkTextColor flex'>
                                                            Reason{' '}
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
                                                    <div className='flex flex-col sm:w-2/4'>
                                                        <label className='text-base my-2 font-bold text-darkTextColor flex' htmlFor=''>
                                                                Stage <CgAsterisk color='red' />{' '}
                                                        </label>
                                                            <FloatingSelectfield
                                                                label={''}
                                                                optionsGroup={stageList}
                                                                name={'stageName'}
                                                                value={formState.values.stageName || ''}
                                                                onChange={handleChange}
                                                                error={hasError('stageName')}
                                                                errorMsg={displayErrorMessage(formState.errors.stageName)}
                                                            />
                                                    </div>
                                                    <div className='input_box flex flex-col sm:w-2/4'>
                                                        <label className='text-base my-2 font-bold text-darkTextColor flex' htmlFor=''>
                                                                Task type <CgAsterisk color='red' />{' '}
                                                        </label>
                                                            <FloatingSelectfield
                                                                label={'Select the taskType '}
                                                                optionsGroup={taskTypeDetails}
                                                                name={'taskType'}
                                                                value={formState.values.taskType || ''}
                                                                onChange={handleChange}
                                                                error={hasError('taskType')}
                                                                errorMsg={displayErrorMessage(formState.errors.taskType)}
                                                            />
                                                    </div>
                                                </div>
                                                <div className='sm:flex gap-10 items-center'>
                                                <div className='flex flex-col w-full TaskManageLabel'>
                                               {/* <b><LabelWithRefresh label={'Assigned To Members'} onClick={handleGetAllUser} /></b> */}
                                                        <label className='text-base my-2 font-bold text-darkTextColor flex' htmlFor=''>
                                                        Estimated Efforts Date  <CgAsterisk color='red' />
                                                        </label>
                                                            <FloatingTextfield
                                                                type='date'
                                                                min={formState.values.estimationDate || ''}
                                                                name={'estimationDate'}
                                                                error={hasError('estimationDate')}
                                                                errorMsg={displayErrorMessage(formState.errors.estimationDate)}
                                                                value={formState.values.estimationDate + ''}
                                                                onChange={handleChange}
                                                            />
                                                    </div>
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
                                                                errorMsg={displayErrorMessage(formState.errors.dueDate)}
                                                            />
                                                    </div>
                                                </div>
                                                    {type === 'edit' ? (
                                                        <div className='sm:flex gap-5 items-center'>
                                                        <div className='input_box flex flex-col sm:w-2/4'>
                                                        <label className='text-base my-2 font-bold text-darkTextColor flex' htmlFor=''>
                                                                Completed date
                                                        </label>
                                                            <FloatingTextfield
                                                                type='date'
                                                                min={formState.values.estimationDate || ''}
                                                                name={'completedDate'}
                                                                value={formState.values.completedDate}
                                                                onChange={handleChange}
                                                                error={hasError('completedDate')}
                                                                errorMsg={displayErrorMessage(formState.errors.completedDate)}
                                                            />
                                                    </div>
                                                        <div className='input_box flex flex-col sm:w-2/4'>
                                                            <label className='text-base my-2 font-bold text-darkTextColor flex' htmlFor=''>
                                                                    Actual Time (HH:MM)
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
                                                        </div>
                                                    ) : (
                                                        <div className='sm:flex gap-5 items-center'>
                                                            <div className='input_box flex flex-col sm:w-2/4'>
                                                                <label className='text-base py-2 text-darkTextColor' htmlFor=''>
                                                                    <div className='flex flex-row'>
                                                                        <b>Estimated Time (HH:MM)</b> <CgAsterisk color='red' />{' '}
                                                                    </div>
                                                                    {/* <span className="text-base">(optional)</span> */}
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
                                                            <div className='input_box flex flex-col sm:w-2/4'>
                                                                <label className='text-base py-2 text-darkTextColor' htmlFor=''>
                                                                    <div className='flex flex-row'>
                                                                        <b> Actual Time(HH:MM)</b>
                                                                    </div>
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
                                                        </div>
                                                    )}

                                                {/* ----------------------------------------- */}
                                                <div className='sm:flex flex-col items-center'>
                                                    <div className='input_box flex flex-col sm:w-full'>
                                                        {/* <b><LabelWithRefresh label={'Filter by Group'} onClick={handleGetAllGroup} /></b> */}
                                                        <label className='text-base py-2 text-darkTextColor' htmlFor=''>
                                                            <div className='flex flex-row'>
                                                                <b>Filter by Group</b>
                                                            </div>
                                                        </label>
                                                        <div className=''>
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
                                                    </div>
                                                    <div className='flex flex-col sm:w-full'>
                                                        {/* <b><LabelWithRefresh label={'Assign Members'} onClick={handleGetAllUsers} /></b> */}
                                                        <label className='text-base py-2 text-darkTextColor' htmlFor=''>
                                                            <div className='flex flex-row'>
                                                                <b>Assign Members</b>
                                                            </div>
                                                        </label>
                                                        <div className=''>
                                                            <MultiSelectDropDown
                                                                handleChangeMultiSelector={handleChangeMultiSelector}
                                                                name={'assignedTo'}
                                                                option={users.filter(
                                                                d =>
                                                                        d.role === 'member' &&
                                                                        !formState.values.customUsers.some(u => u._id === d._id)
                                                                )}
                                                                value={formState.values.assignedTo}
                                                                selectedValues={formState.values.assignedTo}
                                                                label={undefined}
                                                                error={undefined}
                                                                type={undefined}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='sm:flex flex-col items-center'>
                                                <div className='input_box flex flex-col sm:w-full'>
                                                        <label className='text-base py-2 text-darkTextColor' htmlFor=''>
                                                            <b>Select Role</b> (optional)
                                                        </label>

                                                        <div className=''>
                                                            <FloatingSelectfield optionsGroup={roleList} name={'category'} value={selectedRole} onChange={handleChangeRole} />
                                                        </div>
                                                    </div>
                                                    <div className='flex flex-col sm:w-full'>
                                                        <label className='text-base py-2 text-darkTextColor' htmlFor=''>
                                                            <b>Users</b> (optional)
                                                        </label>

                                                        <div className=''>
                                                            <MultiSelectDropDown
                                                                selectedValues={formState.values.customUsers}
                                                                handleChangeMultiSelector={handleChangeMultiSelector}
                                                                name={'customUsers'}
                                                                option={users.filter(
                                                                d =>
                                                                    d.role === selectedRole &&
                                                                    !formState.values.assignedTo.some(u => u._id === d._id)
                                                                 )}
                                                                value={formState.values.customUsers}
                                                                label={undefined}
                                                                disable={selectedRole ? false : true}
                                                            />
                                                        </div>
                                                    </div>

                                                </div>
                                                {/* ----------------------------------------- */}
                                                <div className='sm:flex items-start gap-5 mt-2'>
                                                    <div className=' w-2/4 m-auto  sm:m-0'>
                                                        <p className='text-base pb-2 font-bold text-darkTextColor'>Attachment</p>
                                                        <label className='flex sm:h-32 h-24 justify-center w-full h-full px-4 transition bg-white border-[3px] border-dashed rounded-md appearance-none cursor-pointer  focus:outline-none'>
                                                            {filAttachmente ? (
                                                                <span className='items-center space-x-2  justify-center text-center font-medium text-lightTextColor overflow-x-hidden flex flex-col'>
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
                                                                    {type === 'edit' ? (
                                                                        <span className='font-medium text-lightTextColor flex flex-col'>
                                                                            Drag & drop to upload,
                                                                            <span className='text-blueColor '>or browse</span>
                                                                        </span>
                                                                    ) : (
                                                                        <span className='font-medium text-lightTextColor flex flex-col'>
                                                                            You can add the Attachment Once Task is Created
                                                                            <span className='text-blueColor '>in the Edit Task.</span>
                                                                        </span>
                                                                    )}
                                                                </span>
                                                            )}
                                                            <input
                                                                type='file'
                                                                name='attachment'
                                                                className='hidden'
                                                                disabled={type === 'edit' ? false : true}
                                                                multiple 
                                                                onChange={event => {
                                                                    handleFileUploadInPublic(event);
                                                                }}
                                                            />
                                                        </label>
                                                    </div>

                                                    <div className='flex flex-col sm:w-2/4'>
                                                        <div className='flex flex-col '>
                                                            <label className='text-base pb-2 text-darkTextColor' htmlFor=''>
                                                                <b>Epic Link</b> <span className='text-base'>(optional)</span>{' '}
                                                            </label>
                                                            <div className='TaskManageLabel'>
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
                                                        </div>
                                                        <div className=''>
                                                            <label htmlFor='' className='text-base text-darkTextColor '>
                                                                <div className='flex flex-row'>
                                                                    <b> Priority</b> <CgAsterisk color='red' />{' '}
                                                                </div>
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
                                                <div className='flex flex-col py-4 items-center justify-between gap-4 text-base w-full'>
                                                    {Cookies.get('isAdmin') === 'true' || (permission&&permission?.upload?.view === true) ? (
                                                    formState?.values?.attachment?.length
                                                        ? formState?.values?.attachment?.map((data, index) => (
                                                            <>
                                                            <div className='flex items-center gap-4 justify-between w-full'>

                                                           
                                                              <div className='attachment-thumbnail w-[20%] h-[6rem] bg-blue-200 flex items-center justify-center' key={index}>
                                                                  <a
                                                                      className='attachment-thumbnail-preview js-open-viewer'
                                                                      href={data}
                                                                      target='_blank'
                                                                      title={data?.substring(data?.lastIndexOf('/') + 1)}
                                                                      rel='noreferrer nofollow noopener'>
                                                                       {data?.endsWith('.jpg') || data?.endsWith('.png') || data?.endsWith('.jpeg') ? (
                                                                        <img src={data} alt="thumbnail" className="attachment-thumbnail-preview-ext w-full bg-cover" />
                                                                        ) : (
                                                                            <span className="attachment-thumbnail-preview-ext w-full ">{data?.substring(data?.lastIndexOf('.') + 1)}</span>
                                                                        )}
                                                                  </a>
                                                              </div>
                                                                  <div className='attachment-thumbnail-details js-open-viewer !p-0 js-open-viewer w-[60%] flex items-center gap-2'>
                                                                      <span className='attachment-thumbnail-name'>{data?.substring(data?.lastIndexOf('/') + 1)}</span>
                                                                      <a
                                                                          className='attachment-thumbnail-details-title-action dark-hover js-attachment-action js-direct-link'
                                                                          href={data}
                                                                          target='_blank'
                                                                          rel='noreferrer nofollow noopener'>
                                                                          <span className='icon-sm icon-external-link'></span>
                                                                      </a>
                                                                  </div>
                                                                      <div className='u-block quiet attachment-thumbnail-details-title-options float-right  w-[10%]'>
                                                                          <span>
                                                                              <a className='attachment-thumbnail-details-title-options-item dark-hover js-confirm-delete' href='#'>
                                                                                 {Cookies.get('isAdmin') === 'true' || permission&&permission?.upload?.delete === true ? (
                                                                                  <span className='attachment-thumbnail-details-options-item-text  border border-red-300 hover:bg-red-500 dark:text-gray-50 hover:text-white py-1 px-4 rounded' onClick={() => handleDeleteTaskAttachment(data)}>
                                                                                      Delete
                                                                                  </span>):('')}
                                                                              </a>
                                                                          </span>
                                                                      </div>
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
                                                        {/* <button className="small-button-2 hover:border sm:px-8 px-2 py-1">
                              Save
                            </button> */}
                                                        <button
                                                            type='button'
                                                            disabled={!formState.isValid}
                                                            className='small-button items-center xs:w-full flex sm:text-md text-base'
                                                            onClick={handleCreateOrEditTask}>
                                                            {type === 'edit' ? 'Edit' : 'Create'}
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
export default createTaskModel;
