import React, { useState } from 'react'
import { AiOutlineEye } from 'react-icons/ai';
import NewToolTip from '../../../../components/NewToolTip';
const memberModel = () => {
const [showModal , setShowModal] = useState(false)
  return (
    <>
  <button ><NewToolTip direction='left' message={"View all members"}><a ><span className='text-xl'><AiOutlineEye /></span></a></NewToolTip></button>
    </>
  )
}
export default memberModel