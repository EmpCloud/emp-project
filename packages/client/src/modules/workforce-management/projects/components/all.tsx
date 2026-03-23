import { BiChevronDown } from "react-icons/bi";
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/rules-of-hooks */
import { stripHtml } from 'string-strip-html';
import React, { useEffect, useState,Fragment } from 'react';
import Image from 'next/image';
import Modal from 'react-modal';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';
import { AiOutlineDelete } from '@react-icons/all-files/ai/AiOutlineDelete';
import { BsThreeDotsVertical } from '@react-icons/all-files/bs/BsThreeDotsVertical';
import DeleteConformation from '../../../../components/DeleteConformation';
import DropDown from '../../../../components/DropDown';
import { filterManager, filterMembers, filterOwner, formatedDate } from '../../../../helper/function';
import toast from '../../../../components/Toster/index';
import CreateOrEditProjectModel from './createOrEditProjectModel';
import { deleteAllProject, deleteProjectById } from '../api/delete';
import ToolTip from '../../../../components/ToolTip';
import { getAllProject, getDefaultConfig, searchProject } from '../api/get';
import TinnySpinner from '../../../../components/TinnySpinner';
import { download_data } from '../../../../helper/exportData';
import Filter from './filter';
import EditTableCol from '../../../../components/EditTableCol';
import { BsDownload, BsFiletypeCsv, BsFiletypePdf } from 'react-icons/bs';
import { getAllRoles, getAllUsers, getClientComapny, getClientDetails } from '../../members/api/get';
import SearchInput from '../../../../components/SearchInput';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import { AVTAR_URL, USER_AVTAR_URL } from '../../../../helper/avtar';
import NewToolTip from '../../../../components/NewToolTip';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import router from 'next/router';
import Cookies from 'js-cookie';
import { filterProjectApi } from '../api/post';
import { getAllGroups } from '../../groups/api/get';
import { fetchProfile } from '@WORKFORCE_MODULES/admin/api/get';
import NoSsr from '@COMPONENTS/NoSsr';
import { downloadFiles } from '@HELPER/download';
import { updateScreenConfig } from '../api/put';
import DropDownWithTick from '../../../../components/DropDownWithTick';
// import MemberModal from '../../../../components/MemberModal';
import { updateProjectStatus } from '../api/put';
import NoAccessCard from '@COMPONENTS/NoAccessCard';
import MemberModal from '@COMPONENTS/MemberModal';
import { VscCalendar } from 'react-icons/vsc';
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { ClientReport } from '../api/get';
import { AiFillCloseCircle } from 'react-icons/ai';
import * as XlsxPopulate from "xlsx-populate/browser/xlsx-populate";
import { Popover, Transition } from '@headlessui/react';
import { IoChevronDownCircleOutline } from 'react-icons/io5';
import { Tooltip } from '@material-tailwind/react';
import { height } from '@amcharts/amcharts4/.internal/core/utils/Utils';
import { handleUserClick } from "../../../../helper/function";
import { FloatingOnlySelectfield } from "@COMPONENTS/FloatingOnlySelectfield";
import { ChevronDown } from 'react-feather';

