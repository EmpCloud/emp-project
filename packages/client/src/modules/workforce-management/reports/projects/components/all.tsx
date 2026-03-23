import React, { useEffect, useState } from 'react';
import { MdPendingActions } from 'react-icons/md';
import { BiTask } from 'react-icons/bi';
import { AiOutlineFileDone, AiOutlineWarning, AiFillCheckCircle } from 'react-icons/ai';
import { MdGroup, MdPlaylistAddCheck, MdAccessTime } from 'react-icons/md';
import { GiProgression } from 'react-icons/gi';
import { getAllProject } from '@WORKFORCE_MODULES/projects/api/get';
import DropDownWithTick from '@COMPONENTS/DropDownWithTick';
import { data } from '@WORKFORCE_MODULES/dashboard/components/graph/PolarAreaCharts';
import ProjectAndTaskReport from '@WORKFORCE_MODULES/reports/projects/components/projectAndTaskReport';
import toast from '../../../../../components/Toster/index';
import Cookies from 'js-cookie';
import generatePDF from 'react-to-pdf';
import Dashboard from 'src/trelloBoard/Home/Dashboard';
import NoSsr from '@COMPONENTS/NoSsr';
import { FaHourglass } from 'react-icons/fa';
import domtoimage from 'dom-to-image';
import jsPDF from 'jspdf';
import { TbReportAnalytics } from 'react-icons/tb';
export const index = ({ startLoading, stopLoading }) => {
    const [projectDetail, setProjectDetails] = useState([]);
    const [projectList, setProjectList] = useState([]);
    const [projectName, setProjectName] = useState(null);
    const [projectActivity, setProjectActivity] = useState([]);
    const [projectSelected, setSelectedProject] = useState(null);
    //handle Sidebar
    const [sidebar, setSidebar] = useState(false);

    const container = React.useRef(null);
    const handleGetAllProject = (condition) => {
        getAllProject(condition).then(response => {
            if (response && response.data?.body?.status === 'success') {
                setProjectDetails(response.data?.body?.data?.project);
                let projectList = response.data?.body.data.project.map(item => {
                    return {
                        name: item.projectName,
                        value: item._id ? item._id : [],
                        item,
                    };
                });
                setProjectList(projectList);
                setSelectedProject(projectList[0] ? projectList[0] : []);
                setProjectName(projectList[0].name ? projectList[0].name : null);
               
            }else {
                // toast({
                //     type: 'error',
                //     message: response ? response.data.body.message : 'Error',
                // });
            }
        })
        .catch(function (e) {
            // toast({
            //     type: 'error',
            //     message: e.response ? e.response.data.message : 'Something went wrong, Try again !',
            // });
        });
       
    };

    
    // handle sidebar
    useEffect(() => {
      const checkSidebarState = () => {
        const sidebarState = document.body.classList.contains('open-sidebar');
        setSidebar(sidebarState);
      };
    
      // Check initial state
      checkSidebarState();
    
      // Set up a MutationObserver to check for class changes
      const observer = new MutationObserver(checkSidebarState);
      observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    
      // Clean up observer on unmount
      return () => observer.disconnect();
    }, []);


    useEffect(() => {
        handleGetAllProject('?limit='+process.env.TOTAL_USERS);
    }, []);
    useEffect(() => {
        // document.querySelector('body').classList.add('bodyBg');
    }, []);
    const handleSelectProject = e => {
        setProjectName(e.name);
        setSelectedProject(e);
    };
    useEffect(() => {
        if (projectSelected !== null) {
            const handleGetAllProject = prop => {
                getAllProject(prop).then(response => {
                    if (response && response.data?.body?.status === 'success') {
                        setProjectActivity(response?.data?.body?.data?.project);
                    }else {
                        toast({
                            type: 'error',
                            message: response ? response.data.body.message : 'Error',
                        });
                    }
                })
                .catch(function (e) {
                    toast({
                        type: 'error',
                        message: e.response ? e.response.data.message : 'Something went wrong, Try again !',
                    });
                });
                
            };
            handleGetAllProject(`?id=${projectSelected?.item?._id}&limit=${process.env.TOTAL_USERS}`);
        }
    }, [projectSelected]);
      
      const captureScreenshotdomtoimagePdf = () => {
        alert("Please Wait for few seconds to generate.");
        toast({
            type: 'info',
            message: 'Please wait, your report is being generated...',
        });
    
        const marginProg = document.querySelector('.Report-container');
    
        const removeMarginFromElement = () => {
            marginProg.classList.remove('md:mt-44');
        };
    
        const targetElement = document.querySelector('#Reports');
    
        if (!targetElement) {
            console.error('Target element not found.');
            return;
        }
    
        const customPageWidth = 350;
        const customPageHeight = 750;
      

        removeMarginFromElement();
    
        domtoimage
            .toPng(targetElement)
            .then((dataUrl) => {
                const pdf = new jsPDF('p', 'mm', [customPageWidth, customPageHeight]);
                const imageY = 10;
                const imageHeight = customPageHeight - 20;
                const logoImg = new Image();
                // marginProg.classList.add('md:mt-44');
    
                // Set the image source (URL)
                logoImg.src = '/imgs/logo.jpg';
    
                // Handle image load errors
                logoImg.onerror = () => {
                    console.error('Error loading image:', logoImg.src);
                    // marginProg.classList.add('md:mt-44');
                    // marginProg.classList.remove('md:-mt-20');
                };
    
                logoImg.onload = () => {
                    const logoWidth = 50;
                    const imageX = (customPageWidth - logoWidth) / 2;
                    pdf.addImage(logoImg, 'PNG', imageX, imageY, logoWidth, 10);
                    const titleText = `${projectName ? projectName :''} Report `;
                    const fontSize = 20;
                    const titleWidth = pdf.getStringUnitWidth(titleText) * fontSize / pdf.internal.scaleFactor;
                    const titleX = (customPageWidth - titleWidth) / 2;
                    const titleY = imageY + 26;
                    pdf.setFontSize(fontSize);
                    pdf.text(titleText, titleX, titleY);
                    pdf.addImage(dataUrl, 'PNG', 10, titleY + 20, customPageWidth - 20, imageHeight - 40);
                    
                    // Generate the current date
                    const currentDate = new Date();
                    const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
    
                    // Save the PDF with the modified filename including the current date
                    pdf.save(`${projectName} Report ${formattedDate}.pdf`);
                };
            })
            .catch((error) => {
                // marginProg.classList.add('md:mt-44');
                // marginProg.classList.remove('md:-mt-20');
                console.error('Error capturing screenshot:', error);
            });
    };
   
      
    return (
        <>
         <NoSsr>
            <div className='mb-4'>
                <div className={`static md:flex justify-between items-center md:sticky top-[54px] md:-mt-8 z-50 py-4 px-3 bodyBg`}>
                    <div>
                        <h2 className='heading-big dark:!text-[#fff] text-center font-medium text-2xl'>Project Reports</h2>
                    </div>
                    <div className='flex gap-2 items-center justify-center'>
                        <div>
                        <DropDownWithTick paddingForDropdown={"py-2"} value={projectName} width={'w-full'} selectedData={data} data={projectList} onChangeValue={handleSelectProject} />
                        </div>
                        {/* <h1>Download</h1> */}
                        <div className=' flex items-center gap-2 py-2 dark:text-[#fff] px-2 rounded-xl text-white bg-indigo-500 hover:bg-indigo-600 duration-300 active:scale-105'>
                        <TbReportAnalytics className='xl:text-xl'/>
                        <button className='text-base' onClick={captureScreenshotdomtoimagePdf}>Generate Report</button>
                        </div>
                    </div>
                    </div>
                        <div ref={container} id='Reports'>
                <div className='Report-container grid grid-cols-2 md:grid-cols-5 lg:grid-cols-5 md:grid-rows-2 lg:grid-rows-1 gap-4 rounded-xl px-2 text-white'>
                    <div className='progress-container col-span-1 md:col-span-1 dark:text-[#fff]  bg-white px-4 lg:px-0 text-center w-full flex flex-col justify-center gap-1 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-[#5C27FE] to-[#C165DD]  items-center py-4 rounded-lg shadow-lg shadow-grey-300'>
                        <h2 className=' text-base font-semibold'>Total Tasks</h2>
                        <div className='flex justify-center items-center text-xl gap-2'>
                            <BiTask />
                            <p className=' font-bold'>{projectActivity ? projectActivity?.taskCount ?? 0 : 0}</p>
                        </div>
                    </div>
                    <div className='progress-container col-span-1 md:col-span-1 dark:text-[#fff]  bg-white px-4 lg:px-0 text-center w-full flex flex-col justify-center gap-1 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-[#B588F7] to-[#1DE5E2]  items-center py-4 rounded-lg shadow-lg shadow-grey-300'>
                        <h2 className=' text-base font-semibold text-center'>Completed Tasks</h2>
                        <div className='flex justify-center items-center text-xl gap-2'>
                            <AiOutlineFileDone />
                            <p className=' font-bold'>{projectActivity ? projectActivity?.completedTask ?? 0: 0}</p>
                        </div>
                    </div>
                    <div className='progress-container col-span-1 md:col-span-1 dark:text-[#fff]  bg-white px-4 lg:px-0 text-center w-full flex flex-col justify-center gap-1 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-[#FC76B3] to-[#FACD68]  items-center py-4 rounded-lg shadow-lg shadow-grey-300'>
                        <h2 className=' text-base font-semibold text-center'>Pending Tasks</h2>
                        <div className='flex justify-center items-center text-xl gap-2'>
                            <MdPendingActions />
                            <p className=' font-bold'>{projectActivity ? projectActivity?.pendingTak ?? 0 : 0}</p>
                        </div>
                    </div>
                    <div className='progress-container col-span-1 md:col-span-1 dark:text-[#fff]  bg-white px-4 lg:px-0 text-center w-full flex flex-col justify-center gap-1 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-[#5460f9] to-[#12b3eb] items-center py-4 rounded-lg shadow-lg shadow-grey-300'>
                        <h2 className=' text-base font-semibold text-center'>Overdue Tasks</h2>
                        <div className='flex justify-center items-center text-xl gap-2'>
                            <AiOutlineWarning />
                            <p className=' font-bold'>{projectActivity ? projectActivity?.totalOverDueTasks ?? 0 : 0}</p>
                        </div>
                    </div>
                    <div className='progress-container col-span-2 md:col-span-1 dark:text-[#fff]  bg-white px-4 lg:px-0 text-center w-full flex flex-col justify-center gap-1 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-[#FF7B02] to-[#FFCB52]  items-center py-4 rounded-lg shadow-lg shadow-grey-300'>
                        <h2 className=' text-base font-semibold text-center'>Total Members</h2>
                        <div className='flex justify-center items-center text-xl gap-2'>
                            <MdGroup className=' ' />
                            <p className=' font-bold'>{projectActivity ? projectActivity?.memberCount ?? 0 : 0}</p>
                        </div>
                    </div>
                </div>
                {/* data progress report subtasks*/}
                <div className='grid grid-cols-2 md:grid-cols-5 lg:grid-cols-5 md:grid-rows-2 lg:grid-rows-1 gap-4 rounded-xl px-2 text-white mt-6'>
                    <div className='progress-container col-span-1 md:col-span-1 dark:text-[#fff]  bg-white px-4 lg:px-0 text-center w-full flex flex-col justify-center gap-1 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-[#595cff] to-[#84effd]  items-center py-4 rounded-lg shadow-lg shadow-grey-300'>
                        <h2 className=' text-base font-semibold text-center'>Total Subtasks</h2>
                        <div className='flex justify-center items-center text-xl gap-2'>
                            <MdPlaylistAddCheck />
                            <p className=' font-bold'>{projectActivity ? projectActivity?.subTaskCount ?? 0 : 0}</p>
                        </div>
                    </div>
                    <div className='progress-container col-span-1 md:col-span-1 dark:text-[#fff]  bg-white px-4 lg:px-0 text-center w-full flex flex-col justify-center gap-1 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-[#A16BFE] to-[#DEB0DF]  items-center py-4 rounded-lg shadow-lg shadow-grey-300'>
                        <h2 className=' text-base font-semibold text-center'>Completed Subtasks</h2>
                        <div className='flex justify-center items-center text-xl gap-2'>
                            <AiFillCheckCircle />
                            <p className=' font-bold'>{projectActivity ? projectActivity?.completedSubTask ?? 0 : 0}</p>
                        </div>
                    </div>
                    <div className='progress-container col-span-1 md:col-span-1 dark:text-[#fff]  bg-white px-4 lg:px-0 text-center w-full flex flex-col justify-center gap-1 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-[#ff930f] to-[#e9ca19] items-center py-4 rounded-lg shadow-lg shadow-grey-300'>
                        <h2 className=' text-base font-semibold text-center'>Pending Subtasks</h2>
                        <div className='flex justify-center items-center text-xl gap-2'>
                            <FaHourglass />
                            <p className=' font-bold'>{projectActivity ? projectActivity?.pendingSubTak ?? 0 : 0}</p>
                        </div>
                    </div>
                    <div className='progress-container col-span-1 md:col-span-1 dark:text-[#fff]  bg-white px-4 lg:px-0 text-center w-full flex flex-col justify-center gap-1 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-[#f40752] to-[#f9ab8f] items-center py-4 rounded-lg shadow-lg shadow-grey-300'>
                        <h2 className=' text-base font-semibold text-center'>Overdue Subtasks</h2>
                        <div className='flex justify-center items-center text-xl gap-2'>
                            <MdAccessTime />
                            <p className=' font-bold'>{projectActivity ? projectActivity?.totalOverDueSubTasks ?? 0 : 0}</p>
                        </div>
                    </div>
                    <div className='progress-container col-span-2 md:col-span-1 dark:text-[#fff]  bg-white px-4 lg:px-0 text-center w-full flex flex-col justify-center gap-1  bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-[#4fc779] to-[#bce738] items-center py-4 rounded-lg shadow-lg shadow-grey-300'>
                        <h2 className=' text-base font-semibold text-center'>Project Progress</h2>
                        <div className='flex justify-center items-center text-xl gap-2'>
                            <GiProgression />
                            <p className=' font-bold'>{projectActivity.progress === null ? 0 : projectActivity?.progress ?? 0}%</p>
                        </div>
                    </div>
                </div>
                <div className='mt-6'>
                    <ProjectAndTaskReport
                        {...{
                            projectSelected,
                        }}
                    />
                </div>
                </div>
            </div>
        </NoSsr>
        </>
    );
};
export default index;