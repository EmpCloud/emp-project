import React, { useState } from 'react'
import { RiSendPlaneFill ,RiCloseFill} from "react-icons/ri";
const test2 = () => {
  const [linkNm, setlinkNm] = React.useState('');
  const [showReplyBtn, setShowReplyBtn] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const linkNmHandler = (e) => {
    setlinkNm(e.target.value);
  }
  const showReplyHandler = (e) => {
    setShowReplyBtn(!showReplyBtn);
  }
  return (
<>
<button onClick={()=>{
setOpen(true)
}}>Click</button>
{
open && <div className="fixed bottom-0 right-0 max-w-[330px] w-full bg-white z-[999] rounded  py-3 px-2 shadow-md font-inter ">
<div className="group">
  <div className="grid grid-cols-chat-grid items-center gap-3 mb-3">
    <div className="inline-block">
      <div className="relative rounded-full w-[50px] h-[50px] mx-auto">
        <img src="https://i.pravatar.cc/150?img=11" className="absolute w-full h-full rounded-full object-cover top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>
    </div>
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <h1 className="text-[13.7px] max-w-[217px] w-full font-bold whitespace-nowrap overflow-hidden text-ellipsis text-black">Neetu Kanaujia (Next js + Node js)</h1>
        <RiCloseFill className="cursor-pointer opacity-40 transition-all hover:opacity-100 hover:rotate-[360deg]" />
      </div>
      <p className="text-[13px] overflow-hidden " style={{ 'display': '-webkit-box', '-webkit-line-clamp': '2', '-webkit-box-orient': 'vertical', }}>Reach new productivity peaks and empower your business with deep insights, .</p>
    </div>
  </div>
  <button type="button"  onClick={()=>{
setOpen(true)
}} className={
     `${showReplyBtn ? 'invisible' : 'invisible group-hover:visible'} absolute  right-[28px] bottom-[11px] bg-[#d5f7ff] text-[#188399] font-semibold rounded text-[14px] py-1.5 px-4 transition-all hover:shadow-md ` } onClick={showReplyHandler}>Reply</button>
  <div className={ ` ${showReplyBtn ? 'block' : 'hidden'} w-full relative`}>
    <div contentEditable='true' className='flex items-center justify-start break-all w-full min-h-[40px] h-auto outline-0 text-[13px] border border-[#dbdbdb] rounded py-1 px-4 pr-11 mb-3.4'></div>
    <button   onClick={()=>{
setOpen(true)
}} type="button" className="absolute right-0 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45 text-[23px] text-[#00a1ff] cursor-pointer"> <RiSendPlaneFill /></button>
  </div>
</div>
</div>
}
</>
  )
}
export default test2