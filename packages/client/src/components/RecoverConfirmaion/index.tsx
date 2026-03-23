import React, { useState } from 'react'
import { FcRotateToPortrait } from 'react-icons/fc';
 const RecoverConfirmation = ({open,close,message,onClick}) => {
  return (
    <>
    {
    open && (
        <>
          <div
            className="justify-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-[999] outline-none focus:outline-none"
          >
            <div className="relative my-2 mx-auto w-11/12 lg:w-6/12 z-[999]">
              {/*content*/}
              <div className="border-0 mb-7 sm:mt-8 rounded-2xl shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                {/*body*/}
                <div className="relative py-10 px-10 md:px-32 flex-auto">
                  <button
                    className="text-lightGrey hover:text-darkTextColor absolute -right-2 -top-2 rounded-full bg-veryLightGrey  uppercase  text-sm outline-none focus:outline-none p-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={close}
                    >
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <div className="rounded-lg bg-white">
                    <div className="text-center sm:my-4 my-2">
                      {/* <img src="/imgs/delete.svg" className="w-100 mx-auto" alt="Delete"/> */}
                      <FcRotateToPortrait  className="w-100 mx-auto" size={100}/>
                      <h2 className="font-bold text-darkTextColor text-3xl mt-5">{message}</h2>
                      <div className="flex justify-center mt-12">
                        <button className="nostyle-button mr-4" onClick={close} >Cancel</button>
                        <button type="submit" className="confirm-button px-10" onClick={onClick}>Restore</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black" onClick={close}></div>
          </div>
      </>
    )}
    </>
  )
}
export default RecoverConfirmation;