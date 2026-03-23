import React, { useEffect, useState,Fragment } from 'react';
import { AiOutlineDelete } from 'react-icons/ai';
import Modal from 'react-modal'; 
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';
import { HiArrowNarrowLeft, HiOutlineMail, HiOutlineLocationMarker, HiOutlineBriefcase, HiOutlineClipboardCheck } from 'react-icons/hi';
import { AiOutlineDashboard } from 'react-icons/ai';
import { VscCalendar, VscGraphLine } from 'react-icons/vsc';
import { GiSandsOfTime } from 'react-icons/gi';
import { VscListSelection } from 'react-icons/vsc';
import { BsCamera, BsFiletypeCsv, BsFiletypePdf } from 'react-icons/bs';
import { Popover, Transition } from '@headlessui/react';
import { ChevronDown } from 'react-feather';
import * as XlsxPopulate from "xlsx-populate/browser/xlsx-populate";
import * as XLSX from "xlsx";
import JsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'
import { getAllUsers, getUserById } from '../api/get';
import { filterManager, filterMembers, filterOwner, formatedDate } from '@HELPER/function';
import MemberModal from '@COMPONENTS/MemberModal';
import TinnySpinner from '@COMPONENTS/TinnySpinner';
import ToolTip from '@COMPONENTS/ToolTip';
import { generateDicebearUrl } from '@HELPER/avtar';
import { USER_AVTAR_URL } from '@HELPER/avtar';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import toast from '@COMPONENTS/Toster/index';
import NoSsr from '@COMPONENTS/NoSsr';
import router from 'next/router';


function index() {
    const [userOneDetails,setuserOneDetails]=useState(null)
    const [userProjectDetails, setUserProjectDetails] = useState(null);
    const [userTaskDetails, setUserTaskDetails] = useState(null);
    // const [sortTable,setSortTable] = useState(
    //     {   skip: 5,
    //        limit: 5,
    //        pageNo: 1,
    //    })
    const [projectCount,setProjectCount] = useState(null)
    const [taskCount,setTaskCount] = useState(null)

    const [lastPart, setLastPart] = useState(null);
    const handleGetAllUser = (condition = '') => {
        getUserById (condition).then(response => {
            if (response.data.body.status === 'success') {
                setuserOneDetails(response.data?.body.data)
                setProjectCount(response.data.body.data.TotalProjects)
                setUserProjectDetails(response.data.body.data.Project_details)
                setUserTaskDetails(response.data.body.data.Task_details)
                setTaskCount(response.data?.body.data.TotalTasks);  
            }
        });
    };
 
    useEffect(() => {
        const url = window.location.href;
    
        const parts = url.split('/');
        const lastPart = parts[parts.length - 1];
    
        if (lastPart && /^[0-9a-fA-F]{24}$/.test(lastPart)) {
            setLastPart(lastPart)
        
        } else {
        }
      }, []);
      useEffect(()=>{
        handleGetAllUser("?userId="+lastPart)
    },[lastPart])
    // SelectDropdown
   
    
    useEffect(() => {
        // document.querySelector("body").classList.add("bg-slate-50");
    }, []);

    // Handle Calendar
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRange, setSelectedRange] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection',
        },
    ]);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    let[Data,setData]=useState(null)
    const handleCloseModal = () => {
        setData('One')
        setIsModalOpen(false);
    };
    const isButtonDisabled = Data !== 'One';
    const handleDateChange = (ranges) => {
        // Handle date range selection
        setSelectedRange([ranges.selection]);
    };



    
    const [projectDetails ,setProjectDetails]=useState(null);
    const [taskDetails ,setTaskDetails]=useState(null);
    const [userDetails ,setUserDetails] =useState(null) ;

    const handleGetAllUserDownload = (condition = '') => {
        getAllUsers(condition).then(response => {
                        if (response.data.body.status === 'success') {
                setUserDetails(response.data?.body.data);
                setProjectDetails(response.data?.body.data.Project_details)   
                setTaskDetails(response.data?.body.data.Task_details)
            }
        });
    };
    useEffect(() => {
        if(lastPart !== null && lastPart !== undefined){
        handleGetAllUserDownload('?userId='+lastPart +'&startDate=' +startDate +'&endDate='+endDate);
        }
    }, [selectedRange]);


