import React from "react";
import { BiCalendar, BiInfoCircle, BiSearch } from "react-icons/bi";
import { MdEmail, MdMessage } from "react-icons/md";
import Modal from "react-modal";

const AutoEmailReportModal = ({modalIsOpen, closeModal}) => {
  

  return (
    <Modal
      isOpen={modalIsOpen}
      className="relative flex justify-center items-center h-screen modal-bg text-[#133D6A] font-inter"
    >
      <div className="bg-white px-8 py-6 overflow-auto max-h-[calc(100dvh-100px)] grid grid-cols-12 grid-flow-row gap-5 rounded-xl max-w-sm md:max-w-4xl">
        <div className="heading-big relative font-bold mb-0 heading-big text-darkTextColor px-2 py-1 col-span-12">
          Auto Email Report
        </div>
        <div className="bg-[#93C5FD] p-2 rounded-md col-span-12">
          <span className="font-bold">Information : </span>Email reports will be
          sent out at midnight in the timezone of the user that sets up the
          report.
        </div>
        <div className="flex flex-col justify-center items-start gap-3 col-span-12">
          <div className="flex justify-start items-center gap-3">
            <label>Frequency</label>
            <BiInfoCircle className="cursor-pointer" />
          </div>
          <input
            className="text-base placeholder:text-base border rounded-full border-[#BABABA] px-5 py-2 w-full"
            type="text"
            placeholder="Enter Title"
          />
        </div>
        <div className="flex flex-col justify-center items-start gap-3 col-span-12">
          <label>Report Title</label>
          <div className="flex flex-wrap justify-around items-center gap-3 w-full">
            <label className="flex justify-start items-center gap-1 cursor-pointer">
              <input
                type="radio"
                name="reportTitle"
                className="accent-[#133D6A]"
              />
              <span>Daily</span>
            </label>
            <label className="flex justify-start items-center gap-1 cursor-pointer">
              <input
                type="radio"
                name="reportTitle"
                className="accent-[#133D6A]"
              />
              <span>Weekly</span>
            </label>
            <label className="flex justify-start items-center gap-1 cursor-pointer">
              <input
                type="radio"
                name="reportTitle"
                className="accent-[#133D6A]"
              />
              <span>Monthly</span>
            </label>
            <label className="flex justify-start items-center gap-1 cursor-pointer">
              <input
                type="radio"
                name="reportTitle"
                className="accent-[#133D6A]"
              />
              <span>Progress</span>
            </label>
            <div className="flex justify-start items-center gap-1 bg-[#133D6A] text-white px-3 py-1 rounded-full cursor-pointer">
              <BiCalendar size={20} />
              <span>Time</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center items-start gap-3 col-span-12">
          <div className="flex justify-start items-center gap-3">
            <label>Recipients</label>
            <span className="text-sm">
              Seperate the email ids using comma !
            </span>
            <BiInfoCircle className="cursor-pointer" />
          </div>
          <input
            className="text-base placeholder:text-base border rounded-full border-[#BABABA] px-5 py-2 w-full"
            type="text"
            placeholder="Enter Email"
          />
          <label className="flex justify-start items-center gap-3 cursor-pointer">
            <input type="checkbox" className="!accent-[#133D6A]" />
            <span>I want to receive email reports</span>
          </label>
        </div>
        <div className="flex flex-col justify-center items-start gap-3 col-span-12">
          <div className="flex justify-start items-center gap-3">
            <label>Content</label>
            <BiInfoCircle className="cursor-pointer" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 justify-center items-center gap-3 w-full">
            <label className="flex justify-start items-center gap-3 border rounded-full border-[#BABABA] px-5 py-1 col-span-1 cursor-pointer">
              <input
                className="!accent-[#133D6A]"
                type="checkbox"
                placeholder="Enter Title"
              />
              <span>Projects</span>
            </label>
            <label className="flex justify-start items-center gap-3 border rounded-full border-[#BABABA] px-5 py-1 col-span-1 cursor-pointer">
              <input
                className="!accent-[#133D6A]"
                type="checkbox"
                placeholder="Enter Title"
              />
              <span>Tasks</span>
            </label>
            <label className="flex justify-start items-center gap-3 border rounded-full border-[#BABABA] px-5 py-1 col-span-1 cursor-pointer">
              <input
                className="!accent-[#133D6A]"
                type="checkbox"
                placeholder="Enter Title"
              />
              <span>Subtasks</span>
            </label>
            <label className="flex justify-start items-center gap-3 border rounded-full border-[#BABABA] px-5 py-1 col-span-1 cursor-pointer">
              <input
                className="!accent-[#133D6A]"
                type="checkbox"
                placeholder="Enter Title"
              />
              <span>Groups</span>
            </label>
            <label className="flex justify-start items-center gap-3 border rounded-full border-[#BABABA] px-5 py-1 col-span-1 cursor-pointer opacity-70">
              <input className="!accent-[#133D6A]" type="checkbox" disabled />
              <span>Roles</span>
            </label>
            <label className="flex justify-start items-center gap-3 border rounded-full border-[#BABABA] px-5 py-1 col-span-1 cursor-pointer opacity-70">
              <input className="!accent-[#133D6A]" type="checkbox" disabled />
              <span>Progress</span>
            </label>
          </div>
        </div>
        <div className="flex flex-col justify-center items-start gap-3 col-span-12">
          <div className="flex justify-start items-center gap-3">
            <label>Reports</label>
            <BiInfoCircle className="cursor-pointer" />
          </div>
          <div className="grid grid-cols-2 justify-center items-center gap-3 w-full">
            <label className="flex justify-start items-center gap-3 border rounded-full border-[#BABABA] px-5 py-1 col-span-1 cursor-pointer">
              <input className="!accent-[#133D6A]" type="checkbox" />
              <span>PDF</span>
            </label>
            <label className="flex justify-start items-center gap-3 border rounded-full border-[#BABABA] px-5 py-1 col-span-1 cursor-pointer">
              <input className="!accent-[#133D6A]" type="checkbox" />
              <span>CSV</span>
            </label>
          </div>
        </div>
        <div className="flex flex-col justify-center items-start gap-3 col-span-12">
          <div className="flex justify-start items-center gap-3">
            <label>Filter</label>
            <BiInfoCircle className="cursor-pointer" />
          </div>
          <div className="flex flex-col justify-start items-start gap-3 w-full">
            <label className="flex justify-start items-center gap-1 cursor-pointer">
              <input type="radio" name="filter" className="accent-[#133D6A]" />
              <span>Whole Organizations</span>
            </label>
            <label className="flex justify-start items-center gap-1 cursor-pointer">
              <input type="radio" name="filter" className="accent-[#133D6A]" />
              <span>Specific Employee</span>
            </label>
          </div>
        </div>
        <div className="flex flex-col justify-center items-start gap-3 bg-[#EEF6FF] px-5 py-2 rounded-lg col-span-12">
          <label>Employee</label>
          <div className="relative w-full">
            <input
              type="text"
              name="search"
              placeholder="Search"
              className="text-base placeholder:text-base rounded-full px-8 py-2 w-full"
            />
            <BiSearch
              className="absolute left-2 top-1/2 -translate-y-1/2"
              color="#9CA3AF"
              size={20}
            />
          </div>
          <div className="flex flex-col justify-start items-start gap-3 w-full">
            <label className="flex justify-start items-center gap-1 cursor-pointer">
              <input type="checkbox" className="!accent-[#133D6A]" />
              <span>Select All</span>
            </label>
            <div className="flex flex-col gap-2 justify-start items-start">
              <label className="flex justify-start items-center gap-1 cursor-pointer">
                <input type="checkbox" className="!accent-[#133D6A]" />
                <span>Harish</span>
              </label>
              <label className="flex justify-start items-center gap-1 cursor-pointer">
                <input type="checkbox" className="!accent-[#133D6A]" />
                <span>Harish</span>
              </label>
              <label className="flex justify-start items-center gap-1 cursor-pointer">
                <input type="checkbox" className="!accent-[#133D6A]" />
                <span>Harish</span>
              </label>
              <label className="flex justify-start items-center gap-1 cursor-pointer">
                <input type="checkbox" className="!accent-[#133D6A]" />
                <span>Harish</span>
              </label>
            </div>
          </div>
        </div>
        <button className="bg-[#133D6A] text-white rounded-full p-2 col-span-12 md:col-span-3 flex justify-center items-center gap-3">
          <MdEmail size={20} /> Send Test Mail
        </button>
        <div class="col-span-12 gap-3 flex justify-end items-center">
          <button className="text-[#5D5D5D] px-5" onClick={closeModal}>Cancel</button>
          <button className="bg-gradient-to-r from-[#3E9CED] to-[#6865FA] text-white rounded-full py-2 px-5">
            Create New Report
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AutoEmailReportModal;
