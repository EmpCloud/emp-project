import React from "react";
import propTypes from "prop-types";
import { platform } from "os";
import { FcLikePlaceholder } from "react-icons/fc";
export const FloatingSelectfield = ({
  label,
  value,
  optionsGroup,
  onChange,
  name,
  error,
  placeholder,
}) => {
  return (
    <div
      className={`dropdown rounded border border-gray-300 px-5 w-full font-normal bg-[#e8f0fe] dark:bg-gray-900 lg:text-defaultTextColor text-defaultTextColor outline-none focus:border-[#a6e2ff] transition-all mb-1 relative z-0 custom-select-dropdown ${
        value !== "" ? "floatingLabel" : ""
      }`}
    >
      <select
        title={label}
        name={name}
        value={value}
        onChange={onChange}
        className="py-3 block w-full px-0 text-base placeholder:text-defaultTextColor placeholder:text-base mt-0 bg-[#e8f0fe] dark:bg-gray-900  text-black appearance-none z-1 focus:px-1 focus:outline-none focus:ring-0 focus:border-black border-gray-200"
      > <option className="text-defaultTextColor text-base" value="" disabled selected>{placeholder}</option>
        {!optionsGroup || optionsGroup.length === 0 ? (
          
          <option value="" selected={true} className="text-defaultTextColor">
            No data
          </option>
        ) : (
          <>
            {/* <option value="" selected={true} /> */}
            {optionsGroup.map((option, key) => (
              <option key={key} value={option.value} className="text-base placeholder:text-base placeholder:text-darkTextColor text-darkTextColor">
                {option.text}
              </option>
            ))}
          </>
        )}
      </select>
      {/* {!optionsGroup || optionsGroup.length === 0 ? null : (
        <label className="absolute text-base placeholder:text-base duration-300 top-3 z-1 text-center left-4 origin-0 text-darkTextColor">
          {label}
        </label>
      )} */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 absolute right-3 top-3 pointer-events-none"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path strokeLinecap="round" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
};
FloatingSelectfield.propTypes = {
  type: propTypes.string,
  value: propTypes.string,
  onChange: propTypes.func,
};
FloatingSelectfield.defaultProps = {
  type: "text",
  value: "",
  placeholder: "",
  error: true,
  errorMsg: "",
  name: "",
  placeholder: "",
};
