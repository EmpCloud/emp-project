import React, { useState, useEffect } from "react";
import { AiOutlineEdit } from "react-icons/ai";
import validate from "validate.js";
import CheckBox from "../CheckBox";
import NewToolTip from "../NewToolTip";
export default function EditTableCol({ handleReset, data, checkVisibility,setType,handleSelectCol,setSelectedProject}) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
            <NewToolTip direction='top' message={"Edit Table"}> <div className='xs:hidden border border-veryLightGrey text-xl px-2 py-1 rounded-lg cursor-pointer'
                onClick={() => setIsOpen(!isOpen)}
            >
                <AiOutlineEdit className='text-defaultTextColor dark:text-[#fff]' /></div></NewToolTip>
            {isOpen && (
                <>
                    <div
                        className="justify-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-[999] outline-none focus:outline-none">
                        <div className="relative my-2 mx-auto w-11/12 md:w-1/2 z-[999]">
                            <div className="border-0 mb-7 sm:mt-8 rounded-2xl shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                <div className="relative sm:px-3  md:p-6 flex-auto">
                                    <button
                                        className="text-lightGrey hover:text-darkTextColor absolute -right-2 -top-2 rounded-full bg-veryLightGrey  uppercase  text-sm outline-none focus:outline-none p-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                    <div className='flex items-center justify-between gap-5 mt-4 px-4 md:px-0'>
                                        <p className="text-xl font-bold text-darkTextColor my-2">
                                            Table Filter
                                        </p>
                                        <button onClick={() => {
                                            handleReset();
                                            setIsOpen(!isOpen);
                                        }} className="text-darkBlue border text-base font-bold px-8 py-1 rounded-full border-darkBlue cursor-pointer">
                                            Reset
                                        </button>
                                    </div>
                                    <div className="text-left px-4 md:px-0">
                                        <p className="text-base text-lightTextColor mt-2 mb-6">
                                            The columns that are selected only those are visible</p>
                                        <div className="rounded-lg bg-white">
                                            <div className='lg:flex flex-container'>
                                                <div className='gap-4 flex flex-wrap items-center justify-between'>
                                                    {
                                                        data && data.map(function (d, key) {
                                                            return (
                                                                <div key={key} className=" w-32">
                                                                    <CheckBox label={d.name} onChange={()=>handleSelectCol(d)} disabled={d.isDisabled} checked={d.isVisible} name={d.value} />
                                                                </div>
                                                            );
                                                        })
                                                    }
                                                </div>
                                            </div>
                                            {/* <div className='flex items-center justify-center gap-5 mt-4'> */}
                                            {/* <button onClick={handleReset} className="text-darkBlue border text-sm font-bold px-8 py-2 rounded-full border-darkBlue cursor-pointer">
                                                Reset
                                            </button> */}
                                            {/* <button onClick={handleApply} type="submit" className="small-button items-center xs:w-full flex sm:text-md text-sm py-2 px-8">
                                                <span className=''>Apply</span>
                                            </button> */}
                                            {/* </div> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="opacity-25 fixed inset-0 z-40 bg-black" onClick={() => setIsOpen(false)}></div>
                    </div>
                </>
            )}
        </>
    );
}
