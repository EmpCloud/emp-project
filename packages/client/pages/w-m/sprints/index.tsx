import React from 'react';
import SprintBoard from '@WORKFORCE_MODULES/sprint/components/SprintBoard';

export const index = ({ startLoading, stopLoading }) => {
    return (
        <>
            <SprintBoard {...{ startLoading, stopLoading }} />
        </>
    );
};

export default index;
