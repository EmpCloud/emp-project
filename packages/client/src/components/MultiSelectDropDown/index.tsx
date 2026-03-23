import React from 'react';
import Multiselect from 'multiselect-react-dropdown';
import propTypes from 'prop-types';
import { selectedValuesMuliSelectorDate, uniqueArrays } from '../../helper/function';
const index = ({ option, name, value, handleChangeMultiSelector, selectedValues, label,disable,styledropdown }) => {
    return (
        <>
            <div className='floating-label-group floated'>
                <Multiselect
                    className={`rounded-3xl border border-gray-300 px-3 text-base w-full font-normal dark:text-black text-defaultTextColor py-1 outline-none focus:border-brandBlue transition-all bg-gray-100 dark:bg-gray-950  ${styledropdown}`}
                    displayValue='key'
                    onKeyPressFn={function noRefCheck() {}}
                    onRemove={e => {
                        handleChangeMultiSelector(e, name, 'remove');
                    }}
                    onSearch={function noRefCheck() {}}
                    onSelect={e => {
                        handleChangeMultiSelector(e, name, 'select');
                    }}
                    selectedValues={selectedValuesMuliSelectorDate(selectedValues)}
                    options={uniqueArrays(selectedValuesMuliSelectorDate(selectedValues), option)}
                    disable = {disable}
                />
                <label className='floating-label text-base'>{label}</label>
            </div>
        </>
    );
};
index.propTypes = {
    value: propTypes.array,
    option: propTypes.array,
    name: propTypes.string,
    disable: propTypes.bool
};
index.defaultProps = {
    option: [],
    value: [],
    selectedValues: [],
    name: '',
    disable: false
};
export default index;
