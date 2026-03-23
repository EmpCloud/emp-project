import { AiOutlineLeft } from "react-icons/ai"; 
import { AiOutlineRight } from "react-icons/ai"; 
import { MdTitle } from "react-icons/md"; 
import QRCode from 'qrcode.react';
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState, useRef ,useMemo} from 'react';
import { Calendar, CheckSquare, List, Tag, Trash, Type, ExternalLink, PlusCircle, User, Framer ,Clock} from 'react-feather';
import Modal from '../../Modal/Modal';
import ShareModal from '../../Modal/ShareModal';
import CustomInput from '../../CustomInput/CustomInput';
import DeleteConformation from '@COMPONENTS/DeleteConformation';
import ToolTip from '@COMPONENTS/ToolTip';
import Chip from '../../Common/Chip';
import { colorsList } from '../../Helper/Util';
import { BiCloudUpload, BiEditAlt, BiSolidShareAlt } from 'react-icons/bi';
import { ICard, ILabel, ITask } from '../../Interfaces/Kanban';
import { deleteSubTask, deleteSubTaskById } from 'src/trelloBoard/Helper/api/delete';
import toast from '../../../../src/components/Toster';
import TinnySpinner from '../../../components/TinnySpinner';
import DropDownWithTick from '../../../components/DropDownWithTick';
import { UpdateSubTaskStatusById, updateSubTask, updateTaskStatus } from 'src/trelloBoard/Helper/api/put';
import { createSubtaskApi, uploadFilesInGCB } from 'src/trelloBoard/Helper/api/post';
import AssignedMembers from './AssignedMembers';
import { getActivity, getAllStages, getAllTask, getAllTaskType, getAllUsers, getTaskById } from 'src/trelloBoard/Helper/api/get';
import { ImCross } from 'react-icons/im';
import { RxActivityLog } from 'react-icons/rx';
import Cookies from 'js-cookie';
import { AiOutlineDelete } from 'react-icons/ai';
import { commentSchema } from '@HELPER/schema';
import validate from 'validate.js';
import NewToolTip from '../../../components/NewToolTip';
import { LiaCommentSlashSolid } from 'react-icons/lia';
import { GoComment, GoCommentDiscussion } from 'react-icons/go';
import { VscCommentUnresolved } from 'react-icons/vsc';
import InputEmoji from 'react-input-emoji';
import { AiOutlineSend } from 'react-icons/ai';
import { capitalizeString, displayErrorMessage, openUpgradePlan } from '../../../../src/helper/function';
import { getCommentsApi } from '@WORKFORCE_MODULES/task/api/get';
import { createCommentApi, createReplyCommentApi } from '@WORKFORCE_MODULES/task/api/post';
import { deleteCommentApi, deleteReplyCommentApi } from '@WORKFORCE_MODULES/task/api/delete';
import { updateCommentApi } from '@WORKFORCE_MODULES/task/api/put';
import { MdDelete } from 'react-icons/md';
import TextArea from './../../CustomInput/TextArea';
import { fetchProfile } from '@WORKFORCE_MODULES/admin/api/get';
import { X } from 'react-feather';
import { FloatingOnlySelectfield } from '@COMPONENTS/FloatingOnlySelectfield';
import DescriptionField from './DescriptionField';
import NoSsr from '@COMPONENTS/NoSsr';
import dynamic from 'next/dynamic';