const index = ({ stopLoading, startLoading }) => {
    const [projectTableList, setProjectTableList] = useState(null);
    const [sortTable, setSortTable] = useState({
        skip: 0,
        limit: 10,
        pageNo: 1,
    });
    const [checkBoxData, setCheckBoxData] = useState([]);
    const [dropHeight, setDropHeight] = useState(false)

    const [selectedCheckboxes, setSelectedCheckboxes] = useState({});
    const [selectedProjectCheckboxes, setSelectedProjectCheckboxes] = useState({});
    const [projectDetailsDownload, setProjectDetailsDownload] = useState(null);
    const [projectDetails, setProjectDetails] = useState(null);
    const [projectCount, setProjectCount] = useState(0);
    const [openDeleteModel, setOpenDeleteModel] = useState(false);
    const [openDeleteAllModel, setOpenDeleteAllModel] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState('');
    const [deleteProjectId, setDeleteProjectId] = useState('');
    const [users, setUsers] = useState([]);
    const [groupList, setGroupList] = useState(null);
    const [permission, setPermission] = useState(null);
    const [statusList, setStatusList] = useState(null);
    const [clientDownload, setClientDownlaod] = useState(null);
    const [clientDetails, setClientDetails] = useState(null)
    const [clientDetailsOne, setclientDetailsOne] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [type, setType] = useState(null)
    const [searchKeyword, setSearchKeyword] = useState(null);
    const [roleList, setRoleList] = useState(null);

    const [projectCode, setProjectCode] = useState(false);
    const [projectName, setProjectName] = useState(false);

    // const handleOpenModal = () => {
    //     setIsModalOpen(true);
    // };

    // const handleCloseModal = () => {
    //     setIsModalOpen(false);
    // };

    // Date Picker
    const [isModalOpenDate, setIsModalOpenDate] = useState(false);
    const [selectedRange, setSelectedRange] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection',
        },
    ]);

    const handleOpenModal = () => {
        setIsModalOpenDate(true);
    };

    const handleCloseModal = () => {
        setIsModalOpenDate(false);
    };

    const handleDateChange = (ranges) => {
        // Handle date range selection
        setSelectedRange([ranges.selection]);
    };

    const handleGetAllRoles = () => {
        getAllRoles(`limit=${process.env.TOTAL_USERS}`).then((response) => {
            if (response.data.body.status === "success") {
                setRoleList(
                    response.data.body.data.totalRolesData.map((data) => {
                        return { text: data.roles, value: data.roles };
                    })
                );
            }
        });
    };
    useEffect(() => {
        handleGetAllRoles();
    }, []);


    const checkVisibility = function (type) {
        if (!projectTableList) return false;
        return projectTableList.some(obj => {
            if(obj.value === "userAssigned"){
                obj.value='members'
            }
            if (obj.value === type) {
                return obj.isVisible;
            }
        });
    };
    const handleSelectCol = data => {
        const item = {
            project: [
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
                    handleGetProjectConfig();
                    // toast({
                    //     type: 'success',
                    //     message: result ? result.data.body.message : 'Try again !',
                    // });
                } else {
                    // toast({
                    //     type: 'error',
                    //     message: result ? result.data.body.error : 'Try again !',
                    // });
                    handleGetProjectConfig();
                }
            })
            .catch(function (response) {
                toast({
                    type: 'error',
                    message: response.data ? response.data.body.error : 'Something went wrong, Try again !',
                });
            });
    };

    const handleReset = () => {
        setSearchKeyword('')
        for (const item of projectTableList) {
            let data = {
                project: [
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
        handleGetProjectConfig();
    };

    const handleGetProjectConfig = () => {
        getDefaultConfig().then(response => {
            if (response.data?.body.status === 'success') {
                setProjectTableList(response.data?.body.data.project);
                console.log(response.data?.body.data.project);
                
            }
        });
    };
    const handleGetAllUsers = (condition = '') => {
        getAllUsers(condition).then(response => {
            if (response.data.body.status === 'success') {
                setUsers(
                    response.data.body?.data?.users?.map(data => {
                        return { id: data._id, role: data.role, key: data.firstName + ' ' + data.lastName, value: data };
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
    const handleGetAllComapnyClient = (condition = '') => {
        getClientComapny(condition).then(response => {
            if (response.data.body.status === "success") {
                let clientList = response?.data.body.data.clientDetail.map((d) => {
                    return { text: d.clientCompany, value: d.clientCompany, company: d }
                })
                setClientDetails(clientList);
            }
        })
    }
    useEffect(() => {
        handleGetAllComapnyClient('?limit=' + process.env.TOTAL_USERS);
        handleGetAllProject();
        handleGetAllUsers('?limit=' + process.env.TOTAL_USERS + '&invitationStatus=1'+'&suspensionStatus=false');
        handleGetAllGroup();

        if (Cookies.get('isAdmin') === 'false') {
            handleProfileData();
        }
        handleGetProjectConfig();
    }, []);

    useEffect(() => {
        // document.querySelector('body').classList.add('bodyBg');
    }, [projectTableList]);

    const handleProfileData = () => {
        fetchProfile().then(response => {
            if (response.data?.body.status === 'success') {
                setPermission(response.data.body.data.permissionConfig.project);
            }
        });
    };

    const handleGetAllProject = (condition = '') => {
        getAllProject(condition).then(response => {
            if (response.data?.body.status === 'success') {
                setProjectCount(response.data?.body.data.projectCount);
                setProjectDetails(response.data?.body.data.project);

                if (response.data?.body.status === 'success') {
                    var projectCode = response.data?.body.data.project.map(function (project) {
                        return {
                            text: project.projectCode,
                            value: project.projectCode,
                        };
                    });
                    setProjectCode(projectCode);
                    var projectName = response.data?.body.data.project.map(function (project) {
                        return {
                            text: project.projectName,
                            value: project.projectName,
                        };
                    });
                    setProjectName(projectName);
                }
            }
        });
    };
    const handleSearchProject = (condition = '') => {
        searchProject(condition).then(response => {
            if (response.data.body.status === 'success') {
                setProjectCount(response.data?.body.data.projectCount);
                setProjectDetails(response.data?.body.data.project);
            }
        });
    };
    useEffect(() => {
        if(searchKeyword!==null){
        handleSearchProject('?keyword=' + searchKeyword + '&limit=' + sortTable.limit);
        }
    }, [searchKeyword])

    const handlePaginationProject = condition => {
        // if (type === "search") {
        //     handleSearchProject(condition + '&keyword=' + searchKeyword);
        // } else if (type === "filter") {
        //     handleGetFilterProject(condition)
        // } else {
        //     handleGetAllProject(condition)
        // }



        if (type === "search") {
            if (sortType === 'asc') {
                handleSearchProject(condition +'&keyword=' + searchKeyword + '&orderBy=' + colValue + '&sort=asc')
            } else {
                handleSearchProject(condition+'&keyword=' + searchKeyword + '&orderBy=' + colValue + '&sort=desc')
            }
        } else if (type === "filter") {
            if (sortType === 'asc') {
                handleGetFilterProject(condition+'&orderBy=' + colValue + '&sort=asc')
            } else {
                handleGetFilterProject(condition+'&orderBy=' + colValue + '&sort=desc')
            }
        } else {
            if (sortType === 'asc') {
                handleGetAllProject(condition+'&orderBy=' + colValue + '&sort=asc')
            } else {
                handleGetAllProject(condition+'&orderBy=' + colValue + '&sort=desc')
            }
        }
    };
    const handleDeleteProjectById = () => {
        deleteProjectById(deleteProjectId)
            .then(function (result) {
                stopLoading();
                if (result.data.body.status == 'success') {
                    toast({
                        type: 'success',
                        message: result ? result.data.body.message : 'Try again !',
                    });
                    if(type === "search"){
                        handleSearchProject('?keyword=' + searchKeyword +'&limit=' + sortTable.limit + "&skip=" + sortTable.skip);
                    }else
                        if(type === "filter"){
                            handleGetFilterProject('?limit=' + sortTable.limit + "&skip=" + sortTable.skip)
                        }else
                            handleGetAllProject('?limit=' + sortTable.limit + "&skip=" + sortTable.skip);                } else {
                    toast({
                        type: 'error',
                        message: result ? result.data.body.message : 'Error',
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
        setOpenDeleteModel(false);
    };
    const [colValue,setcolValue]=useState('');
    const [sortType,setsortType] = useState('asc');
    const handleShorting = (sortType: string, colName: any, colValue: string) => {
        setProjectTableList((current: any[]) =>
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
        setcolValue(colValue);
        setsortType(sortType);
        // if (type === "search") {
        //     if (sortType === 'asc') {
        //         handleSearchProject('?keyword=' + searchKeyword + '&orderBy=' + colValue + '&sort=asc')
        //     } else {
        //         handleSearchProject('?keyword=' + searchKeyword + '&orderBy=' + colValue + '&sort=desc')
        //     }
        // } else if (type === "filter") {
        //     if (sortType === 'asc') {
        //         handleGetFilterProject('?orderBy=' + colValue + '&sort=asc')
        //     } else {
        //         handleGetFilterProject('?orderBy=' + colValue + '&sort=desc')
        //     }
        // } else {
        //     if (sortType === 'asc') {
        //         handleGetAllProject('?orderBy=' + colValue + '&sort=asc')
        //     } else {
        //         handleGetAllProject('?orderBy=' + colValue + '&sort=desc')
        //     }

        // }

    };
    const handleCheckData = (id: any) => {
        projectDetails &&
            projectDetails.some(({ project }) => {
                if (project._id === id) {
                    return true;
                }
                return false;
            });
    };
    const handleCheckbox = (event: { preventDefault: () => void; target: { value: string; checked: any } }) => {
        event.preventDefault();
        if (event.target.value === 'all') {
            var allIds = projectDetails.map(function ({ project }) {
                return project._id;
            });
        }
        var checkList = [...checkBoxData];
        let updatedList = [];
        if (event.target.checked) {
            updatedList = [...checkList, event.target.value];
        } else {
            updatedList.splice(checkList.indexOf(event.target.value), 1);
        }
        setCheckBoxData(updatedList);
    };

    const propertiesToKeep = [
        'projectName',
        'projectCode',
        'description',
        'startDate',
        'endDate',
        'actualBudget',
        'plannedBudget',
        'taskCount',
        'userAssigned',
        'progress',
        'clientCompany',
        'clientName',
        'currencyType',
        'reason',

    ]; // Add the properties you want to keep here
    const GroupFilterData = projectDetailsDownload?.map(item => {
        const filteredItem = {};
        propertiesToKeep.forEach(property => {
            if (item.hasOwnProperty(property)) {
                filteredItem[property] = item[property];
            }
        });
        return filteredItem;
    });

    let FinalDownloadData = GroupFilterData?.map(data => {
        let managers = data.userAssigned
            ?.filter(function ({ role }) {
                return role === 'manager';
            })
            .map(data => data.firstName + ' ' + data.lastName)
            .join(', ');

        if (!managers) {
            managers = 'Not Assigned';
        }
        let owners = data.userAssigned
            ?.filter(function ({ role }) {
                return role === 'owner';
            })
            .map(data => data.firstName + ' ' + data.lastName)
            .join(', ');

        if (!owners) {
            owners = 'Not Assigned';
        }
        let members = data.userAssigned
            ?.filter(function ({ role }) {
                return role === 'member';
            })
            .map(data => data.firstName + ' ' + data.lastName)
            .join(', ');

                    if (!members) {
            members = 'Not Assigned';
        }

        const maxDescriptionLength = 25;
        const descriptionText = data.description;
        const descriptionChunks = [];
        for (let i = 0; i < descriptionText?.length; i += maxDescriptionLength) {
            descriptionChunks.push(descriptionText?.substring(i, i + maxDescriptionLength));
        }
        const formattedDescription = descriptionChunks.join('\n');
        filterMembers(data.userAssigned)?.filter(function ({ role }) {
            return role === 'member';
        }).length == 0 && <>Not Assigned</>;

        function stripHtml(inputString) {
            // HTML tag pattern to match
            const htmlPattern = /<[^>]*>/g;

            // Remove HTML tags using the pattern
            return inputString.replace(htmlPattern, '');
        }


        function removeEmojis(inputString) {
            const emojiPattern = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2B50}\u{2B06}\u{2934}\u{2935}\u{25AA}\u{25AB}\u{25FE}\u{25FD}\u{25FB}\u{25FC}\u{25B6}\u{25C0}\u{1F004}\u{1F0CF}\u{1F18E}\u{1F191}-\u{1F19A}\u{2B05}\u{2B06}\u{2B07}\u{2B50}\u{2B55}\u{2934}\u{2935}\u{2B05}\u{2B06}\u{2B07}\u{2B50}\u{2B55}\u{3030}\u{303D}\u{3297}\u{3299}]/gu;
            return inputString.replace(emojiPattern, '');
        }
        const descriptionString = String(data.description);

        const sanitizedDescription = stripHtml(descriptionString);

        const finalDescription = removeEmojis(sanitizedDescription);

        const displayText = finalDescription !== null ? finalDescription : '--';
        return {
            'Project Name': data.projectName,
            'Project Code': data.projectCode,
            Description:displayText ,
            'Start Date': formatedDate(data.startDate),
            'End Date': formatedDate(data.endDate),
            Owner: owners,
            ' Manager ': managers,
            'Actual Budget':data.currencyType +' '+ data.actualBudget,
            'Planned Budget':data.currencyType +' '+ data.plannedBudget,
            'Tasks ': data?.taskCount ?? '0',
            'Assign Members': members,
            Progress: data.progress + '%',
            'Client Company': Array.isArray(data.clientCompany) && data.clientCompany.length > 0 ? data.clientCompany.map(company => company.key).join(', '): 'Not Assigned',
            'Client Name':Array.isArray(data.clientCompany) && data.clientCompany.length > 0 ? data?.clientCompany.filter(item => !item.key).map(company => company?.clientName).join(','): 'Not Assigned',
            "Reason":data.reason ? data.reason : '   ---' ,
        };
    });
  

    const download_data = [
        {
            text: 'Download CSV file',
            value: 'excel',
            onClick: () => {
                if (projectDetails.length === 0) {
                    toast({
                        type: 'error',
                        message: 'Please add data before downloading.',
                    });
                } else {
                    downloadFiles('excel', 'Projects',FinalDownloadData );
                }
            },
        },
        {
            text: 'Download PDF file',
            value: 'pdf',
            onClick: () => {
                if (projectDetails.length === 0) {
                    toast({
                        type: 'error',
                        message: 'Please add data before downloading.',
                    });
                } else {
                    downloadFiles('pdf', 'Projects', FinalDownloadData);
                }
            },
        },
    ];

    const handleDeleteAllProject = () => {
        startLoading();
        deleteAllProject()
            .then(function (result) {
                stopLoading();
                if (result.data.body.status == 'success') {
                    handleGetAllProject();
                    setSortTable({
                        skip: 0,
                        limit: 10,
                        pageNo: 1,
                    })
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
                stopLoading();
            })
            .catch(function (e) {
                stopLoading();
                toast({
                    type: 'error',
                    message: e.response ? e.response.data.body.message : 'Something went wrong, Try again !',
                });
            });
        setOpenDeleteAllModel(false);
    };
    const [filterData, setFilterData] = useState(null);

    const handleFiterData = (data) => {
        setFilterData(data);
        setSortTable({
            skip: 0,
            limit: 10,
            pageNo: 1,
        });
    }
    const handleGetFilterProject = (condition = "") => {
        // event.preventDefault();
        if (!filterData) return false;
        const filteredData = {
            ...filterData,
            user: filterData.user.map(d => {
                return { id: d._id };
            }),
            manager: filterData.manager.map(d => {
                return { id: d._id };
            }),
            sponsor: filterData.sponsor.map(d => {
                return { id: d._id };
            }),
            owner: filterData.owner.map(d => {
                return { id: d._id };
            }),
        };
        filterProjectApi(condition, filteredData)
            .then(response => {
                if (response.data.body.status === 'success') {
                    setProjectDetails(response.data?.body.data.project);
                    setProjectCount(response.data?.body.data.projectCount);
                    setType("filter")
                } else {
                    //message
                    toast({
                        type: 'error',
                        message: response ? response.data.body.message : 'Try again !',
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
    };
    useEffect(() => {
        // if (type === "search") {
        //     handleSearchProject('?limit=' + sortTable.limit)
        // } else
        //     if (type === "filter") {
        //         handleGetFilterProject('?limit=' + sortTable.limit)
        //     } else{
        //         handleGetAllProject('?limit=' + sortTable.limit);
        //     }



        if (type === "search") {
            if (sortType === 'asc') {
                handleSearchProject('?keyword=' + searchKeyword + '&orderBy=' + colValue + '&sort=asc&limit=' + sortTable.limit)
            } else {
                handleSearchProject('?keyword=' + searchKeyword + '&orderBy=' + colValue + '&sort=desc&limit=' + sortTable.limit)
            }
        } else if (type === "filter") {
            if (sortType === 'asc') {
                handleGetFilterProject('?orderBy=' + colValue + '&sort=asc&limit=' + sortTable.limit)
            } else {
                handleGetFilterProject('?orderBy=' + colValue + '&sort=desc&limit=' + sortTable.limit)
            }
        } else {
            if (sortType === 'asc') {
                handleGetAllProject('?orderBy=' + colValue + '&sort=asc&limit=' + sortTable.limit)
            } else {
                handleGetAllProject('?orderBy=' + colValue + '&sort=desc&limit=' + sortTable.limit)
            }
        }





    }, [sortTable.limit,colValue,sortType]);

    useEffect(() => {
        handleGetFilterProject("?limit=10")
    }, [filterData]);

    const bulkAction = [
        {
            text: 'Delete all',
            value: 2,
            onClick: (event, value, data, name) => {
                if (projectDetails.length === 0) {
                    toast({
                        type: 'error',
                        message: 'Please add data before deleting.',
                    });
                } else {
                    setOpenDeleteAllModel(!openDeleteAllModel);
                }
            },
        },
    ];
    const statusDetails = [
        { name: 'Todo', text: 'Todo', value: 'Todo' },
        { name: 'Done', text: 'Todo', value: 'Done' },
        { name: 'Inprogress', text: 'Inprogress', value: 'Inprogress' },
        { name: 'Pending', text: 'Pending', value: 'Pending' },
        { name: 'Review', text: 'Review', value: 'Review' },
    ];
    const handleAssignRole = (e, id, selectedData) => {
        {Cookies.get('isAdmin') === 'true' || permission && permission?.edit === true ?
                updateProjectStatus({ status: e.value }, selectedData._id)
                    .then(response => {
                        if (response.data?.body.status === 'success') {
                            if(type === "search"){
                                handleSearchProject('?keyword=' + searchKeyword +'&limit=' + sortTable.limit + "&skip=" + sortTable.skip);
                            }else
                                if(type === "filter"){
                                    handleGetFilterProject('?limit=' + sortTable.limit + "&skip=" + sortTable.skip)
                                }else
                                    handleGetAllProject('?limit=' + sortTable.limit + "&skip=" + sortTable.skip);
                            toast({
                                type: 'success',
                                message: response.data.body.message,
                            });
                        } else {
                            toast({
                                type: 'error',
                                message: response.data?.body.message,
                            });
                        }
                    }): toast({
                        type: 'error',
                        message: `You don't have the Permission to Change the Status`,
                    })

        }
    };

    function makeHttpLinksClickable(description, maxURLLength = 20) {
        const urlRegex = /(https?:\/\/[^\s/$.?#].[^\s]*)/gi;
        const convertedDescription = description?.replace(urlRegex, url => {
            let truncatedURL = url;
            if (url.length > maxURLLength) {
                truncatedURL = url.substring(0, maxURLLength) + '...';
                const nextCharIndex = maxURLLength + 3;
                if (nextCharIndex < url.length && url.charAt(nextCharIndex) !== ' ') {
                    truncatedURL += ' ';
                }
            }
            return `<a href="${url}" target="_blank" style="color: blue">${truncatedURL}</a>`;
        });

        return convertedDescription;
    }

    const [customisedProjectList , setCustomisedProjectList]=useState(null)
    const handleGetAllProjectDownload = (condition = '?limit=' + process.env.TOTAL_USERS) => {
        getAllProject(condition).then(response => {
            if (response.data?.body.status === 'success') {
                setProjectDetailsDownload(response.data?.body.data.project);
                let customisedProjectList = response.data?.body.data.project.map(item => {
                    return {
                        name: item.projectName,
                        text: item.projectName,
                        value: item._id,
                    };
                });
                setCustomisedProjectList(customisedProjectList);
            }
        });
    };
    useEffect(() => {
        handleGetAllProjectDownload('?limit=' + process.env.TOTAL_USERS);
    }, []);

    const [companyDetails ,setCompanyDetails] =useState(null);

    const [companyListOne ,setCompanyList]=useState(null);
    const [selectedCompnay ,setSelectedCompnay]=useState(null);
    const [compnayName ,setCompnayName]=useState(null);
    const [companyId ,setCompanyId]=useState(null);
    const handleGetAllComapny = (condition = '') =>{
        getClientDetails(condition).then(response =>{
            if(response.data.body.status === "success"){
                setCompanyDetails(response?.data.body.data.companyDetail);
                let projectList = response.data?.body.data.companyDetail.map(item => {
                    return {
                        name: item.clientCompany,
                        text: item.clientCompany,
                        value: item._id,
                    };
                });
                setCompanyList(projectList);
                setSelectedCompnay(projectList[0] ? projectList[0] : []);
                setCompnayName(projectList[0]?.name ? projectList[0]?.name : null);
        
                    }
        })
    }

    const filterMember = _id => {
        if (!companyListOne) return false;
        let taskTemp = companyListOne.filter(item => item.value == _id);
        if (taskTemp.length != 0) {
            setCompanyId(taskTemp[0].value)
        }
    }

    // useEffect(() => {
    //     handleGetAllComapny('?limit=' + process.env.TOTAL_USERS);
    // }, []);


    const clientReportDownload = (condition) => {
        ClientReport(condition).then(response => {
            if (response.data?.body.status === 'success') {
                setClientDownlaod(response.data?.body.data);
            }
        });
    }

    useEffect(() => {
        if (companyId !== null){
            clientReportDownload('?startDate=' + startDate + '&endDate=' + endDate)
        } else {
            if (companyListOne !== null) {
                clientReportDownload('?startDate=' + startDate + '&endDate=' + endDate)
            }
        }
        handleGetAllComapny('?limit=' + process.env.TOTAL_USERS);
    }, [selectedRange, projectDetails, companyId]);

    const handleCheckboxChange = (event) => {
       
        const { name, checked } = event.target;
       
        setSelectedCheckboxes((prevState) => ({
          ...prevState,
          [name]: checked,
        }));
      };

      const handleProjectCheckboxChange = (event) => {
       
        const { name, checked } = event.target;
       
        setSelectedProjectCheckboxes((prevState) => ({
          ...prevState,
          [name]: checked,
        }));
      };

    const exportToCSVTwo = () => {
        const fileType =
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        const fileExtension = ".xlsx";

        const finalData = [];



        let serialNumber = 1; // Initialize the serial number

        clientDownload.forEach((client) => {
            const clientCompany = client["clientCompany"];
            const projects = client["project"];
            if (projects.length > 0) {
                finalData.push({

                });
                finalData.push({
                    "Sl. No": serialNumber,
                    "Company Name": clientCompany,
                });

                serialNumber++;

                if (projects !== undefined) {
                    projects.forEach((project) => {
                        const projectName = project.project.projectName;
                        const startDate = formatedDate(project.project.startDate);
                        const endData = formatedDate(project.project.startDate);
                        const status = project.project.status;
                        const assignedToField =
                            project.project?.userAssigned?.map(
                                (dataItem) => `${dataItem.firstName} ${dataItem.lastName}`
                            ).join(", ") || "Not Assigned";

                        finalData.push({
                            "Sl. No": "",
                            "Company Name": "",
                            "projectName": projectName,
                            "Start Date": startDate,
                            "End Data": endData,
                            "Status": status,
                            "Assign Members": assignedToField,
                        });
                    });
                }
            }
        });

        // Convert the finalData array to an Excel sheet
        const ws = XLSX.utils.json_to_sheet(finalData);
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, "download" + fileExtension);
    };
    function formatToCustomDate(inputDate) {
        const originalDate = new Date(inputDate);

        const year = originalDate.getFullYear();
        const month = originalDate.getMonth() + 1; // Months are 0-based, so we add 1
        const day = originalDate.getDate();


        const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        return formattedDate;
    }

    const startDate = formatToCustomDate(selectedRange[0].startDate)
    const endDate = formatToCustomDate(selectedRange[0].endDate)



    const data =[{}]
    const createDownLoadData = () => {
        handleExport().then((url) => {
            const downloadAnchorNode = document.createElement("a");
            downloadAnchorNode.setAttribute("href", url);
            downloadAnchorNode.setAttribute("download", "Company-wise_report.xlsx");
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

        const blob = new Blob([s2ab(wbout)], {
            type: "application/octet-stream",
        });

        return blob;
    };

    const s2ab = (s) => {

        const buf = new ArrayBuffer(s.length);

        const view = new Uint8Array(buf);
        for (let i = 0; i !== s.length; ++i) {
            view[i] = s.charCodeAt(i);
        }

        return buf;
    };

    const handleExport = () => {
        const title = [{ A: "Company wise download" +'  from  '+startDate +'  to   ' + endDate }, {}];
      
        let table1 = [
          {
            A: "Sl.No",
            B: "Compnay Names",
            C: "Client Names",
            D: "Project Names",
            E: "Start Date",
            F: "End Data",
            G: "Status",
            H: "Assign Members",
            I: 'Actual Budget',
            J: 'Planned Budget',
          }
        ];

        let serialNumber = 1;
        let previousCompany = null;
    
        data.forEach((row) => {
            filteredCompanyDetails && filteredCompanyDetails.forEach((client) => {
              const clientCompanyNames = Array.isArray(client.clients) && client.clients.length > 0 ? client.clients.map(company => company.clientName).join(', ') : 'Not Assigned';
          
              const projects = client.project;
          
              const clientCompany = clientCompanyNames || 'N/A';
              const clients = client.clientCompany;
          
              if (projects.length > 0) {
                projects.forEach((project) => {
                  const projectName = project.project?.projectName || 'N/A';
                  const startDate = formatedDate(project.project?.startDate || 'N/A');
                  const endData = formatedDate(project.project?.endDate || 'N/A');
                  const status = project.project?.status || 'N/A';
                  const actualBudget = project.project?.currencyType + '  ' + project.project?.actualBudget || 'N/A';
                  const plannedBudget = project.project?.currencyType + '  ' + project.project?.plannedBudget || 'N/A';
                  const assignedToField = project.project?.userAssigned?.map(
                    (dataItem) => `${dataItem.firstName} ${dataItem.lastName}`
                  ).join(", ") || "Not Assigned" || 'N/A';
          
                  if (clients !== previousCompany) {
                    table1.push({
                     A: serialNumber++,
                      B: clients,
                      C: clientCompany,
                      D: projectName,
                      E: startDate,
                      F: endData,
                      G: status,
                      H: assignedToField,
                      I: actualBudget,
                      J: plannedBudget,
                    });
                    previousCompany = clients;
                  } else {
                  
                    table1.push({
                      A: " ",
                      B: " ",
                      C: clientCompany,
                      D: projectName,
                      E: startDate,
                      F: endData,
                      G: status,
                      H: assignedToField,
                      I: actualBudget,
                      J: plannedBudget,
                    });
                  }
                });
              } else {
                table1.push({
                  A: serialNumber++,
                  B: clients,
                  C: clientCompany,
                  D: 'N/A',
                  E: 'N/A',
                  F: 'N/A',
                  G: 'N/A',
                  H: 'N/A',
                  I: 'N/A',
                  J: 'N/A',
                });
                previousCompany = clients;
              }
            });
          });
          
      
        table1 = [{ A: " " }].concat(table1);
           // .concat([""])
        // .concat([{ A: "Project and Task Details" }])
        // .concat(table2);
      
        const finalData = [...title, ...table1];
      
        const wb = XLSX.utils.book_new();
        const sheet = XLSX.utils.json_to_sheet(finalData, {
          skipHeader: true,
        });
        XLSX.utils.book_append_sheet(wb, sheet, "Task_report");
      
        const workbookBlob = workbook2blob(wb);
      
        var headerIndexes = [];
        finalData.forEach((data, index) =>
        //   data["A"] === "" ? headerIndexes.push(index) : null
         data["A"] === "Sl.No" ? headerIndexes.push(index) : null
        );
      
        const totalRecords = data.length;
      
        const dataInfo = {
          titleCell: "A2",
          titleRange: "A1:H2",
          tbodyRange: `A3:H${finalData.length}`,
          theadRange:
            headerIndexes?.length >= 1
              ? `A${headerIndexes[0] + 1}:J${headerIndexes[0] + 1}`
              : null,
          theadRange1:
            headerIndexes?.length >= 2
              ? `A${headerIndexes[1] + 1}:I${headerIndexes[1] + 1}`
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

                sheet.column("A").width(10);
                sheet.column("B").width(25);
                sheet.column("C").width(45);
                sheet.column("D").width(45);
                sheet.column("E").width(45);
                sheet.column("F").width(15);
                sheet.column("G").width(55);
                sheet.column("H").width(45);
                sheet.column("I").width(15);
                sheet.column("J").width(15);

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

                //   if (dataInfo.tFirstColumnRange) {
                //     sheet.range(dataInfo.tFirstColumnRange).style({
                //       bold: true,
                //     });
                //   }

                //   if (dataInfo.tLastColumnRange) {
                //     sheet.range(dataInfo.tLastColumnRange).style({
                //       bold: true,
                //     });
                //   }

                //   if (dataInfo.tFirstColumnRange1) {
                //     sheet.range(dataInfo.tFirstColumnRange1).style({
                //       bold: true,
                //     });
                //   }

                //   if (dataInfo.tLastColumnRange1) {
                //     sheet.range(dataInfo.tLastColumnRange1).style({
                //       bold: true,
                //     });
                //   }
            });

            return workbook
                .outputAsync()
                .then((workbookBlob) => URL.createObjectURL(workbookBlob));
        });
    }

    const handleSelectAllChange = (event) => {
        const { checked } = event.target;
        const updatedSelectedCheckboxes = {};

        companyListOne.forEach((d) => {
          updatedSelectedCheckboxes[d.name] = checked;
        });

        setSelectedCheckboxes(updatedSelectedCheckboxes);
    };

    const selectedKeys = Object.keys(selectedCheckboxes).filter((key) => selectedCheckboxes[key]);
    const areAllCheckboxesSelected = Object.values(selectedCheckboxes).every(Boolean);
    const filteredCompanyDetails = clientDownload && clientDownload?.filter(item => selectedKeys?.includes(item?.clientCompany));

    const handleSelectAllChangeProject = (event) => {
        const { checked } = event.target;
        const updatedSelectedCheckboxesProject = {};

        customisedProjectList.forEach((d) => {
            updatedSelectedCheckboxesProject[d.name] = checked;
        });

        setSelectedProjectCheckboxes(updatedSelectedCheckboxesProject);
    };
    const areAllCheckboxesSelectedProjects = Object.values(selectedProjectCheckboxes).every(Boolean);

    const selectedProjectKeys = Object.keys(selectedProjectCheckboxes).filter((key) => selectedProjectCheckboxes[key]);
    // const areAllCheckboxesSelected = Object.values(selectedCheckboxes).every(Boolean);
    const filteredProjectDetails = FinalDownloadData && FinalDownloadData?.filter(item => selectedProjectKeys?.includes( item['Project Name']));
    return (
        <>
        <NoSsr>
            {permission && permission.view === false ? (
                <NoAccessCard />
            ) : (
                <>
                    <div className='flex justify-between flex-wrap mb-2 md:-mt-6'>
                        <h2 id='step1' className='heading-big relative mb-0 heading-big font-semibold text-darkTextColor px-2 py-1'>
                            Projects
                            <span className='absolute top-0 -right-3 inline-flex items-center justify-center mr-2 font-bold leading-none transform translate-x-1/2 -translate-y-1/2 bg-[#0685D7] text-indigo-100 text-sm text-center ml-1 px-2 py-1 rounded-full dark:bg-[#0685D7] border border-[#0685D7]'>
                                {projectCount}
                            </span>
                        </h2>
                        <div className='flex items-center flex-wrap gap-2'>
                            <div className='relative'>
                                <NoSsr>
                                    {(permission && permission?.create === true) || Cookies.get('isAdmin') === 'true' ? (
                                        <CreateOrEditProjectModel
                                            type={undefined}
                                            data={undefined}
                                            {...{
                                                users,
                                                handleGetAllUsers,
                                                handleGetAllGroup,
                                                handleGetAllProject,
                                                startLoading,
                                                stopLoading,
                                                groupList,
                                                sortTable,
                                                setSortTable,
                                                clientDetails,
                                                roleList
                                            }}
                                        />
                                    ) : (
                                        <></>
                                    )}
                                </NoSsr>
                            </div>

                            {/* <Popover className="relative">
                                {({ open }) => (
                                    <>
                                    {Cookies.get('adminPermission') === "true" || Cookies.get('isAdmin') === "true" ? (
                                        <Popover.Button
                                        className={`
                                            ${open ? '' : 'text-opacity-90'}
                                            inline-flex gap-2 h-8 items-center focus:border-none small-button
                                        `}
                                        >
                                        Company wise Download
                                        <ChevronDown
                                            className={`${open ? '' : 'text-opacity-70'}
                                            h-4 w-4 text-orange-300 text-white transition dark:text-[#fff] duration-150 ease-in-out group-hover:text-opacity-80`}
                                            aria-hidden="true"
                                        />
                                        </Popover.Button>
                                    ) : ''}
                                    <Transition as={Fragment}>
                                        <Popover.Panel className="absolute -left-8 text-base z-50 mt-3 max-w-sm px-2 sm:px-0 lg:max-w-3xl">
                                        <div className="py-3 px-2 w-[10rem] flex justify-center flex-col items-start bg-white rounded-lg shadow-lg">
                                            <div>
                                            <button
                                                onClick={handleOpenModal}
                                                className="flex justify-between gap-2 items-center py-1 bg-white hover:bg-slate-200 dark:hover:bg-slate-800 dark:text-[#fff] rounded px-4"
                                            >
                                                <span><VscCalendar className="text-xl" /></span>
                                                Set Duration
                                            </button>
                                            <Modal
                                                isOpen={isModalOpen}
                                                onRequestClose={handleCloseModal}
                                                className="relative flex justify-center items-center h-[100vh] rounded modal-bg"
                                            >
                                                <div className="bg-white px-10 py-6 rounded-xl shadow-md shadow-black">
                                                <DateRangePicker
                                                    onChange={handleDateChange}
                                                    showSelectionPreview={true}
                                                    moveRangeOnFirstSelection={false}
                                                    months={2}
                                                    ranges={selectedRange}
                                                    direction="horizontal"
                                                    className="rounded-xl"
                                                />
                                                <div className="flex justify-center gap-4">
                                                    <button className="small-button h-8 flex items-center" onClick={handleCloseModal}>
                                                    Done
                                                    </button>
                                                    <button
                                                    onClick={handleCloseModal}
                                                    className="px-4 py-1 rounded-full font-bold text-white hover:bg-red-600 bg-red-500 h-8 flex items-center"
                                                    >
                                                    Cancel
                                                    </button>
                                                </div>
                                                </div>
                                            </Modal>
                                            </div>
                                            <div className="py-1 bg-white relative cursor-pointer">
                                            <Popover className="relative">
                                                <Popover.Button>
                                                <button className="gap-2 flex justify-between items-center rounded outline-none focus:hidden hover:bg-slate-200 dark:hover:bg-slate-800 dark:text-[#fff] px-4 py-1">
                                                    <span><BsFiletypeCsv className="text-xl" /></span>
                                                    Download CSV
                                                </button>
                                                </Popover.Button>
                                                <Popover.Panel>
                                                <div className="flex flex-col ps-10 mt-1 dark:text-gray-50 overflow-y-auto h-[10rem]">
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
                                                    {companyListOne && companyListOne.map((d, index) => (
                                                    <label key={index} className="py-1">
                                                        <input
                                                        type="checkbox"
                                                        name={d.name}
                                                        id={`checkbox-${index}`}
                                                        className="border mr-2"
                                                        checked={selectedCheckboxes[d.name] || false}
                                                        onChange={handleCheckboxChange}
                                                        />
                                                        <NewToolTip direction="top" message={d.name}>
                                                        {d.name.length > 10 ? `${d.name.substring(0, 10)}..` : d.name}
                                                        </NewToolTip>
                                                    </label>
                                                    ))}
                                                </div>
                                                <div className="flex justify-center mt-2">
                                                    <button className="small-button h-7 flex justify-center items-center" onClick={createDownLoadData}>
                                                    Download
                                                    </button>
                                                </div>
                                                </Popover.Panel>
                                            </Popover>
                                            </div>
                                            <div className="py-1 bg-white"></div>
                                        </div>
                                        </Popover.Panel>
                                    </Transition>
                                    </>
                                )}
                            </Popover> */}
                            <Modal
                                isOpen={isModalOpenDate}
                                onRequestClose={handleCloseModal}
                                // contentLabel="Date Picker Modal"
                                className=" relative flex justify-center items-center h-screen rounded"
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
                                    <div className=' flex gap-4 justify-center'>
                                        <div className='flex justify-center py-3'>
                                            <button className=' small-button h-9 flex items-center' onClick={handleCloseModal} >
                                                Done
                                            </button>
                                        </div>
                                        <div className=' flex justify-center py-3'>
                                            <button onClick={handleCloseModal} className='px-4 py-1 rounded-full font-bold text-white hover:bg-red-600 bg-red-500 h-9 flex items-center'>  Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Modal>

                            {projectDetails && projectDetails.length > 0 && (
                                <div className='relative'>
                                    <NewToolTip direction='top' message={"Download"}>
                                        {/* <DropDown
                                            data={download_data}
                                            name={'projectList'}
                                            downloadData={
                                                projectDetails &&
                                                projectDetails.map(function (project) {
                                                    return project;
                                                })
                                            }
                                            icon={
                                                <span className='text-xl dark:text-[#fff] grey-link border bg-white px-2 py-1 rounded-lg'>
                                                    <BsDownload />
                                                </span>
                                            }
                                            getData={undefined}
                                        /> */}
                                          <Popover className="relative">
                                {({ open }) => (
                                    <>
                                        <Popover.Button
                                            className={`
                ${open ? '' : 'text-opacity-90'}
                 inline-flex gap-2 h-8 items-center focus:border-none small-button  `}
                                        >
                                          Project  Download
                                                 {/* <DropDown
                                            data={download_data}
                                            name={'projectList'}
                                            downloadData={
                                                projectDetails &&
                                                projectDetails.map(function (project) {
                                                    return project;
                                                })
                                            }
                                            icon={
                                                <span className='text-xl dark:text-[#fff] grey-link border bg-white px-2 py-1 rounded-lg'>
                                                    <BsDownload />
                                                </span>
                                            }
                                            getData={undefined}
                                        /> */}
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
                                                        {/* <button onClick={handleOpenModal} className='flex justify-between gap-2 items-center py-1 bg-white  hover:bg-slate-200 dark:hover:bg-slate-800 dark:text-[#fff] rounded px-4'>
                                                        <span><VscCalendar className=' text-xl'/></span>
                                                            Set Duration
                                                        </button> */}
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
                                                            {/* {!isButtonDisabled ?( */}
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
                                                            // checked={areAllCheckboxesSelectedProjects}
                                                            onChange={handleSelectAllChangeProject}
                                                            />
                                                            Select All
                                                        </label>
                                                        {customisedProjectList && customisedProjectList.map((d, index) => (
                                                            <label key={index} className='py-1'>
                                                            <input type="checkbox" name={d.name} id={`checkbox-${index}`} className='border mr-2' checked={selectedProjectCheckboxes[d.name] || false}
                                                                onChange={handleProjectCheckboxChange} />
                                                            {d.name}
                                                            </label>
                                                        ))}
                                                        </div>
                                                        <div className='flex justify-center mt-2'>
                                                        <button className='small-button h-7 flex justify-center items-center' onClick={()=>{ downloadFiles('excel', 'Projects',filteredProjectDetails )}}>Download</button>
                                                        </div>
                                                        </Popover.Panel>
                                                        </Popover>
                                                       
                                                    </div>
                                                    {/* ):null} */}
                                                    {/* {!isButtonDisabled ?( */}
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
                                                            // checked={areAllCheckboxesSelectedProjects}
                                                            onChange={handleSelectAllChangeProject}
                                                            />
                                                            Select All
                                                        </label>
                                                                      {customisedProjectList && customisedProjectList.map((d, index) => (
                                                                    <label key={index}  className='py-1'>
                                                                    <input type="checkbox" name={d.name} id={`checkbox-${index}`} className='border mr-2' checked={selectedProjectCheckboxes[d.name] || false}
                                                                        onChange={handleProjectCheckboxChange} />
                                                                    {d.name}
                                                                    </label>
                                                                    ))}
                                                                    </div>
                                                                    <div className='flex justify-center'>
                                                                    <button className='small-button h-7 flex justify-center items-center' onClick={()=>{ downloadFiles('pdf', 'Projects',filteredProjectDetails )}}>Download</button>
                                                                    </div>
                                                        </Popover.Panel>
                                                        </Popover>
                                                        
                                                    </div>
                                                    {/* ):null} */}
                                                </div>
                                            </Popover.Panel>
                                        </Transition>
                                    </>
                                )}
                            </Popover>
                                    </NewToolTip>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className='rounded-xl shadow-md shadow-gray-200 dark:shadow-gray-950 bg-white py-4 px-4 md:px-7 mb-4 h-fit'>
                        <div className='flex justify-between items-center flex-wrap gap-2'>
                            <h3 className='heading-medium'>
                                <div className='flex items-center'>
                                    <p className='p-0 m-0 text-lightTextColor dark:!text-[#fff] text-base'>Show</p>
                                    <select
                                        value={sortTable.limit}
                                        onChange={event => {
                                            setSortTable({ ...sortTable, limit: event.target.value, pageNo: 1 });
                                        }}
                                        className='border py-1 rounded-md outline-none dark:bg-gray-900 w-16 text-sm px-2 mx-1'>
                                        <option className="dark:text-[#fff]" value={10}>10</option>
                                        <option className="dark:text-[#fff]" value={25}>25</option>
                                        <option className="dark:text-[#fff]" value={50}>50</option>
                                        <option className="dark:text-[#fff]" value={100}>100</option>
                                        <option className="dark:text-[#fff]" value={500}>500</option>
                                    </select>
                                    <p className='p-0 m-0 text-lightTextColor dark:text-[#fff] text-base'>Entries</p>
                                </div>
                            </h3>
                            <div className='flex items-center gap-2'>
                                <div className='flex items-center justify-end  flex-wrap gap-2' id='step2'>
                                    <SearchInput
                                        onChange={(event) => {
                                            setSearchKeyword(event.target.value);
                                            setType("search")
                                            setSortTable({ skip: 0, limit: 10, pageNo: 1 })
                                        }}
                                        placeholder={'Search a project'}
                                        value={searchKeyword}
                                    />
                                    <div className='relative'>
                                        <Filter {...{ users, setType, handleGetAllProject, handleGetAllUsers, handleGetFilterProject, handleFiterData, startLoading, stopLoading ,setProjectName,projectName,projectCode,setProjectCode,setSearchKeyword}} />
                                    </div>
                                    {/* <div className='relative mr-3'>
                                        <Filter type={'reset'} {...{ handleGetAllProject }}  />
                                    </div> */}
                                    <EditTableCol handleReset={handleReset} data={projectTableList} checkVisibility={checkVisibility} {...{ handleSelectCol }} />
                                    <NewToolTip message={"More"}>

                                        <DropDown
                                            data={bulkAction}
                                            defaultValue={''}
                                            icon={
                                                <span className='text-xl dark:text-[#fff] grey-link'>
                                                    <BsThreeDotsVertical />
                                                </span>
                                            }
                                            getData={undefined}
                                        />
                                    </NewToolTip>
                                </div>
                            </div>
                        </div>
                        <div className='mt-5 overflow-x-scroll relative shadow-md min-h[10vh] min-h-[70vh] lg:min-h-[48vh] xl:min-h-[56vh] 2xl:min-h-[70vh] max-h-[70vh] lg:max-h-[40vh] xl:max-h-[40vh] 2xl:max-h-[70vh]'>
                            <table className='table-style w-full'>
                                <thead className='!border-b-0 sticky top-0 z-40'>
                                    <tr className='text-gray-700 uppercase bg-blue-300 dark:bg-gray-700 dark:text-gray-400 rounded-t-lg'>
                                        {projectTableList &&
                                            projectTableList.map(function (
                                                data: {
                                                    isVisible: any;
                                                    sort: string;
                                                    name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal;
                                                    value: any;
                                                },
                                                key: React.Key
                                            ) {
                                                return (
                                                    <>
                                                        {data.isVisible && (
                                                            <th
                                                                key={key}
                                                                className={`text-base ${data.name === 'Description' ? 'w-[290px]' : 'w-[190px]'} ${data.sort !== null ? 'cursor-pointer' : ''}`}
                                                                onClick={() => {
                                                                    if (data.sort !== null) {
                                                                        if (data.sort === 'ASC') {
                                                                            handleShorting('desc', data.name, data.value);
                                                                        } else {
                                                                            handleShorting('asc', data.name, data.value);
                                                                        }
                                                                    }
                                                                }}
                                                            >
                                                            {data.name  !== "start Date" && data.name  !== "End Date" && data.name  !== "Updated At"&&data.name  !== "Created At"  && data.name  !== "Completed Date"? (
                                                                <Tooltip className={`max-w-[16rem] ${data.name === "Action" ? "hidden" :"block"} bg-gray-600 dark:text-[#fff] before:absolute before:top-[120%] before:-translate-y-[120%] before:-translate-x-[50%] before:left-[50%] before:transform before:rotate-45 before:border-gray-600 before: before:border-t before:border-[5px]`} content={'Name. A -> Z'}>
                                                                    <div className={`flex items-center justify-center ${(data.name === 'Description' || data.name === 'Project Name') ? '' : 'justify-center'}`}>
                                                                        {data.name}
                                                                        {data.sort && data.sort !== null && (
                                                                            data.sort === 'ASC' ? (
                                                                                <FaArrowDown />
                                                                            ) : (
                                                                                <FaArrowUp />
                                                                            )
                                                                        )}
                                                                    </div>
                                                                </Tooltip>
                                                            ):(
                                                                <Tooltip className={`max-w-[16rem] ${data.name === "Action" ? "hidden" :"block"} bg-gray-600 dark:text-[#fff] before:absolute before:top-[120%] before:-translate-y-[120%] before:-translate-x-[50%] before:left-[50%] before:transform before:rotate-45 before:border-gray-600 before: before:border-t before:border-[5px]`} content={data.sort === 'DESC'?"Sort:Newest to Oldest":"Sort:Oldest to Newest"}>
                                                                    <div className={`flex items-center justify-center ${(data.name === 'Description' || data.name === 'Project Name') ? '' : 'justify-center'}`}>
                                                                        {data.name}
                                                                        {data.sort && data.sort !== null && (
                                                                            data.sort === 'ASC' ? (
                                                                                <FaArrowDown />
                                                                            ) : (
                                                                                <FaArrowUp />
                                                                            )
                                                                        )}
                                                                    </div>
                                                                </Tooltip>
                                                            )}
                                                            </th>
                                                        )}
                                                    </>
                                                );
                                            })}
                                    </tr>
                                </thead>
                                <tbody className='border-b'>
                                    {projectDetails && projectDetails.length === 0 && (
                                        <tr>
                                            <th colSpan={2}>No data</th>{' '}
                                        </tr>
                                    )}
                                    {!projectDetails && (
                                        <tr>
                                            <th colSpan={10} className='items-center'>
                                                <TinnySpinner />
                                            </th>
                                        </tr>
                                    )}
                                    {projectDetails &&
                                        projectDetails.map(function (project, key) {
                                            return (
                                                <tr className='' key={key}>
                                                    {/* {checkVisibility("type") && <td className={"w-[80px]"}><Image src={AVTAR_URL} alt="Project avtar" width={25} height={15} /></td>} */}
                                                    {checkVisibility('projectName') && (
                                                        <td className={'w-[190px] cursor-pointer text-sm font-medium text-gray-900 hover:text-brandBlue border-l-[1px] border-[#e5e5e5]'}>
                                                            <div className='flex items-center justify-start'>
                                                                {/* <Image src={AVTAR_URL + project.projectName + '.svg'} alt='Project avtar' width={30} height={20} /> */}
                                                                <a
                                                                    onClick={event => {
                                                                        router.push('/w-m/projects/' + project._id);
                                                                    }}
                                                                    className='break-words w-[70%] ml-3 '>
                                                                    {' '}
                                                                    {project.projectName}
                                                                </a>
                                                            </div>
                                                        </td>
                                                    )}
                                                    {checkVisibility('projectCode') && (
                                                        <td className={'w-[190px] truncate border-l-[1px] border-[#e5e5e5]'}>
                                                            <span className='flex items-center justify-center text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-[#fff] break-words w-[100%]'>
                                                                {project.projectCode}

                                                            </span>
                                                        </td>
                                                    )}
                                                    {checkVisibility('description') && (
                                                        <td className={'w-[290px] border-l-[1px] border-[#e5e5e5] border-l-[1px] border-[#e5e5e5]'}>
                                                            <div className=' items-center justify-center break-all'>
                                                                {project?.description?.length > 95 ? (
                                                                    <>
                                                                        {/* {project?.description.slice(0, 95)}... */}

                                                                        <div dangerouslySetInnerHTML={{ __html: project?.description.slice(0, 95) }} />
                                                                    </>
                                                                ) : (
                                                                    <div dangerouslySetInnerHTML={{ __html: project?.description }} /> ?? '------'
                                                                )}
                                                            </div>
                                                        </td>
                                                    )}
                                                    {checkVisibility('startDate') && (
                                                        <td className={'w-[190px] border-l-[1px] border-[#e5e5e5]'}>
                                                            {' '}
                                                            <p className='outline-brandBlue border-none flex items-center justify-center break-all w-[100%]'> {formatedDate(project.startDate)} </p>
                                                        </td>
                                                    )}
                                                    {checkVisibility('endDate') && (
                                                        <td className={'w-[190px] border-l-[1px] border-[#e5e5e5]'}>
                                                            {' '}
                                                            <p className='outline-brandBlue border-none flex items-center justify-center break-all w-[100%]'> {formatedDate(project.endDate)} </p>{' '}
                                                        </td>
                                                    )}
                                                    {/* {checkVisibility('owner') && (
                                                <td className={'w-[180px]'}>
                                                    <div className='flex mb-5 -space-x-4'>
                                                        {project.userAssigned?.filter(function ({ role }) {
                                                            return role === 'owner';
                                                        }).length == 0 && <>Not Assigned</>}
                                                        {project.userAssigned
                                                            ?.filter(function (d) {
                                                                return d ? d.role === 'owner' : [];
                                                            })
                                                            .map(function (d1: { firstName: any; profilePic: string }) {
                                                                return d1 ? (
                                                                    <ToolTip className='relative w-[38px] bg-white h-[38px] shadow-md rounded-full' message={d1.firstName}>
                                                                        <img
                                                                            src={d1.profilePic??USER_AVTAR_URL + d1.firstName + ".svg"}
                                                                            className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 w-10 h-10 rounded-full'
                                                                            alt='-'
                                                                        />
                                                                    </ToolTip>
                                                                ) : (
                                                                    ' '
                                                                );
                                                            })}
                                                    </div>
                                                </td>
                                            )} */}
                                                    {checkVisibility('owner') && (
                                                        <td className={'w-[190px] border-l-[1px] border-[#e5e5e5]'}>
                                                            <div className='-space-x-4 flex items-center justify-center'>

                                                                {filterOwner(project.userAssigned) && filterOwner(project.userAssigned).length == 0 ? <>Not Assigned</>
                                                                    :
                                                                    <>
                                                                        {filterOwner(project.userAssigned) && filterOwner(project.userAssigned).length <= 1 ?

                                                                            filterOwner(project.userAssigned).map((d) => {


                                                                                return (
                                                                                    <ToolTip className='relative w-[30px] bg-white h-[30px] shadow-md rounded-full' message={d.firstName} key={d.firstName}
                                                                                        userId={d._id} isAdmin={d.isAdmin}

                                                                                    >


                                                                                        <img onClick={()=>handleUserClick(d.isAdmin ,d._id ,d.isSuspended)}
                                                                                            src={d.profilePic ?? USER_AVTAR_URL + d.firstName + ".svg"}
                                                                                            className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 w-10 h-10 rounded-full'
                                                                                            alt='-'
                                                                                        />
                                                                                    </ToolTip>
                                                                                )

                                                                            })

                                                                            : (
                                                                                <div className='flex items-center justify-center -space-x-4'>
                                                                                    <div className='relative w-[30px] h-[30px] shadow-md rounded-full  flex flex-col items-center group'>
                                                                                        <img
                                                                                            className='bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 w-10 h-10 rounded-full'
                                                                                            src={project.userAssigned === undefined ? [] : filterOwner(project.userAssigned)[0].profilePic ?? USER_AVTAR_URL + `${filterOwner(project.userAssigned)[0].firstName}.svg`}
                                                                                            alt=''
                                                                                        />
                                                                                    </div>
                                                                                    {/* <div className='relative w-[30px] h-[30px] shadow-md rounded-full  flex flex-col items-center group' >
                                                                                        <img
                                                                                            className='bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 w-10 h-10 rounded-full'
                                                                                            src={project.userAssigned === undefined ? [] : filterOwner(project.userAssigned)[1].profilePic ?? USER_AVTAR_URL + `${filterOwner(project.userAssigned)[1].firstName}.svg`}
                                                                                            alt=''
                                                                                        />
                                                                                    </div> */}
                                                                                    <MemberModal members={project.userAssigned ? filterOwner(project.userAssigned) : ""} remainingCount={filterOwner(project.userAssigned)?.length - 1} />
                                                                                </div>
                                                                            )
                                                                        }
                                                                    </>
                                                                }
                                                            </div>
                                                        </td>
                                                    )}

                                                    {checkVisibility('manager') && (
                                                        <td className={'w-[190px] border-l-[1px] border-[#e5e5e5]'}>
                                                            <div className='-space-x-4 flex items-center justify-center'>
                                                                {filterManager(project.userAssigned) && filterManager(project.userAssigned).length == 0 ? <>Not Assigned</>
                                                                    :
                                                                    <>
                                                                        {filterManager(project.userAssigned) && filterManager(project.userAssigned).length <= 1 ?

                                                                            filterManager(project.userAssigned).map((d) => {
                                                                                return (
                                                                                    <ToolTip className='relative w-[30px] bg-white h-[30px] shadow-md rounded-full' message={d.firstName} key={d.firstName}

                                                                                    >
                                                                                        <img onClick={()=>handleUserClick(d.isAdmin ,d._id,d.isSuspended)} style={{ cursor: 'pointer' }}
                                                                                            src={d.profilePic ?? USER_AVTAR_URL + d.firstName + ".svg"}
                                                                                            className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 w-10 h-10 rounded-full'
                                                                                            alt='-'
                                                                                        />
                                                                                    </ToolTip>
                                                                                )

                                                                            })

                                                                            : (
                                                                                <div className='flex items-center -space-x-4'>
                                                                                    <div className='relative w-[30px] h-[30px] shadow-md rounded-full  flex flex-col items-center group'>
                                                                                        <img onClick={()=>handleUserClick(project.userAssigned.isAdmin ,project.userAssigned._id,project.userAssigned.isSuspended)} style={{ cursor: 'pointer' }}
                                                                                            className='bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 w-10 h-10 rounded-full'
                                                                                            src={project.userAssigned === undefined ? [] : filterManager(project.userAssigned)[0].profilePic ?? USER_AVTAR_URL + `${filterManager(project.userAssigned)[0].firstName}.svg`}
                                                                                            alt=''
                                                                                        />
                                                                                    </div>
                                                                                    {/* <div className='relative w-[30px] h-[30px] shadow-md rounded-full  flex flex-col items-center group' >
                                                                                        <img
                                                                                            className='bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 w-10 h-10 rounded-full'
                                                                                            src={project.userAssigned === undefined ? [] : filterManager(project.userAssigned)[1].profilePic ?? USER_AVTAR_URL + `${filterManager(project.userAssigned)[1].firstName}.svg`}
                                                                                            alt=''
                                                                                        />
                                                                                    </div> */}
                                                                                    <MemberModal members={project.userAssigned ? filterManager(project.userAssigned) : ""} remainingCount={filterManager(project.userAssigned)?.length - 1} />
                                                                                </div>
                                                                            )
                                                                        }
                                                                    </>
                                                                }
                                                            </div>
                                                        </td>
                                                    )}
                                                    {checkVisibility('actualBudget') && (
                                                        <td className={'w-[190px] border-l-[1px] border-[#e5e5e5]'}>
                                                            <div className='flex items-center justify-center break-all w-[100%]'>
                                                                {project.actualBudget} {project.currencyType}{' '}
                                                            </div>
                                                        </td>
                                                    )}
                                                    {checkVisibility('plannedBudget') && (
                                                        <td className={'w-[190px] border-l-[1px] border-[#e5e5e5]'}>
                                                            <div className='flex items-center justify-center break-all w-[100%]'>
                                                                {project.plannedBudget} {project.currencyType}{' '}
                                                            </div>
                                                        </td>
                                                    )}
                                                    {checkVisibility('taskCount') && (
                                                        <td className={'w-[190px] border-l-[1px] border-[#e5e5e5]'}>
                                                            <div className='flex items-center justify-center w-[100%]'>
                                                                <label
                                                                    // onClick={() => {
                                                                    //     router.push('/w-m/tasks/all?projectId=' + project._id);
                                                                    // }}
                                                                    className='cursor-pointer flex justify-center bg-blue-700 text-white text-center rounded text-base px-4  mr-2 max-w-[50px] overflow-hidden w-full text-ellipsis whitespace-nowrap'>
                                                                    {project.taskCount ? project.taskCount : 0}
                                                                </label>
                                                            </div>
                                                        </td>
                                                    )}
                                                    {checkVisibility("userAssigned") || checkVisibility("members")   && (
                                                        <td className={'w-[190px] border-l-[1px] border-[#e5e5e5]'}>
                                                            <div className='-space-x-4 flex items-center justify-center'>
                                                                {filterMembers(project.userAssigned)?.length == 0 && <>Not Assigned</>}

                                                                {filterMembers(project.userAssigned)?.length <= 1 ? (
                                                                    filterMembers(project.userAssigned).map(function (d1) {
                                                                        return d1 ? (
                                                                            <ToolTip className='relative w-[30px] h-[30px] shadow-md rounded-full' message={d1.firstName + ' ' + d1.lastName}

                                                                            >
                                                                                <img onClick={()=>handleUserClick(d1.isAdmin ,d1._id,d1.isSuspended)} style={{ cursor: 'pointer' }}
                                                                                    src={project.profilePic ?? USER_AVTAR_URL + d1.firstName + '.svg'}
                                                                                    className='bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 w-10 h-10 rounded-full'
                                                                                    alt='-'
                                                                                />
                                                                            </ToolTip>
                                                                        ) : (
                                                                            ' '
                                                                        );
                                                                    })
                                                                ) : (
                                                                    // <ToolTip
                                                                    //     paddingfortooltip={'w-[30vw]'}
                                                                    //     message={
                                                                    //         project.userAssigned != null
                                                                    //             ? project.userAssigned.map(function (d) {
                                                                    //                 return ' ' + d.firstName + ' ' + d.lastName;
                                                                    //             })
                                                                    //             : ''
                                                                    //     }>
                                                                    <div className='flex items-center -space-x-4'>
                                                                        <div className='relative w-[30px] h-[30px] shadow-md rounded-full  flex flex-col items-center group'>
                                                                            <img
                                                                                className='bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 w-10 h-10 rounded-full'
                                                                                src={filterMembers(project.userAssigned) === undefined ? [] : filterMembers(project.userAssigned)[0].profilePic ?? USER_AVTAR_URL + `${filterMembers(project.userAssigned)[0].firstName}.svg`}
                                                                                alt=''
                                                                            />
                                                                        </div>
                                                                        {/* <div className='relative w-[30px] h-[30px] shadow-md rounded-full  flex flex-col items-center group'> */}
                                                                        {/* <img
                                                                                className='bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 w-10 h-10 rounded-full'
                                                                                src={filterMembers(project.userAssigned) === undefined ? [] : filterMembers(project.userAssigned)[1].profilePic ?? USER_AVTAR_URL + `${filterMembers(project.userAssigned)[1].firstName}.svg`}
                                                                                alt=''
                                                                            /> */}
                                                                        {/* </div> */}
                                                                        <MemberModal members={project.userAssigned ? filterMembers(project.userAssigned) : ""} remainingCount={filterMembers(project.userAssigned)?.length - 1} />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                    )}
                                                    {checkVisibility('progress') && (
                                                        <td className={'w-[190px] border-l-[1px] border-[#e5e5e5]'}>
                                                            {project.progress < 40 ? (
                                                                <div className=' flex items-center justify-center'>
                                                                    <span className='flex items-center justify-start text-defaultTextColor text-base w-[15%]'>{(project.progress ? project.progress : 0) + '%'}</span>
                                                                    <div className='flex items-center justify-start ml-2 bg-veryLightGrey h-2 rounded-full dark:bg-veryLightGrey w-[80%] '>
                                                                        <div
                                                                            className='bg-redColor text-[0.5rem] h-2 font-medium text-blue-100 text-center p-0.5 leading-none rounded-full'
                                                                            style={{ width: (project.progress ? project.progress : 0) + '%' }}></div>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className=' flex items-center justify-center'>
                                                                    <span className='flex items-center justify-start text-defaultTextColor text-base w-[15%]'>{(project.progress ? project.progress : 0) + '%'}</span>
                                                                    <div className='flex items-center justify-start ml-2 bg-veryLightGrey h-2 rounded-full dark:bg-veryLightGrey w-[80%] '>
                                                                        <div
                                                                            className='bg-brandBlue text-[0.5rem] h-2 font-medium text-blue-100 text-center p-0.5 leading-none rounded-full'
                                                                            style={{ width: (project.progress ? project.progress : 0) + '%' }}></div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </td>
                                                    )}
                                                    {checkVisibility('status') && (
                                                        <td className='w-[190px] border-l-[1px] border-[#e5e5e5]'>
                                                            <div className='flex items-center justify-center'>
                                                                <DropDownWithTick
                                                                    paddingForDropdown={'py-2'}
                                                                    onChangeValue={handleAssignRole}
                                                                    selectedData={project}
                                                                    data={statusDetails}
                                                                    value={project.status}
                                                                    handle={undefined}
                                                                    className={'relative text-center'}
                                                                />
                                                            </div>
                                                        </td>
                                                    )}
                                                    {checkVisibility('clientName') && <td className={'w-[190px] border-l-[1px] border-[#e5e5e5]'}><div className='flex items-center justify-center break-all w-[100%]'>{Array.isArray(project.clientCompany) && project.clientCompany.length > 0 ? project?.clientCompany.filter(item => !item.key).map(company => company?.clientName).join(','): 'Not Assigned'}</div></td>}
                                                    {checkVisibility('completedDate') && <td className={'w-[190px] border-l-[1px] border-[#e5e5e5]'}><div className='flex items-center justify-center break-all w-[100%]'>{formatedDate(project.completedDate ? project.completedDate : 'Not Completed')}</div></td>}
                                                    {checkVisibility('reason') && (<td className={'w-[190px] border-l-[1px] border-[#e5e5e5]'}><div className='flex items-center justify-center break-all w-[100%]'>
                                                        {project.reason && project.reason.length > 95 ? (
                                                            <>
                                                                {project.reason.substring(0, 95)}...
                                                            </>
                                                        ) : (
                                                            <NewToolTip message="No Overdue found">
                                                                -----
                                                            </NewToolTip>
                                                        )}
                                                    </div>
                                                    </td>
                                                    )}
                                                    {checkVisibility('clientCompany') && (
                                                            <td className={'w-[190px] border-l-[1px] border-[#e5e5e5]'}>
                                                                 <div className='flex items-center justify-center break-all w-[100%]'>
                                                                      {Array.isArray(project.clientCompany) && project.clientCompany.length > 0 ? project?.clientCompany.filter(item => !item.clientName).map(company => company.key).join(', '): 'Not Assigned'}
                                                                 </div>
                                                            </td>
                                                    )}
                                                    {checkVisibility('projectCreatedBy') && (
                                                        <td className={'w-[190px] border-l-[1px] border-[#e5e5e5]'}>
                                                            <div className='-space-x-4 flex items-center justify-center'>
                                                                {project.projectCreatedBy && (
                                                                    <ToolTip className='relative w-[30px] h-[30px] bg-white shadow-md rounded-full' message={project.projectCreatedBy.firstName} >
                                                                        <img onClick={()=>handleUserClick(project.projectCreatedBy.isAdmin ,project.projectCreatedBy.Id,project.projectCreatedBy.isSuspended)} style={{ cursor: 'pointer' }}
                                                                            src={project.projectCreatedBy.profilePic ?? USER_AVTAR_URL + project?.projectCreatedBy?.firstName + '.svg'}
                                                                            className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 w-10 h-10 rounded-full'
                                                                            alt='user'
                                                                        />
                                                                    </ToolTip>
                                                                )}
                                                            </div>
                                                        </td>
                                                    )}
                                                    {checkVisibility('createdAt') && <td className={'w-[190px] border-l-[1px] border-[#e5e5e5]'}>
                                                        <div className='flex items-center justify-center break-all w-[100%]'>
                                                            {formatedDate(project.createdAt)}
                                                        </div>

                                                    </td>}

                                                    {checkVisibility('updatedAt') && <td className={'w-[190px] border-l-[1px] border-[#e5e5e5]'}>
                                                        <div className='flex items-center justify-center break-all w-[100%]'>
                                                            {formatedDate(project.updatedAt ? project.updatedAt : 'Not Updated')}
                                                        </div>

                                                    </td>}

                                                    {checkVisibility('action') && (
                                                        <td className={'w-[190px] border-l-[1px] border-[#e5e5e5]'}>
                                                            <div className='flex items-center justify-center text-xl'>
                                                                <NoSsr>
                                                                    {(permission && permission.edit === true) || Cookies.get('isAdmin') === 'true' ? (
                                                                        <ToolTip message={'Edit/View'}>
                                                                            <CreateOrEditProjectModel
                                                                                type={'edit'}
                                                                                data={project}
                                                                                {...{
                                                                                    users,
                                                                                    handleGetAllProject,
                                                                                    handleGetAllUsers,
                                                                                    handleGetAllGroup,
                                                                                    startLoading,
                                                                                    stopLoading,
                                                                                    groupList,
                                                                                    setSortTable,
                                                                                    clientDetails,
                                                                                    roleList,
                                                                                    sortTable
                                                                                }}
                                                                            />
                                                                        </ToolTip>
                                                                    ) : (
                                                                        <></>
                                                                    )}
                                                                    {(permission && permission.delete === true) || Cookies.get('isAdmin') === 'true' ? (
                                                                        <ToolTip message={'Delete'}>
                                                                            <button
                                                                                className='red-link'
                                                                                onClick={() => {
                                                                                    setDeleteMessage('Delete Project ' + '"' + project.projectName + '"');
                                                                                    setDeleteProjectId(project._id);
                                                                                    setOpenDeleteModel(true);
                                                                                }}>
                                                                                <AiOutlineDelete />
                                                                            </button>
                                                                        </ToolTip>
                                                                    ) : (
                                                                        <></>
                                                                    )}
                                                                </NoSsr>
                                                            </div>
                                                        </td>
                                                    )}
                                                </tr>
                                            );
                                        })}
                                </tbody>
                            </table>
                        </div>
                        {projectDetails && projectDetails.length != 0 && (
                            <div className='flex justify-between items-center'>
                                <p className='p-0 m-0 text-lightTextColor dark:text-[#fff] text-base sm:my-4 my-2'>
                                    Showing {sortTable.limit * (sortTable.pageNo - 1) + 1} to {sortTable.limit * sortTable.pageNo < projectCount ? sortTable.limit * sortTable.pageNo : projectCount}
                                    {' '} of {projectCount}
                                </p>
                                <div className='flex items-center '>
                                    <button
                                        disabled={sortTable.pageNo == 1}
                                        onClick={() => {
                                            setSortTable({ ...sortTable, pageNo: sortTable.pageNo - 1, skip: (sortTable.limit * sortTable.pageNo) - (sortTable.limit * 2) });
                                            handlePaginationProject('?skip=' + ((sortTable.limit * sortTable.pageNo) - (sortTable.limit * 2)) + '&limit=' + sortTable.limit);
                                        }}
                                        className='disabled:opacity-25  disabled:cursor-not-allowed  arrow_left border mx-1 bg-veryveryLightGrey cursor-pointer hover:bg-defaultTextColor hover:text-white'>
                                        <MdKeyboardArrowLeft className="dark:text-[#fff]"/>
                                    </button>
                                    <div className='pages'>
                                        <p className='p-0 m-0 text-lightTextColor dark:text-[#fff] text-base sm:my-4 my-2'>
                                            Page <span>{sortTable.pageNo}</span>
                                        </p>
                                    </div>
                                    <button
                                        disabled={sortTable.pageNo === Math.ceil(projectCount / sortTable.limit)}
                                        onClick={() => {
                                            handlePaginationProject('?skip=' + sortTable.limit * sortTable.pageNo + '&limit=' + sortTable.limit);
                                            setSortTable({
                                                ...sortTable, pageNo: sortTable.pageNo + 1,
                                                skip: sortTable.pageNo * sortTable.limit
                                            });
                                        }}
                                        className='disabled:cursor-not-allowed  arrow_right border mx-1 bg-veryveryLightGrey cursor-pointer hover:bg-defaultTextColor hover:text-white'>
                                        <MdKeyboardArrowRight className="dark:text-[#fff]"/>
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
                        onClick={handleDeleteProjectById}
                    />
                    <DeleteConformation
                        open={openDeleteAllModel}
                        close={() => {
                            setOpenDeleteAllModel(!openDeleteAllModel);
                        }}
                        message={'Delete All projects'}
                        onClick={handleDeleteAllProject}
                    />
                </>
            )}
            </NoSsr>
        </>
    );
};
export default index;
