import React from "react";
import CreateProjects from "@WORKFORCE_MODULES/projects/components/createProject";
export const index = ({ startLoading, stopLoading }) => {
  return (
    <>
      <CreateProjects {...{ startLoading, stopLoading }} />
    </>
  );
};
export default index;