interface CardInfoProps {
    onClose: () => void;
    tasks: ICard;
    boardId: number;
    updateCard: (boardId: number, cardId: number, tasks: ICard, subTasks: ICard) => void;
}
function CardInfo(props: CardInfoProps) {
    const { onClose, boardId, updateCard, tasks, fetchData, projectId, projects, projectNames, performDataFetch, urlId, type, cardValue } = props;
    const [selectedColor, setSelectedColor] = useState('');
    const [tinySpinner, setTinySpinner] = useState(false);
    const [uploadedData, setUploadedData] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [taskTypeDetails, setTaskTypeDetails] = useState(null);
    const [stageDetails, setStageDetails] = useState(null);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [activityData, setActivityData] = useState([]);
    const [showComments, setshowComments] = useState(true);
    const [taskDetail, setTaskDetail] = useState(null);
    const [commentsFilter, setcommentsFilter] = useState(false);
    const [userName, setuserName] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [taskId, setTaskId] = useState(tasks?._id);
    const [shareLinks, setCopyLink] = useState(false);
    const [permission, setPermission] = useState(null);
    const [showInput, setShowInput] = useState(null);

    // useEffect(() => {
    //     if (urlId !== null) {
    //         setTaskId(urlId);
    //     }
    // }, [urlId]);
    const handleProfileData = () => {
        fetchProfile().then(response => {
            if (response.data?.body.status === 'success') {
                setPermission(response.data.body.data.permissionConfig);
                
            }
        });
    };
    const DynamicCustomInput =useMemo(()=> dynamic(()=>import('./DescriptionField'), { ssr: false }),[]);

    const handleGetTaskById = (condition = ' ') => {
        getTaskById(condition)
            .then(response => {
                if (response.data.body.status === 'success') {
                    setTaskDetail(response.data.body.data);
                }
            })
            .catch(function (e) {
                //   stopLoading();
                toast({
                    type: 'error',
                    message: e.response ? e.response.data.body.message : 'you are not in this Organization to proceed',
                });
            });
    };
    useEffect(() => {
        handleGetTaskById('?Id=' + taskId);
    }, [taskId]);
    const [cardValues, setCardValues] = useState<ICard>({ ...tasks });
    // useEffect(()=>{
    //     if(cardValue!==null)
    //     setCardValues(cardValue)

    // },[cardValue])

    const handleGetTaskByUrlId = (condition = ' ') => {
        setTaskId(urlId);
        getTaskById(condition)
            .then(response => {
                if (response.data.body.status === 'success') {
                    setCardValues(response.data.body.data[0]);
                }
            handleGetAllActivity('?ActivityType=Task' + '&ActivityTypeId=' + taskId+'&limit=100&orderBy=createdAt&sort=desc&category=Updated');

            })
            .catch(function (e) {
                //   stopLoading();
                // toast({
                //     type: 'error',
                //     message: e.response ? e.response.data.body.message : 'you are not in this Organization to proceed!',
                // });
            });
    };
    useEffect(() => {
        if (type !== 'card' && urlId !== null) {
            handleGetTaskByUrlId(`?Id=${urlId}`);
        }
    }, [urlId, type]);

    const [ShowOrHide, setShowOrHide] = useState(true);

    const updateCardValues = () => {
        getAllTask(`Id=${taskId}`).then(response => {
            setCardValues(response?.data?.body?.data[0]);
        });
        performDataFetch();
    };

    const updateTitle = (value: string) => {
        if (!value) {
            toast({
                type: 'info',
                message: 'user have no access to change',
            });
            return;
        }
        let datas = JSON.stringify({
            taskTitle: value,
        });
        updateTaskStatus(datas, taskId, performDataFetch).then(response => {
            if (response.data.body.status === 'success') {
                toast({
                    type: 'success',
                    message: response ? response.data.body.message : 'Try again !',
                });
                updateCardValues();
                handleGetAllActivity('?ActivityType=Task' + '&ActivityTypeId=' + taskId+'&limit=100&orderBy=createdAt&sort=desc&category=Updated');
            } else {
                toast({
                    type: 'error',
                    message: response ? response.data.body.message : 'Try again !',
                });
                updateCardValues();
            }
        });
        // setCardValues({ ...cardValues, taskTitle: value });
    };
    const updateDesc = (value: string) => {
        if (!value) {
            toast({
                type: 'info',
                message: 'user have no access to change',
            });
            return;
        }
        let datas = JSON.stringify({
            taskDetails: value,
        });
        updateTaskStatus(datas, taskId, performDataFetch)
            .then(response => {
                if (response.data.body.status === 'success') {
                    toast({
                        type: 'success',
                        message: response ? response.data.body.message : 'Try again !',
                    });
                    updateCardValues();
                    handleGetAllActivity('?ActivityType=Task' + '&ActivityTypeId=' + taskId+'&limit=100&orderBy=createdAt&sort=desc&category=Updated');
                } else {
                    toast({
                        type: 'error',
                        message: response ? response.data.body.message : 'Try again !',
                    });
                    updateCardValues();
                }
            })
            .catch(e => {});
    };

    const handleFileUploadInPublic = event => {
        if (permission?.task?.edit === true || Cookies.get('isAdmin') === 'true') {
            setTinySpinner(true);
            const category = 'Task';
            event.persist();
            let formdata = new FormData();
            let maxSizePerFile;
            const files = event.target.files;

            // Define maximum file size based on file type
            const maxSizeForVideo = 500 * 1024 * 1024; // 500MB for video files
            const maxSizeForOther = 500 * 1024 * 1024; // 500MB for other files

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
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
                uploadFilesInGCB(formdata, category, taskId)
                    .then(response => {
                        if (response.data.code === 200) {
                            const uploadedUrls = response.data.data.filesUrls.map(fileUrl => fileUrl.url);
                            let existingAttachment = cardValues?.attachment?.length ? cardValues?.attachment : [];
                            setUploadedData([...uploadedUrls, ...existingAttachment]);

                            let datas = JSON.stringify({
                                attachment: [...uploadedUrls, ...existingAttachment],
                            });

                            updateTaskStatus(datas, taskId, performDataFetch)
                                .then(response => {
                                    if (response.data.body.status === 'success') {
                                        toast({
                                            type: 'success',
                                            message: response ? response.data.body.message : 'Try again !',
                                        });
                                        handleGetAllActivity('?ActivityType=Task' + '&ActivityTypeId=' + taskId+'&limit=100&orderBy=createdAt&sort=desc&category=Updated');

                                        updateCardValues();
                                    } else {
                                        toast({
                                            type: 'error',
                                            message: response ? response.data.body.message : 'Try again !',
                                        });
                                        updateCardValues();
                                    }
                                })
                                .catch(error => {
                                    toast({
                                        type: 'error',
                                        message: error ? error.data.body.error : 'Try again !',
                                    });
                                });
                            setTinySpinner(false);
                        } else {
                            toast({
                                type: 'error',
                                message: response ? response.data.body.message : 'Try again !',
                            });
                            setTinySpinner(false);
                        }
                    })
                    .catch(error => {
                        toast({
                            type: 'error',
                            message: error ? error?.data?.body?.message : 'Try again !',
                        });
                        setTinySpinner(false);
                    });
            }
        }
    };

    const removeLabel = (label: string) => {
        const tempLabels = cardValues.labels.filter(item => item.text !== label.text);
        setCardValues({
            ...cardValues,
            labels: tempLabels,
        });
    };
    const addTask = (statusCode: string, value: string) => {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + 1);
        let data = JSON.stringify({
            taskId: taskId,
            subTaskTitle: value,
            subTaskDetails: 'subTaskDetails',
            estimationDate: currentDate,
            subTaskStatus: 'Todo',
            estimationTime: '8:00',
            subTaskType: 'Default',
            subTaskCategory: 'Default',
            subTaskStageName: 'Default',
            priority: 'Low',
        });
        createSubtaskApi(data)
            .then(function (result) {
                if (result.data && result.data.body.status === 'success') {
                    toast({
                        type: 'success',
                        message: result ? result.data.body.message : 'Try again !',
                    });
            handleGetAllActivity('?ActivityType=Task' + '&ActivityTypeId=' + taskId+'&limit=100&orderBy=createdAt&sort=desc&category=Created');
            updateCardValues();
                } else {
                    toast({
                        type: 'error',
                        message: result ? result.data.body.message : 'Something went wrong, Try again !',
                    });
                    updateCardValues();
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
            });
    };
    const handleDeleteSubTaskById = deleteSubTaskId => {
        if (permission?.task?.edit === true || Cookies.get('isAdmin') === 'true') {
            deleteSubTaskById(deleteSubTaskId, updateCardValues)
                .then(function (result) {
                    if (result.data.body.status == 'success') {
                        toast({
                            type: 'success',
                            message: result ? result.data.body.message : 'Try again !',
                        });
                        updateCardValues();
                        handleGetAllActivity('?ActivityType=SubTask' + '&ActivityTypeId=' + taskId+'&limit=100&orderBy=createdAt&sort=desc&category=Deleted');

                    } else {
                        toast({
                            type: 'error',
                            message: result ? result.data.body.message : 'Error',
                        });
                        updateCardValues();
                    }
                })
                .catch(function (e) {
                    toast({
                        type: 'error',
                        message: e.response ? e.response.data.body.message : 'Something went wrong, Try again !',
                    });
                });
        }
    };
    const handleDeleteSubTask = deleteSubTaskId => {
        if (permission?.task?.edit === true || Cookies.get('isAdmin') === 'true') {
            deleteSubTask(`?taskId=${taskId}`, updateCardValues)
                .then(function (result) {
                    if (result.data.body.status == 'success') {
                        toast({
                            type: 'success',
                            message: result ? result.data.body.message : 'Try again !',
                        });
                        updateCardValues();
                        handleGetAllActivity('?ActivityType=SubTask' + '&ActivityTypeId=' + taskId+'&limit=100&orderBy=Deleted&sort=desc&category=Created');
                        setShowDeleteConfirmation(false);
                    } else {
                        toast({
                            type: 'error',
                            message: result ? result.data.body.message : 'Error',
                        });
                        updateCardValues();
                        setShowDeleteConfirmation(false);
                    }
                })
                .catch(function (e) {
                     toast({
                        type: 'error',
                        message: e.response ? e.response.data.body.message : 'Something went wrong, Try again !',
                    });
                    setShowDeleteConfirmation(false);
                });
        }
    };
    const removeTask = (id: number) => {
        const tasks = [...cardValues.subTasks];
        const tempTasks = tasks?.filter(item => item._id !== id);
        handleDeleteSubTaskById(id);
        updateCardValues();
        // setCardValues({
        //     ...cardValues,
        //     subTasks: tempTasks,
        // });
    };
    const handleUpdateSubTaskStatusById = (id, data) => {
        if (!data) {
            toast({
                type: 'info',
                message: 'user have no access to change',
            });
            return;
        }
        UpdateSubTaskStatusById(data, id, updateCardValues).then(response => {
            if (response?.body?.status === 'success') {
                handleGetAllActivity('?ActivityType=SubTask' + '&ActivityTypeId=' + id+'&limit=100&orderBy=createdAt&sort=desc&category=Updated');
                
                updateCardValues();
            }else{
                toast({
                    type: 'error',
                    message: response ? response?.body?.message : 'Try again !',
                });
                updateCardValues();

            }
        });
    };
    const updateTask = (id: number, value: boolean) => {
        if (permission?.task?.edit === true || Cookies.get('isAdmin') === 'true') {
            const updatedTasks = [...cardValues.subTasks];
            const index = updatedTasks.findIndex(item => item._id === id);
            if (index < 0) return;
            updatedTasks[index].subTaskStatus = Boolean(value) === true ? 'Done' : 'Todo';
            handleUpdateSubTaskStatusById(id, Boolean(value) === true ? 'Done' : 'Todo');
            // setCardValues({
            //     ...cardValues,
            //     updatedTasks,
            // });
        }
    };

    const calculatePercent = () => {
        if (!cardValues?.subTasks?.length) return 0;

        return cardValues?.progress;
    };
    const updateDate = (dueDate: string, type) => {
        if (type === 'dueDate') {
            if (!dueDate) return;
            if (!dueDate) {
                toast({
                    type: 'info',
                    message: 'user have no access to change',
                });
                return;
            }
            let datas = JSON.stringify({
                dueDate: dueDate,
            });
            updateTaskStatus(datas, taskId, performDataFetch).then(response => {
                if (response.data.body.status === 'success') {
                    toast({
                        type: 'success',
                        message: response ? response.data.body.message : 'Try again !',
                    });
                    performDataFetch();
                    handleGetAllActivity('?ActivityType=Task' + '&ActivityTypeId=' + taskId+'&limit=100&orderBy=createdAt&sort=desc&category=Updated');

                }
            });
            setCardValues({
                ...cardValues,
                dueDate,
            });
        } else if(type==='estimationDate'){
            if (!dueDate) return;
            if (!dueDate) {
                toast({
                    type: 'info',
                    message: 'user have no access to change',
                });
                return;
            }
            let datas = JSON.stringify({
                estimationDate: dueDate,
            });
            updateTaskStatus(datas, taskId, performDataFetch).then(response => {
                if (response.data.body.status === 'success') {
                    toast({
                        type: 'success',
                        message: response ? response.data.body.message : 'Try again !',
                    });
                    handleGetAllActivity('?ActivityType=Task' + '&ActivityTypeId=' + taskId+'&limit=100&orderBy=createdAt&sort=desc&category=Updated');
                    performDataFetch();
                }
            });
            setCardValues({
                ...cardValues,
                dueDate,
            });
        }else {
            if (!dueDate) return;
            if (!dueDate) {
                toast({
                    type: 'info',
                    message: 'user have no access to change',
                });
                return;
            }
            let datas = JSON.stringify({
                estimationTime: dueDate,
            });
            updateTaskStatus(datas, taskId, performDataFetch).then(response => {
                if (response.data.body.status === 'success') {
                    toast({
                        type: 'success',
                        message: response ? response.data.body.message : 'Try again !',
                    });
                    handleGetAllActivity('?ActivityType=Task' + '&ActivityTypeId=' + taskId+'&limit=100&orderBy=createdAt&sort=desc&category=Updated');
                    performDataFetch();
                }
            });
        }
    };

    const calculatedPercent = calculatePercent();
    const priorityData = [{ priority: 'Low' }, { priority: 'Medium' }, { priority: 'High' }];
    const handlePriority = prioritys => {
        if (permission?.task?.edit === true || Cookies.get('isAdmin') === 'true') {
            const priority = prioritys.value;
            if (!priority) {
                toast({
                    type: 'info',
                    message: 'user have no access to change',
                });
                return;
            }
            let datas = JSON.stringify({
                priority: priority,
            });
            updateTaskStatus(datas, taskId, performDataFetch).then(response => {
                if (response.data.body.status === 'success') {
                    toast({
                        type: 'success',
                        message: response ? response.data.body.message : 'Try again !',
                    });
                    handleGetAllActivity('?ActivityType=Task' + '&ActivityTypeId=' + taskId+'&limit=100&orderBy=createdAt&sort=desc&category=Updated');
                    performDataFetch();
                    
                }
            });
            setCardValues({
                ...cardValues,
                priority,
            });
            performDataFetch();
        }
    };
    const handleGetAllTaskType = () => {
        getAllTaskType().then(response => {
            if (response.data?.body.status === 'success') {
                setTaskTypeDetails(
                    response.data?.body.data.data.map(d => {
                        return { name: d.taskType, value: d.taskType };
                    })
                );
            }
        });
    };
    const handleTaskType = taskTypes => {
        if (permission?.task?.edit === true || Cookies.get('isAdmin') === 'true') {
            const taskType = taskTypes.value;
            if (!taskType) {
                toast({
                    type: 'info',
                    message: 'user have no access to change',
                });
                return;
            }
            let datas = JSON.stringify({
                taskType: taskType,
            });
            updateTaskStatus(datas, taskId, performDataFetch).then(response => {
                if (response.data.body.status === 'success') {
                    toast({
                        type: 'success',
                        message: response ? response.data.body.message : 'Try again !',
                    });
                    handleGetAllActivity('?ActivityType=Task' + '&ActivityTypeId=' + taskId+'&limit=100&orderBy=createdAt&sort=desc&category=Updated');
                    performDataFetch();
                }
            });
            setCardValues({
                ...cardValues,
                taskType,
            });
            performDataFetch();
        }
    };
    const handleGetAllStages = () => {
        getAllStages().then(response => {
            if (response.data?.body.status === 'success') {
                setStageDetails(
                    response.data?.body.data.stage.map(d => {
                        return { name: d.taskStage, value: d.taskStage };
                    })
                );
            }
        });
    };
    const handleStage = stages => {
        if (permission?.task?.edit === true || Cookies.get('isAdmin') === 'true') {
            const stageName = stages.value;
            if (!stageName) {
                toast({
                    type: 'info',
                    message: 'user have no access to change',
                });
                return;
            }
            let datas = JSON.stringify({
                stageName: stageName,
            });
            updateTaskStatus(datas, taskId, performDataFetch).then(response => {
                if (response.data.body.status === 'success') {
                    toast({
                        type: 'success',
                        message: response ? response.data.body.message : 'Try again !',
                    });
                    handleGetAllActivity('?ActivityType=Task' + '&ActivityTypeId=' + taskId+'&limit=100&orderBy=createdAt&sort=desc&category=Updated');
                    performDataFetch();
                }
            });

            setCardValues({
                ...cardValues,
                stageName,
            });
            performDataFetch();
        }
    };
    useEffect(() => {
        handleGetAllTaskType();
        handleGetAllStages();
        handleProfileData();
    }, []);
    const handleDeleteTaskAttachment = data => {
        if (permission?.task?.edit === true || Cookies.get('isAdmin') === 'true') {
            const attachment = cardValues.attachment.filter(obj => data !== obj);
            let datas = JSON.stringify({
                attachment: [...attachment],
            });
            updateTaskStatus(datas, taskId, performDataFetch).then(response => {
                if (response.data.body.status === 'success') {
                    toast({
                        type: 'success',
                        message: response ? response.data.body.message : 'Try again !',
                    });
                    handleGetAllActivity('?ActivityType=Task' + '&ActivityTypeId=' + taskId+'&limit=100&orderBy=Deleted&sort=desc&category=Created');
                    setUploadedData(null);
                    updateCardValues();
                } else {
                    toast({
                        type: 'error',
                        message: response ? response.data.body.message : 'Try again !',
                    });
                    setUploadedData(null);
                    updateCardValues();
                }
            });
        }
    };
    const [selectedOption, setSelectedOption] = useState("");
    const activityList = [
      { text: "Project", value: "Project" },
      { text: "Task", value: "Task" },
      { text: "TaskStatus", value: "TaskStatus" },
      { text: "TaskType", value: "TaskType" },
      { text: "TaskStage", value: "TaskStage" },
      { text: "TaskCategory", value: "TaskCategory" },
      { text: "SubTask", value: "SubTask" },
      { text: "User", value: "User" },
      { text: "Permission", value: "Permission" },
      { text: "Config", value: "Config" },
      { text: "Plan", value: "Plan" },
      // {text: "Admin", value: "Admin"},
      { text: "Roles", value: "Roles" },
      { text: "Group", value: "Group" },
    ];
    // const handleGetActivity = (activityType) => {
    //     getActivity(
    //       "?ActivityType=" + activityType + "&limit=" + sortTable.limit
    //     ).then((response) => {
    //       if (response.data.body.status === "success") {
    //         setActivity(response.data.body.data.activity);
    //         setActivityCount(response.data.body.data.totalActivityCount);
    //       } else {
    //         setActivity(null);
    //       }
    //     });
    //   };
    const handleGetAllActivity = (condition = '') => {
        getActivity(condition).then(Response => {
            if (Response.data.body.status == 'success') {
                setActivityData(
                    Response.data.body.data.activity.map(data => {
                        return {
                            name: data?.userDetails?.name,
                            activityDetailes: data?.activity,
                            activityDate: data?.createdAt,
                            profilePic: data?.userDetails?.profilePic,
                        };
                    })
                );
            }
        });
    };
    const PrmissionToUpdateDueDate = (event, type) => {
        if (permission?.task?.edit === true || Cookies.get('isAdmin') === 'true') {
            updateDate(event.target.value, 'dueDate');
        }
    };
    const PrmissionToUpdateEstimationDate = (event, type) => {
        if (permission?.task?.edit === true || Cookies.get('isAdmin') === 'true') {
            updateDate(event.target.value, 'estimationDate');
        }
    };
    const PrmissionToUpdateEstimationTime = (event, type) => {
        if (permission?.task?.edit === true || Cookies.get('isAdmin') === 'true') {
            updateDate(event.target.value, 'estimationTime');
        }
    };

    const handleProject = async e => {
        if (permission?.task?.edit === true || Cookies.get('isAdmin') === 'true') {
            const projectname = e.value;
            if (!projectname) {
                toast({
                    type: 'info',
                    message: 'user have no access to change',
                });
                return;
            }
            let filteredArray = projects.filter(obj => obj.projectName === projectname);
            let datas = JSON.stringify({
                projectId: filteredArray[0]?._id,
            });
            updateTaskStatus(datas, taskId, performDataFetch).then(response => {
                if (response.data.body.status === 'success') {
                    toast({
                        type: 'success',
                        message: response ? response.data.body.message : 'Try again !',
                    });
                    handleGetAllActivity('?ActivityType=Task' + '&ActivityTypeId=' + taskId+'&limit=100&orderBy=createdAt&sort=desc&category=Updated');

                } else {
                    toast({
                        type: 'error',
                        message: response ? response.data.body.message : 'Try again !',
                    });
                    updateCardValues();
                }
            });

            performDataFetch();
        }
    };

    const initialState = {
        isValid: false,
        values: {
            taskDetails: null,
            projectName: null,
            projectManager: null,
            manager: null,
            category: null,
            startDate: null,
            subTask: null,
            endDate: null,
            actualBudget: null,
            plannedBudget: null,
            projectSponsor: null,
        },
        touched: {},
        errors: {
            taskDetails: null,
            projectName: null,
            projectManager: null,
            manager: null,
            category: null,
            subTask: null,
            startDate: null,
            endDate: null,
            actualBudget: null,
            plannedBudget: null,
            projectSponsor: null,
        },
    };
    const [formState, setFormState] = useState({ ...initialState });
    const [sortTable, setSortTable] = useState({
        skip: 10,
        limit: 10,
        pageNo: 1,
    });
    const IncreaseLimit = () => {
        setSortTable({
            ...sortTable,
            limit: sortTable.limit + 10,
        });
    };
    const DecreaseLimit = () => {
        setSortTable({
            ...sortTable,
            limit: sortTable.limit - 10,
        });
    };

    const initialValues = {
        isValid: false,
        values: {
            comment: ' ',
            reply: '',
        },
        touched: {},
        errors: {
            comment: null,
        },
    };
    const schema = {
        comment: commentSchema,
    };

    const [commentData, setcommentData] = useState({ ...initialValues });
    const [fetchComments, setfetchComments] = useState([]);
    useEffect(() => {
        // document.querySelector('body').classList.add('bg-slate-50');
    });
    const [searchSuggestions, setsearchSuggestions] = useState([]);
    const hasErrors = field => !!(commentData.touched[field] && commentData.errors[field]);
    const handleGetAllUser = condition => {
        getAllUsers(condition).then(response => {
            if (response.data?.body.status === 'success') {
                setuserName(
                    response.data?.body.data.users.map(data => {
                        return { name: data?.firstName + '_' + data?.lastName, profilPic: data?.profilePic, user_name: data?.userName };
                    })
                );
            }
        });
    };

    const handleUserName = taskDetail => {
        if (taskDetail) {
            handleGetAllUser('?limit=5000&invitationStatus=1&suspensionStatus=false');
        }
    };
    useEffect(() => {
        handleUserName(taskDetail);
    }, [taskDetail]);
    const searchMention = async text => {
        let value = [];
        if (text) {
            userName.map((key, index) => {
                let userValue = {};
                userValue['image'] = key.profilPic;
                userValue['name'] = key.user_name?.replace(/@/g, '');
                userValue['id'] = key.user_name;
                value.push(userValue);
            });
        }

        let result = value.filter(function (ele) {
            return ele?.id?.toLowerCase().indexOf(text?.toLowerCase()) >= 0;
        });
        const reResult = result.map(({ id, ...rest }) => ({ ...rest }));
        
        
        return reResult;
    };

    useEffect(() => {
        searchMention(commentData.values.comment);
    }, [commentData.values.comment]);
    // Now you can use the searchMention function
    const handleChangeComment = data => {
        const errors = validate(formState.values, schema);
        setcommentData(commentData => ({
            ...commentData,
            values: {
                comment: data,
            },
            isValid: !errors,
            errors: errors || {},
        }));
    };
    const handleChangeCommentReply = data => {
        const errors = validate(formState.values, schema);
        setcommentData(commentData => ({
            ...commentData,
            values: {
                reply: data,
            },
            isValid: !errors,
            errors: errors || {},
        }));
    };
    const handleGetallComments = (condition = ' ') => {
        getCommentsApi(condition)
            .then(function (response) {
                
                if (response.body.status === "success") {
                        setfetchComments(
                            response.body.data.map(data => {
                                return {
                                    commentId: data._id,
                                    name: data.commentCreator.creatorName,
                                    comment: data.comment,
                                    createdDate: data.createdAt,
                                    is_edited: data.is_edited,
                                    reply: data?.reply
                                };
                            })
                        );

                }else {
                    
                    setfetchComments([]);  
                }
            })
            .catch(function (e) {
                // stopLoading();
                
                toast({
                    type: 'error',
                    message: e.response ? e.response.body.message : 'Something went wrong, Try again !',
                });
            });
    };
    const [isReplying, setIsReplying] = useState(new Array(fetchComments?.length).fill(false));
    useEffect(() => {
        if (taskId) {
                if(commentsFilter===false){
                handleGetallComments('?task_id=' + taskId + '&limit=' + sortTable.limit+'&orderBy=createdAt&sort=desc');
                }else{
                handleGetallComments('?task_id=' + taskId + '&limit=' + sortTable.limit+'&orderBy=updatedAt&sort=desc');
                }
            handleGetAllActivity('?ActivityType=Task' + '&ActivityTypeId=' + taskId+'&limit=100&orderBy=createdAt&sort=desc');
        }

       
    }, [taskId, sortTable.limit,commentsFilter]);
    const handleAddComments = () => {
        let comment = commentData.values.comment;

        let realComment = comment.replace(/\[/g, '');
        let com = realComment.replace(/\]\(userId:undefined\)/g, ' ');
        let userName = com.match(/@[\w-]+/g) || [];
        if(com===''||com===' '){
            toast({
              type: 'warn',
              message:  'Comment cannot be Empty!!',
            });
            return
          }

        createCommentApi({ comment: com, userName: userName }, taskId)
            .then(function (response) {
                if (response.body.status === 'success') {
                    handleGetallComments('?task_id=' + taskId + '&limit=' + sortTable.limit);
                    toast({
                        type: 'success',
                        message: response ? response.body.message : 'Try again !',
                    });
                    setcommentData(initialValues);
                } else {
                    toast({
                        type: 'error',
                        message: response ? response.body.message : 'Something went wrong, Try again !',
                    });
                }
            })
            .catch(error => {
                toast({
                    type: 'error',
                    message: error.response ? error.response.body.message : 'Something went wrong, Try again  !',
                });
            });
    };
    const handleReplyComments = replyId => {
        let comment = commentData.values.reply;
        let realComment = comment.replace(/\[/g, '');
        let com = realComment.replace(/\]\(userId:undefined\)/g, ' ');
        let userName = com.match(/@[\w-]+/g) || [];
        if(com===''){
            toast({
              type: 'warn',
              message:  'Reply cannot be Empty!!',
            });
            return
          }
        createReplyCommentApi({ comment: com, userName: userName }, `?commentId=${replyId}`)
            .then(function (response) {
                if (response.body.status === 'success') {
                    handleGetallComments('?task_id=' + taskId + '&limit=' + sortTable.limit);
                    toast({
                        type: 'success',
                        message: response ? response.body.message : 'Try again !',
                    });
                    setcommentData(initialValues);
                } else {
                    toast({
                        type: 'error',
                        message: response ? response.body.message : 'Something went wrong, Try again !',
                    });
                }
            })
            .catch(error => {
                toast({
                    type: 'error',
                    message: error.response ? error.response.body.message : 'Something went wrong, Try again !',
                });
            });
    };

    const handleUpdateComment = (id, data) => {
        if (data === null) {
            toast({
                type: 'info',
                message: 'user have no access to change',
            });
            return;
        }

        updateCommentApi(id, data)
            .then(function (result) {
                if (result.body.status === 'success') {
                    toast({
                        type: 'success',
                        message: result ? result.body.message : 'Try again !',
                    });
                    setShowModal(false);
                } else {
                    toast({
                        type: 'error',
                        message: result ? result.body.error : 'Try again !',
                    });
                }
                setIsEditing(false);
            })
            .catch(function (e) {
                toast({
                    type: 'error',
                    message: e.result ? e.result.body.error : 'Something went wrong, Try again !',
                });
            });
    };
    const [deleteMessage, setDeleteMessage] = useState('');
    const [deleteTaskId, setDeleteTaskId] = useState('');
    const [openDeleteModel, setOpenDeleteModel] = useState(false);
    const [replyDeleteComment, setDeleteReplyComment] = useState(false);

    const handleDeleteComment = () => {
        if (replyDeleteComment === false) {
            deleteCommentApi(deleteTaskId)
                .then(function (response) {
                    if (response.body.status === "success") {
                        toast({
                            type: 'success',
                            message: response ? response.body.message : 'Try again !',
                        });
                        handleGetallComments('?task_id=' + taskId + '&limit=' + sortTable.limit);
                        
                    } else {
                        toast({
                            type: 'error',
                            message: response ? response.body.message : 'Error',
                        });
                    }
                })
                .catch(function (e) {
                    toast({
                        type: 'error',
                        message: e.response ? e.response.body.message : 'Something went wrong, Try again !',
                    });
                });
        } else {
            deleteReplyCommentApi(deleteTaskId)
                .then(function (response) {
                    if (response.body.status == 'success') {
                        toast({
                            type: 'success',
                            message: response ? response.body.message : 'Try again !',
                        });
                        handleGetallComments('?task_id=' + taskId + '&limit=' + sortTable.limit);
                        setDeleteReplyComment(false);
                    } else {
                        toast({
                            type: 'error',
                            message: response ? response.body.message : 'Error',
                        });
                    }
                })
                .catch(function (e) {
                    toast({
                        type: 'error',
                        message: e.response ? e.response.body.message : 'Something went wrong, Try again !',
                    });
                });
            // handleGetallComments('?task_id=' + taskId + '&limit=' + sortTable.limit);
            setDeleteReplyComment(false);
        }
    };

    function handleReset() {
        setcommentData({ ...initialValues });
        // setIsOpen(false);
    }

    const [showCardUrl, setShowCardUrl] = useState(false);

    const handleGenerateUrlClick = () => {
        setShowCardUrl(true);
    };
    const urlLabelRef = useRef(null);
    const handleUrlLabelClick = () => {
        if (urlLabelRef.current) {
            const range = document.createRange();
            range.selectNodeContents(urlLabelRef.current);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
        }
    };

    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

    const openShareModal = () => {
        setIsShareModalOpen(true);
    };

    const closeShareModal = () => {
        setIsShareModalOpen(false);
    };
    function truncateLink(url) {
        if (url.length > 20) {
            return url.slice(0, 50) + '....';
        } else {
            return url;
        }
    }

    const removeTaskEpicLink = item => {

        if (cardValues?.epicLink.includes(item)) {
            const isLink = value => {
                const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
                return urlPattern.test(value);
            };

            if (isLink(item)) {
                if (!item) {
                    toast({
                        type: 'info',
                        message: 'user have no access to change',
                    });
                    return;
                }
                let newLinkList = [];
                const index = cardValues?.epicLink?.indexOf(item);
                if (index > -1) {
                    newLinkList = cardValues?.epicLink?.slice();
                    newLinkList.splice(index, 1);
                }

                let datas = JSON.stringify({
                    epicLink: [...newLinkList],
                });

                updateTaskStatus(datas, taskId, performDataFetch).then(response => {
                    if (response.data.body.status === 'success') {
                        toast({
                            type: 'success',
                            message: response ? response.data.body.message : 'Try again !',
                        });
                        updateCardValues();
                    } else {
                        toast({
                            type: 'error',
                            message: response ? response.data.body.message : 'Try again !',
                        });
                        updateCardValues();
                    }
                });
            } else {
                toast({
                    type: 'error',
                    message: 'Not a Valid Link !',
                });
            }
        } else {
            toast({
                type: 'error',
                message: 'Link Already Deleted!',
            });
        }
    };
    const AddTaskLink = (value: string) => {
        if (cardValues?.epicLink?.includes(value)) {
            toast({
                type: 'error',
                message: 'Link Already Added!',
            });
        } else {
            const isLink = value => {
                const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
                return urlPattern.test(value);
            };

            if (isLink(value)) {
                if (!value) {
                    toast({
                        type: 'info',
                        message: 'user have no access to change',
                    });
                    return;
                }
                let ExistingData = cardValues?.epicLink?.length > 0 ? cardValues?.epicLink : [];
                let datas = JSON.stringify({
                    epicLink: [...ExistingData, value],
                });

                updateTaskStatus(datas, taskId, performDataFetch).then(response => {
                    if (response.data.body.status === 'success') {
                        toast({
                            type: 'success',
                            message: response ? response.data.body.message : 'Try again !',
                        });
                        updateCardValues();
                    } else {
                        toast({
                            type: 'error',
                            message: response ? response.data.body.message : 'Try again !',
                        });
                        updateCardValues();
                    }
                });
            } else {
                toast({
                    type: 'error',
                    message: 'Not a Valid Link !',
                });
            }
        }
    };
    const toggleReply = commentIndex => {
        const newReplyOpen = [...isReplying];
        newReplyOpen[commentIndex] = !newReplyOpen[commentIndex];
        setIsReplying(newReplyOpen);
    };
    const formatTime = (time) => {
        const [hours, minutes] = time?.split(':');
        const paddedHours = hours?.padStart(2, '0'); 
        return `${paddedHours}:${minutes}`;
      };
      const [editedSubTaskValue, setEditedSubTaskValue] = useState(null);

      const handleAllEditSubTask = (data) =>{
        setEditedSubTaskValue(data)
      }
      const handleSave = (id) => {

        if (!editedSubTaskValue) {
            toast({
                type: 'info',
                message: 'user have no access to change',
            });
            return;
        }
        let data = JSON.stringify({
                subTaskTitle: editedSubTaskValue,
            });
        updateSubTask(id,data).then(response => {
            
            if (response?.data?.body?.status === 'success') {
                toast({
                    type: 'success',
                    message: response ? response?.data?.body?.message : 'Try again !',
                });
                updateCardValues();
                setShowInput(null)
            }else{
                toast({
                    type: 'error',
                    message: response ? response?.data?.body?.message : 'Try again !',
                });
            }
        });

        
    };
    const [showQRCode, setShowQRCode] = useState(false);
  
    const generateQR = () => {
        setShowQRCode(true);
      };
    
      const closeQR = () => {
        setShowQRCode(false);
      };
      let url=`${process.env.SHARE_LINK + cardValues?._id}`
      const DownloadQR = () => {
        const canvas = document.querySelector('canvas'); // Get the QR code canvas
        const url = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = url;
        a.download = `${cardValues?.taskTitle}.png`; // Set the filename for the download
        a.click();
      };

      const handleEditSubtask=(item)=>{
        if(permission?.subtask?.edit === true || Cookies.get('isAdmin') === 'true'){

        setShowInput(item._id);
        }else{
            ''
        }
      }

    return (
        <>
            <Modal onClose={onClose}>
                <div className='cardinfo relative'>
                    <div className=' flex gap-4 items-center absolute right-3 top-0 p-4 rounded-full cursor-pointer'>
               <button onClick={generateQR}  className='small-button flex items-center h-7 w-fit'  >Generate QR</button>
                        <button className='flex gap-3 items-center px-4 py-1 rounded bg-slate-200 dark:bg-gray-600 dark:hover:bg-slate-900 hover:bg-slate-300' onClick={openShareModal}>
                            <BiSolidShareAlt className=' text-base' />
                            <span className='text-base'>Share</span>
                        </button>
                        
                        {showQRCode && (

                            <>
                             {/* <div onClick={()=>setShowQRCode(false)} className='absolute z-[999] bg-black inset-0 bg-opacity-40 h-screen w-[500px'></div> */}
                             <div  className=' fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-[9999] w-[20%] rounded-xl shadow-md shadow-gray-900'>

                            <div className="bg-white flex justify-center flex-col items-center py-10 rounded-xl">
                            <QRCode value={url} />
                            <div className='flex gap-5 pt-4'>
                            <button className=' small-button h-7 flex items-center' onClick={DownloadQR}>Download</button>
                            <button className=' bg-slate-200 px-4 py-1 h-7 rounded-xl text-darkTextColor dark:text-gray-950 font-semibold hover:bg-slate-300 text-base flex items-center' onClick={closeQR}>Close</button>
                            </div>
                            </div>
                             </div>
                            </>
                        )}
                        <div className='p-2 hover:bg-slate-200 rounded-full' onClick={onClose}>
                            <ImCross className='text-base'/>
                        </div>
                    </div>
                    {/* <div className='cardinfo-box'> */}
                    {/* {projectNames===true ? ("") : ( */}
                    {cardValues?.standAloneTask === true && projectId === '' ? (
                        <>
                            <div className='cardinfo-box-title'>
                                <p>Projects</p>
                            </div>
                            <td className='w-[178px] '>
                                <b>
                                    <DropDownWithTick
                                        onChangeValue={handleProject}
                                        data={
                                            projects &&
                                            projects?.map(d => {
                                                return { name: d?.projectName, value: d?.projectName, id: d?._id };
                                            })
                                        }
                                        value={'Select Project'}
                                        id={null}
                                        handle={undefined}
                                        selectedData={null}
                                        icon={undefined}
                                        roundedSelect={undefined}
                                        className={'relative '}
                                        type={undefined}
                                    />
                                </b>
                            </td>{' '}
                        </>
                    ) : (
                        ''
                    )}

                    {/* </div> */}
                    <div className='cardinfo-box py-2'>
                        <div className='cardinfo-box-title'>    
                            <MdTitle />
                            <p className=''>Title</p>
                        </div>
                        <CustomInput
                            validation='title'
                            defaultValue={cardValues?.taskTitle}
                            text={cardValues?.taskTitle}
                            displayClass='!mt-0 !rounded break-words'
                            placeholder='Enter Title'
                            onSubmit={updateTitle}
                            disableCardTitle={permission && (permission?.task?.edit === true || Cookies.get('isAdmin') === 'true') ? true : false}
                        />
                    </div>
                    <div className='cardinfo-box py-2'>
                        <div className='cardinfo-box-title'>
                            <List />
                            <p className=''>Description</p>
                        </div>

                        {/* <CustomInput
                            validation='desc'
                            defaultValue={cardValues?.taskDetails}
                            text={cardValues?.taskDetails || 'Add a Description'}
                            placeholder='Enter description'
                            onSubmit={updateDesc}
                            rowsHeight={4}
                            displayClass='!mt-0 !rounded'
                            disableCardTitle={permission && (permission?.task?.edit === true || Cookies.get('isAdmin') === 'true') ? true : false}
                        /> */}
                        <DynamicCustomInput
                            validation='desc'
                            defaultValue={cardValues?.taskDetails}
                            text={cardValues?.taskDetails || 'Add a Description'}
                            placeholder='Enter description'
                            onSubmit={updateDesc}
                            rowsHeight={4}
                            displayClass='!mt-0 !rounded dark:bg-gray-900 dark:text-gray-50 break-words'
                            disableCardTitle={permission && (permission?.task?.edit === true || Cookies.get('isAdmin') === 'true') ? true : false}
                        />
                    </div>
                    <div className='cardinfo-box py-2'>
                        <div className='cardinfo-box-title'>
                            <User />
                            <p className=''>Members</p>
                        </div>
                    </div>
                    <div className='card-detail-item u-clearfix js-card-detail-members'>
                        <div className='js-card-detail-members-list'>
                            <ul>
                                {cardValues?.assignedTo?.map((data, index) => (
                                    <>
                                        <li key={index} onClick={() => setSelectedColor(data)}>
                                            <div className='member js-member-on-card-menu' data-idmem='5dcd091ae102ec7ab20b1a8b'>
                                                <img
                                                    className='member-avatar'
                                                    src={data.profilePic ? data.profilePic : '/imgs/user/user1.png'}
                                                    // srcSet='https://trello-members.s3.amazonaws.com/5dcd091ae102ec7ab20b1a8b/cadd085e663d0562a74e021143a04373/30.png 1x, https://trello-members.s3.amazonaws.com/5dcd091ae102ec7ab20b1a8b/cadd085e663d0562a74e021143a04373/50.png 2x'
                                                    alt={data.firstName}
                                                    title={data.firstName}
                                                />
                                            </div>
                                        </li>
                                    </>
                                ))}
                            </ul>
                            <a className='card-detail-item-add-button js-details-edit-members mod-round'>
                                <PlusCircle size={26} style={{ color: 'grey' }} onClick={() => setShowModal(true)} />
                            </a>
                        </div>
                    </div>

                    {showModal && (
                        <AssignedMembers
                            onClose={() => setShowModal(false)}
                            tasks={tasks}
                            boardId={boardId}
                            updateCard={updateCard}
                            fetchData={fetchData}
                            attachments={cardValues?.assignedTo}
                            task={cardValues?._id}
                            setCardValues={setCardValues}
                            cardValues={cardValues}
                            updateCardValues={updateCardValues}
                            projectId={projectId}
                            permission={permission}
                            performDataFetch={performDataFetch}
                            handleGetAllActivity={handleGetAllActivity}
                        />
                    )}
                    <div className=' flex items-center gap-4 py-3'>
                        <div className='cardinfo-box !w-fit'>
                            <div className='cardinfo-box-title'>
                                <Calendar />
                                <p className=''>Due Date</p>
                            </div>
                            <input
                            className='text-md dark:bg-gray-800'
                                type='date'
                                defaultValue={cardValues?.dueDate ? new Date(cardValues?.dueDate)?.toISOString()?.split('T')[0] : null}
                                // min={new Date().toISOString().substr(0, 10)}
                                onChange={event => PrmissionToUpdateDueDate(event)}
                                disabled={permission?.task.edit === true || Cookies.get('isAdmin') === 'true' ? false : true}

                                // disabled={ permission && permission?.task?.edit === false && Cookies.get('isAdmin') === false ? false:true}
                            />
                        </div>
                        <div className='cardinfo-box !w-fit'>
                            <div className='cardinfo-box-title'>
                                <Calendar />
                                <p className=''>Estimation Date</p>
                            </div>
                            <input
                                className="dark:bg-gray-800"
                                type='date'
                                defaultValue={cardValues?.estimationDate ? new Date(cardValues?.estimationDate)?.toISOString()?.split('T')[0] : null}
                                disabled={permission?.task.edit === true || Cookies.get('isAdmin') === 'true' ? false : true}
                                // min={new Date().toISOString().substr(0, 10)}
                                onChange={event => PrmissionToUpdateEstimationDate(event)}
                                // disabled={ permission && permission?.task?.edit === false && Cookies.get('isAdmin') === false ? false:true}
                            />
                        </div>
                    <div className=' flex items-center '>
                    <div className='cardinfo-box !w-fit'>
                    <div className='cardinfo-box-title'>
                            <Clock />
                            <p className=' '>Estimation Time</p>
                        </div>
                        <input
                            className='border-2 rounded text-base p-1 dark:bg-gray-800' 
                            type='time'
                            defaultValue={
                                // formatTime(cardValues?.estimationTime) 
                                cardValues?.estimationTime  
                            }
                            disabled={
                                permission?.task.edit === true || Cookies.get('isAdmin') === 'true' ? false : true
                            }
                            onChange={event => PrmissionToUpdateEstimationTime(event)}
                           
                        />
                        </div>
                        </div>
                    </div>
                    {/* <div className='cardinfo-box'> */}
                    <div className='flex  py-2'>
                        <div className='cardinfo-box-title w-[33.3%]'>
                            <Tag />
                            <p className=''>Priority</p>
                        </div>
                        {/* {checkVisibility('taskStatus') && ( */}

                        <div className='w-[33.3%]'>
                            <b>
                                <DropDownWithTick
                                    paddingForDropdown={'py-1'}
                                    onChangeValue={handlePriority}
                                    data={
                                        priorityData &&
                                        priorityData.map(d => {
                                            return { name: d.priority, value: d.priority };
                                        })
                                    }
                                    width={'!w-full'}
                                    value={cardValues?.priority}
                                    id={cardValues?._id}
                                    handle={undefined}
                                    selectedData={undefined}
                                    icon={undefined}
                                    roundedSelect={undefined}
                                    className={'relative'}
                                    type={undefined}
                                />
                            </b>
                        </div>
                        {/* <CustomInput defaultValue={cardValues.taskDetails} text={cardValues.taskDetails || 'Add a Description'} placeholder='Enter description' onSubmit={updateDesc} /> */}
                        <div className='cardinfo-box-labels w-[33.3%]'>{<Chip item={cardValues?.priority} />}</div>
                    </div>
                    <div className=' flex py-2'>
                        <div className='cardinfo-box-title w-[33.3%]'>
                            <Type />
                            <p className=''>Task Type</p>
                        </div>
                        {/* {checkVisibility('taskStatus') && ( */}
                        <div className='w-[33.3%] '>
                            <b>
                                <DropDownWithTick
                                    paddingForDropdown={'py-1'}
                                    onChangeValue={handleTaskType}
                                    data={
                                        taskTypeDetails &&
                                        taskTypeDetails.map(d => {
                                            return { name: d.name, value: d.value };
                                        })
                                    }
                                    width={'w-26'}
                                    value={cardValues?.taskType}
                                    id={cardValues?._id}
                                    handle={undefined}
                                    selectedData={undefined}
                                    icon={undefined}
                                    roundedSelect={undefined}
                                    className={'relative'}
                                    type={undefined}
                                />
                            </b>
                        </div>
                    </div>
                    <div className='flex py-2'>
                        <div className='cardinfo-box-title w-[33.3%]'>
                            <Framer />
                            <p className=''>Stage</p>
                        </div>
                        {/* {checkVisibility('taskStatus') && ( */}
                        <div className='w-[33.3%]'>
                            <b>
                                <DropDownWithTick
                                paddingForDropdown={'py-1'}
                                    onChangeValue={handleStage}
                                    data={
                                        stageDetails &&
                                        stageDetails.map(d => {
                                            return { name: d.name, value: d.value };
                                        })
                                    }
                                    width={'w-26'}
                                    value={cardValues?.stageName}
                                    id={cardValues?._id}
                                    handle={undefined}
                                    selectedData={undefined}
                                    icon={undefined}
                                    roundedSelect={undefined}
                                    className={'relative'}
                                    type={undefined}
                                />
                            </b>
                        </div>
                        <div className='w-[33.3%]'></div>
                    </div>
                    {Cookies.get('isAdmin') === 'true' ? (
                        <div className='py-3'>
                            <div className='cardinfo-box-title '>
                                <ExternalLink />
                                <p className=''>Attachment</p>
                            </div>
                            {tinySpinner === true ? (
                                <TinnySpinner />
                            ) : (
                                <div className='custom-input'>
                                    <label className='flex sm:h-20 h-10 justify-center w-full h-full px-4 transition bg-white border border-blueColor border-dashed rounded-md appearance-none cursor-pointer  focus:outline-none'>
                                        <div  className='flex items-center gap-2 py-1'>
                                            <BiCloudUpload className=' text-2xl text-gray-500' />
                                            <span className='font-medium text-lightTextColor flex flex-col'>Upload Files</span>
                                        </div>
                                        <input type='file' className='hidden' multiple onChange={event => handleFileUploadInPublic(event)} />
                                    </label>
                                </div>
                            )}
                        </div>
                    ) : permission && permission?.upload?.edit === false ? (
                        ''
                    ) : (
                        <div>
                            <div className='cardinfo-box-title'>
                                <ExternalLink />
                                <p className=''>Attachment</p>
                            </div>
                            {tinySpinner === true ? (
                                <TinnySpinner />
                            ) : (
                                <div className='custom-input mt-2'>
                                    <label className='flex sm:h-20 h-10 justify-center w-full h-full px-4 transition bg-white border border-blueColor border-dashed rounded-md appearance-none cursor-pointer  focus:outline-none'>
                                        <div className=' flex items-center gap-2 py-1'>
                                            <BiCloudUpload className=' text-2xl text-gray-500' />
                                            <span className='font-medium text-lightTextColor flex flex-col'>Upload Files</span>
                                        </div>
                                        <input type='file' className='hidden' multiple onChange={event => handleFileUploadInPublic(event)} />
                                    </label>
                                </div>
                            )}
                        </div>
                    )}
                    {Cookies.get('isAdmin') === 'true' || (permission && permission?.upload?.view === true)
                        ? cardValues?.attachment?.length
                            ? cardValues?.attachment?.map((data, index) => (
                                  <div className='attachment-thumbnail flex items-center justify-between px-2' key={index}>
                                      <div className=' w-[25%]'>
                                          <a
                                              className='attachment-thumbnail-preview js-open-viewer rounded-xl'
                                              href={data}
                                              target='_blank'
                                              title={data?.substring(data?.lastIndexOf('/') + 1)}
                                              rel='noreferrer nofollow noopener'>
                                              {data.endsWith('.jpg') || data.endsWith('.png') || data.endsWith('.jpeg') ? (
                                                  <img src={data} alt='thumbnail' className='attachment-thumbnail-preview-ext' />
                                              ) : (
                                                  <span className='attachment-thumbnail-preview-ext'>{data?.substring(data?.lastIndexOf('.') + 1)}</span>
                                              )}
                                          </a>
                                      </div>
                                      <div className='w-[70%] break-words'>
                                          <p className=''>
                                              <span className=''>{data?.substring(data?.lastIndexOf('/') + 1)}</span>
                                              {/*<a
                                          className='attachment-thumbnail-details-title-action dark-hover js-attachment-action js-direct-link'
                                          href={data}
                                          target='_blank'
                                          rel='noreferrer nofollow noopener'>
                                          <span className='icon-sm icon-external-link'></span>
                                      </a>
                                      <span className='u-block quiet attachment-thumbnail-details-title-options'>
                                          <span>
                                              <a className='attachment-thumbnail-details-title-options-item dark-hover js-confirm-delete' href='#'>
                                                  
                                              </a>
                                          </span>
                                      </span> */}
                                          </p>
                                      </div>
                                      <div className=' w-[2%]'>
                                          {Cookies.get('isAdmin') === 'true' || (permission && permission?.upload?.delete === true) ? (
                                              <button className='attachment-thumbnail-details-options-item-text text-red-500 hover:text-red-600' onClick={() => handleDeleteTaskAttachment(data)}>
                                                  <MdDelete className=' text-xl' />
                                              </button>
                                          ) : (
                                              ''
                                          )}
                                      </div>
                                  </div>
                              ))
                            : null
                        : ''}
                    {/* </div> */}
                    <div className='cardinfo-box'>
                        <div className='cardinfo-box-title flex justify-between items-center'>
                            <div className=' flex items-center gap-3'>
                                <CheckSquare />
                                <p className=''>SubTasks</p>
                            </div>
                            {Cookies.get('isAdmin') === 'true' ? (
                                cardValues?.subTasks?.length > 0 ? (
                                    <div>
                                        <button className=' bg-red-500 hover:bg-red-600 duration-300 text-base px-2 py-1 rounded text-white' onClick={() => setShowDeleteConfirmation(true)}>
                                            Delete all subtasks
                                        </button>
                                    </div>
                                ) : (
                                    ''
                                )
                            ) : permission && permission?.subtask?.delete === false ? (
                                ''
                            ) : cardValues?.subTasks?.length > 0 ? (
                                <div>
                                    <button className=' bg-red-600 px-4 py-1 rounded text-white' onClick={() => setShowDeleteConfirmation(true)}>
                                        Delete all subtasks
                                    </button>
                                </div>
                            ) : (
                                ''
                            )}
                        </div>
                        <div className={`cardinfo-box-progress-bar border ${calculatedPercent > 0 && "border-none"}`}>
                            <div
                                className='cardinfo-box-progress text-base'
                                style={{
                                    width: `${calculatedPercent}%`,
                                    backgroundColor: calculatedPercent === 100 ? 'limegreen' : '',
                                }}
                            ><span className={`ps-4 font-medium ${calculatedPercent > 0 && "text-white"}`}>{calculatedPercent}%</span></div>
                        </div>
                        <div className='cardinfo-box-task-list'>
                            {cardValues?.subTasks?.map(item => (
                                <div key={item._id} className='cardinfo-box-task-checkbox text-base py-1' style={{ cursor: 'pointer' }}>
                                    <input className={`${showInput === item._id ? 'invisible' : 'visible'}`} type='checkbox' defaultChecked={item.subTaskStatus === 'Done' ? true : false} onChange={event => updateTask(item._id, event.target.checked)}   disabled={(permission?.subtask?.edit===true || Cookies.get('isAdmin')==='true')?false:true}/>
                                    <p onClick={() =>{handleEditSubtask(item)}} className={`${item?.subTaskStatus === 'Done' ? 'completed' : ''} ${showInput === item._id ? '!hidden' : 'block'}`}>{item.subTaskTitle}</p>
                                    <div className={`absolute flex items-center justify-between gap-5 ${showInput === item._id ? 'flex' : 'hidden'}`}>
                                    <input type='text' className='!py-3 px-2 !w-40 !border' defaultValue={item.subTaskTitle} onChange={(event)=>handleAllEditSubTask(event.target.value)}/>
                                    <div className='custom-input-edit-footer' >
                                        <button
                                            type='submit'
                                            className='h-6 flex items-center justify-center bg-blue-400 hover:bg-blue-500 duration-150'
                                            onClick={()=>handleSave(item._id)}
                                        >
                                        {'Save'}
                                        </button>
                                        <X onClick={() => setShowInput(null)} className='closeIcon'/>
                                    </div>
                                    </div>
                                    {(permission?.subtask?.delete === true || Cookies.get('isAdmin') === 'true')?
                                    <Trash className={`${showInput === item._id ? '!hidden' : 'block'}`} onClick={() => removeTask(item._id)} />:''}
                                </div>
                            ))}
                        </div>
                        {Cookies.get('isAdmin') === 'true' ? (
                            <CustomInput
                                text={'Add a SubTask'}
                                placeholder='Enter SubTask Title'
                                onSubmit={(value: string) => addTask(cardValues?.taskStatus, value)}
                                validation='title'
                                disableCardTitle={true}
                            />
                        ) : // If the user is not an admin
                        permission && permission?.subtask?.create === false ? null : (
                            <CustomInput
                                text={'Add a SubTask'}
                                placeholder='Enter SubTask Title'
                                onSubmit={(value: string) => addTask(cardValues?.taskStatus, value)}
                                validation='title'
                                disableCardTitle={true}
                            />
                        )}
                    </div>
                    <div className='cardinfo-box py-2'>
                        <div className='cardinfo-box-title'>
                            <p className=''>Epic Link</p>
                        </div>
                        <CustomInput
                            validation='title'
                            // defaultValue={cardValues?.taskTitle}
                            text={'Add Links here...'}
                            displayClass='!mt-0 !rounded'
                            placeholder='Enter Epic Link'
                            onSubmit={AddTaskLink}
                            disableCardTitle={permission && (permission?.task?.edit === true || Cookies.get('isAdmin') === 'true') ? true : false}
                        />
                    </div>
                    <div className='cardinfo-box-task-list w-[90%] mx-auto max-h-[150px] overflow-y-auto bg-sla'>
                        {cardValues?.epicLink?.map(item => (
                            <div className='cardinfo-box-task-checkbox cursor-pointer' key={item} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <a href={item} target='_blank'>
                                    {/* Your existing content */}
                                    <p className={item.progress === 100 ? 'completed' : ''}>
                                        {/* Apply a class for the link style and truncate long URLs */}
                                        <span className='blue-link text-base'>{truncateLink(item)}</span>
                                    </p>
                                </a>
                                <Trash className="text-base" onClick={() => removeTaskEpicLink(item)} />
                            </div>
                        ))}
                    </div>
                    {Cookies.get('isAdmin') === 'true'|| permission && permission?.comments?.view === true  ? (
                    <div className=' my-2 w-full' style={{ minHeight: '200px' }}>
                        <div className=' '>
                            {/* <h3 className='heading-medium'>
                                <div className='flex items-center '>
                                    <p className='p-0 m-0 text-lightTextColor text-xs'>Show</p>
                                    <select
                                        value={sortTable.limit}
                                        onChange={event => {
                                            setSortTable({ ...sortTable, limit: event.target.value });
                                        }}
                                        className='border py-1  rounded-md outline-none w-15 text-xs px-2 mx-1'>
                                        <option value={10}>10</option>
                                        <option value={25}>25</option>
                                        <option value={50}>50</option>
                                        <option value={100}>100</option>
                                        <option value={500}>500</option>
                                    </select>
                                    <p className='p-0 m-0 text-lightTextColor text-xs'>Entries</p>
                                </div>{' '}
                            </h3> */}

                            <div className=' text-xl font-bold md:text-base outline-brandBlue flex items-center justify-between'>
                                Comments
                                <div className='flex gap-2'>
                                    <div>
                                        <NewToolTip direction='left' message={'Show/Hide Comments'}>
                                            <button
                                                type='button'
                                                className='border border-veryLightGrey text-md px-2 py-1 rounded-lg cursor-pointer items-center xs:w-full flex h-6 w-fit'
                                                onClick={() => {
                                                    setshowComments(!showComments);
                                                }}>
                                                {showComments == true ? <LiaCommentSlashSolid /> : <GoComment />}
                                            </button>
                                        </NewToolTip>
                                    </div>

                                    <div>
                                        <NewToolTip direction='left' message={commentsFilter===false?'Newly Created Comments':'Recently Updated Comments'}>
                                            <button
                                                type='button'
                                                className='border border-veryLightGrey text-md px-2 py-1 rounded-lg cursor-pointer items-center xs:w-full flex h-6 w-fit'
                                                onClick={() => {
                                                    setcommentsFilter(!commentsFilter);
                                                }}>
                                                {commentsFilter == true ? <VscCommentUnresolved /> : <GoCommentDiscussion />}
                                            </button>
                                        </NewToolTip>
                                    </div>
                                </div>
                            </div>
                            {/* comments */}
                            <div className='py-2'>
                                <div className=''>
                                     {Cookies.get('isAdmin') === 'true'|| permission && permission?.comments?.create === true  ? (
                                    <div className='flex flex-col relative'>
                                        <InputEmoji
                                            type='text'
                                            name='comment'
                                            height={20}
                                            value={commentData.values.comment}
                                            placeholder={'comment'}
                                            error={hasErrors('comment')}
                                            errorMsg={displayErrorMessage(commentData.errors.comment)}
                                            onChange={handleChangeComment}
                                            searchMention={searchMention}
                                        />
                                        <div
                                            className='cursor-pointer absolute top-[50%] right-14 translate-y-[-50%] z-20'
                                            onClick={() => {
                                                handleAddComments(), handleReset();
                                            }}>
                                                
                                                <AiOutlineSend className="xs:w-full text-2xl text-defaultTextColor hover:text-blue-300" />
                                        </div>
                                    </div>
                                     ):('')}
                                </div>
                            </div>
                        </div>
                        <>
                        <div className=''>
                            <ul className='max-h-[300px] overflow-y-auto'>
                                {showComments &&
                                    fetchComments.map((item, key) => (
                                        <li key={item.id}>
                                            <>
                                                <div className=' rounded-xl p-1 my-1 '>
                                                    <div className='flex flex-col'>
                                                        <div>
                                                            <div className='flex flex-row justify-between items-center'>
                                                                <div className=' flex gap-1'>
                                                                    <p
                                                                        className='flex bg-mediumBlue text-white rounded-full items-center justify-center text-sm w-6 h-6 p-2 hover:bg-lightBlue transition duration-300 ease-in-out'
                                                                        data-mdb-ripple='true'
                                                                        data-mdb-ripple-color='primary'>
                                                                        <p className='font-bold'>{item.name.slice(0, 2)}</p>
                                                                    </p>
                                                                    <p className='gap-2 font-bold  px-2 ml-2 md:text-base text-darkTextColor py-1 outline-brandBlue'>{item.name}</p>
                                                                </div>
                                                                <p className=' text-sm font-semibold text-gray-500 border-none'>
                                                                    {new Date(item.createdDate).toLocaleString('en-US', {
                                                                        weekday: 'long',
                                                                        month: 'short',
                                                                        day: 'numeric',
                                                                        hour: 'numeric',
                                                                        hour12: true,
                                                                    })}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <p key={key} className='flex items-center py-2.5 pb-2 pt-2 px-4 justify-between '>
                                                        <div className='text-lightTextColor outline-none border-none w-full'>
                                                            {item.isEditing ? (
                                                                <textarea
                                                                    name={item.comment}
                                                                    id={item.commentId}
                                                                    className={'w-full border outline-none rounded-xl px-4 p-2 resize-none hover:resize'}
                                                                    value={item.comment}
                                                                    onChange={event => {
                                                                        if (event.target.value.length > 100) {
                                                                            event.target.value = event.target.value.slice(0, 500);
                                                                        }
                                                                        const sanitizedValue = event.target.value.replace(/[^a-zA-Z0-9\s!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/g, '');
                                                                        const taskCommentValue = fetchComments;
                                                                        taskCommentValue[key].comment = sanitizedValue;
                                                                        setfetchComments([...taskCommentValue]);
                                                                        document.getElementById(item.commentId).setAttribute('currentValue', sanitizedValue);
                                                                    }}
                                                                    maxLength={100}
                                                                />
                                                            ) : (
                                                                <div className=' text-base ps-8'>{item.comment}</div>
                                                            )}
                                                        </div>
                                                    </p>
                                                    <div className='text-[#52A4D1]  font-bold bg-gray px-2 py-1 ml-2 rounded-lg gap-2 flex justify-between flex-row text-xs items-center'>
                                                        {/* <p className='outline-brandBlue border-none'>{new Date(item.createdDate).toString().split('G')[0]}</p> */}
                                                        <div className='flex text-sm font-semibold justify-between gap-2 ps-8'>
                                                            {item.isEditing ? (
                                                                <button
                                                                    className='pl-4 text-base'
                                                                    onClick={() => {
                                                                        handleUpdateComment(item.commentId, capitalizeString(document.getElementById(item.commentId).getAttribute('currentValue')));
                                                                        const updatedComments = [...fetchComments];
                                                                        updatedComments[key].isEditing = false;
                                                                        setfetchComments(updatedComments);
                                                                        setIsEditing(false);
                                                                    }}>
                                                                    Save
                                                                </button>
                                                            ) : (
                                                                <>
                                                                    {Cookies.get('isAdmin') === 'true'|| permission && permission?.comments?.create === true  ? (

                                                                    <button
                                                                        className=' disabled:opacity-25 disabled:cursor-not-allowed text-gray-400 hover:text-black'
                                                                        onClick={() => {
                                                                            // setIsReplying(!isReplying)
                                                                            toggleReply(key);
                                                                        }}>
                                                                        {/* <AiOutlineDelete /> */}
                                                                        Reply
                                                                    </button>):('')}
                                                                    {Cookies.get('isAdmin') === 'true'|| permission && permission?.comments?.edit === true  ? (

                                                                    <button
                                                                        className='disabled:opacity-25 disabled:cursor-not-allowed text-gray-400 hover:text-black'
                                                                        onClick={() => {
                                                                            const updatedComments = [...fetchComments];
                                                                            updatedComments[key].isEditing = true;
                                                                            setfetchComments(updatedComments);
                                                                        }}>
                                                                        {/* <BiEditAlt size={20} /> */}
                                                                        Edit
                                                                    </button>
                                                                    ):('')}
                                                                </>
                                                            )}
                                                            {Cookies.get('isAdmin') === 'true'|| permission && permission?.comments?.delete === true  ? (

                                                            <button
                                                                className='red-link disabled:opacity-25 disabled:cursor-not-allowed text-gray-400 hover:text-black'
                                                                onClick={() => {
                                                                    setDeleteMessage('Delete comment ' + '"' + item.comment + '"');
                                                                    setDeleteTaskId(item.commentId);
                                                                    setOpenDeleteModel(true);
                                                                }}>
                                                                {/* <AiOutlineDelete /> */}
                                                                Delete
                                                            </button>
                                                            ):('')}
                                                        </div>
                                                    </div>
                                                    {/* Reply-view */}
                                                    {isReplying[key] && (
                                                        <>
                                                            <div className=' ps-10 flex flex-col justify-between py-4 px-2'>
                                                                {/* <div className='flex gap-1 items-center'>

                                                        <p
                                                                    className='flex bg-green-400 text-white rounded-full items-center justify-center text-sm w-8 h-8 p-2 hover:bg-green-300 transition duration-300 ease-in-out'
                                                                    data-mdb-ripple='true'
                                                                    data-mdb-ripple-color='primary'>
                                                                    <p className='font-bold'>AF</p>
                                                        </p>
                                                        <p className='gap-2 font-bold  text-base px-2 py-1 ml-2 md:text-1xl text-darkTextColor '>Afzal</p>
                                                        </div> */}
                                                                <div className=' py-1'>
                                                                    {/* <input type="text" name="reply" id="reply" className=' w-full border outline-none px-3 py-1 rounded-xl' placeholder='write a reply...' /> */}
                                                                    <div className='pt-3 pb-3'>
                                                                        <div className='flex flex-col gap-5 relative'>
                                                                            <InputEmoji
                                                                                type='text'
                                                                                name='comment'
                                                                                value={commentData.values.comment}
                                                                                placeholder={'comment'}
                                                                                error={hasErrors('comment')}
                                                                                errorMsg={displayErrorMessage(commentData.errors.comment)}
                                                                                onChange={handleChangeCommentReply}
                                                                                searchMention={searchMention}
                                                                            />
                                                                            <div
                                                                                className='cursor-pointer absolute top-[50%] right-14 translate-y-[-50%] z-20'
                                                                                onClick={() => {
                                                                                    handleReplyComments(item.commentId);
                                                                                }}>
                                                                                    <AiOutlineSend className="xs:w-full text-2xl text-defaultTextColor hover:text-blue-300" />
                                                                            </div>
                                                                        </div>
                                                                        <div className=' flex gap-2 text-gray-500 font-semibold text-sm ps-2'>
                                                                            {/* <p className=' cursor-pointer hover:text-black' onClick={()=>handleReplyComments(item.commentId)}>Reply</p> */}
                                                                            <p className=' cursor-pointer hover:text-black' onClick={() => toggleReply(key)}>
                                                                                Cancel
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {item &&
                                                                item?.reply?.map((items, key) => (
                                                                    <li key={items.id}>
                                                                        <>
                                                                            <div className='ml-6 rounded-xl p-1 my-1'>
                                                                                <div className='flex flex-col'>
                                                                                    <div>
                                                                                        <div className='flex flex-row justify-between items-center'>
                                                                                            <div className=' flex gap-1'>
                                                                                                <p
                                                                                                    className='flex bg-green-400 text-white rounded-full items-center justify-center text-sm w-5 h-5 p-2 hover:bg-green-300 transition duration-300 ease-in-out'
                                                                                                    data-mdb-ripple='true'
                                                                                                    data-mdb-ripple-color='primary'>
                                                                                                    <p className='font-bold'>{item.name.slice(0, 2)}</p>
                                                                                                </p>
                                                                                                <p className='gap-2 font-bold  px-2 ml-2 md:text-sm text-darkTextColor py-1 outline-brandBlue'>
                                                                                                    {items?.replyedUserDetails?.name}
                                                                                                </p>
                                                                                            </div>
                                                                                            <p className=' text-sm font-semibold text-gray-500 border-none'>
                                                                                                {new Date(items?.createdAt).toLocaleString('en-US', {
                                                                                                    weekday: 'long',
                                                                                                    month: 'short',
                                                                                                    day: 'numeric',
                                                                                                    hour: 'numeric',
                                                                                                    hour12: true,
                                                                                                })}
                                                                                            </p>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <p key={key} className='flex items-center py-2.5 pb-2 pt-2 px-4 justify-between '>
                                                                                    <div className='text-lightTextColor outline-none border-none w-full'>
                                                                                        {item.isEditing ? (
                                                                                            <textarea
                                                                                                name={items.comment}
                                                                                                id={items.commentId}
                                                                                                className={'w-full border outline-none rounded-xl px-4 p-2 resize-none hover:resize'}
                                                                                                value={items.comment}
                                                                                                onChange={event => {
                                                                                                    if (event.target.value.length > 100) {
                                                                                                        event.target.value = event.target.value.slice(0, 500);
                                                                                                    }
                                                                                                    const sanitizedValue = event.target.value.replace(
                                                                                                        /[^a-zA-Z0-9\s!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/g,
                                                                                                        ''
                                                                                                    );
                                                                                                    const taskCommentValue = fetchComments;
                                                                                                    taskCommentValue[key].comment = sanitizedValue;
                                                                                                    setfetchComments([...taskCommentValue]);
                                                                                                    document.getElementById(items.commentId).setAttribute('currentValue', sanitizedValue);
                                                                                                }}
                                                                                                maxLength={100}
                                                                                            />
                                                                                        ) : (
                                                                                            <div className='text-sm ps-8'>{items.comment}</div>
                                                                                        )}
                                                                                    </div>
                                                                                </p>
                                                                                {Cookies.get('isAdmin') === 'true'|| permission && permission?.comments?.delete === true  ? (
                                                                                <div className='text-[#52A4D1]  font-bold bg-gray px-2 py-1 ml-2 rounded-lg gap-2 flex justify-between flex-row text-xs items-center'>
                                                                                    {/* <p className='outline-brandBlue border-none'>{new Date(item.createdDate).toString().split('G')[0]}</p> */}
                                                                                    <div className='flex text-sm font-semibold justify-between gap-2 ps-8'>

                                                                                        <button
                                                                                            className='red-link disabled:opacity-25 disabled:cursor-not-allowed text-gray-400 hover:text-black'
                                                                                            onClick={() => {
                                                                                                setDeleteMessage('Delete comment ' + '"' + items.comment + '"');
                                                                                                setDeleteTaskId(items._id);
                                                                                                setDeleteReplyComment(true);
                                                                                                setOpenDeleteModel(true);
                                                                                            }}>
                                                                                            {/* <AiOutlineDelete /> */}
                                                                                            Delete
                                                                                        </button>
                                                                                    </div>
                                                                                </div>
                                                                                     ):('')}
                                                                            </div>
                                                                        </>
                                                                    </li>
                                                                ))}
                                                        </>
                                                    )}
                                                </div>
                                            </>
                                        </li>
                                    ))}
                            </ul>
                            {openDeleteModel && (
                                <DeleteConformation
                                    open={openDeleteModel}
                                    close={() => setOpenDeleteModel(false)}
                                    message={deleteMessage}
                                    onClick={() => {
                                        handleDeleteComment(), setOpenDeleteModel(false);
                                    }}
                                />
                            )}
                        </div>
                        <div>
                            <button type='button' className='border py-1 rounded-md outline-none w-15 text-sm px-2 mx-1' disabled={fetchComments?.length > 0 ? false : true} onClick={IncreaseLimit}>
                                Show More
                            </button>
                            <button type='button' className='border py-1 rounded-md outline-none w-15 text-sm px-2 mx-1' disabled={sortTable.limit === 10 ? true : false} onClick={DecreaseLimit}>
                                Show Less
                            </button>
                        </div>
                        </>
                    </div>
                        ):('')}
                    <div>
                    
                        <div className='flex justify-between items-center'>
                            <div className='flex gap-4 items-center font-bold text-md'>
                                <RxActivityLog />
                                <p className=''>Activity</p>
                            </div>
                            <div  className='flex gap-4 items-center font-bold text-xl'>
                            <FloatingOnlySelectfield
                          label={''}
                          optionsGroup={activityList}
                          name={'activityList'}
                          value={selectedOption ?? ''}
                          onChange={event => {
                            setSelectedOption(event.target.value);
                            handleGetAllActivity(`?ActivityType=${event.target.value}&ActivityTypeId=${taskId}&category=Updated&limit=100&orderBy=createdAt&sort=desc`);
                          }}
                        />
                            </div>
                            <div>
                                <button className=' text-white px-4 py-1 text-base bg-slate-400 rounded' onClick={() => setShowOrHide(!ShowOrHide)}>
                                    {ShowOrHide ? 'Hide Activities' : 'Show Activities'}
                                </button>
                            </div>
                        </div>
                        

                        <div>
                            <div className='js-card-detail-members-list py-4 flex'>
                                {/* <ul>
                                    {tasks?.assignedTo?.slice(0, 1).map((data, index) => (
                                        <>
                                            <li key={index} onClick={() => setSelectedColor(data)}>
                                                <div className='member js-member-on-card-menu' data-idmem='5dcd091ae102ec7ab20b1a8b'>
                                                    <img
                                                        className='member-avatar'
                                                        height='30'
                                                        width='30'
                                                        src={data.profilePic ? data.profilePic : '/imgs/user/user1.png'}
                                                        // srcSet='https://trello-members.s3.amazonaws.com/5dcd091ae102ec7ab20b1a8b/cadd085e663d0562a74e021143a04373/30.png 1x, https://trello-members.s3.amazonaws.com/5dcd091ae102ec7ab20b1a8b/cadd085e663d0562a74e021143a04373/50.png 2x'
                                                        alt={data.firstName}
                                                        title={data.firstName}
                                                    />
                                                </div>
                                            </li>
                                        </>
                                    ))}
                                </ul> */}
                                {/* <input placeholder='write a comment' className='border rounded-xl px-4 w-full outline-none'></input> */}
                            </div>
                        </div>
                    </div>
                    <ul className=' w-full'>
                        {ShowOrHide &&  activityData?.length > 0 ? (
                            activityData.map(item => (
                                <li key={item?.id}>
                                    {/* <div className={openTab === 1 ? "block" : "hidden"} id="link1"> */}
                                    <div>
                                        <>
                                            <div className='flex flex-row items-center justify-self-start'>
                                                <div className=''>
                                                    <span
                                                        className='flex bg-mediumBlue text-white rounded-full items-center justify-center text-sm w-8 h-8 p-2 hover:bg-lightBlue transition duration-300 ease-in-out'
                                                        data-mdb-ripple='true'
                                                        data-mdb-ripple-color='primary'>
                                                        <span className='font-bold'>{item?.name?.slice(0, 2)}</span>
                                                    </span>
                                                </div>
                                                <div className='flex flex-col'>
                                                    <div>
                                                        <div className='flex flex-col'>
                                                            <p className='gap-2 font-bold  px-2 py-1 ml-2 text-md text-darkTextColor outline-brandBlue'>{item?.name}</p>
                                                            <p className='gap-2   px-2 py-1 ml-2 text-md text-darkTextColor outline-brandBlue'>{item?.activityDetailes}</p>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className='text-[#52A4D1] font-bold bg-gray px-2 py-1 ml-2 rounded-lg gap-2 flex flex-row text-xs items-center'>
                                                            <p className='outline-brandBlue border-none text-md'>{new Date(item?.activityDate)?.toString()?.split('G')[0]}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    </div>
                                </li>
                           ))
                           ) : (
                             <li>
                               <p className='text-[#4E4E4E] font-bold px-2 py-1 md:text-md outline-brandBlue' style={{marginLeft:'200px'}}>No Data</p>
                             </li>
                         )}
                    </ul>
                </div>

                <DeleteConformation
                    open={showDeleteConfirmation}
                    close={() => setShowDeleteConfirmation(false)}
                    message='Are you sure you want to delete all SubTasks?'
                    onClick={handleDeleteSubTask}
                />
            </Modal>

            <ShareModal
                Title={'Share...'}
                CloseBtn={
                    <>
                        <button className='mt-5 bg-blue-300 px-4 py-1 h-6 flex items-center text-sm rounded-xl hover:shadow hover:shadow-gray-400' id='copyButton' onClick={closeShareModal}>
                            Copy
                        </button>
                    </>
                }
                marginT={'mt-5'}
                positionShare={'absolute left-[70%] top-[30%] translate-x-[-70%] translate-y-[-30%] modal-container z-[999] w-[300px] rounded-xl'}
                isOpen={isShareModalOpen}
                onClose={closeShareModal}
                ShareLink={process.env.SHARE_LINK + cardValues?._id}
                setCopyLink={setCopyLink}
                shareLinks={shareLinks}
            />
        </>
    );
}
export default CardInfo;
