import React, { useState } from 'react';
const Tooltip = props => {
    let timeout;
    const [active, setActive] = useState(false);
    const showTip = () => {
        timeout = setTimeout(() => {
            setActive(true);
        }, props.delay || 40);
    };
    const hideTip = () => {
        clearInterval(timeout);
        setActive(false);
    };
    return (
        <div
            className='Tooltip-Wrapper font-inter cursor-pointer'
            // When to show the tooltip
            onMouseEnter={showTip}
            onMouseLeave={hideTip}
            // onClick={showTip}
            // onClick={showTip}
        >
            {/* Wrapping */}
            {props.children}
            {active && (
                <div className={`!bg-slate-600 border border-[#646464] before:!border-r-slate-600 text-white Tooltip-Tip small-tooltip ${props.direction || 'top'}`}>
                    {/* Content */}
                    {/* {props.content} */}
                    <div className=''>
                        <div className='flex justify-between items-center'></div>
                        <p className=' text-sm px-2 text-white dark:text-[#fff]'>{props.message}</p>
                    </div>
                </div>
            )}
        </div>
    );
};
export default Tooltip;
