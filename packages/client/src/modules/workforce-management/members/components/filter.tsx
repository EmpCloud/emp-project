import { FloatingSelectfield } from '@COMPONENTS/FloatingSelectfield';
import { FiFilter } from '@react-icons/all-files/fi/FiFilter';
import React, { useState, useEffect } from 'react';
import FloatingTextfield from '../../../../components/FloatingTextfield';
import NewToolTip from '../../../../components/NewToolTip';
import { displayErrorMessage } from '../../../../helper/function';
import { RxReset } from 'react-icons/rx';
export default function RoleFilter({ roleDetail, setSortTable,handleGetFilterMember,setType, handleGetAllUser,setFilterData, inviteStatus ,type}) {
    const [isOpen, setIsOpen] = useState(false);
    const initialState = {
        isValid: false,
        values: {
            lastName: null,
            firstName: null,
            email: null,
            projectCount: {
                min: null,
                max: null,
            },
            taskCount: {
                min: null,
                max: null,
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
        touched: {},
        errors: {},
    };

    const [formState, setFormState] = useState({ ...initialState });

    useEffect(() => {
        // document.querySelector('body').classList.add('bg-slate-50');
    }, []);
    const handleChange = (event, type = null) => {
        event.preventDefault();
        if (type) {
            if (type === 'projectCount') {
                setFormState(formState => ({
                    ...formState,
                    values: {
                        ...formState.values,
                        projectCount: {
                            ...formState.values.projectCount,
                            [event.target.name]: event.target.value,
                        },
                    },
                }));
            }
            if (type === 'taskCount') {
                setFormState(formState => ({
                    ...formState,
                    values: {
                        ...formState.values,
                        taskCount: {
                            ...formState.values.taskCount,
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
            touched: {
                ...formState.touched,
                [name]: true,
            },
        }));
    };
    const hasError = field => !!(formState.touched[field] && formState.errors[field]);
    function handleReset() {
        setIsOpen(false);
        handleGetAllUser('?invitationStatus=' + inviteStatus+'&suspensionStatus=false');
        setFormState({ ...initialState });
    }
    return (
        <>
                <div className='flex gap-1'>

                <NewToolTip direction='top' message={'Filter'}>
                    {' '}
                    <div
                        className='xs:hidden border border-veryLightGrey text-xl px-2 py-1 rounded-lg cursor-pointer mr-2'
                        onClick={() => {
                            setIsOpen(!isOpen);
                        }}>
                        <FiFilter className='text-defaultTextColor' />
                    </div>
                </NewToolTip>
                <NewToolTip direction='top' message={'Reset'}>
                    {' '}
                    <div
                        className='xs:hidden border border-veryLightGrey text-xl px-2 py-1 rounded-lg cursor-pointer '
                        onClick={() => {
                            handleReset();
                        }}>
                        <RxReset className='text-defaultTextColor' />
                    </div>
                </NewToolTip>
            </div>
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
                                <p className='text-darkTextColor sm:text-xl text-2xl font-bold'>Filters</p>
                                <div className='input_box flex flex-col '>
                                    <label className='text-md py-2 text-darkTextColor' htmlFor=''>
                                        First Name
                                    </label>
                                    <div className='remove_margin'>
                                        <FloatingTextfield
                                            type='text'
                                            label={''}
                                            name='firstName'
                                            value={formState.values.firstName || ''}
                                            onChange={handleChange}
                                            error={hasError('firstName')}
                                            errorMsg={displayErrorMessage(formState.errors.firstName)}
                                        />
                                    </div>
                                    <label className='text-md py-2 text-darkTextColor' htmlFor=''>
                                        Last Name
                                    </label>
                                    <div className='remove_margin'>
                                        <FloatingTextfield
                                            type='text'
                                            label={''}
                                            name='lastName'
                                            value={formState.values.lastName || ''}
                                            onChange={handleChange}
                                            error={hasError('lastName')}
                                            errorMsg={displayErrorMessage(formState.errors.lastName)}
                                        />
                                    </div>
                                    <label className='text-md py-2 text-darkTextColor' htmlFor=''>
                                        Email{' '}
                                    </label>
                                    <div className='remove_margin'>
                                        <FloatingTextfield
                                            type='text'
                                            label={''}
                                            name='email'
                                            value={formState.values.email || ''}
                                            onChange={handleChange}
                                            error={hasError('email')}
                                            errorMsg={displayErrorMessage(formState.errors.email)}
                                        />
                                    </div>

                                    <label className='text-md py-2 text-darkTextColor' htmlFor=''>
                                        Project Count
                                    </label>
                                    <div className='sm:flex gap-10 items-center'>
                                        <div className='flex flex-col sm:w-2/4'>
                                            <label className='text-base py-2 text-darkTextColor' htmlFor=''>
                                                Greater Than
                                            </label>
                                            <div className='remove_margin'>
                                                <FloatingTextfield
                                                    type='number'
                                                    name='min'
                                                    value={formState.values.projectCount.min ?? ''}
                                                    onChange={event => {
                                                        const newValue = event.target.value;
                                                        if (newValue < 0) {
                                                            event.target.value = '0';
                                                        } else {
                                                            handleChange(event, 'projectCount');
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
                                                    name='max'
                                                    value={formState.values.projectCount.max ?? ''}
                                                    onChange={event => {
                                                        const newValue = event.target.value;
                                                        if (newValue < 0) {
                                                            event.target.value = '0';
                                                        } else {
                                                            handleChange(event, 'projectCount');
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <label className='text-md py-2 text-darkTextColor' htmlFor=''>
                                    Task Count
                                </label>
                                <div className='sm:flex gap-10 items-center'>
                                    <div className='flex flex-col sm:w-2/4'>
                                        <label className='text-base py-2 text-darkTextColor' htmlFor=''>
                                            Greater Than
                                        </label>
                                        <div className='remove_margin'>
                                            <FloatingTextfield
                                                type='number'
                                                name='min'
                                                value={formState.values.taskCount.min ?? ''}
                                                onChange={event => {
                                                    const newValue = event.target.value;
                                                    if (newValue < 0) {
                                                        event.target.value = '0';
                                                    } else {
                                                        handleChange(event, 'taskCount');
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
                                                name='max'
                                                value={formState.values.taskCount.max ?? ''}
                                                onChange={event => {
                                                    const newValue = event.target.value;
                                                    if (newValue < 0) {
                                                        event.target.value = '0';
                                                    } else {
                                                        handleChange(event, 'taskCount');
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <label className='text-md py-2 text-darkTextColor' htmlFor=''>
                                    Roles
                                </label>
                                <div className='remove_margin'>
                                    <FloatingSelectfield
                                        optionsGroup={roleDetail}
                                        label={''}
                                        name='role'
                                        value={formState.values.role || ''}
                                        onChange={handleChange}
                                        error={hasError('role')}
                                        errorMsg={displayErrorMessage(formState.errors.role)}
                                    />
                                </div>

                                <label className='text-md py-2 text-darkTextColor' htmlFor=''>
                                    Created
                                </label>
                                <div className='sm:flex gap-10 items-center'>
                                    <div className='flex flex-col sm:w-2/4'>
                                        <label className='text-base py-2 text-darkTextColor' htmlFor=''>
                                            To:
                                        </label>
                                        <div className='remove_margin'>
                                            <FloatingTextfield
                                                type='date'
                                                name={'startDate'}
                                                label={''}
                                                error={hasError('startDate')}
                                                errorMsg={displayErrorMessage(formState.errors.startDate)}
                                                value={formState.values.createdAt.startDate || ''}
                                                onChange={event => {
                                                    handleChange(event, 'createdAt');
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className='input_box flex flex-col sm:w-2/4'>
                                        <label className='text-base py-2 text-darkTextColor' htmlFor=''>
                                            From:
                                        </label>
                                        <div className='remove_margin'>
                                            <FloatingTextfield
                                                type='date'
                                                name={'endDate'}
                                                label={''}
                                                error={hasError('endDate')}
                                                errorMsg={displayErrorMessage(formState.errors.endDate)}
                                                value={formState.values.createdAt.endDate || ''}
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
                                <div className='sm:flex gap-10 items-center'>
                                    <div className='flex flex-col sm:w-2/4'>
                                        <label className='text-base py-2 text-darkTextColor' htmlFor=''>
                                            To:
                                        </label>
                                        <div className='remove_margin'>
                                            <FloatingTextfield
                                                type='date'
                                                name={'startDate'}
                                                label={''}
                                                error={hasError('startDate')}
                                                errorMsg={displayErrorMessage(formState.errors.startDate)}
                                                value={formState.values.updatedAt.startDate || ''}
                                                onChange={event => {
                                                    handleChange(event, 'updatedAt');
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className='input_box flex flex-col sm:w-2/4'>
                                        <label className='text-base py-2 text-darkTextColor' htmlFor=''>
                                            From:
                                        </label>
                                        <div className='remove_margin'>
                                            <FloatingTextfield
                                                type='date'
                                                name={'endDate'}
                                                label={''}
                                                error={hasError('endDate')}
                                                errorMsg={displayErrorMessage(formState.errors.endDate)}
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
                                                setFilterData(formState.values);
                                                setType("filter")
                                                setSortTable({
                                                    skip: 10,
                                                    limit: 10,
                                                    pageNo: 1,
                                                })
                                            }}
                                            type='button'
                                            className='small-button items-center xs:w-full flex sm:text-md text-base'>
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
