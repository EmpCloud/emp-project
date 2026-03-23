import EmpAdminLogin from '@WORKFORCE_MODULES/emp/Components/login';
import React from 'react';
const index = ({ startLoading, stopLoading }) => {
    return (
        <>
            <EmpAdminLogin {...{ startLoading, stopLoading }} />
        </>
    );
};
export default index;
