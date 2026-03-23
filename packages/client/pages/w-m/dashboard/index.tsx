import Dashboard from '@WORKFORCE_MODULES/dashboard/components/dashboard'
import React from 'react'
const index = ({ startLoading, stopLoading }) => {
  return (
   <>
   <Dashboard {...{ startLoading, stopLoading }} />
   </>
  )
}
export default index