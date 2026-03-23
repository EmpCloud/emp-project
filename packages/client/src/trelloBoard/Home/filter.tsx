/* eslint-disable react-hooks/rules-of-hooks */
import { FiFilter } from '@react-icons/all-files/fi/FiFilter';
import React, { useState, useEffect } from 'react';
import validate from 'validate.js';
// import { FloatingSelectfield } from '../../../../components/FloatingSelectfield';
// import FloatingTextfield from '../../../../components/FloatingTextfield';
// import MultiSelectDropDown from '../../../../components/MultiSelectDropDown';
import NewToolTip from '@COMPONENTS/NewToolTip';
// import { isRequiredErrorMessage, usersDummyData } from '../../../../helper/exportData';
// import { displayErrorMessage } from '../../../../helper/function';
import { getAllProject } from '@WORKFORCE_MODULES/projects/api/get';
import { RxReset } from 'react-icons/rx';

export default function taskFilter({ handleGetFilterTask, users, statusDetails, handleGetAllTask, type,taskTypeDetails,categories,stages }) {
    const [isOpen, setIsOpen] = useState(false);
    const [projectList, setProjectList] = useState(false);
    const initialState = {
        isValid: false,
        values: {
            projectName: null,
            taskTitle: null,
            taskCreator: null,
            assignedTo:null,
            taskType:null,
            category:null,
            taskStatus: null,
            stageName:null,
            createdAt: {
                startDate: null,
                endDate: null,
            },
            updatedAt: {
                startDate: null,
                endDate: null,
            },
        },
        touched: {},
        errors: {
            projectName: null,
            email: null,
            plannedGreater: null,
            plannedLess: null,
            actualGreater: null,
            actualLess: null,
            createdStartDate: null,
            createdEndDate: null,
            updatedStartDate: null,
            updatedEndDate: null,
            owners: null,
            managers: null,
        },
    };

    const [formState, setFormState] = useState({ ...initialState });
    useEffect(() => {
        // document.querySelector('body').classList.add('bg-slate-50');
    }, [formState]);
    useEffect(() => {
        getAllProject().then(response => {
            if (response.data?.body.status === 'success') {
                var projectList = response.data?.body.data.project.map(function (project) {
                    return {
                        text: project.projectName,
                        value: project.projectName,
                    };
                });
                setProjectList(projectList);
            }
        });
    }, []);
    const handleChange = (event, type) => {
        event.preventDefault();

        if (type) {
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
            touched: {
                ...formState.touched,
                [name]: true,
            },
        }));
    };
    const hasError = field => !!(formState.touched[field] && formState.errors[field]);
    function handleReset() {
        setFormState({ ...initialState });
        handleGetAllTask();
        setIsOpen(false);
    }
    return (
        <>
            {type === 'reset' ? (
                <NewToolTip direction='left' message={'Reset'}>
                    {' '}
                    <div
                        className='xs:hidden border border-veryLightGrey text-2xl px-3 py-2 rounded-lg cursor-pointer'
                        onClick={() => {
                            handleReset();
                        }}>
                        <RxReset className='text-defaultTextColor' />
                    </div>
                </NewToolTip>
            ) : (
              
                    
                    <div
                        className='xs:hidden border border-veryLightGrey text-2xl px-3 py-2 rounded-lg cursor-pointer'
                        onClick={() => {
                            setIsOpen(!isOpen);
                        }}>
                        <FiFilter className='text-defaultTextColor' />
                    </div>
            )}

            <main
                className={
                    ' fixed overflow-hidden z-[999] bg-gray-900 bg-opacity-25 inset-0 transform ease-in-out ' +
                    (isOpen ? ' transition-opacity opacity-100 duration-500 translate-x-0 ' : ' transition-all delay-500 opacity-0 translate-x-full  ')
                }>
                <section
                    className={
                        ' w-screen max-w-lg right-0 absolute bg-white h-full shadow-xl delay-400 duration-500 ease-in-out transition-all transform  ' +
                        (isOpen ? ' translate-x-0 ' : ' translate-x-full ')
                    }>
                    <article className='relative w-screen max-w-lg pb-10 flex flex-col space-y-6 overflow-y-scroll h-full'>
                        <div className='p-4'>
                            <div className=''>
                                <p className='text-darkTextColor sm:text-xl text-2xl font-bold'>Filters...</p>
                                <div className='input_box flex flex-col '>
                                    <label className='text-lg py-2 text-darkTextColor' htmlFor=''>
                                        Project Name
                                    </label>
                                    <div className='remove_margin'>
                                        <input
                                            label={'Select the project'}
                                            optionsGroup={projectList}
                                            name={'projectName'}
                                            value={formState.values.projectName || ''}
                                            onChange={handleChange}
                                            error={hasError('projectName')}
                                            errorMsg={null}
                                        />
                                    </div>

                                    <label className='text-lg py-2 text-darkTextColor' htmlFor=''>
                                        Task
                                    </label>
                                    <div className='remove_margin'>
                                        <input
                                            type='text'
                                            label={''}
                                            name='taskTitle'
                                            value={formState.values.taskTitle || ''}
                                            onChange={handleChange}
                                            error={hasError('taskTitle')}
                                            errorMsg={null}
                                        />
                                    </div>

                                    {/* <label className='text-lg py-2 text-darkTextColor' htmlFor=''>
                                        Task Created By{' '}
                                    </label>
                                    <div className='remove_margin'>
                                        <FloatingSelectfield
                                            label={'Select the creator'}
                                            type='text'
                                            optionsGroup={users?.map(d => {
                                                return { text: d.value.firstName + ' ' + d.value.lastName, value: d.value._id };
                                            })}
                                            name={'taskCreator'}
                                            onChange={handleChange}
                                            value={formState.values.taskCreator || ''}
                                            error={hasError('taskCreator')}
                                            errorMsg={displayErrorMessage(formState.errors.taskCreator)}
                                        />
                                    </div> */}
                                    <label className='text-lg py-2 text-darkTextColor' htmlFor=''>
                                    Assigned To{' '}
                                    </label>
                                    <div className='remove_margin'>
                                        <input
                                            label={'Select the User'}
                                            type='text'
                                            optionsGroup={users?.map(d => {
                                                return { text: d.value.firstName + ' ' + d.value.lastName, value: d.value._id };
                                            })}
                                            name={'assignedTo'}
                                            onChange={handleChange}
                                            value={formState.values.assignedTo || ''}
                                            error={hasError('assignedTo')}
                                            errorMsg={null}
                                        />
                                    </div>
                                    <label className='text-lg py-2 text-darkTextColor' htmlFor=''>
                                    Task Type{' '}
                                    </label>
                                    <div className='remove_margin'>
                                        <input
                                            label={'Select Task type'}
                                            type='text'
                                            optionsGroup={taskTypeDetails}
                                            name={'taskType'}
                                            onChange={handleChange}
                                            value={formState.values.taskType || ''}
                                            error={hasError('taskType')}
                                            errorMsg={null}
                                        />
                                    </div>
                                    <label className='text-lg py-2 text-darkTextColor' htmlFor=''>
                                    Category{' '}
                                    </label>
                                    <div className='remove_margin'>
                                        <input
                                            label={'Select Category'}
                                            type='text'
                                            optionsGroup={categories}
                                            name={'category'}
                                            onChange={handleChange}
                                            value={formState.values.category || ''}
                                            error={hasError('category')}
                                            errorMsg={null}
                                        />
                                    </div>
                                    <label className='text-lg py-2 text-darkTextColor' htmlFor=''>
                                        Status{' '}
                                    </label>
                                    <div className='remove_margin'>
                                        <input
                                            label={'Select the status'}
                                            type='text'
                                            optionsGroup={
                                                statusDetails &&
                                                statusDetails.map(d => {
                                                    return { text: d.taskStatus, value: d.taskStatus };
                                                })
                                            }
                                            name={'taskStatus'}
                                            onChange={handleChange}
                                            value={formState.values.taskStatus || ''}
                                            error={hasError('taskStatus')}
                                            errorMsg={null}
                                        />
                                    </div>
                                </div>
                                 <label className='text-lg py-2 text-darkTextColor' htmlFor=''>
                                    Created
                                </label>
                                <div className='sm:flex gap-10 items-center'>
                                    <div className='flex flex-col sm:w-2/4'>
                                        <label className='text-sm py-2 text-darkTextColor' htmlFor=''>
                                            Start Date
                                        </label>
                                        <div className='remove_margin'>
                                            <input
                                                type='date'
                                                name={'startDate'}
                                                value={formState.values.createdAt.startDate || ''}
                                                onChange={event => {
                                                    handleChange(event, 'createdAt');
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className='input_box flex flex-col sm:w-2/4'>
                                        <label className='text-sm py-2 text-darkTextColor' htmlFor=''>
                                            End Date
                                        </label>
                                        <div className='remove_margin'>
                                            <input
                                                type='date'
                                                name={'endDate'}
                                                value={formState.values.createdAt.endDate || ''}
                                                onChange={event => {
                                                    handleChange(event, 'createdAt');
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <label className='text-lg py-2 text-darkTextColor' htmlFor=''>
                                    Updated
                                </label>
                                <div className='sm:flex gap-10 items-center'>
                                    <div className='flex flex-col sm:w-2/4'>
                                        <label className='text-sm py-2 text-darkTextColor' htmlFor=''>
                                            Start Date
                                        </label>
                                        <div className='remove_margin'>
                                            <input
                                                type='date'
                                                name={'startDate'}
                                                value={formState.values.updatedAt.startDate || ''}
                                                onChange={event => {
                                                    handleChange(event, 'updatedAt');
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className='input_box flex flex-col sm:w-2/4'>
                                        <label className='text-sm py-2 text-darkTextColor' htmlFor=''>
                                            End Date
                                        </label>
                                        <div className='remove_margin'>
                                            <input
                                                type='date'
                                                name={'endDate'}
                                                value={formState.values.updatedAt.endDate || ''}
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
                                                handleGetFilterTask(event, formState.values);
                                            }}
                                            type='button'
                                            className='small-button items-center xs:w-full flex sm:text-md text-sm'>
                                            Apply Filter
                                        </button>
                                        <div onClick={handleReset} className='hover:text-darkBlue cursor-pointer text-lightTextColor'>
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
    );
}
