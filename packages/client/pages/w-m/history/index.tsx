import React from 'react'
import History from  "@WORKFORCE_MODULES/history/components/index";
const index = ({startLoading,stopLoading}) => {
  return (
<>
<History  {...{startLoading,stopLoading}}/>
</>
  )
}
export default index