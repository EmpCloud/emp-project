import React from 'react'
const index = ({onChange,placeholder,searchIcon,serchClass,value}) => {
  return (
<>
<div className='relative mr-1'>
    <div className="wrapper relative rounded-search flex gap-2 items-center">
        <div className=" text-placeholderGrey">
            <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
        </div>
              <input
              className={`text-base placeholder:text-base outline-none bg-transparent md:w-80 ${serchClass} ${searchIcon==="true"?" ":"py-0"}`}
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
              />
      </div>
  </div>
</>
  )
}
export default index