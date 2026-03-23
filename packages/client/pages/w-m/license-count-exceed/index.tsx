import LicenseCountExceed from '@WORKFORCE_MODULES/license-count-exceed/components/all';
import React from 'react';
const index = ({ startLoading, stopLoading }) => {
    return (
        <>
            <LicenseCountExceed {...{ startLoading, stopLoading }} />
        </>
    );
};
export default index;
