/* eslint-disable react-hooks/rules-of-hooks */
import DropDown from '@COMPONENTS/DropDown';
import { FloatingSelectfield } from '@COMPONENTS/FloatingSelectfield';
import FloatingTextfield from '@COMPONENTS/FloatingTextfield';
import InputFile from '@COMPONENTS/InputFiles';
import { TextArea } from '@COMPONENTS/TextArea';
import React, { useEffect, useState } from 'react';
import { BsCamera, BsJustify } from 'react-icons/bs';
import validate from 'validate.js';
import { Country, State, City } from 'country-state-city';
import Cookies from 'js-cookie';
import { addressSchema, groupDescriptionSchema, requiredSchema } from '../../../../helper/schema';
import { CgAsterisk } from 'react-icons/cg';
import { FaUserCircle } from 'react-icons/fa';
import { displayErrorMessage } from '@HELPER/function';
import toast from '../../../../components/Toster/index';
import { editProfile, editUserProfile } from '../api/put';
import codes from 'country-calling-code';
import { isRequiredErrorMessage } from '@HELPER/exportData';
import { sendDataToApi } from '@WORKFORCE_MODULES/admin/api/post';
import { color } from '@amcharts/amcharts5';
import { generateDicebearUrl } from '@HELPER/avtar';
import { useSharedStateContext } from './../../../../helper/function';

