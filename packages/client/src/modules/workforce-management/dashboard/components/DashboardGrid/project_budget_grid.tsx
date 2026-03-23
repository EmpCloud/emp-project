import React from 'react';
import { ImCross } from 'react-icons/im';
import DoughtnutCharts from '../graph/DoughtnutCharts';
import LineCharts from '../graph/LineCharts';

const project_budget_grid = ({ clickConfig, handleRemoveGrid, data, key, projectDetails }) => {
    const labels = [];
    const actualBudgets = [];
    const plannedBudget = [];

    projectDetails &&
        projectDetails.map(project => {
            const projectName = project?.projectName ?? 'Project Name';
            const limitedLabel = projectName.slice(0, 10);
            labels.push(limitedLabel);
            // labels.push(project?.projectName ?? 'Project Name');
            actualBudgets.push(project?.actualBudget ?? 0);
            plannedBudget.push(project?.plannedBudget ?? 0);
        });

    const dataApplication = {
        labels,
        datasets: [
            {
                label: 'Actual',
                data: actualBudgets,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                label: 'Planned',
                data: plannedBudget,
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    };

    return (
        <div className={` ${clickConfig ? 'outline ' : 'outline-0'} mt-5  `}>
            {clickConfig && (
                <div className='flex justify-between items-center mt-4 card p-4 w-full'>
                    <div>
                        <p className='project-details'>{data.name}</p>
                    </div>
                    <div>
                        <ImCross
                            style={{ color: 'red', cursor: 'pointer' }}
                            onClick={event => {
                                handleRemoveGrid(event, data, key);
                            }}
                        />
                    </div>
                </div>
            )}
            <div className={clickConfig ? 'opacity-30 ' : ' '}>
                <div className='card-d '>
                    <h3 className='heading-medium mt-4 chart-clr font-semibold'>Project(s) Budget</h3>
                    <div id='projectBudget' className='flex justify-center mb-2'>
                        <LineCharts data={dataApplication} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default project_budget_grid;
