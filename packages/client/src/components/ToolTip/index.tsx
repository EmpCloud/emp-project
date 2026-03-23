import React from 'react';
import PropTypes from 'prop-types';
import router from 'next/router';
import Cookies from 'js-cookie';
import toast from '../../components/Toster/index'
export const ToolTip = ({children,message,className,paddingfortooltip ,userId ,isAdmin}) => {

 
  return (
    <div className={`${className?className:''} relative flex flex-col items-center group`}>
    {children}
    <div className="absolute bottom-0 flex-col items-center hidden mb-6 group-hover:flex tooltip_body">
      <span className={`relative z-40 px-2 !text-sm leading-none text-white whitespace-no-wrap break-words dark:text-gray-50 ${paddingfortooltip} text-center bg-gray-600 shadow-lg rounded-md`}
      >
        <div className='tooltip'>{message}</div></span>
      <div className="w-3 h-3 z-30 -mt-2 rotate-45 bg-gray-600"></div>
    </div>
  </div>
  )
}
ToolTip.propTypes = {
  className: PropTypes.string,
};
export default ToolTip;