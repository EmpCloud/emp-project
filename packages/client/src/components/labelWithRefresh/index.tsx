import React from 'react';
import { FiRefreshCcw } from 'react-icons/fi';

const index = ({ label, onClick }) => {
    return (
        <div className='flex justify-between flex-row'>
            <label className='text-sm py-2 text-darkTextColor' htmlFor=''>
                {label}
            </label>

            <FiRefreshCcw className='cursor-pointer  h-5 w-5 mr-3 ' onClick={onClick} />
        </div>
    );
};

export default index;
