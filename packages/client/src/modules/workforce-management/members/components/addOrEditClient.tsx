import FloatingTextfield from '@COMPONENTS/FloatingTextfield';
import { isRequiredErrorMessage } from '@HELPER/exportData';
import { displayErrorMessage, openUpgradePlan, uniqueArrays, uniqueMembers } from '@HELPER/function';
import React, { useEffect, useState } from 'react'
import { AiOutlineEdit } from 'react-icons/ai';
import validate from 'validate.js';
import { creatCompany } from '../api/post';
import toast from "../../../../components/Toster/index";
import { editCompanyDetails } from '../api/put';
import MultiSelectDropDown from '@COMPONENTS/MultiSelectDropDown';
import { getClientComapny } from '../api/get';

const addOrEditClient = ({type,clientDetails,handleGetAllComapnyClient,handleGetAllComapnyClients,allClients,handleGetAllClients,setClientDetails}) => {
    // const [allClients ,setClients ]= useState([])
    const initialState = {
        isValid: false,
        values: {
            clientName: clientDetails? clientDetails?.clientName?.map(data=>{return {id:data?.id,key:data?.clientName,value:data}}) : null,
            clientCompany:clientDetails? clientDetails?.clientCompany : null,
        },
        touched: {},
        errors: {
            clientName: null,
            clientCompany: null,
        },
    };
    // const handleGetAllClients = (condition = '') => {
    //     getClientComapny(condition).then(response => {
    //         if (response.data.body.status === "success") {
    //             setClients(
    //                 response?.data?.body?.data?.clientDetail?.map(data => {
    //                     return { id: data?._id, key: data?.clientName, value: data };
    //                 })
    //             );
    //             setCallClientFunction();
    //         }
    //         else if  (response.data.body.status === 'failed'){
    //             setClients([])
    //             setCallClientFunction();
    //         }
    //     });
    // };
    const schema = {
        // clientName: {
        //     presence: { allowEmpty: false, message: isRequiredErrorMessage },
        //     length: { minimum: 4  , maximum: 40},
        // },
        clientCompany: {
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
        if(clientDetails){
        setFormState({...initialState})
        // handleGetAllClients('?limit=300')
        handleGetAllClients('?limit=300')
        }
    },[clientDetails])

    const updateData=()=>{
        
        setShowModal(false);
        handleGetAllComapnyClient('?limit=' + 10,'edit');
        handleGetAllComapnyClients()
        setFormState(initialState);
    }
    const handleCreateOrEditProject = (event) => {
        event.persist();
        if (type === "edit") {
            editCompanyDetails(clientDetails._id, {
                ...formState.values,
                clientName: formState.values.clientName.map(item => ({ id: item.id })),
            })
            .then(function (result) {
              if (result.data.body.status === "success") {
                  toast({
                      type: "success",
                      message: result ?'Company info updated successfully': 'Try again !',
                    });
                    updateData();
                    console.log('model');
                    
              } else {
                toast({
                  type: "error",
                  message: result ? result.data.body.message : "Error",
                });
              }
            //   stopLoading();
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
                //   stopLoading();
            });
        } else {
                creatCompany({
                    ...formState.values,
                    clientName:  formState.values.clientName.map(item => ({ id: item.id })),
                })
                .then((response) => {
                    if (response.data.body.status === "success") {
                        toast({
                            type: "success",
                            message: response ? response.data.body.message : "Try again !",
                        });
                        updateData();
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
                    //   stopLoading();
                });
        }
      };
      const handleChangeMultiSelector = (data, name, type) => {
        setFormState(formState => ({
            ...formState,
            values: {
                ...formState.values,
                [name]: data,
            },
            touched: {
                ...formState.touched,
                [name]: true,
            },
        }));
    };
    useEffect(()=>{
        if(showModal===false){
            setFormState(initialState);
        }
    },[showModal])

  return (
    <>
    {type === 'add' ? (
        <button onClick={() => setShowModal(true)} className='small-button items-center py-2 flex h-8'>
            <div className='flex items-center'>
                <p className='m-0 p-0'>Add Companys</p>
            </div>
        </button>
    ) : (
        <AiOutlineEdit  onClick={() =>{
        // setRole(rolesData.roles||rolesData.role)
        // setRoleId(rolesData._id)
        setShowModal(true)
        }} size={20}/>
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
                                    <div className='text-center'>
                                        <p className='text-2xl font-bold text-darkTextColor my-2'>  {type === 'add' ? 'Add Company Details' : 'Edit Company Details'} </p>
                                        <div className='pt-10'>
                                            <FloatingTextfield
                                                placeholder={'Client Company'}
                                                label={'Client Company'}
                                                error={hasError('clientCompany')}
                                                errorMsg={displayErrorMessage(formState.errors.clientCompany)}
                                                name='clientCompany'
                                                value={formState.values.clientCompany}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className='pt-10'>
                                            {/* <FloatingTextfield
                                                placeholder={'Client Name'}
                                                label={'Client Name'}
                                                error={hasError('clientName')}
                                                errorMsg={displayErrorMessage(formState.errors.clientName)}
                                                name='clientName'
                                                value={formState.values.clientName}
                                                onChange={handleChange}
                                            /> */}
                                        <MultiSelectDropDown
                                               handleChangeMultiSelector={handleChangeMultiSelector}
                                               name={'clientName'}
                                               label={'Client Name'}
                                               value={formState.values.clientName}
                                               option={uniqueArrays(allClients ? allClients : [])}
                                               selectedValues={formState.values.clientName}
                                               />
                                        </div>
                                        <div className='pt-10 flex justify-center'>
                                            <button onClick={handleCreateOrEditProject} className='small-button items-center xs:w-full py-2 flex h-9' disabled={!formState.isValid}>
                                              {type === "add"? "Add " : "Edit" }  
                                            </button>
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

