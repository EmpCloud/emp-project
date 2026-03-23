import { FloatingSelectfield } from '@COMPONENTS/FloatingSelectfield';
import LabelWithRefresh from '@COMPONENTS/labelWithRefresh';
import { FiFilter } from '@react-icons/all-files/fi/FiFilter';
import React, { useState, useEffect } from 'react';
import FloatingTextfield from '../../../../components/FloatingTextfield';
import MultiSelectDropDown from '../../../../components/MultiSelectDropDown';
import NewToolTip from '../../../../components/NewToolTip';
import { currencyList } from '../../../../helper/exportData';
import { RxReset } from 'react-icons/rx';
import { getAllProject } from '../api/get';
export default function ProjectFilter({ users,setType,handleFiterData, handleGetAllProject,setSearchKeyword, handleGetAllMembers, startLoading, stopLoading, type ,setProjectName,projectCode,setProjectCode}) {
    const [isOpen, setIsOpen] = useState(false);
    const [projectName, setProjectNames] = useState(false);

    // const [projectCode, setProjectCode] = useState(false);
    // const [projectName, setProjectName] = useState(false);

    const initialState = {
        values: {
            projectCode: null,
            projectName: null,
            user: [],
            sponsor: [],
            manager: [],
            owner: [],
            currencyType: null,
            status: null,
            plannedBudget: {
                min: '',
                max: '',
            },
            actualBudget: {
                min: '',
                max: '',
            },
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
    const [formState, setFormState] = useState({ ...initialState });
    useEffect(() => {
        // document.querySelector('body').classList.add('bg-slate-50');
        handleGetAllProjects('?limit=' + process.env.TOTAL_USERS);
    }, []);
    const handleGetAllProjects = (condition = '') => {
        getAllProject(condition).then(response => {
            if (response.data?.body.status === 'success') {
              
                    var projectName = response.data?.body.data.project.map(function (project) {
                        return {
                            text: project.projectName,
                            value: project.projectName,
                        };
                    });
                    setProjectNames(projectName);
                }
            })
    };
    const handleChange = (event, type = null) => {
        event.preventDefault();
        if (type) {
            if (type === 'actualBudget') {
                setFormState(formState => ({
                    ...formState,
                    values: {
                        ...formState.values,
                        actualBudget: {
                            ...formState.values.actualBudget,
                            [event.target.name]: event.target.value,
                        },
                    },
                }));
            }
            if (type === 'planBudget') {
                setFormState(formState => ({
                    ...formState,
                    values: {
                        ...formState.values,
                        plannedBudget: {
                            ...formState.values.plannedBudget,
                            [event.target.name]: event.target.value,
                        },
                    },
                }));
            }
            if (type === 'createdAt') {
                setFormState(formState => ({
                    ...formState,
                    values: {
                        ...formState.values,
                        createdAt: {
                            ...formState.values.createdAt,
                            [event.target.name]: event.target.value,
                        },
                    },
                }));
            }
            if (type === 'updatedAt') {
                setFormState(formState => ({
                    ...formState,
                    values: {
                        ...formState.values,
                        updatedAt: {
                            ...formState.values.updatedAt,
                            [event.target.name]: event.target.value,
                        },
                    },
                }));
            }
        } else {
            setFormState(formState => ({
                ...formState,
                values: {
                    ...formState.values,
                    [event.target.name]: event.target.value,
                },
            }));
        }
    };
    const handleChangeMultiSelector = (data, name) => {
        var finalData = data.map(function (val) {
            return val.value;
        });
        setFormState(formState => ({
            ...formState,
            values: {
                ...formState.values,
                [name]: finalData,
            },
        }));
    };
    function handleReset() {
        setSearchKeyword('')
        setFormState({ ...initialState });
        setType(null)
        handleGetAllProject();
        setIsOpen(false);
    }
    function formatDate(date) {
        if (!(date instanceof Date)) {
            date = new Date(date);
        }
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    }
    
    return (
        <>
                <div className=' flex gap-2'>
                <NewToolTip direction='top' message={'Filter'}>
                    {' '}
                    <div
                        className='xs:hidden border border-veryLightGrey text-xl  px-2 py-1 rounded-lg cursor-pointer'
                        onClick={() => {
                            setIsOpen(!isOpen);
                        }}>
                        <FiFilter className='text-defaultTextColor dark:text-[#fff]' />
                    </div>
                </NewToolTip>
                <NewToolTip direction='top' message={'Reset'}>
                    {' '}
                    <div
                        className='xs:hidden border border-veryLightGrey text-xl px-2 py-1 rounded-lg cursor-pointer'
                        onClick={() => {
                            handleReset();
                        }}>
                        <RxReset className='text-defaultTextColor dark:text-[#fff]' />
                    </div>
                </NewToolTip>
                </div>
            
            <>
                <main
                    className={
                        ' fixed overflow-hidden z-[999] bg-gray-900 bg-opacity-25 inset-0 transform ease-in-out ' +
                        (isOpen ? ' transition-opacity opacity-100 duration-500 translate-x-0 ' : ' transition-all delay-500 opacity-0 translate-x-full  ')
                    }>
                    <section
                        className={
                            ' w-[24rem] max-w-lg right-0 absolute bg-white h-full pl-3 shadow-xl delay-400 duration-500 ease-in-out transition-all transform  ' +
                            (isOpen ? ' translate-x-0 ' : ' translate-x-full ')
                        }>
                        <article className='relative w-full max-w-lg pb-2 flex flex-col space-y-6 overflow-y-scroll h-full'>
                            <div className='p-4'>
                                <div className=''>
                                    <p className='text-darkTextColor sm:text-xl text-2xl font-bold'>Filters</p>
                                    <div className='input_box flex flex-col '>
                                        {/* <label className='text-md py-2 text-darkTextColor' htmlFor=''>
                                            Project Code
                                        </label>
                                        <div className='remove_margin'>
                                            <FloatingSelectfield label={''}  name='projectCode' optionsGroup={projectCode} value={formState.values.projectCode || ''} onChange={handleChange} />
                                        </div> */}
                                        <label className='text-md py-2 text-darkTextColor' htmlFor=''>
                                            Project Name
                                        </label>
                                        <div className='remove_margin'>
                                            <FloatingSelectfield width='w-full' label={''}  name='projectName' optionsGroup={projectName} value={formState.values.projectName || ''} onChange={handleChange} />
                                        </div>

                                        {/* <LabelWithRefresh label={'Managers'} onClick={handleGetAllMembers} /> */}
                                        <label className='text-lg py-2 text-darkTextColor' htmlFor=''>
                                        Managers
                                        </label>
                                        <div className='remove_margin'>
                                            <MultiSelectDropDown
                                                selectedValues={formState.values.manager || []}
                                                value={formState.values.manager || []}
                                                handleChangeMultiSelector={handleChangeMultiSelector}
                                                name={'manager'}
                                                option={users?.filter(function (d) {
                                                    return d.role === 'manager';
                                                })}
                                            />{' '}
                                        </div>

                                        {/* <LabelWithRefresh label={'Owner'} onClick={handleGetAllMembers} /> */}
                                        <label className='text-lg py-2 text-darkTextColor' htmlFor=''>
                                        Owner
                                        </label>
                                        <div className='remove_margin'>
                                            <MultiSelectDropDown
                                                value={formState.values.owner || []}
                                                selectedValues={formState.values.owner || []}
                                                handleChangeMultiSelector={handleChangeMultiSelector}
                                                name={'owner'}
                                                option={users?.filter(function (d) {
                                                    return d.role === 'owner';
                                                })}
                                            />
                                        </div>

                                        {/* <LabelWithRefresh label={'Members'} onClick={handleGetAllMembers} /> */}
                                        <label className='text-lg py-2 text-darkTextColor' htmlFor=''>
                                        Members
                                        </label>
                                        <div className='remove_margin'>
                                            <MultiSelectDropDown
                                                selectedValues={formState.values.user || []}
                                                value={formState.values.user || []}
                                                handleChangeMultiSelector={handleChangeMultiSelector}
                                                name={'user'}
                                                option={users?.filter(function (d) {
                                                    return d.role === 'member';
                                                })}
                                            />{' '}
                                        </div>

                                        {/* <LabelWithRefresh label={'Sponsor'} onClick={handleGetAllMembers} /> */}
                                        <label className='text-lg py-2 text-darkTextColor' htmlFor=''>
                                        Sponsor
                                        </label>
                                        <div className='remove_margin'>
                                            <MultiSelectDropDown
                                                selectedValues={formState.values.sponsor || []}
                                                value={formState.values.sponsor || []}
                                                handleChangeMultiSelector={handleChangeMultiSelector}
                                                name={'sponsor'}
                                                option={users?.filter(function (d) {
                                                    return d.role === 'sponsor';
                                                })}
                                            />{' '}
                                        </div>
                                    </div>
                                    <label className='text-md py-2 text-darkTextColor' htmlFor=''>
                                        Actual Budget
                                    </label>
                                    <div className='sm:flex gap-2 items-center'>
                                        <div className='flex flex-col sm:w-2/4'>
                                            <label className='text-base py-2 text-darkTextColor' htmlFor=''>
                                                Greater than
                                            </label>
                                            <div className='remove_margin'>
                                                <FloatingTextfield
                                                    type='number'
                                                    name='max'
                                                    value={formState.values.actualBudget.max || ''}
                                                    onChange={event => {
                                                        const newValue = event.target.value;
                                                        if (newValue < 0) {
                                                            event.target.value = '0';
                                                        } else {
                                                            handleChange(event, 'actualBudget');
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className='input_box flex flex-col sm:w-2/4'>
                                            <label className='text-base py-2 text-darkTextColor' htmlFor=''>
                                                Less than
                                            </label>
                                            <div className='remove_margin'>
                                                <FloatingTextfield
                                                    type='number'
                                                    name='min'
                                                    value={formState.values.actualBudget.min || ''}
                                                    onChange={event => {
                                                        const newValue = event.target.value;
                                                        if (newValue < 0) {
                                                            event.target.value = '0';
                                                        } else {
                                                            handleChange(event, 'actualBudget');
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <label className='text-md py-2 text-darkTextColor' htmlFor=''>
                                        Planned Budget
                                    </label>
                                    <div className='sm:flex gap-2 items-center'>
                                        <div className='flex flex-col sm:w-2/4'>
                                            <label className='text-base py-2 text-darkTextColor' htmlFor=''>
                                                Greater than
                                            </label>
                                            <div className='remove_margin'>
                                                <FloatingTextfield
                                                    type='number'
                                                    name='max'
                                                    value={formState.values.plannedBudget.max || ''}
                                                    onChange={event => {
                                                        const newValue = event.target.value;
                                                        if (newValue < 0) {
                                                            event.target.value = '0';
                                                        } else {
                                                            handleChange(event, 'planBudget');
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className='input_box flex flex-col sm:w-2/4'>
                                            <label className='text-base py-2 text-darkTextColor' htmlFor=''>
                                                Less than
                                            </label>
                                            <div className='remove_margin'>
                                                <FloatingTextfield
                                                    type='number'
                                                    name='min'
                                                    value={formState.values.plannedBudget.min || ''}
                                                                    onChange={event => {
                                                        const newValue = event.target.value;
                                                        if (newValue < 0) {
                                                            event.target.value = '0';
                                                        } else {
                                                            handleChange(event, 'planBudget');
                                                        }
                                                    }}                                  

                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <label className='text-md py-2 text-darkTextColor' htmlFor=''>
                                        Currency Type
                                    </label>

                                    <FloatingSelectfield label={''} optionsGroup={currencyList} name={'currencyType'} value={formState.values.currencyType || ''} onChange={handleChange} />

                                    <label className='text-md py-2 text-darkTextColor' htmlFor=''>
                                        Created
                                    </label>
                                    <div className='sm:flex gap-2 items-center'>
                                        <div className='flex flex-col sm:w-2/4'>
                                            <label className='text-base py-2 text-darkTextColor' htmlFor=''>
                                                From:
                                            </label>
                                            <div className='remove_margin'>
                                                <FloatingTextfield
                                                    type='date'
                                                    name={'startDate'}
                                                    value={formState.values.createdAt.startDate ? formatDate(formState.values.createdAt.startDate) : ''}
                                                    onChange={event => {
                                                        handleChange(event, 'createdAt');
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className='input_box flex flex-col sm:w-2/4'>
                                            <label className='text-base py-2 text-darkTextColor' htmlFor=''>
                                                To:
                                            </label>
                                            <div className='remove_margin'>
                                                <FloatingTextfield
                                                    type='date'
                                                    name={'endDate'}
                                                    value={formState.values.createdAt.endDate ? formatDate(formState.values.createdAt.endDate) : ''}
                                                    onChange={event => {
                                                        handleChange(event, 'createdAt');
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <label className='text-md py-2 text-darkTextColor' htmlFor=''>
                                        Updated
                                    </label>
                                    <div className='sm:flex gap-2 items-center'>
                                        <div className='flex flex-col sm:w-2/4'>
                                            <label className='text-base py-2 text-darkTextColor' htmlFor=''>
                                                From:
                                            </label>
                                            <div className='remove_margin'>
                                                <FloatingTextfield
                                                    type='date'
                                                    name={'startDate'}
                                                    value={formState.values.updatedAt.startDate ? formatDate(formState.values.updatedAt.startDate) : ''}
                                                    onChange={event => {
                                                        handleChange(event, 'updatedAt');
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className='input_box flex flex-col sm:w-2/4'>
                                            <label className='text-base py-2 text-darkTextColor' htmlFor=''>
                                                To:
                                            </label>
                                            <div className='remove_margin'>
                                                <FloatingTextfield
                                                    type='date'
                                                    name={'endDate'}
                                                    value={formState.values.updatedAt.endDate ? formatDate(formState.values.updatedAt.endDate) : ''}
                                                    onChange={event => {
                                                        handleChange(event, 'updatedAt');
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='content-center sm:mt-8 my-2'>
                                        <div className='flex justify-center items-center sm:gap-5 gap-4 '>
                                            <button
                                                onClick={event => {
                                                    setIsOpen(false);
                                                    handleFiterData(formState.values);
                                                }}
                                                type='button'
                                                className='small-button items-center xs:w-full flex sm:text-md text-base'>
                                                Apply Filter
                                            </button>
                                            <div
                                                onClick={() => {
                                                    handleReset();
                                                }}
                                                className='hover:text-darkBlue cursor-pointer text-lightTextColor'>
                                                Reset
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </article>
                    </section>
                    <section
                        className=' w-screen h-full cursor-pointer '
                        onClick={() => {
                            setIsOpen(false);
                        }}></section>
                </main>
            </>
        </>
    );
}
