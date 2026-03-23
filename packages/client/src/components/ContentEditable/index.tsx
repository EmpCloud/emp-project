import React from 'react';
import propTypes from 'prop-types';
const ContentEditable = ({ value, onChange, name, label, className, disabled, id }) => {
    const validation = evt => {
        var keyCode = evt.which ? evt.which : evt.keyCode;

        if ((keyCode < 65 || keyCode > 90) && (keyCode < 97 || keyCode > 123) && keyCode != 32) {
            evt.preventDefault();
        }
        if (evt.target.value.length > 20) {
            evt.preventDefault();
        }
        return true;
    };
    return (
        <>
            <div className={'pl-0 '}>
                <input
                    disabled={disabled}
                    id={id}
                    name={name}
                    className={'text-sm border rounded-md p-3 bg-gray-100/50 outline-brandBlue  ' + className}
                    contentEditable={!disabled}
                    value={value}
                    onChange={onChange}
                    onKeyPress={validation}
                />
                <label className='floating-label px-2'>{label}</label>
            </div>
        </>
    );
};
ContentEditable.propTypes = {
    type: propTypes.string,
    value: propTypes.string,
    disabled: propTypes.bool,
    onChange: propTypes.func,
};
ContentEditable.defaultProps = {
    type: 'text',
    value: '',
    placeholder: '',
    error: false,
    errorMsg: '',
    name: '',
    disabled: false,
    label: '',
    className: 'w-full',
};
export default ContentEditable;
