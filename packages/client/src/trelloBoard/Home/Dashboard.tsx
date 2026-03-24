import React, { Fragment, useEffect, useState } from 'react';
import Board from '../Board/Board';
// import "./Dashboard.css";
import CustomInput from '../CustomInput/CustomInput';
// import { Filter } from 'react-feather';
import { ICard, IBoard } from '../Interfaces/Kanban';
import { fetchBoardList, updateLocalStorageBoards, fetchBoardListByTaskName, fetchBoardListByMemberId, fetchUpdatedBoardList } from '../Helper/APILayers';
import { updateTaskStatus } from '../Helper/api/put';
import toast from '../../../src/components/Toster';
import { deleteTaskById, deleteTaskStatusById } from '../Helper/api/delete';
import { createStatus, createSubtaskApi, createTaskApi } from '../Helper/api/post';
import SearchInput from '@COMPONENTS/SearchInput';
import DropDownWithTick from '../../components/DropDownWithTick';
import Filter from './filter';
import { fetchProfile, getAllProject, getAllTask, getAllTaskByMemberId, getAllUsers, getTaskById, searchTask } from '../Helper/api/get';
import { Listbox, Popover, Transition } from '@headlessui/react';
import { GrClose } from 'react-icons/gr';
import { BiFilter } from 'react-icons/bi';
import { IoChevronDownCircleOutline } from 'react-icons/io5';
import { BsFillPersonFill } from 'react-icons/bs';
import { RiCheckboxBlankCircleFill } from 'react-icons/ri';
import { MdDelete } from 'react-icons/md';
import { AiOutlineDelete } from 'react-icons/ai';
import Cookies from 'js-cookie';
import { array } from '@amcharts/amcharts5';
import { USER_AVTAR_URL } from '@HELPER/avtar';
import ToolTip from '@COMPONENTS/ToolTip';
import { useRouter } from 'next/router';
import CardInfo from '../Card/CardInfo/CardInfo';
import NoSsr from '@COMPONENTS/NoSsr';
import MultiSelectDropDown from '@COMPONENTS/MultiSelectDropDown';
import { openUpgradePlan } from '@HELPER/function';
import Multiselect from 'multiselect-react-dropdown';
import { TiTick } from 'react-icons/ti';
import QRCode from 'qrcode.react';

