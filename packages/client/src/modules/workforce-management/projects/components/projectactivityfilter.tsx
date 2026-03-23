import React, { useState, useEffect } from 'react';
import { FiFilter } from '@react-icons/all-files/fi/FiFilter';
import { FloatingSelectfield } from '../../../../components/FloatingSelectfield';
import FloatingTextfield from '../../../../components/FloatingTextfield';
import NewToolTip from '../../../../components/NewToolTip';
import { displayErrorMessage } from '../../../../helper/function';
import { useRouter } from 'next/router';

export default function activityFilter({ handleGetFilterActivity, handleGetAllActivity ,setType,setFilterData,projectMembers}) {
    const router = useRouter();
    const { query } = useRouter();
    const [isOpen, setIsOpen] = useState(false)
    const initialState = {
        isValid: false,
        values: {
            firstName: null,
            activityType: 'Project',
            projectId: query.id,
            category: null,
            date: {
                startDate: null,
                endDate: null
            }
        },
        touched: {},
        errors: {
            firstName: null,
            activityType: null,
            projectId: null,
            category: null,
            date: {
                startDate: null,
                endDate: null
            }
        },
    };
    const [formState, setFormState] = useState({ ...initialState });
    const [projectMember,setProjectMembers]=useState(null);
    useEffect(()=>{
        if(projectMembers!==null){
        var members = projectMembers.map(function (data) {
            return {
                text: data.firstName,
                value: data?.firstName,
            };
        });
        setProjectMembers(members);
    }

    },[projectMembers])

    useEffect(() => {
        // document.querySelector('body').classList.add('bg-slate-50');
    }, [formState]);
    const handleChange = (event, type) => {
        event.preventDefault();

        if (type) {
            if (type === 'date') {
                setFormState(formState => ({
                    ...formState,
                    values: {
                        ...formState.values,
                        date: {
                            ...formState.values.date,
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
    const categoryList = [
        { text: 'Updated', value: 'Updated' },
        { text: 'Created', value: 'Created' },
        { text: 'Created/Updated', value: 'Updated/Created' },
        { text: 'Viewed', value: 'Viewed' },
        { text: 'Deleted', value: 'Deleted' },
        { text: 'Searched', value: 'Searched' },
        {text: "Filtered", value: "Filtered"},
        { text: 'Login', value: 'Login' },
        { text: 'Verified', value: 'Verified' },
        { text: 'UpdatedPassword', value: 'UpdatedPassword' },
        { text: 'Reset Password', value: 'Reset Password' },
        { text: 'Selected', value: 'Selected' },
        { text: 'Restored', value: 'Restored' },

    ];
    const hasError = field => !!(formState.touched[field] && formState.errors[field]);
    function handleReset() {
        setFormState({ ...initialState });
        handleGetAllActivity();
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
            <NewToolTip direction='top' message={'Filter'}>
                {' '}
                <div className='xs:hidden border border-veryLightGrey text-xl px-2 py-1 rounded-lg cursor-pointer' onClick={() => setIsOpen(!isOpen)}>
                    <FiFilter className='text-defaultTextColor' />
                </div>
            </NewToolTip>
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
                                    {/* <label className='text-lg py-2 text-darkTextColor' htmlFor=''>
                                       activityType
                                    </label>
                                    <div className='remove_margin'>
                                        <FloatingTextfield type='text' name='projectName' value={formState.values.activityType || ''} onChange={handleChange} />
                                    </div> */}

                                    <label className='text-lg py-2 text-darkTextColor' htmlFor=''>
                                        User Name
                                    </label>
                                    <div className='remove_margin'>
                                         <div className='remove_margin'>
                                        <FloatingSelectfield
                                            // label={'Select the project'}
                                            optionsGroup={projectMember}
                                            name={'firstName'}
                                            value={formState.values.firstName || ''}
                                            onChange={handleChange}
                                            error={hasError('firstName')}
                                            errorMsg={displayErrorMessage(formState.errors.firstName)}
                                        />
                                    </div>
                                    </div>
                                    <label className='text-lg py-2 text-darkTextColor' htmlFor=''>
                                        category
                                    </label>
                                    <div className='remove_margin'>
                                        <FloatingSelectfield
                                            type='text'
                                            label={''}
                                            name='category'
                                            optionsGroup={categoryList}
                                            value={formState.values.category || ''}
                                            onChange={handleChange}
                                            error={hasError('category')}
                                            errorMsg={displayErrorMessage(formState.errors.category)}
                                        />
                                    </div>
                                </div>
                                <label className='text-lg py-2 text-darkTextColor' htmlFor=''>
                                    Date
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
                                                value={formState.values.date.startDate || ''}
                                                onChange={event => {
                                                    handleChange(event, 'date');
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
                                                value={formState.values.date.endDate || ''}
                                                onChange={event => {
                                                    handleChange(event, 'date');
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                {/* <label className='text-lg py-2 text-darkTextColor' htmlFor=''>
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
                                                setIsOpen(false);
                                                setFilterData(formState.values);
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