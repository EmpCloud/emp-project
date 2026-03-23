import React, { useEffect, useState ,useMemo} from 'react';
import validate from 'validate.js';
import FloatingTextfield from '../../../../components/FloatingTextfield';
import { displayErrorMessage, openUpgradePlan, uniqueArrays, uniqueMembers } from '../../../../helper/function';
import { createProjectApi } from '../api/post';
import toast from '../../../../components/Toster/index';
import MultiSelectDropDown from '../../../../components/MultiSelectDropDown/index';
import { adminProfilePic, currencyList, currencyType } from '../../../../helper/exportData';
import { TextArea } from '../../../../components/TextArea';
import { useRouter } from 'next/router';
import { getAllRoles, getAllUsers, getClientDetails } from '../../members/api/get';
import _ from 'lodash';
import { budgetSchema, containOnlyAlphabedSchema, descriptionSchema, endDateSchema, projectCodeSchema, projectNameSchema, requiredSchema, startDateSchema } from '../../../../helper/schema';
import moment from 'moment';
import { FloatingSelectfield } from '../../../../components/FloatingSelectfield';
import { CgAsterisk } from 'react-icons/cg';
import LabelWithRefresh from '@COMPONENTS/labelWithRefresh';
import { getAllGroups } from '@WORKFORCE_MODULES/groups/api/get';
import { fetchProfile } from '@WORKFORCE_MODULES/admin/api/get';
import NoAccessCard from '@COMPONENTS/NoAccessCard';
import dynamic from 'next/dynamic';
import Cookies from 'js-cookie';
function CreateProject({ startLoading, stopLoading }) {
    const router = useRouter();
    const [userObject, setUserObject] = useState([]);
    const [groupList, setGroupList] = useState([]);
    // const [showModal, setShowModal] = useState(false);
    const [roleList, setRoleList] = useState(null);
    const [selectedRole, setSelectedRole] = useState('member');
    const [clientDetails,setClientDetails] = useState(null)
    const [clientDetailsNames,setClientDetailsNames] = useState(null)
    const [permission, setPermission] = useState(null);

    const initialState = {
        isValid: false,
        values: {
            projectName: null,
            projectCode: null,
            // clientName:  [],
            clientCompany:  [],
            description: '',
            startDate: moment().format('YYYY-MM-DD'),
            endDate: moment().add(30, 'd').format('YYYY-MM-DD'),
            estimationDate: moment().add(8, 'd').format('YYYY-MM-DD'),
            manager: [],
            owner: [],
            sponsor: [],
            customMembers: [],
            members: [],
            group: [],
            userAssigned: [],
            plannedBudget: 0,
            actualBudget: 0,
            currencyType: 'INR',
        },
        touched: {},
        errors: {
            projectName: null,
            projectCode: null,
            // clientName:  [],
            clientCompany:  [],
            description: null,
            startDate: null,
            endDate: null,
            estimationDate: null,
            manager: null,
            owner: null,
            sponsor: null,
            members: null,
            plannedBudget: null,
            actualBudget: null,
            currencyType: null,
        },
    };
    const schema = {
        projectCode: projectCodeSchema,
        // description: descriptionSchema,
        projectName: projectNameSchema,
        currencyType: requiredSchema,
        // owner: requiredSchema,
        startDate: startDateSchema,
        // endDate: endDateSchema,
        // members: requiredSchema,
        plannedBudget: budgetSchema,
        actualBudget: budgetSchema,
    };
    const [formState, setFormState] = useState({ ...initialState });
    const handleGetAllUsers = (condition = '') => {
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
    const handleGetAllComapnyClient = (condition = '') =>{
        getClientDetails(condition).then(response =>{
            if(response.data.body.status === "success"){
            let companyList = response?.data.body.data.companyDetail.map((item) => {
                    return {
                        id: item._id,
                        key: item.clientCompany,
                        // value: item,
                     }
                })
                setClientDetails(companyList);
            }
        })
      }
    const handleGetAllRoles = () => {
        getAllRoles(`limit=${process.env.TOTAL_USERS}`).then(response => {
            if (response.data.body.status === 'success') {
                setRoleList(
                    response.data.body.data.totalRolesData.map(data => {
                        return { text: data.roles, value: data.roles };
                    })
                );
            }
        });
    };
    const handleGetAllGroup = () => {
        getAllGroups("?limit=20").then(response => {
            if (response.data.body.status === 'success') {
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
    const handleProfileData = () => {
        fetchProfile().then(response => {
            if (response.data?.body.status === 'success') {
                setPermission(response.data.body.data.permissionConfig);
            }
        });
    }
    useEffect(() => {
            handleGetAllComapnyClient("?limit="+process.env.TOTAL_USERS)
            handleGetAllUsers('?limit='+process.env.TOTAL_USERS+'&invitationStatus=1&suspensionStatus=false');
            handleGetAllGroup();         
            handleGetAllRoles();
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
    
    useEffect(() => {
        // document.querySelector('body').classList.add('bg-slate-50');
    }, []);
    const handleChangeRole = e => {
        setSelectedRole(e.target.value);
    };
    const handleChange = event => {
        event.persist();
        if (event.target.name === 'projectName') {
            setFormState(formState => ({
                ...formState,
                values: {
                    ...formState.values,
                    projectCode: event.target.value.toUpperCase().substring(0, 3) + Math.random().toString(16).slice(10),
                },
            }));
        }
        if (event.target.name === 'projectCode') {
            setFormState(formState => ({
                ...formState,
                values: {
                    ...formState.values,
                    projectCode: event.target.value.toUpperCase(),
                },
            }));
        }
        setFormState(formState => ({
            ...formState,
            values: {
                ...formState.values,
                [event.target.name]: event.target.type === 'radio' ? event.target.value : event.target.value,
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
                description: event,
            },
        }));
    }
    const hasError = field => !!(formState.touched[field] && formState.errors[field]);
    const handleCreateProject = event => {
        startLoading();
        let assignTo = formState.values.manager.concat(formState.values.members, formState.values.sponsor, formState.values.owner, formState.values.customMembers).map(d => {
            return { id: d._id };
        });
        let temp = {
            ..._.omit(formState.values, ['members', 'sponsor', 'manager', 'owner', 'group', 'customMembers']),
            ...{
                userAssigned: assignTo,
            },
        };
        createProjectApi({ project: [temp] })
            .then(function (result) {
                stopLoading();
                if (result.data.body.status == 'success') {
                    toast({
                        type: 'success',
                        message: result ? result.data.body.message : 'Try again !',
                    });
                    setFormState(initialState);
                    setShowDynamicInput(false);
                    setTimeout(() => {
                        router.push('/w-m/projects/all');
                    }, 2000);
                } else {
                    toast({
                        type: 'error',
                        message: result ? result.data.body.message === "Validation failed." ? result.data.body.error: result.data.body.message : 'Error',
                    });
                }
            })
            .catch(function ({ response }) {
                stopLoading();
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
    const handleChangeMultiSelector = (data, name, type) => {
        if (name === 'group' && type === 'select') {
            let tempMember = [];
            let tempManager = [];
            let tempOwner = [];
            let tempSponsor = [];
            let tempCustomMembers = [];

            data.map(d1 => {
                d1.value.assignedMembers
                    .filter(d2 => {
                        return d2.role === 'member';
                    })
                    .map(d3 => {
                        tempMember.push(d3);
                    });

                d1.value.assignedMembers
                    .filter(d2 => {
                        return d2.role === 'manager';
                    })
                    .map(d3 => {
                        tempManager.push(d3);
                    });

                d1.value.assignedMembers
                    .filter(d2 => {
                        return d2.role === 'owner';
                    })
                    .map(d3 => {
                        tempOwner.push(d3);
                    });

                d1.value.assignedMembers
                    .filter(d2 => {
                        return d2.role === 'sponsor';
                    })
                    .map(d3 => {
                        tempSponsor.push(d3);
                    });

                d1.value.assignedMembers
                    .filter(d2 => {
                        return d2.role !== 'sponsor' && d2.role !== 'manager' && d2.role !== 'owner' && d2.role !== 'member';
                    })
                    .map(d3 => {
                        tempCustomMembers.push(d3);
                    });
            });

            setFormState(formState => ({
                ...formState,
                values: {
                    ...formState.values,
                    manager: uniqueMembers([...formState.values.manager, ...tempManager]),
                    members: uniqueMembers([...formState.values.members, ...tempMember]),
                    owner: uniqueMembers([...formState.values.owner, ...tempOwner]),
                    sponsor: uniqueMembers([...formState.values.sponsor, ...tempSponsor]),
                    customMembers: uniqueMembers([
                        ...formState.values.customMembers,
                        ...tempCustomMembers,
                      ]),
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
    const handleGetAllComapnyClientNames = (companyId) => {
        const concatenatedClientNames = [];
        const uniqueClientIds = new Set();
      
        getClientDetails()
          .then((response) => {
            if (response.data.body.status === 'success') {
      
              response.data.body.data.companyDetail.map((company) => {
                if (companyId.includes(company._id)) {
                  const clientNamesList = company.clientName.map((client) => {
                    if (!uniqueClientIds.has(client.id)) {
                      uniqueClientIds.add(client.id); 
                      return {
                        id: client.id,
                        key: client.clientName,
                        value: client,
                      };
                    }
                    return null; 
                  });
      
                  concatenatedClientNames.push(...clientNamesList.filter(Boolean));
                }
              });
      
              setClientDetailsNames(concatenatedClientNames);
            }
          });
      };
    const handleChangeMultiSelectorCompany = (selectedValues) => {
        setFormState((formState) => ({
          ...formState,
          values: {
            ...formState.values,
            clientCompany: selectedValues,
          },
          
        }));
      const selectedCompanies = clientDetails.filter((company) =>
      selectedValues.some((selected) => selected.key === company.key)
    );
  
    const selectedCompanyIds = selectedCompanies.map((company) => company.id);
  
    if (selectedCompanyIds.length > 0) {
      handleGetAllComapnyClientNames(selectedCompanyIds);
    } else {
        setClientDetailsNames([]);
    }
  };
  const handleChangeMultiSelectorclientNames = (selectedValues) => {
    // setFormState((formState) => ({
    //   ...formState,
    //   values: {
    //     ...formState.values,
    //     clientName: selectedValues,
    //   },
      
    // }));
  }

  const [showDynamicInput, setShowDynamicInput] = useState(false);

  const handleTextAreaClick = () => {
    setShowDynamicInput(!showDynamicInput);
  }; 
  
    const DynamicCustomInput =useMemo(()=> dynamic(()=>import('@COMPONENTS/ReactQuillTextEditor'), { ssr: false }),[]);
 
   
   
    return (
        <>

            <div className='font-inter -mt-8 mb-4'>
                <div className='heading-big text-darkTextColor font-semibold'>Create Project</div>

                {permission && permission.project.create === false ? <NoAccessCard /> :
                    <div className='card'>
                        <div className=' grid grid-cols-12 md:gap-2 relative'>
                            <div className='md:col-span-8 col-span-12 md:border-r md:pr-[30px] '>
                                    <label className='text-base my-2 font-bold text-darkTextColor flex' htmlFor=''>
                                          Required Fileds are marked with an asterisk <CgAsterisk color='red' />
                                     </label>
                                <div className='sm:flex gap-10 w-full'>

                                    <div className='input_box flex flex-col w-full md:w-1/2'>
                                            <label className='text-base my-2 font-bold text-darkTextColor flex'>
                                                Project Name
                                            <CgAsterisk color='red' />
                                            </label>
                                            <FloatingTextfield
                                                type='text'
                                                label={''}
                                                error={hasError('projectName')}
                                                errorMsg={displayErrorMessage(formState.errors.projectName)}
                                                name='projectName'
                                                value={formState.values.projectName || ''}
                                                onChange={handleChange} onPaste={undefined} autoComplete={undefined} />
                                    </div>

                                    <div className='input_box flex flex-col w-full md:w-1/2'>
                                            <label className='text-base my-2 font-bold text-darkTextColor flex'>
                                                Project Code
                                            <CgAsterisk color='red' />
                                            </label>
                                            <FloatingTextfield
                                                type='text'
                                                label={''}
                                                error={hasError('projectCode')}
                                                errorMsg={displayErrorMessage(formState.errors.projectCode)}
                                                name='projectCode'
                                                value={formState.values.projectCode || ''}
                                                onChange={handleChange} onPaste={undefined} autoComplete={undefined} />
                                    </div>
                                </div>

                                <div className='sm:flex gap-10  w-full'>

                                    {/* <div className='input_box flex flex-col w-full md:w-1/2'>
                                            <label className='text-base my-2 font-bold text-darkTextColor flex'>
                                                Company Name
                                            </label> */}
                                            {/* <FloatingTextfield
                                                type='text'
                                                label={''}
                                                error={hasError('clientCompany')}
                                                errorMsg={displayErrorMessage(formState.errors.clientCompany)}
                                                name='clientCompany'
                                                value={formState.values.clientCompany || ''}
                                                onChange={handleChange} onPaste={undefined} autoComplete={undefined} /> */}
                                                {/* <MultiSelectDropDown
                                                    handleChangeMultiSelector={handleChangeMultiSelectorCompany}
                                                    value={formState.values.clientCompany}
                                                    selectedValues={formState.values.clientCompany}
                                                    name={"clientCompany"}
                                                    option={clientDetails}
                                                    label={undefined} 
                                                />                                      
                                    </div> */}

                                    {/* <div className='input_box flex flex-col w-full md:w-1/2'>
                                            <label className='text-base my-2 font-bold text-darkTextColor flex'>
                                                Client Name
                                            </label>
                                            <MultiSelectDropDown
                                                handleChangeMultiSelector={handleChangeMultiSelectorclientNames}
                                                value={formState.values.clientName}
                                                selectedValues={clientDetailsNames}
                                                name={"clientName"}
                                                option={clientDetailsNames}
                                                disable={true}
                                                label={undefined} />
                                    </div> */}
                                </div>

                                <div className='w-full taskTextArea dark:text-gray-50'>
                                        <label className='text-base my-2 font-bold text-darkTextColor flex'>
                                            Description
                                            {/* <span className='text-base'> (upto 250 charecters)</span> */}
                                        </label>

                                    {/* <TextArea
                                        type='text'
                                        label={''}
                                        error={hasError('description')}
                                        errorMsg={displayErrorMessage(formState.errors.description)}
                                        name='description'
                                        value={formState.values.description || ''}
                                        onChange={handleChange}
                                    /> */}
                                    {showDynamicInput ? (
                                    <DynamicCustomInput 
                                    type='text'
                                    name='taskDetails'
                                    value={formState.values.description || ''}
                                    onChange={handleDescription}
                                    />
                                    ):(
                                    <div onClick={handleTextAreaClick}>
                                      <TextArea
                                       type='text'
                                       name='taskDetails'
                                      className='text-base border rounded-md w-full px-3 py-1 bg-gray-100/50 outline-brandBlue'
                                      value={''}
                                      backgroundColor={'darkGray'}
                                    //   disabled={true}
                                      />
                                    </div>
                                      )}
                                </div>

                                <div className='sm:flex items-center gap-5'>
                                    <div className='input_box flex flex-col sm:w-2/4'>
                                            <label className='text-base my-2 font-bold text-darkTextColor flex'>
                                                Planned start date
                                            <CgAsterisk color='red' />
                                            </label>
                                            <FloatingTextfield
                                                type='date'
                                                min={moment().format("YYYY-MM-DD")}
                                                name={'startDate'}
                                                label={''}
                                                error={hasError('startDate')}
                                                errorMsg={displayErrorMessage(formState.errors.startDate)}
                                                value={formState.values.startDate || ''}
                                                onChange={handleChange} onPaste={undefined} autoComplete={undefined} />
                                    </div>

                                    <div className='input_box flex flex-col sm:w-2/4 '>
                                            <label className='text-base my-2 font-bold text-darkTextColor flex'>
                                                Estimation Date
                                            </label>
                                            <FloatingTextfield
                                                type='date'
                                                name={'estimationDate'}
                                                min={formState.values.startDate || ''}
                                                label={''}
                                                error={hasError('estimationDate')}
                                                errorMsg={displayErrorMessage(formState.errors.estimationDate)}
                                                value={formState.values.estimationDate || ''}
                                                onChange={handleChange} onPaste={undefined} autoComplete={undefined} />
                                    </div>
                                    {/* <div className='input_box flex flex-col sm:w-2/4 '>
                                <div className='flex flex-row'>
                                    <p className='text-base text-darkTextColor '>
                                        <b>Planned end date</b>
                                    </p>
                                    <CgAsterisk color='red' />
                                </div>
                                <div className='remove_margin '>
                                    <FloatingTextfield
                                        type='date'
                                        name={'endDate'}
                                        min={formState.values.startDate || ''}
                                        label={''}
                                        error={hasError('endDate')}
                                        errorMsg={displayErrorMessage(formState.errors.endDate)}
                                        value={formState.values.endDate || ''}
                                        onChange={handleChange} onPaste={undefined} autoComplete={undefined}                                        />
                                </div>
                            </div> */}
                                </div>

                                <div className=' items-center lg:gap-5'>
                                    <div className='input_box flex font-bold flex-col w-full'>
                                        {/* <LabelWithRefresh label={'Filter Members by Group'} onClick={handleGetAllGroup} /> */}
                                        <label className='text-base my-2 font-bold text-darkTextColor flex' htmlFor=''>
                                                Filter Members by Group
                                        </label>
                                        <MultiSelectDropDown
                                            styledropdown={'!mb-0'}
                                            handleChangeMultiSelector={handleChangeMultiSelector}
                                            value={formState.values.group}
                                            selectedValues={formState.values.group}
                                            name={'group'}
                                            option={groupList} label={undefined} />
                                    </div>
                                    <div className='input_box flex font-bold flex-col w-full'>
                                        {/* <LabelWithRefresh label={'Assigned To Members'} onClick={handleGetAllUsers} /> */}
                                        <label className='text-base my-2 font-bold text-darkTextColor flex' htmlFor=''>
                                                Assigned To Members
                                        </label>
                                        <MultiSelectDropDown
                                            styledropdown={'!mb-0'}
                                            handleChangeMultiSelector={handleChangeMultiSelector}
                                            value={formState.values.members}
                                            selectedValues={formState.values.members}
                                            name={'members'}
                                            option={uniqueArrays(
                                                userObject.filter(function (d) {
                                                    return d.role === 'member';
                                                })
                                            )} label={undefined} />
                                    </div>

                                    <div className='input_box flex flex-col w-full'>
                                        <label className='text-base py-2 font-bold text-darkTextColor' htmlFor=''>
                                            Project Manager(S)
                                        </label>
                                            <MultiSelectDropDown
                                                handleChangeMultiSelector={handleChangeMultiSelector}
                                                name={'manager'}
                                                option={userObject.filter(function (d) {
                                                    return d.role === 'manager';
                                                })}
                                                value={formState.values.manager}
                                                selectedValues={formState.values.manager} label={undefined} />
                                    </div>
                                </div>

                                <div className='sm:flex items-center gap-5'>
                                    <div className='input_box flex flex-col sm:w-2/4'>
                                            <label className='text-base my-2 font-bold text-darkTextColor flex'>
                                                Actual Budget
                                            </label>
                                            <FloatingTextfield
                                                label={''}
                                                error={hasError('actualBudget')}
                                                errorMsg={displayErrorMessage(formState.errors.actualBudget)}
                                                name='actualBudget'
                                                value={formState.values.actualBudget}
                                                onChange={handleChange}
                                            />
                                    </div>

                                    <div className='input_box flex flex-col sm:w-2/4'>
                                            <label className='text-base my-2 font-bold text-darkTextColor flex'>
                                                Planned Budget
                                            </label>
                                            <FloatingTextfield
                                                label={''}
                                                error={hasError('plannedBudget')}
                                                errorMsg={displayErrorMessage(formState.errors.plannedBudget)}
                                                name='plannedBudget'
                                                value={formState.values.plannedBudget}
                                                onChange={handleChange}
                                            />
                                    </div>
                                    
                                    <div className='input_box flex flex-col sm:w-2/4 '>
                                            <label className='text-base my-2 font-bold text-darkTextColor flex'>
                                                Currency
                                            </label>
                                        <FloatingSelectfield
                                            label={''}
                                            optionsGroup={currencyList}
                                            name={'currencyType'}
                                            error={hasError('currencyType')}
                                            errorMsg={displayErrorMessage(formState.errors.currencyType)}
                                            value={formState.values.currencyType}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='md:col-span-4 col-span-12 '>
                                <div className='side_field md:ml-[30px]'>
                                    <div className='sm:flex gap-10  w-full'>
                                        <div className='input_box flex flex-col w-full'>
                                            <label className='text-base my-2 font-bold text-darkTextColor flex' htmlFor=''>
                                                Owner
                                            </label>
                                                <MultiSelectDropDown
                                                    handleChangeMultiSelector={handleChangeMultiSelector}
                                                    name={'owner'}
                                                    option={userObject.filter(function (d) {
                                                        return d.role === 'owner';
                                                    })}
                                                    value={formState.values.owner}
                                                    selectedValues={formState.values.owner} label={undefined} />
                                        </div>
                                    </div>
                                    <div className='sm:flex gap-10 w-full'>
                                        <div className='input_box flex no_error_message flex-col w-full'>
                                            <label className='text-base my-2 font-bold text-darkTextColor flex' htmlFor=''>
                                                Project Sponsor
                                            </label>
                                                <MultiSelectDropDown
                                                    handleChangeMultiSelector={handleChangeMultiSelector}
                                                    name={'sponsor'}
                                                    option={userObject.filter(function (d) {
                                                        return d.role === 'sponsor';
                                                    })}
                                                    value={formState.values.sponsor}
                                                    selectedValues={formState.values.sponsor} label={undefined} />
                                        </div>
                                    </div>
                                    <div className='sm:flex gap-10 mb-3 w-full'>
                                        <div className='input_box flex no_error_message flex-col w-full'>
                                                {/* <LabelWithRefresh label={'Select Role (optional)'} /> */}
                                                <label className='text-base my-2 font-bold text-darkTextColor flex' htmlFor=''>
                                                    Select Role (optional)
                                                </label>
                                                    <FloatingSelectfield optionsGroup={roleList} name={'category'} value={selectedRole} onChange={handleChangeRole} label={undefined} />
                                        </div>
                                    </div>
                                    <div className='sm:flex gap-10 mb-3 w-full'>
                                        <div className='input_box flex no_error_message flex-col w-full'>
                                            <label className='text-base my-2 font-bold text-darkTextColor flex' htmlFor=''>
                                                Users (optional)
                                            </label>
                                                <MultiSelectDropDown
                                                    selectedValues={formState.values.customMembers}
                                                    handleChangeMultiSelector={handleChangeMultiSelector}
                                                    name={'customMembers'}
                                                    option={userObject.filter(function (d) {
                                                        return d.role === selectedRole;
                                                    })}
                                                    value={formState.values.customMembers}
                                                    label={undefined}
                                                    disable={selectedRole ? false : true}
                                                />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* create button */}
                        <div className='mb-4 flex justify-end w-full gap-5'>
                            <button className='cancel-button'>Cancel</button>
                            <button disabled={!formState.isValid} onClick={handleCreateProject} className='small-button items-center xs:w-full flex sm:text-md text-base'>
                                Create project
                                <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 Sm:h-5 sm:w-5 ' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
                                    <path strokeLinecap='round' strokeLinejoin='round' d='M9 5l7 7-7 7' />
                                </svg>
                            </button>
                        </div>
                    </div>
                }

            </div>
            {/* {showModal && (
                <>
                    <div className='justify-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-[10000] outline-none focus:outline-none'>
                        <div className='relative my-2 mx-auto w-11/12 lg:w-2/5 z-50'>
                            <div className='border-0 mb-7 sm:mt-8 rounded-2xl shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none'>
                                <div className='relative py-5 sm:px-3 p-3 md:px-10 flex-auto'>
                                    <button
                                        className='text-lightGrey hover:text-darkTextColor absolute -right-2 -top-2 rounded-full bg-veryLightGrey  uppercase  text-base outline-none focus:outline-none p-1 ease-linear transition-all duration-150'
                                        type='button'
                                        onClick={() => setShowModal(false)}>
                                        <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
                                            <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
                                        </svg>
                                    </button>
                                    <div className='rounded-lg bg-white'>
                                        <div className=''>
                                            <div className='text-center'>
                                                <p className='text-2xl font-bold text-darkTextColor my-2'>Invite member</p>
                                                <p className='text-base text-lightTextColor mt-2 mb-6'>We will send an invitation request mail to the user</p>
                                                <div className='my-3 mt-5 mb-5'>
                                                    <FloatingTextfield
                                                        type='email'
                                                        error={hasError('email')}
                                                        errorMsg={displayErrorMessage(formState.errors.email)}
                                                        name='email'
                                                        label={'Your work email address*'}
                                                        value={formState.values.email || ''}
                                                        onChange={handleChange} onPaste={undefined} autoComplete={undefined}                                                    />
                                                </div>
                                                <div className='my-2 flex justify-center'>
                                                    <button className='small-button items-center xs:w-full py-2 flex h-9'>Invite & add to project</button>
                                                </div>
                                                <div className='text-center mt-10'>
                                                    <p className='text-lightTextColor text-base lineBefore lineAfter'>Or, Add people from</p>
                                                </div>
                                                <div className='flex justify-center mt-6'>
                                                    <a className='signin-google-apple' href='#'>
                                                        <img src='/imgs/google.svg' alt='Google' />
                                                    </a>
                                                    <a className='signin-google-apple' href='#'>
                                                        <img src='/imgs/microsoft.svg' alt='Microsoft' />
                                                    </a>
                                                </div>
                                                <p onClick={() => setShowModal(false)} className='hover:text-darkBlue cursor-pointer text-lightTextColor mt-8'>
                                                    Cancel
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='opacity-25 fixed inset-0 z-100 bg-black' onClick={() => setShowModal(false)}></div>
                    </div>
                </>
            )} */}
        </>
    );
}
export default CreateProject;