let FinalDownloadDataTwo = [];
if (taskDetails) {
    for (let data of taskDetails) {
        const assignedToField = data?.assignedTo?.map(dataItem => `${dataItem.firstName} ${dataItem.lastName}`).join(', ') ?? ['Not Assigned'];
             let createdBy = data?.taskCreator.firstName + '  ' +data?.taskCreator.lastName
        let projectData = {
            'Project': data.projectName ? data.projectName : ' Not Assigned ',
            Task: data.taskTitle,
            'Created By':createdBy,
            Priority: data.priority,
            'Created At': formatedDate(data.createdAt),
            'Completed Date': formatedDate(data.completedDate) ??'      -',
            'Reason': data.reason ?? '     -',
            'Due date': formatedDate(data.dueDate),
            'Est.Time': data.estimationTime,
            'Est.Date': formatedDate(data.estimationDate),
            'Assigned to': assignedToField ?? 'Not Assigned ', 
            'Task type': data.taskType,
            Category: data.category,
            Status: data.taskStatus,
            Stage: data.stageName,
        };

        if (data.subTask?.length > 0) {
            for (let subtask of data.subTask) {
                let createdBy = subtask?.subTaskCreator.firstName + '  ' +subtask?.subTaskCreator.lastName
                const assignedToFieldOne = subtask?.subTaskAssignedTo?.map(dataItem => `${dataItem?.firstName} ${dataItem?.lastName}`).join(', ') ?? ['Not Assigned'];
                let subtaskData = {
                    'Task': subtask?.subTaskTitle +  '     [ Sub Task ] ',
                    'Created By': createdBy ,
                    Priority: subtask?.priority,
                    'Created At': formatedDate(subtask?.createdAt),
                    'Due date': formatedDate(subtask?.dueDate),
                    'Completed Date': formatedDate(data.completedDate) ??'      -',
                    'Reason': data.reason ?? '     -',
                    'Est.Time': subtask?.estimationTime,
                    'Est.Date': formatedDate(subtask?.estimationDate),
                    'Assigned to': assignedToFieldOne ,
                    'Task type': subtask?.subTaskType,
                    Category: subtask?.subTaskCategory,
                    Status: subtask?.subTaskStatus,
                    Stage: subtask?.subTaskStageName,
                };

                FinalDownloadDataTwo.push(subtaskData);
            }
        }   

        FinalDownloadDataTwo.push(projectData);
    }
}

      
        
  const data =[{}]
  const createDownLoadData = () => {
    handleExport().then((url) => {
      const downloadAnchorNode = document.createElement("a");
      downloadAnchorNode.setAttribute("href", url);
      downloadAnchorNode.setAttribute("download", `${userOneDetails?.User[0].firstName}  ${userOneDetails?.User[0].lastName} _ Report `);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    });
  };

  const workbook2blob = (workbook) => {
    const wopts = {
      bookType: "xlsx",
      bookSST: false,
      type: "binary",
    };

    const wbout = XLSX.write(workbook, wopts);

    // The application/octet-stream MIME type is used for unknown binary files.
    // It preserves the file contents, but requires the receiver to determine file type,
    // for example, from the filename extension.
    const blob = new Blob([s2ab(wbout)], {
      type: "application/octet-stream",
    });

    return blob;
  };

  const s2ab = (s) => {
    // The ArrayBuffer() constructor is used to create ArrayBuffer objects.
    // create an ArrayBuffer with a size in bytes
    const buf = new ArrayBuffer(s.length);


    //create a 8 bit integer array
    const view = new Uint8Array(buf);

    //charCodeAt The charCodeAt() method returns an integer between 0 and 65535 representing the UTF-16 code
    for (let i = 0; i !== s.length; ++i) {
      view[i] = s.charCodeAt(i);
    }

    return buf;
  };

  const handleExport = () => {
    const title = [{ A: "Summery for " + startDate + ' to  ' + endDate }];
   
  let table1 = [
    {
      A: "",
      B: "User Name",
      C: "Email",
      D:"Role",
      E:"Permission",
      F:"Project Count",
      G:"Task Count",
      H:"Performance",
    },
   
    // {
    //   A: "Project 2",
    //   B: "40",
    //   C: "25",
    // },
    // Add more rows for table1
  ];

  let table2 = [
    {
        A:"", 
        B:"Project Name",
        C: "Start Date",
        D: "End Date",
        E:"Assigned To",
        F:"Task Count",
        G:"Performance",
        H:"Status",
        I:"Client Name",
        J:"Company Name",
      K:"Reason",
      L:"Completed Date",
      M:'Manger',
      N:'Owner',
      O:'Project Code' ,
      P:'Currency Type' ,
      Q:'Actual Budget' ,
      R:'Plan Budget',
      S:'Created By',

      
    },
 
  
    // Add more rows for table2
  ];

  let table3 = [
    {
        A: '',
        B:'Project ',
        C:'Task ',
        D: 'Created At',
        E: 'Priority',
        F: 'Assigned to' ,
        G:'Due date',
        H:'Completed Date',
        I: 'Est.Date',
        J: 'Est.Time',
        K: 'Reason',
        L: 'Stage',
        M: 'Status',
        N: 'Task type',
        O:'Created By',
        // O:'Task type',
      // Add more columns as needed
    },
 
    // Add more rows for table3
  ];
  
  data.forEach((row) => {
    //   const studentDetails = row.STUDENT_DETAILS;
    //   const marksDetails = row.MARKS;

      table1.push({
        
     
            A: "",
            B: userDetails?.User[0]?.firstName === undefined ? ' ' : userDetails?.User[0]?.firstName ,
            C: userDetails?.User[0]?.email,
            D:userDetails?.User[0]?.role,
            E:userDetails?.User[0]?.permission,
            F:userDetails?.TotalProjects ,
            G:userDetails?.TotalTasks,
            H:userDetails?.progress + ' %' ,
    
      });

      projectDetails?.map(data=>{
        let managers = data.userAssigned
        ?.filter(function ({ role }) {
            return role === 'manager';
        })
        .map(data => data.firstName + ' ' + data.lastName)
        .join(', ');

    if (!managers) {
        managers = 'Not Assigned';
    }
    let owners = data.userAssigned
        ?.filter(function ({ role }) {
            return role === 'owner';
        })
        .map(data => data.firstName + ' ' + data.lastName)
        .join(', ');

    if (!owners) {
        owners = 'Not Assigned';
    }
    let members = data.userAssigned
        ?.filter(function ({ role }) {
            return role === 'member';
        })
        .map(data => data.firstName + ' ' + data.lastName)
        .join(', ');

    if (!members) {
        members = 'Not Assigned';
    }
    let createdBy = data?.projectCreatedBy.firstName + '  ' +data?.projectCreatedBy.lastName

        table2.push({
            
            
                A:" ", 
                B:data?.projectName ?? '    N/A',
                C: formatedDate(data?.startDate) ?? '    N/A',
                D: formatedDate(data?.endDate) ?? '    N/A',
                E:members ?? '    N/A',
                F:data?.TotalTaskCount ?? '   0',
                G:data?.progress === undefined ?  '0 %'  : data?.progress +'%',
                H:data?.status ?? '    N/A',
                I:data?.clientName ?? '    N/A',               
                J:data?.clientCompany ??'    N/A',
                K:data?.reason ?? '    N/A',
                L:data?.completedDate ?? '    N/A',
                M:managers ?? '    N/A',
                N:owners ?? '    N/A',
                O:data?.projectCode ?? '    N/A',
                P:data?.currencyType ?? '    N/A',
                Q:data?.currencyType  + " " +data?.actualBudget ?? '    N/A',
                R: data?.currencyType  + " " +data?.plannedBudget  ?? '    N/A',
                S:createdBy ?? '  N/A' ,
          
            })
       
        });
      });
      FinalDownloadDataTwo.map(data=>{
        const assignedToField = data?.assignedTo?.map(dataItem =>  `${dataItem.firstName} ${dataItem.lastName}`).join(', ') || ['Not Assigned'];
      table3.push({
            
        // A: ' ',
        // B:data?.Project ?? 'N/A',
        // C:data?.Task ?? 'N/A',
        // D: data['Created By'] ?? 'N/A',
        // E: data['Created At'] ?? 'N/A',
        // F: data?.Priority ?? 'N/A',
        // G:assignedToField ?? 'N/A',
        // H:formatedDate(data['Due date']) ?? 'N/A',
        // I: data['Completed Date'] ?? 'N/A',
        // J: data['Est.Date'] ?? 'N/A',
        // K: data['Est.Time'] ?? 'N/A',
        // L: data?.Reason ?? 'N/A',
        // M: data?.Stage ?? 'N/A',
        // N: data?.Status ?? 'N/A',
        // O: data['Task type'] ?? 'N/A',
         A: ' ',
        B:data?.Project ?? 'N/A',
        C:data?.Task ?? 'N/A',
        D: data['Created At'] ?? 'N/A',
        E: data['Priority']?? 'N/A',
        F:data['Assigned to'] ?? 'N/A',
        G:formatedDate(data['Due date']) ?? 'N/A',
        H: data['Completed Date'] ?? 'N/A',
        I: data['Est.Date'] ?? 'N/A',
        J: data['Est.Time'] ?? 'N/A',
        K: data['Reason'] ?? 'N/A',
        L: data['Stage'] ?? 'N/A',
        M: data['Status'] ?? 'N/A',
        N: data['Task type']?? 'N/A',
        O:data['Created By'] ?? 'N/A',

})
    });



  // Concatenate all the tables as before
  table1 = [
    { A: "Summary" },
    ...table1,
    "",
    { A: "Project Details" },
    ...table2,
    "",
    { A: "Task Details" },
    ...table3,
  
  ];


    const finalData = [...title, ...table1];

    //create a new workbook
    const wb = XLSX.utils.book_new();

    const sheet = XLSX.utils.json_to_sheet(finalData, {
      skipHeader: true,
    });

    XLSX.utils.book_append_sheet(wb, sheet, "Employee_report");

    // binary large object
    // Since blobs can store binary data, they can be used to store images or other multimedia files.

    const workbookBlob = workbook2blob(wb);

    var headerIndexes = [];
    finalData.forEach((data, index) =>
      data["A"] === "" ? headerIndexes.push(index) : null
    );

    const totalRecords = data.length;

    const dataInfo = {
      titleCell: "A2",
      titleRange: "A1:H2",
      tbodyRange: `A3:R${finalData.length}`,
      theadRange:
        headerIndexes?.length >= 1
          ? `A${headerIndexes[0] + 1}:H${headerIndexes[0] + 1}`
          : null,
      theadRange1:
        headerIndexes?.length >= 2
          ? `A${headerIndexes[1] + 1}:H${headerIndexes[1] + 1}`
          : null,
          theadRange2:
        headerIndexes?.length >= 3
          ? `A${headerIndexes[2] + 1}:S${headerIndexes[2] + 1}`
          : null,
          theadRange3:
          headerIndexes?.length >= 4
           ? `A${headerIndexes[3] + 1}:O${headerIndexes[3] + 1}`
            : null,
      tFirstColumnRange:
        headerIndexes?.length >= 1
          ? `A${headerIndexes[0] + 1}:A${totalRecords + headerIndexes[0] + 1}`
          : null,
      tLastColumnRange:
        headerIndexes?.length >= 1
          ? `G${headerIndexes[0] + 1}:G${totalRecords + headerIndexes[0] + 1}`
          : null,

      tFirstColumnRange1:
        headerIndexes?.length >= 1
          ? `A${headerIndexes[1] + 1}:A${totalRecords + headerIndexes[1] + 1}`
          : null,
      tLastColumnRange1:
        headerIndexes?.length >= 1
          ? `N${headerIndexes[0] + 1}:N${totalRecords + headerIndexes[1] + 1}`
          : null,
    };

    return addStyle(workbookBlob, dataInfo);
  };

  const addStyle = (workbookBlob, dataInfo) => {
    return XlsxPopulate.fromDataAsync(workbookBlob).then((workbook) => {
      workbook.sheets().forEach((sheet) => {
        sheet.usedRange().style({
          fontFamily: "Arial",
          verticalAlignment: "center",
        });

        sheet.column("A").width(15);
        sheet.column("B").width(15);
        sheet.column("C").width(45);
        sheet.column("D").width(45);
        sheet.column("E").width(45);
        sheet.column("F").width(15);
        sheet.column("G").width(45);
        sheet.column("H").width(15);
        sheet.column("I").width(15);
        sheet.column("J").width(15);
        sheet.column("K").width(15);
        sheet.column("L").width(15);
        sheet.column("M").width(15);
        sheet.column("N").width(45);
        sheet.column("O").width(45);
        sheet.column("P").width(45);
        sheet.column("Q").width(45);
        sheet.column("R").width(45);
        sheet.column("S").width(45);
      

        sheet.range(dataInfo.titleRange).merged(true).style({
          bold: true,
          horizontalAlignment: "center",
          verticalAlignment: "center",
        });

        if (dataInfo.tbodyRange) {
          sheet.range(dataInfo.tbodyRange).style({
            horizontalAlignment: "center",
            horizontalAlignment: "left",
          });
        }

        sheet.range(dataInfo.theadRange).style({
          fill: "FFFD04",
          bold: true,
          horizontalAlignment: "center",
        });

        if (dataInfo.theadRange1) {
          sheet.range(dataInfo.theadRange1).style({
            fill: "808080",
            bold: true,
            horizontalAlignment: "center",
            fontColor: "ffffff",
          });
        }
        if (dataInfo.theadRange2) {
            sheet.range(dataInfo.theadRange2).style({
              fill: "808080",
              bold: true,
              horizontalAlignment: "center",
              fontColor: "ffffff",
            });
          }
          if (dataInfo.theadRange3) {
            sheet.range(dataInfo.theadRange3).style({
              fill: "808080",
              bold: true,
              horizontalAlignment: "center",
              fontColor: "ffffff",
            });
          }

        if (dataInfo.tFirstColumnRange) {
          sheet.range(dataInfo.tFirstColumnRange).style({
            bold: true,
          });
        }

        if (dataInfo.tLastColumnRange) {
          sheet.range(dataInfo.tLastColumnRange).style({
            bold: true,
          });
        }

        if (dataInfo.tFirstColumnRange1) {
          sheet.range(dataInfo.tFirstColumnRange1).style({
            bold: true,
          });
        }

        if (dataInfo.tLastColumnRange1) {
          sheet.range(dataInfo.tLastColumnRange1).style({
            bold: true,
          });
        }
      });

      return workbook
        .outputAsync()
        .then((workbookBlob) => URL.createObjectURL(workbookBlob));
    });
}

    const GroupFilterDataOne = projectDetails?.map(item => {
        const { _id, ...rest } = item;
        return rest;
    });

    let FinalDownloadDataOne = GroupFilterDataOne?.map(data => {
        let managers = data.userAssigned
        ?.filter(function ({ role }) {
            return role === 'manager';
        })
        .map(data => data.firstName + ' ' + data.lastName)
        .join(', ');

    if (!managers) {
        managers = 'Not Assigned';
    }
    let owners = data.userAssigned
        ?.filter(function ({ role }) {
            return role === 'owner';
        })
        .map(data => data.firstName + ' ' + data.lastName)
        .join(', ');

    if (!owners) {
        owners = 'Not Assigned';
    }
    let members = data.userAssigned
        ?.filter(function ({ role }) {
            return role === 'member';
        })
        .map(data => data.firstName + ' ' + data.lastName)
        .join(', ');

    if (!members) {
        members = 'Not Assigned';
    }

    let createdBy = data?.projectCreatedBy.firstName + '  ' +data?.projectCreatedBy.lastName


        return {
            " Project Name ": data?.projectName,
            "Project Code": data?.projectCode,
            "Created By" : createdBy ,
            "Total Task Count ": data?.TotalTaskCount ?? '0',
            "Status": data?.status,
            "Completed Tasks": data?.CompletedTasks ?? '      -',
            "Performance": data?.progress === undefined ?  '0 %'  : data?.progress +'%',
            'Start Date': formatedDate (data?.startDate),
            'End Date': formatedDate (data?.endDate),
             "Assigned To" :members,
             'Client Name': data?.clientName ? data?.clientName : 'Not Assigned',
             'Client Company': data?.clientCompany ? data?.clientCompany : 'Not Assigned',
             "Reason": data?.reason ??   ' -- ',
             "Completed Date" :formatedDate(data?.completedDate )??   ' -- ',
             'Manger' :managers,
              'Owner':owners,
              'Currency Type' :data?.currencyType ,
              'Actual Budget':data?.currencyType  + " " + data?.actualBudget,
              'Planned Budget':data?.currencyType  + " " + data?.plannedBudget,
        }
    })
  

    // const generatePDFWithThreeTablesTwo = function (
    //     exportFileName: string,
    //     collection1: any,
    //     collection2: any,
      
    //   ) {
    //     try {
    //       const fileName = exportFileName + '.pdf';
    //       const customLetterDimensions = [416, 279];
    //       const doc = new JsPDF({
    //         orientation: 'portrait',
    //         unit: 'mm',
    //         format: customLetterDimensions,
    //       });
      
    //       const table1Title = "Project Details";
    //       const table2Title = "Task Details";
      
    //       // Set the top margin to add space
    //       //   const summaryTitle = "Summary Report";
    //       const summaryColumns = [
    //         // { key: summaryTitle },
    //         { key: 'Summary for ' + startDate + ' to ' + endDate },
    //         { key: "Employee Name",          value:   userDetails?.User[0]?.firstName === undefined ? ' ' : userDetails?.User[0]?.firstName },
    //         { key: "Email",       value: userDetails?.User[0]?.email,},
    //         { key: "Role",         value: userDetails?.User[0]?.role, },
    //         { key: "Total Projects", value:userDetails?.TotalProjects},
    //         { key: "Total Tasks",    value:userDetails?.TotalTasks},
    //         { key: "Permission",    value: userDetails?.User[0]?.permission, },
    //         { key: "Performance",    value: userDetails?.progress  + ' %', },
    //       ];
      
    //       const bodyData = summaryColumns.map((item, index) => {
    //         return {
    //           key: {
    //             content: item.key,
    //             styles: {
    //               fontStyle: index === 0 ? 'bold' : 'normal',
    //               textColor: index === 0 ? [255, 0, 0] : [0, 0, 0],
    //             },
    //           },
    //           value: item.value
    //         };
    //       });
      
    //       const topMargin = 20;
    //       doc.setProperties({ topMargin });
      
    //       const columnWidths = [40, 60, 80];
    //       autoTable(doc, {
    //         body: bodyData.map(item => [item.key, item.value]),
    //         margin: { horizontal: 5 },
    //         bodyStyles: { valign: 'middle' },
    //         styles: { fontSize: 7, overflow: 'linebreak', columnWidth: columnWidths },
    //         theme: 'grid',
    //     });
    //       // Generate the first table (collection1)
    //       var headerNames1 = Object.keys(collection1[0]);
    //       const tableData1 = collection1.map((item) =>
    //         headerNames1.map((key) => item[key])
    //       );
      
    //       // Generate the second page (table2) and add the title of the first table
    //       doc.addPage();
    //       doc.text(table1Title, 10, 10); // Add the title of the first table
    //       autoTable(doc, {
    //         head: [headerNames1],
    //         body: tableData1,
    //         margin: { horizontal: 5 },
    //         bodyStyles: { valign: 'middle' },
    //         styles: { fontSize: 7, overflow: 'linebreak', columnWidth: columnWidths },
    //         theme: 'grid',
    //       });
      
    //       // Add a new page for the second table (collection2)
    //       doc.addPage();
    //       doc.text(table2Title, 10, 10); // Add the title of the second table
    //       var headerNames2 = Object.keys(collection2[0]);
    //       const tableData2 = collection2.map((item) =>
    //         headerNames2.map((key) => item[key])
    //       );
    //       autoTable(doc, {
    //         head: [headerNames2],
    //         body: tableData2,
    //         margin: { horizontal: 5 },
    //         bodyStyles: { valign: 'middle' },
    //         styles: { fontSize: 7, overflow: 'linebreak', columnWidth: columnWidths },
    //         theme: 'grid',
    //       });
      
    //       // Add a new page for the third table (collection3)
    //     //   doc.addPage();
    //     //   doc.text(table3Title, 10, 10); // Add the title of the third table
    //     //   var headerNames3 = Object.keys(collection3[0]);
    //     //   const tableData3 = collection3.map((item) =>
    //     //     headerNames3.map((key) => item[key])
    //     //   );
      
    //     //   autoTable(doc, {
    //     //     head: [headerNames3],
    //     //     body: tableData3,
    //     //     margin: { horizontal: 5 },
    //     //     bodyStyles: { valign: 'middle' },
    //     //     styles: { fontSize: 7, overflow: 'linebreak', columnWidth: columnWidths },
    //     //     theme: 'grid',
    //     //   });
      
    //       // Save the PDF with all three tables
    //       doc.save(fileName);
    //       return false;
    //     } catch (error) {
    //         console.log(error,'error')
    //       toast({
    //         type: 'error',
    //         message: 'There is no data to download',
    //       });
    //     }
    //   };

    const generatePDFWithThreeTablesTwo = function (
        exportFileName: string,
        collection1: any,
        collection2: any
      ) {
        try {
          const fileName = exportFileName + '.pdf';
          const customLetterDimensions = [416, 279];
          const doc = new JsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: customLetterDimensions,
          });
      
          const table1Title = "Project Details";
          const table2Title = "Task Details";
      
          const summaryColumns = [
                    // { key: summaryTitle },
                    { key: 'Summary for ' + startDate + ' to ' + endDate },
                    { key: "Employee Name",          value:   userDetails?.User[0]?.firstName === undefined ? ' ' : userDetails?.User[0]?.firstName },
                    { key: "Email",       value: userDetails?.User[0]?.email,},
                    { key: "Role",         value: userDetails?.User[0]?.role, },
                    { key: "Total Projects", value:userDetails?.TotalProjects},
                    { key: "Total Tasks",    value:userDetails?.TotalTasks},
                    { key: "Permission",    value: userDetails?.User[0]?.permission, },
                    { key: "Performance",    value: userDetails?.progress  + ' %', },
                  ];
      
          const bodyData = summaryColumns.map((item, index) => {
            return {
              key: {
                content: item.key,
                styles: {
                  fontStyle: index === 0 ? 'bold' : 'normal',
                  textColor: index === 0 ? [255, 0, 0] : [0, 0, 0],
                },
              },
              value: item.value,
            };
          });
      
          const topMargin = 20;
          doc.setProperties({ topMargin });
      
          const columnWidths = [40, 60, 80];
          autoTable(doc, {
            body: bodyData.map((item) => [item.key, item.value]),
            margin: { horizontal: 5 },
            bodyStyles: { valign: 'middle' },
            styles: { fontSize: 7, overflow: 'linebreak', columnWidth: columnWidths },
            theme: 'grid',
          });
          if (collection1.length > 0 || collection2.length > 0) {
            if (collection1.length > 0) {
              var headerNames1 = Object.keys(collection1[0]);
              const tableData1 = collection1.map((item) =>
                headerNames1.map((key) => item[key])
              );
      
              doc.addPage();
              doc.text(table1Title, 10, 10);
              autoTable(doc, {
                head: [headerNames1],
                body: tableData1,
                margin: { horizontal: 5 },
                bodyStyles: { valign: 'middle' },
                styles: { fontSize: 7, overflow: 'linebreak', columnWidth: columnWidths },
                theme: 'grid',
              });
            }
      
            // Generate the second table (collection2) if it is not empty
            if (collection2.length > 0) {
              doc.addPage();
              doc.text(table2Title, 10, 10);
              var headerNames2 = Object.keys(collection2[0]);
              const tableData2 = collection2.map((item) =>
                headerNames2.map((key) => item[key])
              );
              autoTable(doc, {
                head: [headerNames2],
                body: tableData2,
                margin: { horizontal: 5 },
                bodyStyles: { valign: 'middle' },
                styles: { fontSize: 7, overflow: 'linebreak', columnWidth: columnWidths },
                theme: 'grid',
              });
            }
      
            doc.save(fileName);
          } else {
            toast({
              type: 'info',
              message: 'There is no data to download.',
            });
          }
          doc.save(fileName);
          return false;
        } catch (error) {
                    toast({
            type: 'error',
            message: 'There is no data to download',
          });
        }
      };
      




       
