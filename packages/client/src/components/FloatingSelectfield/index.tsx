import React from 'react';
import propTypes from 'prop-types';
import { platform } from 'os';
import { FcLikePlaceholder } from 'react-icons/fc';
export const FloatingSelectfield = ({ label, value, optionsGroup, onChange, name, error, placeholder, width="w-full",disabled }) => {
    return (
        <div
            className={`floating-label-group floated`}>
            <select
                placeholder={placeholder}
                name={name}
                value={value}
                onChange={onChange}
                // disabled={disabled}
                className={`block ${width} px-3 py-1 appearance-none z-1 bg-gray-100 dark:bg-gray-950 text-base focus:outline-none focus:ring-0 focus:border-black rounded-3xl border border-gray-300`}>
                {!optionsGroup || optionsGroup.length === 0 ? (
                    <option value='' selected={true}>
                        No data
                    </option>
                ) : (
                    <>
                        <option value='' className='dark:bg-gray-950 text-base' selected={true}>Select</option>
                        {optionsGroup.map((option, key) => (
                            <option className='dark:bg-gray-950 text-base w-[4rem] truncate' key={key} value={option.value}>
                                {/* {option.text} */}
                                {option && option.text && (
                                    option.text.length > 28 ? option.text.substring(0, 28) + '...' : option.text
                                 )}
                            </option>
                        ))}
                    </>
                )}
            </select>
            {/* {!optionsGroup || optionsGroup.length === 0 ? null : <label className='absolute duration-300 top-1 -z-1 origin-0 text-base text-defaultTextColor'>{label}</label>} */}
            <svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4 absolute right-3 top-[50%] translate-y-[-50%] pointer-events-none' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
                <path strokeLinecap='round' d='M19 9l-7 7-7-7' />
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
    type: 'text',
    placeholder: '',
    error: true,
    errorMsg: '',
    name: '',
};
