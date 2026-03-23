import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import { ImCross } from 'react-icons/im';
import SelectDropDown from '../SelectDropDown';
import ProjectStatusChart from '../graph/ProjectStatus';
import { getAllStatus } from '@WORKFORCE_MODULES/config/api/get';
import { getStatusStat } from '@WORKFORCE_MODULES/projects/api/get';
import TinnySpinner from '@COMPONENTS/TinnySpinner';

const project_status = ({ clickConfig, handleRemoveGrid, data, key, projectCount }) => {
  
  const [statusData,setStatusData] = useState(null)

  const [shouldRender, setShouldRender] = useState(true);
  const handleGetStatusDetails = () => {
    getStatusStat().then(response => {
      if (response?.data?.body?.status === 'success') {
        setStatusData(response?.data?.body?.data)
      }
    });
  };

  useEffect(() => {
    handleGetStatusDetails()
  },[])

  const TodoPercent= (statusData?.Todo??0)*100/projectCount
  const InProgressPercent= (statusData?.Inprogress??0)*100/projectCount
  const InReviewPercent= (statusData?.Inreview??0)*100/projectCount
  const OnHoldPercent= (statusData?.Onhold??0)*100/projectCount
  const DonePercent= (statusData?.Done??0)*100/projectCount
  useEffect(() => {
    // Check if any of the percentage values are zero
    if (
      TodoPercent === 0 ||
      InProgressPercent === 0 ||
      OnHoldPercent === 0 ||
      InReviewPercent === 0 ||
      DonePercent === 0
    ) {
      // If any of them is zero, set shouldRender to true to trigger a re-render
      // setShouldRender(true);
      setShouldRender(true);
    } else {
      // Otherwise, set shouldRender to false to prevent re-render
      // setShouldRender(false);
      setShouldRender(false);
    }
  }, [TodoPercent, InProgressPercent, OnHoldPercent, InReviewPercent, DonePercent]);
  return (
    <div className={clickConfig ? "outline" : ""}>
      {
        clickConfig &&
        <div className="flex justify-between items-center mt-8 card p-4 w-full ">
          <div>
            <p className="project-details">
              {data.name}
            </p>
          </div>
          <div >
            <ImCross style={{ color: "red", cursor: "pointer" }} onClick={(event) => {
              handleRemoveGrid(event, data, key)
            }} />
          </div>
        </div>
      }
      <div className={clickConfig ? "opacity-30 " : "mt-5"}>
      <div
        className={`card-set project-stage w-full inline-block align-top !pl-0`}
      >
        <div className="flex justify-between items-center mb-1">
          <h1 className="heading-medium text-lg dark:text-[#fff] font-semibold mb-0 pl-9 sm:text-xl">
            Projects Status
          </h1>
          
        </div>
        <div className="member-chart-wrapper">
      {statusData && statusData !== undefined && statusData !== null ? (
        <>
          {shouldRender && (
            <ProjectStatusChart
              Todo={TodoPercent}
              Inprogress={InProgressPercent}
              Onhold={OnHoldPercent}
              Inreview={InReviewPercent}
              Done={DonePercent}
              projectCount={projectCount}
            />
          )}
          <div className="text-center dark:text-[#fff]">Project Count: {projectCount}</div>
        </>
      ) : (
        <TinnySpinner />
      )}
    </div>
        </div>
      </div>
    </div>
   
  )
}

export default project_status