import Task from '@WORKFORCE_MODULES/config/components/task'
import React from 'react'
const index = ({ startLoading, stopLoading }) => {
  return (
   <>
   <Task {...{ startLoading, stopLoading }} />
   </>
  )
}
export default index