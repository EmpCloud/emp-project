import React, { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { BiEditAlt } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { CgPlayListAdd } from "react-icons/cg";
import { ImCross } from "react-icons/im";
import ContentEditable from "../../../../components/ContentEditable";
import DropDown from "../../../../components/DropDown";
import SearchInput from "../../../../components/SearchInput";
import { getAllTaskType, getSearchDefault } from "../api/get";
import { createTaskType } from "../api/post";
import toast from "../../../../components/Toster/index";
import { deleteAllTaskType, deleteTaskTypeById } from "../api/delete";
import DeleteConformation from "../../../../components/DeleteConformation";
import { downloadFiles } from "../../../../helper/download";
import { updateTaskType } from "../api/put";
import { capitalizeString, openUpgradePlan } from "../../../../helper/function";
import {
  Popover,
  PopoverHandler,
  PopoverContent,
  Button,
  Input,
  Typography,
} from "@material-tailwind/react";

const taskTypeConfig = ({ startLoading, stopLoading }) => {
  const [open, setOpen] = useState(false);
  const [custom, setCustomData] = useState("");
  const [id, setId] = useState();
  const [keys, setKeys] = useState();
  const [catagoryValues, setcatagoryValues] = useState("");

  const handleClickOpen = (data, key, id) => {
    setOpen(true);
    setCustomData(data);
    setKeys(key);
    setId(id);
  };

  const handleClose = (event, reason) => {
    if (reason !== "backdropClick") {
      setOpen(false);
    }
  };

  const [taskTypeDetails, setTaskTypeDetails] = useState(null);
  const [addTaskType, setAddTaskType] = useState(false);
  const [addValue, setAddValue] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [deleteTaskId, setDeleteTaskId] = useState("");
  const [openDeleteModel, setOpenDeleteModel] = useState(false);
  const [openDeleteAllModel, setOpenDeleteAllModel] = useState(false);

  const handleUpdateTaskType = (id, data) => {
    if (!data) {
      toast({
        type: "info",
        message: "No change in value!",
      });
      return;
    }
    updateTaskType(id, data)
      .then((response) => {
        startLoading();
                 if (response.data.body.status === "success") {
          toast({
            type: "success",
            message: response ? response.data.body.message : "Try again !",
          });
          handleGetAllTaskType();
        } else {
          toast({
            type: "error",
            message: response ? response.data.body.message : "Error",
          });
        }
                stopLoading();
      })
      .catch(function ({ response }) {
        toast({
          type: "error",
          message: response
            ? response.data.body.message
            : "Something went wrong, Try again !",
        });
      });
  };
  const handleGetAllTaskType = () => {
    getAllTaskType().then((response) => {
      if (response.data.body.status === "success") {
        setTaskTypeDetails(response.data.body.data.data);
      }
    });
  };

  useEffect(() => {
    handleGetAllTaskType();
  }, []);
  useEffect(() => {}, [taskTypeDetails]);
  const download_data = [
    {
      text: "Download CSV file",
      value: "excel",
      onClick: () => {
        if (taskTypeDetails.length === 0) {
          toast({
            type: "error",
            message: "Please add data before downloading.",
          });
        } else {
          downloadFiles("excel", "Task-Type", FinalDownloadData);
        }
      },
    },
    {
      text: "Download PDF file",
      value: "pdf",
      onClick: () => {
        if (taskTypeDetails.length === 0) {
          toast({
            type: "error",
            message: "Please add data before downloading.",
          });
        } else {
          downloadFiles("pdf", "Task-Type", FinalDownloadData);
        }
      },
    },
    {
      text: "Delete all",
      value: 2,
      onClick: (event, value, data, name) => {
        if (taskTypeDetails.length === 0) {
          toast({
            type: "error",
            message: "Please add data before deleting.",
          });
        } else {
          setOpenDeleteAllModel(!openDeleteAllModel);
        }
      },
    },
  ];
  const handleCreateTaskType = () => {
    createTaskType(capitalizeString(addValue))
      .then((response) => {
        startLoading();
        if (response.data.body.status === "success") {
          handleGetAllTaskType();
          toast({ type: "success", message: response.data.body.message });
        }
        stopLoading();
      })
      .catch(function ({ response }) {
        if (response.status === 429) {
          openUpgradePlan();
        } else {
          toast({
            type: "error",
            message: response
              ? response.data.body.message
              : "Something went wrong, Try again !",
          });
        }
      });
  };
  const handleDeleteTaskTypeById = (id) => {
    deleteTaskTypeById(deleteTaskId)
      .then(function (result) {
        if (result.data.body.status == "success") {
          handleGetAllTaskType();
          toast({
            type: "success",
            message: result ? result.data.body.message : "Try again !",
          });
        } else {
          toast({
            type: "error",
            message: result ? result.data.body.message : "Error",
          });
        }
      })
      .catch(function (e) {
        toast({
          type: "error",
          message: e.response
            ? e.response.data.body.message
            : "Something went wrong, Try again !",
        });
      });
    setOpenDeleteModel(false);
  };
  const handleDeleteAllTaskType = () => {
    deleteAllTaskType()
      .then(function (result) {
        if (result.data.body.status == "success") {
          handleGetAllTaskType();
          toast({
            type: "success",
            message: result ? result.data.body.message : "Try again !",
          });
        } else {
          toast({
            type: "error",
            message: result ? result.data.body.message : "Error",
          });
        }
      })
      .catch(function (e) {
        toast({
          type: "error",
          message: e.response
            ? e.response.data.body.messagee
            : "Something went wrong, Try again !",
        });
      });
    setOpenDeleteAllModel(false);
  };
  const GroupFilterData = taskTypeDetails?.map((item) => {
    const {
      adminId,
      createdAt,
      createdBy,
      isDefault,
      isOverwrite,
      updatedAt,
      _id,
      ...rest
    } = item;
    return rest;
  });

  let FinalDownloadData = GroupFilterData?.map((data) => {
    return {
      Stages: data?.taskType,
    };
  });

  return (
    <>
      <div className="card p-4 lg:w-1/2 lg:mr-5">
        <div className="md:flex justify-between items-center  mb-4">
          <h3 className="heading-medium font-semibold">Task type</h3>
          <div className="flex items-center">
            <SearchInput
              onChange={(event) => {
                event.preventDefault();
                getSearchDefault("types", event.target.value).then(
                  (response) => {
                    if (response.data.body.status === "success") {
                      setTaskTypeDetails(response.data.body.data.resp);
                    }
                  }
                );
              }}
              placeholder={"Search a task type"}
            />
            <CgPlayListAdd
              className="text-2xl grey-link"
              onClick={() => {
                setAddTaskType(true);
              }}
            />
            <DropDown
              data={download_data}
              defaultValue={""}
              onClick={() => {}}
              icon={
                <span className="text-xl grey-link">
                  <BsThreeDotsVertical />
                </span>
              }
            />
          </div>
        </div>
        {addTaskType && (
          <div className=" border rounded py-1 flex items-center justify-between px-4 mx-4 mb-2 text-base">
            <input
              className="text-lightTextColor outline-none border-none w-full dark:bg-transparent"
              placeholder="Write here"
              onKeyPress={(evt) => {
                var keyCode = evt.which ? evt.which : evt.keyCode;
                // if ((keyCode < 65 || keyCode > 90) && (keyCode < 97 || keyCode > 123) && keyCode != 32) {
                //     evt.preventDefault();
                // }
                // if (evt.target.value.length > 20) {
                //     evt.preventDefault();
                // }
                if (keyCode === 13) {
                  setAddTaskType(false);
                  setAddValue(null);
                  handleCreateTaskType();
                }
                return true;
              }}
              value={addValue}
              onChange={(event) => {
                setAddValue(event.target.value);
              }}
            />
            <div className="flex gap-2 justify-between ">
              <button
                type="button"
                className="small-button items-center xs:w-full py-2 flex h-7"
                disabled={addValue == null}
                onClick={() => {
                  setAddTaskType(false);
                  setAddValue(null);
                  handleCreateTaskType();
                }}
              >
                Save
              </button>
              {"  "}
              <button
                onClick={() => {
                  setAddTaskType(false);
                }}
                className='px-2 cursor-pointer shadow-sm text-sm cancel-button flex items-center h-7 dark:text-black'
              >
                {" "}
                Cancel
                {/* <ImCross />{" "} */}
              </button>
            </div>
          </div>
        )}
        <div className="time-tracking-wrapper">
          {taskTypeDetails && taskTypeDetails.length === 0 && (
            <div className="">No data</div>
          )}
          {taskTypeDetails &&
            taskTypeDetails.map(function (data, key) {
              return (
                <div
                  key={key}
                  className="flex items-center border-b-2 border-veryveryLightGrey py-2.5 pb-2 pt-2 gap-2 justify-between "
                >
                  <div className="w-full">
                    <ContentEditable
                      name={data.taskType}
                      id={data._id}
                      disabled={data.isDefault}
                      className={"w-full"}
                      value={data.taskType}
                    />
                  </div>
                  <div className="flex text-xl   justify-between  ">
                    <button
                      className="disabled:opacity-25 disabled:cursor-not-allowed "
                      onClick={() => {
                        handleClickOpen(data.taskType, key, data._id);
                      }}
                      disabled={data.isDefault}
                    >
                      <BiEditAlt size={20} className=' dark:text-gray-50' />
                    </button>
                    <Popover open={open} onClose={handleClose}>
                      <PopoverContent
                        component="form"
                        sx={{ display: "flex", flexWrap: "wrap" }}
                        style={{ background: "rgba(255, 255, 255, 0.5)" }}
                        className="justify-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-[999] bg-slate-400 bg-opacity-5 shadow-none outline-none focus:outline-none"
                      >
                        <div className="relative my-2  z-50 sm:w-[!20rem]">
                          <div className="border-0 mb-7 sm:mt-8 rounded-2xl shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                            <div className="relative sm:px-3  md:p-6 flex-auto">
                              <div className="relative sm:px-3  md:p-6 flex-auto">
                                <button
                                  className="text-lightGrey hover:text-darkTextColor absolute -right-2 -top-2 rounded-full bg-veryLightGrey  uppercase  text-sm outline-none focus:outline-none p-1 ease-linear transition-all duration-150"
                                  type="button"
                                  onClick={() => {
                                    handleClose();
                                  }}
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
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                </button>
                                <div className="rounded-lg bg-white">
                                  <Typography
                                    variant="h6"
                                    color="blue-gray"
                                    className="mb-6"
                                  >
                                    Make the Changes for {custom} Field
                                  </Typography>

                                  <Input
                                    sx={{ m: 1, minWidth: 120 }}
                                    id={keys}
                                    // placeholder={custom}
                                    defaultValue={custom}
                                    onKeyPress={(evt) => {
                                      var keyCode = evt.which
                                        ? evt.which
                                        : evt.keyCode;

                                      // if ((keyCode < 65 || keyCode > 90) && (keyCode < 97 || keyCode > 123) && keyCode != 32) {
                                      //     evt.preventDefault();
                                      // }
                                      // if (evt.target.value.length > 20) {
                                      //     evt.preventDefault();
                                      // }
                                      return true;
                                    }}
                                    onChange={(event) => {
                                      setcatagoryValues(event.target.value);
                                    }}
                                    variant="outlined"
                                  />
                                  <div className=" flex gap-6 pt-4">
                                    <Button onClick={handleClose}>
                                      Cancel
                                    </Button>
                                    <Button
                                      onClick={() => {
                                        const statusTypeDetail =
                                          taskTypeDetails;
                                        statusTypeDetail[key].taskStatus =
                                          catagoryValues;
                                        setTaskTypeDetails([
                                          ...statusTypeDetail,
                                        ]);
                                        document
                                          .getElementById(id)
                                          .setAttribute(
                                            "currentValue",
                                            catagoryValues
                                          );
                                        handleClose();
                                        handleUpdateTaskType(
                                          id,
                                          capitalizeString(
                                            document
                                              .getElementById(id)
                                              .getAttribute("currentValue")
                                          )
                                        );
                                      }}
                                    >
                                      Ok
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                    <button
                      className="red-link pl-4 disabled:opacity-25 disabled:cursor-not-allowed "
                      disabled={data.isDefault}
                      onClick={() => {
                        setDeleteMessage(
                          "Delete TaskType " + '"' + data.taskType + '"'
                        );
                        setDeleteTaskId(data._id);
                        setOpenDeleteModel(true);
                      }}
                    >
                      <AiOutlineDelete />
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      <DeleteConformation
        open={openDeleteModel}
        close={() => setOpenDeleteModel(false)}
        message={deleteMessage}
        onClick={handleDeleteTaskTypeById}
      />
      <DeleteConformation
        open={openDeleteAllModel}
        close={() => {
          setOpenDeleteAllModel(!openDeleteAllModel);
        }}
        message={"Delete All Custom Task Type"}
        onClick={handleDeleteAllTaskType}
      />
    </>
  );
};
export default taskTypeConfig;
