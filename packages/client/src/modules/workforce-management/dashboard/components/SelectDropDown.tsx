import { Fragment, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { HiCheck, HiChevronDown } from 'react-icons/hi';
import { isBoolean } from 'validate.js';
import { dashboardData } from '@HELPER/exportData';
export default function Index({ data, icon,paddingDash, width, displayLabel, maxWidth, dropdownData ,item}) {
    const [selected, setSelected] = useState(data[0]);
    return (
        <div className={`${width} ${maxWidth}`}>
            <Listbox
                value={selected}
                onChange={event => {
                    setSelected(event);
                    event.onChange(event);
                }}>
                <div className='relative'>
                    <Listbox.Button className={`flex justify-between items-center gap-2 w-full ${paddingDash} cursor-default rounded-xl bg-white px-2 text-left font-semibold border border-veryLightGrey focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm cursor-pointer`}>
                        <span className='truncate flex items-center text-black dark:text-[#fff]'>
                            {icon}
                            {displayLabel ? displayLabel : selected?.name}
                        </span>
                        <span className='pointer-events-none flex items-center'>
                            <HiChevronDown className='h-5 w-5 text-gray-400' aria-hidden='true' />
                        </span>
                    </Listbox.Button>
                    <Transition as={Fragment} leave='transition ease-in duration-100' leaveFrom='opacity-100' leaveTo='opacity-0'>
                        <Listbox.Options className='absolute mt-1 max-h-60 w-fit overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-[48]'>
                            {item
                                ? data.map((value, valueIdx) => (
                                      <Listbox.Option
                                          key={valueIdx}
                                          className={
                                              !Boolean(value.value)
                                                  ? 'w-full relative cursor-default select-none py-2 pl-10 pr-4 text-black'
                                                  : 'w-full relative  select-none py-2 pl-10 pr-4 text-gray-300 pointer-events-none'
                                          }
                                          value={value}>

                                          {dropdownData === 'dropdownData' ? (dashboardData[value.name] ? dashboardData[value.name] : value.name) : value.name}
                                      </Listbox.Option>
                                  ))
                                : data.map((value, valueIdx) => (
                                      <Listbox.Option
                                          key={valueIdx}
                                          className={({ active }) => `relative select-none py-2 pl-10 pr-4 cursor-pointer ${active ? 'bg-veryLightBlue text-blue-900 dark:text-[#fff]' : 'dark:bg-opacity-30 dark:bg-red text-darkGrey'}`}
                                          value={value}>
                                          {({ selected }) => (
                                              <>
                                                  <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                                      {dropdownData === 'dropdownData' ? dashboardData[value.name] : value.name}
                                                  </span>
                                                  {displayLabel && selected ? (
                                                      <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-darkGrey'>
                                                          <HiCheck className='h-5 w-5' aria-hidden='true' />
                                                      </span>
                                                  ) : null}
                                              </>
                                          )}
                                      </Listbox.Option>
                                  ))}
                        </Listbox.Options>
                    </Transition>
                </div>
            </Listbox>
        </div>
    );
}
Index.defaultProps = {
    icon: null,
    width: 'w-52',
    displayLabel: null,
    className: '',
    item: false
};
