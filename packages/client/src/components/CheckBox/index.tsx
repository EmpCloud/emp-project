import React from 'react'
import propTypes from "prop-types";
const index = ({ label, value, onChange,name, checked,disabled,
 id }) => {
  return (
    <div className="flex items-center mb-4" >
      <input value={value} checked={checked} name={name} type="checkbox" disabled={disabled} onChange={onChange} className="w-3 h-3 text-brandBlue bg-veryveryLightGrey border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
      <label className="ml-2 text-base dark:text-gray-50">{label}</label>
    </div>
  )
}
export default index
index.propTypes = {
  label: propTypes.string,
  type: propTypes.string,
  value: propTypes.bool,
  onChange: propTypes.func,
};
index.defaultProps = {
  value: false,
  name: "",
  label: "",
  id: "",
  disabled:false,
};
