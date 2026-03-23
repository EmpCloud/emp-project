/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState ,useMemo} from 'react';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight, MdOutlineKeyboardArrowRight } from 'react-icons/md';
import { HiArrowNarrowLeft } from 'react-icons/hi';
import { AiOutlineDelete } from '@react-icons/all-files/ai/AiOutlineDelete';
import { BsPlusSquare, BsPersonPlus, BsListTask, BsTag } from 'react-icons/bs';
import { AiOutlinePlus, AiOutlineSend } from 'react-icons/ai';
import { IoMdTime } from 'react-icons/io';
import { GrAttachment } from 'react-icons/gr';
import { LiaCommentSlashSolid } from 'react-icons/lia';
import { GoComment } from 'react-icons/go';
import { VscCommentUnresolved } from 'react-icons/vsc';
import { GoCommentDiscussion } from 'react-icons/go';
import FloatingTextfield from '../../../../components/FloatingTextfield';
import NewToolTip from '../../../../components/NewToolTip';
import ToolTip from '../../../../components/ToolTip';
import { useRouter } from 'next/router';
import { getAllCategory, getAllStages, getProjectById } from '../api/get';
//import { addTaskCategory, createSubtaskApi } from '../api/post'
import MultiSelectDropDown from '../../../../components/MultiSelectDropDown';
import { getAllUsers, getAllRoles } from '../../members/api/get';
import { getAllTaskType } from '../../config/api/get';
import { getActivity, searchtActivity, getAllTask } from '../../task/api/get';
import { filterActivityApi } from '../../task/api/post';
import { updateTaskStatus, updateSubTaskStatus } from '../../task/api/put';
import { createCommentApi, createReplyCommentApi } from '../api/post';
import { deleteCommentApi, deleteProjectById, deleteReplyCommentApi } from '../api/delete';
import { updateCommentApi, updateDate } from '../api/put';
import { getCommentsApi } from '../api/get';
import DropDownWithTick from '../../../../components/DropDownWithTick';
import { updateProjectStatus, updateProjectassingedTo } from '../api/put';
import { AVTAR_URL, USER_AVTAR_URL } from '../../../../helper/avtar';
import toast from '../../../../components/Toster/index';
import ContentEditable from '../../../../components/ContentEditable';
import SearchInput from '../../../../components/SearchInput';
import Filter from './projectactivityfilter';
import { BiEditAlt, BiHide } from 'react-icons/bi';
import { capitalizeString, handleUserClick } from '../../../../helper/function';
import DeleteConformation from '../../../../components/DeleteConformation';
import InputEmoji from 'react-input-emoji';
import validate from 'validate.js';
import { commentSchema } from '@HELPER/schema';
import { getAllGroups } from '../../groups/api/get';
import CreateOrEditSubtask from '../../task/components/createOrEditSubtask';
import CreateOrEditTask from '../../task/components/createOrEditTask';
import { getAllProject } from '../../projects/api/get';
import { fetchProfile } from '@WORKFORCE_MODULES/admin/api/get';
import Cookies from 'js-cookie';
import { TextArea } from '@COMPONENTS/TextArea';
import { FaCommentSlash, FaComments } from 'react-icons/fa';
import { TbActivity } from 'react-icons/tb';
import MemberModal from '@COMPONENTS/MemberModal';
import dynamic from 'next/dynamic';
import TinnySpinner from '../../../../components/TinnySpinner';


