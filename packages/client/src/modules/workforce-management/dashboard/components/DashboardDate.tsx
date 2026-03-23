import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { HiCheck, HiChevronDown } from "react-icons/hi";
import { FiDownload } from "@react-icons/all-files/fi/FiDownload";
export default function Index({ data, width, icon }) {
  const [selected, setSelected] = useState(data[0]);
  return (
    <div className={width}>
      <Listbox value={selected} onChange={setSelected}>
        <div className="relative z-50">
          <Listbox.Button className="relative w-full cursor-default rounded-xl bg-white py-2 pl-3 pr-10 text-left border border-veryLightGrey focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
            <span className="truncate flex items-center">
              {icon}
              {selected.name}
            </span>
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
            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {data.map((value, valueIdx) => (
                <Listbox.Option
                  key={valueIdx}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active
                        ? "bg-veryLightBlue text-amber-900"
                        : "text-darkGrey"
                    }`
                  }
                  value={value}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
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
  );
}
Index.defaultProps = {
  // icon: <FiDownload className="h-5 w-5 mr-1" />,
  icon: null,
  width : "w-52"
};
