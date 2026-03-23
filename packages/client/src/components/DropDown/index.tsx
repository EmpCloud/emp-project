import PropTypes from 'prop-types';
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}
const index = ({ data, defaultValue, icon, downloadData, name, getData, className, editedClass = '' }) => {
   
    return (
        <>
            <Menu as='div' className={`${className ? className : ''} relative inline-block text-left`}>
                <Menu.Button className='inline-flex justify-center mt-1 w-full outline-none '>
                    {defaultValue}
                    <>{icon}</>
                </Menu.Button>
                <Transition
                    as={Fragment}
                    enter='transition ease-out duration-100'
                    enterFrom='transform opacity-0 scale-95'
                    enterTo='transform opacity-100 scale-100'
                    leave='transition ease-in duration-75'
                    leaveFrom='transform opacity-100 scale-100'
                    leaveTo='transform opacity-0 scale-95'>
                    <Menu.Items className={editedClass ? editedClass : ' z-50 origin-top-right absolute right-0 w-36 py-1 px-2 rounded-lg shadow-lg bg-white focus:outline-none'}>
                        <div className='py-1'>
                            {data &&
                                data.map(function ({ value, text, onClick }) {
                                    return (
                                        <Menu.Item key={value}>
                                            {({ active }) => (
                                                <a
                                                    onClick={event => onClick(event, value, downloadData, name, getData)}
                                                    className={classNames(
                                                        active ? ' text-gray-900':'text-gray-700',
                                                        'block rounded-lg cursor-pointer px-4 py-2 text-sm dark:text-gray-400 text-defaultTextColor hover:bg-veryLightBlue hover:text-brandBlue dark:hover:text-[#fff]'
                                                    )}>
                                                    {text}
                                                </a>
                                            )}
                                        </Menu.Item>
                                    );
                                })}
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>
        </>
    );
};
export default index;
index.defaultProps = {
    defaultValue: '',
    name: 'file',
    downloadData: [],
};
index.propTypes = {
    className: PropTypes.string,
};
