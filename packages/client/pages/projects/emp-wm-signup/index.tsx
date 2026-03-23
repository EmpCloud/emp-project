import EmpAdminSignup from '@WORKFORCE_MODULES/emp/Components/signup';
import React from 'react';
const index = ({ startLoading, stopLoading }) => {
    return (
        <>
            <EmpAdminSignup {...{ startLoading, stopLoading }} />
        </>
    );
};
export default index;
