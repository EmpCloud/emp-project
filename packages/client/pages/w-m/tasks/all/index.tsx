import React from 'react'
import Tasks from  '@WORKFORCE_MODULES/task/components/allTask'
const index = ({ startLoading, stopLoading }) => {
  return (
   <>
   <Tasks {...{ startLoading, stopLoading }} />
   </>
  )
}
export default index