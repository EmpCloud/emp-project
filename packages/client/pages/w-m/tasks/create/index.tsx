import React from 'react'
import CreateTaskPage from  '@WORKFORCE_MODULES/task/components/createTask'
const index = ({startLoading, stopLoading }) => {
  return (
   <>
   <CreateTaskPage   {...{startLoading, stopLoading }}  />
   </>
  )
}
export default index