/* eslint-disable react-hooks/rules-of-hooks */
import FloatingTextfield from '@COMPONENTS/FloatingTextfield';
import { displayErrorMessage, openUpgradePlan } from '@HELPER/function';
import { permissionSchema } from '@HELPER/schema';
import React, { useState, useEffect } from 'react';
import { HiKey } from 'react-icons/hi';
import toast from '@COMPONENTS/Toster/index';
import validate from 'validate.js';
import NewToolTip from '../../../../components/NewToolTip';
import { createPermission } from '../api/post';
import { AiOutlineEdit } from 'react-icons/ai';
import { updatePermission } from '../api/put';
import { transformForDisplay ,transformForUpdate} from '@HELPER/permissions';



const userDetails = ({ data, type, handleGetAllPermission }) => {
    const [open, setOpen] = useState(false);
    const [permission, setPermission] = useState(
        data.permissionConfig
            ? data.permissionConfig
            : {
                //   dashboard: { view: false, create: false, edit: false, delete: false },
                "Organization Project": { view: true, create: false, edit: false, delete: false },
                  "otherProject": { view: false, create: false, edit: false, delete: false },
                  'Organization Task': { view: true, create: false, edit: false, delete: false },
                  "otherTask": { view: false, create: false, edit: false, delete: false },
                  'Organization Subtask': { view: false, create: false, edit: false, delete: false },
                  "otherSubtask": { view: false, create: false, edit: false, delete: false },
                  'Organization User': { view: false, create: false, edit: false, delete: false },
                  'Organization Activity': { view: false, create: false, edit: false, delete: false },
                  'Organization Roles': { view: false, create: false, edit: false, delete: false },
                  'Organization Comments': { view: false, create: false, edit: false, delete: false },
                  'Organization Uploads': { view: false, create: false, edit: false, delete: false },
                //   plan: { view: false, create: false, edit: false, delete: false },
                'Organization Links': { view: false, create: false, edit: false, delete: false },
              }
    );

    const handleSetValue = (event, key, subKey) => {
        if(key === "project" && subKey === "view" || key === "task" && subKey === "view" || key === "activity" && subKey === "edit" || key === "activity" && subKey === "create" || key === "activity" && subKey === "delete") return false;
    const updatedPermission = { ...permission };
    const temp = { ...updatedPermission[key] };
      temp[subKey] = !temp[subKey];
        if((subKey === "edit" || subKey === "create" || subKey === "delete") &&  temp[subKey] === true){
            temp["view"] = true;
        }
    if (subKey === "view" && temp["view"] === false) {
        temp["create"] = false;
        temp["edit"] = false;
        temp["delete"] = false;
    }
    updatedPermission[key] = temp;
    const isAnyEnabled = Object.values(temp).some(Boolean);
    // === ENABLE ===
        const viewDependencyMap = {"Other Subtask": ["Organization Subtask","Other Task","Organization Task","Other Project","Organization Project"],"Organization Subtask": ["Other Task","Organization Task","Other Project","Organization Project"],"Other Task": ["Organization Task","Other Project","Organization Project"],"Organization Task": ["Other Project","Organization Project"],"Other Project": ["Organization Project"]};
        if (isAnyEnabled && viewDependencyMap[key]) {
            viewDependencyMap[key].forEach(depKey => {
                if (updatedPermission[depKey]) {
                updatedPermission[depKey].view = true;
                }
            });
        }
    // === DISABLE ===
        const reset = { view: false, create: false, edit: false, delete: false };
        const resetDependencyMap = {"Organization Project": ["Other Project","Organization Task","Other Task","Organization Subtask","Other Subtask"],"Other Project": ["Other Task","Other Subtask"],"Organization Task": ["Other Task","Organization Subtask","Other Subtask"],"Other Task": ["Other Subtask"],"Organization Subtask": ["Other Subtask"]
    };
    if (!isAnyEnabled && resetDependencyMap[key]) {
        resetDependencyMap[key].forEach(depKey => {
            updatedPermission[depKey] = { ...reset };
        });
    }
    setPermission(updatedPermission);
};

    useEffect(()=>{
        
         let updatedPermissions=transformForDisplay(permission);
         setPermission(updatedPermissions);
        //  setPermission(updatedPermissions)
        
    },[])

    const handleSetAll = (event, k) => {
        
        let temp = { ...permission[k]};
        let checkbox = document.getElementById(k + '_all');
        if(k === "Organization Project" || k === "Organization Task"){
            if (event.target.checked === false) {
                temp['view'] = false;
                temp['create'] = false;
                temp['edit'] = false;
                temp['delete'] = false;
                checkbox.indeterminate = false;
            } else {
                temp['view'] = true;
                temp['create'] = true;
                temp['edit'] = true;
                temp['delete'] = true;
                checkbox.indeterminate = true;
            }
        }else if(k === "Organization Activity" ){
            if (event.target.checked === false) {
                temp['view'] = false;
                temp['create'] = false;
                temp['edit'] = false;
                temp['delete'] = false;
                checkbox.indeterminate = false;
            } else {
                temp['view'] = true;
                temp['create'] = false;
                temp['edit'] = false;
                temp['delete'] = false;
                checkbox.indeterminate = true;
            }
        }
        else{
            if (event.target.checked === false) {
                temp['view'] = false;
                temp['create'] = false;
                temp['edit'] = false;
                temp['delete'] = false;
                checkbox.indeterminate = false;
            } else {
                temp['view'] = true;
                temp['create'] = true;
                temp['edit'] = true;
                temp['delete'] = true;
                checkbox.indeterminate = true;
            }
        }
        const updatedPermission = { ...permission, [k]: temp };
    // ========== ENABLE ==========
    const hierarchy = ["Organization Project","Other Project","Organization Task","Other Task","Organization Subtask","Other Subtask",];
      const index = hierarchy.indexOf(k);
      if (event.target.checked && index !== -1) {
        for (let i = index - 1; i >= 0; i--) {
          const keyToEnable = hierarchy[i];
          if (updatedPermission[keyToEnable]) {
            updatedPermission[keyToEnable].view = true;
          }
        }
      }
    // ========== DISABLE  ==========
    if (!event.target.checked) {
        const reset = { view: false, create: false, edit: false, delete: false };
        const resetDependencyMap = {"Organization Project": ["Other Project","Organization Task","Other Task","Organization Subtask","Other Subtask"
          ],"Other Project": ["Other Task","Other Subtask"],"Organization Task": ["Other Task","Organization Subtask","Other Subtask"],"Other Task": ["Other Subtask"],"Organization Subtask": ["Other Subtask"]};
        const dependents = resetDependencyMap[k] || [];
        dependents.forEach(dep => {
          updatedPermission[dep] = { ...reset };
        });
      }
    setPermission(updatedPermission);
    };

    const handleAllPermission = event => {
        Object.entries(permission).map(function (t) {
            let checkbox = document.getElementById(t[0] + '_all');
            let checkboxAllpermission = document.getElementById('allpermission');
            let temp = permission[t[0]];
            if(t[0] === "Organization Project" || t[0] === "Organization Task"){
                if (event.target.checked === false) {
                    temp['view'] = true;
                    temp['create'] = false;
                    temp['edit'] = false;
                    temp['delete'] = false;
                    setPermission({ ...permission, ...{ [t[0]]: temp } });
                    checkbox.indeterminate = false;
                    checkboxAllpermission.indeterminate = false;
                } else {
                    temp['view'] = true;
                    temp['create'] = true;
                    temp['edit'] = true;
                    temp['delete'] = true;
                    setPermission({ ...permission, ...{ [t[0]]: temp } });
                    checkbox.indeterminate = true;
                    checkboxAllpermission.indeterminate = true;
                }
            }else  if(t[0] === "Organization Activity"){
                if (event.target.checked === false) {
                    temp['view'] = false;
                    temp['create'] = false;
                    temp['edit'] = false;
                    temp['delete'] = false;
                    setPermission({ ...permission, ...{ [t[0]]: temp } });
                    checkbox.indeterminate = false;
                    checkboxAllpermission.indeterminate = false;
                } else {
                    temp['view'] = true;
                    temp['create'] = false;
                    temp['edit'] = false;
                    temp['delete'] = false;
                    setPermission({ ...permission, ...{ [t[0]]: temp } });
                    checkbox.indeterminate = true;
                    checkboxAllpermission.indeterminate = true;
                }
            }
            else{
                if (event.target.checked === false) {
                    temp['view'] = false;
                    temp['create'] = false;
                    temp['edit'] = false;
                    temp['delete'] = false;
                    setPermission({ ...permission, ...{ [t[0]]: temp } });
                    checkbox.indeterminate = false;
                    checkboxAllpermission.indeterminate = false;
                } else {
                    temp['view'] = true;
                    temp['create'] = true;
                    temp['edit'] = true;
                    temp['delete'] = true;
                    setPermission({ ...permission, ...{ [t[0]]: temp } });
                    checkbox.indeterminate = true;
                    checkboxAllpermission.indeterminate = true;
                }
            }
        });
    };
    const initialState = {
        isValid: false,
        values: {
            permissionName: data ? data.permissionName : null,
        },
        touched: {},
        errors: {},
    };
    const [formState, setFormState] = useState({ ...initialState });
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
    const schema = {
        permissionName: permissionSchema,
    };
    useEffect(() => {
        const errors = validate(formState.values, schema);
        setFormState(prevFormState => ({
            ...prevFormState,
            isValid: !errors,
            errors: errors || {},
        }));
    }, [formState.values, formState.isValid]);

    const handleCreateOrEditPermission = event => {
        setOpen(false);
        let newData = transformForUpdate(permission);

        
        if (type === 'edit') {
            updatePermission(formState.values.permissionName == data.permissionName ? null : formState.values.permissionName, newData, data._id)
            .then(response => {
                if (response.data.statusCode == 200) {
                    handleGetAllPermission();
                    toast({
                        type: 'success',
                        message: response ? response.data.body.message : 'Something went wrong, Try again !',
                    });
                } else {
                    toast({
                        type: 'error',
                        message: response ? (response.data.body.message == 'Validation failed.' ? response.data.body.error : response.data.body.message) : 'Something went wrong, Try again !',
                    });
                }
            }).catch(function ({ response }) {
                toast({
                    type: 'error',
                    message: response ? (response.data.body.message == 'Validation failed.' ? response.data.body.error : response.data.body.message) : 'Something went wrong, Try again !',
                });
            });
        } else {
            createPermission(formState.values.permissionName, newData)
                .then(response => {
                    if (response.data.statusCode == 200) {
                        handleGetAllPermission();
                        toast({
                            type: 'success',
                            message: response ? response.data.body.message : 'Something went wrong, Try again !',
                        });
                    } else {
                        toast({
                            type: 'error',
                            message: response ? (response.data.body.message == 'Validation failed.' ? response.data.body.error : response.data.body.message) : 'Something went wrong, Try again !'
                        });
                    }
                    setFormState(initialState);
                    setPermission({
                        // dashboard: { view: false, create: false, edit: false, delete: false },
                        'Organization Project': { view: true, create: false, edit: false, delete: false },
                        "otherProject": { view: false, create: false, edit: false, delete: false },
                        'Organization Task': { view: true, create: false, edit: false, delete: false },
                        "otherTask": { view: false, create: false, edit: false, delete: false },
                        'Organization Subtask': { view: false, create: false, edit: false, delete: false },
                        "otherSubtask": { view: false, create: false, edit: false, delete: false },
                        'Organization User': { view: false, create: false, edit: false, delete: false },
                        'Organization Activity': { view: false, create: false, edit: false, delete: false },
                        'Organization Roles': { view: false, create: false, edit: false, delete: false },
                        'Organization Comments': { view: false, create: false, edit: false, delete: false },
                        'Organization Uploads': { view: false, create: false, edit: false, delete: false },
                        // plan: { view: false, create: false, edit: false, delete: false },
                        'Organization Links': { view: false, create: false, edit: false, delete: false },
                    });
                })
                .catch(function ({ response }) {
                    if (response.status === 429) {
                        openUpgradePlan();
                    } else {
                        toast({
                            type: 'error',
                            message: response ? response.data.body.message : 'Something went wrong, Try again !',
                        });
                    }
                });
        }
    };
    return (
        <>
            {type === 'edit' ? (
                // <NewToolTip direction='left' message={'permission'}>
                    <a
                        onClick={() => {
                            setOpen(true);
                        }}>
                        {' '}
                        <AiOutlineEdit />
                    </a>
                // </NewToolTip>
            ) : (
                <button onClick={() => setOpen(true)} className='small-button items-center py-2 flex h-8'>
                    <div className='flex items-center'>
                        <p className='m-0 p-0'>Add</p>
                    </div>
                </button>
            )}
            {open && (
                <>
                    <div className='justify-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-[10000] outline-none focus:outline-none'>
                        <div className='relative my-2 mx-auto w-11/12 lg:w-8/12 z-50'>
                            {/*content*/}
                            <div className='border-0 mb-7 sm:mt-8 rounded-2xl shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none'>
                                {/*header*/}
                                {/*body*/}
                                <button
                                    className='text-lightGrey hover:text-darkTextColor absolute -right-2 -top-2 rounded-full bg-veryLightGrey  uppercase  text-sm outline-none focus:outline-none p-1 ease-linear transition-all duration-150'
                                    type='button'
                                    onClick={() => {
                                        setOpen(false);
                                    }}>
                                    <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' stroke-width='2'>
                                        <path stroke-linecap='round' stroke-linejoin='round' d='M6 18L18 6M6 6l12 12' />
                                    </svg>
                                </button>
                                <div className='card xs:p-4'>
                                    <div className='flex flex-row justify-between '>
                                        <p className='text-2xl font-bold text-darkTextColor my-2'>{type === 'edit' ? 'Update Permission' : 'Add Permission'}</p>
                                        <div className='flex flex-row'>
                                            <div className='flex justify-center'>
                                                <div>
                                                    <div className='flex items-center pl-3'>
                                                        <input
                                                            onClick={handleAllPermission}
                                                            id='allpermission'
                                                            type='checkbox'
                                                            value=''
                                                            className='w-4 h-4 text-blue-600 bg-gray-100  rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500'
                                                        />
                                                        <label htmlFor='edit' className='w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
                                                            All permission
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            {'   '}
                                            <button
                                                disabled={!formState.isValid}
                                                data-modal-toggle='popup-modal'
                                                type='button'
                                                onClick={handleCreateOrEditPermission}
                                                className='small-button items-center py-2 flex h-8'>
                                                {type === 'edit' ? 'Update' : 'Add'}
                                            </button>
                                        </div>
                                    </div>
                                    <div className='flex flex-col gap-3 mt-5'>
                                            <FloatingTextfield
                                                type='text'
                                                placeholder={''}
                                                label={'Permission name'}
                                                error={hasError('permissionName')}
                                                errorMsg={displayErrorMessage(formState.errors.permissionName)}
                                                name='permissionName'
                                                value={formState.values.permissionName || ''}
                                                onChange={handleChange}
                                            />
                                            <div className='p-1.5 w-full inline-block align-middle'>
                                                <div className='overflow-hidden border rounded-lg px-4 py-2'>
                                                    {Object.entries(permission).map(function (t, k) {
                                                        return (
                                                            <>
                                                            <div className="flex items-center gap-1 my-2">
                                                                <p className='font-bold text-darkTextColor my-2'>{t[0][0].toUpperCase() + t[0].substring(1)}</p>
                                                                {t[0] === "Organization Activity" && (
                                                                    <div className="relative group">
                                                                    <span className="text text-blue-500 cursor-pointer">ⓘ</span>
                                                                        <div className="absolute z-10 hidden group-hover:block text-sm
                                                                            bg-black text-white dark:bg-slate-50 dark:text-white 
                                                                            text-xs rounded py-1 px-2 bottom-full mb-1 left-1/2 transform 
                                                                            -translate-x-1/2 whitespace-nowrap shadow-sm
                                                                            before:absolute before:top-[100%] before:left-1/2 before:transform 
                                                                            before:-translate-x-1/2 before:border-4 before:border-t-gray-100 
                                                                            before:border-transparent before:dark:border-t-gray-700">
                                                                            You can't perform Create, Edit or Delete
                                                                        </div>
                                                                    </div>
                                                                    )}
                                                            </div>
                                                                <ul className='items-center w-full text-sm font-medium text-gray-900 bg-white  sm:flex dark:bg-gray-700 dark:text-white'>
                                                                    <li className='w-full border-bsm:border-b-0 sm:border-r dark:border-gray-600'>
                                                                        <div className='flex items-center pl-3'>
                                                                            <input
                                                                                onChange={event => {
                                                                                    handleSetAll(event, t[0]);
                                                                                }}
                                                                                id={t[0] + '_all'}
                                                                                type='checkbox'
                                                                            checked={
                                                                                permission[t[0]]?.view && permission[t[0]]?.create && permission[t[0]]?.edit &&permission[t[0]]?.delete
                                                                            }
                                                                            ref={(el) => {
                                                                                if (el) {
                                                                                const p = permission[t[0]] || {};
                                                                                const values = [p.view, p.create, p.edit, p.delete];
                                                                                el.indeterminate = !(values.every(Boolean)) && !(values.every((v) => !v));
                                                                                }
                                                                            }}
                                                                                className='w-4 h-4 text-blue-600 bg-gray-100  rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500'
                                                                            />
                                                                            <label htmlFor='all' className='w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
                                                                                All
                                                                            </label>
                                                                        </div>
                                                                    </li>
                                                                    <li className='w-full border-bsm:border-b-0 sm:border-r dark:border-gray-600'>
                                                                        <div className='flex items-center pl-3'>
                                                                            <input
                                                                                id='view'
                                                                                onChange={event => {
                                                                                    handleSetValue(event, t[0], 'view');
                                                                                }}
                                                                                checked={t[1]?.view}
                                                                                type='checkbox'
                                                                                className='w-4 h-4 text-blue-600 bg-gray-100  rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500'
                                                                            />
                                                                            <label htmlFor='view' className='w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
                                                                                View
                                                                            </label>
                                                                        </div>
                                                                    </li>
                                                                    <li className='w-full border-bsm:border-b-0 sm:border-r dark:border-gray-600'>
                                                                        <div className='flex items-center pl-3'>
                                                                            <input
                                                                                id='create'
                                                                                onChange={event => {
                                                                                    handleSetValue(event, t[0], 'create');
                                                                                }}
                                                                                checked={t[1]?.create}
                                                                                disabled={t[0] === "Organization Activity"}
                                                                                type='checkbox'
                                                                                value=''
                                                                                className='w-4 h-4 text-blue-600 bg-gray-100  rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500'
                                                                            />
                                                                            <label htmlFor='create' className='w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
                                                                                Create
                                                                            </label>
                                                                        </div>
                                                                    </li>
                                                                    <li className='w-full border-bsm:border-b-0 sm:border-r dark:border-gray-600'>
                                                                        <div className='flex items-center pl-3'>
                                                                            <input
                                                                                id='edit'
                                                                                checked={t[1]?.edit}
                                                                                onChange={event => {
                                                                                    handleSetValue(event, t[0], 'edit');
                                                                                }}
                                                                                type='checkbox'
                                                                                disabled={t[0] === "Organization Activity"}
                                                                                value=''
                                                                                className='w-4 h-4 text-blue-600 bg-gray-100  rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500'
                                                                            />
                                                                            <label htmlFor='edit' className='w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
                                                                                Edit
                                                                            </label>
                                                                        </div>
                                                                    </li>
                                                                    <li className='w-full dark:border-gray-600'>
                                                                        <div className='flex items-center pl-3'>
                                                                            <input
                                                                                id='delete'
                                                                                checked={t[1]?.delete}
                                                                                onChange={event => {
                                                                                    handleSetValue(event, t[0], 'delete');
                                                                                }}
                                                                                type='checkbox'
                                                                                disabled={t[0] === "Organization Activity"}
                                                                                value=''
                                                                                className='w-4 h-4 text-blue-600 bg-gray-100  rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500'
                                                                            />
                                                                            <label htmlFor='delete' className='w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
                                                                                Delete
                                                                            </label>
                                                                        </div>
                                                                    </li>
                                                                </ul>
                                                            </>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                    </div>
                                </div>
                                {/* <div className="p-6 text-center">
                                        <button data-modal-toggle="popup-modal" type="button" onClick={() => { setOpen(false) }}
                                            className="small-button items-center py-2 flex h-9"
                                        >
                                            Close
                                        </button>
                                    </div> */}
                            </div>
                        </div>
                        <div className='opacity-25 fixed inset-0 z-100 bg-black'></div>
                    </div>
                </>
            )}
        </>
    );
};
export default userDetails;
