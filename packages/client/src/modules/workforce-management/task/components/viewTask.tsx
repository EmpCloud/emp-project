import { AiOutlineCloudUpload } from "react-icons/ai"; 
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState ,useMemo} from 'react'
import { MdKeyboardArrowLeft, MdKeyboardArrowRight, MdOutlineKeyboardArrowRight } from "react-icons/md";
import { HiArrowNarrowLeft } from "react-icons/hi";
import { AiOutlineDelete } from "@react-icons/all-files/ai/AiOutlineDelete"
import { BsPlusSquare, BsPersonPlus, BsListTask, BsChatDots, BsArrowsAngleExpand, BsTag } from "react-icons/bs";
import { AiOutlineEdit } from "@react-icons/all-files/ai/AiOutlineEdit";
import { AiOutlinePlus, AiOutlineClose } from 'react-icons/ai';
import { IoMdSchool, IoMdTime } from 'react-icons/io';
import validate from 'validate.js';
import FloatingTextfield from '../../../../components/FloatingTextfield';
import NewToolTip from '../../../../components/NewToolTip';
import { GrAttachment, GrFormAttachment } from "react-icons/gr";
import { useRouter } from "next/router";
import { getTaskById, getTaskLables, getAllTask, getAllStages, getAllCategory, getAllRoles } from '../api/get';
import MultiSelectDropDown from '../../../../components/MultiSelectDropDown';
import { getActivity, searchtActivity, getCommentsApi } from '../api/get';
import { getAllUsers } from '../../members/api/get'
import { getAllTaskType } from '../../config/api/get'
import DropDownWithTick from '../../../../components/DropDownWithTick';
import { filterActivityApi, createCommentApi, addTaskCategory ,createReplyCommentApi} from '../api/post'
import { updateTaskStatus, updateTaskassingedTo, updateCommentApi, updateTaskDescription, updateTaskAttachement, updateTaskDate, updateTask } from '../api/put';
import { getAllProject } from '../../projects/api/get'
import toast from "../../../../components/Toster/index";
import ContentEditable from '../../../../components/ContentEditable';
import SearchInput from '../../../../components/SearchInput';
import Filter from './activityfilter';
import { deleteCommentApi, deleteTaskById ,deleteReplyCommentApi} from '../api/delete'
import { taskTableListCookies } from "../../../../helper/tableList";
import { BiEditAlt } from 'react-icons/bi';
import { capitalizeString, displayErrorMessage, handleUserClick } from '../../../../helper/function';
import DeleteConformation from '../../../../components/DeleteConformation';
import { getAllStatus } from '../../config/api/get';
import InputEmoji from 'react-input-emoji'
import { commentSchema } from '@HELPER/schema';
import ToolTip from '../../../../components/ToolTip';
import { USER_AVTAR_URL } from '../../../../helper/avtar';
import { fetchProfile } from "@WORKFORCE_MODULES/admin/api/get";
import Cookies from "js-cookie";
import CreateOrEditSubtask from './createOrEditSubtask';
import { getAllGroups } from "../../groups/api/get";
import { TextArea } from '@COMPONENTS/TextArea';
import { createSubtaskApi, uploadFilesInGCB } from 'src/trelloBoard/Helper/api/post';
import { BiHide } from 'react-icons/bi';
import { TbActivity } from 'react-icons/tb';
import { VscCommentUnresolved } from 'react-icons/vsc';
import { GoComment, GoCommentDiscussion } from 'react-icons/go';
import { LiaCommentSlashSolid } from 'react-icons/lia';
import { AiOutlineSend } from 'react-icons/ai';
import { FloatingSelectfield } from '@COMPONENTS/FloatingSelectfield';
import MemberModal from '@COMPONENTS/MemberModal';
import dynamic from 'next/dynamic';
import { FloatingOnlySelectfield } from '@COMPONENTS/FloatingOnlySelectfield';

