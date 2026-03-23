import { Fragment, useEffect, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { HiCheck, HiChevronDown, } from 'react-icons/hi'
export default function index({data, width, icon, roundedSelect}) {
  const [selected, setSelected] = useState(data[0])
  const [roundedSelectBox, setRoundedSelectBox] = useState(false)
  useEffect(() => {
    setRoundedSelectBox(roundedSelect)
  }, [roundedSelect])
  return (
      <div className={width}>
        <Listbox value={selected} onChange={setSelected}>
          <div className="relative">
            <Listbox.Button className={`relative w-full cursor-default bg-white py-2.5 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 ${
              roundedSelectBox ? "rounded-full text-defaultTextColor border border-lightBlue sm:text-md pl-5" : "pl-3 rounded-xl sm:text-sm border border-veryLightGrey"
            }`}>
              <span className="truncate flex items-center">{icon}{selected.name}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <HiChevronDown
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="z-10 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {data.map((value, valueIdx) => (
                  <Listbox.Option
                    key={valueIdx}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? 'bg-veryLightBlue text-amber-900' : 'text-darkGrey'
                      }`
                    }
                    value={value}
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? 'font-medium' : 'font-normal'
                          }`}
                        >
                          {value.name}
                        </span>
                        {selected ? (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-darkGrey">
                            <HiCheck className="h-5 w-5" aria-hidden="true" />
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
  )
}
index.defaultProps = {
  roundedSelect: "",
};
