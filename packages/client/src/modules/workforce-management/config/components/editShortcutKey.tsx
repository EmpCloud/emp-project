import React, { useEffect, useState } from "react";
import { AiOutlineEdit } from "@react-icons/all-files/ai/AiOutlineEdit";
import { TextArea } from "../../../../components/TextArea";
import _ from 'lodash';
import { updateShortcuts } from "../api/put";
import toast from "../../../../components/Toster/index";
import { getAllShortcutKeys } from "../api/get";
const editShortcutKey = ({
  type,
  data,
  stopLoading,
  startLoading,
  shortcutType,
  handleGetAllShortcutkeys,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [keyBindingValue, setKeyBindingValue] = useState(data.keystroke);
  const handleCloseModel = () => {
    setShowModal(false);
  };
  const handleChange = (event) => {
    event.persist();
    let key = event.target.value;
    let arrayKeyBinding = keyBindingValue.split("+");
    if (event.keyCode === 8) {
      if (arrayKeyBinding.length === 3)
        setKeyBindingValue(arrayKeyBinding[0] + "+ " + arrayKeyBinding[1] + "+ ");
      else
        setKeyBindingValue(arrayKeyBinding[0] + "+ ");
      return false;
    }
    if (shortcutType === "global") {
      if (keyBindingValue.length > 7)
        return false;
    } else if (shortcutType === "page") {
      if (keyBindingValue.length > 16)
        return false;
    } else if(shortcutType === "subPage"){
      if (keyBindingValue.length > 15)
        return false;
    }
    setKeyBindingValue(keyBindingValue + event.key);

  };
  useEffect(() => {
}, [keyBindingValue]);
  const handleCreateOrEditProject = (event) => {
    event.persist();
    startLoading();
    updateShortcuts(data._id, keyBindingValue)
      .then(function (result) {
        if (result.data.body.status == "success") {
          toast({
            type: "success",
            message: result ? result.data.body.message : "Try again !",
          });
          handleGetAllShortcutkeys();
          handleCloseModel();
        } else {
          toast({
            type: "error",
            message: result ? result.data.body.message : "Error",
          });
        }
        stopLoading();
      })
      .catch(function (e) {
        stopLoading();
        handleCloseModel();
        toast({
          type: "error",
          message: e.response
            ? e.response.data.body.message
            : "Something went wrong, Try again !",
        });
      });
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
        <td
          id="keyBinding"
          className=""
          onDoubleClick={() => {
            setShowModal(true);
            setKeyBindingValue(data.keystroke);
          }}
        >
          {data.keystroke}
        </td>
      )}
      {showModal && (
        <>
          <div className="justify-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative mx-auto w_40 z-50 m-auto">
              {/*content*/}
              <div className="border-0 px-8  py-8 mb-7 sm:mt-8 rounded-2xl shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                {/*body*/}
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
                <input className="p-5 border border-indigo-600 rounded-md"
                  maxLength={1}
                  type="text"
                  name="keystroke"
                  value={keyBindingValue}
                  onKeyDown={(event) => { handleChange(event) }}
                // onKeyPress = {
                // onInput= {maxLengthCheck}
                />
                {/* body */}
                <div className="float-right sm:mt-8 my-2">
                  <div className="flex items-center sm:gap-5 gap-4 float-right">
                    <div
                      onClick={handleCloseModel}
                      className="hover:text-darkBlue cursor-pointer text-lightTextColor"
                    >
                      Cancel
                    </div>
                    {/* <button className="small-button-2 hover:border sm:px-8 px-2 py-1">
                              Save
                            </button> */}
                    <button
                      type="button"
                      className="small-button items-center xs:w-full flex sm:text-md text-sm"
                      onClick={handleCreateOrEditProject}
                    >
                      Save
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
export default editShortcutKey;
