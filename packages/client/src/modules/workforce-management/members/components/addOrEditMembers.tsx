import React, { useEffect, useState } from 'react';
import validate from 'validate.js';
import { FloatingSelectfield } from '../../../../components/FloatingSelectfield';
import FloatingTextfield from '../../../../components/FloatingTextfield';
import { isRequiredErrorMessage, OrgId, roleList } from '../../../../helper/exportData';
import { displayErrorMessage } from '../../../../helper/function';
import { addMemberApi } from '../api/post';
import toast from '../../../../components/Toster/index';
import UploadAvtar from '../../../../components/UploadAvtar';
import { BiEdit } from 'react-icons/bi';
import { updateMemberApi } from '../api/put';
const addMembers = ({ handleGetAllUser, showModal, roleDetail, type, data, setShowModal }) => {
    const initialState = {
        isValid: false,
        values: {
            firstName: data ? data.firstName : null,
            lastName: data ? data.lastName : null,
            email: data ? data.email : null,
            role: data ? data.role : null,
            password: 'Neetu@3323424234',
        },
        touched: {},
        errors: {
            firstName: null,
            lastName: null,
            password: null,
            email: null,
            role: null,
        },
    };
    const schema = {
        email: {
            presence: { allowEmpty: false, message: isRequiredErrorMessage },
            email: { message: "Doesn't look like email." },
        },
        firstName: {
            presence: { allowEmpty: false, message: isRequiredErrorMessage },
        },
        lastName: {
            presence: { allowEmpty: false, message: isRequiredErrorMessage },
        },
        role: {
            presence: { allowEmpty: false, message: isRequiredErrorMessage },
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
                [event.target.name]: event.target.value,
            },
            touched: {
                ...formState.touched,
                [event.target.name]: true,
            },
        }));
    };
    const handleAddMember = event => {
        event.preventDefault();
        if (type === 'edit') {
            updateMemberApi(data._id, formState.values)
                .then(function (result) {
                    if (result.data.body.status == 'success') {
                        handleGetAllUser();
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
                    setShowModal(false);
                })
                .catch(function (e) {
                    toast({
                        type: 'error',
                        message: e.response ? e.response.data.body.message : 'Something went wrong, Try again !',
                    });
                });
            setShowModal(false);
        } else {
            addMemberApi(formState.values)
                .then(function (result) {
                    if (result.data.body.status == 'success') {
                        handleGetAllUser();
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
                    setShowModal(false);
                })
                .catch(function (e) {
                    toast({
                        type: 'error',
                        message: e.response ? e.response.data.message : 'Something went wrong, Try again !',
                    });
                });
            setShowModal(false);
        }
    };
    return (
        <>
            {type === 'edit' ? (
                <button onClick={() => setShowModal(true)} className=''>
                    <BiEdit />
                </button>
            ) : (
                <button onClick={() => setShowModal(true)} className='small-button items-center py-2 flex h-9'>
                    <div className='flex items-center'>
                        <p className='m-0 p-0'>Add</p>
                    </div>
                </button>
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
                                        {/* body task popup start here */}
                                        <div className=''>
                                            <div className='text-center'>
                                                <p className='text-2xl font-bold text-darkTextColor my-2'>{type == 'edit' ? 'Edit member' : 'Add member'}</p>
                                                <div className='text-center'>
                                                    <UploadAvtar />
                                                </div>
                                                <div className=''>
                                                    <FloatingTextfield
                                                        type='text'
                                                        placeholder={''}
                                                        label={'First name'}
                                                        error={hasError('firstName')}
                                                        errorMsg={displayErrorMessage(formState.errors.firstName)}
                                                        name='firstName'
                                                        value={formState.values.firstName || ''}
                                                        onChange={handleChange}
                                                    />
                                                    <FloatingTextfield
                                                        type='text'
                                                        placeholder={''}
                                                        label={'Last name'}
                                                        error={hasError('lastName')}
                                                        errorMsg={displayErrorMessage(formState.errors.lastName)}
                                                        name='lastName'
                                                        value={formState.values.lastName || ''}
                                                        onChange={handleChange}
                                                        />
                                                </div>
                                                <div className=''>
                                                    <FloatingTextfield
                                                        type='text'
                                                        placeholder={''}
                                                        label={'Enter work email address'}
                                                        error={hasError('email')}
                                                        errorMsg={displayErrorMessage(formState.errors.email)}
                                                        name='email'
                                                        value={formState.values.email || ''}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                                <div className=''>
                                                    <FloatingSelectfield
                                                        // label={"Role"}
                                                        placeholder={'Role'}
                                                        optionsGroup={roleDetail}
                                                        name={'role'}
                                                        value={formState.values.role || ''}
                                                        onChange={handleChange}
                                                        error={hasError('projectId')}
                                                        errorMsg={displayErrorMessage(formState.errors.role)}
                                                    />
                                                </div>
                                                <div className='my-2 flex justify-center'>
                                                    <button onClick={handleAddMember} className='small-button items-center xs:w-full py-2 flex h-9' disabled={!formState.isValid}>
                                                        {type == 'edit' ? 'Edit member' : 'Add member'}
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
export default addMembers;
