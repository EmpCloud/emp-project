import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import CheckBox from "../CheckBox";
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
const index = ({ data, defaultValue, onClick, icon }) => {
  return (
    <>
      <Menu as="div" className="relative inline-block text-left">
        <Menu.Button className="inline-flex justify-center w-full outline-none ">
          {defaultValue}
          <>{icon}</>
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className=" z-50 origin-top-right absolute right-0 mt-2 w-56 p-4 rounded-lg shadow-lg bg-white focus:outline-none">
            <div className="py-1">
              {data &&
                data.map(function ({ key, name }) {
                  return (
                    <Menu.Item key={key} onClick={()=>{
                    }}>
                      {({ active }) => (
                        <a
                          onClick={(event) => onClick(event, key)}
                          className={classNames(
                            active
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-700",
                            "block rounded-lg cursor-pointer px-4 py-2 text-sm text-defaultTextColor hover:bg-veryLightBlue hover:text-brandBlue"
                          )}
                        >
                          <div className="flex items-center">
                            <input type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                            <label htmlFor="checkbox-item-1" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">{name}</label>
                          </div>
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
}
export default index;