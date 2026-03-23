/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react';
import validate from 'validate.js';
import FloatingTextfield from '../../../../components/FloatingTextfield';
import { isRequiredErrorMessage, OrgId, roleList } from '../../../../helper/exportData';
import { displayErrorMessage, openUpgradePlan, uniqueArrays } from '../../../../helper/function';
import { addGroupApi } from '../api/post';
import toast from '../../../../components/Toster/index';
import { TextArea } from '../../../../components/TextArea';
import MultiSelectDropDown from '../../../../components/MultiSelectDropDown';
import { BiEdit, BiUserPlus } from 'react-icons/bi';
import { updateGroupApi } from '../api/put';
import { MdModeEditOutline } from 'react-icons/md';
import { groupDescriptionSchema, groupNameSchema, requiredSchema } from '@HELPER/schema';
const addGroup = ({ type, handleGetAllGroups, data, users }) => {
            const [showModal, setShowModal] = useState(false);
        const initialState = {
        isValid: false,
        values: {
            groupName: data ? data.groupName : null,
            groupDescription: data ? data.groupDescription : null,
            groupLogo: data ? data.groupLogo : null,
            assignedMembers: data ? data.assignedMembers : [],
        },
        touched: {},
        errors: {
            groupName: null,
            groupDescription: null,
            groupLogo: null,
        },
    };
    const schema = {
        groupName: groupNameSchema,
        groupDescription: groupDescriptionSchema,
        assignedMembers: requiredSchema,
    };
    const [formState, setFormState] = useState({ ...initialState });
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
    }, [users, data]);
    const hasError = field => !!(formState.touched[field] && formState.errors[field]);
    const handleChange = event => {
        event.persist();
        setFormState(formState => ({
            ...formState,
            values: {
                ...formState.values,
                [event.target.name]: event.target.value,
                groupLogo: 'https://api.dicebear.com/5.x/icons/svg?seed=' + formState.values.groupName,
            },
            touched: {
                ...formState.touched,
                [event.target.name]: true,
            },
        }));
    };
    const handleChangeMultiSelector = (data, name, type) => {
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
    useEffect(() => {
        setFormState({ ...initialState });
      }, [data]);
    const handleAddEditGroup = event => {
        event.preventDefault();
        if (type === 'add') {
            addGroupApi({
                ...formState.values,
                assignedMembers: formState.values.assignedMembers.map(d => {
                    return { userId: d._id };
                }),
            })
                .then(function (result) {
                    if (result.data.body.status == 'success') {
                        handleGetAllGroups();
                        toast({
                            type: 'success',
                            message: result ? result.data.body.message : 'Try again !',
                        });
                        setFormState({ ...initialState });
                    } else {
                        toast({
                            type: 'error',
                            message: result ? result.data.body.message : 'Error',
                        });
                    }
                    setShowModal(false);
                })
                .catch(function ({response}) {
                    if (response.status === 429) {
                        openUpgradePlan();
                      } else {
                    toast({
                        type: 'error',
                        message: response ? response.data.body.message : 'Something went wrong, Try again !',
                    });}
                });
            setShowModal(false);
        } else {
            updateGroupApi(data._id, {
                ...formState.values,
                assignedMembers: formState.values.assignedMembers.map(d => {
                    return { userId: d };
                }),
            })
                .then(function (result) {
                    if (result.data.body.status == 'success') {
                                                handleGetAllGroups();
                        toast({
                            type: 'success',
                            message: result ? result.data.body.message : 'Try again !',
                        });
                        setFormState({ ...initialState });
                    } else {
                        toast({
                            type: 'error',
                            message: result ? result.data.body.message : 'Error',
                        });
                    }
                    setShowModal(false);
                })
                .catch(function (e) {
                    toast({
                        type: 'error',
                        message: e.response ? (e.response.data.body.message == 'Validation failed.' ? e.response.data.body.error : e.response.data.body.message) : 'Something went wrong, Try again !',
                    });
                });
            setShowModal(false);
        }
    };
    return (
        <>
            {type === 'add' ? (
                <button
                    className='small-button items-center xs:w-full py-2 flex h-9 '
                    onClick={() => {
                        setShowModal(true);
                        setFormState({ ...initialState });
                    }}>
                    Add Group
                </button>
            ) : (
                <button
                    className='grey-link text-lg cursor-pointer'
                    onClick={() => {
                        setShowModal(true);
                    }}>
                    <MdModeEditOutline />
                </button>
            )}
            {showModal && (
                <>
                    <div className='justify-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-[10000] outline-none focus:outline-none'>
                        <div className='relative my-2 mx-auto w-8/12 lg:w-2/5 z-50'>
                            {/*content*/}
                            <div className='border-0 mb-7 sm:mt-8 rounded-2xl shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none'>
                                {/*header*/}
                                {/*body*/}
                                <div className='relative py-5 sm:px-3 p-3 md:px-10 flex-auto'>
                                    <button
                                        className='text-lightGrey hover:text-darkTextColor absolute -right-2 -top-2 rounded-full bg-veryLightGrey  uppercase  text-sm outline-none focus:outline-none p-1 ease-linear transition-all duration-150'
                                        type='button'
                                        onClick={() => setShowModal(false)}>
                                        <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' stroke-width='2'>
                                            <path stroke-linecap='round' stroke-linejoin='round' d='M6 18L18 6M6 6l12 12' />
                                        </svg>
                                    </button>
                                    <div className='rounded-lg bg-white'>
                                        {/* body task popup start here */}
                                        <div className=''>
                                            <div className='text-center'>
                                                <p className='text-2xl font-bold text-darkTextColor my-2'>{type === 'add' ? 'Add Group' : 'Edit Group'}</p>
                                                    <div className='my-5'>
                                                    <FloatingTextfield
                                                        type='text'
                                                        placeholder={''}
                                                        label={'Group Name *'}
                                                        error={hasError('groupName')}
                                                        errorMsg={displayErrorMessage(formState.errors.groupName)}
                                                        name='groupName'
                                                        value={formState.values.groupName}
                                                        onChange={handleChange}
                                                    />
                                                    </div>
                                                    <div className='my-5'>
                                                    <TextArea
                                                        type='text'
                                                        placeholder={''}
                                                        label={'Group Description *'}
                                                        error={hasError('groupDescription')}
                                                        errorMsg={displayErrorMessage(formState.errors.groupDescription)}
                                                        name='groupDescription'
                                                        value={formState.values.groupDescription}
                                                        onChange={handleChange}
                                                    />
                                                    </div>
                                                    <div className='my-5'>
                                                        <MultiSelectDropDown
                                                            handleChangeMultiSelector={handleChangeMultiSelector}
                                                            name={'assignedMembers'}
                                                            label={'Assigned Members *'}
                                                            value={formState.values.assignedMembers}
                                                            option={uniqueArrays(users ? users : [])}
                                                            selectedValues={formState.values.assignedMembers}
                                                            //.filter((item)=>{
                                                            //   return item.role === "member";
                                                            //})
                                                        />
                                                        </div>
                                                <div className='my-2 flex justify-center'>
                                                    <button disabled={!formState.isValid} className='small-button items-center xs:w-full flex sm:text-md text-sm' onClick={handleAddEditGroup}>
                                                        {type === 'edit' ? 'Save Changes' : 'Create Group'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        {/* body task popup end here */}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='opacity-25 fixed inset-0 z-100 bg-black' onClick={() => setShowModal(false)}></div>
                    </div>
                </>
            )}
        </>
    );
};
export default addGroup;
