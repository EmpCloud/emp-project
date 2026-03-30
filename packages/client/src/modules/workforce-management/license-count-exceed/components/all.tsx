import React, { useEffect, useState } from 'react';
import DynamicChart from './DynamicCharts';
import { downgradeInfo } from '../api/get';
const all = () => {

    const [downGradeData,setDownGradeData]= useState('')

    const handleGetDowngradeInfo = () => {
        downgradeInfo().then(response => {
            if (response.data?.body?.status === 'success') {
               setDownGradeData(response?.data?.body?.data)
                // setConfigDetails(response.data?.body?.data?.activity);
            }
        }).catch(function (e) {
                // toast({
                //     type: 'error',
                //     message: e.response ? e.response.data.body.message : 'Something went wrong, Try again !',
                // });
            });
    };

    useEffect(()=>{
        handleGetDowngradeInfo()

    },[])

    const userData = [
        { name: 'Users ',  value: downGradeData && downGradeData?.Users[0]?.existingUsers },
        { name: 'Users Actual', value:downGradeData && downGradeData?.Users[0]?.actualUsers},
    ];
    const projectData = [
        { name: 'Projects ', value: downGradeData && downGradeData?.project[0]?.existingProject},
        { name: 'Projects Actual', value:downGradeData && downGradeData?.project[0]?.actualProject   },
    ];
    const tasksData = [
        { name: 'Tasks ',  value:downGradeData && downGradeData?.Task[0]?.existingTask },
        { name: 'Tasks Actual', value:downGradeData && downGradeData?.Task[0]?.actualTask   },
    ];
    const rolesData = [
        { name: 'Roles ',  value:downGradeData && downGradeData?.Roles[0]?.existingRoles },
        { name: 'Roles Actual', value:downGradeData && downGradeData?.Roles[0]?.actualRoles  },
    ];
    const groupsData = [
        { name: 'Groups ', value:downGradeData && downGradeData?.Groups[0]?.existingGroups},
        { name: 'Groups Actual', value:downGradeData && downGradeData?.Groups[0]?.actualGroups  },
    ];
    const permissionsData = [
        { name: 'Permissions ', value:downGradeData && downGradeData?.Permissions[0]?.existingPermissions},
        { name: 'Permissions Actual', value:downGradeData && downGradeData?.Permissions[0]?.actualPermissions   },
    ];
    const taskCategoryData = [
        { name: 'Task Category ',  value:downGradeData && downGradeData?.Categories[0]?.existingCategories },
        { name: 'Task Category Actual',value:downGradeData && downGradeData?.Categories[0]?.actualCategories   },
    ];
    const taskStatusData = [
        { name: 'Task Status ', value:downGradeData && downGradeData?.TaskStages[0]?.existingTaskStages},
        { name: 'Task Status Actual',value:downGradeData && downGradeData?.TaskStages[0]?.actualTaskStages  },
    ];
    const taskTypeData = [
        { name: 'Task Type ', value:downGradeData && downGradeData?.TaskType[0]?.existingTaskType },
        { name: 'Task Type Actual', value:downGradeData && downGradeData?.TaskType[0]?.actualTaskType  },
    ];
    const taskStageData = [
        { name: 'Task Status ', value:downGradeData && downGradeData?.TaskStages[0]?.existingTaskStages},
        { name: 'Task Status Actual',value:downGradeData && downGradeData?.TaskStages[0]?.actualTaskStages  },
    ];

    const subTaskStageData = [
        { name: 'SubTask  ', value:downGradeData && downGradeData?.SubTask[0]?.existingSubTask},
        { name: 'SubTask  Actual',value:downGradeData && downGradeData?.SubTask[0]?.actualSubTask  },
    ];

    const colors = ['#FF0000', '#00E396']; // Example colors

    console.log(projectData[0].value > projectData[1].value ,'project')
    const ProjectCondition =projectData[0].value > projectData[1].value 
    const userCondition =userData[0].value > userData[1].value 
    const taskCondition =tasksData[0].value > tasksData[1].value 
    const rolesCondition =rolesData[0].value > rolesData[1].value 
    const subTaskCondtion =subTaskStageData[0].value > subTaskStageData[1].value 
    const groupsCondition =groupsData[0].value > groupsData[1].value 
    const permissionsCondition =permissionsData[0].value > permissionsData[1].value 
    const taskCategoryCondition =taskCategoryData[0].value > taskCategoryData[1].value 
    const taskStatusCondition =taskStatusData[0].value > taskStatusData[1].value 
    const taskTypeCondition =taskTypeData[0].value > taskTypeData[1].value 
    const taskStageCondition =taskStageData[0].value > taskStageData[1].value 
let condition ="1"=='1'


    return (
        <>
        <div className='grid xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 mb-6'>

       <DynamicChart
  title="Users"
  data={userData}
  colors={userCondition ? ['#FF0000', '#00E396'] : ''}
  chartType="pie"
  redirectPath='w-m/members/all'
/>
        <DynamicChart
  title="Projects"
  data={projectData}
  colors={ProjectCondition ? ['#FF0000', '#00E396'] : ''}
  chartType="pie"
  redirectPath='w-m/projects/all'
/>


<DynamicChart
  title="Tasks"
  data={tasksData}
  colors={taskCondition ? ['#FF0000', '#00E396'] : ''}
  chartType="pie"
  redirectPath='w-m/tasks/all'
/>
<DynamicChart
  title="Roles"
  data={rolesData}
  colors={rolesCondition ? ['#FF0000', '#00E396'] : ''}
  chartType="pie"
  redirectPath='w-m/members/roles'
/>
<DynamicChart
  title="Sub Task"
  data={subTaskStageData}
  colors={subTaskCondtion ? ['#FF0000', '#00E396'] : ''}
  chartType="pie"
/>
<DynamicChart
  title="Groups"
  data={groupsData}
  colors={groupsCondition ? ['#FF0000', '#00E396'] : ''}
  chartType="pie"
  redirectPath='w-m/members/groups'
/>
<DynamicChart
  title="Permissions"
  data={permissionsData}
  colors={permissionsCondition ? ['#FF0000', '#00E396'] : ''}
  chartType="pie"
  redirectPath='w-m/permissions/all'
/>
<DynamicChart
  title="Task Category"
  data={taskCategoryData}
  colors={taskCategoryCondition ? ['#FF0000', '#00E396'] : ''}
  chartType="pie"
  redirectPath='w-m/config/task'
/>
<DynamicChart
  title="Task Status"
  data={taskStatusData}
  colors={taskStatusCondition ? ['#FF0000', '#00E396'] : ''}
  chartType="pie"
  redirectPath='w-m/config/task'
/>
<DynamicChart
  title="Task Stage"
  data={taskStageData}
  colors={taskStageCondition ? ['#FF0000', '#00E396'] : ''}
  chartType="pie"
  redirectPath='w-m/config/task'
/>
<DynamicChart
  title="Task Type"
  data={taskTypeData}
  colors={taskTypeCondition ? ['#FF0000', '#00E396'] : ''}
  chartType="pie"
  redirectPath='w-m/config/task'
/>
 {/* 


<DynamicChart
  title="Groups"
  data={groupsData}
  colors={groupsCondition ? ['#FF0000', '#00E396'] : ''}
  chartType="pie"
/>
<DynamicChart
  title="Permissions"
  data={permissionsData}
  colors={permissionsCondition ? ['#FF0000', '#00E396'] : ''}
  chartType="pie"
/>
<DynamicChart
  title="Task Category"
  data={taskCategoryData}
  colors={taskCategoryCondition ? ['#FF0000', '#00E396'] : ''}
  chartType="pie"
/>
<DynamicChart
  title="Task Status"
  data={taskStatusData}
  colors={taskStatusCondition ? ['#FF0000', '#00E396'] : ''}
  chartType="pie"
/>
<DynamicChart
  title="Task Type"
  data={taskTypeData}
  colors={taskTypeCondition ? ['#FF0000', '#00E396'] : ''}
  chartType="pie"
/>
<DynamicChart
  title="Task Stage"
  data={taskStageData}
  colors={taskStageCondition ? ['#FF0000', '#00E396'] : ''}
  chartType="pie"
/> */}

            {/* <DynamicChart  title="Users" data={userData} chartType="pie" />
            <DynamicChart  title="Projects" data={projectData}    colors={condition ? '' : colors} chartType="pie" />
            <DynamicChart  title="Tasks" data={tasksData} chartType="pie" />
            <DynamicChart  title="Sub Task" data={subTaskStageData} chartType="pie" />
            <DynamicChart  title="Roles" data={rolesData} chartType="pie" />
            <DynamicChart  title="Groups" data={groupsData} chartType="pie" />
            <DynamicChart  title="Permissions" data={permissionsData} chartType="pie" />
            <DynamicChart  title="Task Category" data={taskCategoryData} chartType="pie" />
            <DynamicChart  title="Task Status" data={taskStatusData} chartType="pie" />
            <DynamicChart  title="Task Type" data={taskTypeData} chartType="pie" />
        */}
            {/* {
                
                <>
              {  console.log(((downGradeData && downGradeData?.SubTask[0]?.actualSubTask) >( downGradeData && downGradeData?.SubTask[0]?.existingSubTask )? 'hi':'he')) }
               {(downGradeData && downGradeData?.SubTask[0]?.actualSubTask) <( downGradeData && downGradeData?.SubTask[0]?.existingSubTask )?        <DynamicChart  title="Sub Task" data={subTaskStageData} chartType="pie" /> :       <DynamicChart  title="Sub Tasksssssss" data={subTaskStageData} chartType="pie" />}

                </>

            } */}

           
        </div>
        </>
    );
};

export default all;
