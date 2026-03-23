import React, { useState } from 'react'
import { AiOutlinePlus } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
const assignToTextField = ({ toggle, setToggle, data }) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <div onClick={() => setToggle(!toggle)} className="">
        {" "}
        <div className="cursor-pointer custom_select_option">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 absolute right-3 top-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" d="M19 9l-7 7-7-7" />
          </svg>
          <button onClick={() => setToggle(!toggle)}>
            Select a member
          </button>
          {toggle && (
            <>
              <ul className="custom_select_option_list p-2  text-sm">
                <li
                  className="py-2 pl-4 text-lightTextColor font-bold  transition-all hover:text-brandBlue duration-300 "
                  onClick={() => setShowModal(true)}
                >
                  <span className="flex items-center justify-center">
                    <span className="font-bold hover:text-brandBlue duration-300">
                      <AiOutlinePlus />
                    </span>
                    <span className="text-lightTextColor hover:text-brandBlue duration-300 text-base mx-2">
                      Invite member
                    </span>
                  </span>
                </li>
{
data.map(function(d){
  return (
    <li className="py-2 pl-4 hover:bg-veryLightBlue transition-all duration-300 hover:text-brandBlue">
 {d.text}
  </li>
  )
})
}
                {/* <li className="py-2 pl-4 hover:bg-veryLightBlue transition-all duration-300 hover:text-brandBlue">
                            BigBro{" "}
                          </li>
                          <li className="py-2 pl-4 hover:bg-veryLightBlue transition-all duration-300 hover:text-brandBlue">
                            Alexander
                          </li>
                          <li className="py-2 pl-4 hover:bg-veryLightBlue transition-all duration-300 hover:text-brandBlue">
                            Sebastian Levi
                          </li>
                          <li className="py-2 pl-4 hover:bg-veryLightBlue transition-all duration-300 hover:text-brandBlue">
                            Emily{" "}
                          </li> */}
              </ul>
              <div
                className="opacity-25 fixed inset-0 z-10 "
                onClick={() => setToggle(!toggle)}
              ></div>
            </>
          )}
        </div>
      </div>
      <InviteMember {...{showModal, setShowModal}}/>
    </>
  )
}
export default assignToTextField