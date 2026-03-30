/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState, Fragment } from 'react';
import Modal from 'react-modal';
import Multiselect from 'multiselect-react-dropdown';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';
import { AiOutlineDelete } from '@react-icons/all-files/ai/AiOutlineDelete';
import { BsThreeDotsVertical } from '@react-icons/all-files/bs/BsThreeDotsVertical';
import { handleUserClick } from '../../../../helper/function';
import DeleteConformation from '../../../../components/DeleteConformation';
import DropDown from '../../../../components/DropDown';
import { apiIsNotWorking, filterMembers, formatedDate } from '../../../../helper/function';
import { getAllTask, searchTask } from '../api/get';
import CreateTask from './createTask';
import { deleteAllTask, deleteSubTaskById, deleteTaskById as deleteTaskByIdApi } from '../api/delete';
import ToolTip from '../../../../components/ToolTip';
import { updateSubTaskStatus, updateTaskStatus } from '../api/put';
import toast from '../../../../components/Toster/index';
import TinnySpinner from '../../../../components/TinnySpinner';
import DropDownWithTick from '../../../../components/DropDownWithTick';
import { getAllRoles, getAllUsers, searchMember } from '../../members/api/get';
import { getAllGroups } from '../../groups/api/get';
import NewToolTip from '../../../../components/NewToolTip';
import { BsDownload, BsFiletypeCsv, BsFiletypePdf, BsFillCaretDownFill, BsFillCaretUpFill } from 'react-icons/bs';
import EditTableCol from '../../../../components/EditTableCol';
import Filter from './filter';
import SearchInput from '../../../../components/SearchInput';
import Image from 'next/image';
import { getAllProject, getDefaultConfig } from '../../projects/api/get';
import { useRouter } from 'next/router';
import { FaArrowDown, FaArrowUp, FaGalacticSenate } from 'react-icons/fa';
import CreateOrEditTask from './createOrEditTask';
import CreateOrEditSubtask from './createOrEditSubtask';
import { getAllCategory, getAllStages, getAllStatus, getAllTaskType } from '../../config/api/get';
import Cookies from 'js-cookie';
import { AVTAR_URL, USER_AVTAR_URL } from '../../../../helper/avtar';
import { taskTableListCookies } from '../../../../helper/tableList';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import { filterTaskApi } from '../api/post';
import { fetchProfile } from '@WORKFORCE_MODULES/admin/api/get';
import NoSsr from '@COMPONENTS/NoSsr';
import { downloadFiles } from '@HELPER/download';
import { updateScreenConfig } from '@WORKFORCE_MODULES/projects/api/put';
import NoAccessCard from '@COMPONENTS/NoAccessCard';
import { FloatingSelectfield } from '@COMPONENTS/FloatingSelectfield';
import MemberModal from '@COMPONENTS/MemberModal';
import { addDays } from 'date-fns';
import { AiFillCloseCircle } from 'react-icons/ai';
import { Listbox, Menu, Popover, Transition } from '@headlessui/react';
import { IoCalendarSharp, IoChevronDown, IoChevronDownCircleOutline } from 'react-icons/io5';
import { ChevronDown } from 'react-feather';
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import JsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'
import { ClientReportTask } from '../api/get';
import * as XlsxPopulate from "xlsx-populate/browser/xlsx-populate";
import { VscCalendar } from 'react-icons/vsc';
import { Tooltip } from '@material-tailwind/react';
const index = ({ stopLoading, startLoading }) => {
    const router = useRouter();
    const [taskTableList, setTaskTableList] = useState(null);
    const [taskDetails, setTaskDetails] = useState(null);
    const [taskList, setTaskList] = useState(null);
    const [openDeleteModel, setOpenDeleteModel] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState('');
    const [deleteTaskId, setDeleteTaskId] = useState('');
    const [deleteSubTaskId, setDeleteSubTaskId] = useState('');
    const [users, setUsers] = useState([]);
    const [expandedRows, setExpandedRows] = useState([]);
    const [expandState, setExpandState] = useState({});
    const [taskCount, setTaskCount] = useState(0);
    const [projectList, setProjectList] = useState(null);
    const [projectid, setProjectId] = useState(
        [ { text:"All" , value: "all"},
        {text: "Independant task", value: "standAlonetask"},]
    );
    const [openDeleteAllModel, setOpenDeleteAllModel] = useState(false);
    const [openDeleteSubtaskModel, setOpenDeleteSubtaskModel] = useState(false);
    const [taskTypeDetails, setTaskTypeDetails] = useState(null);
    const [stageList, setStageList] = useState(null);
    const [categoryList, setCategoryList] = useState(null);
    const [groupList, setGroupList] = useState(null);
    const [statusDetails, setStatusDetails] = useState([]);
    const [permission, setPermission] = useState(null);
    const [roleList, setRoleList] = useState(null);
    const [type, setType] = useState(null);
    const [filterData, setFilterData] = useState({});
    const [sortTable, setSortTable] = useState({
        skip: 0,
        limit: 10,
        pageNo: 1,
    });
    const [selectedCheckboxes, setSelectedCheckboxes] = useState({});
    const [selectedProject, setSelectedProject] = useState("all")
    const [taskDetailsDownload, setTaskDetailsDownload] = useState(null)
    const[summeryData,setSummeryData]=useState(null)

    const handleGetFilterTask = (condition="") => {
        // event.preventDefault();
        
        filterTaskApi(condition,filterData)
            .then(response => {
                if (response.data.body.status === 'success') {
                    setTaskDetails(response.data?.body.data.resp);
                    setTaskCount(response.data.body.data.totalCount?response.data.body.data.totalCount:0);
                    
                }
            })
            .catch(function (response) {
                stopLoading();
                toast({
                    type: 'error',
                    message: response ? response.data?.body.message : 'Something went wrong, Try again !',
                });
            });
    };
    // Handle Calendar
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

    let[Data,setData]=useState(null)

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setData('One');
    };

    const isButtonDisabled = Data !== 'One';

    const handleDateChange = (ranges) => {
        // Handle date range selection
        setSelectedRange([ranges.selection]);
    };
  
    useEffect(() => {
        handleGetFilterTask("?limit="+sortTable.limit + '&keyword=' + searchKeyword)
    },[filterData])

    const handleFiterData = (data) =>{
        setFilterData(data);
        setSortTable({
            skip: 0,
            limit: 10,
            pageNo: 1,
        });
        setType("filter")
    }
    const handleDeleteAllTask = () => {
        deleteAllTask()
            .then(function (result) {
                if (result.data.body.status == 'success') {
                    handleGetAllTask();
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
        setOpenDeleteAllModel(false);
    };
    const handleEpandRow = (event, taskId) => {
        const currentExpandedRows = expandedRows;
        const isRowExpanded = currentExpandedRows.includes(taskId);
        let obj = {};
        isRowExpanded ? (obj[taskId] = false) : (obj[taskId] = true);
        setExpandState(obj);
        const newExpandedRows = isRowExpanded ? currentExpandedRows.filter(id => id !== taskId) : currentExpandedRows.concat(taskId);
        setExpandedRows(newExpandedRows);
    };

    const handleGetAllStatus = () => {
        getAllStatus().then(response => {
            if (response.data?.body.status === 'success') {
                setStatusDetails(response.data?.body.data.data);
            }
        });
    };
    
    useEffect(() => {
        handleGetAllStatus();
        getAllProject(`?limit=${process.env.TOTAL_USERS}&orderBy=createdAt`).then(response => {
            if (response.data?.body.status === 'success') {
                var projectList = response.data?.body.data.project.map(function (project) {
                    return {
                        text: project.projectName,
                        value: project._id,
                    };
                });
                setProjectList(projectList);
                setProjectId([...projectid, ...projectList])
            }
        });
    }, []);

    const handleGetAllUsers = (condition = '') => {
        getAllUsers(condition).then(response => {
            if (response.data?.body.status === 'success') {
                setUsers(
                    response.data?.body.data.users.map(data => {
                        return {
                            id: data._id,
                            role: data.role,
                            key: data.firstName + ' ' + data.lastName,
                            value: data,
                        };
                    })
                );
            }
        });
    };
    const handleGetAllGroup = () => {
        getAllGroups("?limit=20").then(response => {
            if (response.data?.body.status === 'success') {
                setGroupList(
                    response.data?.body.data.groupDetails.map(function (item) {
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
    useEffect(() => {

        handleGetAllTaskType();
        handleGetAllUsers('?limit=' + process.env.TOTAL_USERS + '&invitationStatus=1&suspensionStatus=false');
        handleGetAllGroup();

        handleGetTaskConfig();

        if (Cookies.get('isAdmin') === 'false') {
            handleProfileData();
        }
    }, []);

    useEffect(() => {
        // document.querySelector('body').classList.add('bodyBg');
    }, [taskTableList]);

    const handleGetAllTask = (condition = '') => {
        // setSortTable({
        //     limit:10,
        //     skip:10,
        //     pageNo: 1
        // })
        if(selectedProject === "all"){
            getAllTask(condition).then(response => {
                if (response.data?.body.status === 'success') {
                    setTaskCount(response.data?.body.data.taskCount);
                    setTaskDetails(response.data?.body?.data?.tasks);
                }
            });
        }else
            if(selectedProject === "standAlonetask"){
                condition = condition+'&standAloneTask=true'
                getAllTask(condition).then(response => {
                    if (response.data?.body.status === 'success') {
                        setTaskCount(response.data?.body.data.taskCount);
                        setTaskDetails(response.data?.body?.data?.tasks);
                    }
                });
            }else
            {
                let updatedConditions = `${condition}&projectId=${selectedProject}`;
                getAllTask(updatedConditions).then(response => {
                    if (response.data?.body.status === 'success') {
                        setTaskCount(response.data?.body?.data?.taskCount);
                        setTaskDetails(response.data?.body?.data?.tasks);
                    }
                });
            }
    };

useEffect(() =>{
    getAllTask("?limit=5000").then(response => {
        if (response.data?.body.status === 'success') {
            let taskList = response.data?.body?.data?.tasks.map((d)=>{
              return  { text: d.taskTitle, value: d._id}
            })
            setTaskList(taskList);
        }
    });
},[])
    const handleProfileData = () => {
        fetchProfile().then(response => {
            if (response.data?.body.status === 'success') {
                setPermission(response.data.body.data.permissionConfig);
            }
        });
    };

    const handleGetAllTaskType = () => {
        getAllTaskType().then(response => {
            if (response.data?.body.status === 'success') {
                setTaskTypeDetails(
                    response.data?.body.data.data.map(d => {
                        return { text: d.taskType, value: d.taskType };
                    })
                );
            }
        });
    };
    const handleGetTaskConfig = () => {
        getDefaultConfig().then(response => {
            if (response.data?.body.status === 'success') {
                if (permission?.task.view === true || Cookies.get('isAdmin') === 'true') {

                    setTaskTableList(response.data?.body.data.task);
                  
                } else {
                    // const filteredArray = (response.data?.body.data.task).filter((item) => item.name !== "Status");
                    setTaskTableList(response.data?.body.data.task);

                }
            }
        });
    };
 
    const handleDeleteTaskById = () => {
        deleteTaskByIdApi(deleteTaskId)
            .then(function (result) {
                if (result.data.body.status == 'success') {
                    if(type === "search" || type === "filter"){
                        handleGetFilterTask('?limit=' + sortTable.limit + "&skip=" + sortTable.skip + '&keyword=' + searchKeyword)
                    }else
                    handleGetAllTask('?limit=' + sortTable.limit + "&skip=" + sortTable.skip);
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
        setOpenDeleteModel(false);
    };
    const handleDeleteSubTaskById = () => {
        deleteSubTaskById(deleteSubTaskId)
            .then(function (result) {
                if (result.data.body.status == 'success') {
                    if(type === "filter" || type === "search"){
                        handleGetFilterTask('?limit=' + sortTable.limit + "&skip=" + sortTable.skip + '&keyword=' + searchKeyword)
                    }else
                    handleGetAllTask('?limit=' + sortTable.limit + "&skip=" + sortTable.skip);
                    toast({
                        type: 'success',
                        message: result ? result.data.body.message : 'Try again !',
                    });
                    setOpenDeleteSubtaskModel(false);
                } else {
                    toast({
                        type: 'error',
                        message: result ? result.data.body.message : 'Error',
                    });
                }
                setOpenDeleteSubtaskModel(false);
            })
            .catch(function (e) {
                setOpenDeleteSubtaskModel(false);
                toast({
                    type: 'error',
                    message: e.response ? e.response.data.message : 'Something went wrong, Try again !',
                });
            });
        setOpenDeleteModel(false);
    };
    const handleChangeStatus = (data, taskId) => {
                updateTaskStatus(data, taskId)
            .then(function (result) {
                if (result.data.body.status == 'success') {
                    if(type === "filter" || type === "search"){
                        handleGetFilterTask('?limit=' + sortTable.limit + "&skip=" + sortTable.skip+'&keyword=' + searchKeyword)
                    }else
                    handleGetAllTask('?limit=' + sortTable.limit);
                    
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
    };  
    const handleGetUpdatedData = () => {
        if (type === 'filter' || type === 'search') {
          handleGetFilterTask(`?limit=${sortTable.limit}&skip=${sortTable.skip}&keyword=${searchKeyword}`);
        } else {
          handleGetAllTask(`?limit=${sortTable.limit}&skip=${sortTable.skip}`);
        }
      };
      
    const handleChangeSubtaskStatus = (data, _id) => {
                updateSubTaskStatus(data, _id)
            .then(function (result) {
                if (result.data.body.status == 'success') {
                    if(type === "filter" || type === "search"){
                        handleGetFilterTask('?limit=' + sortTable.limit + "&skip=" + sortTable.skip+'&keyword=' + searchKeyword)
                    }else
                    handleGetAllTask('?limit=' + sortTable.limit );
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
    };

    const handleSearchTask = (condition='') => {
        if(searchKeyword == null) return false;
        searchTask(condition).then(response => {
            if (response.data.body.status === 'success') {
                setTaskDetails(response.data.body.data.resp);
                setTaskCount(response.data.body.data.taskCount)
                setType("search")
            } else if (response.data.body.status === 'failed' && searchKeyword !== '') {
                setTaskDetails([]);
            }
        });
    };


    const handleReset = () => {
        setSelectedProject("all")
        for (const item of taskTableList) {
            let data = {
                task: [
                    {
                        name: item.name,
                        value: item.value,
                        sort: 'ASC',
                        isDisabled: item.isDisabled,
                        isVisible: true,
                    },
                ],
            };
            updateScreenConfig(data)
                .then(function (result) {
                    if (result.data && result.data.body.status === 'success') {
                    } else {
                        toast({
                            type: 'error',
                            message: result ? result.data.body.error : 'Try again !',
                        });
                    }
                })
                .catch(function (response) {
                    toast({
                        type: 'error',
                        message: response.data ? response.data.body.error : 'Something went wrong, Try again !',
                    });
                });
        }
        handleGetTaskConfig();
    };
    const checkVisibility = function (type) {
        if (!taskTableList) return false;
                return taskTableList.some(obj => {
            if(obj.value === 'members'){
                obj.value='assignedTo'
            }

            if (obj.value === type) {
                return obj.isVisible;
            }
        });
    };
    const handleSelectCol = data => {
        let item = {
            task: [
                {
                    name: data.name,
                    value: data.value,
                    sort: data.sort,
                    isDisabled: data.isDisabled,
                    isVisible: data.isVisible === false ? true : false,
                },
            ],
        };
        updateScreenConfig(item)
            .then(function (result) {
                if (result.data && result.data.body.status === 'success') {
                    handleGetTaskConfig();
                    // toast({
                    //     type: 'success',
                    //     message: result ? result.data.body.message : 'Try again !',
                    // });
                } else {
                    // toast({
                    //     type: 'error',
                    //     message: result ? result.data.body.error : 'Try again !',
                    // });
                }
            })
            .catch(function (response) {
                toast({
                    type: 'error',
                    message: response.data ? response.data.body.error : 'Something went wrong, Try again !',
                });
            });
    };

    const handleShorting = (sortType, colName, colValue) => {
        setTaskTableList(current =>
            current.map(obj => {
                if (obj.name === colName && obj.sort === 'DESC') {
                    return { ...obj, sort: obj.sort === 'DESC' ? 'ASC' : 'DESC' };
                }
                if (obj.name === colName && obj.sort === 'ASC') {
                    return { ...obj, sort: 'DESC' };
                }
                return obj;
            })
        );
        if(type === "search"){
            if (sortType === 'asc') {
                handleSearchTask('?keyword=' + searchKeyword + '&orderBy=' + colValue + '&sort=asc')
            } else {
                handleSearchTask('?keyword=' + searchKeyword + '&orderBy=' + colValue + '&sort=desc')
            }
        }else 
        if(type === "filter"){
            if (sortType === 'asc') {
                handleGetFilterTask('?order=' + colValue + '&sort=asc')
            } else {
                handleGetFilterTask('?order=' + colValue + '&sort=desc')
            }
        }else{
            if (sortType === 'asc') {
                handleGetAllTask('?order=' + colValue + '&sort=asc')
            } else {
                handleGetAllTask('?order=' + colValue + '&sort=desc')
            }
        }
        
    };

    const[searchKeyword,setKeyword] = useState('');

    useEffect(() => {
        if(type === "filter" || type === "search"){
            handleGetFilterTask('?limit=' + sortTable.limit + '&keyword=' + searchKeyword)
        }else{
            handleGetAllTask('?limit=' + sortTable.limit);
        }
    }, [sortTable.limit, selectedProject,searchKeyword]);



    const handlePaginationTasks = (condition) => {

        if(type === "filter"){
            handleGetFilterTask(condition + "&keyword=" +searchKeyword)
        }else
        {
            handleGetAllTask(condition);
        }
    };

    const handleGetAllRoles = () => {
        getAllRoles().then(response => {
            if (response.data.body.status === 'success') {
                setRoleList(
                    response.data.body.data.totalRolesData.map(data => {
                        return { text: data.roles, value: data.roles };
                    })
                );
            }
        });
    };
    const handleGetAllStage = () => {
        getAllStages().then(response => {
            if (response.data.body.status === 'success') {
                setStageList(
                    response.data?.body.data.stage.map(d => {
                        return { text: d.taskStage, value: d.taskStage };
                    })
                );
            }
        });
    };
    const handleGetAllCategory = () => {
        getAllCategory().then(response => {
            if (response.data.body.status === 'success') {
                setCategoryList(
                    response.data?.body.data.category.map(d => {
                        return { text: d.taskCategory, value: d.taskCategory };
                    })
                );
            }
        });
    };
    useEffect(() => {

        handleGetAllRoles();
        handleGetAllStage();
        handleGetAllCategory();

    }, []);
    const GroupFilterData = taskDetailsDownload?.map(item => {
        const { actualHours, attachmentassignedTo, epicLink, progress, projectCode, projectId, remainingHours, standAloneTask, taskCreater, taskDetails, _id, updatedAt, ...rest } = item;
        return rest;
    });


    let FinalDownloadData = GroupFilterData?.map(data => {
        const assignedToField = data?.assignedTo?.map(dataItem => `${dataItem.firstName} ${dataItem.lastName}`).join(', ') || ['Not Assigned'];

        let projectData = {
            'Project': data.projectName ? data.projectName : ' Not Assigned ',
            Task: data.taskTitle,
            'Created By': data?.taskCreator.firstName + ' ' + data?.taskCreator.lastName,
            Priority: data.priority,
            'Created At': formatedDate(data.createdAt),
            'Completed Date':formatedDate(data.completedDate),
            'Reason':data.reason,
            'Due date': formatedDate(data.dueDate),
            'Est.Time': data.estimationTime,
            'Est.Date': formatedDate(data.estimationDate),
            'Assigned to': assignedToField,
            'Task type': data.taskType,
            Category: data.category,
            Status: data.taskStatus,
            Stage: data.stageName,
        };
        if (data.subTasks?.length > 0) {
            let subtaskLines = data.subTasks.map(subtask => {
                const assignedToFieldOne = subtask?.subTaskAssignedTo?.map(dataItem =>  `${dataItem.firstName} ${dataItem.lastName}`).join(', ') || ['Not Assigned'];
                  return {
                    'Task': subtask.subTaskTitle + '     [ Sub Task ] ',
                    'Created By': subtask?.subTaskCreator.firstName + ' ' + subtask?.subTaskCreator.lastName,
                    Priority: subtask.priority,
                    'Created At': formatedDate(subtask.createdAt),
                    'Due date': formatedDate(subtask.dueDate),
                    'Est.Time': subtask.estimationTime,
                    'Est.Date': formatedDate(subtask.estimationDate),
                    'Assigned to': assignedToFieldOne,
                    'Task type': subtask.subTaskType,
                    Category: subtask.subTaskCategory,
                    Status: subtask.subTaskStatus,
                    Stage: subtask.subTaskStageName,
                };
            });

            return [
                {
                    ...projectData,
                },
                ...subtaskLines,
            ];
        }
        return {
            ...projectData,
        };
    }).flat();


    // const bulkAction = [
    //     {
    //         text: 'Import tasks',
    //         value: 1,
    //         onClick: (event, value, data, name) => {},
    //     },
        // {
        //     text: 'Delete all',
        //     value: 2,
        //     onClick: (event, value, data, name) => {
        //         if (taskDetails.length === 0) {
        //             toast({
        //                 type: 'error',
        //                 message: 'Please add data before deleting.',
        //             });
        //         } else {
        //             setOpenDeleteAllModel(!openDeleteAllModel);
        //         }
        //     },
        // },
    // ];
    // const download_data = [
    //     {
    //         text: 'Download CSV file',
    //         value: 'excel',
    //         onClick: () => {
    //             if (taskDetails?.length === 0) {
    //                 toast({
    //                     type: 'error',
    //                     message: 'Please add data before downloading.',
    //                 });
    //             } else {
    //                 downloadFiles('excel', 'Task', FinalDownloadData);
    //             }
    //         },
    //     },
    //     {
    //         text: 'Download PDF file',
    //         value: 'pdf',
    //         onClick: () => {
    //             if (taskDetails?.length === 0) {
    //                 toast({
    //                     type: 'error',
    //                     message: 'Please add data before downloading.',
    //                 });
    //             } else {
    //                 downloadFiles('pdf', 'Task', FinalDownloadData);
    //             }
    //         },
    //     },
    // ];
    const handleGetAllTaskDownload = (condition = '') => {
            ClientReportTask(condition).then(response => {
                if (response.data?.body.status === 'success') {
                    // setTaskCount(response.data?.body.data.taskCount);
                    setTaskDetailsDownload(response.data?.body?.data?.tasks);
                    setSummeryData(response.data?.body?.data)
                }
            });
    };

   

   
    function formatToCustomDate(inputDate) {
        const originalDate = new Date(inputDate);
      
        const year = originalDate.getFullYear();
        const month = originalDate.getMonth() + 1; // Months are 0-based, so we add 1
        const day = originalDate.getDate();
      
        const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        return formattedDate;
      }

const startDate =formatToCustomDate(selectedRange[0].startDate)
const endDate = formatToCustomDate(selectedRange[0].endDate)
const filteredTaskTableList = taskTableList && taskTableList.filter((d) => d.name !== 'Action');

useEffect(()=>{
    handleGetAllTaskDownload('?limit='+process.env.TOTAL_USERS + '&startDate='+ startDate + '&endDate='+endDate)
},[selectedRange ,taskDetails]);

const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setSelectedCheckboxes((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  const selectedKeys = Object.keys(selectedCheckboxes).filter(
    (key) => selectedCheckboxes[key] === true
  );


  const filteredDataTwo =FinalDownloadData && FinalDownloadData.map(item => {
    const filteredObject = {};
    selectedKeys.forEach(key => {
      if (item.hasOwnProperty(key)) {
        filteredObject[key] = item[key];
      }
    });
    return filteredObject;
  });
  

  const assignedToField = summeryData?.ontimeCompletedMembers?.map(dataItem => dataItem).join(', ') || ['Not Assigned'];


const datadownloadTwo = function (type: string, exportFileName: string, collection: any) {
    try {
        var headerNames = Object.keys(collection[0]);
        const tableData = collection.map(item =>
            headerNames.map(key => item[key])
        );
        const fileName = exportFileName + '.pdf';

        // Increase the page size - e.g., A4 size (210mm x 297mm)
        const customA4Dimensions = [360, 360]; // Width x Height in millimeters

        const doc = new JsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: customA4Dimensions // Set the custom page size
        });

        // Set the top margin to add space
        const topMargin = 20; // Adjust the value as needed
        doc.setProperties({ topMargin });

        const columnWidths = [40, 60, 80];

        // Define the summary columns and data
        const summaryColumns = [
            {key :'Summary for ' + startDate + ' to ' + endDate},
            { key: "Total Task Count", value: summeryData?.newlyAdded || 0 },
            { key: "Total Pending Tasks", value: summeryData?.pendingTasks || 0 },
            { key: "Exceeded Due Date", value: summeryData?.exceededDueDate || 0 },
            { key: "On Time Completed Members", value: assignedToField },
            { key: "On Time Submitted Tasks", value: summeryData?.onTimeSubmittedTasks || 0 },
        ];

        const bodyData = summaryColumns.map((item, index) => {
            return {
                key: {
                    content: item.key,
                    styles: {
                        fontStyle: 'bold',
                        textColor: index === 0 ? [255, 0, 0] : [0, 0, 0], // Red color for the first key, black for the others
                    },
                },
                value: item.value // Regular style for the value
            };
        });

        autoTable(doc, {
            body: bodyData.map(item => [item.key, item.value]),
            margin: { horizontal: 5 },
            bodyStyles: { valign: 'middle' },
            styles: { fontSize: 7, overflow: 'linebreak', columnWidth: columnWidths },
            theme: 'grid',
        });

        doc.addPage();

        autoTable(doc, {
            head: [headerNames],
            body: tableData,
            margin: { horizontal: 5 },
            bodyStyles: { valign: 'middle' },
            styles: { fontSize: 7, overflow: 'linebreak', columnWidth: columnWidths },
            theme: 'grid',
        });

        doc.save(fileName);
        return false;
    } catch (error) {
        toast({
            type: 'error',
            message: 'There is no data to download',
        });
    }
}


const handleSelectAllChange = (event) => {
    const { checked } = event.target;
    const updatedSelectedCheckboxes = {};

    filteredTaskTableList.forEach((d) => {
      updatedSelectedCheckboxes[d.name] = checked;
    });

    setSelectedCheckboxes(updatedSelectedCheckboxes);
  };

  const areAllCheckboxesSelected = Object.values(selectedCheckboxes).every(Boolean);


  const data =[{}]
  const createDownLoadData = () => {
    handleExport().then((url) => {
      const downloadAnchorNode = document.createElement("a");
      downloadAnchorNode.setAttribute("href", url);
      downloadAnchorNode.setAttribute("download", "Task_report.xlsx");
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    });
  };

  const workbook2blob = (workbook) => {
    const wopts = {
      bookType: "xlsx",
      bookSST: false,
      type: "binary",
    };

    const wbout = XLSX.write(workbook, wopts);

    // The application/octet-stream MIME type is used for unknown binary files.
    // It preserves the file contents, but requires the receiver to determine file type,
    // for example, from the filename extension.
    const blob = new Blob([s2ab(wbout)], {
      type: "application/octet-stream",
    });

    return blob;
  };

  const s2ab = (s) => {
    // The ArrayBuffer() constructor is used to create ArrayBuffer objects.
    // create an ArrayBuffer with a size in bytes
    const buf = new ArrayBuffer(s.length);


    //create a 8 bit integer array
    const view = new Uint8Array(buf);

    //charCodeAt The charCodeAt() method returns an integer between 0 and 65535 representing the UTF-16 code
    for (let i = 0; i !== s.length; ++i) {
      view[i] = s.charCodeAt(i);
    }

    return buf;
  };

  const handleExport = () => {
    const title = [{ A: "Summery for " + startDate + ' to ' + endDate }, {}];

    let table1 = [
      {
        A: "",
        B: "Total task count",
        C: "On Time Completed Members",
        D: "On Time Submitted Tasks",
        E: "Pending Tasks",
        F: "Exceeded Due Date",
        // G: "Result Status",
      },
    ];

    let table2 = [
      {
        A: "",
        B: "Project",
        C: "Task",
        D: "Created By",
        E: "Created At",
        F: "Priority",
        G :'Assigned To',
        H: "Due date",
        I: "Completed Date ",
        J:"Est.Date",
        K:'Est.Time',
        L :"Reason",
        M:'Stage',
        N:'Status',
        O:'Task type'


      },
    ];

    data.forEach((row) => {
    //   const studentDetails = row.STUDENT_DETAILS;
    //   const marksDetails = row.MARKS;

      table1.push({
        A: '' ,
        B: summeryData?.newlyAdded,
        C:assignedToField ?? '-',
        D:summeryData?.onTimeSubmittedTasks, 
        E:summeryData?.pendingTasks , 
        F:summeryData?.exceededDueDate ?? 0, 
        // F:summeryData.pendingTasks , 
        // G:summeryData.pendingTasks ,
      });

      filteredDataTwo.map(data=>{
        table2.push({
            A: '',
            B:data?.Project ?? 'N/A',
            C:data?.Task ?? 'N/A',
            D: data['Created By'] ?? 'N/A',
            E: data['Created At'] ?? 'N/A',
            F: data?.Priority ?? 'N/A',
            G:data['Assigned to'] ?? 'N/A',
            H:formatedDate(data['Due date']) ?? 'N/A',
            I: data['Completed Date'] ?? 'N/A',
            J: data['Est.Date'] ?? 'N/A',
            K: data['Est.Time'] ?? 'N/A',
            L: data?.Reason ?? 'N/A',
            M: data?.Stage ?? 'N/A',
            N: data?.Status ?? 'N/A',
            O: data['Task type'] ?? 'N/A',
        })
       
      });
    });

    table1 = [{ A: "Summery" }]
      .concat(table1)
      .concat([""])
      .concat([{ A: "Project and Task Details" }])
      .concat(table2);

    const finalData = [...title, ...table1];


    //create a new workbook
    const wb = XLSX.utils.book_new();

    const sheet = XLSX.utils.json_to_sheet(finalData, {
      skipHeader: true,
    });

    XLSX.utils.book_append_sheet(wb, sheet, "Task_report");

    // binary large object
    // Since blobs can store binary data, they can be used to store images or other multimedia files.

    const workbookBlob = workbook2blob(wb);

    var headerIndexes = [];
    finalData.forEach((data, index) =>
      data["A"] === "" ? headerIndexes.push(index) : null
    );

    const totalRecords = data.length;

    const dataInfo = {
      titleCell: "A2",
      titleRange: "A1:H2",
      tbodyRange: `A3:H${finalData.length}`,
      theadRange:
        headerIndexes?.length >= 1
          ? `A${headerIndexes[0] + 1}:G${headerIndexes[0] + 1}`
          : null,
      theadRange1:
        headerIndexes?.length >= 2
          ? `A${headerIndexes[1] + 1}:H${headerIndexes[1] + 1}`
          : null,
          theadRange2:
        headerIndexes?.length >= 2
          ? `A${headerIndexes[2] + 1}:O${headerIndexes[2] + 1}`
          : null,
      tFirstColumnRange:
        headerIndexes?.length >= 1
          ? `A${headerIndexes[0] + 1}:A${totalRecords + headerIndexes[0] + 1}`
          : null,
      tLastColumnRange:
        headerIndexes?.length >= 1
          ? `G${headerIndexes[0] + 1}:G${totalRecords + headerIndexes[0] + 1}`
          : null,

      tFirstColumnRange1:
        headerIndexes?.length >= 1
          ? `A${headerIndexes[1] + 1}:A${totalRecords + headerIndexes[1] + 1}`
          : null,
      tLastColumnRange1:
        headerIndexes?.length >= 1
          ? `N${headerIndexes[0] + 1}:N${totalRecords + headerIndexes[1] + 1}`
          : null,
    };

    return addStyle(workbookBlob, dataInfo);
  };

  const addStyle = (workbookBlob, dataInfo) => {
    return XlsxPopulate.fromDataAsync(workbookBlob).then((workbook) => {
      workbook.sheets().forEach((sheet) => {
        sheet.usedRange().style({
          fontFamily: "Arial",
          verticalAlignment: "center",
        });

        sheet.column("A").width(45);
        sheet.column("B").width(15);
        sheet.column("C").width(45);
        sheet.column("D").width(45);
        sheet.column("E").width(45);
        sheet.column("F").width(15);
        sheet.column("G").width(45);
        sheet.column("H").width(15);
        sheet.column("I").width(15);
        sheet.column("J").width(15);
        sheet.column("K").width(15);
        sheet.column("L").width(15);
        sheet.column("M").width(15);
        sheet.column("N").width(45);
      

        sheet.range(dataInfo.titleRange).merged(true).style({
          bold: true,
          horizontalAlignment: "center",
          verticalAlignment: "center",
        });

        if (dataInfo.tbodyRange) {
          sheet.range(dataInfo.tbodyRange).style({
            horizontalAlignment: "center",
            horizontalAlignment: "left",
          });
        }

        sheet.range(dataInfo.theadRange).style({
          fill: "FFFD04",
          bold: true,
          horizontalAlignment: "center",
        });

        if (dataInfo.theadRange1) {
          sheet.range(dataInfo.theadRange1).style({
            fill: "808080",
            bold: true,
            horizontalAlignment: "center",
            fontColor: "ffffff",
          });
        }
        if (dataInfo.theadRange2) {
            sheet.range(dataInfo.theadRange2).style({
              fill: "808080",
              bold: true,
              horizontalAlignment: "center",
              fontColor: "ffffff",
            });
          }

        if (dataInfo.tFirstColumnRange) {
          sheet.range(dataInfo.tFirstColumnRange).style({
            bold: true,
          });
        }

        if (dataInfo.tLastColumnRange) {
          sheet.range(dataInfo.tLastColumnRange).style({
            bold: true,
          });
        }

        if (dataInfo.tFirstColumnRange1) {
          sheet.range(dataInfo.tFirstColumnRange1).style({
            bold: true,
          });
        }

        if (dataInfo.tLastColumnRange1) {
          sheet.range(dataInfo.tLastColumnRange1).style({
            bold: true,
          });
        }
      });

      return workbook
        .outputAsync()
        .then((workbookBlob) => URL.createObjectURL(workbookBlob));
    });
}

      return (
        <>
            {permission && permission.task.view === false ? (
                <NoAccessCard />
            ) : (
                <>
                    <div className='flex justify-between flex-wrap -mt-0 md:-mt-6 mb-2 alltask'>
                        <h2 className='heading-big relative font-bold mb-0 heading-big text-darkTextColor px-2 py-1'>Tasks<span className="absolute top-0 -right-3 inline-flex items-center justify-center mr-2 font-bold leading-none transform translate-x-1/2 -translate-y-1/2 bg-[#0685D7] text-indigo-100 text-sm text-center ml-2 px-2 py-1 rounded-full dark:bg-[#0685D7] border border-[#0685D7]">{taskCount}</span></h2>
                        <div className='flex items-center flex-wrap gap-2'>
                            <NoSsr>
                                <div className='relative' id='step1'>
                                    {permission?.task.create === true || Cookies.get('isAdmin') === 'true' ? (
                                        <CreateOrEditTask
                                            type={undefined}
                                            data={undefined}
                                            {...{
                                                handleGetAllTask,
                                                handleGetAllUsers,
                                                handleGetAllGroup,
                                                projectList,
                                                taskTypeDetails,
                                                stageList,
                                                categoryList,
                                                users,
                                                stopLoading,
                                                startLoading,
                                                groupList,
                                                roleList,
                                                permission,
                                                statusDetails,
                                                handleGetUpdatedData
                                            }}
                                        />
                                    ) : (
                                        <></>
                                    )}
                                </div>
                                <div className='relative' id='step2'>
                                    {permission?.subtask.create === true || Cookies.get('isAdmin') === 'true' ? (
                                        <CreateOrEditSubtask
                                            handleGetAllGroup={undefined}
                                            handleGetAllUsers={undefined}
                                            subtaskType={'add'}
                                            data={null}
                                            {...{
                                                taskList,
                                                projectList,
                                                users,
                                                taskTypeDetails,
                                                taskDetails,
                                                handleGetAllTask,
                                                stopLoading,
                                                startLoading,
                                                groupList,
                                                roleList,
                                                stageList,
                                                categoryList,
                                                permission,
                                                searchKeyword,
                                                sortTable,
                                                handleGetFilterTask,
                                                handleSearchTask,
                                                statusDetails
                                                
                                            }}
                                        />
                                    ) : (
                                        <></>
                                    )}
                                </div>
                            </NoSsr>
                            {/* <div className='relative mr-3' id='step3'> */}
                            {/* <NewToolTip direction='left' message={'TaskDownload'}> */}
                            {/* <div className=' flex gap-3'>
                                        {download_data.map((ele,i)=>(
                                            <div key={i} className='flex'>
                                                <button className='small-button h-9 flex items-center' onClick={ele.onClick}>{ele.text}</button>
                                            </div>
                                        ))}
                                    </div> */}
                            <Popover className="relative">
                                {({ open }) => (
                                    <>
                                        <Popover.Button
                                            className={`
                ${open ? '' : 'text-opacity-90'}
                 inline-flex gap-2 h-8 items-center focus:border-none small-button  `}
                                        >
                                            Download
                                            <ChevronDown
                                                className={`${open ? '' : 'text-opacity-70'}
                  h-4 w-4 text-orange-300 text-white transition dark:text-[#fff] duration-150 ease-in-out group-hover:text-opacity-80`}
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
                                            <Popover.Panel className={` absolute -left-8 text-base z-50 mt-3 max-w-sm px-2 sm:px-0 lg:max-w-3xl `}>
                                                <div className="py-3 px-2 w-[10rem] flex justify-center flex-col items-start bg-white rounded-lg shadow-lg">
                                                    <div className=''>
                                                        <button onClick={handleOpenModal} className='flex justify-between gap-2 items-center py-1 bg-white  hover:bg-slate-200 dark:hover:bg-slate-800 dark:text-[#fff] rounded px-4'>
                                                        <span><VscCalendar className=' text-xl'/></span>
                                                            Set Duration
                                                        </button>
                                                        <Modal
                                                            isOpen={isModalOpen}
                                                            onRequestClose={handleCloseModal}
                                                            // contentLabel="Date Picker Modal"
                                                            className=" relative flex justify-center items-center h-[100vh] rounded modal-bg"
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
                                                            <button className='  small-button h-8 flex items-center' onClick={handleCloseModal}>
                                                                Done
                                                            </button>
                                                            </div>
                                                            <div>
                                                            <button onClick={handleCloseModal} className='px-4 py-1 rounded-full font-bold text-white hover:bg-red-600 bg-red-500 h-8 flex items-center '>
                                                                Cancel
                                                            </button>
                                                            </div>
                                                            </div>
                                                            </div>
                                                        </Modal>
                                                    </div>
                                                            {!isButtonDisabled ?(
                                                    <div className=" py-1 bg-white relative cursor-pointer">
                                                        <Popover className="relative">
                                                        <Popover.Button>
                                                        <button className='gap-2 flex justify-between items-center rounded outline-none focus:hidden hover:bg-slate-200 dark:hover:bg-slate-800 dark:text-[#fff] px-4 py-1'>
                                                            <span><BsFiletypeCsv className=' text-xl'/></span>
                                                            Download CSV
                                                            </button>
                                                        </Popover.Button>
                                                        <Popover.Panel>
                                                          <div className='flex flex-col ps-10 mt-1 dark:text-gray-50 overflow-y-auto h-[10rem]'>
                                                          <label>
                                                            <input
                                                            type="checkbox"
                                                            name="selectAll"
                                                            className="border mr-2"
                                                            // checked={areAllCheckboxesSelected}
                                                            onChange={handleSelectAllChange}
                                                            />
                                                            Select All
                                                        </label>
                                                        {filteredTaskTableList && filteredTaskTableList.map((d, index) => (
                                                            <label key={index} className='py-1'>
                                                            <input type="checkbox" name={d.name} id={`checkbox-${index}`} className='border mr-2' checked={selectedCheckboxes[d.name] || false}
                                                                onChange={handleCheckboxChange} />
                                                            {d.name}
                                                            </label>
                                                        ))}
                                                        </div>
                                                        <div className='flex justify-center mt-2'>
                                                        <button className='small-button h-7 flex justify-center items-center' onClick={createDownLoadData}>Download</button>
                                                        </div>
                                                        </Popover.Panel>
                                                        </Popover>
                                                       
                                                    </div>):null}
                                                    {!isButtonDisabled ?(
                                                    <div className=" py-1 bg-white ">
                                                    
                                                        <Popover className="relative">
                                                        <Popover.Button>
                                                        <button className='gap-2 flex justify-between items-center rounded outline-none focus:hidden hover:bg-slate-200 dark:hover:bg-slate-800 dark:text-[#fff] px-4 py-1'  >
                                                            <span><BsFiletypePdf className=' text-xl'/></span>
                                                            Download PDF</button>
                                                                                                                </Popover.Button>
                                                        <Popover.Panel>
                                                        <div className='flex flex-col ps-10 mt-1 dark:text-gray-50 overflow-y-auto h-[10rem]'>
                                                        <label>
                                                            <input
                                                            type="checkbox"
                                                            name="selectAll"
                                                            className="border mr-2"
                                                            checked={areAllCheckboxesSelected}
                                                            onChange={handleSelectAllChange}
                                                            />
                                                            Select All
                                                        </label>
                                                                      {filteredTaskTableList && filteredTaskTableList.map((d, index) => (
                                                                    <label key={index}  className='py-1'>
                                                                    <input type="checkbox" name={d.name} id={`checkbox-${index}`} className='border mr-2' checked={selectedCheckboxes[d.name] || false}
                                                                        onChange={handleCheckboxChange} />
                                                                    {d.name}
                                                                    </label>
                                                                    ))}
                                                                    </div>
                                                                    <div className='flex justify-center'>
                                                                    <button className='small-button h-7 flex justify-center items-center' onClick={()=> datadownloadTwo('pdf', 'Task', filteredDataTwo)}>Download</button>
                                                                    </div>
                                                        </Popover.Panel>
                                                        </Popover>
                                                        
                                                    </div>
                                                    ):null}
                                                </div>
                                            </Popover.Panel>
                                        </Transition>
                                    </>
                                )}
                            </Popover>
                        </div>
                    </div>
                    <div className='rounded-xl shadow-md shadow-gray-200 dark:shadow-gray-950 bg-white mb-4 py-4 px-7 h-fit'>
                        <div className='flex justify-between items-center flex-wrap gap-2'>
                                <div className='flex items-center '>
                                    <p className='p-0 m-0 text-lightTextColor dark:text-[#fff] text-base'>Show</p>
                                    <select
                                        value={sortTable.limit}
                                        onChange={event => {
                                            setSortTable({ ...sortTable, limit: event.target.value,pageNo: 1 });
                                            // setType(null);

                                        }}
                                        className='border py-1  rounded-md outline-none w-14 text-sm px-2 mx-1'>
                                        <option value={10}>10</option>
                                        <option value={25}>25</option>
                                        <option value={50}>50</option>
                                        <option value={100}>100</option>
                                        <option value={500}>500</option>
                                    </select>
                                    <p className='p-0 m-0 text-lightTextColor dark:!text-[#fff] text-base'>Entries</p>
                                </div>{' '}
                                    <FloatingSelectfield
                                        width={'w-[7rem] pr-8'}
                                        // label={'Select the project '}
                                        optionsGroup={projectid}
                                        name={'projectList'}
                                        value={selectedProject}
                                        onChange={(e)=>{
                                            setSortTable( {skip: 0,
                                                limit: 10,
                                                pageNo: 1,})
                                            setSelectedProject(e.target.value)
                                            setType(null)
                                        }}
                                    />
                                <div className='flex items-center'>
                                    {/* <p className='p-0 m-0 text-lightTextColor text-base'>Filter by Project</p> */}
                                    <div className='relative'>
                                        <SearchInput onChange={(event)=>
                                        {   setKeyword(event.target.value);
                                            setType("search")
                                            setSortTable( { skip: 0, limit: 10, pageNo: 1})
                                            setSelectedProject("all")
                                            }} 
                                            placeholder={'Search a task'} />
                                    </div>
                                    <div className='relative flex items-center gap-2'>
                                        <Filter
                                            type={undefined}
                                            {...{
                                                setKeyword,
                                                users,
                                                statusDetails,
                                                handleFiterData,
                                                handleGetAllTask,
                                                handleGetFilterTask,
                                                taskTypeDetails,
                                                categoryList,
                                                setSelectedProject

                                            }}
                                            setType={setType}
                                        />
                                    <EditTableCol data={taskTableList} checkVisibility={checkVisibility} setType={setType} handleReset={handleReset} setSelectedProject={setSelectedProject} {...{ handleSelectCol}} />
                                    </div>
                                </div>
                                {/* <DropDown
                                    data={bulkAction}
                                    defaultValue={''}
                                    icon={
                                        <span className='text-2xl grey-link'>
                                            <BsThreeDotsVertical />
                                        </span>
                                    }
                                    getData={undefined}
                                    downloadData={undefined}
                                    name={undefined}
                                /> */}
                            
                        </div>
                        <div className='mt-2 overflow-x-auto increase-scroll-h max-h-[70vh] lg:max-h-[50vh] xl:max-h-[48vh] 2xl:max-h-[65vh] lg:min-h-[50vh] xl:min-h-[58vh] 2xl:min-h-[70vh]'>
                            <table className='table-style w-full min-w-[3495px]'>
                                <thead className='!border-b-0 sticky top-0 z-40'>
                                    <tr className='text-gray-700 uppercase bg-blue-300 dark:bg-gray-700 dark:text-gray-400 rounded-t-lg'>
                                        {taskTableList &&
                                            taskTableList.map(function (data, key) {

                                                return (
                                                    <React.Fragment key={key}>
                                                        {data.isVisible && (
                                                            <th
                                                                className={data.sort !== null ? 'w-[190px] text-base cursor-pointer' : 'w-[190px] text-base'}
                                                                onClick={() => {
                                                                    if (data.sort !== null) {
                                                                        // Check if the column is already sorted in descending order
                                                                        if (data.sort === 'DESC') {
                                                                       
                                                                            handleShorting('asc', data.name, data.value);
                                                                        } else {
                                                                          
                                                                            handleShorting('desc', data.name, data.value);

                                                                        }
                                                                    }
                                                                }}>
                                                            {data.name  !== "Est.Date" && data.name  !== "Due date" && data.name  !== "Created At" ? (
                                                                <Tooltip className='max-w-[16rem] bg-gray-600 dark:text-[#fff] before:absolute before:top-[120%] before:-translate-y-[120%] before:-translate-x-[50%] before:left-[50%] before:transform before:rotate-45 before:border-gray-600 before: before:border-t before:border-[5px]' content={data?.sortingOrder ?? 'Aa->Zz'}>
                                                                <div className='flex items-center justify-center'>
                                                                    {data.name}
                                                                    {data.sort && data.sort !== null && data.sort === 'ASC' ? (
                                                                        <FaArrowDown />
                                                                    ) : data.sort && data.sort !== null ? (
                                                                        <FaArrowUp />
                                                                    ) : null}
                                                                </div>
                                                                </Tooltip>):
                                                                (
                                                                    <Tooltip className='max-w-[16rem] bg-gray-600 dark:text-[#fff] before:absolute before:top-[120%] before:-translate-y-[120%] before:-translate-x-[50%] before:left-[50%] before:transform before:rotate-45 before:border-gray-600 before: before:border-t before:border-[5px]' content={ data.sort === 'DESC'?"Sort:Newest to Oldest":"Sort:Oldest to Newest"}>
                                                                <div className='flex items-center justify-center'>
                                                                    {data.name}
                                                                    {data.sort && data.sort !== null && data.sort === 'ASC' ? (
                                                                        <FaArrowDown />
                                                                    ) : data.sort && data.sort !== null ? (
                                                                        <FaArrowUp />
                                                                    ) : null}
                                                                </div>
                                                                </Tooltip>
                                                                )}
                                                            </th>
                                                        )}
                                                    </React.Fragment>
                                                );
                                            })}
                                    </tr>
                                </thead>
                                <tbody className=''>
                                    {taskDetails && taskDetails.length === 0 && (
                                            <tr>
                                                <td colSpan={20} style={{ margin: '30px 0px 0px 500px', textAlign: 'center', padding: '30px' }}>No data</td>
                                            </tr>
                                    )}
                                    {!taskDetails && (
                                        <tr>
                                            <th colSpan={2}>
                                                <TinnySpinner />
                                            </th>
                                        </tr>
                                    )}
                                    {taskDetails &&
                                        taskDetails.map(function (data, key) {
                                            return (
                                                <React.Fragment key={key}>
                                                    <tr className=''>
                                                        {/* dropdown icon */}
                                                        {checkVisibility('projectName') && (
                                                            <td className='w-[190px] border-l-[1px] border-[#e5e5e5]'>
                                                                <div className='flex items-center justify-center'>
                                                                    {data.projectId ? (
                                                                        <>
                                                                            <div className='w-[20%] flex items-center justify-center' onClick={event => handleEpandRow(event, data._id)}>
                                                                                {data.subTasks && data.subTasks.length != 0 ? (
                                                                                    expandedRows.includes(data._id) ? (
                                                                                        <BsFillCaretUpFill size={20} />
                                                                                    ) : (
                                                                                        <BsFillCaretDownFill size={20} />
                                                                                    )
                                                                                ) : (
                                                                                    ''
                                                                                )}
                                                                            </div>
                                                                            <div className='w-[60%] break-words'>{data.projectName}</div>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <div className='w-[20%] ' onClick={event => handleEpandRow(event, data._id)}>
                                                                                {data.subTasks && data.subTasks.length != 0 ? (
                                                                                    expandedRows.includes(data._id) ? (
                                                                                        <BsFillCaretUpFill size={20} />
                                                                                    ) : (
                                                                                        <BsFillCaretDownFill size={20} />
                                                                                    )
                                                                                ) : (
                                                                                    ''
                                                                                )}
                                                                            </div>
                                                                            <div className='w-[60%] break-words'>Not Assigned</div>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </td>
                                                        )}
                                                        {/* taskTitle name */}
                                                        {checkVisibility('taskTitle') && (
                                                            <td className='w-[190px] border-l-[1px] border-[#e5e5e5]'>
                                                                <b className=' flex justify-center'>
                                                                    <a
                                                                        onClick={() => {
                                                                            router.push('/w-m/tasks/' + data._id);
                                                                        }}
                                                                        className='cursor-pointer hover:text-brandBlue w-[100px] break-words text-center'>
                                                                        {' '}
                                                                        {data.taskTitle}
                                                                    </a>
                                                                </b>
                                                            </td>
                                                        )}
                                                        {checkVisibility('createdBy') && (
                                                            <td className='w-[190px] border-l-[1px] border-[#e5e5e5]'>
                                                                <div className='flex justify-center -space-x-4'>
                                                                    {data.taskCreator && (
                                                                        <ToolTip className='relative w-[30px] h-[30px] bg-white shadow-md rounded-full' message={data.taskCreator.firstName} >
                                                                             <img onClick={()=>handleUserClick(data.taskCreator.isAdmin ,data.taskCreator.id,data.taskCreator.isSuspended)} style={{ cursor: 'pointer' }}
                                                                                src={data.taskCreator.profilePic ?? USER_AVTAR_URL + data?.taskCreator?.firstName + '.svg'}
                                                                                className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 w-10 h-10 rounded-full'
                                                                                alt='user'
                                                                            />
                                                                        </ToolTip>
                                                                    )}
                                                                </div>
                                                            </td>
                                                        )}
                                                        {checkVisibility('priority') && (
                                                            <td className='w-[190px] border-l-[1px] border-[#e5e5e5]'>
                                                                <b className='flex justify-center'>
                                                                    {data.priority === 'High' ? (
                                                                        <p className='max-w-fit mr-[14px] priority-with-bg text-priority1Color bg-priority1bg'>{data.priority}</p>
                                                                    ) : data.priority === 'Medium' ? (
                                                                        <p className='max-w-fit mr-[14px] priority-with-bg text-priority2Color bg-priority2bg'>{data.priority}</p>
                                                                    ) : (
                                                                        <p className='max-w-fit mr-[14px] priority-with-bg text-priority3Color bg-priority3bg'>{data.priority}</p>
                                                                    )}
                                                                </b>
                                                            </td>
                                                        )}
                                                        {checkVisibility('createdAt') && (
                                                            <td className='w-[190px] border-l-[1px] border-[#e5e5e5]'>
                                                                <b className=' flex justify-center'>{formatedDate(data.createdAt)} </b>
                                                            </td>
                                                        )}
                                                        {/* due date */}
                                                        {checkVisibility('dueDate') && (
                                                            <td className='w-[190px] border-l-[1px] border-[#e5e5e5]'>
                                                                <b className=' flex justify-center'>{formatedDate(data.dueDate)} </b>
                                                            </td>
                                                        )}
                                                       {checkVisibility('completedDate') && (
                                                        <td className='w-[190px] border-l-[1px] border-[#e5e5e5]'>
                                                            <b className=' flex justify-center'>{data.completedDate ? formatedDate(data.completedDate) : 'Not Completed'}</b>
                                                        </td>
                                                        )}
                                                       {checkVisibility('reason') && (
                                                        <td className={'w-[190px] border-l-[1px] border-[#e5e5e5]'}>
                                                            <div className=' flex justify-center'>

                                                            {data.reason ? (
                                                                <b className='break-all'>{data.reason}</b>
                                                            ) : (
                                                                <ToolTip message="No Overdue found">
                                                                <b>-----</b>
                                                                </ToolTip>
                                                            )}
                                                                </div>
                                                        </td>
                                                        )}
                                                        {checkVisibility('estimationTime') && (
                                                            <td className='w-[190px] border-l-[1px] border-[#e5e5e5]'>
                                                                <b className='flex justify-center'>{data.estimationTime} </b>
                                                            </td>
                                                        )}
                                                        {checkVisibility('estimationDate') && (
                                                            <td className='w-[190px] border-l-[1px] border-[#e5e5e5]'>
                                                                <b className=' flex justify-center'>{formatedDate(data.estimationDate)} </b>
                                                            </td>
                                                        )}
                                                        {/* assigned to */}
                                                        {checkVisibility('members') || checkVisibility("assignedTo")  && (
                                                            <td className='w-[190px] border-l-[1px] border-[#e5e5e5]'>
                                                                <div className='user-profile-img flex justify-center user-img-group items-center cursor-pointer -space-x-4'>
                                                                    {data.assignedTo.length == 0 && <>Not Assigned</>}
                                                                    {data.assignedTo?.length <= 1 ? (
                                                                        data.assignedTo.map(function (d1) {
                                                                            return (
                                                                                <ToolTip className='relative w-[30px] h-[30px] shadow-md rounded-full' message={d1.firstName + ' ' + d1.lastName} >
                                                                                     <img onClick={()=>handleUserClick(d1.isAdmin ,d1._id,d1.isSuspended)} style={{ cursor: 'pointer' }}
                                                                                        src={d1.profilePic}
                                                                                        className='bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 w-10 h-10 rounded-full'
                                                                                        alt='-'
                                                                                    />
                                                                                </ToolTip>
                                                                            )
                                                                        })
                                                                        ) : (
                                                                            <div className='flex items-center justify-center -space-x-4'>
                                                                                <div className='relative w-[30px] h-[30px] shadow-md rounded-full  flex flex-col items-center group'>
                                                                                    <img
                                                                                        className='bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 w-10 h-10 rounded-full'
                                                                                        src={data.assignedTo === undefined ? [] : data.assignedTo[0].profilePic ?? USER_AVTAR_URL + `${data.assignedTo[0].firstName}.svg`}
                                                                                        alt=''
                                                                                    />
                                                                                </div>
                                                                                {/* <div className='relative w-[30px] h-[30px] shadow-md rounded-full  flex flex-col items-center group' >
                                                                                    <img
                                                                                        className='bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 w-10 h-10 rounded-full'
                                                                                        src={data.assignedTo === undefined ? [] : data.assignedTo[1].profilePic ?? USER_AVTAR_URL + `${data.assignedTo[1].firstName}.svg`}
                                                                                        alt=''
                                                                                    />
                                                                                </div> */}
                                                                                <MemberModal members={data.assignedTo ? data.assignedTo : ""} remainingCount={data.assignedTo?.length - 1}  />
                                                                            </div>
                                                                    )}
                                                                </div>
                                                            </td>
                                                        )}
                                                        {/* task type  */}
                                                        {checkVisibility('taskType') && (
                                                            <td className='w-[190px] border-l-[1px] border-[#e5e5e5]'>
                                                                <b className='flex justify-center'>{data.taskType}</b>
                                                            </td>
                                                        )}
                                                        {checkVisibility('category') && (
                                                            <td className='w-[190px] border-l-[1px] border-[#e5e5e5]'>
                                                                <b className='flex justify-center'>{data.category}</b>
                                                            </td>
                                                        )}
                                                        {/* status */}
                                                        {checkVisibility('taskStatus') && (
                                                            <td className='w-[190px] border-l-[1px] border-[#e5e5e5]'>
                                                                <b className='flex justify-center'>
                                                                    <DropDownWithTick
                                                                        paddingForDropdown={'py-2'}
                                                                        onChangeValue={handleChangeStatus}
                                                                        data={
                                                                            statusDetails &&
                                                                            statusDetails.map(d => {
                                                                                return {
                                                                                    name: d.taskStatus,
                                                                                    value: d.taskStatus,
                                                                                };
                                                                            })
                                                                        }
                                                                        width={'w-26'}
                                                                        value={data.taskStatus}
                                                                        id={data._id}
                                                                        handle={undefined}
                                                                        selectedData={undefined}
                                                                        icon={undefined}
                                                                        roundedSelect={undefined}
                                                                        className={'relative'}
                                                                        type={undefined}
                                                                    />
                                                                </b>
                                                            </td>
                                                        )}
                                                        {checkVisibility('stageName') && (
                                                            <td className='w-[190px] border-l-[1px] border-[#e5e5e5]'>
                                                                <b className='flex justify-center'>{data.stageName}</b>
                                                            </td>
                                                        )}
                                                      
                                                       {checkVisibility('progress') && (
                                                    <td className='w-[190px] border-l-[1px] border-[#e5e5e5]'>
                                                        {/* progressbar */}
                                                        <div className='w-full mx-auto'>
                                                            <span className=' text-defaultTextColor text-sm'>{data.progress ?? 0}%</span>
                                                            <div className='w-full bg-veryLightGrey h-2 rounded-full dark:bg-veryLightGrey'>
                                                                <div
                                                                    className='bg-redColor text-[0.5rem] h-2 font-medium text-blue-100 text-center p-0.5 leading-none rounded-full'
                                                                    style={{ width: `${data.progress ?? 0}%` }} ></div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                )}

                                                        {checkVisibility('action') && (
                                                            <td className='w-[190px] border-l-[1px] border-[#e5e5e5]'>
                                                                <b>
                                                                    <div className='flex justify-center text-xl'>
                                                                        <NoSsr>
                                                                            {permission?.task.edit === true || Cookies.get('isAdmin') === 'true' ? (
                                                                                <ToolTip message={'Edit/View'}>
                                                                                    <CreateOrEditTask
                                                                                        type={'edit'}
                                                                                        data={data}
                                                                                        {...{
                                                                                            projectList,
                                                                                            users,
                                                                                            data,
                                                                                            taskTypeDetails,
                                                                                            stageList,
                                                                                            handleGetAllTask,
                                                                                            handleGetAllUsers,
                                                                                            handleGetAllGroup,
                                                                                            stopLoading,
                                                                                            startLoading,
                                                                                            groupList,
                                                                                            roleList,
                                                                                            categoryList,
                                                                                            statusDetails,
                                                                                            handleGetUpdatedData
                                                                                        }}
                                                                                    />
                                                                                </ToolTip>
                                                                            ) : (
                                                                                <></>
                                                                            )}
                                                                            {permission?.task.delete === true || Cookies.get('isAdmin') === 'true' ? (
                                                                                <ToolTip message={'Delete'}>
                                                                                    <button
                                                                                        className='red-link mr-4'
                                                                                        onClick={() => {
                                                                                            setDeleteMessage('Delete Task ' + '"' + data.taskTitle + '"');
                                                                                            setDeleteTaskId(data._id);
                                                                                            setOpenDeleteModel(true);
                                                                                        }}>
                                                                                        <AiOutlineDelete />
                                                                                    </button>
                                                                                </ToolTip>
                                                                            ) : (
                                                                                <></>
                                                                            )}
                                                                            {permission?.subtask.create === true || Cookies.get('isAdmin') === 'true' ? (
                                                                                <ToolTip message={'Subtask'}>
                                                                                    <CreateOrEditSubtask
                                                                                        subtaskType={''}
                                                                                        data={data}
                                                                                        filterType={type}
                                                                                        {...{
                                                                                            taskList,
                                                                                            projectList,
                                                                                            handleGetAllTask,
                                                                                            handleGetAllUsers,
                                                                                            handleGetAllGroup,
                                                                                            users,
                                                                                            data,
                                                                                            taskDetails,
                                                                                            taskTypeDetails,
                                                                                            stopLoading,
                                                                                            startLoading,
                                                                                            groupList,
                                                                                            roleList,
                                                                                            stageList,
                                                                                            categoryList,
                                                                                            searchKeyword,
                                                                                            sortTable,
                                                                                            handleGetFilterTask,
                                                                                            handleSearchTask,
                                                                                            statusDetails
                                                                                        }}
                                                                                    />
                                                                                </ToolTip>
                                                                            ) : (
                                                                                <></>
                                                                            )}
                                                                        </NoSsr>
                                                                    </div>
                                                                </b>
                                                            </td>
                                                        )}
                                                    </tr>
                                                        {expandedRows.includes(data._id) ? (
                                                        <tr><td colSpan={20} style={{padding: 0}}>
                                                            <table className='bg-[#efefef] dark:bg-gray-900 dark:shadow-gray-950 border border-[#fff] shadow-inner-table-row table-style w-full '>
                                                                <tbody>
                                                                    {data?.subTasks?.map(function (item, key) {
                                                                        return (
                                                                            <tr key={key}>
                                                                                {checkVisibility('projectName') && <td className='w-[190px] border-l-[1px] border-[#e5e5e5]'></td>}
                                                                                {checkVisibility('taskTitle') && (
                                                                                    <td className='w-[190px] border-l-[1px] border-[#e5e5e5]'>
                                                                                        <div className=' flex justify-center '>{item.subTaskTitle}</div>
                                                                                    </td>
                                                                                )}
                                                                                {checkVisibility('createdBy') && (
                                                                                    <td className='w-[190px] border-l-[1px] border-[#e5e5e5]'>
                                                                                        <div className='flex justify-center -space-x-4'>
                                                                                            {item.subTaskCreator && (
                                                                                                <ToolTip
                                                                                                    className='relative w-[30px] bg-white h-[30px] shadow-md rounded-full'
                                                                                                    message={item.subTaskCreator.firstName} >
                                                                                                    <img onClick={()=>handleUserClick(item.subTaskCreator.isAdmin ,item.subTaskCreator.id,item.subTaskCreator.isSuspended)} style={{ cursor: 'pointer' }}
                                                                                                        src={USER_AVTAR_URL + item.subTaskCreator.firstName + '.svg'}
                                                                                                        className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 w-10 h-10 rounded-full'
                                                                                                        alt='-'
                                                                                                    />
                                                                                                </ToolTip>
                                                                                            )}
                                                                                        </div>
                                                                                    </td>
                                                                                )}
                                                                                {checkVisibility('priority') && (
                                                                                    <td className='w-[190px] border-l-[1px] border-[#e5e5e5]'>
                                                                                    <div className=' flex justify-center'>
                                                                                        {item.priority === 'High' ? (
                                                                                            <p className='max-w-fit mr-[14px] priority-with-bg text-priority1Color bg-priority1bg'>{item.priority}</p>
                                                                                        ) : item.priority === 'Medium' ? (
                                                                                            <p className='max-w-fit mr-[14px] priority-with-bg text-priority2Color bg-priority2bg'>{item.priority}</p>
                                                                                        ) : (
                                                                                            <p className='max-w-fit mr-[14px] priority-with-bg text-priority3Color bg-priority3bg'>{item.priority}</p>
                                                                                        )}
                                                                                    </div>
                                                                                    </td>
                                                                                )}
                                                                                {checkVisibility('createdAt') && (
                                                                                    <td className='w-[190px] border-l-[1px] border-[#e5e5e5]'>
                                                                                        <b className='flex justify-center'>{formatedDate(item.createdAt)} </b>
                                                                                    </td>
                                                                                )}
                                                                                {checkVisibility('dueDate') && <td className='w-[190px] border-l-[1px] border-[#e5e5e5]'>
                                                                                <div className='flex justify-center'>
                                                                                {formatedDate(item.dueDate)}
                                                                                </div>
                                                                                </td>}
                                                                                {checkVisibility('completedDate') && <td className='w-[190px] border-l-[1px] border-[#e5e5e5]'>
                                                                                <div className='flex justify-center'>
                                                                                { item.completedDate ? (
                                                                                    formatedDate(item.completedDate)
                                                                                    ) : (
                                                                                        'Not Completed'
                                                                                    )}
                                                                                </div>
                                                                                </td>
                                                                                }

                                                                                {checkVisibility('reason') && ( <td className={'w-[190px] border-l-[1px] border-[#e5e5e5]'}>
                                                                                <div className='flex justify-center'>
                                                                                {item.reason ? (
                                                                                                    formatedDate(item.reason.leght)
                                                                                                ) : (
                                                                                                    <ToolTip message="No Overdue found">
                                                                                                    -----
                                                                                                    </ToolTip>
                                                                                                )}
                                                                                </div>
                                                                                                </td>
                                                                                )}
                                                                                {checkVisibility('estimationTime') && <td className='w-[190px] border-l-[1px] border-[#e5e5e5]'>
                                                                                <div className='flex justify-center'>
                                                                                {formatedDate(item.estimationTime)}
                                                                                </div>
                                                                                </td>}
                                                                                {checkVisibility('estimationDate') && <td className='w-[190px] border-l-[1px] border-[#e5e5e5]'>
                                                                                <div className='flex justify-center'>
                                                                                {formatedDate(item.estimationDate)}
                                                                                </div>
                                                                                </td>}

                                                                                {checkVisibility('members') || checkVisibility("assignedTo") && (
                                                                                    <td className='w-[190px] border-l-[1px] border-[#e5e5e5]'>
                                                                                        <b>
                                                                                            <div className='flex justify-center -space-x-4'>
                                                                                                {filterMembers(item.subTaskAssignedTo).length == 0 && <>Not Assigned</>}
                                                                                                {filterMembers(item.subTaskAssignedTo)?.length <= 1 ? (
                                                                                                    filterMembers(item.subTaskAssignedTo).map(function (d1) {
                                                                                                        return (
                                                                                                            <ToolTip className='relative w-[30px] h-[30px] shadow-md rounded-full' message={d1.firstName + ' ' + d1.lastName}>
                                                                                                                <img onClick={()=>handleUserClick(d1.isAdmin ,d1._id,d1.isSuspended)} style={{ cursor: 'pointer' }}
                                                                                                                    src={d1.profilePic}
                                                                                                                    className='bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 w-10 h-10 rounded-full'
                                                                                                                    alt='-'
                                                                                                                />
                                                                                                            </ToolTip>
                                                                                                        )
                                                                                                    })
                                                                                                ) : (
                                                                                                    <div className='flex items-center justify-center -space-x-4'>
                                                                                                        <div className='relative w-[30px] h-[30px] shadow-md rounded-full  flex flex-col items-center group'>
                                                                                                            <img
                                                                                                                className='bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 w-10 h-10 rounded-full'
                                                                                                                src={ filterMembers(item.subTaskAssignedTo) === undefined ? [] : filterMembers(item.subTaskAssignedTo)[0].profilePic ?? USER_AVTAR_URL + `${filterMembers(item.subTaskAssignedTo)[0].firstName}.svg`}
                                                                                                                alt=''
                                                                                                            />
                                                                                                        </div>
                                                                                                        {/* <div className='relative w-[30px] h-[30px] shadow-md rounded-full  flex flex-col items-center group' >
                                                                                                            <img
                                                                                                                className='bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 w-10 h-10 rounded-full'
                                                                                                                src={filterMembers(item.subTaskAssignedTo) === undefined ? [] : filterMembers(item.subTaskAssignedTo)[1].profilePic ?? USER_AVTAR_URL + `${filterMembers(item.subTaskAssignedTo)[1].firstName}.svg`}
                                                                                                                alt=''
                                                                                                            />
                                                                                                        </div> */}
                                                                                                        <MemberModal members={item.subTaskAssignedTo ? filterMembers(item.subTaskAssignedTo) : ""} remainingCount={filterMembers(item.subTaskAssignedTo)?.length - 1}  />
                                                                                                    </div>
                                                                                                )
                                                                                                }


                                                                                            </div>
                                                                                        </b>
                                                                                    </td>
                                                                                )}
                                                                                {checkVisibility('taskType') && <td className='w-[190px] border-l-[1px] border-[#e5e5e5]'>
                                                                                <div className='flex justify-center'>
                                                                                {item.subTaskType}
                                                                                </div>
                                                                                </td>}
                                                                                {checkVisibility('category') && <td className='w-[190px] border-l-[1px] border-[#e5e5e5]'>
                                                                                <div className='flex justify-center'>
                                                                                {item.subTaskCategory}
                                                                                </div>
                                                                                </td>}
                                                                                {checkVisibility('taskStatus') && (
                                                                                    <td className='w-[190px] border-l-[1px] border-[#e5e5e5]'>
                                                                                        <b className=' flex justify-center'>
                                                                                            <DropDownWithTick
                                                                                                paddingForDropdown={'py-2'}
                                                                                                onChangeValue={handleChangeSubtaskStatus}
                                                                                                width={'w-26'}
                                                                                                value={item.subTaskStatus}
                                                                                                id={item._id}
                                                                                                handle={undefined}
                                                                                                selectedData={undefined}
                                                                                                icon={undefined}
                                                                                                roundedSelect={undefined}
                                                                                                className={'relative'}
                                                                                                type={undefined}
                                                                                                data={
                                                                                                    statusDetails &&
                                                                                                    statusDetails.map(d => {
                                                                                                        return {
                                                                                                            name: d.taskStatus,
                                                                                                            value: d.taskStatus,
                                                                                                        }
                                                                                                    })
                                                                                                }
                                                                                            />
                                                                                        </b>
                                                                                    </td>
                                                                                )}
                                                                                {checkVisibility('stageName') && <td className='w-[190px] border-l-[1px] border-[#e5e5e5]'>
                                                                                <div className='flex justify-center'>
                                                                                {item.subTaskStageName}
                                                                                </div>
                                                                                </td>}

                                                                                {checkVisibility('progress') && (
                                                                                    <td className='w-[190px] border-l-[1px] border-[#e5e5e5]'>
                                                                                        {/* progressbar */}
                                                                                        <div className='w-full mx-auto'>
                                                                                            <span className=' text-defaultTextColor text-sm'>{item.progress ?? 0}%</span>
                                                                                            <div className='w-full bg-veryLightGrey h-2 rounded-full dark:bg-veryLightGrey'>
                                                                                                <div
                                                                                                    className='bg-redColor text-[0.5rem] h-2 font-medium text-blue-100 text-center p-0.5 leading-none rounded-full'
                                                                                                    style={{ width: `${item.progress ?? 0}%` }} ></div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </td>
                                                )}
                                                                                {checkVisibility('action') && (
                                                                                    <td className='w-[190px] border-l-[1px] border-[#e5e5e5]'>
                                                                                        <b>
                                                                                            <div className='flex justify-center text-xl'>
                                                                                                <NoSsr>
                                                                                                    {permission?.subtask.edit === true || Cookies.get('isAdmin') === 'true' ? (
                                                                                                        <ToolTip message={'Edit'}>
                                                                                                            <CreateOrEditSubtask
                                                                                                                taskTypeDetails={taskTypeDetails}
                                                                                                                subtaskType={'edit'}
                                                                                                                data={item}
                                                                                                                filterType={type}
                                                                                                                {...{
                                                                                                                    taskList,
                                                                                                                    projectList,
                                                                                                                    users,
                                                                                                                    taskDetails,
                                                                                                                    taskTypeDetails,
                                                                                                                    handleGetAllTask,
                                                                                                                    handleGetAllUsers,
                                                                                                                    handleGetAllGroup,
                                                                                                                    stopLoading,
                                                                                                                    startLoading,
                                                                                                                    groupList,
                                                                                                                    roleList,
                                                                                                                    stageList,
                                                                                                                    categoryList,
                                                                                                                    searchKeyword,
                                                                                                                    sortTable,
                                                                                                                    handleGetFilterTask,
                                                                                                                    handleSearchTask,
                                                                                                                    statusDetails
                                                                                                                }}
                                                                                                            />
                                                                                                        </ToolTip>
                                                                                                    ) : (
                                                                                                        <></>
                                                                                                    )}
                                                                                                    {permission?.subtask.delete === true || Cookies.get('isAdmin') === 'true' ? (
                                                                                                         <ToolTip message={'Delete'}>
                                                                                                            <button
                                                                                                                className='red-link mr-4'
                                                                                                                onClick={() => {
                                                                                                                    setDeleteMessage('Delete Task ' + '"' + item.subTaskTitle + '"');
                                                                                                                    setDeleteSubTaskId(item._id);
                                                                                                                    setOpenDeleteSubtaskModel(true);
                                                                                                                }}>
                                                                                                                <AiOutlineDelete />
                                                                                                            </button>
                                                                                                        </ToolTip>
                                                                                                    ) : (
                                                                                                        <></>
                                                                                                    )}
                                                                                                </NoSsr>
                                                                                            </div>
                                                                                        </b>
                                                                                    </td>
                                                                                )}
                                                                            </tr>
                                                                        );
                                                                    })}
                                                                </tbody>
                                                            </table>
                                                        </td></tr>
                                                        ) : null}
                                                </React.Fragment>
                                            );
                                        })}
                                </tbody>
                            </table>
                        </div>
                        {taskDetails && taskDetails.length != 0 && (
                            <div className='flex justify-between items-center'>
                                <p className='p-0 m-0 text-lightTextColor dark:text-[#fff] text-base sm:my-4 my-2'>
                                    Showing {sortTable.limit * (sortTable.pageNo - 1) + 1} to {sortTable.limit * sortTable.pageNo < taskCount ? sortTable.limit * sortTable.pageNo : taskCount} of{' '}
                                    {taskCount}
                                </p>
                                <div className='flex items-center '>
                                    <button
                                        disabled={sortTable.pageNo == 1}
                                        onClick={() => {
                                            handlePaginationTasks('?skip=' + ((sortTable.limit*sortTable.pageNo)-(sortTable.limit*2)) + '&limit=' + sortTable.limit);
                                            setSortTable({ ...sortTable, pageNo: sortTable.pageNo - 1 ,skip: (sortTable.limit*sortTable.pageNo)-(sortTable.limit*2)});
                                        }}
                                        className='disabled:opacity-25  disabled:cursor-not-allowed  arrow_left border mx-1 bg-veryveryLightGrey cursor-pointer hover:bg-defaultTextColor hover:text-white'>
                                        <MdKeyboardArrowLeft className=' dark:text-[#fff]' />
                                    </button>
                                    <div className='pages'>
                                        <p className='p-0 m-0 text-lightTextColor dark:text-[#fff] text-base sm:my-4 my-2'>
                                            Page <span>{sortTable.pageNo}</span>
                                        </p>
                                    </div>
                                    <button
                                        disabled={sortTable.pageNo === Math.ceil(taskCount / sortTable.limit)}
                                        onClick={() => {
                                            handlePaginationTasks('?skip=' + sortTable.limit*sortTable.pageNo + '&limit=' + sortTable.limit);
                                            setSortTable({
                                                ...sortTable,
                                                pageNo: sortTable.pageNo + 1,
                                                skip: sortTable.pageNo * sortTable.limit,
                                            });
                                        }}
                                        className='disabled:cursor-not-allowed  arrow_right border mx-1 bg-veryveryLightGrey cursor-pointer hover:bg-defaultTextColor hover:text-white'>
                                        <MdKeyboardArrowRight className='dark:text-[#fff]'/>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    <DeleteConformation
                        open={openDeleteModel}
                        close={() => {
                            setOpenDeleteModel(!openDeleteModel);
                        }}
                        message={deleteMessage}
                        onClick={handleDeleteTaskById}
                    />
                    <DeleteConformation
                        open={openDeleteAllModel}
                        close={() => {
                            setOpenDeleteAllModel(!openDeleteAllModel);
                        }}
                        message={'Delete All Tasks'}
                        onClick={handleDeleteAllTask}
                    />
                    <DeleteConformation
                        open={openDeleteSubtaskModel}
                        close={() => {
                            setOpenDeleteSubtaskModel(!openDeleteSubtaskModel);
                        }}
                        message={deleteMessage}
                        onClick={handleDeleteSubTaskById}
                    />
                </>
            )}
        </>
    );
};
export default index;
