import React, { useEffect, useState } from "react";
import propTypes from "prop-types";
import { addDays } from "date-fns";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRangePicker } from "react-date-range";
const FloatingDateTextfield = ({
  label,
  value,
  onChange,
  name,
  error,
  dateRange,
  setDateRange,
  errorMsg,
}) => {
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    dateRange && setShowModal(false);
  }, [dateRange]);
  return (
    <>
      <div
        className={
          error
            ? "floating-label-group floating-error floated"
            : `floating-label-group ${value != "" ? "floated" : ""}`
        }
      >
        <input
          type={"text"}
          onClick={() => setShowModal(true)}
          name={name}
          className={
            error
              ? "rounded-full border border-redColor px-5 py-2.5 mb-6 w-full font-normal text-defaultTextColor outline-none focus:border-redColor transition-all "
              : "rounded-full border border-lightBlue px-5 py-2.5 mb-6 w-full font-normal text-defaultTextColor outline-none focus:border-brandBlue transition-all "
          }
          value={value}
          onChange={onChange}
        />
        <label className="floating-label px-2">{label}</label>
      </div>
      <p className="textfield-error-msg -mt-5">{error ? errorMsg : ""}</p>
      {showModal && (
        <>
          <div className="justify-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative my-2 mx-auto w-11/12 lg:w-7/12 z-50">
              <div className="border-0 mb-7 sm:mt-8 rounded-2xl shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {" "}
                <div className="relative py-5 sm:px-3 p-3 md:px-10 flex-auto">
                  <button
                    className="text-lightGrey hover:text-darkTextColor absolute -right-2 -top-2 rounded-full bg-veryLightGrey  uppercase  text-sm outline-none focus:outline-none p-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
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
                  <div className="date_range_picker">
                    <DateRangePicker
                       data={dateRange}
                       onChange={(item) => setDateRange([item.selection])}
                       showSelectionPreview={true}
                       moveRangeOnFirstSelection={false}
                       months={2}
                       ranges={dateRange}
                       direction="horizontal"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div
              className="opacity-25 fixed inset-0 z-40 bg-black"
              onClick={() => setShowModal(false)}
            ></div>
          </div>
        </>
      )}
    </>
  );
};
FloatingDateTextfield.propTypes = {
  value: propTypes.string,
  onChange: propTypes.func,
};
FloatingDateTextfield.defaultProps = {
  value: "",
  label: "",
  placeholder: "",
  error: false,
  errorMsg: "",
  name: "",
};
export default FloatingDateTextfield;
