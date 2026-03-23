import React from "react";
import propTypes from "prop-types";
import { disableFutureDates } from "@HELPER/function";
import { Tooltip } from "@material-tailwind/react";
import { BiEnvelope } from "react-icons/bi";
const FloatingTextfield = ({
  type,
  value,
  onChange,
  name,
  error,
  errorMsg,
  disabled,
  label,
  formate,
  min,
  autoComplete,
  onPaste,
  defaultValue,
  placeholder,
}) => {
  return (
    <>
      <div
        className={
          error
            ? "floating-label-group floating-error floated"
            : `floating-label-group ${value != "" ? "floated" : ""}`
        }
      >
        <Tooltip  content={error ? errorMsg : "" } className={`${error === false || "" ? "bg-white opacity-0 hidden":"bg-red-500 bg-opacity-80 text-red-200"} `} placement="top-start">
        <input
          disabled={disabled}
          formate={formate}
          defaultValue={defaultValue}
          min={min}
          type={type}
          name={name}
          autoComplete="on"
          onPaste={onPaste}
          className={
            error
            ? " border text-base placeholder:text-base rounded  border-white bg-[#e8f0fe] dark:bg-gray-950 dark:text-gray-50  autofill:bg-none  border-redColor px-3 pr-10 py-2 w-full font-normal placeholder:text-defaultTextColor text-black mr-4 outline-none focus:border-redColor transition-all"
            : " border text-base placeholder:text-base rounded mr-4  border-gray-300 bg-[#e8f0fe] dark:bg-gray-950 dark:text-gray-50  autofill:bg-none py-2 px-3 pr-10 w-full font-normal placeholder:text-defaultTextColor text-black outline-none focus:border-white transition-all"
          }
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          />
          </Tooltip>
        {/* <label className="floating-label-custom text-white placeholder:text-xl placeholder:text-white">
          {label}
        </label> */}
      </div>
      {/* -mt-5 */}
      {/* <Tooltip content={error ? errorMsg : ""} placement="top"> */}
      {/* <p className="textfield-error-msg text-left !text-red-500 text-base">
        {error ? errorMsg : ""}
      </p> */}
        {/* </Tooltip> */}
    </>
  );
};
FloatingTextfield.propTypes = {
  type: propTypes.string,
  value: propTypes.string,
  disabled: propTypes.bool,
  onChange: propTypes.func,
};
FloatingTextfield.defaultProps = {
  type: "text",
  value: "",
  placeholder: "",
  error: false,
  errorMsg: "",
  name: "",
  disabled: false,
  label: "",
  formate: "",
  min: "",
};
export default FloatingTextfield;
