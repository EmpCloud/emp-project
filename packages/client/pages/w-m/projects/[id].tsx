import { useRouter } from 'next/router'
import React from 'react'
import ProjectView from '@WORKFORCE_MODULES/projects/components/viewProject'
const index = ({ startLoading, stopLoading }) => {
  const router = useRouter();
  const { id } = router.query
  return (
    <>
      {
        id &&
        <ProjectView   {...{ startLoading, stopLoading, id }} />
      }
    </>
  )
}
export default index