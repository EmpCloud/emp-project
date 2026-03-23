import React from 'react'
import AllUsers from '@WORKFORCE_MODULES/members/components/all'
const index = ({ startLoading, stopLoading }) => {
  return (
   <>
   <AllUsers {...{ startLoading, stopLoading }} />
   </>
  )
}
export default index