import React, { useEffect, useState ,useMemo} from 'react';
import validate from 'validate.js';
import { useRouter } from 'next/router';
import moment from 'moment';
import toast from '../../../../components/Toster';
import { createTaskApi, uploadFilesInGCB } from '../api/post';
import { CgAsterisk } from 'react-icons/cg';
import { actualHoursSchema, subTaskDetailsSchema, estimationHoursSchema, requiredSchema, taskTitleSchema } from '@HELPER/schema';
// import { stageList } from '@HELPER/exportData';
import { FloatingSelectfield } from '@COMPONENTS/FloatingSelectfield';
import FloatingTextfield from '@COMPONENTS/FloatingTextfield';
import MultiSelectDropDown from '@COMPONENTS/MultiSelectDropDown';
import { TextArea } from '@COMPONENTS/TextArea';
import { displayErrorMessage, uniqueArrays, uniqueMembers,openUpgradePlan } from '@HELPER/function';
import { getAllCategory, getAllTaskType } from '@WORKFORCE_MODULES/config/api/get';
import { getAllRoles, getAllUsers } from '@WORKFORCE_MODULES/members/api/get';
import { getAllProject } from '@WORKFORCE_MODULES/projects/api/get';
import { getAllGroups } from '@WORKFORCE_MODULES/groups/api/get';
import LabelWithRefresh from '@COMPONENTS/labelWithRefresh';
import { getAllStages } from '@WORKFORCE_MODULES/config/api/get';
import _ from 'lodash';
import { fetchProfile } from '@WORKFORCE_MODULES/admin/api/get';
import dynamic from 'next/dynamic';
import NoAccessCard from '@COMPONENTS/NoAccessCard';
import Cookies from 'js-cookie';
import NoSsr from '@COMPONENTS/NoSsr';
function CreateTask({ startLoading, stopLoading }) {
    const [filAttachment, setFileAttachment] = useState(null);
    const [categoryList, setCategoryList] = useState(null);
    const [roleList, setRoleList] = useState(null);
    const [groupList, setGroupList] = useState([]);
    const [projectList, setProjectList] = useState(null);
    const router = useRouter();
    const [taskTypeDetails, setTaskTypeDetails] = useState(null);
    const [userObject, setUserObject] = useState([]);
    const [selectedRole, setSelectedRole] = useState("member");
    const [permission, setPermission] = useState(null);

    const handleFileUploadInPublic = event => {
        event.persist(event.target.files[0]);
        var formData = new FormData();
        let file = event.target.files[0];
        const MAX_FILE_SIZE = 10 * 1024 * 1024;
        if (file.size <= MAX_FILE_SIZE) {
        formData.append('files', event.target.files[0]);
        uploadFilesInGCB(formData).then(response => {
            setFileAttachment(event.target.files[0].name);
            if (response.data.code === 200) {
                setFormState(formState => ({
                    ...formState,
                    values: {
                        ...formState.values,
                        attachment: [response.data.data.filesUrls[0].url],
                    },
                    touched: {
                        ...formState.touched,
                        attachment: true,
                    },
                }));
            }
        });
        
    } else {
        toast({
            type: 'warning',
            message: 'File Size should be less than 10MB !',
        });
      }
    };
    const [stageList, setStageList] = useState(null);
    const handleGetAllStage = () => {
        getAllStages().then(response => {
            if (response.data.body.status === 'success') {
                setStageList(
                    response.data.body.data.stage.map(d => {
                        return { text: d.taskStage, value: d.taskStage };
                    })
                );
            }
        });
    };
    const handleProfileData = () => {
        fetchProfile().then(response => {
            if (response.data?.body.status === 'success') {
                setPermission(response.data.body.data.permissionConfig);
            }
        });
    }

    const handleGetAllCategory = () => {
        getAllCategory().then(response => {
            if (response.data.body.status === 'success') {
                setCategoryList(
                    response.data.body.data.category.map(d => {
                        return { text: d.taskCategory, value: d.taskCategory };
                    })
                );
            }
        });
    };
    const initialState = {
        isValid: false,
        values: {
            taskStatus: 'Todo',
            category: 'Default',
            estimationTime: '18:00',
            actualHours: '00:00',
            estimationDate: moment().format('YYYY-MM-DD'),
            dueDate: moment(moment()).add(30, 'd').format('YYYY-MM-DD'),
            attachment: [],
            epicLink: [],
            group: [],
            taskDetails: null,
            stageName: 'Default',
            taskTitle: null,
            taskType: 'Default',
            projectId: null,
            assignedTo: [],
            customUsers: [],
            priority: 'Low',
        },
        touched: {},
        errors: {
            attachment: null,
            epicLink: null,
            dueDate: null,
            taskDetails: null,
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
        taskDetails: null,
        dueDate: requiredSchema,
        taskType: requiredSchema,
        priority: requiredSchema,
        estimationDate: requiredSchema,
        estimationTime: estimationHoursSchema,
        actualHours: actualHoursSchema,
    };
    const [formState, setFormState] = useState({ ...initialState });
    const handleChangeMultiSelector = (data, name, type) => {
        if (name === 'group' && type === 'select') {
            let temp = [];
            let tempCustomMembers = [];

            data.map(function (d1) {
                d1.value.assignedMembers
                    .filter(d2 => {
                        return d2.role === 'member';
                    }).map(d3 => {
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
                    assignedTo: uniqueMembers([...formState.values.assignedTo, ...temp]),
                    customUsers: uniqueMembers([...formState.values.customUsers, ...tempCustomMembers]),
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
    const handleGetAllUser = (condition = '') => {
        getAllUsers(condition).then(response => {
            if (response.data.body.status === 'success') {
                setUserObject(
                    response.data.body?.data?.users?.map(data => {
                        return { id: data._id, role: data.role, key: data.firstName + ' ' + data.lastName, value: data };
                    })
                );
            }
        });
    };
    const handleGetAllGroup = () => {
        getAllGroups("?limit=20").then(response => {
            if (response.data.body.status === 'success') {
                setGroupList(
                    response.data.body.data.groupDetails.map(function (item) {
                        return {
                            id: item._id,
                            key: item.groupName,
                            value: item,
                        };
                    })
                );
            }
        });
    };
    const handleGetAllRoles = () => {
        getAllRoles().then(response => {
            if (response.data.body.status === 'success') {
                setRoleList(
                    response.data.body.data.totalRolesData.map(data => {
                        return {text: data.roles, value: data.roles }
                    })
                );
                
            }
        });
    };
    useEffect(() => {
        if(permission?.task.create === true|| Cookies.get("isAdmin")){
            handleGetAllTaskType();
            handleGetAllUser('?limit='+process.env.TOTAL_USERS+'&invitationStatus=1&suspensionStatus=false');
            handleGetAllGroup();
            handleGetAllCategory();
            handleGetAllRoles();
            handleGetAllStage();
        }
        if(Cookies.get("isAdmin") === "false"){
            handleProfileData();
        }
    }, []);
    useEffect(() => {
        const errors = validate(formState.values, schema);
        setFormState(prevFormState => ({
            ...prevFormState,
            isValid: !errors,
            errors: errors || {},
        }));
    }, [formState.values, formState.isValid]);
    const handleGetAllTaskType = () => {
        getAllTaskType().then(response => {
            if (response.data.body.status === 'success') {
                setTaskTypeDetails(
                    response.data.body.data.data.map(d => {
                        return { text: d.taskType, value: d.taskType };
                    })
                );
            }
        });
    };
    useEffect(() => {
        // document.querySelector('body').classList.add('bg-slate-50');
    }, [projectList]);
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
                taskDetails: event,
            },
        }));
    }
    const handleChangeRole = (e) =>{
        setSelectedRole(e.target.value);
    }
    useEffect(() => {
        if(permission?.task.create === true || Cookies.get("isAdmin")){
            getAllProject(`?limit=${process.env.TOTAL_USERS}`).then(response => {
                if (response.data?.body.status === 'success') {
                    var projectList = response.data?.body.data.project.map(function (project) {
                        return {
                            text: project.projectName,
                            value: project._id,
                        };
                    });
                    setProjectList(projectList);
                }
            });
        }
    }, []);
    const handleCreateTask = event => {
        event.persist();
        let assignToObj = formState.values.assignedTo.concat(formState.values.customUsers).map(d => {
            return { id: d._id };
        });
        let apiData = {
            ..._.omit({ ...formState.values, assignedTo: assignToObj }, ['group','customUsers']),
        };
        createTaskApi(apiData)
            .then(function (result) {
                if (result.data && result.data.body.status === 'success') {
                    toast({
                        type: 'success',
                        message: result ? result.data.body.message : 'Try again !',
                    });
                    setShowDynamicInput(false);
                    setTimeout(() => {
                        router.push('/w-m/tasks/all');
                    }, 2000);
                } 
                else if(result.data.body.error === '\"assignedTo[3]\" contains a duplicate value' ){
                    toast({
                        type: 'error',
                        message: 'Please dont duplicate users',
                    });
                }
                else {
                    toast({
                        type: 'error',
                        message: result ? result.data.body.message : 'Error',
                    });
                }
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
                stopLoading();
            });
    };
    const hasError = field => !!(formState.touched[field] && formState.errors[field]);
    const DynamicCustomInput =useMemo(()=> dynamic(()=>import('@COMPONENTS/ReactQuillTextEditor'), { ssr: false }),[]);

    const [showDynamicInput, setShowDynamicInput] = useState(false);

    const handleTextAreaClick = () => {
      // Toggle the state to switch between TextArea and DynamicCustomInput
      setShowDynamicInput(!showDynamicInput);
    };
    

    return (
        <>
            <div className='font-inter -mt-8 mb-4'>
                <div className='heading-big text-darkTextColor font-semibold'>Create Task</div>
                <div className='card mb-4'>
                {permission && permission.task.create === false ? <NoAccessCard /> :
                <div className=' relative'>
                <div className='md:col-span-8 col-span-12'>
                    {/* <div className=" w-full heading-medium ">Enter details</div> */}
                        <label className='text-base my-2 font-bold text-darkTextColor flex' htmlFor=''>
                            Required Fileds are marked with an asterisk <CgAsterisk color='red' />
                            </label>
                    <div className='sm:flex flex-wrap lg:flex-nowrap items-center gap-5'>
                        <div className='flex flex-col w-full lg:w-1/3'>
                            <label className='text-base my-2 font-bold text-darkTextColor flex' htmlFor=''>
                                Project <span className='text-base'>(optional)</span>{' '}
                            </label>
                                <FloatingSelectfield
                                    label={'Select the project'}
                                    optionsGroup={projectList}
                                    name={'projectId'}
                                    value={formState.values.projectId || ''}
                                    onChange={handleChange}
                                    error={hasError('projectId')}
                                    errorMsg={displayErrorMessage(formState.errors.projectId)}
                                />
                        </div>
                        <div className='flex flex-col w-full  lg:w-1/3'>
                            <label className='text-base my-2 font-bold text-darkTextColor flex' htmlFor=''>
                                 Category <CgAsterisk color='red' />{' '}
                            </label>
                                <FloatingSelectfield
                                    label={'Select the catagory '}
                                    optionsGroup={categoryList}
                                    name={'category'}
                                    value={formState.values.category || ''}
                                    onChange={handleChange}
                                    error={hasError('category')}
                                    errorMsg={displayErrorMessage(formState.errors.category)}
                                />
                        </div>
                        <div className='input_box flex flex-col w-full lg:w-1/3'>
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
                    <div className='mt-2 taskTextArea min-w-fit'>
                            <label className='text-base my-2 font-bold text-darkTextColor flex' htmlFor=''>
                                Task Title <CgAsterisk color='red' /> <span className='text-base'>(upto 100 characters)</span>{' '}
                        </label>
                        <FloatingTextfield
                            name={'taskTitle'}
                            error={hasError('taskTitle')}
                            errorMsg={displayErrorMessage(formState.errors.taskTitle)}
                            value={formState.values.taskTitle}
                            onChange={handleChange}
                        />
                    </div>
                    <div className='mt-2 taskTextArea dark:text-gray-50'>
                    <label className='text-base my-2 font-bold text-darkTextColor flex' htmlFor=''>
                                Task detail
                        </label>
                        {/* <TextArea
                            type='text'
                            label={''}
                            error={hasError('taskDetails')}
                            errorMsg={displayErrorMessage(formState.errors.taskDetails)}
                            name='taskDetails'
                            value={formState.values.taskDetails || ''}
                            onChange={handleChange}
                        /> */}
                        {/* <NoSsr> */}
                        {showDynamicInput ? (
                        <DynamicCustomInput 
                        type='text'
                        name='taskDetails'
                        value={formState.values.taskDetails || ''}
                        onChange={handleDescription}
                        />):(
                        <div onClick={handleTextAreaClick}>
                        <TextArea
                        type='text'
                        name='taskDetails'
                        className='text-sm border rounded-md w-full p-3 bg-gray-100 dark:bg-gray-950 outline-brandBlue'
                        backgroundColor={'darkGray'}
                        // disabled={true}
                        />
                        </div>
                        )}
                    </div>
                    <div className='flex flex-wrap lg:flex-nowrap justify-between gap-6 mt-2'>
                    <div className='w-full lg:w-2/4'>
                        {/* Stage Field Starts */}
                    <div className='flex flex-col'>
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
                        <div className='flex justify-between gap-2 mt-2'>
                         {/* Stage Field Ends */}
                         {/* Estimated efforts Date Field Starts */}
                         <div className='input_box flex flex-col w-2/4'>
                            <label className='text-base my-2 font-bold text-darkTextColor flex' htmlFor=''>
                                    Estimated Efforts Date<CgAsterisk color='red' />{' '}
                            </label>
                                <FloatingTextfield
                                    type='date'
                                    min={moment().format("YYYY-MM-DD")}
                                    name={'estimationDate'}
                                    error={hasError('estimationDate')}
                                    errorMsg={displayErrorMessage(formState.errors.estimationDate)}
                                    value={formState.values.estimationDate + ''}
                                    onChange={handleChange}
                                />
                        </div>
                        {/* Estimated efforts Date Field Ends */}
                        {/* Due Date Field Starts */}
                        <div className='input_box flex flex-col w-2/4'>
                            <label className='text-base my-2 font-bold text-darkTextColor flex' htmlFor=''>
                                    Due date<CgAsterisk color='red' />{' '}
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
                        {/* Due Date Field Ends */}
                        </div>
                        <div className='m-auto sm:m-0 xl:mt-2'>
                            <p className='text-base pb-2 font-bold text-darkTextColor'>Attachment</p>
                            <label className='flex sm:h-32 h-24 justify-center w-full h-full px-4 transition bg-white border-[3px] border-blueColor border-dashed rounded-md appearance-none cursor-pointer  focus:outline-none'>
                                {filAttachment ? (
                                    <span className='items-center space-x-2  justify-center text-center font-medium text-lightTextColor flex flex-col'>{filAttachment}</span>
                                ) : (
                                    <span className='items-center space-x-2  justify-center text-center font-medium text-lightTextColor flex flex-col'>
                                        <svg xmlns='http://www.w3.org/2000/svg' className='w-6 h-6 text-lightTextColor' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
                                            <path strokeWidth='round' strokeLinejoin='round' d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12' />
                                        </svg>
                                        <span className='font-medium text-lightTextColor flex flex-col'>
                                            You can add the Attachment Once Task is Created
                                            <span className='text-blueColor '>in the Edit Task/SubTask.</span>
                                        </span>
                                    </span>
                                )}
                                <input
                                    type='file'
                                    name='attachment'
                                    className='hidden'
                                    disabled
                                    onChange={event => {
                                        handleFileUploadInPublic(event);
                                    }}
                                />
                            </label>
                        </div>
                        <div className='flex flex-col '>
                                <label className='text-base my-2 font-bold text-darkTextColor flex' htmlFor=''>
                                    Epic Link <span className='text-base'>(optional)</span>{' '}
                                </label>
                                    <FloatingTextfield
                                        formate='array'
                                        type='text'
                                        name={'epicLink'}
                                        error={hasError('epicLink')}
                                        errorMsg={displayErrorMessage(formState.errors.epicLink)}
                                        value={formState.values.epicLink}
                                        onChange={handleChange}
                                    />
                            </div>
                    </div>
                    <div className='w-full lg:w-2/4'> 
                        <div className='input_box flex flex-wrap xl:flex-nowrap justify-between gap-6 w-full'>
                            <div className=' flex justify-between gap-2 w-full'>
                                <div className='w-full xl:w-2/4'>
                                    <label className='text-base my-2 font-bold text-darkTextColor flex items-center' htmlFor=''>
                                            Est Time
                                            <span className=' text-sm'>(HH:MM)</span> <CgAsterisk color='red' />{' '}
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
                                <div className='w-full xl:w-2/4'>
                                    <label className='text-base my-2 font-bold text-darkTextColor flex items-center' htmlFor=''>
                                            Actual Time
                                            <span className=' text-sm'>(HH:MM)</span>
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
                        </div>
                        
                        <div className='flex flex-col mt-2'>{/* Filter by Group Field Starts */}
                        <div className='flex flex-col w-full'>
                            {/* <b><LabelWithRefresh label={'Filter by Group'} onClick={handleGetAllGroup} /></b> */}
                            <label className='text-base my-2 font-bold text-darkTextColor flex' htmlFor=''>
                                    Filter by Group
                            </label>
                                <MultiSelectDropDown
                                    handleChangeMultiSelector={handleChangeMultiSelector}
                                    value={formState.values.group}
                                    selectedValues={formState.values.group}
                                    name={'group'}
                                    option={groupList}
                                />
                        </div>
                        {/* Filter by Group Field Starts */}
                        {/* Assigned To Members Field Starts */}
                        <div className='flex flex-col w-full TaskManageLabel'>
                            {/* <b><LabelWithRefresh label={'Assigned To Members'} onClick={handleGetAllUser} /></b> */}
                            <label className='text-base my-2 font-bold text-darkTextColor flex' htmlFor=''>
                                    Assigned To Members
                            </label>
                                <MultiSelectDropDown
                                    handleChangeMultiSelector={handleChangeMultiSelector}
                                    value={formState.values.assignedTo}
                                    selectedValues={formState.values.assignedTo}
                                    name={'assignedTo'}
                                    option={uniqueArrays(
                                        userObject.filter(function (d) {
                                            return d.role === 'member';
                                        })
                                    )}
                                />
                        </div>
                        {/* Assigned To Members Field Ends */}
                                <div className='flex flex-col w-full TaskManageLabel'>
                                    <label className='text-base my-2 font-bold text-darkTextColor flex' htmlFor=''>
                                        Select Role <span className='text-base'>(optional)</span>{' '}
                                    </label>
                                        <FloatingSelectfield optionsGroup={roleList} name={'category'} value={selectedRole} onChange={handleChangeRole} />
                                </div>
                                <div className='flex flex-col w-full TaskManageLabel'>
                                    <label className='text-base my-2 font-bold text-darkTextColor flex' htmlFor=''>
                                        Users <span className='text-base'>(optional)</span>{' '}
                                    </label>
                                        <MultiSelectDropDown
                                            selectedValues={formState.values.customUsers}
                                            handleChangeMultiSelector={handleChangeMultiSelector}
                                            name={'customUsers'}
                                            option={userObject.filter(function (d) {
                                                return d.role === selectedRole;
                                            })}
                                            value={formState.values.customUsers}
                                            label={undefined}
                                            disable={selectedRole ? false : true}
                                        />
                                </div>
                                <div className='w-full'>
                                    <label htmlFor='' className='text-base my-2 font-bold text-darkTextColor flex'>
                                            <b>Priority</b> <CgAsterisk color='red' />{' '}
                                    </label>
                                    <div className='sm:flex items-center mt-2'>
                                        <div className='flex items-center sm:px-0 px-2 '>
                                            <input
                                                className='cursor-pointer w-5'
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
                                        <div className='flex items-center sm:px-0 px-2 '>
                                            <input
                                                className='cursor-pointer w-5'
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
                                        <div className='flex items-center sm:px-0 px-2 '>
                                            <input
                                                className='cursor-pointer w-5'
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
                </div>
                    
                    <div className='mb-4 flex justify-end w-full gap-5'>
                    {/* <button className='cancel-button'>Cancel</button> */}
                       
                        <button className='cancel-button items-center xs:w-full flex sm:text-md text-base' onClick={()=>{ 
                            setShowDynamicInput(false)
                            router.push('/w-m/tasks/all')}}>
                            Cancel                         
                            
                            {/* <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 Sm:h-5 sm:w-5 ' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
                                <path strokeLinecap='round' strokeLinejoin='round' d='M9 5l7 7-7 7' />
                            </svg> */}
                        </button>
                        <button disabled={!formState.isValid} type='submit' className='small-button items-center xs:w-full flex sm:text-md text-base' onClick={handleCreateTask}>
                            Create Task                                  

                            <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 Sm:h-5 sm:w-5 ' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
                                <path strokeLinecap='round' strokeLinejoin='round' d='M9 5l7 7-7 7' />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            }
                    
                    {/* create button */}
                </div>
            </div>
        </>
    );
}
export default CreateTask;
