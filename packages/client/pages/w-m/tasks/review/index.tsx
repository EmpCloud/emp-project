import React from 'react'
import TaskReview from '@WORKFORCE_MODULES/task/components/taskReview'
import Dashboard from '../../../../src/trelloBoard/Home/Dashboard'
const index = ({startLoading, stopLoading }) => {
  return (
   <>
   {/* <TaskReview   {...{startLoading, stopLoading }}  /> */}
   <Dashboard   {...{startLoading, stopLoading }}  />

   </>
  )
}
export default index