import React from 'react'
function InputFile() {
  return (
    <div className="file-input">
      <input
        type="file"
        name="file-input"
        id="file-input_attachment"
        className="file-input__input"
      />
      <label className="file-input__label" htmlFor='file-input_attachment'>
        <span className='pl-1 cursor-pointer text-darkTextColor hover:text-lightBlue transition-all duration-300'>New profile photo</span>
      </label>
    </div>
  )
}
export default InputFile
