import React from 'react'
import Pricing from '@WORKFORCE_MODULES/pricing/components/pricing'
const index = ({ startLoading, stopLoading }) => {
  return (
   <>
   <Pricing {...{ startLoading, stopLoading }} />
   </>
  )
}
export default index