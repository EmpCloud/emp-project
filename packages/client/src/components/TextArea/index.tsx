import React from "react";
import propTypes from "prop-types";
export const TextArea = ({ label, value, onChange, name, error, errorMsg,type,disabled,backgroundColor}) => {
  return (
    <>
      <div
        className={
          error
            ? "floating-label-group floating-error floated"
            : `floating-label-group ${value != "" ? "floated" : ""}`
        }
      >
        <textarea
        rows={2}
        type = {type}
          name={name}
          className={
            error
              ? `border w-full sm:p-3 rounded-xl ${backgroundColor==='darkGray'?'cursor-pointer border border-redColor px-3 py-1 text-base bg-gray-100 dark:bg-gray-950 w-full font-normal text-defaultTextColor outline-none focus:border-redColor transition-all':'dark:bg-gray-950 text-defaultTextColor border-red-500  text-base  focus:none focus:outline-none'}`
              : //work here to change the css if error is true
                `border w-full sm:p-3 rounded-xl ${backgroundColor==='darkGray'?'cursor-pointer  border border-gray-300 px-3 py-1 text-base bg-gray-100 dark:bg-gray-950 w-full font-normal text-defaultTextColor outline-none focus:border-brandBlue transition-all:none focus:outline-none':'dark:bg-gray-950 text-defaultTextColor border-gray-300  text-base  focus:none focus:outline-none focus:border-brandBlue'}`
          }
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
        <label className="floating-label-textfield">{label}</label>
      </div>
      {/* errorMsg show the error message */}
      <p className="textfield-error-msg mt-1 text-left">{error ? errorMsg : ""}</p>
    </>
  );
};
TextArea.propTypes = {
  value: propTypes.string,
  onChange: propTypes.func,
};
TextArea.defaultProps = {
  value: "",
  placeholder: "",
  error: false,
  errorMsg: "",
  name: "",
  type :"text"
};