const viewProject = ({ stopLoading, startLoading, id }) => {
    const router = useRouter();
    const [projectDetail, setprojectDetail] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState();
    const [isOpen, setIsOpen] = useState(false);
    const [permission, setPermission] = useState(null);
    const [showActivity, setshowActivity] = useState(true);
    const [showComments, setshowComments] = useState(true);
    const [commentsFilter, setcommentsFilter] = useState(false);
    const [projectList, setprojectList] = useState([]);
    const [isEditing, setIsEditing] = useState(false);


    const [value, setValue] = useState('');
    useEffect(() => {
        document.body.classList.toggle('modal-open', showModal);
    }, [showModal]);
    const [projectDescription,setProjectDescription] = useState(null)

    const handleGetProjectById = (condition = `?id=${id}&limit=${process.env.TOTAL_USERS}&invitationStatus=1`) => {
        getProjectById(condition).then(response => {
            if (response.data.body.status === 'success') {
                setprojectDetail(response.data.body.data);
                setProjectDescription(response.data.body.data.project.description)
                setprojectList([
                    {
                        text: response.data.body.data.project.projectName,
                        value: response.data.body.data.project._id,
                    },
                ]);
            }
        });
    };
    const [openTab, setOpenTab] = React.useState(1);
    useEffect(() => {
        handleGetProjectById();
    }, [id]);
    const [showModal2, setShowModal2] = useState(false);
    useEffect(() => {
        document.body.classList.toggle('modal-open', showModal2);
    }, [showModal2]);
    const initialState = {
        isValid: false,
        values: {
            projectCode: null,
            projectName: null,
            projectManager: null,
            manager: null,
            estimationDate: null,
            startDate: null,
            endDate: null,
            actualBudget: null,
            plannedBudget: null,
            projectSponsor: null,
            description:null,
        },
        touched: {},
        errors: {
            projectCode: null,
            projectName: null,
            projectManager: null,
            manager: null,
            estimationDate: null,
            startDate: null,
            endDate: null,
            actualBudget: null,
            plannedBudget: null,
            projectSponsor: null,
            description:null,
        },
    };
    const [formState, setFormState] = useState({ ...initialState });
    useEffect(() => {}, [formState.values, formState.isValid]);
    useEffect(() => {
        // document.querySelector('body').classList.add('bg-slate-50');
        handleGetAllCategory();
        handleGetAllStage();
    }, []);
    const handleChange = event => {
        event.persist();
        setFormState(formState => ({
            ...formState,
            values: {
                ...formState.values,
                [event.target.name]: event.target.value,
            },
            touched: {
                ...formState.touched,
                [event.target.name]: true,
            },
        }));
    };
    const hasError = field => !!(formState.touched[field] && formState.errors[field]);
    // STATE FOR OPEN AND CLOSE SUBTASK CONTENT
    const [subtask, setSubtask] = useState(false);
    const toggle = () => {
        setSubtask(!subtask);
    };
    const [extrasubtask, extrasetSubtask] = useState(false);
    const togglesub = () => {
        handleGetProjectById('?id=' + id);
        extrasetSubtask(!extrasubtask);
    };
    const [task, settask] = useState(false);
    const toggletask = () => {
        settask(!task);
    };
    const [extratask, setextratask] = useState(false);
    const [taskProgress, settaskProgress] = useState(false);
    const [subTaskProgress, setsubTaskProgress] = useState(false);
    const toggleextrtask = () => {
        setextratask(!extratask);
    };
    const toggelProgress = () => {
        settaskProgress(!taskProgress);
    };
    const togglesubtask = () => {
        setsubTaskProgress(!subTaskProgress);
    };
    //datepicker data
    const inProgress_data = [{ name: 'In Progress' }, { name: 'Progress' }];
    const searchMemberDetails = [{ name: 'James X' }, { name: 'John' }, { name: 'Mac' }, { name: 'Dabshis' }];

    const [showIcon, setShowIcon] = useState(false);
    useEffect(() => {
        // document.querySelector('body').classList.add('bodyBg');
    }, [showIcon]);
    function classNames(...classes) {
        return classes.filter(Boolean).join(' ');
    }
    // Sidebar expand/colla
    const [openSideBar, setOpenSideBar] = useState(true);
    useEffect(() => {
        document.body.classList.toggle('open-sidebar', openSideBar);
    }, [openSideBar]);
    const [searchLabel, setSearchLabel] = useState(false);
    const [createLabel, setCreateLabel] = useState(false);
    const handleOpenCreateLabel = e => {
        e.preventDefault();
        setSearchLabel(false);
        setCreateLabel(true);
    };
    const handleOpenLabel = e => {
        e.preventDefault();
        setSearchLabel(true);
        setCreateLabel(false);
    };
    const colors = ['#F6CE3D', '#52D15F', '#EA663D', '#52A4D1', '#915BC7', '#6D72DF', '#963374', '#EE70C3', '#4E4E4E'];
    const [membersCount, setMembersCount] = useState(false);
    const [addMembers, setAddMembers] = useState(false);
    const [profileData, setprofileData] = useState([]);
    const [commentUpdate, setcommentUpdate] = useState(null);
    const [categoryList, setCategoryList] = useState(null);
    const handleOpenMemberCount = e => {
        e.preventDefault();
        setMembersCount(false);
        setAddMembers(true);
    };
    const handleAddMemberLabel = e => {
        e.preventDefault();
        setMembersCount(true);
        setAddMembers(false);
    };
    const handleProfileData = () => {
        fetchProfile().then(response => {
            if (response.data?.body.status === 'success') {
                setPermission(response.data.body.data.permissionConfig);
            }
        });
    };
    const [taskTypeDetails, setTaskTypeDetails] = useState(null);
    const handleGetAllTaskType = () => {
        getAllTaskType().then(response => {
            if (response.data?.body.status === 'success') {
                setTaskTypeDetails(
                    response.data?.body.data.data.map(ele => {
                        return { text: ele.taskType, value: ele.taskType };
                    })
                );
            }
        });
    };
    const [userObject, setUserObject] = useState([]);

    const handleGetAllUser = (condition = '') => {
        getAllUsers(condition).then(response => {
            if (response.data.body.status === 'success') {
                setUserObject(
                    response?.data?.body?.data?.users.map(data => {
                        return { id: data._id, role: data.role, key: data.firstName + ' ' + data.lastName, value: data };
                    })
                );
            }
        });
    };

    const [users, setUsers] = useState([]);

    const handleGetAllUsers = (condition = `?limit=${process.env.TOTAL_USERS}&invitationStatus=1&suspensionStatus=false`) => {
        getAllUsers(condition).then(response => {
            if (response.data?.body.status === 'success') {
                setUsers(
                    response.data?.body?.data?.users.map(data => {
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
    const [taskDetails, settaskDetails] = useState(null);
    const [groupList, setGroupList] = useState(null);
    const handleGetAllTask = (condition = '') => {
        getAllTask(condition).then(response => {
            if (response.data?.body.status === 'success') {
                settaskDetails(response.data?.body.data.tasks);
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
        handleGetAllUser('?limit=' + process.env.TOTAL_USERS + '&invitationStatus=1&suspensionStatus=false');
        handleGetAllTask();
        handleGetAllGroup();
        handleGetAllTaskType();
        handleProfileData();
    }, []);
    useEffect(() => {
        if (projectList.length > 0) {
            handleGetAllUsers();
        }
    }, [projectList]);
    const statusDetails = [{ name: 'Todo' }, { name: 'Inprogress' }, { name: 'Pending' }, { name: 'Review' }, { name: 'Done' }];

    const [sortTable, setSortTable] = useState({
        skip: 10,
        limit: 10,
        pageNo: 1,
    });
    const [activityData, setActivityData] = useState([]);
    const [activityCount, setActivityCount] = useState(0);
    const [searchKeyword,setKeyword] = useState('');
    const [type, setType] = useState(null);
    const [filterData, setFilterData] = useState({});

    useEffect(() => {
    if(Object.keys(filterData).length > 0){
        handleGetFilterActivity("?limit="+sortTable.limit )
    }
    },[filterData])
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
                setActivityCount(Response.data.body.data.totalActivityCount);

            }
        });
    };
    useEffect(() => {
        // handleGetAllActivity('?ActivityType=Project' + '&ActivityTypeId=' + id + '&limit=' + sortTable.limit);
        if(type === "search"){
            handleSearchActivity('?keyword=' + searchKeyword + '&limit=' + sortTable.limit)
          }else if(type === "filter"){
            handleGetFilterActivity("?limit=" +sortTable.limit)
          }else{
          handleGetAllActivity('?ActivityType=project' + '&ActivityTypeId=' + id + '&limit=' + sortTable.limit)
          }
    }, [id, sortTable.limit,searchKeyword]);
    const handleSearchActivity = (condition='') => {
        if(searchKeyword == null) return false;
        searchtActivity(condition='').then(Response => {
            if (Response.data.body.status === 'success') {
                setActivityData(
                    Response?.data?.body?.data?.fetchActivity?.map(data => {
                        return {
                            name: data.userDetails.name,
                            activityDetailes: data.activity,
                            activityDate: data.createdAt,
                            profilePic: data.userDetails.profilePic,
                        };
                    })
                );
            }
        });
    };
    const handleGetFilterActivity = (condition) => {
        setType("filter")
        setSortTable({
            skip: 0,
            limit: 10,
            pageNo: 1,
        });
        event.preventDefault();
        filterActivityApi(condition,filterData)
            .then(response => {
                if (response.data.body.status === 'success') {
                    setActivityData(
                        response.data.body.data.map(data => {
                            return {
                                name: data.userDetails.name,
                                activityDetailes: data.activity,
                                activityDate: data.createdAt,
                                profilePic: data.userDetails.profilePic,
                            };
                        })
                    );
                }
            })
            .catch(function (e) {
                stopLoading();
                toast({
                    type: 'error',
                    message: e.response ? e.response.data.body.message : 'Something went wrong, Try again !',
                });
            });
    };
    const handlePaginationGroupActivity = (condition) => {
        

        if(type === "filter"){
            handleGetFilterActivity(condition)
            }else  if(type === "search"){
              
              handleSearchActivity(condition)
        
           
        }else{
        
          
            getActivity(condition).then(Response => {
                if (Response.data.body.status == 'success') {
                    setActivityData(
                        Response.data.body.data.activity.map(data => {
                            return {
                                name: data.userDetails.name,
                                activityDetailes: data.activity,
                                activityDate: data.createdAt,
                                profilePic: data.userDetails.profilePic,
                            };
                        })
                    );
                    setActivityCount(Response.data.body.data.totalActivityCount);
    
                }
            });
          
        }
      };
      const [sortTables, setSortTables] = useState({
        skip: 10,
        limit: 10,
        pageNo: 1,
    });
    const initialValues = {
        isValid: false,
        values: {
            comment: ' ',
            reply:''
        },
        touched: {},
        errors: {
            comment: null,
        },
    };
    const schema = {
        comment: commentSchema,
    };
    const [userName, setuserName] = useState([]);
    const [commentData, setcommentData] = useState({ ...initialValues });
    const [fetchComments, setfetchComments] = useState([]);
    const [replyDeleteComment,setDeleteReplyComment]=useState(false)

    useEffect(() => {
        // document.querySelector('body').classList.add('bg-slate-50');
    });
    const handleGetUsers = (condition) => {
        getAllUsers(condition).then((response) => {
          if (response.data?.body.status === "success") {
            setuserName(
              response?.data?.body?.data?.users.map((data) => {
                return { name: data?.firstName + "_" + data?.lastName, profilPic: data?.profilePic, user_name: data?.userName}
    
              })
            );
          }
        });
      };
    const handleUserName = () => {
        if (projectDetail) {
            handleGetUsers('?limit=5000&invitationStatus=1&suspensionStatus=true&invitationStatus=1&suspensionStatus=false&projectId='+id);
        }
    };
    useEffect(() => {
        handleUserName();
    }, [projectDetail]);
    //const hasErrors = field => !!(commentData.touched[field] && commentData.errors[field]);
    const searchMention = async text => {
        let value = [];
        if (text) {
            userName?.map((key, index) => {
                let userValue = {};
                userValue['image'] = key.profilPic;
                userValue['name'] =(key.user_name)?.replace(/@/g, '');
                userValue['id'] = key.user_name;
                userValue ? value.push(userValue) : value.push({ image: 'https://avatars.dicebear.com/api/bottts/Harishgowda.svg', name: 'Harish_gowda', id: '@Harish_gowda' });
            });
        }
        let result = value.filter(function (ele) {
            return ele?.id?.toLowerCase()?.indexOf(text?.toLowerCase()) >= 0;
        });
        const reResult = result.map(({ id, ...rest }) => ({ ...rest }));
        return reResult;
    };

    useEffect(() => {
        searchMention(commentData.values.comment);
    }, [commentData.values.comment]);
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
    const handleChangeCommentReply = (data) => {
        const errors = validate(formState.values, schema);
        setcommentData(commentData => ({
          ...commentData,
          values: {
            reply: data,
          },
          isValid: !errors,
          errors: errors || {},
        }))
      };
    const handleGetallComments = (condition = ' ') => {
        getCommentsApi(condition)
            .then(function (response) {
                if (response.body.status === "success") {
                    setfetchComments(
                        response?.body?.data?.map(data => {
                            return { commentId: data._id, name: data.commentCreator.creatorName, comment: data.comment, createdDate: data.createdAt, is_edited: data.isEdited,reply:data?.reply };
                        })
                    );
                } else {
                    toast({
                        type: 'error',
                        message: response ? response.body.message : 'Error',
                    });
                }
            })
            .catch(function (e) {
                stopLoading();
                toast({
                    type: 'error',
                    message: e.response ? e.response.body.error : 'Something went wrong, Try again !',
                });
            });
    };
    const [isReplying, setIsReplying] = useState(new Array(fetchComments?.length).fill(false));

    useEffect(() => {
        if(commentsFilter===false){
        handleGetallComments('?projectId=' + id + '&limit=' + sortTables.limit+'&orderBy=createdAt&sort=desc');
        }else{
        handleGetallComments('?projectId=' + id + '&limit=' + sortTables.limit+'&orderBy=updatedAt&sort=desc');
        }
    }, [id, commentsFilter,sortTables.limit]);
    const handleAddComments = () => {
        let comment = commentData.values.comment;
        let realComment = comment.replace(/\[/g, '');
        let com = realComment.replace(/\]\(userId:undefined\)/g, ' ')
        let userName=com.match(/@[\w-]+/g) || [];
        if(com===''||com===' '){
            toast({
              type: 'warn',
              message:  'Comment cannot be Empty!!',
            });
            return
          }
        createCommentApi({ comment: com ,userName:userName}, id)
            .then(function (response) {
                if (response.body.status == 'success') {
                    handleGetallComments('?projectId=' + id + '&limit=' + sortTable.limit);
                    toast({
                        type: 'success',
                        message: response ? response.body.message : 'Try again !',
                    });
                    setcommentData(initialValues);
                }
            })
            .catch(error => {
                toast({
                    type: 'error',
                    message: error.response ? error.response.body.message : 'Something went wrong, Try again !',
                });
            });
    };
    const handleReplyComments = (replyId) =>{
        let comment = commentData.values.reply;
        let realComment = comment.replace(/\[/g, '');
        let com = realComment.replace(/\]\(userId:undefined\)/g, ' ')
        let userName=com.match(/@[\w-]+/g) || [];
        if(com===''){
            toast({
              type: 'warn',
              message:  'Reply cannot be Empty!!',
            });
            return
          }
        createReplyCommentApi({ comment: com ,userName:userName }, `${replyId}`).then(function (response) {
          if (response.body.status === 'success') {
            handleGetallComments('?projectId=' + id + '&limit=' + sortTable.limit);
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
          .catch((error) => {
            toast({
              type: 'error',
              message: error.response ? error.response.body.message : 'Something went wrong, Try again !',
            });
          });
      }
    function handleReset() {
        setcommentData({ ...initialValues });
        setIsOpen(false);
    }
    const handleUpdateComment = (id, data) => {
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
    const handleDeleteComment = () => {
        if(replyDeleteComment===false){
        deleteCommentApi(deleteTaskId)
            .then(function (response) {
                if (response.body.status === "success") {
                    handleGetallComments('?projectId=' + id + '&limit=' + sortTable.limit);
                    toast({
                        type: 'success',
                        message: response ? response.body.message : 'Try again !',
                    });
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
        }else{
            deleteReplyCommentApi(deleteTaskId).then(function (response) {
                if (response.body.status == 'success') {
          
                  toast({
                    type: 'success',
                    message: response ? response.body.message : 'Try again !',
                  });
                  handleGetallComments('?projectId=' + id + '&limit=' + sortTable.limit);
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
                handleGetallComments('?projectId=' + id + '&limit=' + sortTable.limit);
                setDeleteReplyComment(false);
        }
    };
    const [assigned, setassigned] = useState([]);
    const handleChangeMultiSelector = (data, name) => {
        let Ids = data.map(Id => {
            return { id: Id.id };
        });
        updateProjectassingedTo(Ids, id).then(response => {
            if (response.data.body.status == 'success') {
                handleGetProjectById('?id=' + id);
            }
        });
        var finalData = data.map(function (val) {
            return val.value;
        });
        setassigned(finalData);
        let profile = finalData.map(function (pic) {
            return { profile: pic.profilePic, firstName: pic.firstName, lastName: pic.lastName, Id: pic._id, email: pic.email };
        });
        setprofileData(profile);
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

    const handleChangeStatus = (data, id) => {
        if(permission?.project.edit === true || Cookies.get('isAdmin') === 'true'){
        updateProjectStatus({ status: data.name }, id)
            .then(function (result) {
                if (result.data.body.status == 'success') {
                    handleGetProjectById('?id=' + id);
                    // toast({
                    //     type: 'success',
                    //     message: result ? result.data.body.message : 'Try again !',
                    // });
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
            }
    };
    const handleChangeTaskStatus = id => {
        let data;
        data = taskProgress === true ? 'InProgress' : 'Done';
        updateTaskStatus({ taskStatus: data }, id).then(function (result) {
            if (result.data.body.status == 'success') {
                handleGetProjectById('?id=' + id);
            }
        });
    };
    const handleChangeSubtaskStatus = _id => {
        let data = subTaskProgress == true ? 'InProgress' : 'Done';
        updateSubTaskStatus({ subTaskStatus: data }, _id).then(function (result) {
            if (result.data.body.status == 'success') {
                handleGetProjectById('?id=' + id);
            }
        });
    };

    const handleUpdateProjectDetails = (id, data) => {
        if(data.project.description===projectDescription){
            toast({
                type: "warn",
                message:  "No Change in the Value!",
              });
            return
        }
        
        updateProjectStatus({ description: data.project.description }, id)
            .then(function (result) {
                if (result.data.body.status == 'success') {
                    handleGetProjectById('?id=' + id);
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
    const handleDeleteProjectById = id => {
        if(permission?.project?.delete === true || Cookies.get('isAdmin') === 'true'){
        deleteProjectById(id)
            .then(function (result) {
                if (result.data.body.status == 'success') {
                    toast({
                        type: 'success',
                        message: result ? result.data.body.message : 'Try again !',
                    });
                    router.push('/w-m/projects/all');
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
        }else{
            toast({
                type: 'warn',
                message: "You don't have the permission to Delete the Project !!!",
            });
        }
    };
    const [roleList, setRoleList] = useState(null);
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
    const handleUpdateDate = event => {
        updateDate(event, id).then(result => {
            if (result.data.body.status === 'success') {
                handleGetProjectById('?id=' + id);
                // toast({
                //     type: 'success',
                //     message: result ? result.data.body.message : 'Try again !',
                // });
            } else {
                toast({
                    type: 'error',
                    message: result ? result.data.body.error : 'Error',
                });
            }
        });
    };
    const toggleReply = (commentIndex) => {
        const newReplyOpen = [...isReplying];
        newReplyOpen[commentIndex] = !newReplyOpen[commentIndex];
        setIsReplying(newReplyOpen);
      };
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
const DynamicCustomInput =useMemo(()=> dynamic(()=>import('@COMPONENTS/ReactQuillTextEditor'), { ssr: false }),[]);
const displayValue = () => {
    // Use DOMParser to parse HTML and extract text content
    const parser = new DOMParser();
    const parsedHtml = parser.parseFromString(projectDetail.project.description, 'text/html');
    return parsedHtml.body.textContent || "";
  };
    

  const [showDynamicInput, setShowDynamicInput] = useState(false);

  const handleTextAreaClick = () => {
    setShowDynamicInput(!showDynamicInput);
  };
  
    if (projectDetail) {
        return (
            <div>
                {/* Start Main Body */}
                <div className='mb-0 text-base text-lightTextColor '>
                    <a className='flex items-center cursor-pointer hover:text-brandBlue'>
                        {' '}
                        <span
                            onClick={() => {
                                router.push('/w-m/projects/all');
                            }}>
                            {' '}
                            <div className='flex items-center'>
                                {' '}
                                <HiArrowNarrowLeft className='mr-2' />
                                <span>Back to all projects</span>
                            </div>
                        </span>
                    </a>
                </div>
                <div className='mt-2 flex flex-col lg:flex-row gap-2'>
                    <div className='card sm:gap-8 w-full lg:w-3/4'>
                        {/* LEFT SIDE TASK MANAGEMENT AREAR START */}
                                <div className='heading_part'>
                                    <div className='md:flex justify-between md:col-span-8 col-span-12 mb-5'>
                                        <ul className='inline-flex items-center space-x-1 md:space-x-3'>
                                            <li className='inline-flex items-center'>
                                                <a href='#' className='text-base font-black text-gray-700 hover:text-gray-900 md:ml-2 dark:text-gray-400 dark:hover:text-white'>
                                                    {/* {projectDetail.project.projectName} */}
                                                    {projectDetail.project.projectName.length > 10 ? projectDetail.project.projectName.substring(0, 10) + '...' : projectDetail.project.projectName}
                                                </a>
                                            </li>
                                            <MdOutlineKeyboardArrowRight className='w-6 h-6 text-lightTextColor' />
                                            <li>
                                                <div className='flex items-center'>
                                                    {/* <NewToolTip direction='top' message={"New feature[Click to change task type]"}>
                            
                                                        icon={<span className="w-4 h-4 bg-greenColor rounded flex">{projectDetail.project.projectCode}</span>}
                                                        
                                                    </NewToolTip> */}
                                                    <a href='#' className='ml-1 text-base font-bold text-gray-700 hover:text-gray-900 md:ml-2 dark:text-gray-400 dark:hover:text-white'>
                                                        {projectDetail.project.projectCode}
                                                    </a>
                                                </div>
                                            </li>
                                        </ul>
                                        {/* <img src={AVTAR_URL + projectDetail.project.projectName + '.svg'} alt='Project avtar' width={80} height={50} /> */}
                                        {/* <p className={projectDetail.priority === "High" ? "priority-with-bg text-priority1Color bg-priority1bg" : (projectDetail[0].priority === "Medium" ? "priority-with-bg text-priority1Color bg-priority2bg" : "priority-with-bg text-priority3Color bg-priority3bg")}>{projectDetail[0].priority}</p> */}
                                    </div>
                                    <div className='flex justify-between'>
                                        {/* <p className='md:text-base text-darkTextColor py-1 outline-brandBlue'>{projectDetail.project.projectName}</p> */}
                                        <div className='status-container'>
                                            <p className='font-bold text-base text-lightTextColor ml-1'>Status:</p>
                                            <DropDownWithTick
                                                paddingForDropdown={"py-1"}
                                                onChangeValue={handleChangeStatus}
                                                data={statusDetails}
                                                width={'w-[100px]'}
                                                value={projectDetail.project.status}
                                                id={projectDetail.project._id}
                                                handle={undefined}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='flex flex-col'>
                                    <div className='flex flex-row items-center text-base flex-wrap gap-4 md:gap-10 my-3'>
                                        <div className='flex gap-1 flex-col items-start text-defaultTextColor my-5 md:my-0'>
                                            <div className='flex items-center'>
                                                <IoMdTime />
                                                <p className='font-bold text-lightTextColor ml-1'>Start Date</p>
                                            </div>
                                            <div className='remove_margin '>
                                                <FloatingTextfield
                                                    type='date'
                                                    name={'start Date'}
                                                    // min={formState.values.startDate || ''}
                                                    min={new Date(projectDetail?.project?.createdAt)?.toISOString()?.substr(0, 10)}
                                                    label={''}
                                                    value={projectDetail.project.startDate.split('T')[0] ?? new Date()}
                                                    onChange={event => {
                                                        handleUpdateDate({ startDate: event.target.value });
                                                    }}
                                                    disabled={permission?.project.edit === true || Cookies.get('isAdmin') === 'true' ? false:true}
                                                />
                                            </div>
                                        </div>
                                        <div className='flex gap-1 flex-col items-start text-defaultTextColor my-5 md:my-0'>
                                            <div className='flex items-center'>
                                                <IoMdTime />
                                                <p className='font-bold text-lightTextColor ml-1'>End Date</p>
                                            </div>
                                            <div className='remove_margin '>
                                                <FloatingTextfield
                                                    type='date'
                                                    name={'start Date'}
                                                    min={new Date(projectDetail.project.createdAt).toISOString().substr(0, 10)}
                                                    label={''}
                                                    value={projectDetail?.project?.endDate?.split('T')[0] ?? new Date()}
                                                    onChange={event => {
                                                        handleUpdateDate({ endDate: event.target.value });
                                                    }}
                                                    disabled={permission?.project.edit === true || Cookies.get('isAdmin') === 'true' ? false:true}
                                                />
                                            </div>
                                        </div>
                                        <div className='flex gap-1 flex-col items-start text-defaultTextColor my-5 md:my-0'>
                                            <div className=' flex items-center'>
                                                <IoMdTime />
                                                <p className='font-bold text-lightTextColor ml-1'>Estimation Date</p>
                                            </div>
                                            <div className='remove_margin '>
                                                <FloatingTextfield
                                                    type='date'
                                                    name={'start Date'}
                                                    min={new Date(projectDetail.project.createdAt).toISOString().substr(0, 10)}
                                                    label={''}
                                                    value={projectDetail.project.estimationDate.split('T')[0] ?? new Date()}
                                                    onChange={event => {
                                                        handleUpdateDate({ estimationDate: event.target.value });
                                                    }}
                                                    disabled={permission?.project.edit === true || Cookies.get('isAdmin') === 'true' ? false:true}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex justify-start gap-2'>
                                        <div className='flex items-center text-base font-bold text-lightTextColor md:my-3 my-3'>
                                            Assigned To :
                                            <div className='ml-2 user-img-group items-center'>
                                                {projectDetail.project.userAssigned.length == 0 && <>Not Assigned</>}
                                                                    {projectDetail.project.userAssigned.length <= 2 ? (
                                                                        projectDetail.project.userAssigned.slice(0, 3).map(function (d1) {
                                                                            return (
                                                                                <ToolTip className='relative w-[30px] h-[30px] shadow-md rounded-full' message={d1.firstName + ' ' + d1.lastName} userId={d1._id} >
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
                                                                                        src={projectDetail?.project?.userAssigned === undefined ? [] : projectDetail?.project?.userAssigned[0]?.profilePic ?? USER_AVTAR_URL + `${projectDetail?.project?.userAssigned[0]?.firstName}.svg`}
                                                                                        alt=''
                                                                                    />
                                                                                </div>
                                                                                <div className='relative w-[30px] h-[30px] shadow-md rounded-full  flex flex-col items-center group' >
                                                                                    <img
                                                                                        className='bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 w-10 h-10 rounded-full'
                                                                                        src={projectDetail?.project?.userAssigned === undefined ? [] : projectDetail?.project?.userAssigned[1]?.profilePic ?? USER_AVTAR_URL + `${projectDetail?.project?.userAssigned[1].firstName}.svg`}
                                                                                        alt=''
                                                                                    />
                                                                                </div>
                                                                                <MemberModal members={projectDetail.project.userAssigned ? projectDetail.project.userAssigned : ""} remainingCount={projectDetail.project.userAssigned?.length - 2}  />
                                                                            </div>
                                                                    )}
                                            </div>
                                        </div>                                
                                        <div className='flex items-center text-base text-lightTextColor flex-row font-bold my-3'>
                                            Created by :
                                            <div className='user-img-group'>
                                                <NewToolTip
                                                    className='relative ml-2 w-[30px] h-[30px] shadow-md rounded-full'
                                                    message={projectDetail.project.projectCreatedBy.firstName + ' ' + projectDetail.project.projectCreatedBy.lastName} >
                                                      <img onClick={()=>handleUserClick(projectDetail.project.projectCreatedBy.isAdmin ,projectDetail.project.projectCreatedBy.id,projectDetail.project.projectCreatedBy.isSuspended)} style={{ cursor: 'pointer' }}
                                                        src={projectDetail.project.projectCreatedBy.profilePic ?? USER_AVTAR_URL + projectDetail.project.projectCreatedBy.firstName}
                                                        className='user-img-sm w-8 h-8 cursor-pointer'
                                                        alt='user'
                                                    />
                                                </NewToolTip>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/*discription */}
                                <div className='sm:my-6 my-4 text-base text-defaultTextColor'>
                                    <p className='heading-medium font-semibold text-gray-600 !text-base'>Description</p>
                    
                                    {permission?.project.edit === true || Cookies.get('isAdmin') === 'true'  ? 
                                     showDynamicInput ? (
                                        <DynamicCustomInput
                                        name={projectDetail.project.description}
                                        className='text-base border rounded-md w-full px-3 py-1 bg-gray-100/50 outline-brandBlue'
                                        value={projectDetail.project.description}
                                        onChange={event => {
                                            const projectDetailsValue = { ...projectDetail };
                                            projectDetailsValue.project.description = event;
                                            // setprojectDetail(projectDetailsValue);
                                        }}
                                        disabled={permission?.project.edit === true || Cookies.get('isAdmin') === 'true' ? false:true}              
                                        />
                                        ) : (
                                        <div onClick={handleTextAreaClick}>

                                            <TextArea
                                            name={projectDetail.project.description}
                                            className='text-base border rounded-md w-full px-3 py-1 bg-gray-100/50 outline-brandBlue'
                                            value={displayValue()}
                                            backgroundColor={'darkGray'}
                                            onChange={event => {
                                                const projectDetailsValue = { ...projectDetail };
                                                projectDetailsValue.project.description = event.target.value;
                                                // setprojectDetail(projectDetailsValue);
                                                
                                            }}
                                            // disabled={true}
                                        />
                                        </div>)
                                        :
                                    <TextArea
                                        name={projectDetail.project.description}
                                        className='text-base border rounded-md w-full px-3 py-1 bg-gray-100/50 outline-brandBlue'
                                        value={displayValue()}
                                        onChange={event => {
                                            const projectDetailsValue = { ...projectDetail };
                                            projectDetailsValue.project.description = event.target.value;
                                            // setprojectDetail(projectDetailsValue);
                                            
                                        }}
                                        disabled={permission?.project.edit === true || Cookies.get('isAdmin') === 'true' ? false:true}
                                    />}
                                </div>
                                
                                <div className='flex text-md justify-center'>
                                    <button
                                        className='small-button items-center xs:w-full py-1 flex h-8 w-fit'
                                        onClick={() => {
                                            handleUpdateProjectDetails(projectDetail.project._id, projectDetail);
                                            handleTextAreaClick();
                                        }}>
                                        SAVE
                                    </button>
                                </div>
                                {/*Task*/}
                                
                                <div className={`${task || subtask ? "block":"hidden"}`}>
                               
                                {task ? 
                                <div className='sm:my-5 my-3 text-defaultTextColor'>
                                    <div className='flex items-center justify-between'>
                                        <p className='heading-medium w-2/12'>Tasks</p>
                                        <div className='w-10/12 flex items-center'>
                                            <div className='w-full bg-gray-200 rounded-full h-2.5 '>
                                                <div
                                                    className='bg-brandBlue h-2.5 rounded-full'
                                                    style={{
                                                        width: `${projectDetail.project.progress}%`,
                                                        backgroundColor: projectDetail.project.progress === 100 ? 'limegreen' : '',
                                                    }}></div>
                                            </div>
                                            <div className='text-base font-medium text-defaultTextColor ml-3'>{projectDetail.project.progress}%</div>
                                        </div>
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <div className='border rounded flex items-center justify-between p-4'>
                                            <div className='text-base font-bold outline-none border-none'>
                                                Total Tasks :
                                                <p className='inline-block ml-2 px-4 py-1 bg-blue-200 text-balck font-bold text-base leading-snug uppercase rounded shadow-md hover:bg-blue-200 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out'>
                                                    {projectDetail.project.taskDetails.length ?? '0'}
                                                </p>
                                            </div>
                                            <div className='text-base font-bold outline-none border-none'>
                                                Total Completed Tasks :
                                                <p className='inline-block ml-2 px-4 py-1 bg-green-200 text-balck font-bold text-base leading-snug uppercase rounded shadow-md hover:bg-green-200 hover:shadow-lg focus:bg-green-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-800 active:shadow-lg transition duration-150 ease-in-out'>
                                                    {projectDetail.project.completedTask ?? '0'}
                                                </p>
                                            </div>
                                            <div className='text-base font-bold outline-none border-none'>
                                                Total Remaining Tasks :
                                                <p className='inline-block ml-2 px-4 py-1 bg-red-200 text-balck font-bold text-base leading-snug uppercase rounded shadow-md hover:bg-red-200 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out'>
                                                    {projectDetail.project.pendingTak ?? '0'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: extratask ? '' : 'none' }} className=''>
                                        {projectDetail.project.taskDetails.map(task => (
                                            <div className='flex flex-col gap-2'>
                                                <div className='border rounded flex items-center justify-between p-4'>
                                                    <div className='text-base text-lightTextColor outline-none border-none w-4/5'>{task?.taskTitle}</div>
                                                    <input
                                                        type='checkbox'
                                                        name=''
                                                        checked={task?.taskStatus==='Done'?true:false} 
                                                        className='h-4 w-4'
                                                        disabled={true}
                                                        // onClick={() => {
                                                        //     toggelProgress(), handleChangeTaskStatus(task._id);
                                                        // }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className='flex flex-row items-center sm:py-2 py-1 gap-10'>
                                        <div className='text-base cursor-pointer hover:text-lightBlue transition-all duration-300'>
                                            <div className='text-base cursor-pointer hover:text-lightBlue transition-all duration-300'>
                                                {permission?.task?.create === true || Cookies.get('isAdmin') === 'true' ? (
                                                    <CreateOrEditTask
                                                        type={'projectName'}
                                                        data={undefined}
                                                        {...{
                                                            handleGetAllTask,
                                                            handleGetAllUsers,
                                                            handleGetAllGroup,
                                                            projectList,
                                                            taskTypeDetails,
                                                            users,
                                                            stopLoading,
                                                            startLoading,
                                                            groupList,
                                                            handleGetProjectById,
                                                            categoryList,
                                                            stageList,

                                                        }}
                                                            
                                                        projectNames={projectDetail.project.projectName}
                                                        projectId={projectDetail.project._id}
                                                    />
                                                ) : (
                                                    <></>
                                                )}
                                            </div>
                                        </div>
                                        <p
                                            className='text-base cursor-pointer hover:text-lightBlue transition-all duration-300'
                                            onClick={() => {
                                                toggleextrtask();
                                            }}>
                                            {extratask ?  "Hide All tasks" :"Show All Task"}
                                        </p>
                                    </div>
                                </div>
                                :<></>
                                }
                                {/* Sub task */}

                                {subtask ? 
                                <div style={{ display: subtask ? '' : 'none' }} className='sm:my-5 my-3 text-defaultTextColor'>
                                    <div className='flex items-center justify-between w-11/12'>
                                        <p className='heading-medium'>Sub Tasks</p>
                                        <div className='w-10/12 flex items-center ml-3'>
                                            <div className='w-full bg-gray-200 rounded-full h-2.5 '>
                                                <div
                                                    className='bg-brandBlue h-2.5 rounded-full'
                                                    style={{
                                                        width: `${projectDetail.project.progress}%`,
                                                        backgroundColor: projectDetail.project.progress === 100 ? 'limegreen' : '',
                                                    }}></div>
                                            </div>
                                            <div className='text-base font-medium text-defaultTextColor ml-3'>{projectDetail.project.progress}%</div>
                                        </div>
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <div className='border rounded flex items-center justify-between p-4'>
                                            <div className='text-base font-bold outline-none border-none w-4/5'>
                                                Total SubTasks :
                                                <p className='inline-block ml-2 px-4 py-1 bg-blue-200 text-balck font-bold text-base leading-snug uppercase rounded shadow-md hover:bg-blue-200 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out'>
                                                    {projectDetail.project.subTaskDetails.length ?? '0'}
                                                </p>
                                            </div>
                                            <div className='text-base font-bold outline-none border-none w-4/5'>
                                                Total Completed SubTasks :
                                                <p className='inline-block ml-2 px-4 py-1 bg-green-200 text-balck font-bold text-base leading-snug uppercase rounded shadow-md hover:bg-green-200 hover:shadow-lg focus:bg-green-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-800 active:shadow-lg transition duration-150 ease-in-out'>
                                                    {projectDetail.project.completedSubTask ?? '0'}
                                                </p>
                                            </div>
                                            <div className='text-base font-bold outline-none border-none w-4/5'>
                                                Total Remaining SubTasks :
                                                <p className='inline-block ml-2 px-4 py-1 bg-red-200 text-balck font-bold text-base leading-snug uppercase rounded shadow-md hover:bg-red-200 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out'>
                                                    {projectDetail.project.pendingSubTak ?? '0'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: extrasubtask ? '' : 'none' }} className=''>
                                        {projectDetail.project.subTaskDetails.map((subtask, key) => (
                                            <div className='flex flex-col gap-2' key={key}>
                                                <div className='border rounded flex items-center justify-between p-4'>
                                                    <div className='text-base text-lightTextColor outline-none border-none w-4/5'>{subtask.subTaskTitle}</div>
                                                    <input
                                                        type='checkbox'
                                                        name=''
                                                        value=''
                                                        className='h-4 w-4'
                                                        onClick={() => {
                                                            toggelProgress(), handleChangeSubtaskStatus(subtask._id);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className='flex flex-row items-center sm:py-2 py-1 pl-3 gap-2'>
                                        <div className='flex flex-row items-center sm:py-2 py-1 pl-3 gap-2'>
                                            <div className='relative mr-3' id='step2'>
                                                {permission?.subtask.create === true || Cookies.get('isAdmin') === 'true' ? (
                                                    <CreateOrEditSubtask
                                                        handleGetAllGroup={undefined}
                                                        handleGetAllUsers={undefined}
                                                        subtaskType={'add'}
                                                        data={null}
                                                        {...{
                                                            projectList,
                                                            users,
                                                            taskTypeDetails,
                                                            taskDetails,
                                                            handleGetAllTask,
                                                            stopLoading,
                                                            startLoading,
                                                            groupList,
                                                            roleList,
                                                        }}
                                                    />
                                                ) : (
                                                    <></>
                                                )}
                                            </div>
                                            <p
                                                className='text-base cursor-pointer hover:text-lightBlue transition-all duration-300'
                                                onClick={() => {
                                                    togglesub();
                                                }}>
                                                All subtask
                                            </p>
                                        </div>
                                    </div>
                                </div>:<></>
                                }
                                </div>
                        
                    </div>
                    <div className='card px-4 py-2 w-full lg:w-1/3'>
                        <div className='bg-slate-50 dark:bg-gray-900 sm:p-5 sm:py-2 rounded-lg overflow-y-auto h-[500px]'>
                            <div className='right_full gap-2 flex flex-col border-b pb-3 sm:pb-5'>
                                <div className='flex  gap-2 flex-wrap items-center '>
                                    {/* <div className=' cursor-pointer'>
                                        <BsPlusSquare />
                                    </div>
                                    <p className='font-semibold text-md'>Add</p> */}
                                </div>
                                {/* <div className='flex flex-wrap text-base gap-2 items-center'>
                  <div className="file-input">
                    <input type="file" name="file-input" id="file-input_attachment" className="file-input__input" />
                    <label className="file-input__label" htmlFor="file-input">
                      <GrAttachment />
                      <span className='pl-1 cursor-pointer text-darkTextColor hover:text-lightBlue transition-all duration-300'>Attachment</span>
                    </label>
                  </div>
                </div> */}
                                <div className='flex text-base gap-2 flex-wrap items-center transition-all duration-300'>
                                    <div
                                        className='flex items-center cursor-pointer text-darkTextColor hover:text-lightBlue'
                                        onClick={() => {
                                            if(permission?.project?.edit === true || Cookies.get('isAdmin') === 'true'){
                                            setMembersCount(!membersCount);
                                            }
                                        }}>
                                        <BsPersonPlus className='mr-2' />
                                        Members
                                    </div>
                                    {membersCount && (
                                        <div className='w-full'>
                                            {/* <SelectDropDown data={searchMemberDetails} roundedSelect={true} /> */}
                                            <MultiSelectDropDown
                                                selectedValues={projectDetail.project.userAssigned}
                                                handleChangeMultiSelector={handleChangeMultiSelector}
                                                name={'members'}
                                                option={userObject}
                                            />
                                            <div className='flex flex-col my-5'>
                                                <p className='text-base text-darkTextColor mr-5 mb-2'>Selected </p>

                                                <div className='relative dark:text-gray-300'>
                                                    {profileData.length > 0
                                                        ? profileData?.map((ele, index) => (
                                                              <div  className='flex items-center justify-between border-b-2' key={index}>
                                                                  <div className='flex items-center border-b-2 w-[12%]'>
                                                                      <span className='h-[30px] w-[30px]'>
                                                                          <img
                                                                              src={ele.profile ?? USER_AVTAR_URL + ele.firstName + '.svg'}
                                                                              className='member-avatar user-img-sm w-full h-full cursor-pointer flex'
                                                                              alt={ele.firstName + ' ' + ele.lastName}
                                                                          />
                                                                      </span>
                                                                  </div>
                                                                    <div className='full-name w-[90%] break-words truncate' name={ele.firstName + ' ' + ele.lastName} aria-hidden='aria-hidden'>
                                                                          {ele.firstName + ' ' + ele.lastName} <span className='username'>({ele.email})</span>
                                                                      </div>
                                                              </div>
                                                          ))
                                                        : 
                                                        projectDetail.project.userAssigned.map((ele, index) => (
                                                              <div  className='flex items-center justify-between border-b-2' key={index}>
                                                                  <div className='flex items-center w-[12%]'>
                                                                      <span className='h-[30px] w-[30px]'>
                                                                          <img
                                                                              src={ele.profilePic ?? USER_AVTAR_URL + ele.firstName + '.svg'}
                                                                              className='member-avatar user-img-sm h-full w-full cursor-pointer flex'
                                                                              alt={ele.firstName + ' ' + ele.lastName}
                                                                          />
                                                                      </span>
                                                                  </div>
                                                                      <div className='full-name w-[90%] break-words truncate' name={ele.firstName + ' ' + ele.lastName} aria-hidden='aria-hidden'>
                                                                          {ele.firstName + ' ' + ele.lastName} <span className='username'>({ele.email})</span>
                                                                      </div>
                                                              </div>
                                                          ))}
                                                </div>
                                                {/* <div className='flex flex-col my-5'>
                                                    <p className='text-base text-lightTextColor mr-3 mb-3'>All Members </p>

                                                    <div className='user-img-group items-center'>
                                                        <div>
                                                            <span className='user-img-sm cursor-pointer text-base w-8 h-8 ml+3 flex justify-center items-center progress-count text-defaultTextColor bg-gray-100/70 font-bold flex'>
                                                                +{userObject?.length}
                                                            </span>
                                                        </div>
                                                        {userObject.map(ele => (
                                                            <ToolTip className='relative w-[30px] h-[30px] shadow-md rounded-full' message={ele.value.firstName + ' ' + ele.value.lastName}>
                                                                <img src={USER_AVTAR_URL + ele.value.firstName + '.svg'} className='user-img-sm w-8 h-8 cursor-pointer' alt='user' />
                                                            </ToolTip>
                                                        ))}
                                                    </div>
                                                </div> */}
                                                {/* <p className='cursor-pointer text-base font-bold text-lightTextColor flex items-center mt-5' onClick={handleOpenMemberCount}>
                                                    <AiOutlinePlus className='mr-2' /> Create a member
                                                </p> */}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {addMembers && (
                                    <div className='bg-white rounded-lg p-4 w-full'>
                                        <div className='flex justify-between'>
                                            <p className='text-base text-darkTextColor mb-1'>Add new member</p>
                                            <NewToolTip direction='top' message={'Back'}>
                                                <HiArrowNarrowLeft className='cursor-pointer' onClick={handleAddMemberLabel} />
                                            </NewToolTip>
                                        </div>
                                        <div className='remove_margin'>
                                            <FloatingTextfield
                                                type='text'
                                                label={''}
                                                name='workEmailAddress'
                                                placeholder='Work Email Address'
                                                value={formState.values.workEmailAddress || ''}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <button type='button' className='small-button items-center py-2 flex h-9 my-5' onClick={handleAddMemberLabel}>
                                            Invite
                                        </button>
                                    </div>
                                )}
                                    <div className='text-darkTextColor text-base flex items-center gap-2 cursor-pointer hover:text-lightBlue transition-all duration-300' 
                                    onClick={()=>{
                                         if(permission?.task?.create === true || Cookies.get('isAdmin') === 'true'){
                                        toggletask()
                                        }}}
                                    >
                                        <BsListTask />
                                        Tasks
                                    </div>
                                {/* <div className='flex text-base gap-2 flex-wrap items-center hover:text-lightBlue transition-all duration-300'>
                                    <div className='text-darkTextColor cursor-pointer hover:text-lightBlue transition-all duration-300'>
                                        <BsListTask onClick={toggle} />
                                    </div>
                                    <p className='text-darkTextColor cursor-pointer hover:text-lightBlue transition-all duration-300' onClick={toggle}>
                                        Subtasks
                                    </p>
                                </div> */}
                                <div className='flex text-base gap-2 flex-wrap items-center transition-all duration-300'>
                                    {/* <div className='flex text-darkTextColor hover:text-lightBlue cursor-pointer transition-all duration-300 items-center' onClick={handleOpenLabel}>
                                        <BsTag className='mr-2' /> Label
                                    </div> */}
                                    {/* {searchLabel && (
                    <div className="w-full">
                      <DropDownWithTick
                        onChangeValue={handleChangeCategory}
                        data={labelDetails}
                        width={"w-[100px]"}
                        value={projectDetail[0].category}
                        id={projectDetail[0]._id}
                        handle={undefined}
                      />
                      <div className='flex flex-col my-5'>
                        <p>Select a color</p>
                        <div className='flex flex-wrap'>
                          {
                            colors.map(color =>
                              <div key={color} className={`w-5 h-5 rounded-full mr-2 mb-2 cursor-pointer`} style={{ backgroundColor: `${color}` }}>
                              </div>
                            )}
                        </div>
                        <div className='flex flex-col my-5'>
                          <p className='text-base text-lightTextColor mr-3'>Selected </p>
                          <span className="bg-[#F6CE3D] flex justify-between items-center text-white text-base font-bold px-2 py-1 rounded-full">{projectDetail[0].category} <span className='flex flex-row cursor-pointer'><AiOutlineEdit className='text-white' />
                            <NewToolTip direction='top' message={"Close"}>
                              <AiOutlineClose className='ml-1 text-white mb-0' />
                            </NewToolTip>
                          </span></span>
                        </div>
                        <p className='cursor-pointer text-base font-bold text-lightTextColor flex items-center mt-5' onClick={handleOpenCreateLabel}><AiOutlinePlus className='mr-2' /> Create a label</p>
                      </div>
                    </div>
                   )} */}
                                </div>
                                {createLabel && (
                                    <div className='bg-white rounded-lg p-4 w-full'>
                                        <div className='flex justify-between'>
                                            <p className='text-base text-darkTextColor mb-1'>Create a label</p>
                                            <HiArrowNarrowLeft className='cursor-pointer' onClick={handleOpenLabel} />
                                        </div>
                                        <div className='remove_margin'>
                                            <FloatingTextfield type='text' label={''} name='category' placeholder='category' value={formState.values.category || ''} onChange={handleChange} />
                                        </div>
                                        <button type='button' className='small-button items-center py-2 flex h-9 my-5' onClick={handleAddCategory}>
                                            Create
                                        </button>
                                    </div>
                                )}
                                <div className='flex text-base gap-2 flex-wrap items-center '>
                                    <button type='button' onClick={() => setShowModal(true)} className='red-link cursor-pointer text-redColor transition-all duration-300 flex items-center'>
                                        <AiOutlineDelete className='mr-2' />
                                        Delete  project?
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Attachments */}
                {/* {
                  (taskDetail.attachment.length != 0) && taskDetail.attachment &&
                  <div className=''>
                    <p className='heading-medium'>Attachments</p>
                    <div className='flex flex-wrap sm:justify-start justify-center items-center sm:mt-3 gap-2 mt-1'>
                      <div className='p-2 relative bg-slate-200/60 md:h-28 md:w-36 w-full rounded-md mr-2 mb-2'>
                        <img className='h-full object-cover rounded-sm' src="/imgs/Downloadsoftware.png" alt="attachment imagesd" />
                        <div className='absolute top-0 right-0'>
                          <button className="w-5 h-5 text-lightGrey hover:text-darkTextColor absolute -right-2 -top-2 rounded-full bg-veryLightGrey uppercase text-base outline-none focus:outline-none p-1 ease-linear transition-all duration-150" type="button"><svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg></button>
                        </div>
                      </div>
                      <div className='p-2 relative bg-slate-200/60 md:h-28 md:w-36 w-full rounded-md mr-2 mb-2'>
                        <img className='h-full object-cover rounded-sm' src="/imgs/Downloadsoftware2.png" alt="attachment imagesd" />
                        <div className='absolute top-0 right-0'>
                          <button className="w-5 h-5 text-lightGrey hover:text-darkTextColor absolute -right-2 -top-2 rounded-full bg-veryLightGrey uppercase text-base outline-none focus:outline-none p-1 ease-linear transition-all duration-150" type="button"><svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg></button>
                        </div>
                      </div>
                      <div className='p-2 relative bg-slate-200/60 md:h-28 md:w-36 w-full rounded-md mr-2 mb-2'>
                        <img className='h-full object-cover rounded-sm' src="/imgs/Downloadsoftware.png" alt="attachment imagesd" />
                        <div className='absolute top-0 right-0'>
                          <button className="w-5 h-5 text-lightGrey hover:text-darkTextColor absolute -right-2 -top-2 rounded-full bg-veryLightGrey uppercase text-base outline-none focus:outline-none p-1 ease-linear transition-all duration-150" type="button"><svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg></button>
                        </div>
                      </div>
                      <div className='p-2 relative bg-slate-200/60 md:h-28 md:w-36 w-full rounded-md mr-2 mb-2'>
                        <img className='h-full object-cover rounded-sm' src="/imgs/Downloadsoftware2.png" alt="attachment imagesd" />
                        <div className='absolute top-0 right-0'>
                          <button className="w-5 h-5 text-lightGrey hover:text-darkTextColor absolute -right-2 -top-2 rounded-full bg-veryLightGrey uppercase text-base outline-none focus:outline-none p-1 ease-linear transition-all duration-150" type="button"><svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg></button>
                        </div>
                      </div>
                    </div>
                  </div>
                } */}
                <div className='mt-2 flex-col-reverse flex lg:flex-row gap-2 justify-between'>
                    <div className='card p-4 w-full'>
                            <div className='flex items-center justify-between flex-wrap'>
                            <div className='flex items-center'>
                                <p className='p-0 m-0 text-lightTextColor text-base'>Show</p>
                                <select
                                    value={sortTable.limit}
                                    onChange={event => {
                                        setSortTable({ ...sortTable, limit: event.target.value });
                                    }}
                                    className='border py-1  rounded-md outline-none w-15 text-sm px-2 mx-1'>
                                    <option value={10}>10</option>
                                    <option value={25}>25</option>
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                    <option value={500}>500</option>
                                </select>
                                <p className='p-0 m-0 text-lightTextColor text-base'>Entries</p>
                            </div>
                            <div className='flex justify-between items-center'>
                                <div className='relative mr-1'>
                                    <SearchInput onChange={(event)=>
                                    {setKeyword(event.target.value);
                                    setType("search")
                                    setSortTable( { skip: 0, limit: 10, pageNo: 1})
                                    }} placeholder={'Search a Activities'} />
                                </div>
                                <div className='relative mr-1 mt-1'>
                                    <Filter {...{  handleGetAllActivity ,setType,setFilterData}} projectMembers={projectDetail.project.userAssigned} />
                                </div>
                                <div className=' relative'>
                                    <NewToolTip direction='top' message={'Hide/Show Activity'}>
                                        <button
                                            type='button'
                                            className='border border-veryLightGrey text-xl px-3 py-1 rounded-lg cursor-pointer'
                                            onClick={() => {
                                                setshowActivity(!showActivity);
                                            }}>
                                            {showActivity == true ? <BiHide className='text-defaultTextColor' /> : <TbActivity className='text-defaultTextColor' />}
                                        </button>
                                    </NewToolTip>
                                </div>
                            </div>
                            </div>{' '}
                        
                        <p className='text-[#4E4E4E] font-bold px-2 py-1 md:text-xl outline-brandBlue mt-2'>Activity</p>
                        <ul className='h-[600px] overflow-x-auto'>
                        {showActivity && activityData?.length> 0 ?(
                                activityData.map(item => (
                                    <li key={item.id}>
                                        {/* <div className={openTab === 1 ? "block" : "hidden"} id="link1"> */}
                                        <div>
                                            <>
                                                <div className='flex flex-row items-center justify-self-start rounded-xl px-3 py-1 my-1'>
                                                    <div className=''>
                                                        <div
                                                            className='flex bg-mediumBlue text-white rounded-full items-center justify-center text-base w-8 h-8 p-2 hover:bg-lightBlue transition duration-300 ease-in-out'
                                                            data-mdb-ripple='true'
                                                            data-mdb-ripple-color='primary'>
                                                            <span className='font-bold'>{item?.name?.slice(0, 2)}</span>
                                                        </div>
                                                            
                                                    </div>
                                                    <div className='flex flex-col'>
                                                        <div>
                                                            <div className='flex justify-between items-center flex-row'>
                                                                <p className='gap-2 font-bold  px-2 ml-2 md:text-md text-darkTextColor py-1 outline-brandBlue'>{item?.name}</p>
                                                                <p className='outline-brandBlue border-none font-medium text-sm'>
                                                                    {new Date(item?.activityDate).toLocaleString('en-US', {
                                                                      weekday: 'long',
                                                                      month:'short',
                                                                      day:'numeric',
                                                                      hour: 'numeric',
                                                                      minute: 'numeric',
                                                                      second: 'numeric',
                                                                      hour12: true
                                                                    })}
                                                                    </p>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className='text-[#52A4D1] px-2 py-1 rounded-lg gap-2 flex flex-row text-base items-center'>
                                                            <p className='gap-2 px-2 md:text-base text-gray-500 py-1 break-words w-[70vw] md:w-[30vw] lg:w-[30vw] outline-brandBlue'>
                                                                    {item?.activityDetailes}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <hr />
                                            </>
                                        </div>
                                    </li>
                                    ))
                                    ) : (
                                        showActivity === false ?'':
                                        <>
                                        <li>
                                          <p className='text-[#4E4E4E] font-bold px-2 py-1 md:text-md outline-brandBlue' style={{marginLeft:'200px'}}>No Data</p>
                                        </li>
                                   
                                    </>
                                    )}
                                </ul>
                                {showActivity===true&& activityData && activityData.length != 0 && (
              <div className="flex justify-between items-center">
                <p className="p-0 m-0 text-lightTextColor text-base sm:my-4 my-2">
                  Showing {sortTable.limit * (sortTable.pageNo - 1) + 1} to{" "}
                  {sortTable.limit * sortTable.pageNo < activityCount
                    ? sortTable.limit * sortTable.pageNo
                    : activityCount}{" "}
                  of {activityCount}
                </p>

                <div className="flex items-center ">
                  <button
                    disabled={sortTable.pageNo == 1}
                    onClick={() => {
                      
                      handlePaginationGroupActivity(
                        "?skip=" + ((sortTable.limit*sortTable.pageNo)-(sortTable.limit*2)) + "&limit=" + sortTable.limit + '&ActivityType=Project' + '&ActivityTypeId=' + id 
                      );
                      setSortTable({ ...sortTable, pageNo: sortTable.pageNo - 1 ,skip: (sortTable.limit*sortTable.pageNo)-(sortTable.limit*2)});
                    }}
                    className="disabled:opacity-25  disabled:cursor-not-allowed  arrow_left border mx-1 bg-veryveryLightGrey cursor-pointer hover:bg-defaultTextColor hover:text-white"
                  >
                    <MdKeyboardArrowLeft />
                  </button>
                  <div className="pages">
                    <p className="p-0 m-0 text-lightTextColor text-base sm:my-4 my-2">
                      Page <span>{sortTable.pageNo}</span>
                    </p>
                  </div>
                  <button
                    disabled={
                      sortTable.pageNo ===
                      Math.ceil(activityCount / sortTable.limit)
                    }
                    onClick={() => {
                      setSortTable({
                        ...sortTable,
                        pageNo: sortTable.pageNo + 1,
                        skip: sortTable.pageNo * sortTable.limit,
                      });
                      handlePaginationGroupActivity(
                        "?skip=" + sortTable.limit*sortTable.pageNo + "&limit=" + sortTable.limit  +'&ActivityType=Project' + '&ActivityTypeId=' + id 
                      );
                    }}
                    className="disabled:cursor-not-allowed  arrow_right border mx-1 bg-veryveryLightGrey cursor-pointer hover:bg-defaultTextColor hover:text-white"
                  >
                    <MdKeyboardArrowRight />
                  </button>
                </div>
              </div>
            )}

                    </div>
                    {Cookies.get('isAdmin') === 'true'|| permission && permission?.comments?.view === true  ? (
                    <div className='card p-4 w-full'>
                        <div className=' '>
                            <h3 className='heading-medium'>
                                <div className='flex items-center '>
                                    <p className='p-0 m-0 text-lightTextColor text-base'>Show</p>
                                    <select
                                        value={sortTables.limit}
                                        onChange={event => {
                                            setSortTables({ ...sortTables, limit: event.target.value });
                                        }}
                                        className='border py-1  rounded-md outline-none w-15 text-sm px-2 mx-1'>
                                        <option value={10}>10</option>
                                        <option value={25}>25</option>
                                        <option value={50}>50</option>
                                        <option value={100}>100</option>
                                        <option value={500}>500</option>
                                    </select>
                                    <p className='p-0 m-0 text-lightTextColor text-base'>Entries</p>
                                </div>{' '}
                            </h3>
                            <div className='text-[#4E4E4E] gap-2 font-bold  px-2 ml-2 md:text-1xl py-1 outline-brandBlue flex items-center justify-between'>
                                Comments
                                <div className='flex gap-5'>
                                    <NewToolTip direction='top' message={'Show/Hide Comments'}>
                                        <button
                                            type='button'
                                            className='border border-veryLightGrey text-xl px-2 py-1 rounded-lg cursor-pointer items-center xs:w-full flex h-9 w-fit'
                                            onClick={() => {
                                                setshowComments(!showComments);
                                            }}>
                                            {showComments == true ? <LiaCommentSlashSolid /> : <GoComment />}
                                        </button>
                                    </NewToolTip>
                                    <NewToolTip direction='top' message={commentsFilter===false?'Newly Created Comments':'Recently Updated Comments'}>
                                        <button
                                            type='button'
                                            className='border border-veryLightGrey text-xl px-2 py-1 rounded-lg cursor-pointer items-center xs:w-full flex h-9 w-fit'
                                            onClick={() => {
                                                setcommentsFilter(!commentsFilter);
                                            }}>
                                            {commentsFilter == true ? <VscCommentUnresolved /> : <GoCommentDiscussion />}
                                        </button>
                                    </NewToolTip>
                                </div>
                            </div>
                            {/* comments */}
                            <div className='pt-3 pb-3'>
                                {Cookies.get('isAdmin') === 'true'|| permission && permission?.comments?.create === true  ? (
                                <div className='flex flex-col gap-5 relative'>
                                    <InputEmoji type='text' name='comment' value={commentData.values.comment} placeholder={'comment'} searchMention={searchMention} onChange={handleChangeComment} />
                                    <div
                                        className='cursor-pointer'
                                        onClick={() => {
                                            handleAddComments(), handleReset();
                                        }}>
                                        <button
                                            type='button'
                                            className=' items-center xs:w-full py-2 px-4 rounded-lg flex mx-auto z-20 absolute top-2 text-xl text-defaultTextColor right-10 hover:text-indigo-600'>
                                            <AiOutlineSend />
                                        </button>
                                    </div>
                                </div>
                                ):('')}
                            </div>
                        </div>
                        <div className=''>
                            <ul className='h-[500px] overflow-y-auto'>
                                {showComments &&
                                    fetchComments?.map((item, key) => (
                                        <li key={item.id}>
                                            <>
                                                <div className=' rounded-xl p-3 my-1 '>
                                                    <div className='flex flex-col'>
                                                        <div>
                                                            <div className='flex flex-row justify-between'>
                                                                <div className=' flex flex-row gap-1'>

                                                                <p
                                                                    className='flex bg-mediumBlue text-white rounded-full items-center justify-center text-base w-7 h-7 p-2 hover:bg-lightBlue transition duration-300 ease-in-out'
                                                                    data-mdb-ripple='true'
                                                                    data-mdb-ripple-color='primary'>
                                                                    <p className='font-bold'>{item.name.slice(0, 2)}</p>
                                                                </p>
                                                                <p className='gap-2 font-bold text-base px-2 py-1 ml-2 md:text-base text-darkTextColor '>{item.name}</p>
                                                                </div>
                                                                <p className=' text-base font-semibold text-gray-500 border-none'>{new Date(item.createdDate).toLocaleString('en-US', {
                                                                  weekday: 'long',
                                                                  month:'short',
                                                                  day:'numeric',
                                                                  hour: 'numeric',
                                                                  minute: 'numeric',
                                                                  second: 'numeric',
                                                                  hour12: true
                                                                })}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <p key={key} className='flex items-center border-veryveryLightGrey py-2.5 pb-2 pt-2 px-4 justify-between '>
                                                        <div className='text-lightTextColor outline-none border-none w-full'>
                                                            {item.isEditing ? (
                                                                <textarea
                                                                    name={item.comment}
                                                                    id={item.commentId}
                                                                    className={'w-[97%] border ms-8 outline-none rounded-xl px-4 py-1 resize-none hover:resize'}
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
                                                                <div className='ps-8 text-base'>{item.comment}</div>
                                                            )}
                                                        </div>
                                                    </p>
                                                    <div className='font-bold bg-gray px-2 py-1 ml-2 rounded-lg gap-2 flex justify-between flex-row text-base items-center'>
                                                        <div className='flex text-sm font-semibold justify-between gap-2 ps-8'>
                                                        
                                                            {item.isEditing ? (
                                                                <button
                                                                    className='text-gray-400 hover:text-black'
                                                                    onClick={() => {
                                                                        handleUpdateComment(item.commentId, capitalizeString(document.getElementById(item.commentId).getAttribute('currentValue')));
                                                                        const updatedComments = [...fetchComments];
                                                                        updatedComments[key].isEditing = false;
                                                                        setfetchComments(updatedComments);
                                                                        setIsEditing(false);
                                                                    }}>
                                                                    Post
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
                                                            </button>
                                                                 ):('')}
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
                                                                className='red-link disabled:opacity-25disabled:cursor-not-allowed text-gray-400 hover:text-black'
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
                                                    {/* {isReplying && 
                                                    
                                                    <div className=' ps-10 flex flex-col justify-between py-4 px-2'>
                                                        <div className='flex gap-1 items-center'>

                                                        <p
                                                                    className='flex bg-green-400 text-white rounded-full items-center justify-center text-base w-8 h-8 p-2 hover:bg-green-300 transition duration-300 ease-in-out'
                                                                    data-mdb-ripple='true'
                                                                    data-mdb-ripple-color='primary'>
                                                                    <p className='font-bold'>AF</p>
                                                        </p>
                                                        <p className='gap-2 font-bold text-base px-2 py-1 ml-2 md:text-base text-darkTextColor '>Afzal</p>
                                                        </div>
                                                        <div className=' py-1'>

                                                        <input type="text" name="reply" id="reply" className=' w-full border outline-none px-3 py-1 rounded-xl' placeholder='write a reply...' />
                                                        </div>
                                                        <div className=' flex gap-2 text-gray-500 font-semibold text-base ps-2'>
                                                            <p className=' cursor-pointer hover:text-black'>Reply</p>
                                                            <p className=' cursor-pointer hover:text-black' onClick={()=>setIsReplying(false)}>Cancel</p>
                                                        </div>
                                                        
                                                    </div>

                                                    } */}
                                                     {isReplying[key] && <>
                                                        <div className='pt-3 pb-3'>
                                                         <div className='flex flex-col gap-1 relative'>
                                                    {/* <div className=' ps-10 flex flex-col justify-between py-4 px-2'> */}
                                                        <InputEmoji
                                                          type="text"
                                                          name="comment"
                                                          value={commentData.values.comment}
                                                          placeholder={'Reply here...'}
                                                        //   error={hasErrors('comment')}
                                                        //   errorMsg={displayErrorMessage(commentData.errors.comment)}
                                                          onChange={handleChangeCommentReply}
                                                          searchMention={searchMention}
                                                        />
                                                         <div className=' cursor-pointer' onClick={() => {
                                                          handleReplyComments(item.commentId)
                                                        }}>
                                                      <button
                                                        type="button"
                                                        className="items-center xs:w-full py-2 px-4 rounded-lg flex mx-auto z-20 absolute top-2 text-md text-defaultTextColor right-10 hover:text-indigo-600"  
                                                        >
                                                        <AiOutlineSend/>
                                                      </button>
                                                        </div>
                                                        {/* </div> */}
                                                        <div className=' flex gap-2 text-gray-500 font-semibold text-base ps-2'>
                                                            {/* <p className=' cursor-pointer hover:text-black' onClick={()=>handleReplyComments(item.commentId)}>Reply</p> */}
                                                            <p className=' cursor-pointer hover:text-black' onClick={()=> toggleReply(key)}>Cancel</p>
                                                        </div>
                                                    </div>
                                                    </div>

                                                    {item && item?.reply?.map((items, key) => (
                                                  <li key={items.id}>

                                                      <>
                                                      <div className=' rounded-xl p-3 my-3 '>
                                                       <div className='flex flex-col'>
                                                       <div>
                                                         <div className='flex flex-row justify-between items-center'>
                                                           <div className=' flex gap-1'>
                           
                                                           <p className="flex bg-green-400 text-white rounded-full items-center justify-center text-base w-6 h-6 p-2 hover:bg-green-300 transition duration-300 ease-in-out" data-mdb-ripple="true" data-mdb-ripple-color="primary"><p className="font-bold">{item.name.slice(0, 2)}</p>
                                                           </p>
                                                           <p className='gap-2 font-bold  px-2 ml-2 md:text-base text-darkTextColor py-1 outline-brandBlue'>{items?.replyedUserDetails?.name}</p>
                                                           </div>
                                                           <p className=' text-base font-semibold text-gray-500 border-none'>{new Date(items?.createdAt).toLocaleString('en-US', {
                                                             weekday: 'long',
                                                             month:'short',
                                                             day:'numeric',
                                                             hour: 'numeric',
                                                             minute: 'numeric',
                                                             second: 'numeric',
                                                             hour12: true
                                                           })}</p>
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
                                                             const sanitizedValue = event.target.value.replace(/[^a-zA-Z0-9\s!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/g, '');
                                                             const taskCommentValue = fetchComments;
                                                             taskCommentValue[key].comment = sanitizedValue;
                                                             setfetchComments([...taskCommentValue]);
                                                             document.getElementById(items.commentId).setAttribute('currentValue', sanitizedValue);
                                                           }}
                                                           maxLength={100}
                                                         />
                                                         ) : (
                                                           <div className=' ps-8 text-base'>{items.comment}</div>
                                                         )}
                                                          
                                                          </div>
                                                       
                                                     </p>
                                                     <div className='text-[#52A4D1]  font-bold bg-gray px-2 py-1 ml-2 rounded-lg gap-2 flex justify-between flex-row text-xs items-center'>
                                                       {/* <p className='outline-brandBlue border-none'>{new Date(item.createdDate).toString().split('G')[0]}</p> */}
                                                       <div className='flex text-sm font-semibold justify-between gap-2 ps-8'>
                                                       {Cookies.get('isAdmin') === 'true'|| permission && permission?.comments?.delete === true  ? (  
                                                      
                                                              
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
                                                       ):('')}
                                                       </div>
                                                     </div>
                                                     </div>
                                                     </>
                                                     </li>
                                                    ))}


                                                    </>

                                                    }
                                                  
                                                </div>
                                                <hr />
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
                    </div>
                    ):('')}
                </div>

                {/* CHAT SECTION
                <div className=''>
                  <div className='flex flex-wrap items-center justify-between my-2 sm:my-4 '>
                    <div className='flex flex-row gap-2 font-semibold text-mdfont-semibold text-mdfont-semibold text-md items-center '>
                      <div className=''><BsChatDots /></div>
                      <p className=''>Chat</p>
                    </div>
                    <div className='flex flex-row items-center text-base gap-2'>
                      <p className='text-lightTextColor'>12 Members</p>
                      <div className='text-base text-lightTextColor'><BsArrowsAngleExpand /></div>
                    </div>
                  </div>
                  <div className=''>
                    <div className='bg-gray-200/80 p-2 rounded-md flex flex-col gap-2 rounded-bl-none rounded-br-none sm:pb-4 pb-2'>
                      <div className='text-base bg-white sm:p-3 p-2 rounded-tl-none rounded-xl'>
                        <p className='font-semibold'>Suresh Babu (Team Lead)</p>
                        <p className='text-lightTextColor'>Hi all</p>
                      </div>
                      <div className='text-base bg-white sm:p-3 p-2 rounded-tl-none rounded-xl'>
                        <p className='font-semibold'>Suresh Babu (Team Lead)</p>
                        <p className='text-lightTextColor'>Hi all</p>
                      </div>
                      <div className='text-white text-base sm:p-3 p-2 rounded-br-none rounded-xl bg-slate-700'>
                        <p className='text-white'>Hi sir</p>
                      </div>
                    </div>
                    <div className='flex flex-wrap items-center relative justify-between sm:p-2 p-1 bg-white rounded-bl-xl rounded-br-xl'>
                      <input className='border-none outline-none p-2 w-full' type="text" placeholder='Write here' />
                      <div className='absolute right-4 text-placeholderGrey cursor-pointer'>
                        <div className="file-input">
                          <input
                            type="file"
                            name="file-input"
                            id="file-input"
                            className="file-input__input"
                          />
                          <label className="file-input__label" for="file-input">
                            <GrAttachment />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> */}
                {/* RIGHT SIDE TASK MANAGEMENT AREAR START */}

                {/* Delete Modal */}
                {showModal && (
                    <>
                        <div className='justify-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
                            <div className='relative my-2 mx-auto w-11/12 lg:w-6/12 z-50'>
                                {/*content*/}
                                <div className='border-0 mb-7 mt-40 rounded-2xl shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none'>
                                    {/*header*/}
                                    {/*body*/}
                                    <div className='relative py-10 px-10 md:px-32 flex-auto'>
                                        <button
                                            className='text-lightGrey hover:text-darkTextColor absolute -right-2 -top-2 rounded-full bg-veryLightGrey  uppercase  text-base outline-none focus:outline-none p-1 ease-linear transition-all duration-150'
                                            type='button'
                                            onClick={() => setShowModal(false)}>
                                            <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' stroke-width='2'>
                                                <path stroke-linecap='round' stroke-linejoin='round' d='M6 18L18 6M6 6l12 12' />
                                            </svg>
                                        </button>
                                        <div className='rounded-lg bg-white'>
                                            <div className='text-center sm:my-1 my-2'>
                                                <img src='/imgs/delete.svg' className='w-100 mx-auto' alt='Delete' />
                                                <h2 className='font-bold text-darkTextColor text-3xl mt-5'>Delete This Project?</h2>
                                                <p className='text-base sm:my-3 text-lightTextColor'>You will not be able to recover it</p>
                                                <div className='flex justify-center mt-12'>
                                                    <div
                                                        className='nostyle-button mr-4'
                                                        onClick={() => {
                                                            setShowModal(false);
                                                        }}>
                                                        Cancel
                                                    </div>
                                                    <button
                                                        type='submit'
                                                        className='delete-button px-10'
                                                        onClick={() => {
                                                            if(permission?.project?.delete === true || Cookies.get('isAdmin') === 'true'){
                                                            handleDeleteProjectById(projectDetail.project._id), setShowModal(false);
                                                            }else{
                                                                handleDeleteProjectById(projectDetail.project._id), setShowModal(false);
                                                            }
                                                        }}>
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='opacity-25 fixed inset-0 z-40 bg-black'></div>
                        </div>
                    </>
                )}
            </div>
        );
    }
};
export default viewProject;
