/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState ,useMemo} from "react";
import { AiOutlineEdit } from "@react-icons/all-files/ai/AiOutlineEdit";
import validate from "validate.js";
import FloatingTextfield from "../../../../components/FloatingTextfield";
import { TextArea } from "../../../../components/TextArea";
import {
  displayErrorMessage,
  formatedDate,
  openUpgradePlan,
  uniqueArrays,
  uniqueMembers,
} from "../../../../helper/function";
import { updateProject } from "../api/put";
import { createProjectApi } from "../api/post";
import toast from "../../../../components/Toster/index";
import MultiSelectDropDown from "../../../../components/MultiSelectDropDown";
import {
  projectCodeSchema,
  startDateSchema,
  endDateSchema,
  budgetSchema,
  descriptionSchema,
  projectNameSchema,
  requiredSchema,
} from "../../../../helper/schema";
import _ from "lodash";
import moment from "moment";
import { CgAsterisk } from "react-icons/cg";
import { currencyList } from "../../../../helper/exportData";
import { FloatingSelectfield } from "../../../../components/FloatingSelectfield";
import { projectExist } from "../api/get";
import LabelWithRefresh from "@COMPONENTS/labelWithRefresh";
import dynamic from 'next/dynamic';
import { getAllRoles, getClientComapny, getClientDetails } from "@WORKFORCE_MODULES/members/api/get";
const createOrEditProjectModel = ({
  type,
  handleGetAllMembers,
  handleGetAllGroup,
  handleGetAllProject,
  users,
  data,
  stopLoading,
  startLoading,
  groupList,
  clientDetails,
  roleList,
  sortTable
}) => {
  
  const initialState = {
    isValid: false,
    values: {
      projectName: data ? data.projectName : null,
      projectCode: data ? data.projectCode : null,
      clientName:  data ? Array.isArray(data?.clientCompany) ? data?.clientCompany.filter(item => !item.key) : [] : [],
      clientCompany: data ? Array.isArray(data?.clientCompany) ? data?.clientCompany.filter(item => !item.clientName) : [] : [],
      description: data ? data.description : '',
      reason: data ? data.reason : null,
      startDate: data
        ? formatedDate(data.startDate)
        : moment().format("YYYY-MM-DD"),
      endDate: data
        ? formatedDate(data.endDate)
        : moment().add(30, "d").format("YYYY-MM-DD"),
      estimationDate: data
        ? formatedDate(data.estimationDate)
          ? formatedDate(data.estimationDate)
          : moment().add(8, "d").format("YYYY-MM-DD")
        : moment().add(8, "d").format("YYYY-MM-DD"),
      completedDate: data ? formatedDate(data.completedDate) : null,
      manager: data
        ? data.userAssigned?.filter(function (d) {
            return d.role === "manager";
          })
        : [],
      owner: data
        ? data.userAssigned?.filter(function (d) {
            return d.role === "owner";
          })
        : [],
      sponsor: data
        ? data.userAssigned?.filter(function (d) {
            return d.role === "sponsor";
          })
        : [],
      members: data
        ? data.userAssigned?.filter(function (d) {
            return d.role === "member";
          })
        : [],
      customMembers: data
        ? data.userAssigned?.filter(function (d) {
            return (
              d.role !== "member" &&
              d.role != "manager" &&
              d.role != "owner" &&
              d.role != "sponsor"
            );
          })
        : [],
      plannedBudget: data ? data.plannedBudget : 0,
      actualBudget: data ? data.actualBudget : 0,
      currencyType: data ? data.currencyType : "INR",
      userAssigned: [],
      group: data ? data.group : [],
      status: data ? data.status : "Todo",
    },
    touched: {},
    errors: {
      projectName: null,
      projectCode: null,
      clientName:[],
      clientCompany:[],
      description: null,
      reason: null,
      startDate: null,
      endDate: null,
      estimationDate: null,
      completedDate: null,
      manager: null,
      owner: null,
      sponsor: null,
      members: null,
      plannedBudget: null,
      actualBudget: null,
      currencyType: null,
    },
  };
  const [showModal, setShowModal] = useState(false);
  const [multipleOption, setMultipleOption] = useState([]);
  const [formState, setFormState] = useState({ ...initialState });
  const [selectedRole, setSelectedRole] = useState(null);
  const [clientNames, setClientNames] = useState([]);
  const [clientDetailsOne, setclientDetailsOne] = useState(null)

  useEffect(()=>{
    if(Array.isArray(data?.clientCompany)){
      setClientNames((data?.clientCompany?.filter(item => !item.key)).map((item)=>{
        return {
          id: item?.clientId,
          key: item?.clientName,
        };
      }));
    }
  },[data])

  const handleGetAllComapnyClientNames = (condition = '') => {
    getClientDetails(condition).then(response => {
        if (response.data.body.status === "success") {
            let companyList = response?.data.body.data.companyDetail.map((item) => {
                return {
                    id: item._id,
                    key: item.clientCompany,
                    }
            })
            setclientDetailsOne(companyList);
        }
    
       
    })
}
useEffect(() => {
  
  handleGetAllComapnyClientNames('?limit=' + process.env.TOTAL_USERS);
  
}, []);
const handleChangeMultiSelectorclientNames = (selectedValues) => {
  // console.log(selectedValues,'selectedValues')
  // setFormState((formState) => ({
  //   ...formState,
  //   values: {
  //     ...formState.values,
  //     clientName: selectedValues,
  //   },
    
  // }));
}
const handleChangeMultiSelectorCompany = (selectedValues) => {
setFormState((formState) => ({
  ...formState,
  values: {
    ...formState.values,
    clientCompany: selectedValues,
  },
  
}));
const selectedCompanies = clientDetailsOne.filter((company) =>
selectedValues.some((selected) => selected.key === company.key)
);

const selectedCompanyIds = selectedCompanies.map((company) => company.id);

if (selectedCompanyIds.length > 0) {
handleGetClientNamesByCompany(selectedCompanyIds);
} else {
setClientNames([]);
}
};
         
const handleGetClientNamesByCompany = (companyId) => {
  const concatenatedClientNames = [];
  const uniqueClientIds = new Set();

  getClientDetails('?limit=' + process.env.TOTAL_USERS)
    .then((response) => {
      if (response.data.body.status === 'success') {
        response.data.body.data.companyDetail.map((company) => {
          if (companyId.includes(company._id)) {
            const clientNamesList = company.clientName.map((client) => {
              if (!uniqueClientIds.has(client.id)) {
                uniqueClientIds.add(client.id); 
                return {
                  id: client.id,
                  key: client.clientName,
                  value: client,
                };
              }
              return null; 
            });

            concatenatedClientNames.push(...clientNamesList.filter(Boolean));
          }
        });

        setClientNames(concatenatedClientNames);
      }
    });
};
  const handleCloseModel = () => {
    setShowDynamicInput(false);
    setShowModal(false);
    setFormState({ ...initialState });
    if(type !== "edit"){
    setClientNames([]);
    }

  };
  useEffect(() => {
    setFormState({ ...initialState });
  }, [data]);
  const schema = {
    projectCode: projectCodeSchema,
    // description: descriptionSchema,
    projectName: projectNameSchema,
    currencyType: requiredSchema,
    // owner: requiredSchema,
    startDate: startDateSchema,
    endDate: endDateSchema,
    // members: requiredSchema,
    plannedBudget: budgetSchema,
    actualBudget: budgetSchema,
  };
  useEffect(() => {
    const errors = validate(formState.values, schema);
    setFormState((prevFormState) => ({
      ...prevFormState,
      isValid: !errors,
      errors: errors || {},
    }));
  }, [formState.values, formState.isValid]);

  const handleFilterClient = (value) =>{
    if(!clientDetails) return false;
    let clientName = clientDetails.filter((d) =>{ return d.company.clientCompany === value})
    setFormState((formState) => ({
      ...formState,
      values: {
        ...formState.values,
        clientName: clientName.length === 0 ? "" : clientName[0].company.clientName,
      },
    }));
  }

  const handleChange = (event) => {
    event.persist();
    if (event.target.name === "projectName") {
      projectExist(event.target.value).then((result) => {
        if (result.data.statusCode === 200) {
          formState.errors.projectName;
          setFormState((formState) => ({
            ...formState,
            errors: {
              ...formState.errors,
              projectName: "Project Already exist",
            },
          }));
        }
      });
      setFormState((formState) => ({
        ...formState,
        values: {
          ...formState.values,
          projectCode:
            event.target.value.toUpperCase().substring(0, 3) +
            Math.random().toString(16).slice(10),
        },
      }));
    }
    if (event.target.name === "projectCode") {
      setFormState((formState) => ({
        ...formState,
        values: {
          ...formState.values,
          projectCode: event.target.value.toUpperCase(),
        },
      }));
    }
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
  const handleDescription = event =>{

    setFormState(formState => ({
        ...formState,
        values: {
            ...formState.values,
            description: event,
        },
    }));
}

  

  const handleChangeRole = (e) => {
    setSelectedRole(e.target.value);
  };
  const hasError = (field) =>
    !!(formState.touched[field] && formState.errors[field]);

  const handleChangeMultiSelector = (data, name, type) => {
    if (name === "group" && type === "select") {
      let tempMember = [];
      let tempManager = [];
      let tempOwner = [];
      let tempSponsor = [];
      let tempCustomMembers = [];
      data.map((d1) => {
        d1.value.assignedMembers
          .filter((d2) => {
            return d2.role === "member";
          })
          .map((d3) => {
            tempMember.push(d3);
          });

        d1.value.assignedMembers
          .filter((d2) => {
            return d2.role === "manager";
          })
          .map((d3) => {
            tempManager.push(d3);
          });

        d1.value.assignedMembers
          .filter((d2) => {
            return d2.role === "owner";
          })
          .map((d3) => {
            tempOwner.push(d3);
          });

        d1.value.assignedMembers
          .filter((d2) => {
            return d2.role === "sponsor";
          })
          .map((d3) => {
            tempSponsor.push(d3);
          });

        d1.value.assignedMembers
          .filter((d2) => {
            return (
              d2.role !== "sponsor" &&
              d2.role !== "manager" &&
              d2.role !== "owner" &&
              d2.role !== "member"
            );
          })
          .map((d3) => {
            tempCustomMembers.push(d3);
          });
      });
      setFormState((formState) => ({
        ...formState,
        values: {
          ...formState.values,
          manager: uniqueMembers([...formState.values.manager, ...tempManager]),
          members:uniqueMembers ([...formState.values.members, ...tempMember]),
          owner: uniqueMembers([...formState.values.owner, ...tempOwner]),
          sponsor: uniqueMembers([...formState.values.sponsor, ...tempSponsor]),
          customMembers: uniqueMembers([
            ...formState.values.customMembers,
            ...tempCustomMembers,
          ]),
        },
      }));
    }

    var finalData = data.map(function (val) {
      return val.value;
    });
    setFormState((formState) => ({
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

  const handleCreateOrEditProject = (event) => {
    event.persist();
    startLoading();
    let assignTo = formState.values.manager
      .concat(
        formState.values.members,
        formState.values.sponsor,
        formState.values.owner,
        formState.values.customMembers
      )
      .map((d) => {
        return { id: d._id };
      });
    let temp = {
      ..._.omit(formState.values, [
        "members",
        "sponsor",
        "manager",
        "owner",
        "group",
        "customMembers",
        'clientName',
      ]),
      ...{
        userAssigned: assignTo,
      },
    };
    if (type === "edit") {
      updateProject(data._id, temp)
        .then(function (result) {
          handleCloseModel();
          if (result.data.body.status == "success") {
            toast({
              type: "success",
              message: result ? result.data.body.message : "Try again !",
            });
            setFormState({ ...initialState });
            handleGetAllProject("?limit=" + sortTable.limit+"&skip=" + sortTable.skip);
          } else {
            toast({
              type: "error",
              message: result ? result.data.body.message : "Error",
            });
          }
          stopLoading();
        })
        .catch(function ({ response }) {
          setShowModal(false);
          stopLoading();
          toast({
            type: "error",
            message: response
              ? response.data.body.error
              : "Something went wrong, Try again !",
          });
        });
    } else {
      createProjectApi({ project: [temp] }).then(function (result) {
          if (result.data.body.status == "success") {
            toast({
              type: "success",
              message: result ? result.data.body.message : "Try again !",
            });
            setShowModal(false);
            handleGetAllProject("?limit=" + sortTable.limit+"&skip=" + sortTable.skip);
            setFormState({ ...initialState });
            setClientNames([]);
          } else {
            toast({
              type: "error",
              message: result ? result.data.body.message === "Validation failed." ? result.data.body.error : result.data.body.message : 'Error',
            });
          }
          stopLoading();
        })
        .catch(function ({ response }) {
          setShowModal(false);
          if (response?.status === 429) {
            openUpgradePlan();
          } else {
            toast({
              type: "error",
              message: response
                ? response.data.body.error
                : "Something went wrong, Try again !",
            });
          }
          stopLoading();
        });
    }
  };

  const statusDetails = [
    { text: "Todo", value: "Todo" },
    { text: "Done", value: "Done" },
    { text: "Inprogress", value: "Inprogress" },
    { text: "Pending", value: "Pending" },
    { text: "Review", value: "Review" },
  ];
  const [showDynamicInput, setShowDynamicInput] = useState(false);

  const handleTextAreaClick = () => {
    setShowDynamicInput(!showDynamicInput);
  };
  const DynamicCustomInput =useMemo(()=> dynamic(()=>import('@COMPONENTS/ReactQuillTextEditor'), { ssr: false }),[]);
  const displayValue = () => {
    // Use DOMParser to parse HTML and extract text content
    const parser = new DOMParser();
    const parsedHtml = parser.parseFromString(formState.values.description, 'text/html');
    return parsedHtml.body.textContent || "";
  };
  return (
    <>
      {type === "edit" ? (
        <button
          className="grey-link mr-4"
          onClick={() => {
            setShowModal(true);
          }}
        >
          <AiOutlineEdit />
        </button>
      ) : (
        <button
          className="small-button items-center xs:w-full py-1 flex h-7"
          onClick={() => {
            setShowModal(true);
          }}
        >
          Create Project
        </button>
      )}
      {showModal && (
        <>
          <div className="justify-center flex overflow-x-hidden overflow-y-auto mb-4 fixed inset-0 z-[999] outline-none focus:outline-none" >
            <div className="relative my-2 mx-auto w-11/12 lg:w-7/12 z-[999]">
              {/*content*/}
              <div className="border-0 mb-7 sm:mt-8 rounded-2xl shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                {/*body*/}
                <div className="relative py-5 sm:px-3 p-3 md:px-10 flex-auto">
                  <button
                    className="text-lightGrey hover:text-darkTextColor absolute -right-2 -top-2 rounded-full bg-veryLightGrey  uppercase  text-sm outline-none focus:outline-none p-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={handleCloseModel}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeWidth="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                  <div className="rounded-lg bg-white">
                    {/* body project popup start here */}
                    <div className="">
                        <p className="text-darkTextColor sm:text-xl text-2xl font-bold">
                          {type === "edit" ? "Edit Project" : " Create Project"}
                        </p>
                             <label className='text-base my-2 font-bold text-darkTextColor flex' htmlFor=''>
                                    Required Fileds are marked with an asterisk <CgAsterisk color='red' />
                             </label>
                        <div className="sm:flex gap-5 items-center mt-2">
                          <div className="flex flex-col sm:w-2/4">
                            <label
                              className="text-base my-2 font-bold text-darkTextColor flex"
                              htmlFor=""
                            >
                                Project Name <CgAsterisk color="red" />{" "}
                            </label>
                              <FloatingTextfield
                                name={"projectName"}
                                value={formState.values.projectName}
                                onChange={handleChange}
                                error={hasError("projectName")}
                                errorMsg={displayErrorMessage(
                                  formState.errors.projectName
                                )}
                                onPaste={undefined}
                                autoComplete={undefined}
                              />
                          </div>

                          <div className="input_box flex flex-col sm:w-2/4">
                            <label
                              className="text-base my-2 font-bold text-darkTextColor flex"
                              htmlFor=""
                            >
                                 Project Code <CgAsterisk color="red" />
                            </label>
                              <FloatingTextfield
                                textTransform={true}
                                name={"projectCode"}
                                value={formState.values.projectCode}
                                onChange={handleChange}
                                error={hasError("projectCode")}
                                errorMsg={displayErrorMessage(
                                  formState.errors.projectCode
                                )}
                              />
                          </div>
                        </div>
                        {/* <div className="sm:flex gap-5 items-center">
                          <div className="flex flex-col sm:w-2/4">
                            <label
                              className="text-base my-2 font-bold text-darkTextColor flex"
                              htmlFor=""
                            > Company Name 
                            </label>
                            <MultiSelectDropDown
                                handleChangeMultiSelector={
                                  handleChangeMultiSelectorCompany
                                }
                              
                                value={formState.values.clientCompany}
                                selectedValues={formState.values.clientCompany}
                                name={"clientCompany"}
                                option={clientDetailsOne}
                                label={undefined}
                              />
                          </div>
                          <div className="input_box flex flex-col sm:w-2/4">
                            <label
                              className="text-base my-2 font-bold text-darkTextColor flex"
                              htmlFor=""
                            >
                                Client Name 
                            </label>
                            <MultiSelectDropDown
                                handleChangeMultiSelector={
                                  handleChangeMultiSelectorclientNames
                                }
                              
                                value={formState.values.clientName}
                                selectedValues={clientNames}
                                name={"clientName"}
                                option={clientNames}
                                label={undefined}
                                disable={true}
                              />
                          </div>
                        </div> */}
                        <div className="mt-2 sm:mb-6 taskTextArea">
                          <label className="text-base my-2 font-bold text-darkTextColor flex">
                                Description
                          </label>
                          {/* <TextArea
                            type="text"
                            label={""}
                            error={hasError("description")}
                            errorMsg={displayErrorMessage(
                              formState.errors.description
                            )}
                            name="description"
                            value={formState.values.description || ""}
                            onChange={handleChange}
                          /> */}
                            {showDynamicInput ? (

                             <DynamicCustomInput 
                              type='text'
                              name='taskDetails'
                              value={formState.values.description || ''}
                              onChange={handleDescription}
                              /> 
                            ):(
                              <div onClick={handleTextAreaClick}>
                            <TextArea
                             type='text'
                             name='taskDetails'
                            className='text-base border rounded-md w-full px-3 py-1 bg-gray-100/50 outline-brandBlue'
                            value={displayValue()}
                            backgroundColor={'darkGray'}
                            // disabled={true}
                            />
                           </div>
                            )}                           
                        </div>
                        {type === "edit" && new Date() > new Date(formState.values.endDate) ? (
                        <div className="mt-2 sm:mb-6 taskTextArea">
                          <label className="text-base my-2 font-bold text-darkTextColor flex">
                              Reason
                          </label>
                          <TextArea
                            type="text"
                            label={""}
                            error={hasError("reason")}
                            errorMsg={displayErrorMessage(
                              formState.errors.reason
                            )}
                            name="reason"
                            value={formState.values.reason || ""}
                            onChange={handleChange}
                          />
                        </div>
                        ) : (
                          <></>
                        )}
                        {type === "edit" ? (
                          <div className="mb-6">
                            <label className="text-base my-2 font-bold text-darkTextColor flex">
                                <b> Project Status</b>{" "}
                                <CgAsterisk color="red" />{" "}
                            </label>                              
                              <FloatingSelectfield
                                label={""}
                                optionsGroup={statusDetails}
                                name={"status"}
                                // error={hasError("clientCompany")}
                                errorMsg={displayErrorMessage(
                                  formState.errors.clientCompany
                                )}
                                value={formState?.values?.status}
                                onChange={(event) =>
                                  handleChange(event)
                                }
                              
                              />
                          </div>
                        ) : (
                          <></>
                        )}

                        {
                          <div className="sm:flex justify-center gap-5 items-center">
                            <div
                              className={`input_box flex flex-col sm:w-2/4  ${
                                type === "edit"
                                  ? ""
                                  : "xl:w-2/4 lg:w-2/4 md:w-full"
                              }`}
                            >
                              <label
                                className="text-base my-2 font-bold text-darkTextColor flex"
                                htmlFor=""
                              >
                                    Planned start date
                                  <CgAsterisk color="red" />{" "}
                              </label>
                                <FloatingTextfield
                                  type="date"
                                  min={formState.values.startDate || ''}
                                  name={"startDate"}
                                  value={formState.values.startDate}
                                  onChange={handleChange}
                                  error={hasError("startDate")}
                                  errorMsg={displayErrorMessage(
                                    formState.errors.startDate
                                  )}
                                  onPaste={undefined}
                                  autoComplete={undefined}
                                />
                            </div>
                            <div className="input_box flex flex-col sm:w-2/4 ">
                            <label
                              className="text-base my-2 font-bold text-darkTextColor flex"
                              htmlFor=""
                            >
                                Estimation date
                            </label>
                              <FloatingTextfield
                                type="date"
                                min={formState.values.startDate || ''}
                                name={"estimationDate"}
                                value={formState.values.estimationDate}
                                onChange={handleChange}
                                error={hasError("estimationDate")}
                                errorMsg={displayErrorMessage(
                                  formState.errors.estimationDate
                                )}
                                onPaste={undefined}
                                autoComplete={undefined}
                              />
                          </div>
                            {type === "edit" && (
                              <div className="input_box flex flex-col sm:w-2/4 ">
                                <label
                                  className="text-base my-2 font-bold text-darkTextColor flex"
                                  htmlFor=""
                                >
                                  Planned end date
                                    <CgAsterisk color="red" />{" "}
                                </label>
                                  <FloatingTextfield
                                    type="date"
                                    name={"endDate"}
                                    min={formState.values.startDate}
                                    value={formState.values.endDate}
                                    onChange={handleChange}
                                    error={hasError("endDate")}
                                    errorMsg={displayErrorMessage(
                                      formState.errors.endDate
                                    )}
                                    onPaste={undefined}
                                    autoComplete={undefined}
                                  />
                              </div>
                            )}
                            {type === "edit" ? (
                          <div className="input_box flex flex-col sm:w-2/4 ">
                            <label
                              className="text-base my-2 font-bold text-darkTextColor flex"
                              htmlFor=""
                            >
                                  Completed date
                            </label>
                              <FloatingTextfield
                                type="date"
                                min={formState.values.startDate || ''}
                                name={"completedDate"}
                                value={formState.values.completedDate}
                                onChange={handleChange}
                                error={hasError("completedDate")}
                                errorMsg={displayErrorMessage(
                                  formState.errors.completedDate
                                )}
                                onPaste={undefined}
                                autoComplete={undefined}
                              />
                          </div>
                           ) : (
                            <></>
                          )}
                          </div>
                        }
                        <div className="sm:flex gap-5 mb-3">
                          
                          
                          <div className="flex flex-col sm:w-full ">
                            {/* <b><LabelWithRefresh
                              label={"Filter Members by Group"}
                              onClick={handleGetAllGroup}
                            /></b> */}
                            <label
                              className="text-base my-2 font-bold text-darkTextColor flex"
                              htmlFor=""
                            >
                                  Filter Members by Group
                            </label>
                              <MultiSelectDropDown
                                handleChangeMultiSelector={
                                  handleChangeMultiSelector
                                }
                                value={formState.values.group}
                                selectedValues={formState.values.group}
                                name={"group"}
                                option={groupList}
                                label={undefined}
                              />
                          </div>
                        </div>
                        {/* <div className="sm:flex gap-5 mb-3"> */}
                          <div className="flex flex-col sm:w-full ">
                            {/* <b><LabelWithRefresh
                              label={"Project Manager(S)"}
                              onClick={handleGetAllMembers}
                            /></b> */}
                             <label
                              className="text-base my-2 font-bold text-darkTextColor flex"
                              htmlFor=""
                            >
                              Project Manager(s)
                            </label>
                              <MultiSelectDropDown
                                selectedValues={formState.values.manager}
                                handleChangeMultiSelector={
                                  handleChangeMultiSelector
                                }
                                name={"manager"}
                                option={uniqueArrays(
                                  users.filter(function (d) {
                                    return d.role === "manager";
                                  })
                                )}
                                label={undefined}
                                value={formState.values.manager}
                              />
                          </div>
                          <div className="flex flex-col sm:w-full ">
                            {/* <b><LabelWithRefresh
                              label={"Assigned To Members"}
                              onClick={handleGetAllMembers}
                            /></b> */}
                             <label
                              className="text-base my-2 font-bold text-darkTextColor flex"
                              htmlFor=""
                            >
                                  Assigned To Members
                            </label>
                              <MultiSelectDropDown
                                handleChangeMultiSelector={
                                  handleChangeMultiSelector
                                }
                                value={formState.values.members}
                                selectedValues={formState.values.members}
                                name={"members"}
                                option={uniqueArrays(
                                  users.filter(function (d) {
                                    return d.role === "member";
                                  })
                                )}
                                label={undefined}
                              />
                          </div>
                        {/* </div> */}
                        {/* <div className="sm:flex gap-5 mb-3"> */}
                          <div className="flex flex-col sm:w-full ">
                            {/* <b><LabelWithRefresh
                              label={"Owner "}
                              onClick={handleGetAllMembers}
                            /></b> */}
                             <label
                              className="text-base my-2 font-bold text-darkTextColor flex"
                              htmlFor=""
                            >Owner
                            </label>
                              <MultiSelectDropDown
                                selectedValues={formState.values.owner}
                                handleChangeMultiSelector={
                                  handleChangeMultiSelector
                                }
                                name={"owner"}
                                option={users.filter(function (d) {
                                  return d.role === "owner";
                                })}
                                value={formState.values.owner}
                                label={undefined}
                              />
                          </div>
                          <div className="flex flex-col sm:w-full ">
                            {/* <b><LabelWithRefresh
                              label={"Sponsor"}
                              onClick={handleGetAllMembers}
                            /></b> */}
                             <label
                              className="text-base my-2 font-bold text-darkTextColor flex"
                              htmlFor=""
                            >Sponsor
                            </label>
                              <MultiSelectDropDown
                                selectedValues={formState.values.sponsor}
                                handleChangeMultiSelector={
                                  handleChangeMultiSelector
                                }
                                name={"sponsor"}
                                option={users.filter(function (d) {
                                  return d.role === "sponsor";
                                })}
                                value={formState.values.sponsor}
                                label={undefined}
                              />
                          </div>
                        {/* </div> */}
                        <div className="sm:flex gap-5 mb-3">
                          <div className="flex flex-col sm:w-2/4">
                            {/* <b><LabelWithRefresh
                              label={"Select Role (optional)"}
                            /></b> */}
                             <label
                              className="text-base my-2 font-bold text-darkTextColor flex"
                              htmlFor=""
                            >
                                  Select Role (optional)
                            </label>
                              <FloatingSelectfield
                                optionsGroup={roleList}
                                name={"category"}
                                value={selectedRole}
                                onChange={handleChangeRole}
                              />
                          </div>
                          <div className="flex flex-col sm:w-2/4 ">
                            {/* <b><LabelWithRefresh label={"Users (optional)"} /></b> */}
                            <label
                              className="text-base my-2 font-bold text-darkTextColor flex"
                              htmlFor=""
                            >
                              Users (optional)
                            </label>
                              <MultiSelectDropDown
                                selectedValues={formState.values.customMembers}
                                handleChangeMultiSelector={
                                  handleChangeMultiSelector
                                }
                                name={"customMembers"}
                                option={users.filter(function (d) {
                                  return d.role === selectedRole;
                                })}
                                value={formState.values.customMembers}
                                label={undefined}
                                // disable={selectedRole ? false : true}
                              />
                          </div>
                        </div>
                        <div className="sm:flex gap-5 mb-3">
                          <div className="input_box flex flex-col sm:w-2/4">
                            <label
                              className="text-base my-2 font-bold text-darkTextColor flex"
                              htmlFor=""
                            >
                                  Planned Budget (optional)
                            </label>
                              <FloatingTextfield
                                name={"plannedBudget"}
                                error={hasError("plannedBudget")}
                                errorMsg={displayErrorMessage(
                                  formState.errors.plannedBudget
                                )}
                                value={formState.values.plannedBudget}
                                onChange={handleChange}
                                onPaste={undefined}
                                autoComplete={undefined}
                              />
                          </div>
                          <div className="input_box flex flex-col sm:w-2/4">
                            <label
                              className="text-base my-2 font-bold text-darkTextColor flex"
                              htmlFor=""
                            >
                                  Actual Budget (optional)
                            </label>
                              <FloatingTextfield
                                name={"actualBudget"}
                                error={hasError("actualBudget")}
                                errorMsg={displayErrorMessage(
                                  formState.errors.actualBudget
                                )}
                                value={formState.values.actualBudget}
                                onChange={handleChange}
                                onPaste={undefined}
                                autoComplete={undefined}
                              />
                          </div>
                          <div className="input_box flex flex-col sm:w-2/4">
                            <label
                              className="text-base my-2 font-bold text-darkTextColor flex"
                              htmlFor=""
                            >Currency
                            </label>
                              <FloatingSelectfield
                                label={""}
                                optionsGroup={currencyList}
                                name={"currencyType"}
                                error={hasError("currencyType")}
                                errorMsg={displayErrorMessage(
                                  formState.errors.currencyType
                                )}
                                value={formState.values.currencyType}
                                onChange={handleChange}
                              />
                          </div>
                        </div>
                        <div className="float-right sm:mt-8 my-2">
                          <div className="flex items-center sm:gap-5 gap-4 ">
                            <div
                              onClick={handleCloseModel}
                              className="hover:text-darkBlue cursor-pointer text-lightTextColor"
                            >
                              Cancel
                            </div>
                            <button
                              type="button"
                              disabled={!formState.isValid}
                              className="small-button items-center xs:w-full flex sm:text-md text-sm"
                              onClick={handleCreateOrEditProject}
                            >
                              {type === "edit"
                                ? "Edit Project"
                                : "Create Project"}
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 Sm:h-5 sm:w-5 "
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                    </div>
                    {/* body project popup end here */}
                  </div>
                </div>
              </div>
            </div>
            <div
              className="opacity-25 fixed inset-0 z-40 bg-black"
              onClick={handleCloseModel}
            ></div>
          </div>
        </>
      )}
    </>
  );
};
export default createOrEditProjectModel;
