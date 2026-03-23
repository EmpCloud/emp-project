import React from 'react';
import propTypes from 'prop-types';
export const FloatingOnlySelectfield = ({ label, value, optionsGroup, onChange, name, error, placeholder, className }) => {
    return (
        <div
            className={`${
                className && className
            } dropdown rounded-full border border-gray-300  w-full font-normal text-defaultTextColor outline-none focus:border-brandBlue transition-all relative z-0 custom-select-dropdown ${
                value != '' ? 'floatingLabel' : ''
            }`}>
            <select
                placeholder={placeholder}
                name={name}
                value={value}
                onChange={onChange}
                className='py-2 block text-base dark:text-gray-50 w-full px-4 pr-8 mt-0 bg-transparent appearance-none z-1 focus:outline-none focus:ring-0 focus:border-black border-gray-200'>
                {optionsGroup && optionsGroup.length > 0 ? (
                    optionsGroup.map((option, key) => (
                        <option className='dark:bg-gray-950 dark:text-[#fff]' key={key} value={option.value}>
                            {option.text.length > 10 ? option.text.substring(0, 10) + '...' : option.text}
                        </option>
                    ))
                ) : (
                    <option className='dark:bg-gray-950 dark:text-[#fff] ' value="" disabled>
                        No options available
                    </option>
                )}
            </select>
            <label className='absolute duration-300 top-3 -z-1 origin-0 text-defaultTextColor'>{label}</label>
            <svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4 absolute right-3 top-[8px] pointer-events-none' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
                <path strokeLinecap='round' d='M19 9l-7 7-7-7' />
            </svg>
        </div>
    );
};
FloatingOnlySelectfield.propTypes = {
    type: propTypes.string,
    value: propTypes.string,
    onChange: propTypes.func,
};
FloatingOnlySelectfield.defaultProps = {
    type: 'text',
    value: '',
    placeholder: '',
    error: true,
    errorMsg: '',
    name: '',
    className: '',
};
