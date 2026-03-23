import React from "react";
import propTypes from "prop-types";
import { disableFutureDates } from "@HELPER/function";
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
  titleStyle,
  placeholder,
  errorStyles
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
        <input
          disabled={disabled}
          defaultValue={defaultValue}
          formate={formate}
          min={min}
          type={type}
          name={name}
          autoComplete={autoComplete}
          placeholder={placeholder}
          onPaste = {onPaste}
          className={
            error
              ? `rounded-full ${titleStyle} border border-redColor px-3 py-1 text-base bg-gray-100 dark:bg-gray-950 w-full font-normal text-defaultTextColor outline-none focus:border-redColor transition-all`
              : `rounded-full ${titleStyle}  border border-gray-300 px-3 py-1 text-base bg-gray-100 dark:bg-gray-950 w-full font-normal text-defaultTextColor outline-none focus:border-brandBlue transition-all`
          }
          value={value}
          onChange={onChange}
        />
        <label className="floating-label">{label}</label>
      </div>
      {/* -mt-5 */}
      <p className={`${errorStyles} textfield-error-msg `}>{error ? errorMsg : ''}</p>
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
  min: ""
};
export default FloatingTextfield;
