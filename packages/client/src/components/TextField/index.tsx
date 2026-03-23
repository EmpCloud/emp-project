import React from "react";
import propTypes from "prop-types";
const Textfield = ({
  type,
  value,
  onChange,
  name,
  error,
  errorMsg,
  disabled,
  label
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
          type={type}
          name={name}
          autoComplete="off" 
          className={
            error
              ? "rounded-full border border-redColor px-5 py-2 mb-4 w-full font-normal text-defaultTextColor outline-none focus:border-redColor transition-all"
              : "rounded-full border border-lightBlue px-5 py-2 mb-4 w-full font-normal text-defaultTextColor outline-none focus:border-brandBlue transition-all"
          }
          value={value}
          onChange={onChange}
        />
        <label className="floating-label px-2">{label}</label>
      </div>
      {/* -mt-5 */}
      <p className="textfield-error-msg -mt-5">{error ? errorMsg : ""}</p>
    </>
  );
};
Textfield.propTypes = {
  type: propTypes.string,
  value: propTypes.string,
  disabled: propTypes.bool,
  onChange: propTypes.func,
};
Textfield.defaultProps = {
  type: "text",
  value: "",
  placeholder: "",
  error: false,
  errorMsg: "",
  name: "",
  disabled: false,
  label:""
};
export default Textfield;
