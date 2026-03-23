import { Fragment, useEffect, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { HiCheck, HiChevronDown } from 'react-icons/hi';
export default function index({ handle, onChangeValue, onClick, paddingForDropdown, data, width, icon, roundedSelect, value, type, id, selectedData, className,heightSet="max-h-60" }) {
  const [selected, setSelected] = useState(null);
  const [roundedSelectBox, setRoundedSelectBox] = useState(false);
  useEffect(() => {
    setRoundedSelectBox(roundedSelect);
  }, [roundedSelect]);
  if (data?.length > 0) {
    return (
      <div className={width}>
        <Listbox

          value={selected}
          onChange={e => {
            setSelected(e.value);
            onChangeValue(e, id, selectedData, type);
          }}>
          <div className={className}>
            <Listbox.Button
              onClick={onClick}
              className={`relative w-[123px] ${paddingForDropdown} font-semibold bg-white pr-7 text-left dark:text-[#fff] focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 cursor-pointer ${roundedSelectBox ? 'rounded-full text-defaultTextColor border border-lightBlue sm:text-md pl-5' : 'pl-3 rounded-xl sm:text-sm border border-veryLightGrey'
                }`}>
              <span className='truncate flex items-center'>
                {icon}
                {value ? value : selected}
              </span>
              <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
                <HiChevronDown className='h-5 w-5 text-gray-400' aria-hidden='true' />
              </span>

              <Transition as={Fragment} leave='transition ease-in duration-100' leaveFrom='opacity-100' leaveTo='opacity-0'>
                <Listbox.Options className={`z-10 absolute top-9 left-0 max-w-[180px] w-full ${heightSet} overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm`}>
                  {data.map((value, valueIdx) => (
                    <Listbox.Option key={valueIdx} className={({ active }) => `relative cursor-default select-none py-1 px-2 cursor-pointer hover:bg-veryLightBlue hover:text-brandBlue`} value={value}>
                      {({ selected }) => (
                        <>
                          <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{value.name}</span>
                          {selected ? (
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
            </Listbox.Button>
          </div>
        </Listbox>
      </div>
    );
  }
}
index.defaultProps = {
  width: 'w-full',
  icon: '',
  roundedSelect: '',
  id: null,
  onChange: () => { },
};
