import React, { useEffect, useState } from 'react';
import validate from 'validate.js';
import FloatingTextfield from '../../../../components/FloatingTextfield';
import { isRequiredErrorMessage, OrgId, roleList } from '../../../../helper/exportData';
import { displayErrorMessage, openUpgradePlan } from '../../../../helper/function';
import { AiOutlineEdit } from '@react-icons/all-files/ai/AiOutlineEdit';
import { addRoleApi } from '../api/post';
import toast from '../../../../components/Toster/index';
import { editRoleApi } from '../api/put';
const addRoles = ({ handleGetAllRoles, showModal, setShowModal, type ,showEditModal, setEditShowModal,rolesData,setRole,role,roleId,setRoleId,handleGetAllUser,setSortTable}) => {
    const initialState = {
        isValid: false,
        values: {
            roles: null,
        },
        touched: {},
        errors: {
            roles: null,
        },
    };
    const schema = {
        roles: {
            presence: { allowEmpty: false, message: isRequiredErrorMessage },
            length: { minimum: 4  , maximum: 30}
        },
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
        const errors = validate(formState.values, schema);
        setFormState(prevFormState => ({
            ...prevFormState,
            isValid: !errors,
            errors: errors || {},
        }));
    }, [formState.values, formState.isValid]);
    useEffect(() => {
        // document.querySelector('body').classList.add('bg-slate-50');
    });
    const hasError = field => !!(formState.touched[field] && formState.errors[field]);
    const handleChange = event => {
        event.persist();
        setFormState(formState => ({
            ...formState,
            values: {
                ...formState.values,
                [event.target.name]: event.target.getAttribute('formate') === 'array' ? [event.target.value] : event.target.value,
            },
            touched: {
                ...formState.touched,
                [event.target.name]: true,
            },
        }));
    };
    const handleAddRoles = event => {
        event.preventDefault();
        addRoleApi(formState.values.roles)
            .then(function (response) {
                if (response.data.body.status === 'success') {
                    toast({
                        type: 'success',
                        message: response ? response?.data?.body?.message : 'Try again !',
                    });
                    setFormState(initialState);
                    setSortTable({skip:10, limit:10, pageNo: 1})
                    handleGetAllRoles();
                    handleGetAllUser('?invitationStatus=1&suspensionStatus=false');
                } else {
                    toast({
                        type: 'error',
                        message: response ? response?.data?.body?.message : 'Error',
                    });
                }
                setShowModal(false);
                setFormState(initialState);
            })
            .catch(function ( response ) {
                if (response?.response?.status === 429) {
                    openUpgradePlan();
                    // toast({
                    //     type: 'error',
                    //     message: response ? response?.response?.data?.body?.message : 'Something went wrong, Try again !',
                    // });
                } else {
                    // toast({
                    //     type: 'error',
                    //     message: response ? response?.body?.message : 'Something went wrong, Try again !',
                    // });
                }
            });
        setShowModal(false);
    };
    const handleEditRoles = event => {
        event.preventDefault();
        let data = JSON.stringify({
            "roleName": formState.values.roles
        });
        editRoleApi(roleId,data)
            .then(function (result) {
                if (result.data.body.status === 'success') {
                    setSortTable({skip:10, limit:10, pageNo: 1})
                    handleGetAllUser('?invitationStatus=1&suspensionStatus=false');
                    handleGetAllRoles();
                    toast({
                        type: 'success',
                        message: result ? result.data.body.message : 'Try again !',
                    });
                    setFormState(initialState);
                } else {
                    toast({
                        type: 'error',
                        message: result ? result.data.body.message : 'Error',
                    });
                    setFormState(initialState);
                }
                setEditShowModal(false);
            })
            .catch(function ({ response }) {
                if (response && response.status === 429) {
                    openUpgradePlan();
                    setFormState(initialState);
                } else {
                    toast({
                        type: 'error',
                        message: response ? response.data.body.message : 'Something went wrong, Try again !',
                    });
                    setFormState(initialState);
                }
            });
            setEditShowModal(false);
    };
    return (
        <>
            {type === 'add' ? (
                <button onClick={() => setShowModal(true)} className='small-button items-center py-2 flex h-9'>
                    <div className='flex items-center'>
                        <p className='m-0 p-0'>Add</p>
                    </div>
                </button>
            ) : (
                <AiOutlineEdit  onClick={() =>{
                setRole(rolesData.roles||rolesData.role)
                setRoleId(rolesData._id)
                setEditShowModal(true)
                }} size={16}/>
            )}

            {showModal && (
                <>
                    <div className='justify-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-[10000] outline-none focus:outline-none'>
                        <div className='relative my-2 mx-auto w-11/12 lg:w-2/5 z-50'>
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
                                        <div className=''>
                                            <div className='text-center'>
                                                <p className='text-2xl font-bold text-darkTextColor my-2'>Add Roles</p>
                                                <div className='pt-10'>
                                                    <FloatingTextfield
                                                        placeholder={'Roles'}
                                                        label={'Roles'}
                                                        error={hasError('roles')}
                                                        errorMsg={displayErrorMessage(formState.errors.roles)}
                                                        name='roles'
                                                        value={formState.values.roles}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                                <div className='my-2  pt-10  flex justify-center'>
                                                    <button onClick={handleAddRoles} className='small-button items-center xs:w-full py-2 flex h-9' disabled={!formState.isValid}>
                                                        Add Role
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
             {showEditModal && (
                <>
                    <div className='justify-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-[10000] bg-opacity-40 outline-none focus:outline-none'>
                        <div className='relative my-2 mx-auto w-11/12 lg:w-2/5 z-50'>
                            {/*content*/}
                            <div className='border-0 mb-7 sm:mt-8 rounded-2xl shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none'>
                                {/*header*/}
                                {/*body*/}
                                <div className='relative py-5 sm:px-3 p-3 md:px-10 flex-auto'>
                                    <button
                                        className='text-lightGrey hover:text-darkTextColor absolute -right-2 -top-2 rounded-full bg-veryLightGrey  uppercase  text-sm outline-none focus:outline-none p-1 ease-linear transition-all duration-150'
                                        type='button'
                                        onClick={() => {setEditShowModal(false) 
                                        setFormState({...initialState})}}>
                                        <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' stroke-width='2'>
                                            <path stroke-linecap='round' stroke-linejoin='round' d='M6 18L18 6M6 6l12 12' />
                                        </svg>
                                    </button>
                                    <div className='rounded-lg bg-white'>
                                        <div className=''>
                                            <div className='text-center'>
                                                <p className='text-2xl font-bold text-darkTextColor my-2'>Edit Role</p>
                                                <div className='pt-10'>
                                                    <FloatingTextfield
                                                        placeholder={'Roles'}
                                                        label={'Roles'}
                                                        error={hasError('roles')} 
                                                        errorMsg={displayErrorMessage(formState.errors.roles)}
                                                        name='roles'
                                                        value={null}
                                                        defaultValue={role}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                                <div className='my-2  pt-10  flex justify-center'>
                                                    <button onClick={handleEditRoles} className='small-button items-center xs:w-full py-2 flex h-9' disabled={!formState.isValid}>
                                                        Edit Role
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        {/* body task popup end here */}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='opacity-25 fixed inset-0 z-100 bg-black bg-opacity-10' onClick={() => {setEditShowModal(false)
                        setFormState({...initialState})}}></div>
                    </div>
                </>
            )}
        </>
    );
};
export default addRoles;
