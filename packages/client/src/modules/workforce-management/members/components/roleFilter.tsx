import { FiFilter } from '@react-icons/all-files/fi/FiFilter';
import React, { useState, useEffect } from 'react';
import validate from 'validate.js';
import { FloatingSelectfield } from '../../../../components/FloatingSelectfield';
import MultiSelectDropDown from '../../../../components/MultiSelectDropDown';
import NewToolTip from '../../../../components/NewToolTip';
import { displayErrorMessage } from '../../../../helper/function';
import { getAllRoles } from '../api/get';
import { RxReset } from 'react-icons/rx';
import Cookies from 'js-cookie';
import { getAllUsers } from '@WORKFORCE_MODULES/reports/projects/api/get';
export default function RoleFilter({ userObject, handleGetFilterRole, handleGetAllRoles ,type,permission,setFilterData,setType}) {
    const [isOpen, setIsOpen] = useState(false);
    const [roleName, setRoleNames] = useState([]);

    const initialState = {
        isValid: false,
        values: {
            roleName: null,
            assignMember: [],
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
    useEffect(() => {}, [formState.values, formState.isValid]);
    useEffect(() => {
        // document.querySelector('body').classList.add('bg-slate-50');
        if(permission?.roles.view === true || Cookies.get("isAdmin") === "true" &&isOpen ===true)
        getAllRoles('limit='+process.env.TOTAL_USERS).then(response => {
            if (response.data.body.status === 'success') {
                setRoleNames(response.data?.body.data.totalRolesData);
            }
        });
    }, [permission,isOpen]);
    const handleGetAllUser = (condition = '') => {
        getAllUsers(condition).then(response => {
            if (response.data.body.status === 'success') {
                setUserObject(response.data?.body.data.users);
            }
        });
    };
    const handleChange = (event, type = null) => {
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
        handleGetAllRoles();
        setIsOpen(false);
        setType(null);
    }

    return (
        <>
            {/* <button>
                <span className="text-2xl grey-link" onClick={() => setIsOpen(!isOpen)}>
                    <FiFilter />
                </span>
            </button> */}
            {/* <NewToolTip direction='left' message={'Filter'}>
                {' '}
                <div className='xs:hidden border border-veryLightGrey text-2xl px-3 py-2 rounded-lg cursor-pointer' onClick={() => setIsOpen(!isOpen)}>
                    <FiFilter className='text-defaultTextColor' />
                </div>
            </NewToolTip> */}
            {/* {type === 'reset' ? ( */}
                <NewToolTip direction='top' message={'Reset'}>
                    {' '}
                    <div
                        className='xs:hidden border border-veryLightGrey text-xl px-2 py-1 rounded-lg cursor-pointer'
                        onClick={() => {
                            handleReset();
                        }}>
                        <RxReset className='text-defaultTextColor' />
                    </div>
                </NewToolTip>
            {/* ) : ( */}
                <NewToolTip direction='top' message={'Filter'}>
                    {' '}
                    <div
                        className='xs:hidden border border-veryLightGrey text-xl px-2 py-1 rounded-lg cursor-pointer'
                        onClick={() => setIsOpen(!isOpen)}>
                        <FiFilter className='text-defaultTextColor' />
                    </div>
                </NewToolTip>
            {/* )} */}
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
                                <p className='text-darkTextColor sm:text-xl text-2xl font-bold'>Role Filters</p>
                                <div className='input_box flex flex-col '>
                                    {/* <label className='text-lg py-2 text-darkTextColor' htmlFor=''>
                                        Select Role Name
                                    </label> */}
                                    <div className='mt-10'>
                                    <div className='remove_margin'>
                                        <FloatingSelectfield
                                            label={"Select the role"}
                                            optionsGroup={roleName?.map(d => {
                                                return { text: d?.role ?? d?.roles, value: d?.role ?? d?.roles };
                                            })}
                                            name={'roleName'}
                                            value={formState?.values?.roleName || ''}
                                            onChange={handleChange}
                                            error={hasError('projectId')}
                                            errorMsg={null}
                                            placeholder={'Select the role'}
                                        />
                                    </div>
                                    </div>

                                    {/* <label className='text-lg py-2 text-darkTextColor' htmlFor=''>
                                        Role Assign Members{' '}
                                    </label> */}
                                      <div className='mt-10'>
                                    <div className='remove_margin'>
                                        <MultiSelectDropDown
                                            label={"Select members"}
                                            selectedValues={formState.values.assignMember || []}
                                            handleChangeMultiSelector={handleChangeMultiSelector}
                                            name={'assignMember'}
                                            value={formState.values.assignMember || []}
                                            option={ userObject
                                                .map(d => {
                                                    return { value: d, key: d.firstName + ' ' + d.lastName ,id:d._id};
                                                })}
                                        />
                                    </div>
                                </div>
                                </div>
                                {/* <label className='text-lg py-2 text-darkTextColor' htmlFor=''>
                                    Created
                                </label>
                                <div className='sm:flex gap-10 items-center'>
                                    <div className='flex flex-col sm:w-2/4'>
                                        <label className='text-sm py-2 text-darkTextColor' htmlFor=''>
                                            Start Date
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
                                        <label className='text-sm py-2 text-darkTextColor' htmlFor=''>
                                            End Date
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
                                <label className='text-lg py-2 text-darkTextColor' htmlFor=''>
                                    Updated
                                </label>
                                <div className='sm:flex gap-10 items-center'>
                                    <div className='flex flex-col sm:w-2/4'>
                                        <label className='text-sm py-2 text-darkTextColor' htmlFor=''>
                                            Start Date
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
                                        <label className='text-sm py-2 text-darkTextColor' htmlFor=''>
                                            End Date
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
                                </div> */}
                                <div className='content-center sm:mt-8 my-2'>
                                    <div className='flex justify-center items-center sm:gap-5 gap-4 '>
                                        <button
                                            onClick={event => {
                                                let assignMember = formState.values.assignMember.map(function (d) {
                                                    return { id: d._id };
                                                });
                                                setIsOpen(false);
                                                handleGetFilterRole('?sort=asc', { ...formState.values, assignMember: assignMember });
                                                setFilterData({ ...formState.values, assignMember: assignMember });
                                                setType("filter")
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