function formatToCustomDate(inputDate) {
    const originalDate = new Date(inputDate);
  
    const year = originalDate.getFullYear();
    const month = originalDate.getMonth() + 1; // Months are 0-based, so we add 1
    const day = originalDate.getDate();
  
    const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    return formattedDate;
  }

const startDate =formatToCustomDate(selectedRange[0].startDate)
const endDate = formatToCustomDate(selectedRange[0].endDate)



function makeHttpLinksClickable(description, maxURLLength = 20) {
    const urlRegex = /(https?:\/\/[^\s/$.?#].[^\s]*)/gi;
    const convertedDescription = description?.replace(urlRegex, (url) => {
        let truncatedURL = url;
        if (url.length > maxURLLength) {
            truncatedURL = url.substring(0, maxURLLength) + '...';
            const nextCharIndex = maxURLLength + 3;     
            if (nextCharIndex < url.length && url.charAt(nextCharIndex) !== ' ') {
                truncatedURL += ' ';
            }
        }
        return `<a href="${url}" target="_blank" style="color: blue">${truncatedURL}</a>`;
    });

    return convertedDescription;
}
    return (
        <>
            <div className='font-inter'>
                <div className='flex items-center justify-between my-2 mb-4 flex-wrap'>
                    <div className='mb-0 text-base text-lightTextColor cursor-pointer hover:text-brandBlue '>
                        <span className='flex items-center' 
                        onClick={event => {
                            router.push('/w-m/members/all');
                        }}><HiArrowNarrowLeft className='mr-2' /> Back to all members</span>
                    </div>
                    <div className='flex items-center gap-5 sm:flex-nowrap flex-wrap'>
                        {/* <button type="submit" className="small-button items-center py-2 flex h-9" onClick={() => setshowModaleditDetails(true)}>
                        {/* <button type="submit" className="small-button items-center py-2 flex h-9" onClick={() => setshowModaleditDetails(true)}>
                            <div className='flex items-center'>
                                <p className='m-0 p-0'>Edit</p>
                            </div>
                        </button> */}
                        <div className=' float-right'>
                            <Popover className="relative">
                                {({ open }) => (
                                    <>
                                        <Popover.Button
                                            className={`
                ${open ? '' : 'text-opacity-90'}
                 inline-flex gap-2 h-8 items-center small-button  `}
                                        >
                                            <span>Download</span>
                                            <ChevronDown
                                                className={`${open ? '' : 'text-opacity-70'}
                                                ml-2 h-5 w-5 text-orange-300 text-white transition duration-150 ease-in-out group-hover:text-opacity-80`}
                                                aria-hidden="true"
                                            />
                                        </Popover.Button>
                                        <Transition
                                            as={Fragment}
                                        //   enter="transition ease-out duration-200"
                                        //   enterFrom="opacity-0 translate-y-1"
                                        //   enterTo="opacity-100 translate-y-0"
                                        //   leave="transition ease-in duration-150"
                                        //   leaveFrom="opacity-100 translate-y-0"
                                        //   leaveTo="opacity-0 translate-y-1"
                                        >
                                            <Popover.Panel className={` absolute -left-8 z-10 mt-3 text-base max-w-sm px-2 sm:px-0 lg:max-w-3xl `}>
                                                <div className="py-3 px-2 w-[10rem] flex justify-center flex-col items-center bg-white rounded-lg shadow-lg">
                                                    <div className=' '>
                                                        <button onClick={handleOpenModal} className='flex justify-between gap-2 items-center py-1 bg-white hover:bg-slate-200 rounded px-4'>
                                                        <span><VscCalendar className=' text-xl'/></span>
                                                            Set Duration
                                                        </button>
                                                        <Modal
                                                            isOpen={isModalOpen}
                                                            onRequestClose={handleCloseModal}
                                                            // contentLabel="Date Picker Modal"
                                                            className=" relative flex justify-center items-center h-[100vh] rounded modal-bg "
                                                        >
                                                            {/* <h2>Date Picker Modal</h2> */}
                                                            <div className=' bg-white px-10 py-6 rounded-xl shadow-md shadow-black'>
                                                            <DateRangePicker
                                                                onChange={handleDateChange}
                                                                showSelectionPreview={true}
                                                                moveRangeOnFirstSelection={false}
                                                                months={2}
                                                                ranges={selectedRange}
                                                                direction="horizontal"
                                                                className=" rounded-xl"
                                                            />
                                                            <div className='flex justify-center gap-4'>
                                                            {/* <div>
                                                            <button className='  small-button h-9 flex items-center'>
                                                                Set
                                                            </button>
                                                            </div> */}
                                                            <div>
                                                            <button className='  small-button h-9 flex items-center' onClick={handleCloseModal}>
                                                                Done
                                                            </button>
                                                            </div>
                                                            <div>
                                                            <button onClick={handleCloseModal} className='px-4 py-1 rounded-full font-bold text-white hover:bg-red-600 bg-red-500 h-9 flex items-center '>
                                                                Cancel
                                                            </button>
                                                            </div>
                                                            </div>
                                                            </div>
                                                        </Modal>
                                                    </div>
                                                    {!isButtonDisabled ?(
                                                    <div className=" py-1 bg-white relative cursor-pointer">
                                                    <button className='gap-2 flex justify-between items-center rounded outline-none focus:hidden hover:bg-slate-200 px-4 py-1' onClick={createDownLoadData}>
                                                            <span><BsFiletypeCsv className=' text-xl'/></span>
                                                            Download CSV
                                                            </button>
                                                    </div>
                                                    ):null}
                                                    {!isButtonDisabled ?(
                                                    <div className=" py-1 bg-white ">
                                                    <button className='gap-2 flex justify-between items-center rounded outline-none focus:hidden hover:bg-slate-200 px-4 py-1' onClick={()=>generatePDFWithThreeTablesTwo( `${userOneDetails?.User[0].firstName}  ${userOneDetails?.User[0].lastName } _Report`,FinalDownloadDataOne , FinalDownloadDataTwo )}>
                                                            <span><BsFiletypePdf className=' text-xl'/></span>
                                                            Download PDF</button>
                                                    </div>
                                                        ):null}
                                                </div>
                                            </Popover.Panel>
                                        </Transition>
                                    </>
                                )}
                            </Popover>
                        </div>
                        {/* <button type="button" className="bg-white text-[#FF5959] rounded-lg justify-center items-center py-2 flex h-8 w-10">
                            <NewToolTip direction='bottom' message={"Delete"}><a href="#" className="red-link"><span className='text-xl text-redColor'><AiOutlineDelete /></span></a></NewToolTip>
                        </button> */}
                    </div>
                </div>
                <div className=' xs:p-4'>
                    <div className="lg:flex items-center">
                        <div className='flex items-center'>
                            <div className='members-details relative w-36'>
                                <img src={userOneDetails?.User[0]?.profilePic?? USER_AVTAR_URL+(userOneDetails ? userOneDetails?.User[0]?.firstName :'') + ' ' +(userOneDetails ? userOneDetails?.User[0]?.lastName:"")} className='w-36 h-32 rounded-lg' />
                                <span className="online absolute top-0 right-2" ></span>
                            </div>
                            <div className='ml-5 pr-5 lg:border-r-2 border-veryveryLightGrey'>
                                <h3 className='text-darkTextColor text-xl font-bold'> {userOneDetails && userOneDetails  !==undefined && userOneDetails !== null ? userOneDetails?.User[0]?.firstName + ' ' +userOneDetails?.User[0]?.lastName : ''}</h3>
                                <span className='text-placeholderGrey font-normal text-base'>{userOneDetails?.User[0]?.role}</span>
                                <div className="user-deatils mt-3">
                                    <p className='flex items-center text-defaultTextColor'><HiOutlineMail className='mr-1' /> {userOneDetails && userOneDetails  !==undefined && userOneDetails !== null ?  userOneDetails?.User[0]?.email :''}</p>
                                    {/* <p className='flex items-center mt-1 text-defaultTextColor'><HiOutlineLocationMarker className='mr-1' /> Bangalore, India</p> */}
                                </div>
                            </div>
                        </div>
                        <div className='w-full lg:pl-10'>
                            <div className="flex flex-row flex-wrap xs:mt-5 md:mt-5 lg:mt-0">
                                <div className='md:flex lg:basis-1/5 basis-1/2  flex-col items-center'>
                                    <p className='text-defaultTextColor'>Total projects</p>
                                    <span className='text-darkTextColor mt-1 text-2xl font-bold flex items-center'> <HiOutlineBriefcase className='mr-2 text-darkBlue font-normal font-base' />{projectCount}</span>
                                </div>
                                <div className='md:flex lg:basis-1/5 basis-1/2  flex-col items-center'>
                                    <p className='text-defaultTextColor'>Total Task</p>
                                    <span className='text-darkTextColor mt-1 text-2xl font-bold flex items-center'> <VscListSelection className='mr-2 text-darkBlue font-normal font-base' />{taskCount}</span>
                                </div>
                                <div className='md:flex lg:basis-1/5 basis-1/2 flex-col items-center'>
                                    <p className='text-defaultTextColor'>Total Subtask</p>
                                    <span className='text-darkTextColor mt-1 text-2xl font-bold flex items-center'> <GiSandsOfTime className='mr-2 text-darkBlue font-normal font-base' />{ userOneDetails && userOneDetails  !==undefined && userOneDetails !== null ?  userOneDetails?.TotalSubTasks :''}</span>
                                </div>
                                <div className='md:flex lg:basis-1/5 basis-1/2 flex-col items-center'>
                                    <p className='text-defaultTextColor'>Pending Task</p>
                                    <span className='text-darkTextColor mt-1 text-2xl font-bold flex items-center'> <AiOutlineDashboard className='mr-2 text-darkBlue font-normal font-base' />{userOneDetails && userOneDetails  !==undefined && userOneDetails !== null ?  userOneDetails?.PendingTasks :''}</span>
                                </div>
                                <div className='md:flex lg:basis-1/5 basis-1/2 flex-col items-center'>
                                    <p className='text-defaultTextColor'>Performance</p>
                                    <span className='text-darkTextColor mt-1 text-2xl font-bold flex items-center'> <VscGraphLine className='mr-2 text-darkBlue font-normal font-base' />{userOneDetails && userOneDetails  !==undefined && userOneDetails !== null ?  userOneDetails?.progress +'%':''}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>
                <div className='mt-5'>
                    {/* <TabsRender /> */}
                    <NoSsr>
                    <div className='bg-white rounded-xl px-7 py-4 w-full d-flex'>
                        <div className='flex justify-between items-center mt-4'>
                            <div className='flex'>
                                <p className='project-details flex items-center relative text-darkTextColor px-2 py-1'>
                                    <span className='mr-1'>
                                        <HiOutlineClipboardCheck />
                                    </span>
                                    Total Project<span className="absolute top-0 -right-3 inline-flex items-center justify-center mr-2 leading-none transform translate-x-1/2 -translate-y-1/2 bg-[#0685D7] text-indigo-100 text-sm text-center ml-2 px-2 py-1 rounded-full dark:bg-[#0685D7] border border-[#0685D7]">{projectCount ? projectCount : 0}</span>
                                </p>
                            </div>
                            {/* <div className='flex items-center'>
                                <p className='p-0 m-0 text-lightTextColor text-sm'>Show</p>
                                <select
                                    value={sortTable.limit}
                                    onChange={event => {
                                        setSortTable({ ...sortTable, limit: event.target.value ,pageNo: 1});
                                    }}
                                    className='border py-1  rounded-md outline-none w-15 h-8 text-xs px-2 mx-1'>
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={15}>15</option>
                                    <option value={20}>20</option>
                                    <option value={25}>25</option>
                                </select>
                                <p className='p-0 m-0 text-lightTextColor text-sm'>Entries</p>
                                
                            </div> */}
                        </div>
                        <div className='mt-4'>
                            <div className='relative overflow-x-auto shadow-md max-h-[calc(100vh-250px)] overflow-y-auto'>
                                <table className='table-style w-full'>
                                    <thead className='!border-b-0 sticky z-40 top-0'>
                                        <tr className='text-gray-700 uppercase bg-blue-300 border-0 dark:bg-gray-700 dark:text-gray-400'>
                                            <th scope='col' className='py-3 px-6 text-base w-[180px]'>
                                                <div className='flex items-center'>Project Name</div>
                                            </th>
                                            <th scope='col' className='py-3 px-6 text-base w-[400px]'>
                                                <div className='flex items-center'>Description</div>
                                            </th>
                                            <th scope='col' className='py-3 px-6 text-base w-[150px]'>
                                                <div className='flex items-center justify-center'>start Date</div>
                                            </th>
                                            <th scope='col' className='py-3 px-6 text-base w-[150px]'>
                                                <div className='flex items-center justify-center'>End Date</div>
                                            </th>
                                            <th scope='col' className='py-3 px-6 text-base w-[150px]'>
                                                <div className='flex items-center justify-center'>Owner</div>
                                            </th>
                                            <th scope='col' className='py-3 px-6 text-base w-[150px]'>
                                                <div className='flex items-center justify-center'>Manager</div>
                                            </th>
                                            <th scope='col' className='py-3 px-6 text-base w-[150px]'>
                                                <div className='flex justify-center'>Actual Budget</div>
                                            </th>
                                            <th scope='col' className='py-3 px-6 text-base w-[150px]'>
                                                <div className='flex items-center justify-center'>Plan budget</div>
                                            </th>
                                            <th scope='col' className='py-3 px-6 text-base w-[150px]'>
                                                <div className='flex items-center justify-center'>Tasks</div>
                                            </th>
                                            <th scope='col' className='py-3 px-6 text-base w-[150px]'>
                                                <div className='whitespace-nowrap flex justify-center text-ellipsis'>Assigned To</div>
                                            </th>
                                        </tr>
                                    </thead>
                                    {userProjectDetails && userProjectDetails.length === 0 && (
                                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <th
                                          colSpan={10}
                                          scope="row"
                                          className="col-span-3 text-center py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                        >
                                          No data
                                        </th>
                                      </tr>
                                    )}
                                    {!userProjectDetails && (
                                        <tr>
                                            <th colSpan={10} className='items-center'>
                                                <TinnySpinner />
                                            </th>
                                        </tr>
                                    )}
                                    <tbody className=''>
                                        {userProjectDetails &&
                                            userProjectDetails.map(function (project) {
                                                return (
                                                    <>
                                                        <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'>
                                                            <td scope='row' className='py-3 px-6 w-[180px] font-medium text-gray-900 break-words dark:text-white'>
                                                                {project.projectName}
                                                            </td>
                                                          <td className={'w-[400px] '}>
                                                            <div dangerouslySetInnerHTML={{ __html: makeHttpLinksClickable(project.description),  }} className="break-words" /> 
                                                            </td>
                                                            <td scope='row' className='py-3 px-6 font-medium w-[150px] text-gray-900 whitespace-nowrap dark:text-white'>
                                                                <div className="flex justify-center">
                                                                {formatedDate(project.startDate)}
                                                                </div>
                                                            </td>
                                                            <td scope='row' className='py-3 px-6 font-medium w-[150px] text-gray-900 whitespace-nowrap dark:text-white'>
                                                                <div className="flex justify-center">
                                                                {formatedDate(project.endDate)}
                                                                </div>
                                                            </td>
                                                            <td scope='row' className='py-3 px-6 font-medium w-[150px] text-gray-900 whitespace-nowrap dark:text-white'>
                                                                <div className='flex justify-center  -space-x-4'>
                                                                {filterOwner(project.userAssigned)?.length == 0 ? <>Not Assigned</>
                                                                :
                                                                <>
                                                                    {filterOwner(project.userAssigned)?.length <= 2 ?
                                                                        
                                                                            filterOwner(project.userAssigned).map((d) =>{
                                                                               return (
                                                                                    <ToolTip className='relative w-[30px] bg-white h-[30px] shadow-md rounded-full' message={d.firstName} key={d.firstName}>
                                                                                        <img
                                                                                            src={d.profilePic ?? USER_AVTAR_URL + d.firstName + ".svg"}
                                                                                            className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer w-full h-full p-1 w-10 h-10 rounded-full'
                                                                                            alt='-'
                                                                                        />
                                                                                    </ToolTip>
                                                                                )
                                                                            
                                                                            })
                                                                        
                                                                        : (
                                                                            <div className='flex items-center -space-x-4'>
                                                                                <div className='relative w-[30px] h-[30px] shadow-md rounded-full  flex flex-col items-center group'>
                                                                                    <img
                                                                                        className='bg-white absolute top-1/2 left-1/2 cursor-pointer -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 w-10 h-10 rounded-full'
                                                                                        src={ project.userAssigned === undefined ? [] : filterOwner(project.userAssigned)[0].profilePic ?? USER_AVTAR_URL + `${filterOwner(project.userAssigned)[0].firstName}.svg`}
                                                                                        alt=''
                                                                                    />
                                                                                </div>
                                                                                <div className='relative w-[30px] h-[30px] shadow-md rounded-full  flex flex-col items-center group' >
                                                                                    <img
                                                                                        className='bg-white cursor-pointer absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 w-10 h-10 rounded-full'
                                                                                        src={project.userAssigned === undefined ? [] : filterOwner(project.userAssigned)[1].profilePic ?? USER_AVTAR_URL + `${filterOwner(project.userAssigned)[1].firstName}.svg`}
                                                                                        alt=''
                                                                                    />
                                                                                </div>
                                                                                <MemberModal members={project.userAssigned ? filterOwner(project.userAssigned) : ""} remainingCount={filterOwner(project.userAssigned)?.length - 2} type={'member'}  />
                                                                            </div>
                                                                        )
                                                                    }
                                                                </>
                                                            }
                                                                </div>
                                                            </td>
                                                            <td scope='row' className='py-3 px-6 font-medium w-[150px] text-gray-900 whitespace-nowrap dark:text-white'>
                                                                <div className='flex justify-center -space-x-4'>
                                                                {filterManager(project.userAssigned)?.length == 0 ? <>Not Assigned</>
                                                                : 
                                                                <>
                                                                    {filterManager(project.userAssigned)?.length <= 2 ?
                                                                        (filterManager(project.userAssigned)?.map((d) =>{
                                                                            return (
                                                                                <ToolTip className='relative w-[30px] bg-white h-[30px] shadow-md rounded-full' message={d.firstName} key={d.firstName}>
                                                                                    <img
                                                                                        src={d.profilePic ?? USER_AVTAR_URL + d.firstName + ".svg"}
                                                                                        className='absolute cursor-pointer top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 w-10 h-10 rounded-full'
                                                                                        alt='-'
                                                                                    />
                                                                                </ToolTip>
                                                                            )
                                                                        }))
                                                                        : (
                                                                            <div className='flex items-center -space-x-4'>
                                                                                <div className='relative w-[30px] h-[30px] shadow-md rounded-full  flex flex-col items-center group'>
                                                                                    <img
                                                                                        className='bg-white cursor-pointer absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 w-10 h-10 rounded-full'
                                                                                        src={ project.userAssigned === undefined ? [] : filterManager(project.userAssigned)[0].profilePic ?? USER_AVTAR_URL + `${filterManager(project.userAssigned)[0].firstName}.svg`}
                                                                                        alt=''
                                                                                    />
                                                                                </div>
                                                                                <div className='relative w-[30px] h-[30px] shadow-md rounded-full  flex flex-col items-center group' >
                                                                                    <img
                                                                                        className='bg-white absolute cursor-pointer top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 w-10 h-10 rounded-full'
                                                                                        src={project.userAssigned === undefined ? [] : filterManager(project.userAssigned)[1].profilePic ?? USER_AVTAR_URL + `${filterManager(project.userAssigned)[1].firstName}.svg`}
                                                                                        alt=''
                                                                                    />
                                                                                </div>
                                                                                <MemberModal members={project.userAssigned ? filterManager(project.userAssigned) : ""} remainingCount={filterManager(project.userAssigned)?.length - 2} type={'member'} />
                                                                            </div>
                                                                        )
                                                                    }
                                                                </>
                                                            }
                                                                </div>
                                                            </td>
                                                            <td scope='row' className='py-3 px-6 font-medium w-[150px] text-gray-900 whitespace-nowrap dark:text-white'>
                                                                <div className='flex justify-center'>
                                                                {project.actualBudget} {project.currencyType}
                                                                </div>
                                                            </td>
                                                            <td scope='row' className='py-3 px-6 font-medium w-[150px] text-gray-900 whitespace-nowrap dark:text-white'>
                                                                <div className='flex justify-center'>
                                                                {project.plannedBudget} {project.currencyType}
                                                                </div>
                                                            </td>
                                                            <td scope='row' className='py-3 px-6 font-medium w-[150px] text-gray-900 whitespace-nowrap dark:text-white'>
                                                            <div className=' flex justify-center'>
                                                                <label className='bg-blue-700 text-white text-center rounded overflow-hidden w-1/2 text-ellipsis whitespace-nowrap'>
                                                                    {project.taskCount ? project.taskCount : 0}
                                                                </label>
                                                            </div>
                                                            </td>
                                                            <td scope='row' className='py-3 px-6 font-medium w-[150px] text-gray-900 whitespace-nowrap dark:text-white'>
                                                                <div className='flex justify-center -space-x-4'>
                                                                {filterMembers(project.userAssigned)?.length == 0 && <>Not Assigned</>}
                                                                {filterMembers(project.userAssigned)?.length <= 2 ? (
                                                                    filterMembers(project.userAssigned).map(function (d1) {
                                                                        return d1 ? (
                                                                            <ToolTip className='relative w-[30px] h-[30px] shadow-md rounded-full' message={d1.firstName + ' ' + d1.lastName}>
                                                                                <img
                                                                                    src={project.profilePic ?? USER_AVTAR_URL + d1.firstName + ".svg"}
                                                                                    className='bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 w-10 h-10 rounded-full'
                                                                                    alt='-'
                                                                                />
                                                                            </ToolTip>
                                                                        ) : (
                                                                            ' '
                                                                        );
                                                                    })
                                                                    ) : (
                                                                        <div className='flex justify-center items-center -space-x-4'>
                                                                            <div className='relative w-[30px] h-[30px] shadow-md rounded-full  flex flex-col items-center group'>
                                                                                <img
                                                                                    className='bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 w-10 h-10 rounded-full'
                                                                                    src={ filterMembers(project.userAssigned) === undefined ? [] : filterMembers(project.userAssigned)[0].profilePic ?? USER_AVTAR_URL + `${filterMembers(project.userAssigned)[0].firstName}.svg`}
                                                                                    alt=''
                                                                                />
                                                                            </div>
                                                                            <div className='relative w-[30px] h-[30px] shadow-md rounded-full  flex flex-col items-center group' >
                                                                                <img
                                                                                    className='bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 w-10 h-10 rounded-full'
                                                                                    src={filterMembers(project.userAssigned) === undefined ? [] : filterMembers(project.userAssigned)[1].profilePic ?? USER_AVTAR_URL + `${filterMembers(project.userAssigned)[1].firstName}.svg`}
                                                                                    alt=''
                                                                                />
                                                                            </div>
                                                                            <MemberModal members={project.userAssigned ? filterMembers(project.userAssigned) : ""} remainingCount={filterMembers(project.userAssigned)?.length - 2} type={'member'} />
                                                                        </div>
                                                                )}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </>
                                                );
                                            })}
                                    </tbody>
                                </table>
                            </div>
                            {/* {userProjectDetails && userProjectDetails.length != 0 && (
                                <div className='flex justify-between items-center'>
                                    <p className='p-0 m-0 text-lightTextColor text-xs sm:my-4 my-2'>
                                        Showing {sortTable.limit * (sortTable.pageNo - 1) + 1} to{' '}
                                        {sortTable.limit * sortTable.pageNo < projectCount ? sortTable.limit * sortTable.pageNo : projectCount} of {projectCount}{' '}
                                    </p>
                                    <div className='flex items-center '>
                                        <button
                                            disabled={sortTable.pageNo == 1}
                                            onClick={() => {
                                                setSortTable({ ...sortTable, pageNo: sortTable.pageNo - 1 });
                                                // handlePaginationProject('?skip=' + ((sortTable.limit*sortTable.pageNo)-(sortTable.limit*2)) + '&limit=' + sortTable.limit);
                                            }}
                                            className='disabled:opacity-25  disabled:cursor-not-allowed  arrow_left border mx-1 bg-veryveryLightGrey cursor-pointer hover:bg-defaultTextColor hover:text-white'>
                                            <MdKeyboardArrowLeft />
                                        </button>
                                        <div className='pages'>
                                            <p className='p-0 m-0 text-lightTextColor text-xs sm:my-4 my-2'>
                                                Page <span>{sortTable.pageNo}</span>
                                            </p>
                                        </div>
                                        <button
                                            disabled={sortTable.pageNo === Math.ceil(projectCount / sortTable.limit)}
                                            onClick={() => {
                                                setSortTable({ ...sortTable, pageNo: sortTable.pageNo + 1, skip: sortTable.pageNo * sortTable.limit });
                                                // handlePaginationProject('?skip=' + sortTable.limit*sortTable.pageNo + '&limit=' + sortTable.limit);
                                            }}
                                            className='disabled:cursor-not-allowed  arrow_right border mx-1 bg-veryveryLightGrey cursor-pointer hover:bg-defaultTextColor hover:text-white'>
                                            <MdKeyboardArrowRight />
                                        </button>
                                    </div>
                                </div>
                            )} */}
                        </div>
                    </div>

                    <div className="py-6 rounded bg-white p-7 w-full d-flex">
                        <div className="flex justify-between items-center">
                        {/* <h3 className="heading-medium">Task Xl</h3> */}
                        {/* <div className="flex items-center">
                            <p className="p-0 m-0 text-lightTextColor text-sm">Show</p>
                            <select
                            value={sortTable.limit}
                            onChange={event => {
                                setSortTable({...sortTable, limit: event.target.value});
                            }}
                            className="border py-1  rounded-md outline-none w-15 h-8 text-[15px] px-2 mx-1"
                            >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={15}>15</option>
                            <option value={20}>20</option>
                            <option value={25}>25</option>
                            </select>
                            <p className="p-0 m-0 text-lightTextColor text-[15px]">
                            Entries
                            </p>
                        </div> */}
                        </div>
                        <div className="flex justify-between items-center mt-4">
                        <div className="flex">
                            <p className="project-details flex items-center relative text-darkTextColor px-2 py-1">
                            <span className="mr-1">
                                <HiOutlineClipboardCheck />
                            </span>
                            Total Task<span className="absolute top-0 -right-3 inline-flex items-center justify-center mr-2 leading-none transform translate-x-1/2 -translate-y-1/2 bg-[#0685D7] text-indigo-100 text-sm text-center ml-2 px-2 py-1 rounded-full dark:bg-[#0685D7] border border-[#0685D7]">{taskCount ? taskCount : 0}</span>
                            </p>
                        </div>
                        {/* <div className="wrapper relative">
                            <SearchInput
                            onChange={handleSearchTask}
                            placeholder={'Search a task'}
                            />
                        </div> */}
                        </div>
                        <div className="mt-4">
                        <div className="overflow-x-auto relative shadow-md max-h-[calc(100vh-256px)] overflow-y-auto">
                            <table className="table-style w-full">
                            <thead className="!border-b-0 sticky top-0 z-40">
                                <tr className='text-gray-700 uppercase bg-blue-300 border-0 dark:bg-gray-700 dark:text-gray-400'>
                                <th scope='col' className='py-3 px-6 text-base w-[180px]'>
                                    <div className="flex items-center">Project</div>
                                </th>
                                <th scope="col" className="py-3 px-6 text-base w-[180px]">
                                    <div className="flex items-center">Task</div>
                                </th>
                                <th scope="col" className="py-3 px-6 text-base w-[150px]">
                                    <div className="flex items-center justify-center">Created By</div>
                                </th>
                                <th scope="col" className="py-3 px-6 text-base w-[150px]">
                                    <div className="flex items-center justify-center">Due date</div>
                                </th>
                                <th scope="col" className="py-3 px-6 text-base w-[150px]">
                                    <div className="flex items-center justify-center">
                                    Assigned to
                                    </div>
                                </th>
                                {/* <th scope="col" className="py-3 px-6 text-base w-[150px]">
                                    <div className="flex items-center justify-center">Task type</div>
                                </th> */}
                                <th scope="col" className="py-3 px-6 text-base w-[150px]">
                                    <div className="flex items-center justify-center">Completed Date</div>
                                </th>
                                <th scope="col" className="py-3 px-6 text-base w-[150px]">
                                    <div className="flex items-center justify-center">Reason</div>
                                </th>
                                <th scope="col" className="py-3 px-6 text-base w-[150px]">
                                    <div className="flex items-center justify-center">Status</div>
                                </th>
                                <th scope="col" className="py-3 px-6 text-base w-[150px]">
                                    <div className="flex items-center justify-center">Priority</div>
                                </th>
                                </tr>
                            </thead>
                            <tbody className=''>
                                {userTaskDetails && userTaskDetails?.length === 0 && (
                                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <th
                                    colSpan={10}
                                    scope="row"
                                    className="col-span-3 text-center py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                    >
                                    No data
                                    </th>
                                </tr>
                                )}
                                {!userTaskDetails && (
                                <tr>
                                    <th colSpan={10}>
                                    <TinnySpinner />
                                    </th>
                                </tr>
                                )}

                                {userTaskDetails &&
                                userTaskDetails?.map(function (data) {
                                    return (
                                    <>
                                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <td
                                            scope="row"
                                            className="py-3 px-6 font-medium break-words text-gray-900 w-[180px] dark:text-white"
                                        >
                                            {data.projectName
                                            ? data.projectName
                                            : 'Not Assigned'}
                                        </td>
                                        <td
                                            scope="row"
                                            className="py-4 px-6 font-medium w-[180px] text-gray-900 dark:text-white"
                                        >
                                            <span
                                            className='overflow-hidden text-ellipsis break-words'
                                            >
                                            {data.taskTitle}
                                            </span>
                                        </td>
                                        <td className='w-[150px]'>
                                            <div className='flex justify-center'>


                                            <ToolTip
                                            className="relative w-[30px] h-[30px] bg-white shadow-md rounded-full"
                                            message={data.taskCreator.firstName}
                                            >
                                            <img
                                                src={data.taskCreator.profilePic ??
                                                USER_AVTAR_URL +
                                                data.taskCreator.firstName +
                                                '.svg'
                                                }
                                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 rounded-full"
                                                alt="-"
                                            />
                                            </ToolTip>
                                            </div>
                                        </td>
                                        <td className='w-[150px]'
                                        >
                                            <div className=' flex justify-center'>

                                            {formatedDate(data.dueDate)}
                                            </div>
                                        </td>
                                        <td
                                            scope="row"
                                            className="py-3 px-6 font-medium w-[150px] text-gray-900 whitespace-nowrap dark:text-white"
                                        >
                                            <div className="user-profile-img flex justify-center user-img-group items-center cursor-pointer -space-x-4">
                                            {(data?.assignedTo).length == 0 && <>Not Assigned</>}
                                            {(data?.assignedTo)?.length <= 2 ? (
                                                (data?.assignedTo).map(function (d1) {
                                                                                                        return (
                                                        <ToolTip className='relative w-[30px] h-[30px] shadow-md rounded-full' message={d1?.firstName + ' ' + d1?.lastName}>
                                                                                                                        <img
                                                                src={d1.profilePic }
                                                                className='bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 w-10 h-10 rounded-full'
                                                                alt='-'
                                                            />
                                                        </ToolTip>
                                                                                                          )
                                                })
                                                ) : (
                                                    <div className='flex items-center -space-x-4'>
                                                        <div className='relative w-[30px] h-[30px] shadow-md rounded-full  flex flex-col items-center group'>
                                                            <img
                                                                className='bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 w-10 h-10 rounded-full'
                                                                src={ (data.assignedTo) === undefined ? [] : (data.assignedTo)[0].profilePic ?? USER_AVTAR_URL + `${filterMembers(data.assignedTo)[0].firstName}.svg`}
                                                                alt=''
                                                            />
                                                        </div>
                                                        <div className='relative w-[30px] h-[30px] shadow-md rounded-full  flex flex-col items-center group' >
                                                            <img
                                                                className='bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 w-10 h-10 rounded-full'
                                                                src={(data.assignedTo) === undefined ? [] : (data.assignedTo)[1].profilePic ?? `${generateDicebearUrl(filterMembers(data.assignedTo)[1].firstName ,filterMembers(data.assignedTo)[1].lastName)}`}
                                                                alt=''
                                                            />
                                                        </div>
                                                        <MemberModal members={data.assignedTo ? (data.assignedTo) : ""} remainingCount={(data.assignedTo)?.length - 2} type={'member'}  />
                                                    </div>
                                            )}
                                            </div>
                                        </td>
                                        {/* <td
                                            scope="row"
                                            className="py-3 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                        > */}
                                        {/* <div className='flex justify-center'>
                                            {data.taskType}
                                        </div> */}
                                        {/* </td> */}
                                        <td
                                            scope="row"
                                            className="py-3 px-6 font-medium w-[150px]  text-gray-900 whitespace-nowrap dark:text-white"
                                        >
                                        <div className='flex justify-center'>
                                            {formatedDate(data.completedDate) ?? '     -'}
                                        </div>
                                        </td>
                                        <td
                                            scope="row"
                                            className="py-3 px-6 font-medium w-[150px]  text-gray-900 whitespace-nowrap dark:text-white"
                                        >
                                        <div className='flex justify-center'>
                                            {data.reason ?? '          -'}
                                        </div>
                                        </td>
                                        <td
                                            scope="row"
                                            className="py-3 px-6 font-medium w-[150px]  text-gray-900 whitespace-nowrap dark:text-white"
                                        >
                                        <div className='flex justify-center'>
                                            {data.taskStatus}
                                        </div>
                                        </td>
                                        <td
                                            scope="row"
                                            className="py-3 px-6 font-medium w-[150px] text-sm text-gray-900 whitespace-nowrap dark:text-white"
                                        >
                                            <b className=' flex justify-center'>
                                            {data.priority === 'High' ? (
                                                <ToolTip message={data.priority}>
                                                <p className="priority-with-bg text-priority1Color bg-priority1bg">
                                                    {data.priority}
                                                </p>
                                                </ToolTip>
                                            ) : data.priority === 'Medium' ? (
                                                <ToolTip message={data.priority}>
                                                <p className="priority-with-bg text-priority2Color bg-priority2bg">
                                                    {data.priority}
                                                </p>
                                                </ToolTip>
                                            ) : (
                                                <ToolTip message={data.priority}>
                                                <p className="priority-with-bg text-priority3Color bg-priority3bg">
                                                    {data.priority}
                                                </p>
                                                </ToolTip>
                                            )}
                                            </b>
                                        </td>
                                        </tr>
                                    </>
                                    );
                                })}
                            </tbody>
                            </table>
                        </div>

                        {/* {taskDetails && taskDetails?.length != 0 && (
                            <div className="flex justify-between items-center">
                            <p className="p-0 m-0 text-lightTextColor text-xs sm:my-4 my-2">
                                Showing {sortTable.limit * (sortTable.pageNo - 1) + 1} to{' '}
                                {sortTable.limit * sortTable.pageNo < taskCount
                                ? sortTable.limit * sortTable.pageNo
                                : taskCount}{' '}
                                of {taskCount}{' '}
                            </p>
                            <div className="flex items-center ">
                                <button
                                disabled={sortTable.pageNo == 1}
                                onClick={() => {
                                    setSortTable({
                                    ...sortTable,
                                    pageNo: sortTable.pageNo - 1,
                                    });
                                    handlePaginationTasks(
                                    '?skip=' + 0 + '&limit=' + sortTable.limit
                                    );
                                }}
                                className="disabled:opacity-25  disabled:cursor-not-allowed  arrow_left border mx-1 bg-veryveryLightGrey cursor-pointer hover:bg-defaultTextColor hover:text-white"
                                >
                                <MdKeyboardArrowLeft />
                                </button>
                                <div className="pages">
                                <p className="p-0 m-0 text-lightTextColor text-xs sm:my-4 my-2">
                                    Page <span>{sortTable.pageNo}</span>
                                </p>
                                </div>
                                <button
                                disabled={
                                    sortTable.pageNo ===
                                    Math.ceil(taskCount / sortTable.limit)
                                }
                                onClick={() => {
                                    setSortTable({
                                    ...sortTable,
                                    pageNo: sortTable.pageNo + 1,
                                    skip: sortTable.pageNo * sortTable.limit,
                                    });
                                    handlePaginationTasks(
                                    '?skip=' + sortTable.skip + '&limit=' + sortTable.limit
                                    );
                                }}
                                className="disabled:cursor-not-allowed  arrow_right border mx-1 bg-veryveryLightGrey cursor-pointer hover:bg-defaultTextColor hover:text-white"
                                >
                                <MdKeyboardArrowRight />
                                </button>
                            </div>
                            </div>
                        )} */}
                        </div>
                    </div>
                    </NoSsr>
                </div>
            </div>            
        </>
    )
}
export default index;