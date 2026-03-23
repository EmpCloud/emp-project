import React from 'react'
import TimeSheets from '@WORKFORCE_MODULES/members/components/timesheets'
const index = ({ startLoading, stopLoading }) => {
  return (
   <>
   <TimeSheets {...{ startLoading, stopLoading }} />
   </>
  )
}
export default index