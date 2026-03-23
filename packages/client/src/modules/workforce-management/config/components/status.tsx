import React, { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { BiEditAlt } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { CgPlayListAdd } from "react-icons/cg";
import { ImCross } from "react-icons/im";
import ContentEditable from "../../../../components/ContentEditable";
import DeleteConformation from "../../../../components/DeleteConformation";
import DropDown from "../../../../components/DropDown";
import SearchInput from "../../../../components/SearchInput";
import { capitalizeString, openUpgradePlan } from "../../../../helper/function";
import { createStatus } from "../api/post";
import toast from "../../../../components/Toster/index";
import { getAllStatus, getSearchDefault } from "../api/get";
import { deleteAllStatus, deleteStatusById } from "../api/delete";
import { downloadFiles } from "../../../../helper/download";
import { updateTaskStatus } from "../api/put";
import {
  Popover,
  PopoverHandler,
  PopoverContent,
  Button,
  Input,
  Typography,
} from "@material-tailwind/react";

const Status = ({ startLoading, stopLoading }) => {
  const [open, setOpen] = React.useState(false);
  const [custom, setCustomData] = React.useState("");
  const [id, setId] = useState();
  const [keys, setKeys] = useState();
  const [catagoryValues, setcatagoryValues] = useState(""); // State to store the manually entered option

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

  const download_data = [
    {
      text: "Download CSV file",
      value: "excel",
      onClick: () => {
        if (statusDetails.length === 0) {
          toast({
            type: "error",
            message: "Please add data before downloading.",
          });
        } else {
          downloadFiles("excel", "Status", FinalDownloadData);
        }
      },
    },
    {
      text: "Download PDF file",
      value: "pdf",
      onClick: () => {
        if (statusDetails.length === 0) {
          toast({
            type: "error",
            message: "Please add data before downloading.",
          });
        } else {
          downloadFiles("pdf", "Status", FinalDownloadData);
        }
      },
    },
    {
      text: "Delete all",
      value: 2,
      onClick: (event, value, data, name) => {
        if (statusDetails.length === 0) {
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
  const [statusDetails, setStatusDetails] = useState(null);
  const [addStatus, setAddStatus] = useState(false);
  const [addValue, setAddValue] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [deleteStatusId, setDeleteStatusId] = useState("");
  const [openDeleteModel, setOpenDeleteModel] = useState(false);
  const handleDeleteAllStatus = () => {
    deleteAllStatus()
      .then(function (result) {
        if (result.data.body.status == "success") {
          handleGetAllStatus();
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
    setOpenDeleteAllModel(false);
  };
  const handleDeleteStatusById = () => {
    deleteStatusById(deleteStatusId)
      .then(function (result) {
        if (result.data.body.status == "success") {
          handleGetAllStatus();
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
          message: e
            ? e.response.data.body.message
            : "Something went wrong, Try again !",
        });
      });
    setOpenDeleteModel(false);
  };
  const [openDeleteAllModel, setOpenDeleteAllModel] = useState(false);
  const handleGetAllStatus = () => {
    getAllStatus().then((response) => {
      if (response.data.body.status === "success") {
        setStatusDetails(response.data.body.data.data);
      }
    });
  };
  const handleCreateStatus = () => {
    createStatus(capitalizeString(addValue))
      .then((response) => {
        if (response.data.body.status === "success") {
          toast({ type: "success", message: response.data.body.message });
          handleGetAllStatus();
        }
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
  useEffect(() => {
    handleGetAllStatus();
  }, []);

  const handleUpdateTaskStatus = (id, data) => {
    if (!data) {
      toast({
        type: "info",
        message: "No change in value!",
      });
      return;
    }

    updateTaskStatus(id, data)
      .then((response) => {
        startLoading();
        if (response.data.body.status === "success") {
          toast({
            type: "success",
            message: response ? response.data.body.message : "Try again !",
          });
          handleGetAllStatus();
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
  const GroupFilterData = statusDetails?.map((item) => {
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
      Status: data?.taskStatus,
    };
  });

  return (
    <>
      <div className="card p-4 lg:w-1/2 mt-5 xs:mt-5 md:mt-5 lg:mt-0">
        <div className="md:flex justify-between items-center  mb-4">
          <h3 className="heading-medium dark:text-darkTitleColor font-semibold">Status</h3>
          <div className="flex items-center">
            <SearchInput
              onChange={(event) => {
                event.preventDefault();
                getSearchDefault("status", event.target.value).then(
                  (response) => {
                    if (response.data.body.status === "success") {
                      setStatusDetails(response.data.body.data.resp);
                    }
                  }
                );
              }}
              placeholder={"Search a status"}
            />
            <CgPlayListAdd
              className="text-2xl grey-link"
              onClick={() => {
                setAddStatus(true);
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
        {addStatus && (
          <div className="py-1 text-base border rounded flex items-center justify-between px-4 mx-4 mb-2">
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
                  setAddStatus(false);
                  setAddValue(null);
                  handleCreateStatus();
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
                  setAddStatus(false);
                  setAddValue(null);
                  handleCreateStatus();
                }}
              >
                Save
              </button>
              {"  "}
              <button
                onClick={() => {
                  setAddStatus(false);
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
          {statusDetails && statusDetails.length === 0 && (
            <div className="">No data</div>
          )}
          {statusDetails &&
            statusDetails.map(function (data, key) {
              return (
                <div
                  key={key}
                  className="flex items-center border-b-2 border-veryveryLightGrey py-2.5 pb-2 pt-2 gap-2 justify-between "
                >
                  <div className="w-full">
                    <ContentEditable
                    
                      id={data._id}
                      disabled={true}
                      name={data.taskStatus}
                      value={data.taskStatus}
                      className={"w-full"}
                      onChange={(event) => {}}
                    />
                  </div>
                  <div className="flex text-xl   justify-between ">
                    <button
                      className="disabled:opacity-25 disabled:cursor-not-allowed"
                      disabled={data.isDefault}
                      onClick={() => {
                        handleClickOpen(data.taskStatus, key, data._id);
                      }}
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

                                  {/* Adding a text field to manually enter a custom option */}
                                  <Input
                                    sx={{ m: 1, minWidth: 120 }}
                                    id={keys}
                                    // placeholder={custom}
                                    defaultValue={custom}
                                    // value={data.taskStatus}
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
                                        const statusTypeDetail = statusDetails;
                                        statusTypeDetail[key].taskStatus =
                                          catagoryValues;
                                        setStatusDetails([...statusTypeDetail]);
                                        document
                                          .getElementById(id)
                                          .setAttribute(
                                            "currentValue",
                                            catagoryValues
                                          );
                                        handleClose();
                                        handleUpdateTaskStatus(
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
                      className="red-link pl-4 disabled:opacity-25 disabled:cursor-not-allowed"
                      disabled={data.isDefault}
                      onClick={() => {
                        setDeleteMessage(
                          "Delete Status " + '"' + data.taskStatus + '"'
                        );
                        setDeleteStatusId(data._id);
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
        onClick={handleDeleteStatusById}
      />
      <DeleteConformation
        open={openDeleteAllModel}
        close={() => {
          setOpenDeleteAllModel(!openDeleteAllModel);
        }}
        message={"Delete All Custom Status"}
        onClick={handleDeleteAllStatus}
      />
    </>
  );
};
export default Status;
