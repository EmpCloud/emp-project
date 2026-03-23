import React from 'react'
import SelectDashboard from '@WORKFORCE_MODULES/dashboard/components/selectDashboard'
const index = ({ startLoading, stopLoading }) => {
  return (
   <>
   <SelectDashboard {...{ startLoading, stopLoading }} />
   </>
  )
}
export default index