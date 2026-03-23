import Chat from '@WORKFORCE_MODULES/chat/components/chat'
import React from 'react'
const index = ({ startLoading, stopLoading }) => {
  return (
   <>
   <Chat {...{ startLoading, stopLoading }} />
   </>
  )
}
export default index