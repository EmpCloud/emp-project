import React from "react";
import AllProjects from "@WORKFORCE_MODULES/projects/components/all";
export const index = ({ startLoading, stopLoading }) => {
  return (
    <>
      <AllProjects {...{ startLoading, stopLoading }} />
    </>
  );
};
export default index;