function Dashboard() {
    const [showModal, setShowModal] = useState(false);
    const [boards, setBoards] = useState<IBoard[]>([]);
    const [projects, setProjects] = useState([]);
    const [specificProject, setSpecificProject] = useState([]);
    const [projectNames, setProjectName] = useState(null);
    const [projectId, setProjectId] = useState('all');
    const [permission, setPermission] = useState(null);
    const [membersDetail, setMemberDetails] = useState(null);
    const [selectedMemberId, setSelectedMemberId] = useState(null);
    const [selectedMember, setSelectedMember] = useState([]);
    const [member, setMember] = useState([]);
    const [projectidall, projectIdAll] = useState(null);
    const [memberApiBody, setMemberApiBody] = useState([]);
    const [searchedValue, setSearchedValue] = useState('');
    const [ShowModelCard, setShowModalCard] = useState(false);
    const [cardValue, setCardValues] = useState(null);
    const [urlId, setUrlId] = useState(null);
    
    let initialState = {
        values: {
            projectId: '',
            assignedTo: [],
            standAloneTask: false,
            createdAt: {
                startDate: null,
                endDate: null,
            },
            updatedAt: {
                startDate: null,
                endDate: null,
            },
        },
    };
    let [formState, setFormState] = useState({ ...initialState });
    useEffect(() => {
        fetchData(formState?.values);
    }, [formState]);

    // filter colors
    const [recentUpdatedTask, setRecentUpdatedTask] = useState(true);
    const [recentCreatedTask, setRecentCreatedTask] = useState(true);

    useEffect(() => {
        const today = new Date();
        const formattedDate = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;

        setFormState(prevState => {
            const updatedValues = { ...prevState.values };

            if (recentUpdatedTask === false) {
                updatedValues.updatedAt = {
                    startDate: formattedDate,
                    endDate: formattedDate,
                };
            } else {
                updatedValues.updatedAt = {
                    startDate: '',
                    endDate: '',
                };
            }

            if (recentCreatedTask === false) {
                updatedValues.createdAt = {
                    startDate: formattedDate,
                    endDate: formattedDate,
                };
            } else {
                updatedValues.createdAt = {
                    startDate: '',
                    endDate: '',
                };
            }

            return { ...prevState, values: updatedValues };
        });
    }, [recentUpdatedTask, recentCreatedTask]);

    const toggleBackgroundColor1 = () => {
        setRecentUpdatedTask(prevIsBlue1 => !prevIsBlue1);
    };

    const toggleBackgroundColor2 = () => {
        setRecentCreatedTask(prevIsBlue2 => !prevIsBlue2);
    };

    const router = useRouter();
    const originalUrl = `${process.env.SHARE_LINK }`
const modifiedUrl = originalUrl.replace('/?id=', '');


    useEffect(() => {
        let { id } = router.query;

        if (id) {
            setUrlId(id);
        }
    }, [router.query]);
    useEffect(() => {
        if (urlId) {
            setShowModalCard(true);
        }
    }, [urlId]);

    useEffect(() => {
        document.body.classList.toggle('modal-open', showModal);
    }, [showModal]);
    useEffect(() => {
        allProjects();
        projectname();
        if (Cookies.get('isAdmin') === 'false') {
            handleProfileData();
        }
        handleGetAllUser('?limit=' + 5000 + '&invitationStatus=1&suspensionStatus=false');
    }, []);
    const handleProfileData = () => {
        fetchProfile().then(response => {
            if (response.data?.body.status === 'success') {
                setPermission(response?.data?.body?.data?.permissionConfig);
            }
        });
    };
    const projectname = async () => {
        // let AllProjectsApi = await getAllProject();
        // let id = AllProjectsApi?.data?.body?.data?.project[0]?._id;
        setProjectName('All');
        // setProjectId(id);
        // const actualApiResponse = await getAllTask(`projectId=${id}`); // Wait for the second API call
        fetchData(formState.values);
    };

    async function fetchData(data) {
        // const boards: IBoard[] = await fetchBoardList(id,value);
        // setBoards(boards);
        const updatedBoards: IBoard[] = await fetchUpdatedBoardList(data);

        setBoards(updatedBoards);
    }
    const [targetCard, setTargetCard] = useState({
        boardId: 0,
        cardId: 0,
    });

    const addboardHandler = (statusCode: string) => {
        createStatus(statusCode)
            .then(function (result) {
                if (result.data && result.data.body.status === 'success') {
                    toast({
                        type: 'success',
                        message: result ? result.data.body.message : 'Try again !',
                    });
                    if (memberApiBody.length > 0) {
                        handleGetSelectedMembersTask(memberApiBody);
                    } else if (searchedValue !== '') {
                        searchedData(searchedValue);
                    } else {
                        fetchData(formState?.values);
                    }
                } else {
                    toast({
                        type: 'error',
                        message: result ? result.data.body.message : 'Something went wrong, Try again !',
                    });
                    if (memberApiBody.length > 0) {
                        handleGetSelectedMembersTask(memberApiBody);
                    } else if (searchedValue !== '') {
                        searchedData(searchedValue);
                    } else {
                        fetchData(formState?.values);
                    }
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

    const handleDeleteTaskStatusById = deleteTaskId => {
        deleteTaskStatusById(deleteTaskId)
            .then(function (result) {
                if (result?.data && result?.data?.body?.status === 'success') {
                    toast({
                        type: 'success',
                        message: result ? result.data.body.message : 'Try again !',
                    });
                    if (memberApiBody.length > 0) {
                        handleGetSelectedMembersTask(memberApiBody);
                    } else if (searchedValue !== '') {
                        searchedData(searchedValue);
                    } else {
                        fetchData(formState?.values);
                    }
                } else {
                    toast({
                        type: 'error',
                        message: result ? result?.response?.data?.body?.message : 'Error',
                    });
                    if (memberApiBody.length > 0) {
                        handleGetSelectedMembersTask(memberApiBody);
                    } else if (searchedValue !== '') {
                        searchedData(searchedValue);
                    } else {
                        fetchData(formState?.values);
                    }
                }
            })
            .catch(function ({ response }) {
                toast({
                    type: 'error',
                    message: response ? response?.data?.body?.message : 'Something went wrong, Try again !',
                });
            });
    };

    const removeBoard = (boardId: number) => {
        const boardIndex = boards.findIndex((item: IBoard) => item._id === boardId);

        if (boardIndex < 0) return;

        if (boards[boardIndex].isDefault === false) {
            const tempBoardsList = [...boards];
            tempBoardsList.splice(boardIndex, 1);
            // setBoards(tempBoardsList);
            handleDeleteTaskStatusById(boardId);
        } else {
            handleDeleteTaskStatusById(boardId);
        }
    };

    const addCardHandler = (taskStatus: string, taskTitle: string) => {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate());
        let data = JSON.stringify({
            projectId: projectId === 'all' ? null : projectId,
            taskTitle: taskTitle,
            // assignedTo: Cookies.get('isAdmin') === 'false' ? [{ id: Cookies.get('id') }] : [],
            taskStatus: taskStatus,
            estimationDate: currentDate,
            dueDate: currentDate,
            estimationTime: '20:00',
            category: 'Default',
            taskType: 'Default',
            stageName: 'Default',
            priority: 'Low',
        });

        createTaskApi(data)
            .then(function (result) {
                if (result.data && result.data.body.status === 'success') {
                    toast({
                        type: 'success',
                        message: result ? result.data.body.message : 'Try again !',
                    });
                    if (memberApiBody.length > 0) {
                        handleGetSelectedMembersTask(memberApiBody);
                    } else if (searchedValue !== '') {
                        searchedData(searchedValue);
                    } else {
                        fetchData(formState?.values);
                    }
                } else {
                    toast({
                        type: 'error',
                        message: result ? result.data.body.message : 'Something went wrong, Try again !',
                    });
                    if (memberApiBody.length > 0) {
                        handleGetSelectedMembersTask(memberApiBody);
                    } else if (searchedValue !== '') {
                        searchedData(searchedValue);
                    } else {
                        fetchData(formState?.values);
                    }
                }
            })
            .catch(function ({ response }) {
                if (response?.status === 429) {
                    openUpgradePlan();
                } else {
                    toast({
                        type: 'error',
                        message: response ? response.data.body.message : 'Something went wrong, Try again !',
                    });
                }
            });
    };

    const handleDeleteTaskById = deleteTaskId => {
        deleteTaskById(deleteTaskId)
            .then(function (result) {
                if (result.data.body.status == 'success') {
                    toast({
                        type: 'success',
                        message: result ? result.data.body.message : 'Try again !',
                    });
                    if (memberApiBody.length > 0) {
                        handleGetSelectedMembersTask(memberApiBody);
                    } else if (searchedValue !== '') {
                        searchedData(searchedValue);
                    } else {
                        fetchData(formState?.values);
                    }
                } else {
                    toast({
                        type: 'error',
                        message: result ? result.data.body.message : 'Error',
                    });
                    if (memberApiBody.length > 0) {
                        handleGetSelectedMembersTask(memberApiBody);
                    } else if (searchedValue !== '') {
                        searchedData(searchedValue);
                    } else {
                        fetchData(formState?.values);
                    }
                }
            })
            .catch(function (e) {
                toast({
                    type: 'error',
                    message: e.response ? e.response.data.body.message : 'Something went wrong, Try again !',
                });
            });
    };

    const removeCard = (boardId: number, cardId: number) => {
        const boardIndex = boards.findIndex((item: IBoard) => item._id === boardId);
        if (boardIndex < 0) return;

        const tempBoardsList = [...boards];
        const cards = tempBoardsList[boardIndex].tasks;

        const cardIndex = cards.findIndex(item => item._id === cardId);
        if (cardIndex < 0) return;

        cards.splice(cardIndex, 1);
        setBoards(tempBoardsList);
        handleDeleteTaskById(cardId);
    };

    const updateCard = (boardId: number, cardId: number, tasks: ICard) => {
        const boardIndex = boards.findIndex(item => item._id === boardId);
        if (boardIndex < 0) return;

        const tempBoardsList = [...boards];
        const cards = tempBoardsList[boardIndex].tasks;

        const cardIndex = cards.findIndex(item => item._id === cardId);
        if (cardIndex < 0) return;

        tempBoardsList[boardIndex].tasks[cardIndex] = tasks;
        if (memberApiBody.length > 0) {
            handleGetSelectedMembersTask(memberApiBody);
        } else if (searchedValue !== '') {
            searchedData(searchedValue);
        } else {
            fetchData(formState?.values);
        }
    };

    const handleUpdateTaskStatus = (id, data) => {
        if (!data) {
            toast({
                type: 'info',
                message: 'No change in value!',
            });
            return;
        }
        let datas = JSON.stringify({
            taskStatus: data,
        });
        updateTaskStatus(datas, id, fetchData)
            .then(response => {
                if (response?.data?.body?.status === 'success') {
                    toast({
                        type: 'success',
                        message: response ? response.data?.body?.message : 'Try again !',
                    });
                    if (searchedValue !== '') {
                        searchedData(searchedValue);
                    } else {
                        fetchData(formState?.values);
                    }
                } else {
                    toast({
                        type: 'error',
                        message: response ? response.data.body.message : 'Try again !',
                    });
                    if (searchedValue !== '') {
                        searchedData(searchedValue);
                    } else {
                        fetchData(formState?.values);
                    }
                }
            })
            .catch(e => {});
    };

    const onDragEnd = (boardId: number, cardId: number) => {
        const sourceBoardIndex = boards.findIndex((item: IBoard) => item._id === boardId);
        if (sourceBoardIndex < 0) return;

        const sourceCardIndex = boards[sourceBoardIndex]?.tasks?.findIndex(item => item._id === cardId);
        if (sourceCardIndex < 0) return;

        const targetBoardIndex = boards.findIndex((item: IBoard) => item._id === targetCard.boardId);
        if (targetBoardIndex < 0) return;

        const tempBoardsList = [...boards];
        const sourceCard = tempBoardsList[sourceBoardIndex].tasks[sourceCardIndex];
        tempBoardsList[sourceBoardIndex].tasks.splice(sourceCardIndex, 1);

        const targetCardIndex = boards[targetBoardIndex]?.tasks?.findIndex(item => item._id === targetCard.cardId);
        if (targetCardIndex < 0) {
            tempBoardsList[targetBoardIndex].tasks.splice(0, 0, sourceCard);
        } else {
            tempBoardsList[targetBoardIndex].tasks.splice(targetCardIndex, 0, sourceCard);
        }
        // if(permission.task.edit===true){
        handleUpdateTaskStatus(sourceCard._id, boards[targetBoardIndex].taskStatus);
        // }

        // setBoards(tempBoardsList);

        setTargetCard({
            boardId: 0,
            cardId: 0,
        });
    };

    const handleDragOver = (event: any) => {
        event.preventDefault();
    };

    const onDrop = (event: any, boardId: number, cardId: number) => {
        if (permission?.task?.edit === true || Cookies.get('isAdmin') === 'true') {
            event.preventDefault();
            const targetBoardIndex = boards.findIndex((item: IBoard) => item.id === boardId);
            if (!boards[targetBoardIndex]?.tasks?.length) {
                setTargetCard({
                    boardId: boardId,
                    cardId: cardId,
                });
            }
            if (cardId !== 0) {
                setTargetCard({
                    boardId: boardId,
                    cardId: cardId,
                });
            }
        }
    };

    const handleSearchTask = (event: { target: { value: string } }) => {
        const value = event.target.value;
        if (typeof value === 'string') {
            setSearchedValue(value);
        } else {
            fetchData(formState?.values);
        }
    };
    async function searchedData(searchedValue) {
        const searchedBoards: IBoard[] = await fetchBoardListByTaskName(searchedValue);
        setBoards(searchedBoards);
    }
    useEffect(()=>{
        
        searchedData(searchedValue);

    },[searchedValue])

    async function allProjects() {
        let AllProjectsApi = await getAllProject();
        if (AllProjectsApi?.data?.body?.data?.project) {
            AllProjectsApi.data.body.data.project.unshift({ projectName: 'All', _id: 'all' }, { projectName: 'Independent Task', _id: '' });
            setProjects(AllProjectsApi?.data?.body?.data?.project);
            setSpecificProject(AllProjectsApi?.data?.body?.data?.project.slice(2));
        }
    }

    const handleProject = async e => {
        // fetchData(e.id);

        if (e?.id === 'all') {
            setFormState({
                ...formState,
                values: {
                    ...formState.values,
                    projectId: '',
                    standAloneTask: false,
                },
            });
        } else if (e.id !== 'all' && e.id !== '' && e.id !== null) {
            setFormState({
                ...formState,
                values: {
                    ...formState.values,
                    projectId: e.id,
                    standAloneTask: false,
                },
            });
        } else if (e.id === null || e.id === '' || e.id !== 'all') {
            setFormState({
                ...formState,
                values: {
                    ...formState.values,
                    projectId: e.id,
                    standAloneTask: true,
                },
            });
        }

        projectIdAll(e.id);
        setProjectId(e.id);
        const actualApiResponse = await getAllTask(`projectId=${e.id}`); // Wait for the second API call
        setProjectName(actualApiResponse?.data?.body?.data?.tasks[0]?.projectName);
    };

    const handleGetAllUser = (condition = '') => {
        getAllUsers(condition).then(response => {
            if (response.data.body.status === 'success') {
                setMemberDetails(response.data?.body?.data?.users);
                setMember(response.data?.body?.data?.users);
                setMemberDetails(
                    response.data?.body?.data?.users.map(function (item) {
                        return {
                            id: item._id,
                            key: `${item.firstName} ${item.lastName}`,
                            value: item,
                        };
                    })
                );
            }
        });
    };

    const handleMemberSelection = event => {
        const memberId = event.target.value;
        const newDatas = [...memberApiBody, { id: event.target.value }];
        setMemberApiBody(newDatas);
        const filteredMembers = membersDetail.filter(member => member._id === event.target.value);
        // handleGetSelectedMembersTask(event.target.value)
        // setSelectedMember([...filteredMembers]);

        setSelectedMember([...selectedMember, ...filteredMembers]);
        const removeFilteredMember = membersDetail.filter(member => member._id !== memberId);
        setMemberDetails([...removeFilteredMember]);
        setSelectedMemberId(memberId);
    };
    const [multipleSelectedMembers, setMultipleSelectedMember] = useState(null);
    const handleChangeMultiSelector = (data, name) => {
        setMultipleSelectedMember(data);
        let extractedData = data.map(item => ({
            id: item.id,
        }));

        setMemberApiBody(extractedData);
    };
    const handleGetSelectedMembersTask = id => {
        // let datas = JSON.stringify([{
        //     userId:id,
        // }]);

        FilterByMember(id);

        // getAllTaskByMemberId(id).then(response => {
        //     if (response?.data?.statusCode === 200) {
        //         // toast({
        //         //     type: 'success',
        //         //     message: response ? response.data?.body?.message : 'Try again !',
        //         // });
        //         FilterByMember(response);
        //     } else {
        //         toast({
        //             type: 'error',
        //             message: response ? response.data?.body?.message : 'Try again !',
        //         });
        //     }
        // });
    };
    const handleRemoveSelectedMember = id => {
        const updatedDatas = memberApiBody.filter(data => data.userId !== id);
        setMemberApiBody(updatedDatas);
        const filteredMembers = selectedMember.filter(member => member._id !== id);
        setSelectedMember([...filteredMembers]);
        const desiredObject = member.filter(member => member._id === id);
        setMemberDetails([...desiredObject, ...membersDetail]);
    };
    async function FilterByMember(value) {
        const filterTaskByMember: IBoard[] = await fetchBoardListByMemberId(value);
        // fetchData(projectId,value);
        setFormState({
            ...formState,
            values: {
                ...formState.values,
                assignedTo: value,
            },
        });
        setBoards(filterTaskByMember);
    }
    const [componentMounted, setComponentMounted] = useState(false);
    useEffect(() => {
        if (memberApiBody?.length > 0) {
            handleGetSelectedMembersTask(memberApiBody);
        } else {
            if (componentMounted) {
                // fetchData('all');
                setFormState({
                    ...formState,
                    values: {
                        ...formState.values,
                        assignedTo: [],
                    },
                });
            } else {
                setComponentMounted(true);
            }
        }
    }, [memberApiBody]);

    function performDataFetch() {
        if (memberApiBody.length > 0) {
            handleGetSelectedMembersTask(memberApiBody);
        } else if (searchedValue !== '') {
            searchedData(searchedValue);
        } else {
            fetchData(formState?.values);
        }
    }
    const handleGetTaskByUrlId = (condition = ' ') => {
        getTaskById(condition)
            .then(response => {
                if (response.data.body.status === 'success') {
                    setCardValues(response.data.body.data[0]);
                }
            })
            .catch(function (e) {
                //   stopLoading();
                toast({
                    type: 'error',
                    message: e.response ? e.response.data.body.message : 'Something went wrong, Try again !',
                });
            });
    };
    useEffect(() => {
        if (urlId !== null) {
            handleGetTaskByUrlId(`?Id=${urlId}`);
        }
    }, [urlId]);
    const handleResetFilters = () => {
        setSearchedValue('')
        setFormState({ ...initialState });
        setMemberApiBody([]);
        setMultipleSelectedMember(null);
        setRecentUpdatedTask(true);
        setRecentCreatedTask(true);
    };

    
    const [textToEncode, setTextToEncode] = useState('');
    const [showQRCode, setShowQRCode] = useState(false);
  
    const generateQR = () => {
        setShowQRCode(true);
      };
    
      const closeQR = () => {
        setShowQRCode(false);
        setTextToEncode(''); // Clear the text as well if you want
      };

      const DownloadQR = () => {
        const canvas = document.querySelector('canvas'); // Get the QR code canvas
        const url = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = url;
        a.download = `Workflow-Board.png`; // Set the filename for the download
        a.click();
      };


    return (
        <div className='app md:-mt-6'>
            <div className='app-nav z-50'>
                <div className='flex items-center flex-wrap mb-2 justify-between'>
                    <h2 id='step1' className='heading-big relative mb-0 heading-big text-darkTextColor px-2 py-1 text-2xl'>
                        Workflow Boards
                    </h2>
                    <div className=' flex gap-2'>
                                <Popover className='relative'>
                                    {({ open }) => (
                                        <>
                                            <Popover.Button
                                                className={`
                                            ${open ? '' : 'text-opacity-90'}
                                            ${(multipleSelectedMembers && multipleSelectedMembers.length > 0) || recentUpdatedTask === false || recentCreatedTask === false ? 'w-fit pr-0' : ''}
                                            group inline-flex gap-1 items-center h-8 rounded-xl bg-white mt-1 border px-2 text-black text-base font-medium hover:text-opacity-100 focus:outline-none focus-visible:ring-2 dark:bg-transparent dark:border-gray-700 focus-visible:ring-white focus-visible:ring-opacity-75`}>
                                                <div className='flex items-center gap-2'>
                                                    <BiFilter className=' text-2xl dark:text-gray-50' />
                                                    <p className='text-base dark:text-gray-50'>Filter</p>
                                                    {/* clear all functionality */}
                                                    {(multipleSelectedMembers && multipleSelectedMembers.length > 0) || recentUpdatedTask === false || recentCreatedTask === false ? (
                                                        <button className=' hover:bg-slate-100 dark:hover:bg-gray-800 text-base px-2 h-7 flex items-center rounded-r-xl dark:text-gray-50' onClick={handleResetFilters}>
                                                            Reset
                                                        </button>
                                                    ) : (
                                                        ''
                                                    )}
                                                </div>
                                            </Popover.Button>
                                            <Transition
                                                as={Fragment}
                                                enter='transition ease-out duration-200'
                                                enterFrom='opacity-0 translate-y-1'
                                                enterTo='opacity-100 translate-y-0'
                                                leave='transition ease-in duration-150'
                                                leaveFrom='opacity-100 translate-y-0'
                                                leaveTo='opacity-0 translate-y-1'>
                                                <Popover.Panel className='absolute z-50 left-16 w-[360px] max-w-sm -translate-x-1/2 transform px-4 sm:px-0 lg:max-w-xl'>
                                                    <div className='overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5'>
                                                        <div className='relative text-black gap-8 bg-white p-7 '>
                                                            {/* <div>
                                                                <h2 className=' font-semibold'>Keyword</h2>
                                                                <input type='text' placeholder='Enter a Keyword...' className=' w-full border px-2' name='keyword' id='keyword' />
                                                                <p className=' text-[11px]'>Search Card, members, labels, and more</p>
                                                            </div> */}
                                                            <div>
                                                                <div className=' flex justify-start gap-2 text-sm'>
                                                                    <button
                                                                        className={`filter-btn1 h-6 ${
                                                                            recentUpdatedTask ? 'bg-blue-200 text-gray-50 dark:bg-gray-800 dark:border dark:border-blue-300' : 'bg-blue-500 text-black'
                                                                        } hover:bg-blue-400 dark:hover:bg-blue-500 px-4 font-semibold rounded-xl flex items-center`}
                                                                        onClick={toggleBackgroundColor1}>
                                                                        {!recentUpdatedTask && <TiTick />}
                                                                        Recent Updates
                                                                    </button>

                                                                    <button
                                                                        className={`filter-btn1 h-6 ${
                                                                            recentCreatedTask ? 'bg-blue-200 text-gray-50 dark:bg-gray-800 dark:border dark:border-blue-300' : 'bg-blue-500 text-black'
                                                                        } hover:bg-blue-400 dark:hover:bg-blue-500 px-4 font-semibold rounded-xl flex items-center`}
                                                                        onClick={toggleBackgroundColor2}>
                                                                        {!recentCreatedTask && <TiTick />}
                                                                        Today&apos;s Card
                                                                    </button>
                                                                </div>
                                                                <h2 className=' font-semibold text-base dark:text-gray-50'>Members</h2>
                                                                {membersDetail?.length === 0 && (
                                                                    <div className='flex gap-4 items-center hover:bg-slate-100 px-2 py-1 rounded'>
                                                                        {/* <input type='checkbox' name='noMember' id='noMember' /> */}
                                                                        <span className='bg-slate-200 rounded-full px-2 py-2'>
                                                                            <BsFillPersonFill />
                                                                        </span>
                                                                        <label htmlFor='noMember' className='dark:text-gray-50'>No members</label>
                                                                    </div>
                                                                )}
                                                                {selectedMember?.map(item => (
                                                                    <div className='flex gap-4 items-center justify-between hover:bg-slate-100 px-2 py-2 rounded' key={item?._id}>
                                                                        <label htmlFor={`checkbox-${item?._id}`} className='flex items-center'>
                                                                            {/* <input
                                                                                type='checkbox'
                                                                                name='cardsAssign'
                                                                                id={`checkbox-${item?._id}`}
                                                                                onChange={event => memberSelected(item?._id, event.target.checked)}
                                                                            /> */}
                                                                            <span className='user-img-group mr-2'>
                                                                                <img className='user-img-sm' src={item?.profilePic ? item?.profilePic : USER_AVTAR_URL + item?.firstName} />
                                                                            </span>
                                                                            {item?.firstName + ' ' + item?.lastName}
                                                                        </label>
                                                                        <div className=' cursor-pointer'>
                                                                            <MdDelete className='text-red-500 text-xl' onClick={() => handleRemoveSelectedMember(item?._id)} />
                                                                        </div>
                                                                    </div>
                                                                ))}

                                                                <div className=' px-2 rounded select-cnt w-full'>
                                                                    {/* <input type='checkbox' name='members' id='members' /> */}
                                                                    {/* <select
                                                                        name='member'
                                                                        className='w-full outline-none bg-inherit'
                                                                        id='member'
                                                                        onChange={handleMemberSelection}
                                                                        value={selectedMemberId}
                                                                        >
                                                                        <option value=''>Select Member</option>
                                                                        {membersDetail?.map(member => (
                                                                            <option key={member?._id} value={member?._id}>
                                                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                                    <span className='user-img-group'>
                                                                                        <img className='user-img-sm' src={member?.profilePic} />
                                                                                    </span>
                                                                                    <span>{member?.firstName + ' ' + member?.lastName}</span>
                                                                                </div>
                                                                            </option>
                                                                        ))}

                                                                    </select> */}
                                                                    <MultiSelectDropDown
                                                                        handleChangeMultiSelector={handleChangeMultiSelector}
                                                                        value={selectedMemberId}
                                                                        name={'group'}
                                                                        selectedValues={multipleSelectedMembers}
                                                                        option={membersDetail}
                                                                        label={undefined}
                                                                        error={undefined}
                                                                        type={undefined}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Popover.Panel>
                                            </Transition>
                                        </>
                                    )}
                                </Popover>
                                <DropDownWithTick
                                    paddingForDropdown='h-8 mt-1 flex items-center'
                                    onChangeValue={handleProject}
                                    data={
                                        projects &&
                                        projects?.map(d => {
                                            return { name: d?.projectName, value: d?.projectName, id: d?._id };
                                        })
                                    }
                                    value={projectNames}
                                    id={null}
                                    handle={undefined}
                                    selectedData={null}
                                    icon={undefined}
                                    roundedSelect={undefined}
                                    className={'relative text-black'}
                                    type={undefined}
                                />
                    </div>
                    <button onClick={generateQR} className='small-button flex items-center h-7'>Generate QR</button>
                       
                    <SearchInput serchClass={'leading-none'} searchIcon={'true'} onChange={handleSearchTask} placeholder={'Search a task'} value={searchedValue}/>
                </div>
                              </div>
            <div className='app-boards-container'>
                <div className='app-boards'>
                    {boards?.map(item => (
                        <Board
                            key={item._id}
                            board={item}
                            addCard={addCardHandler}
                            taskStatus={item.taskStatus}
                            removeBoard={() => removeBoard(item._id)}
                            removeCard={removeCard}
                            onDragEnd={onDragEnd}
                            // onDragEnter={onDragEnter}
                            onDragOver={handleDragOver}
                            onDrop={onDrop}
                            updateCard={updateCard}
                            fetchData={fetchData}
                            projectId={projectId}
                            projectNames={projectidall}
                            projects={specificProject}
                            permission={permission}
                            performDataFetch={performDataFetch}
                            urlId={urlId}
                        />
                    ))}
                    {Cookies.get('isAdmin') === true ? (
                        // Outermost condition
                        <div className='app-boards-last mt-4'>
                            <CustomInput
                                displayClass='app-boards-add-board'
                                editClass='app-boards-add-board-edit'
                                placeholder='Enter Board Name'
                                text='Add Board'
                                buttonText='Add Board'
                                onSubmit={addboardHandler}
                                validation='title'
                                diableDashboard={permission && (permission?.task?.create === true || Cookies.get('isAdmin') === 'true') ? true : false}
                            />
                        </div>
                    ) : permission && permission?.task?.create === false ? null : (
                        <div className='app-boards-last mt-4'>
                            <CustomInput
                                displayClass='app-boards-add-board'
                                editClass='app-boards-add-board-edit'
                                placeholder='Enter Board Name'
                                text='Add Board'
                                buttonText='Add Board'
                                onSubmit={addboardHandler}
                                validation='title'
                                diableDashboard={permission && (permission?.task?.create === true || Cookies.get('isAdmin') === 'true') ? true : false}
                            />
                        </div>
                    )}
                </div>
            </div>
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
                                        className='text-lightGrey hover:text-darkTextColor absolute -right-2 -top-2 rounded-full bg-veryLightGrey  uppercase  text-sm outline-none focus:outline-none p-1 ease-linear transition-all duration-150'
                                        type='button'
                                        onClick={() => setShowModal(false)}>
                                        <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' stroke-width='2'>
                                            <path stroke-linecap='round' stroke-linejoin='round' d='M6 18L18 6M6 6l12 12' />
                                        </svg>
                                    </button>
                                    <div className='rounded-lg bg-white'>
                                        <div className='text-center sm:my-4 my-2'>
                                            <img src='/imgs/delete.svg' className='w-100 mx-auto' alt='Delete' />
                                            <h2 className='font-bold text-darkTextColor text-3xl mt-5'>Delete all tasks?</h2>
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
                                                        handleDeleteProjectById(projectDetail.project._id), setShowModal(false), router.push('/w-m/projects/all');
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
            {/* ) : (
                <div>
                    <h1>Data UnAvaliable!!!</h1>
                </div>
            )} */}
            {ShowModelCard && (
                <CardInfo
                    onClose={() => setShowModalCard(false)}
                    cardValues={cardValue}
                    // tasks={cardValues}
                    // boardId={boardId}
                    updateCard={updateCard}
                    fetchData={fetchData}
                    projectId={projectId}
                    permission={permission}
                    projects={projects}
                    projectNames={projectNames}
                    performDataFetch={performDataFetch}
                    urlId={urlId}
                />
            )}

{showQRCode && (
                        <>
                               <div onClick={()=>setShowQRCode(false)} className='absolute z-[999] bg-black inset-0 bg-opacity-40 h-screen w-full'></div>
                           <div className=' fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-[999] w-[20%] rounded-xl shadow-md shadow-gray-900'>
                                <div className='bg-white flex justify-center flex-col items-center py-10 rounded-xl'>
                                    <h3 className=' text-defaultTextColor text-xl'>Scan the QR</h3>

                            <QRCode value={modifiedUrl}  className=' h-[300px]'/>
                            <div className='flex gap-5 pt-4'>

                            <button className=' small-button h-7 flex items-center' onClick={DownloadQR}>Download</button> 
                            <button className=' bg-slate-200 px-4 py-1 h-7 rounded-xl text-darkTextColor dark:text-gray-950 font-semibold hover:bg-slate-300 text-base flex items-center' onClick={closeQR}>Close</button>
                                </div>
                            </div>
                            </div>
                        </>
                        )}
        </div>
    );
}

export default Dashboard;
