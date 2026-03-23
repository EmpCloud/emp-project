/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react';
import validate from 'validate.js';
import { FloatingSelectfield } from '../../../../components/FloatingSelectfield';
import FloatingTextfield from '../../../../components/FloatingTextfield';
import { isRequiredErrorMessage, OrgId, roleList } from '../../../../helper/exportData';
import { displayErrorMessage } from '../../../../helper/function';
import { addMemberApi } from '../api/post';
import toast from '../../../../components/Toster/index';
import UploadAvtar from '../../../../components/UploadAvtar';
import { updateMemberApi } from '../api/put';
import DropDown from '../../../../components/DropDown';
import InputFile from '../../../../components/InputFiles';
import { BsCamera } from 'react-icons/bs';
import { MdModeEditOutline } from 'react-icons/md';
import { generateDicebearUrl } from '@HELPER/avtar';
import { sendDataToApi } from '@WORKFORCE_MODULES/admin/api/post';
const editMember = ({ permissionsDetails ,handleGetAllUser, roleDetail, editModel, setEditModel,handleGetFilterMember,handleSearchMember, editUserData, inviteStatus,handleGetData, sortTable ,types,searchKeyword}) => {
    // const upload_data = [
    //     { text: <InputFile />, value: 1 },
    //     { text: 'Remove profile photo', cssClass: 'text-[#F5997B]', value: 2 },
    
 
    // ];
    useEffect(() => {
        editUserData &&
            setFormState(formState => ({
                ...formState,
                values: {
                    profilePic: editUserData.profilePic,
                    firstName: editUserData.firstName,
                    lastName: editUserData.lastName,
                    role: editUserData.role,
                    permission:editUserData.permission
                },
            }));
    }, [editUserData]);
    const initialState = {
        isValid: false,
        values: {
            profilePic: null,
            firstName: null,
            lastName: null,
            role: null,
            permission:null,
        },
        touched: {},
        errors: {
            firstName: null,
            lastName: null,
            password: null,
            role: null,
            permission:null,
        },
    };
    const schema = {
        firstName: {
            presence: { allowEmpty: false, message: isRequiredErrorMessage },
            length: { minimum: 0  , maximum: 20},
        },
        lastName: {
            presence: { allowEmpty: false, message: isRequiredErrorMessage },
            length: { minimum: 0  , maximum: 20},
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
    const handleEditMember = event => {
        event.preventDefault();
        updateMemberApi(editUserData._id, formState.values)
            .then(function (result) {
                if (result.data.body.status == 'success') {
                    // handleGetAllUser('?limit=' + limit + '&invitationStatus=' + inviteStatus+'&suspensionStatus=false');
                    handleGetAllUser('?invitationStatus=' + inviteStatus+'&suspensionStatus=false');
                    if(types === "search"){
                        handleSearchMember('?skip='+sortTable.skip+'&limit=' + sortTable.limit+'&keyword=' + searchKeyword + '&invitationStatus=' + inviteStatus)
                    }else if(types === "filter"){
                        handleGetFilterMember('?skip='+sortTable.skip+'&limit=' + sortTable.limit + '&invitationStatus=' + inviteStatus)
                    }else{
                        handleGetAllUser('?limit=' + sortTable.limit + '&invitationStatus=' + inviteStatus + '&suspensionStatus=false');
                    }
                    toast({
                        type: 'success',
                        message: result ? result.data.body.message : 'Try again !',
                    });
                } else {
                    toast({
                        type: 'error',
                        message: result ? result.data.body.error : 'Error',
                    });
                }
                setEditModel(false);
            })
            .catch(function (e) {
                toast({
                    type: 'error',
                    message: e.response ? e.response.data.body.message : 'Something went wrong, Try again !',
                });
            });
        setEditModel(false);
    };
    const [file, setFile] = useState(null);
    const handleUploadProfilePhoto = () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.onchange = async event => {
            const updatedDataUrl = await sendDataToApi(event.currentTarget.files[0], editUserData?.email);
            setFile(updatedDataUrl);
        };
        fileInput.click();
    };
    const handleRemoveProfilePhoto = () => {
        setFormState(prevFormState => ({
            ...prevFormState,
            values: {
                ...prevFormState.values,
                profilePic: `${generateDicebearUrl(editUserData.firstName ,editUserData.lastName)}`,
            },
        }));
    };

    useEffect(() => {
        setFormState(prevFormState => ({
            ...prevFormState,
            values: {
                ...prevFormState.values,
                profilePic: file,
            },
        }));
    }, [file]);

    const upload_data = [
        { text: 'New profile photo', value: 1, onClick: handleUploadProfilePhoto },
        { text: 'Remove profile photo', cssClass: 'text-[#F5997B]', value: 2, onClick: handleRemoveProfilePhoto },
    ];
    return (
        <>
            {editModel && editUserData && (
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
                                        onClick={() => setEditModel(false)}>
                                        <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' stroke-width='2'>
                                            <path stroke-linecap='round' stroke-linejoin='round' d='M6 18L18 6M6 6l12 12' />
                                        </svg>
                                    </button>
                                    <div className='rounded-lg bg-white'>
                                        {/* body task popup start here */}
                                        <div className=''>
                                            <div className='text-center'>
                                                <p className='text-2xl font-bold text-darkTextColor my-2'>Edit member</p>
                                                <div className='text-center'>
                                                    <div className='relative flex lg:basis-1/3 lg:flex items-center gap-4 justify-between'>
                                                        <div className='image-upload relative'>
                                                            <label htmlFor='file-input'>
                                                                <img src={formState.values.profilePic} className='h-50 relative  rounded-2xl w-40 cursor-pointer ' />
                                                                {/* <div className=' bg-white h-6 w-6 rounded float-right shadow absolute bottom-0 left-0 cursor-pointer flex justify-center items-center'>
                                                                <MdModeEditOutline/>
                                                                </div> */}
                                                            </label>
                                                            <DropDown
                                                            className='!absolute !-bottom-4 !-right-4'
                                                            data={upload_data}
                                                            defaultValue={''}
                                                            icon={
                                                                <span className='text-2xl bg-brandBlue p-2 rounded-full text-white shadow-md'>
                                                                    <BsCamera />
                                                                </span>
                                                            }
                                                            getData={undefined}
                                                        />
                                                        </div>
                                                        <div className='mt-3 w-full'>
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
                                                    <div className='mt-6'>
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
                                                </div>
                                                    </div>
                                                </div>
                                                <div className='mt-4'>
                                                <p className='text-left text-base ps-3 text-darkBlue'>Role</p>
                                                    <FloatingSelectfield
                                                        label={'Role'}
                                                        placeholder={'Role'}
                                                        optionsGroup={roleDetail}
                                                        name={'role'}
                                                        value={formState.values.role || ''}
                                                        onChange={handleChange}
                                                        error={hasError('projectId')}
                                                        errorMsg={displayErrorMessage(formState.errors.role)}
                                                    />
                                                </div>
                                                <div className='mt-2'>
                                                <p className='text-left text-base ps-3 text-darkBlue'>Permission</p>
                                                      <FloatingSelectfield
                                                        label={'permission'}
                                                        placeholder={'permission'}
                                                        optionsGroup={permissionsDetails}
                                                        name={'permission'}
                                                        value={formState.values.permission || ''}
                                                        onChange={handleChange}
                                                        error={hasError('projectId')}
                                                        errorMsg={displayErrorMessage(formState.errors.permission)}
                                                    />
                                                </div>
                                                <div className='my-2 flex justify-center'>
                                                    <button onClick={handleEditMember} className='small-button items-center xs:w-full py-2 flex h-9' disabled={!formState.isValid}>
                                                        Save Changes
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        {/* body task popup end here */}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='opacity-25 fixed inset-0 z-100 bg-black' onClick={() => setEditModel(false)}></div>
                    </div>
                </>
            )}
        </>
    );
};
export default editMember;