export const index = ({ stopLoading, startLoading, id }) => {
  const router = useRouter();
  const [taskDetail, setTaskDetail] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false)
  const [permission, setPermission] = useState(null);
  const [taskTableList, setTaskTableList] = useState(null);
  const [selectedImage, setSelectedImage] = useState(false);
  const [showAttachement, setshowAttachement] = useState(null);
  const [showActivity, setshowActivity] = useState(true);
  const [showComments, setshowComments] = useState(true);
  const [commentsFilter, setcommentsFilter] = useState(false)
  const [hideAttachement, sethideAttachement] = useState(false)
  useEffect(() => {
    document.body.classList.toggle('modal-open', showModal);
  }, [showModal]);
  const [userName, setuserName] = useState([])
  const handleGetTaskById = (condition = " ") => {
    getTaskById(condition).then((response) => {
      if (response.data.body.status === 'success') {
        setTaskDetail(response.data.body.data);
      }
    }).catch(function (e) {
      stopLoading();
      toast({
        type: 'error',
        message: e.response ? e.response.data.body.message : 'Something went wrong, Try again !',
      });
    })
  }

  const [openTab, setOpenTab] = React.useState(1);
  useEffect(() => {
    handleGetTaskById('?Id=' + id);
  }, [id]);
  

  const [showModal2, setShowModal2] = useState(false);
  useEffect(() => {
    document.body.classList.toggle('modal-open', showModal2);
  }, [showModal2]);
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
  useEffect(() => {
  }, [formState.values, formState.isValid]);
  useEffect(() => {
    // document.querySelector("body").classList.add("bg-slate-50");
    handleGetAllCategory();
    handleGetAllStage();
  }, []);
  const handleChange = (event) => {
    event.persist();
    setFormState((formState) => ({
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
  const hasError = (field) =>
    !!(formState.touched[field] && formState.errors[field]);
  // STATE FOR OPEN AND CLOSE SUBTASK CONTENT
  const [subtask, setSubtask] = useState(false);
  const toggle = () => { setSubtask(!subtask) }
  const [extrasubtask, extrasetSubtask] = useState(false);
  const [users, setUsers] = useState([]);
  const togglesub = () => {
    extrasetSubtask(!extrasubtask)
  }
  //datepicker data
  const inProgress_data = [
    { name: 'In Progress' },
    { name: 'Progress' },
  ]
  const searchMemberDetails = [
    { name: 'James X' },
    { name: 'John' },
    { name: 'Mac' },
    { name: 'Dabshis' }
  ]
  const [labelDetails, setlabelDetails] = useState([]);
  const handleLables = () => {
    getTaskLables().then((response) => {
      if (response.data.body.status == 'success') {
        setlabelDetails(response.data.body.data.category.map((data) => {
          return data.taskCategory;
        }))
      }

    })
  }
  useEffect(() => {
    handleLables()
  }, [])
  const handleChangeCategory = (data, id) => {
    updateTaskStatus({ category: data }, id).then((result) => {
      if (result.data.body.status == "success") {
        handleGetTaskById('?Id=' + id);
        toast({
          type: "success",
          message: result ? result.data.body.message : "Try again !",
        });
      } else {
        toast({
          type: "error",
          message: result ? result.data.body.message : "Error",
        });
      }
    })
      .catch(function (e) {
        toast({
          type: "error",
          message: e.response
            ? e.response.data.message
            : "Something went wrong, Try again !",
        });
      });
  }
  const handleAddCategory = () => {
    addTaskCategory({ taskCategory: formState.values.category }).then((result) => {
      if (result.body.status == "success") {
        handleLables();
        toast({
          type: "success",
          message: result ? result.body.message : "Try again !",
        });
      } else {
        toast({
          type: "error",
          message: result ? result.body.message : "Error",
        });
      }
    })
      .catch(function (e) {
        toast({
          type: "error",
          message: e.response
            ? e.response.body.message
            : "Something went wrong, Try again !",
        });
      });
  }
  const [showIcon, setShowIcon] = useState(false);
  useEffect(() => {
    // document.querySelector("body").classList.add("bodyBg");
  }, [showIcon]);
  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }
  // Sidebar expand/colla
  const [openSideBar, setOpenSideBar] = useState(true)
  useEffect(() => {
    document.body.classList.toggle('open-sidebar', openSideBar);
  }, [openSideBar]);
  const [searchLabel, setSearchLabel] = useState(false)
  const [createLabel, setCreateLabel] = useState(false)
  const handleOpenCreateLabel = (e) => {
    e.preventDefault();
    setSearchLabel(false);
    setCreateLabel(true)
  }
  const handleOpenLabel = (e) => {
    e.preventDefault();
    setSearchLabel(true);
    setCreateLabel(false)
  }
  const colors = ['#F6CE3D', '#52D15F', '#EA663D', '#52A4D1', '#915BC7', '#6D72DF', '#963374', '#EE70C3', '#4E4E4E']
  const [membersCount, setMembersCount] = useState(false)
  const [addMembers, setAddMembers] = useState(false)
  const [profileData, setprofileData] = useState([]);
  const handleOpenMemberCount = (e) => {
    e.preventDefault();
    setMembersCount(false);
    setAddMembers(true)
  }
  const handleAddMemberLabel = (e) => {
    setMembersCount(false);
    setAddMembers(false)
  }
  const [userObject, setUserObject] = useState([]);

  const [statusDetails, setStatusDetails] = useState([]);
  const handleGetAllStatus = () => {
    getAllStatus().then(response => {
      if (response.data.body.status === 'success') {
        setStatusDetails(response.data.body.data.data);
      }
    });
  };
  useEffect(() => {
    handleGetAllStatus()
    handleGetAllRoles()
  }, [])
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

const handleFiterData = (data) =>{
  
  setFilterData(data);
  setSortTable({
      skip: 0,
      limit: 10,
      pageNo: 1,
  });
  setType("filter")
}

  const handleGetAllActivity = (condition = '') => {
    getActivity(condition).then((Response) => {
      if (Response.data.body.status == 'success') {
        setActivityData(Response.data.body.data.activity.map((data) => {
          return {
            name: data?.userDetails?.name, activityDetailes: data?.activity, activityDate: data?.createdAt, profilePic: data?.userDetails?.profilePic
          }
        }))
        setActivityCount(Response?.data?.body?.data?.totalActivityCount);
        
      }
    })
  }
  useEffect(() => {

    if(type === "search"){
      handleSearchActivity('?keyword=' + searchKeyword + '&limit=' + sortTable.limit)
    }else if(type === "filter"){
      handleGetFilterActivity("?limit=" +sortTable.limit + '&limit=' + sortTable.limit)
    }else{
    handleGetAllActivity('?ActivityType=Task' + '&ActivityTypeId=' + id + '&limit=' + sortTable.limit)
    }
    
  }, [id, sortTable.limit,searchKeyword])
  const handleSearchActivity = (condition='') => {
    if(searchKeyword == null) return false;
    searchtActivity(condition='').then(Response => {
      if (Response.data.body.status === 'success') {
        setActivityData(Response?.data?.body.data?.fetchActivity?.map((data) => {
          return {
            name: data.userDetails.name, activityDetailes: data.activity, activityDate: data.createdAt, profilePic: data.userDetails.profilePic
          }
        }))
      }
    })
  };

  const handleGetFilterActivity = (condition) => {
    setSortTable({
      skip: 0,
      limit: 10,
      pageNo: 1,
  });
    event.preventDefault();
    filterActivityApi(condition,filterData)
      .then(response => {
        if (response.data.body.status === 'success') {
          setActivityData(response.data.body.data.map((data) => {
            return {
              name: data.userDetails.name, activityDetailes: data.activity, activityDate: data.createdAt, profilePic: data.userDetails.profilePic
            }
          }))
          setType("filter")
        } else {
          toast({
            type: 'error',
            message: response ? response.data.body.message : 'Something went wrong, Try again !',
          });
        }
      })
      .catch(function (e) {
        stopLoading();
        toast({
          type: 'error',
          message: e.response ? e.response.data.body.message : 'Something went wrong, Try again !',
        });
      });
  }

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
      reply:null
    }
  }
  const schema = {
    comment: commentSchema,
    reply:commentSchema
  }
  const [commentData, setcommentData] = useState({ ...initialValues })
  const [fetchComments, setfetchComments] = useState([])
  useEffect(() => {
    // document.querySelector('body').classList.add('bg-slate-50');
  });
  const [searchSuggestions, setsearchSuggestions] = useState([])
  const hasErrors = field => !!(commentData.touched[field] && commentData.errors[field]);
  const handleGetAllUser = (condition) => {
    getAllUsers(condition).then((response) => {
      if (response.data?.body?.status === "success") {
        setuserName(
          response?.data?.body?.data?.users.map((data) => {
            return {
              id: data?._id,
              role: data?.role,
              key: data?.firstName + " " + data?.lastName,
              value: data,
            };

          })
        );
      }
    });
  };
 

  const handleUserName = (taskDetail) => {
    
    if (taskDetail) {
      handleGetAllUser('?limit=5000&invitationStatus=1&suspensionStatus=false')
    }
  }
  useEffect(() => {
    if(taskDetails){

      handleUserName(taskDetail)
    }
  }, [taskDetail])
  const searchMention = async (text) => {
    let value = [];
    if (text) {
      userName?.map((key, index) => {
        let userValue = {}
        userValue['image'] = key.profilPic
        userValue['name'] = (key.user_name)?.replace(/@/g, '')
        userValue['id'] = key.user_name
        value.push(userValue)
      })
    }
    let result = value.filter(function (ele) {
      return ele?.id?.toLowerCase().indexOf(text?.toLowerCase()) >= 0;
    });
    const reResult = result.map(({ id, ...rest }) => ({ ...rest }))
    
    return reResult
  }

  useEffect(() => {
    searchMention(commentData.values.comment)
  }, [commentData.values.comment])
  // Now you can use the searchMention function
  const handleChangeComment = (data) => {
    const errors = validate(formState.values, schema);
    setcommentData(commentData => ({
      ...commentData,
      values: {
        comment: data,
      },
      isValid: !errors,
      errors: errors || {},
    }))
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
  const handleGetallComments = (condition = " ") => {
    condition = condition + '&orderBy=' + 'createdAt' + '&sort=desc' 
    getCommentsApi(condition).then(function (response) {
      if (response.body.status === "success") {
        
        setfetchComments(response.body.data.map((data) => {
          return { commentId: data._id, name: data.commentCreator.creatorName, comment: data.comment, createdDate: data.createdAt, is_edited: data.is_edited ,reply:data?.reply}
        }))
       }else {
                    
        setfetchComments([]);  
    }
    })
      .catch(function (e) {
        stopLoading();
        toast({
          type: 'error',
          message: e.response ? e.response.body.message : 'Something went wrong, Try again !',
        });
      });
  }
  const [isReplying, setIsReplying] = useState(new Array(fetchComments?.length).fill(false));
  useEffect(() => {
    if(commentsFilter===false){
      handleGetallComments('?task_id=' + id + '&limit=' + sortTable.limit+'&orderBy=createdAt&sort=desc');
      }else{
      handleGetallComments('?task_id=' + id + '&limit=' + sortTable.limit+'&orderBy=updatedAt&sort=desc');
      }
  }, [id,sortTables.limit,commentsFilter])
    ;
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

    createCommentApi({ comment: com ,userName:userName}, id).then(function (response) {
      if (response.body.status === 'success') {
        handleGetallComments('?task_id=' + id + '&limit=' + sortTable.limit);
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
    createReplyCommentApi({ comment: com ,userName:userName}, `?commentId=${replyId}`).then(function (response) {
      if (response.body.status === 'success') {
        handleGetallComments('?task_id=' + id + '&limit=' + sortTable.limit);
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

  const handleUpdateComment = (id, data) => {
    if (data===null) {
      toast({
          type: 'info',
          message: 'No change in value!',
      });
      return;
  }

    updateCommentApi(id, data).then(function (result) {
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
  }
  const [deleteMessage, setDeleteMessage] = useState('');
  const [deleteTaskId, setDeleteTaskId] = useState('');
  const [openDeleteModel, setOpenDeleteModel] = useState(false);
  const [stageList, setStageList] = useState(null);
  const [categoryList, setCategoryList] = useState(null);
  const [replyDeleteComment,setDeleteReplyComment]=useState(false)
  const handleDeleteComment = () => {
    if(replyDeleteComment===false){
    deleteCommentApi(deleteTaskId).then(function (response) {
      if (response.body.status == "success") {

        toast({
          type: 'success',
          message: response ? response.body.message : 'Try again !',
        });
      handleGetallComments('?task_id=' + id + '&limit=' + sortTable.limit);
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
    // handleGetallComments('?task_id=' + id + '&limit=' + sortTable.limit);
  }else{
    deleteReplyCommentApi(deleteTaskId).then(function (response) {
      if (response.body.status == 'success') {

        toast({
          type: 'success',
          message: response ? response.body.message : 'Try again !',
        });
      handleGetallComments('?task_id=' + id + '&limit=' + sortTable.limit);
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
    // handleGetallComments('?task_id=' + id + '&limit=' + sortTable.limit);
    setDeleteReplyComment(false);
  }
}

  function handleReset() {
    setcommentData({ ...initialValues });
    setIsOpen(false);
  }
  const [assigned, setassigned] = useState([]);
  const handleChangeMultiSelector = (data, name) => {
    let Ids = data.map(Id => {
      return { id: Id.id }
    })
    updateTaskassingedTo(Ids, id).then(response => {
      if (response.data.body.status === 'success') {
        
        handleGetTaskById('?Id=' + id);

      }
    })
    var finalData = data.map(function (val) {
      return val.value;
    });
    setassigned(finalData)
    let profile = finalData.map(function (pic) {
      return { profile: pic.profilePic, firstName: pic.firstName, lastName: pic.lastName, Id: pic._id, email: pic.email };
    })
    setprofileData(profile)
    setFormState((formState) => ({
      ...formState,
      values: {
        ...formState.values,
        [name]: finalData
      },
      touched: {
        ...formState.touched,
        [name]: true,
      },
    }));

  }
  const handleChangeStatus = (data, id,t,type) => {
   
    let apiData = null
    if(type==='status'){
      apiData ={taskStatus: data.value}
    }else{
      apiData ={priority: data.value}

    }
    
    if(permission?.project.edit === true || Cookies.get('isAdmin') === 'true'){
      updateTask(id,apiData)
      .then(function (result) {
        if (result.data.body.status == "success") {
          handleGetTaskById('?Id=' + id);
          toast({
            type: "success",
            message: result ? result.data.body.message : "Try again !",
          });
        } else {
          toast({
            type: "error",
            message: result ? result.data.body.message : "Error",
          });
        }
      })
      .catch(function (e) {
        toast({
          type: "error",
          message: e.response
            ? e.response.data.message
            : "Something went wrong, Try again !",
        });
      });
    }
  };
  const handleUpdateTaskDetails = (id, data) => {
    if(data[0].taskDetails===description){
      toast({
        type: "warn",
        message:  "No Change in the Value!",
      });
      return
    }
    if(permission?.task?.edit === true || Cookies.get('isAdmin') === 'true'){
    updateTaskDescription({ taskDetails: description }, id).then(function (result) {
      if (result.data.body.status == "success") {
        handleGetTaskById('?Id=' + id);
        toast({
          type: "success",
          message: result ? result.data.body.message : "Try again !",
        });
      } else {
        toast({
          type: "error",
          message: result ? result.data.body.message : "Error",
        });
      }
    })
      .catch(function (e) {
        toast({
          type: "error",
          message: e.response
            ? e.response.data.message
            : "Something went wrong, Try again !",
        });
      });
    }
  }
  const handleRemoveAttachements = (id, data) => {
    if(permission?.upload?.delete === true || Cookies.get('isAdmin') === 'true' ){
    let filteredArr = taskDetail[0].attachment?.filter(obj => data != obj);
    updateTaskAttachement({ attachment: filteredArr }, id).then(function (result) {
      if (result.data.body.status == "success") {
        handleGetTaskById('?Id=' + id);
        toast({
          type: "success",
          message: result ? "Successfully deleted attachment" : "Try again !",
        });
      }
    })
      .catch(function (e) {
        toast({
          type: "error",
          message: e.response
            ? e.response.data.message
            : "Something went wrong, Try again !",
        });
      });
    }else{
      toast({
        type: "warn",
        message: "You don't have the Permission to Delete the Attachment !!",
      });
    }
  }
  const handleDeleteTask = (condition = " ") => {
    if(permission?.task?.delete === true || Cookies.get('isAdmin') === 'true'){
    deleteTaskById(condition).then(function (result) {
      if (result.data.body.status == "success") {
        // handleGetTaskById('?Id=' + id);
        toast({
          type: "success",
          message: result ? result.data.body.message : "Try again !",
        });
      } else {
        toast({
          type: "error",
          message: result ? result.data.body.message : "Error",
        });
      }
    })
      .catch(function (e) {
        toast({
          type: "error",
          message: e.response
            ? e.response.data.message
            : "Something went wrong, Try again !",
        });
      });
    }else{
      toast({
        type: "warn",
        message: `You don't have the permission to Delete the Task!! `,
      });
    }
  }
  const handleProfileData = () => {
    fetchProfile().then(response => {
      if (response.data?.body.status === 'success') {
        setPermission(response.data.body.data.permissionConfig);
      }
    });
  };
  const [taskTypeDetails, setTaskTypeDetails] = useState(null);
  const handleGetAllTaskType = () => {
    getAllTaskType().then((response) => {
      if (response.data?.body.status === "success") {
        setTaskTypeDetails(response.data?.body.data.data.map(ele => {
          return { text: ele.taskType, value: ele.taskType }
        }));
      }
    });
  };

  const handleGetAllUsers = (condition = "") => {
    getAllUsers(condition).then((response) => {
      if (response.data?.body.status === "success") {
        setUsers(
          response?.data?.body?.data?.users.map((data) => {
            return {
              id: data?._id,
              role: data?.role,
              key: data?.firstName + " " + data?.lastName,
              value: data,
            };
          })
        );
      }
    });
  };
  const [taskDetails, settaskDetails] = useState([])
  const handleGetAllTask = (condition = "?limit=" + sortTable.limit) => {
    getAllTask(condition).then((response) => {
      if (response.data?.body.status === "success") {
        settaskDetails(response.data?.body.data.tasks)

      }
    });
  };
  const [projectList, setProjectList] = useState(null)
  const [groupList, setGroupList] = useState(null)
  useEffect(() => {
    handleGetAllStatus();
    getAllProject().then((response) => {
      if (response.data?.body.status === "success") {
        var projectList = response.data?.body.data.project.map(function (
          project
        ) {
          return {
            text: project.projectName,
            value: project._id,
          };
        });
        setProjectList(projectList);
      }
    });
  }, []);
  const handleGetAllGroup = () => {
    getAllGroups("?limit=20").then((response) => {
      if (response.data?.body.status === "success") {
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
    handleGetAllUsers('?limit='+process.env.TOTAL_USERS+'&invitationStatus=1&suspensionStatus=true&taskId='+id);
    handleGetAllGroup();

    if (Cookies.get("isAdmin") === 'false') {
      handleProfileData();
    }
    let { projectId } = router.query;
    handleGetAllTask(projectId ? "?projectId=" + projectId : "");

    if (!Cookies.get("taskTableListCookies")) {
      Cookies.set("taskTableListCookies", JSON.stringify(taskTableListCookies));
    }
    setTaskTableList(JSON.parse(Cookies.get("taskTableListCookies")));
  }, [router.query]);
  const [tinySpinner, setTinySpinner] = useState(false);
  const [uploadedData, setUploadedData] = useState(null);
 
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
        uploadFilesInGCB(formdata, category, id)
            .then(response => {
                if (response?.data?.code === 200) {
                    const uploadedUrls = response.data.data.filesUrls.map(fileUrl => fileUrl.url);
                    

                    // setFormState(formState => ({
                    //     ...formState,
                    //     values: {
                    //         ...formState?.values,
                    //         attachment: [...uploadedUrls, ...taskDetail[0]?.attachment],
                    //     },
                    //     touched: {
                    //         ...formState?.touched,
                    //         attachment: true,
                    //     },
                    // }));
                    updateTaskAttachement({attachment: [...uploadedUrls, ...(taskDetail[0].attachment || [])]}, id).then(response => {
                      if (response.data.body.status === 'success') {
                        handleGetTaskById('?Id=' + id);
                        toast({
                          type: 'success',
                          message: response ? response.data.body.message : 'Try again !',
                        });
            
                      } else {
                        toast({
                          type: 'error',
                          message: response ? response.data.body.message : 'Try again !',
                        });
                      }
                    });
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
  const handleUpdateDate = (event) => {
    updateTaskDate(event, id).then(function (response) {

      if (response.data.body.status === 'success') {
        handleGetTaskById('?Id=' + id);
        toast({
          type: 'success',
          message: response ? response.data.body.message : 'Try again !',
        });

      } else {
        toast({
          type: 'error',
          message: response ? response.data.body.message : 'Try again !',
        });
      }
    });
  }

  const [selectedOption, setSelectedOption] = useState('');
  useEffect(()=>{
    if(taskDetail?.length>0){
      setSelectedOption(taskDetail[0].category)
    }
  },[taskDetail])
  const [isEditing, setIsEditing] = useState(false);
  const handleEditClick = () => {
    setIsEditing(true);
  };
 
  const toggleReply = (commentIndex) => {
    const newReplyOpen = [...isReplying];
    newReplyOpen[commentIndex] = !newReplyOpen[commentIndex];
    setIsReplying(newReplyOpen);
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
const handleUpdateCategory = (event) =>{
  setSelectedOption(event.target.value);
  if(permission?.task?.edit === true || Cookies.get('isAdmin') === 'true'){
  let datas = JSON.stringify({
    category: event ?.target?.value,
  });
  updateTaskDate(datas, id).then(function (response) {

    if (response.data.body.status === 'success') {
      handleGetTaskById('?Id=' + id);
      toast({
        type: 'success',
        message: response ? response.data.body.message : 'Try again !',
      });

    } else {
      toast({
        type: 'error',
        message: response ? response.data.body.message : 'Try again !',
      });
    }
  });
}
}
// const handleDeleteTaskAttachment = deleteData => {
//   const attachments = formState?.values?.attachment?.filter(obj => deleteData !== obj);
//   updateSubTaskAttachement({ attachment: attachments }, data?._id).then(response => {
//       if (response?.data?.body?.status === 'success') {
//           toast({
//               type: 'success',
//               message: response ? response?.data?.body?.message : 'Try again !',
//           });
//           // setFileAttachment(null);
//           handleGetAllTask(`?limit=10`);
//       } else {
//           toast({
//               type: 'error',
//               message: response ? response?.data?.body?.message : 'Try again !',
//           });
//       }
//   });
// };
const DynamicCustomInput =useMemo(()=> dynamic(()=>import('@COMPONENTS/ReactQuillTextEditor'), { ssr: false }),[]);
const displayValue = () => {
  // Use DOMParser to parse HTML and extract text content
  const parser = new DOMParser();
  const parsedHtml = parser.parseFromString(taskDetail[0].taskDetails, 'text/html');
  return parsedHtml.body.textContent || "";
};
const [description,setDescription]=useState('');
useEffect(()=>{
  if(taskDetail)
  setDescription(taskDetail[0].taskDetails)
},[taskDetail])

const handlePaginationGroupActivity = (condition) => {
 
  
  
    if(type === "filter"){
    handleGetFilterActivity(condition)
    }else  if(type === "search"){
      
      handleSearchActivity(condition)

   
    }else{
    getActivity(condition).then((Response) => {
      if (Response.data.body.status == 'success') {
        setActivityData(Response.data.body.data.activity.map((data) => {
          return {
            name: data?.userDetails?.name, activityDetailes: data?.activity, activityDate: data?.createdAt, profilePic: data?.userDetails?.profilePic
          }
        }))
        setActivityCount(Response.data.body.data.totalActivityCount);
        
      }
    })
  
}
}
const [showDynamicInput, setShowDynamicInput] = useState(false);

  const handleTextAreaClick = () => {
    // Toggle the state to switch between TextArea and DynamicCustomInput
    setShowDynamicInput(!showDynamicInput);
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
const priorityList = [{name:'Low',value:'Low'},{name:'Medium',value:'Medium'},{name:'High',value:'High'}]
  
  if (taskDetail) {
    return (
      <div>
        <div className='mb-0 text-base text-lightTextColor '>
          <a className='flex items-center cursor-pointer hover:text-brandBlue' onClick={() => { router.push("/w-m/tasks/all") }}><div style={{ display: 'inline-flex', alignItems: 'center' }}>
            <HiArrowNarrowLeft className='mr-2' />
            <span>Back to all tasks</span>
          </div>
          </a>
        </div>
        {/* Start Main Body */}
        <div className='mt-2 flex flex-col gap-2 lg:flex-row'>
          <div className='card sm:gap-8 w-full lg:w-3/4'>
              {/* <div className='sm:py-5 sm:px-0 p-3 sm:gap-8 lg:flex lg:flex-row'> */}
              {/* LEFT SIDE TASK MANAGEMENT AREAR START */}
              <div className='md:basis-3/4'>
                <div className=''>
                  <div className='heading_part sm:mb-4 mb-2' >
                    <div className='md:flex text-sm justify-between md:col-span-8 col-span-12 mb-5'>
                      <ul className="inline-flex items-center space-x-1 md:space-x-3">
                        <li className="inline-flex items-center">
                          <a href="#" className="text-base text-defaultTextColor">
                            {taskDetail[0].projectName ?? 'Standalone task'}
                          </a>
                        </li>
                        <MdOutlineKeyboardArrowRight className='w-4 h-4 text-lightTextColor' />
                        <li>
                          <div className='flex items-center'>
                            {/* <NewToolTip direction='top' message={"New feature[Click to change task type]"}>
                            <DropDown data={newFeatureData} defaultValue={""}
                              icon={<span className="w-4 h-4 bg-greenColor rounded flex"></span>}
                            />
                          </NewToolTip> */}
                            <a href="#" className="ml-1 text-sm font-medium text-gray-700 hover:text-gray-900 md:ml-2 dark:text-gray-400 dark:hover:text-white">{taskDetail[0].projectCode}</a>
                          </div>
                        </li>
                      </ul>
                      <div className=" flex gap-2 items-center">
                      <span className=" text-base dark:text-gray-50">Priority</span>
                      <p className={taskDetail[0].priority === "High" ? "priority-with-bg text-priority1Color bg-priority1bg" : (taskDetail[0].priority === "Medium" ? "priority-with-bg text-priority1Color bg-priority2bg" : "priority-with-bg text-priority3Color bg-priority3bg")}>{taskDetail[0].priority}</p>
                      </div>
                    </div>
                    <div className='flex gap-2 justify-between w-full'>
                    <p className='md:text-xl text-darkTextColor py-1 truncate font-bold outline-brandBlue whitespace-pre-wrap w-[20%]'>{taskDetail[0].taskTitle}</p>

                    <div className="flex gap-2 items-center">

                    <span className=" text-base dark:text-gray-50">Priority</span>
                    <DropDownWithTick
                        paddingForDropdown={"py-2"}
                        type={'priority'}
                        onChangeValue={handleChangeStatus}
                        data={priorityList}
                        width={"w-[120px]"}
                        value={taskDetail[0].priority}
                        id={taskDetail[0]._id}
                        handle={undefined}
                        className="w-[20%]"
                      />
                    <span className=" text-base dark:text-gray-50" >Status</span>
                      <DropDownWithTick
                        paddingForDropdown={"py-2"}
                        type={'status'}
                        onChangeValue={handleChangeStatus}
                        data={statusDetails.map(data => {
                          return { name: data.taskStatus,value:data.taskStatus }
                        })}
                        width={"w-[100px]"}
                        value={taskDetail[0].taskStatus}
                        id={taskDetail[0]._id}
                        handle={undefined}
                        className="w-[20%]"
                      />
                          </div>
                          
                  </div>
                  </div>
                  <div className='flex flex-col text-base'>
                    <div className='flex flex-row items-center flex-wrap gap-4 md:gap-4 my-3'>
                      
                      <div className='flex gap-1 flex-col items-start text-defaultTextColor my-5 md:my-0'>
                        <div className='flex items-center'>

                          <IoMdTime />
                          <p className='font-bold text-lightTextColor ml-1'>Due on</p>
                        </div>
                        {/* <div className='text-lightTextColor outline-brandBlue font-bold bg-gray-100/70 px-2 py-1 ml-2 rounded-lg gap-2 flex flex-row text-base items-center'> */}
                        <div className='remove_margin w-full'>
                          <FloatingTextfield
                            type='date'
                            name={'Due on'}
                            // min={formState.values.startDate || ''}
                            label={''}
                            value={taskDetail[0]?.dueDate?.split('T')[0]}
                            min={new Date(taskDetail[0]?.createdAt).toISOString().substr(0, 10)}
                            // min={new Date().toISOString().substr(0, 10)}
                            onChange={(event) => {
                              handleUpdateDate({ dueDate: event.target.value })
                            }}
                            disabled={permission?.task.edit === true || Cookies.get('isAdmin') === 'true' ? false:true}
                          />
                        </div>
                      </div>
                      <div className='flex gap-1 flex-col items-start text-defaultTextColor my-5 md:my-0'>
                        <div className='flex items-center'>
                          <IoMdTime />
                          <p className='font-bold text-lightTextColor ml-1'>Estimation Date</p>
                        </div>

                        {/* <div className='text-lightTextColor outline-brandBlue font-bold bg-gray-100/70 px-2 py-1 ml-2 rounded-lg gap-2 flex flex-row text-base items-center'> */}
                        <div className='remove_margin w-full'>
                          <FloatingTextfield
                            type='date'
                            name={'Estimation Date'}
                            min={new Date(taskDetail[0]?.createdAt).toISOString().substr(0, 10)}
                            label={''}
                            value={taskDetail[0].estimationDate.split('T')[0]}
                            onChange={(event) => {
                              handleUpdateDate({ estimationDate: event.target.value })
                            }}
                            disabled={permission?.task?.edit === true || Cookies.get('isAdmin') === 'true' ? false:true}
                          />
                        </div>
                      </div>
                      <div className='flex gap-1 flex-col items-start text-defaultTextColor my-5 md:my-0'>
                        <div className='flex items-center'>
                          <IoMdTime />
                          <p className='font-bold text-lightTextColor ml-1'>Estimation Hours</p>
                        </div>

                        <div className='remove_margin w-full'>
                          <FloatingTextfield
                            type="time"
                            name={'estimation time'}
                            value={taskDetail[0].estimationTime ?? '0'}
                            onChange={(event) => {
                              handleUpdateDate({ estimationTime: event.target.value })
                            }}
                            disabled={permission?.task?.edit === true || Cookies.get('isAdmin') === 'true' ? false:true}
                          />

                        </div>
                      </div>

                      {/* </div> */}
                      <div className='flex gap-1 flex-col items-start text-defaultTextColor my-5 md:my-0'>
                        <div className='flex items-center'>
                          <IoMdTime />
                          <p className='font-bold text-lightTextColor ml-1'>Actual Hours:</p>
                        </div>
                        <div className='remove_margin w-full'>
                          <FloatingTextfield
                            type='time'
                            name={'actualTime'}
                            value={taskDetail[0].actualHours ?? '0'}
                            onChange={(event) => {
                              handleUpdateDate({ actualHours: event.target.value })
                            }}
                            disabled={permission?.task?.edit === true || Cookies.get('isAdmin') === 'true' ? false:true}
                          />
                        </div >
                      </div>



                    </div>
                    <div className='flex gap-2 flex-wrap'>
                    <div className='flex items-center font-bold text-lightTextColor md:my-3 my-3'>Assigned To :
                      <div className=" ml-2 user-img-group items-center">
                      {taskDetail[0].assignedTo.length === 0 && <>Not Assigned</>}
                        
                        {/* {taskDetail[0].assignedTo.map((ele) => (
                          <ToolTip className='relative w-[30px] h-[30px] shadow-md rounded-full' message={ele.firstName + ' ' + ele.lastName}>
                            <img src={USER_AVTAR_URL + ele.firstName + ".svg"} className="user-img-sm w-8 h-8 cursor-pointer" alt="user" />
                          </ToolTip>
                        ))} */}
                        {taskDetail[0].assignedTo.length <= 2 ? (
                                                                        taskDetail[0].assignedTo.slice(0, 3).map(function (d1) {
                                                                            return (
                                                                                <NewToolTip className='relative w-[30px] h-[30px] shadow-md rounded-full' message={d1.firstName + ' ' + d1.lastName}  >
                                                                                      <img onClick={()=>handleUserClick(d1.isAdmin ,d1.id,d1.isSuspended)} style={{ cursor: 'pointer' }}
                                                                                        src={d1.profilePic}
                                                                                        className='bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 w-10 h-10 rounded-full'
                                                                                        alt='-'
                                                                                    />
                                                                                </NewToolTip>
                                                                            )
                                                                        })
                                                                        ) : (
                                                                            <div className='flex items-center justify-center -space-x-4'>
                                                                                <div className='relative w-[30px] h-[30px] shadow-md rounded-full  flex flex-col items-center group'>
                                                                                    <img
                                                                                        className='bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 w-10 h-10 rounded-full'
                                                                                        src={ taskDetail[0].assignedTo === undefined ? [] :  taskDetail[0].assignedTo[0]?.profilePic?? USER_AVTAR_URL + `${taskDetail[0].assignedTo[0].firstName}.svg`}
                                                                                        alt=''
                                                                                    />
                                                                                </div>
                                                                                <div className='relative w-[30px] h-[30px] shadow-md rounded-full  flex flex-col items-center group' >
                                                                                    <img
                                                                                        className='bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 w-10 h-10 rounded-full'
                                                                                        src={ taskDetail[0].assignedTo === undefined ? [] :    taskDetail[0].assignedTo[0]?.profilePic??USER_AVTAR_URL + `${taskDetail[0].assignedTo[1].firstName}.svg`}
                                                                                        alt=''
                                                                                    />
                                                                                </div>
                                                                                <MemberModal members={ taskDetail[0].assignedTo ?  taskDetail[0].assignedTo : ""} remainingCount={ (taskDetail[0].assignedTo?.length) - 2}  />
                                                                            </div>
                                                                    )}
                        <div>
                          {/* <span className="user-img-sm cursor-pointer text-base w-8 h-8 ml+3 flex justify-center items-center progress-count text-defaultTextColor bg-gray-100/70 font-bold flex">+{taskDetail[0].assignedTo.length}</span> */}
                        </div>
                      </div>
                      <span className="icon-sm icon-add"></span>
                    </div>
                    <div className='flex items-center text-lightTextColor flex-row font-bold my-3'>Created by :
                      <div className="user-img-group">
                        <NewToolTip className='ml-2 relative w-[30px] h-[30px] shadow-md rounded-full' message={taskDetail[0].taskCreator.firstName + ' ' + taskDetail[0].taskCreator.lastName} userId={taskDetail[0].taskCreator.id} >
                        <img onClick={()=>handleUserClick(taskDetail[0].taskCreator.isAdmin ,taskDetail[0].taskCreator.id,taskDetail[0].taskCreator.isSuspended)} style={{ cursor: 'pointer' }}
                        src={taskDetail[0].taskCreator.profilePic} className="user-img-sm w-8 h-8 cursor-pointer" alt="user" />
                        </NewToolTip>
                      </div>
                    </div>
                    <div className='lg:flex gap-2 my-5 text-base items-center'>
                    <p className='flex items-center text-lightTextColor flex-row font-bold my-3'>Category : </p>
                    {/* <ContentEditable
                      name={'actual Hours'}
                      id={taskDetail[0]._id}
                      className={'w-5/6 py-1'}
                      value={taskDetail[0].category ?? 'default'}
                      onChange={(event) => {
                        handleUpdateDate(event.target.value)
                      }}
                    /> */}
                      <div>
                      <FloatingOnlySelectfield
                        type='text'
                        // label={taskDetail[0].category}
                        optionsGroup={categoryList}
                        name={'category'}
                        value={selectedOption ?? ''}
                        onChange={handleUpdateCategory}
                         />
                         </div>

                    {/* <span className="bg-[#F6CE3D] text-white text-sm font-bold mr-2 px-5 py-2 rounded-full">{taskDetail[0].category}</span> */}
                  </div>
                    </div>
                  </div>
                  
                  {/*discription */}
                  <div className='sm:my-6 my-4 text-base text-defaultTextColor'>
                    <p className='heading-medium !text-base font-semibold text-gray-500'>Description</p>
                    {permission?.task?.edit === true || Cookies.get('isAdmin') === 'true' ? 
                      showDynamicInput ? (
                        // Render DynamicCustomInput when showDynamicInput is true
                        <DynamicCustomInput
                        name={description}
                        className='text-sm border rounded-md w-full  p-3 bg-gray-100/50 outline-brandBlue'
                        value={description}
                        disabled={permission?.task?.edit === true || Cookies.get('isAdmin') === 'true' ? false:true}
                        // onClick={handleTextAreaClick}
                        onChange={(event) => {
                          // const taskDetailsValue = { ...taskDetail[0] };
                          // taskDetailsValue.taskDetails = event;
                          // setTaskDetail([taskDetailsValue]);
                          setDescription(event)
                        }} />
                      ) : (
                        // Render TextArea when showDynamicInput is false
                          
                          <div onClick={handleTextAreaClick}>
                        <TextArea
                          name={taskDetail[0].taskDetails}
                          backgroundColor={'darkGray'}
                          className='text-base border rounded-md w-full px-3 py-1 .bg-gray-100 outline-brandBlue'
                          value={displayValue()}
                          // disabled={true}
                          onChange={(event) => {
                            const taskDetailsValue = { ...taskDetail[0] };
                            taskDetailsValue.taskDetails = event.target.value;
                            setDescription(event);
                            // setTaskDetail([taskDetailsValue]);
                          }}
                        />
                        </div>
                      )
                      :
                      <TextArea
                      name={taskDetail[0].taskDetails}
                      className='text-sm border rounded-md w-full  p-3 bg-gray-100/50 outline-brandBlue'
                      value={displayValue()}
                      disabled={permission?.task?.edit === true || Cookies.get('isAdmin') === 'true' ? false:true}
                      onChange={(event) => {
                        const taskDetailsValue = { ...taskDetail[0] };
                        taskDetailsValue.taskDetails = event.target.value;
                        setDescription(event)
                        // setTaskDetail([taskDetailsValue]);
                      }} />
                      }
                  </div>
                  <div className='flex text-xl   justify-between'>
                    <button
                      className='small-button items-center xs:w-full py-2 flex h-8 w-fit mx-auto'
                      onClick={() => {
                        handleUpdateTaskDetails(taskDetail[0]._id, taskDetail);
                        handleTextAreaClick()
                      }}
                    >
                      SAVE
                    </button>
                  </div>
                  {/* Sub task */}
                  <div style={{ display: subtask ? "" : "none" }} className='sm:my-5 my-3 text-defaultTextColor'>
                    <div className='flex items-center justify-between w-11/12'>
                      <p className='heading-medium'>Sub Tasks</p>
                      <div className="w-10/12 flex items-center ml-3">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 ">
                          <div className="bg-brandBlue h-2.5 rounded-full" style={{
                            width: `${taskDetail[0].progress}%`,
                            backgroundColor: taskDetail[0].progress === 100 ? 'limegreen' : '',
                          }}>
                          </div>
                        </div>
                        <div className="text-base font-medium text-defaultTextColor ml-3">{taskDetail[0].progress}%</div>
                      </div>
                    </div>
                    <div className='flex flex-col gap-2'>
                      <div className='border rounded flex items-center justify-between p-4'>
                        <div className='text-sm font-bold outline-none border-none w-4/5'>Total SubTasks :
                          <p className='inline-block ml-2 px-4 py-1 bg-blue-200 text-balck font-bold text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-200 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out'>{taskDetail[0].TotalSubtask ?? '0'}</p>
                        </div>
                        <div className='text-sm font-bold outline-none border-none w-4/5'>Total Completed SubTask :
                          <p className='inline-block ml-2 px-4 py-1 bg-green-200 text-balck font-bold text-sm leading-snug uppercase rounded shadow-md hover:bg-green-200 hover:shadow-lg focus:bg-green-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-800 active:shadow-lg transition duration-150 ease-in-out'>{taskDetail[0].compltedSubTasks ?? '0'}</p>
                        </div>
                        <div className='text-sm font-bold outline-none border-none w-4/5'>Total Pending SubTask :
                          <p className='inline-block ml-2 px-4 py-1 bg-red-200 text-balck font-bold text-sm leading-snug uppercase rounded shadow-md hover:bg-red-200 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out'>{taskDetail[0].pendingSubTasks ?? '0'}</p>
                        </div>
                      </div>

                    </div>
                    <div style={{ display: extrasubtask ? "" : "none" }} className=''>
                      {taskDetail[0].subTasks.map((subtask,index) => (
                        <div key={index}>
                          <div className='flex flex-col gap-2'>
                            <div className='border rounded flex items-center justify-between p-4'>
                              <div className='text-sm text-lightTextColor outline-none border-none w-4/5'>
                                {subtask.subTaskTitle}
                              </div>
                              <input type="checkbox" 
                              name='' value="" 
                              className='h-4 w-4' 
                              checked={subtask?.subTaskStatus==='Done'?true:false} 
                              disabled={true}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className='flex flex-row items-center sm:py-2 py-1 pl-3 gap-2'>
                      <div className='text-sm cursor-pointer hover:text-lightBlue transition-all duration-300'>
                        {permission?.subtask?.create === true ||
                          Cookies.get("isAdmin") === 'true' ? (
                          <ToolTip message={"Subtask"}>
                            <CreateOrEditSubtask
                              type={""}
                              data={taskDetail[0]}
                              {...{
                                handleGetAllTask,
                                handleGetAllUsers,
                                handleGetAllGroup,
                                users,
                                stageList,
                                taskDetail,
                                taskDetails,
                                taskTypeDetails,
                                stopLoading,
                                startLoading,
                                groupList,
                                categoryList,
                                roleList,
                                statusDetails
                              }}
                            />
                          </ToolTip>
                        ) : (
                          <></>
                        )} </div>
                      <p className='text-base cursor-pointer hover:text-lightBlue transition-all duration-300' onClick={() => togglesub() } > 
                      {!extrasubtask ? 'Show All SubTasks' : 'Hide All SubTasks'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
          </div>
          <div className='card p-4 w-full lg:w-1/3'>
            <div className='bg-slate-50 dark:bg-gray-900 px-4 sm:py-2 rounded-lg min-h[260px] lg:h-[500px] overflow-auto'>
              <div className='right_full gap-2 flex flex-col border-b'>
                <div className='flex flex-wrap text-base gap-2 items-center'>
                  <div className="file-input">
                    <input type="file" name="file-input" id="file-input_attachment" className="file-input__input" />
                    <label className="file-input__label" htmlFor="file-input">
                      <GrFormAttachment className=" text-xl text-darkTextColor dark:text-gray-50"/>
                      <p className=' font-semibold text-base cursor-pointer  transition-all duration-300' 
                      onClick={() => {
                        if(permission?.upload?.edit === true || Cookies.get('isAdmin') === 'true'){
                         setshowAttachement(!showAttachement) 
                        }
                         }}>Attachment</p>
                      {/* <span className='pl-1 cursor-pointer text-darkTextColor hover:text-lightBlue transition-all duration-300'>Attachment</span> */}
                    </label>
                  </div>
                </div>
                {showAttachement && (
                  <div className='custom-input'>
                    <label className='flex items-center sm:h-20 justify-center w-full px-4 transition bg-white border-[3px] border-blueColor border-dashed rounded-md appearance-none cursor-pointer  focus:outline-none'>
                      <div>
                        {/* <svg xmlns='http://www.w3.org/2000/svg' className='w-6 h-17 flex justify-center items-center text-lightTextColor' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
                          <path strokeWidth='round' strokeLinejoin='round' d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12' />
                        </svg> */}
                        <span className=" flex justify-center">
                        <AiOutlineCloudUpload className="text-gray-600 text-2xl"/>
                        </span>
                        <p className='font-medium text-lightTextColor flex flex-col'> Add Attachment</p>
                      </div>

                      <input type='file' className='hidden' onChange={event => handleFileUploadInPublic(event)} multiple />
                    </label>
                    <div className=' flex justify-center'>
                      <button
                        type="button"
                        className="small-button items-center xs:w-full py-2 flex h-6 my-1 w-fit"
                        onClick={() => {
                          sethideAttachement(!hideAttachement)
                        }}
                      >
                        {hideAttachement == true ? 'Hide' : 'Show'}
                      </button>
                    </div>
                  </div>
                )}
                {hideAttachement && taskDetail[0]?.attachment?.map((data, index) => (
                  <div className='attachment-thumbnail' key={index}>
                    <a
                      className='attachment-thumbnail-preview bg-blue-200 js-open-viewer'
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
                    <p className='attachment-thumbnail-details js-open-viewer'>
                      <span className='attachment-thumbnail-name'>{data?.substring(data?.lastIndexOf('/') + 1)}</span>
                      <a
                        className='attachment-thumbnail-details-title-action dark-hover js-attachment-action js-direct-link'
                        href={data}
                        target='_blank'
                        rel='noreferrer nofollow noopener'>
                        <span className='icon-sm icon-external-link'></span>
                      </a>
                      <span className='u-block quiet attachment-thumbnail-details-title-options'>
                        <span>
                          <a className='attachment-thumbnail-details-title-options-item dark-hover js-confirm-delete' href='#'>
                            <span className='attachment-thumbnail-details-options-item-text' onClick={() => handleDeleteTaskAttachment(data)}>
                              Delete
                            </span>
                          </a>
                        </span>
                      </span>
                    </p>
                  </div>
                ))}

                <div className='flex text-base gap-2 flex-wrap items-center transition-all duration-300'>
                  <button className='flex items-center cursor-pointer text-darkTextColor hover:text-lightBlue ' onClick={() => { 
                    if(permission?.task?.edit === true || Cookies.get('isAdmin') === 'true'){
                    setMembersCount(!membersCount)
                    } 
                    }}><BsPersonPlus className='mr-2' />Members</button>
                  {membersCount && (
                    <div className="w-full">
                      {/* <SelectDropDown data={searchMemberDetails} roundedSelect={true} /> */}
                      <MultiSelectDropDown
                        value={taskDetail[0].assignedTo}
                        selectedValues={taskDetail[0].assignedTo}
                        handleChangeMultiSelector={handleChangeMultiSelector} name={"members"}
                        option={userName?.filter(function (d) {
                          return d?.role === 'member';
                      })}
                      />
                      <div className='flex flex-col my-5'>
                        <p className='text-sm text-darkTextColor mr-5 mb-5'>Selected </p>

                        <div className='relative'>
                          {profileData.length > 0 ? profileData?.map((ele) => (
                            <a>
                              <span className="flex items-center border-b-2">
                                <span className="member js-member">
                                  <img src={ele.profile ?? USER_AVTAR_URL + ele.firstName + ".svg"} className="member-avatar user-img-sm h=30 w=30 cursor-pointer flex" alt={ele.firstName + ' ' + ele.lastName} />
                                </span>
                                <div className="full-name" name={ele.firstName + ' ' + ele.lastName} aria-hidden="aria-hidden">{ele.firstName + ' ' + ele.lastName} <span className="username">({ele.email})</span></div>
                              </span>
                            </a>
                          )) : taskDetail[0].assignedTo.map((ele) => (
                            <a>
                              <span className="flex items-center border-b-2">
                                <span className="member js-member">
                                  <img src={ele.profilePic ?? USER_AVTAR_URL + ele.firstName + ".svg"} className="member-avatar user-img-sm h=30 w=30 cursor-pointer flex" alt={ele.firstName + ' ' + ele.lastName} />
                                </span>
                                <div className="full-name" name={ele.firstName + ' ' + ele.lastName} aria-hidden="aria-hidden">{ele.firstName + ' ' + ele.lastName} <span className="username">({ele.email})</span></div>
                              </span>
                            </a>
                          ))
                          }
                        </div>
                          {/* <div className='flex flex-col my-5'>
                          <p className='text-sm text-lightTextColor mr-3 mb-3'>All Members </p>

                          <div className="user-img-group items-center">
                            <div>
                              <span className="user-img-sm cursor-pointer text-base w-8 h-8 ml+3 flex justify-center items-center progress-count text-defaultTextColor bg-gray-100/70 font-bold flex">+{userObject?.length}</span>
                            </div>
                            {userObject.map((ele) => (
                              <ToolTip className='relative w-[30px] h-[30px] shadow-md rounded-full' message={ele.value.firstName + ' ' + ele.value.lastName}>
                                <img src={USER_AVTAR_URL + ele.value.firstName + ".svg"} className="user-img-sm w-8 h-8 cursor-pointer" alt="user" />
                              </ToolTip>

                            ))}

                          </div>
                        </div> */}
                        {/* <p className='cursor-pointer text-sm font-bold text-lightTextColor flex items-center mt-5' onClick={handleOpenMemberCount}><AiOutlinePlus className='mr-2' /> Create a member</p> */}
                      </div>
                    </div>
                  )}
                </div>
                {addMembers && (
                  <div className='bg-white rounded-lg p-4 w-full'>
                    <div className='flex justify-between'>
                      <p className='text-base text-darkTextColor mb-1'>Add new member</p>
                      <NewToolTip direction='top' message={"Back"}>
                        <HiArrowNarrowLeft className='cursor-pointer' onClick={handleAddMemberLabel} />
                      </NewToolTip>
                    </div>
                    <div className="remove_margin">
                      <FloatingTextfield
                        type="text"
                        label={""}
                        name="workEmailAddress"
                        placeholder='Work Email Address'
                        value={formState.values.workEmailAddress || ""}
                        onChange={handleChange}
                      />
                    </div>
                    <button type='button' className="small-button items-center py-2 flex h-9 my-5" onClick={() => { handleAddMemberLabel }}>Invite</button>
                  </div>
                )}
                <div className='flex text-base gap-2 flex-wrap items-center hover:text-lightBlue transition-all duration-300'>
                  <div className='text-darkTextColor cursor-pointer hover:text-lightBlue transition-all duration-300'><BsListTask onClick={toggle} /></div>
                  <p className='text-darkTextColor cursor-pointer hover:text-lightBlue transition-all duration-300' onClick={()=>{
                    if(permission?.subtask?.create === true || Cookies.get('isAdmin') === 'true'){
                    toggle()
                    }
                  }}>Subtasks</p>
                </div>
                <div className='flex text-sm gap-2 flex-wrap items-center transition-all duration-300'>
                  {/* <div className='flex text-darkTextColor hover:text-lightBlue cursor-pointer transition-all duration-300 items-center' onClick={handleOpenLabel}><BsTag className='mr-2' /> Label
                  </div> */}
                  {searchLabel && (
                    <div className="w-full">
                      <DropDownWithTick
                        onChangeValue={handleChangeCategory}
                        data={labelDetails}
                        width={"w-[100px]"}
                        value={taskDetail[0].category}
                        id={taskDetail[0]._id}
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
                          <p className='text-sm text-lightTextColor mr-3'>Selected </p>
                          <span className="bg-[#F6CE3D] flex justify-between items-center text-white text-sm font-bold px-2 py-1 rounded-full">{taskDetail[0].category} <span className='flex flex-row cursor-pointer'><AiOutlineEdit className='text-white' />
                            <NewToolTip direction='top' message={"Close"}>
                              <AiOutlineClose className='ml-1 text-white mb-0' />
                            </NewToolTip>
                          </span></span>
                        </div>
                        <p className='cursor-pointer text-sm font-bold text-lightTextColor flex items-center mt-5' onClick={handleOpenCreateLabel}><AiOutlinePlus className='mr-2' /> Create a label</p>
                      </div>
                    </div>
                  )}
                </div>
                {createLabel && (
                  <div className='bg-white rounded-lg p-4 w-full'>
                    <div className='flex justify-between'>
                      <p className='text-base text-darkTextColor mb-1'>Create a label</p>
                      <HiArrowNarrowLeft className='cursor-pointer' onClick={handleOpenLabel} />
                    </div>
                    <div className="remove_margin">
                      <FloatingTextfield
                        type="text"
                        label={""}
                        name="category"
                        placeholder='category'
                        value={formState.values.category || ""}
                        onChange={handleChange}
                      />
                    </div>
                    <button type='button' className="small-button items-center py-2 flex h-9 my-5" onClick={handleAddCategory}>Create</button>
                  </div>
                )}
                <div className='flex text-base gap-2 flex-wrap items-center '>
                  <button type="button" onClick={() => { setShowModal(true) }} className="red-link cursor-pointer text-redColor transition-all duration-300 flex items-center"><AiOutlineDelete className="mr-2" />Delete this task?</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* </div> */}
        {/* Attachments */}
        {taskDetail[0]?.attachment?.length > 0 && 
        <div className="my-2 py-2 px-4 bg-white rounded-xl shadow shadow-md">
          <h2 className='heading-medium font-semibold'>Attachments</h2>
          <div className='flex overflow-y-auto'>
            {taskDetail[0]?.attachment?.map((ele, index) => (
              <div key={index} className=''>
                <p className='heading-medium'></p>
                <div className='flex flex-wrap sm:justify-start justify-center items-center sm:mt-3 gap-2 mt-1'>
                  <div className='relative bg-slate-200/60 md:h-28 w-full rounded-md mr-2 mb-2'>
                    <img
                      className='h-full object-cover w-[200px] rounded-sm cursor-pointer'
                      src={ele}
                      alt="attachment imagesd"
                      onClick={() => setSelectedImage(ele)}
                    />
                    <div className='absolute top-0 right-0'>
                      <button
                        className="w-5 h-5 text-lightGrey hover:text-darkTextColor absolute -right-2 -top-2 rounded-full bg-veryLightGrey uppercase text-sm outline-none focus:outline-none p-1 ease-linear transition-all duration-150"
                        type="button"
                        onClick={() => {
                          handleRemoveAttachements(taskDetail[0]._id, ele)
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {selectedImage && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
              <div className="max-w-screen-md mx-auto p-4 bg-white rounded-lg shadow-lg">
                <img className="w-full" src={selectedImage} alt="attachment imagesd" />
                <button
                  className="mt-4 p-2 bg-gray-300 hover:bg-gray-400 rounded-lg"
                  onClick={() => setSelectedImage(null)}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
        }

        <div className='mt-2 mb-4 flex-col-reverse flex lg:flex-row gap-2'>
          <div className='card p-4 w-full lg:w-1/2'>
          <div className="flex items-center justify-between flex-wrap">
            <div className='heading-medium'>
              <div className='flex items-center '>
                <p className='p-0 m-0 text-lightTextColor text-base'>Show</p>
                <select
                  value={sortTable.limit}
                  onChange={event => {
                    setSortTable({ ...sortTable, limit: event.target.value,pageNo: 1  });
                  }}
                  className='border py-1  rounded-md outline-none w-15 text-sm px-2 mx-1'>
                  <option className="dark:bg-gray-950 dark:text-[#fff]" value={10}>10</option>
                  <option className="dark:bg-gray-950 dark:text-[#fff]" value={25}>25</option>
                  <option className="dark:bg-gray-950 dark:text-[#fff]" value={50}>50</option>
                  <option className="dark:bg-gray-950 dark:text-[#fff]" value={100}>100</option>
                  <option className="dark:bg-gray-950 dark:text-[#fff]" value={500}>500</option>
                </select>
                <p className='p-0 m-0 text-lightTextColor text-base'>Entries</p>
              </div>{' '}
            </div>
            <div className='flex items-center gap-2'>
              <div className='relative mr-3'>
                <SearchInput onChange={(event)=>
                  {setKeyword(event.target.value);
                  setType("search")
                  setSortTable( { skip: 0, limit: 10, pageNo: 1})
                  }} placeholder={'Search a Activities'} />
              </div>
                <Filter {...{  handleGetAllActivity ,setType,handleFiterData}} assignedMembers={taskDetail[0].assignedTo} />
              <NewToolTip direction='top' message={'Hide/Show Activity'}>
                <button
                  type="button"
                  className="border border-veryLightGrey text-xl px-2 py-1 rounded-lg cursor-pointer"
                  onClick={() => {
                    setshowActivity(!showActivity)
                  }}
                >
                  {showActivity == true ? <BiHide className='text-defaultTextColor'/> : <TbActivity className='text-defaultTextColor'/>}
                </button>
                </NewToolTip>
            </div>
            </div>
            <p className='text-[#4E4E4E] font-bold px-2 py-1 md:text-md outline-brandBlue'>Activity</p>
            <ul className='h-[600px] overflow-y-auto'>
              {showActivity &&  activityData?.length > 0 ? (
              activityData.map((item) => (
                <li key={item.id}>
                  {/* <div className={openTab === 1 ? "block" : "hidden"} id="link1"> */}
                  <div >
                    <>
                      <div className='flex flex-row items-center justify-self-start  rounded-xl p-2 my-1'>
                        <div className=''>
                          <div className="flex bg-mediumBlue text-white rounded-full items-center justify-center text-sm w-7 h-7 p-2 hover:bg-lightBlue transition duration-300 ease-in-out" data-mdb-ripple="true" data-mdb-ripple-color="primary">
                            <span className="font-bold">{item?.name?.slice(0, 2)}</span>
                            </div>
                        </div>
                        <div className='flex flex-col'>
                            <div className='flex justify-between items-center'>
                              <p className='gap-2 font-bold px-2 ml-2 md:text-base text-darkTextColor py-1 outline-brandBlue'>{item.name}</p>
                              <p className='outline-brandBlue border-none font-medium text-gray-600 text-sm'>
                                {new Date(item.activityDate).toLocaleString('en-US', {
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
                          <div>
                            <div className='text-[#52A4D1] bg-gray px-2 py-1 rounded-lg gap-2 flex flex-row text-sm items-center'>
                            <p className='gap-2 px-2 md:text-sm text-darkTextColor py-1 break-words w-[70vw] md:w-[30vw] lg:w-[32vw] outline-brandBlue'>{item.activityDetailes}</p>
                              
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
                      setSortTable({
                        ...sortTable,
                        pageNo: sortTable.pageNo - 1,
                      });
                      handlePaginationGroupActivity(
                        "?skip=" +  ((sortTable.limit*sortTable.pageNo)-(sortTable.limit*2))  + "&limit=" + sortTable.limit + '&ActivityType=Task' + '&ActivityTypeId=' + id 
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
                        "?skip=" + sortTable.limit*sortTable.pageNo + "&limit=" + sortTable.limit  +'&ActivityType=Task' + '&ActivityTypeId=' + id 
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
          <div className='card p-4 w-full lg:w-1/2'>
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
              <div className='text-[#4E4E4E] gap-2 font-bold px-2 ml-2 md:text-md py-1 outline-brandBlue flex items-center justify-between'>Comments
                <div className='flex gap-2'>

                
                <div>
                <NewToolTip direction='top' message={'Show/Hide Comments'}>
                  <button
                    type="button"
                    className="border border-veryLightGrey text-xl px-2 py-1 rounded-lg cursor-pointer items-center xs:w-full flex h-8 w-fit"
                    onClick={() => {
                      setshowComments(!showComments)
                    }}
                  >
                    {showComments == true ? <LiaCommentSlashSolid/> : <GoComment/>}
                  </button>
                  </NewToolTip>
                </div>

                <div>
                <NewToolTip direction='top' message={commentsFilter===false?'Newly Created Comments':'Recently Updated Comments'}>
                  <button
                    type="button"
                    className="border border-veryLightGrey text-xl px-2 py-1 rounded-lg cursor-pointer items-center xs:w-full flex h-8 w-fit"
                    onClick={() => {
                      setcommentsFilter(!commentsFilter)
                    }}
                  >
                    {commentsFilter == true ? <VscCommentUnresolved/> : <GoCommentDiscussion/>}
                  </button>
                  </NewToolTip>
                </div>
                </div>
              </div>
              {/* comments */}
              <div className='pt-3 pb-3'>
                <div className=''>
                {Cookies.get('isAdmin') === 'true'|| permission && permission?.comments?.create === true  ? (
                  <div className='flex flex-col gap-5 relative'>
                    <InputEmoji
                      type="text"
                      name="comment"
                      value={commentData.values.comment}
                      placeholder={'comment'}
                      error={hasErrors('comment')}
                      errorMsg={displayErrorMessage(commentData.errors.comment)}
                      onChange={handleChangeComment}
                      searchMention={searchMention}
                      />
                    <div className=' cursor-pointer' onClick={() => {
                        handleAddComments(), handleReset()
                      }}>
                    <button
                      type="button"
                      className="items-center xs:w-full py-2 px-4 rounded-lg flex mx-auto z-20 absolute top-2 text-xl text-defaultTextColor right-10 hover:text-indigo-600"  
                      >
                      <AiOutlineSend/>
                    </button>
                      </div>
                  </div>
                ):('')}
                </div>
              </div>
            </div>
            <div className=''>
              <ul className='h-[500px] overflow-y-auto'>
                {showComments && fetchComments.map((item, key) => (
                  <li key={item.id}>
                    <>
                      <div className=' rounded-xl px-3 py-1 my-1'>
                          <div className='flex flex-col'>
                            <div>
                              <div className='flex flex-row justify-between items-center'>
                                <div className=' flex gap-1'>
                                <p className="flex bg-mediumBlue text-white rounded-full items-center justify-center text-sm w-7 h-7 p-2 hover:bg-lightBlue transition duration-300 ease-in-out" data-mdb-ripple="true" data-mdb-ripple-color="primary"><p className="font-bold">{item.name.slice(0, 2)}</p>
                                </p>
                                <p className='gap-2 font-bold px-2 ml-2 md:text-base text-darkTextColor py-1 outline-brandBlue'>{item.name}</p>
                                </div>
                                <p className=' text-sm font-semibold text-gray-500 border-none'>{new Date(item.createdDate).toLocaleString('en-US', {
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
                          <p key={key} className='flex items-center px-4 justify-between '>
                            <div className='text-lightTextColor outline-none border-none w-full'>
                            {item.isEditing ? (
                              <textarea
                                name={item.comment}
                                id={item.commentId}
                                className={'w-full border outline-none text-base rounded-xl ml-4 px-2 py-1 resize-none hover:resize'}
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
                                <div className=' ps-8 text-base'>{item.comment}</div>
                              )}
                               
                               </div>
                            
                          </p>
                          <div className='text-[#52A4D1]  font-bold bg-gray px-2 py-1 ml-2 rounded-lg gap-2 flex justify-between flex-row text-base items-center'>
                            {/* <p className='outline-brandBlue border-none'>{new Date(item.createdDate).toString().split('G')[0]}</p> */}
                            <div className='flex text-sm font-semibold justify-between gap-2 pl-8'>
                            {item.isEditing ? (
                                     <button className='text-sm'  onClick={() => {
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
                                    </button>
                                     ):('')}
                                     {Cookies.get('isAdmin') === 'true'|| permission && permission?.comments?.edit === true  ? (
                                    <button
                                    className='disabled:opacity-25 disabled:cursor-not-allowed text-gray-400 hover:text-black'
                                    onClick={() => {
                                      const updatedComments = [...fetchComments];
                                      updatedComments[key].isEditing = true;
                                      setfetchComments(updatedComments);
                                    }}
                                    >
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
                          {isReplying[key] && <>
                                                    
                                                    <div className=' ps-10 flex flex-col justify-between py-4 px-2'>
                                                        {/* <div className='flex gap-1 items-center'>

                                                        <p
                                                                    className='flex bg-green-400 text-white rounded-full items-center justify-center text-sm w-8 h-8 p-2 hover:bg-green-300 transition duration-300 ease-in-out'
                                                                    data-mdb-ripple='true'
                                                                    data-mdb-ripple-color='primary'>
                                                                    <p className='font-bold'>AF</p>
                                                        </p>
                                                        <p className='gap-2 font-bold  text-base px-2 py-1 ml-2 md:text-base text-darkTextColor '>Afzal</p>
                                                        </div> */}
                                                        <div className=' py-1'>

                                                        {/* <input type="text" name="reply" id="reply" className=' w-full border outline-none px-3 py-1 rounded-xl' placeholder='write a reply...' /> */}
                                                        <div className='pt-3 pb-3'>
                                                        <div className='flex flex-col gap-1 relative'>
                                                        <InputEmoji
                                                          type="text"
                                                          name="comment"
                                                          value={commentData.values.comment}
                                                          placeholder={'comment'}
                                                          error={hasErrors('comment')}
                                                          errorMsg={displayErrorMessage(commentData.errors.comment)}
                                                          onChange={handleChangeCommentReply}
                                                          searchMention={searchMention}
                                                        />
                                                        <div className=' cursor-pointer' onClick={() => {
                                                          handleReplyComments(item.commentId)
                                                        }}>
                                                      <button
                                                        type="button"
                                                        className="items-center xs:w-full py-2 px-4 rounded-lg flex mx-auto z-20 absolute top-2 text-2xl text-defaultTextColor right-10 hover:text-indigo-600"  
                                                        >
                                                        <AiOutlineSend/>
                                                      </button>
                                                        </div>
                                                        </div>
                                                        <div className=' flex gap-2 text-gray-500 font-semibold text-sm ps-2'>
                                                            {/* <p className=' cursor-pointer hover:text-black' onClick={()=>handleReplyComments(item.commentId)}>Reply</p> */}
                                                            <p className=' cursor-pointer hover:text-black' onClick={()=>toggleReply(key)}>Cancel</p>
                                                        </div>
                                                    </div>
                                                    </div>
                                                    </div>

                                                    {item && item?.reply?.map((items, key) => (
                                                  <li key={items.id}>

                                                      <>
                                                      <div className=' rounded-xl px-3 py-1 my-3 '>
                                                       <div className='flex flex-col'>
                                                       <div>
                                                         <div className='flex flex-row justify-between items-center'>
                                                           <div className=' flex gap-1'>
                           
                                                           <p className="flex bg-green-400 text-white rounded-full items-center justify-center text-sm w-6 h-6 p-2 hover:bg-green-300 transition duration-300 ease-in-out" data-mdb-ripple="true" data-mdb-ripple-color="primary"><p className="font-bold">{item.name.slice(0, 2)}</p>
                                                           </p>
                                                           <p className='gap-2 font-bold  px-2 ml-2 md:text-base text-darkTextColor py-1 outline-brandBlue'>{items?.replyedUserDetails?.name}</p>
                                                           </div>
                                                           <p className=' text-sm font-semibold text-gray-500 border-none'>{new Date(items?.createdAt).toLocaleString('en-US', {
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
                <DeleteConformation open={openDeleteModel} close={() => setOpenDeleteModel(false)} message={deleteMessage} onClick={() => { handleDeleteComment(), setOpenDeleteModel(false) }} />
              )}
            </div>
            
          </div>
          ):('')}
        </div>

        {/* Delete Modal */}
        {
          showModal && (
            <>
              <div
                className="justify-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                <div className="relative my-2 mx-auto w-11/12 lg:w-6/12 z-50">
                  {/*content*/}
                  <div className="border-0 mb-7 mt-40 rounded-2xl shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                    {/*header*/}
                    {/*body*/}
                    <div className="relative py-10 px-10 md:px-32 flex-auto">
                      <button
                        className="text-lightGrey hover:text-darkTextColor absolute -right-2 -top-2 rounded-full bg-veryLightGrey  uppercase  text-sm outline-none focus:outline-none p-1 ease-linear transition-all duration-150"
                        type="button"
                        onClick={() => setShowModal(false)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      <div className="rounded-lg bg-white">
                        <div className="text-center sm:my-4 my-2">
                          <img src="/imgs/delete.svg" className="w-100 mx-auto" alt="Delete" />
                          <h2 className="font-bold text-darkTextColor text-3xl mt-5">Delete tasks?</h2>
                          <p className="text-base sm:my-3 text-lightTextColor">You will not be able to recover it</p>
                          <div className="flex justify-center mt-12">
                            <button type="cancel" className="nostyle-button mr-4" onClick={() => { setShowModal(false) }}>Cancel</button>
                            <button type="submit" className="delete-button px-10"
                              onClick={() => { 
                                if(permission?.task?.delete === true || Cookies.get('isAdmin') === 'true'){
                                handleDeleteTask(taskDetail[0]._id), 
                                setShowModal(false), 
                                router.push("/w-m/tasks/all")}else{
                                  handleDeleteTask(taskDetail[0]._id)
                                  setShowModal(false)
                                }
                               }}
                            >Delete</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="opacity-25 fixed inset-0 z-40 bg-black" onClick={() => { setShowModal(false) }}></div>
              </div>
            </>
          )
        }
      </div >
    )
  }
}
export default index;