const editProfileModal = ({ handleprofileData, data }) => {
    const { sharedState, updateSharedState } = useSharedStateContext();
    let isAdmin = Cookies.get('isAdmin');
    const [file, setFile] = useState(null);

    useEffect(() => {
        setFormState(prevFormState => ({
            ...prevFormState,
            values: {
                ...prevFormState.values,
                profilePic: file,
            },
        }));
    }, [file]);

    const handleUploadProfilePhoto = () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.onchange = async event => {
            const updatedDataUrl = await sendDataToApi(event.currentTarget.files[0], data?.email);
            setFile(updatedDataUrl);
        };
        fileInput.click();
    };

    const handleRemoveProfilePhoto = () => {
        setFormState(prevFormState => ({
            ...prevFormState,
            values: {
                ...prevFormState.values,
                profilePic: `${generateDicebearUrl(data.firstName ,data.lastName)}`,
            },
        }));
    };
    const upload_data = [
        { text: 'New profile photo', value: 1, onClick: handleUploadProfilePhoto },
        { text: 'Remove profile photo', cssClass: 'text-[#F5997B]', value: 2, onClick: handleRemoveProfilePhoto },
    ];

    useEffect(() => {
        setFormState({ ...initialState });
    }, [data]);

    const initialState = {
        isValid: false,
        values: {
            firstName: data ? data.firstName : null,
            lastName: data ? data.lastName : null,
            profilePic: data ? data.profilePic : null,
            countryCode: data ? data.countryCode : null,
            phoneNumber: data ? data.phoneNumber : null,
            address: data ? data.address : null,
            city: data ? data.city : null,
            state: data ? data.state : null,
            country: data ? data.country : null,
            zipCode: data ? data.zipCode : null,
        },
        touched: {},
        errors: {
            firstName: null,
            lastName: null,
            profilePic: null,
            countryCode: null,
            phoneNumber: null,
            address: null,
            city: null,
            state: null,
            country: null,
            zipCode: null,
        },
    };
    const schema = {
        firstName: requiredSchema,
        lastName: requiredSchema,
        profilePic: null,
        countryCode: null,
        phoneNumber: {
            presence: { allowEmpty: true, message: isRequiredErrorMessage },
            format: {
                pattern: '^[0-9]*$',
                message: 'can only contain digits.',
            },
            length: {
                maximum: 10,
                minimum: 10,
                message: 'must be 10 numbers .',
            },
            numericality: { onlyFloat: true },
        },
        address: addressSchema,
        city: null,
        state: null,
        country: requiredSchema,
        zipCode: {
            // presence: { allowEmpty: true, message: isRequiredErrorMessage },
            format: {
                pattern: '^[0-9]*$',
                message: 'can only contain digits.',
            },
            length: {
                maximum: 6,
                minimum: 6,
                message: 'must be 6 numbers .',
            },
            numericality: { onlyFloat: true },
        },
    };

    const [formState, setFormState] = useState({ ...initialState });
    const [showModalEditDetails, setShowModalEditDetails] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedState, setSelectedState] = useState(null);
    const [countryList, setCountryList] = useState(null);
    const [stateList, setStateList] = useState(null);
    const [cityList, setCityList] = useState(null);

    useEffect(() => {
        // document.querySelector('body').classList.add('bg-slate-50');
    }, []);

    useEffect(() => {
        getCountry();
    }, [data]);

    const handleCloseModel = () => {
        setShowModalEditDetails(false);
        setFormState({ ...initialState });
    };

    const getCountryCode = selectedCountry => {
        let phoneData = codes.filter(item => item.country === selectedCountry);

        if (!phoneData[0]) {
            setFormState(companyState => ({
                ...companyState,
                values: {
                    ...companyState.values,
                    countryCode: null,
                },
            }));
            return false;
        }

        let phoneCode = '+' + phoneData[0].countryCodes[0];
        setFormState(companyState => ({
            ...companyState,
            values: {
                ...companyState.values,
                countryCode: phoneCode,
                phoneNumber: null,
            },
        }));
    };

    useEffect(() => {
        getState(countryList);
        getCity(stateList);
    }, [selectedCountry, selectedState]);

    const getCountry = () => {
        let countryList = Country.getAllCountries().map(item => {
            return {
                text: item.name,
                value: item.name,
                isoCode: item.isoCode,
            };
        });
        setCountryList(countryList);
        getState(countryList);
    };

    const getState = countryList => {
        if (!data) return false;
        let selectedItem = countryList?.filter(country => country.value == (selectedCountry ? selectedCountry : data?.country));
        let stateList = State?.getStatesOfCountry(selectedItem ? selectedItem[0]?.isoCode : '').map(item => {
            return {
                text: item.name,
                value: item.name,
                isoCode: item.isoCode,
                countryCode: item.countryCode,
            };
        });
        setStateList(stateList);
        getCity(stateList);
    };

    const getCity = stateList => {
        if (!data) return false;
        let selectedItem = stateList?.filter(state => state.value === (selectedState ? selectedState : data?.state));
        let cityList = City?.getCitiesOfState(selectedItem ? selectedItem[0]?.countryCode : '', selectedItem ? selectedItem[0]?.isoCode : '').map(item => {
            return {
                text: item.name,
                value: item.name,
            };
        });
        setCityList(cityList);
    };

    const handleEditAdminProfile = () => {
        if (isAdmin === 'true') {
        updateSharedState(formState.values.profilePic);
            Cookies.set("profilePic",formState.values.profilePic)
            editProfile(formState.values)
                .then(function (result) {
                    if (result.data.body.status === 'success') {
                        toast({
                            type: 'success',
                            message: result ? result.data.body.message : 'Try again !',
                        });
                    } else {
                        toast({
                            type: 'error',
                            message: result ? result.data.body.error : 'Something went wrong, Try again !',
                        });
                    }
                    handleprofileData();
                    setShowModalEditDetails(false);
                })
                .catch(function (result) {
                    toast({
                        type: 'error',
                        message: result ? result.data.body.message : 'Something went wrong, Try again !',
                    });
                });
        } else {
            let userId = Cookies.get('id');
        updateSharedState(formState.values.profilePic);
            Cookies.set("profilePic",formState.values.profilePic)
            editUserProfile(formState.values, userId)
                .then(function (result) {
                    if (result.data.body.status === 'success') {
                        toast({
                            type: 'success',
                            message: result ? result.data.body.message : 'Try again !',
                        });
                        handleprofileData();
                    } else {
                        toast({
                            type: 'error',
                            message: result ? result.data.body.error : 'Something went wrong, Try again !',
                        });
                    }
                    setShowModalEditDetails(false);
                })
                .catch(function (result) {
                    toast({
                        type: 'error',
                        message: result ? result.data.body.message : 'Something went wrong, Try again !',
                    });
                });
        }
    };
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

    const handleClearCity = () => {
        setFormState(formState => ({
            ...formState,
            values: {
                ...formState.values,
                state: null,
                city: null,
                zipCode: null,
            },
        }));
    };
    useEffect(() => {
        const errors = validate(formState.values, schema);
        setFormState(prevFormState => ({
            ...prevFormState,
            isValid: !errors,
            errors: errors || {},
        }));
    }, [formState.values, formState.isValid]);


  

    const hasError = field => !!(formState.touched[field] && formState.errors[field]);
    function getProfilePicUrl(state) {
        if (
            state?.values?.profilePic &&
          typeof state?.values?.profilePic === 'string' &&
          state?.values?.profilePic?.startsWith('https://api.dicebear.com/7.x/initials/svg?seed')
        ) {
          return `${generateDicebearUrl(data.firstName ,data.lastName)}`+ '.svg';;
        } else {
          return state.values.profilePic??`${generateDicebearUrl(data?.firstName ,data?.lastName)}`+ '.svg';;
        }
      }
      
      const profilePicUrl = getProfilePicUrl(formState);
    return (
        <>
            <div className='flex items-center gap-5 sm:flex-nowrap flex-wrap'>
                <button
                    type='submit'
                    className='small-button items-center py-2 flex h-9'
                    onClick={() => {
                        setShowModalEditDetails(true);
                        setFormState({ ...initialState });
                    }}>
                    <div className='flex items-center'>
                        <p className='m-0 p-0'>Edit</p>
                    </div>
                </button>
            </div>

            {showModalEditDetails && (
                <>
                    <div className='justify-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-[999] outline-none focus:outline-none'>
                        <div className='relative my-2 w-10/12 md:w-8/12 z-50 sm:w-[!20rem]'>
                            {/*content*/}
                            <div className='border-0 mb-7 sm:mt-8 rounded-2xl shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none'>
                                {/*header*/}
                                {/*body*/}
                                <div className='relative sm:px-3  md:p-6 flex-auto'>
                                    <button
                                        className='text-lightGrey hover:text-darkTextColor absolute -right-2 -top-2 rounded-full bg-veryLightGrey  uppercase  text-sm outline-none focus:outline-none p-1 ease-linear transition-all duration-150'
                                        type='button'
                                        onClick={() => setShowModalEditDetails(false)}>
                                        <svg xmlns='http://www.w3.org/2000/svg' className='h-3 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
                                            <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
                                        </svg>
                                    </button>
                                    <div className='rounded-lg bg-white'>
                                        <div className=''>
                                            <h2 className='heading-medium font-semibold text-center'>Edit Profile</h2>
                                            <div className='lg:flex'>
                                                <div className='relative flex lg:basis-1/3 lg:flex items-center justify-center'>
                                                    <div className='image-container'>
                                                        {typeof formState.values.profilePic === 'string' ? (
                                                            <img
                                                                src={profilePicUrl}
                                                                alt='User-Img'
                                                                className='text-center rounded-lg'
                                                            />
                                                        ) : (
                                                            <span className='image-container'>{formState.values.profilePic}</span>
                                                        )}
                                                    </div>
                                                    <div className='absolute right-[150px] lg:right-[65px] lg:bottom-[20px] bottom-[0px]'>
                                                        <DropDown
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
                                                </div>
                                                <div className='lg:basis-2/3 lg:m-0 mx-5'>
                                                    <div className='lg:flex lg:w-full  lg:mt-20'>
                                                        <div className='input_box flex flex-col lg:w-1/2'>
                                                            <label className='text-sm py-2 text-darkTextColor' htmlFor=''>
                                                                <div className='flex flex-row'>
                                                                    <b> First Name </b> <CgAsterisk color='red' />{' '}
                                                                </div>
                                                            </label>
                                                            <div className='remove_margin'>
                                                                <FloatingTextfield
                                                                    type='text'
                                                                    label={''}
                                                                    name='firstName'
                                                                    value={formState.values.firstName}
                                                                    onChange={handleChange}
                                                                    autoComplete={undefined}
                                                                    onPaste={undefined}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className='input_box flex flex-col lg:w-1/2 lg:ml-3'>
                                                            <label className='text-sm py-2 text-darkTextColor' htmlFor=''>
                                                                <div className='flex flex-row'>
                                                                    <b> Last Name </b> <CgAsterisk color='red' />{' '}
                                                                </div>
                                                            </label>
                                                            <div className='remove_margin'>
                                                                <FloatingTextfield
                                                                    type='text'
                                                                    label={''}
                                                                    name='lastName'
                                                                    value={formState.values.lastName || ''}
                                                                    onChange={handleChange}
                                                                    autoComplete={undefined}
                                                                    onPaste={undefined}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='lg:flex lg:w-full'>
                                                        <div className='input_box flex flex-col lg:w-1/2'>
                                                            <label className='text-sm py-2 text-darkTextColor' htmlFor=''>
                                                                <div className='flex flex-row'>
                                                                    <b> Country </b> <CgAsterisk color='red' />{' '}
                                                                </div>
                                                            </label>
                                                            <div className='remove_margin'>
                                                                <FloatingSelectfield
                                                                    optionsGroup={countryList}
                                                                    name={'country'}
                                                                    value={formState.values.country || ''}
                                                                    onChange={e => {
                                                                        setSelectedCountry(e.target.value);
                                                                        handleClearCity();
                                                                        getCountryCode(e.target.value);
                                                                        handleChange(e);
                                                                    }}
                                                                    error={hasError('country')}
                                                                    errorMsg={displayErrorMessage(formState.errors.country)}
                                                                />
                                                            </div>
                                                        </div>
                                                        {/* <div className='input_box flex flex-col lg:ml-3 lg:basis-1/3'> */}
                                                        <div className='input_box flex flex-col lg:w-1/2 lg:ml-3'>
                                                            <label className='text-sm py-2 text-darkTextColor' htmlFor=''>
                                                                <div className='flex flex-row'>
                                                                    <b> State </b> 
                                                                    {/* <CgAsterisk color='red' />{' '} */}
                                                                </div>
                                                            </label>
                                                            <div className='remove_margin'>
                                                                <FloatingSelectfield
                                                                    optionsGroup={stateList}
                                                                    name={'state'}
                                                                    value={formState.values.state || ''}
                                                                    onChange={e => {
                                                                        setSelectedState(e.target.value);
                                                                        handleClearCity();
                                                                        handleChange(e);
                                                                    }}
                                                                    error={hasError('state')}
                                                                    errorMsg={displayErrorMessage(formState.errors.state)}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='lg:flex lg:m-0 mx-5'>
                                                <div className='input_box flex flex-col lg:ml-3 lg:basis-1/3'>
                                                    <label className='text-sm py-2 text-darkTextColor' htmlFor=''>
                                                        <div className='flex flex-row'>
                                                            <b> City </b> 
                                                            {/* <CgAsterisk color='red' />{' '} */}
                                                        </div>
                                                    </label>
                                                    <div className='remove_margin'>
                                                        <FloatingSelectfield
                                                            optionsGroup={cityList}
                                                            name={'city'}
                                                            value={formState.values.city}
                                                            onChange={e => {
                                                                handleChange(e);
                                                            }}
                                                            error={hasError('city')}
                                                            errorMsg={displayErrorMessage(formState.errors.city)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className='input_box flex flex-col lg:ml-3 lg:basis-1/3'>
                                                    <label className='text-sm py-2 text-darkTextColor' htmlFor=''>
                                                        <div className='flex flex-row'>
                                                            <b> Zip Code </b> 
                                                            {/* <CgAsterisk color='red' />{' '} */}
                                                        </div>
                                                    </label>
                                                    <div className='remove_margin'>
                                                        <FloatingTextfield
                                                            type='text'
                                                            label={''}
                                                            name='zipCode'
                                                            value={formState.values.zipCode || ''}
                                                            onChange={handleChange}
                                                            autoComplete={undefined}
                                                            onPaste={undefined}
                                                            error={hasError('zipCode')}
                                                            errorMsg={displayErrorMessage(formState.errors.zipCode)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className='input_box flex flex-col lg:ml-3 lg:basis-1/3'>
                                                    <label className='text-sm py-2 text-darkTextColor' htmlFor=''>
                                                        <div className='flex flex-row'>
                                                            <b> Mobile number </b> <CgAsterisk color='red' />{' '}
                                                        </div>
                                                    </label>
                                                    <div className='remove_margin flex'>
                                                        <div className='w-20'>
                                                            <FloatingTextfield
                                                                name='phoneNumber'
                                                                type='text'
                                                                value={formState.values.countryCode || ''}
                                                                error={hasError('countryCode')}
                                                                errorMsg={displayErrorMessage(formState.errors.countryCode)}
                                                            />
                                                        </div>
                                                        <div className='w-80 mx-1'>
                                                            <FloatingTextfield
                                                                type='text'
                                                                label={''}
                                                                name='phoneNumber'
                                                                value={formState.values.phoneNumber || ''}
                                                                onChange={handleChange}
                                                                error={hasError('phoneNumber')}
                                                                errorMsg={displayErrorMessage(formState.errors.phoneNumber)}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='lg:flex lg:m-0 mx-5'>
                                                <div className='mt-2 sm:mb-1 taskTextArea w-full'>
                                                    <p className='text-sm text-darkTextColor pt-2'><b>Address ( optional )</b></p>
                                                    <TextArea type='text' label={''} error={hasError('address')} name='address' value={formState.values.address || ''} onChange={handleChange} />
                                                </div>
                                            </div>
                                            <div></div>
                                        </div>
                                        <div className='lg:flex flex items-center justify-center gap-2 lg:gap-5 mt-4lg:m-0 m-5'>
                                            <button className='text-darkBlue border text-sm font-bold px-8 py-2 rounded-full border-darkBlue cursor-pointer' onClick={handleCloseModel}>
                                                Cancel
                                            </button>
                                            <button
                                                type='submit'
                                                disabled={!formState.isValid}
                                                onClick={handleEditAdminProfile}
                                                className='small-button items-center xs:w-full flex sm:text-md text-sm py-2 lg:px-8 lg:my-0 my-3'>
                                                <span className=''>Save Changes</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='opacity-25 fixed inset-0 z-40 bg-black' onClick={() => setShowModalEditDetails(false)}></div>
                    </div>
                </>
            )}
        </>
    );
};

export default editProfileModal;
