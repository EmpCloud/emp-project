import React from 'react'
import ClientCompany from "@WORKFORCE_MODULES/members/components/client"
const index = ({startLoading,stopLoading}) => {
  return (
    <>
   <ClientCompany {...{ startLoading, stopLoading }} />
   </>
  )
}

export default index