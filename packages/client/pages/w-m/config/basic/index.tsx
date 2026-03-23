import Basic from '@WORKFORCE_MODULES/config/components/basic'
import React from 'react'
const index = ({ startLoading, stopLoading }) => {
  return (
   <>
   <Basic {...{ startLoading, stopLoading }} />
   </>
  )
}
export default index