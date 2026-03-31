import React from "react";
import dynamic from "next/dynamic";

const AllProjects = dynamic(
  () => import("@WORKFORCE_MODULES/projects/components/all"),
  { ssr: false, loading: () => <div className="flex justify-center items-center h-64"><p>Loading projects...</p></div> }
);

export const index = ({ startLoading, stopLoading }) => {
  return (
    <>
      <AllProjects {...{ startLoading, stopLoading }} />
    </>
  );
};
export default index;
