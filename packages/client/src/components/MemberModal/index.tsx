import React, { useState } from 'react';
import { BiSearch } from 'react-icons/bi';
import { RiCloseLine } from 'react-icons/ri';
import router from 'next/router';
import { FaEye } from 'react-icons/fa';
import toast from '@COMPONENTS/Toster/index';
import Cookies from 'js-cookie';

const MemberModal = ({ members , remainingCount,type}) => {
    const routeToMemberModel= (id) =>{
    const permissionDataString = Cookies?.get('permission')?JSON?.parse(Cookies?.get('permission')):null;
    if(permissionDataString?.user?.view===true||Cookies?.get('isAdmin') === 'true'){
        router.push('/w-m/members/' + id);
    }
    }
    const [open, setOpen] = useState(false)
    return (
        <>
        <a
            className='flex items-center cursor-pointer justify-center w-[30px] h-[30px] text-base font-medium text-white bg-gray-700 border-2 border-white rounded-full z-[0] hover:bg-gray-600 dark:border-gray-800 dark:text-gray-50'         
             onClick={(event) => {
                 setOpen(true);
                 event.stopPropagation();
                }}
                >
            {'+' + (remainingCount)}
        </a>
        {open && (
            <>

            <div className='fixed inset-0 flex items-center justify-center z-[999] bg-slate-900 bg-opacity-40' onClick={()=>{
                setOpen(false)
            }}>
            </div>
            <div className={` ${open?' transition-opacity opacity-100 duration-500 fixed top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] flex items-center justify-center z-[10000]' : ' transition-all delay-1000 opacity-0 translate-x-full'}`} onClick={(e)=>{
                e.stopPropagation();
            }}>
                <div className="bg-white w-96 p-4 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Members</h2>
                        <button className="text-gray-500 hover:text-gray-700"onClick={(event) => {
                 setOpen(false);
                 event.stopPropagation();
                }}>
                            <RiCloseLine className=' text-2xl font-black' />
                        </button>
                    </div>
                    {/* <div className="mb-4 flex items-center gap-4 rounded-md border px-2 py-2">
                        <BiSearch className=' text-2xl' />
                        <input
                            type="text"
                            placeholder="Search"
                            className="w-full outline-none"
                        />
                    </div> */}
                    <div className="max-h-40 overflow-y-auto">
         {members &&
                members.map((d,key) => {
                    return (
                      <div
                        className='flex items-center justify-start gap-2 p-2 my-2 w-full border'
                        key={key}
                      >
                        <div className='w-[10%]'>
                        <span className='text-sm relative w-[30px] h-[30px] bg-yellow-300 text-center flex items-center border justify-center text-gray-800 shadow-md rounded-full cursor-pointer'>
                          {type === "Client"
                            ? (
                                d?.clientName?.charAt(0) +
                                d?.clientName?.charAt(1)
                              )?.toUpperCase()
                            : (
                                d?.firstName?.charAt(0) +
                                d?.firstName?.charAt(1)
                              )?.toUpperCase()}
                        </span>
                        </div>
                        <span className='w-[70%] break-words'>
                          {type === "Client" ? d.clientName : d.firstName+' '+d.lastName}
                        </span>{" "}
                        {type==='Client' || type==='member' ?'':<FaEye style={{cursor:'pointer'}} className='ml-2 text-gray-500' onClick={()=>{ if(d.isSuspended === true){   toast({ type: 'error', message: 'This user is Suspended !', });} else{  routeToMemberModel(d._id)}} }/>}
                      </div>
                    );
                })
}
                    </div>
                </div>
            </div>
                </>
        )}
        </>
        
    );
};

export default MemberModal;
