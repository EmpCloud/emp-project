import { useRouter } from 'next/router'
import React from 'react'
import TaskView from  '@WORKFORCE_MODULES/task/components/viewTask'
const index = ({ startLoading, stopLoading }) => {
  const router = useRouter();
  const { id } = router.query
  return (
    <>
      {
        id &&
        <TaskView   {...{ startLoading, stopLoading, id }} />
      }
    </>
  )
}
export default index