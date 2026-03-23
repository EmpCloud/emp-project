import React from 'react'
import { ImCross } from 'react-icons/im';
import dynamic from 'next/dynamic';
import ProjectProgressChart from '../graph/ProjectProgressChart';
const Project_progress = dynamic(() => import('../graph/ProjectProgressChart'), { ssr: false });

const project_progress = ({ clickConfig, handleRemoveGrid, data, projectDetails, key }) => {

  const labels = [];
  const progress_in_percent = [];

  projectDetails && projectDetails.map(( project ) => {
    labels.push(project.projectName ?? 'Project Name');
    progress_in_percent.push(project.progress ?? 0);
      });

  return (<>
    <>
      <div className={` ${clickConfig ? "outline mt-8" : "outline-0 "}  inline-block  w-full mr-5 maxsm:!max-w-full progress-card-1 `}>
        {
          clickConfig &&
          <div className="flex justify-between items-center card p-4 w-full">
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
        <div className={clickConfig ? "opacity-30  w-full" : "mt-5"}>
          <div className={`card-set project-stage w-full inline-block align-top !pl-0`}>
            <div className="flex justify-between items-center">
              <h1 className="heading-medium text-lg font-semibold mb-0 sm:text-xl pl-7">
                Projects Progress
              </h1>
            </div>
            <div id="projectProgress" className="member-chart-wrapper project-progress-slid">
              <Project_progress labels={labels} progress_in_percent={progress_in_percent} />
              {/* <ProjectProgressChart labels={labels} progress_in_percent={progress_in_percent} /> */}
            </div>
            
          </div>
        </div>

      </div>
    </>
  </>);
}

export default project_progress