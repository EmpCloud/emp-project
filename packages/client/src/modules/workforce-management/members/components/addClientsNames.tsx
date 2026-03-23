import FloatingTextfield from '@COMPONENTS/FloatingTextfield';
import { isRequiredErrorMessage } from '@HELPER/exportData';
import { displayErrorMessage, openUpgradePlan } from '@HELPER/function';
import React, { useEffect, useState } from 'react'
import validate from 'validate.js';
import { createClient } from '../api/post';
import toast from "../../../../components/Toster/index";

const addOrEditClient = ({type,clientDetails,handleGetAllComapnyClient,handleGetAllComapnyClients,handleGetAllClients,setClientDetails}) => {
    const initialState = {
        isValid: false,
        values: {
            clientName: clientDetails? clientDetails.clientName : null,
        },
        touched: {},
        errors: {
            clientName: null,
        },
    };
    const schema = {
        clientName: {
            presence: { allowEmpty: false, message: isRequiredErrorMessage },
            length: { minimum: 4  , maximum: 40},
        },
    };
    const [formState, setFormState] = useState({ ...initialState });
    const [showModal, setShowModal] = useState(false);
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
        setFormState((formState) => ({
            ...formState,
            values: {
              ...formState.values,
              [event.target.name]:
                event.target.type === "radio"
                  ? event.target.value
                  : event.target.value,
            },
            touched: {
              ...formState.touched,
              [event.target.name]: true,
            },
          }));
    };

    useEffect(()=>{
        setFormState({...initialState})
    },[clientDetails])
    const handleCreateOrEditProject = (event) => {
        event.persist();
                createClient(formState.values)
                .then((response) => {
                    if (response.data.body.status === "success") {
                        toast({
                            type: "success",
                            message: response ? response.data.body.message : "Try again !",
                        });
                        setShowModal(false);
                        setClientDetails([])
                        handleGetAllComapnyClient('?limit=10');
                        handleGetAllComapnyClients()
                        setFormState(initialState);
                        handleGetAllClients('?limit=300');
                    }else {
                        toast({
                            type: 'error',
                            message: response ? response.data.body.message : 'Error',
                        });
                    }
                })
                .catch(function ({ response }) {
                    setShowModal(false);
                    if (response?.status === 429) {
                        openUpgradePlan();
                    } else {
                        toast({
                            type: "error",
                            message: response? response.data.body.message: "Something went wrong, Try again !",
                        });
                    }
                });
      };

  return (
    <>
    {type === 'add' ? (
        <button onClick={() => setShowModal(true)} className='small-button items-center py-2 flex h-8'>
            <div className='flex items-center'>
                <p className='m-0 p-0'>Add Clients</p>
            </div>
        </button>
    ) : (
        <></>
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
                                        <p className='text-2xl font-bold text-darkTextColor my-2'>Add Client Names</p>
                                        <div className='pt-10'>
                                            <FloatingTextfield
                                                placeholder={'Client Name'}
                                                label={'Client Name'}
                                                error={hasError('clientName')}
                                                errorMsg={displayErrorMessage(formState.errors.clientName)}
                                                name='clientName'
                                                value={formState.values.clientName}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className='my-2  pt-10  flex justify-center'>
                                            <button onClick={handleCreateOrEditProject} className='small-button items-center xs:w-full py-2 flex h-9' disabled={!formState.isValid}>
                                              {type === "add"? "Add " : "Edit" }  
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
  )
}

export default addOrEditClient

