import { VscEdit } from 'react-icons/vsc';
import { AiOutlineDelete } from 'react-icons/ai';
import { AiFillDelete } from 'react-icons/ai';
import { FiEdit2 } from 'react-icons/fi';
import NewToolTip from '@COMPONENTS/NewToolTip';
import TinnySpinner from '@COMPONENTS/TinnySpinner';
import { ToolTip } from '@COMPONENTS/ToolTip';
import { USER_AVTAR_URL } from '@HELPER/avtar';
import React, { useEffect, useState,useRef } from 'react';
import { getClientComapny, getClientDetails } from '../api/get';
import { isRequiredErrorMessage } from '@HELPER/exportData';
import AddOrEditClient from './addOrEditClient';
import AddClientNames from './addClientsNames';
import DeleteConformation from '@COMPONENTS/DeleteConformation';
import { deleteClientById ,deleteCompanyById} from '../api/delete';
import toast from '../../../../components/Toster/index';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import { download_data } from '@HELPER/exportData';
import DropDown from '../../../../components/DropDown';
import { BsDownload, BsThreeDotsVertical } from 'react-icons/bs';
import { BiSearch } from 'react-icons/bi';
import { RiCloseLine } from 'react-icons/ri';
import { editClientCompany } from '../api/put';
import MemberModal from '@COMPONENTS/MemberModal';
import { downloadFiles } from '@HELPER/download';
import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import JsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import InfiniteScroller from '@COMPONENTS/InfiniteScroller';
const client = ({ startLoading, stopLoading }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [sortTable, setSortTable] = useState({
        skip: 10,
        limit: 10,
        pageNo: 1,
    });
    const companyTableList = [
        { name: 'Company Name', value: 'clientCompany', sort: null },
        { name: 'Client', value: 'client', sort: null },
    ];
    const [clientDetails, setClientDetails] = useState([]);
    const [companyDetails,setCompanyDetails] = useState([])
    const [clientCompanyCount, setClientCompanyCount] = useState(null);
    const [deleteClientId, setDeleteClientId] = useState(null);
    const [deleteMessage, setDeleteMessage] = useState(null);
    const [openDeleteModel, setOpenDeleteModel] = useState(false);
    const [allClients ,setClients ]= useState([])
    const [types,setType] = useState('');
    const [totalClientCount,setTotalClientCount] = useState(0)
    const [companyClientDownload,setCompanyClientDownload] = useState([])

    

    useEffect(() => {
        handleGetAllComapnyClient('?limit=' + 10);
        handleGetAllComapnyClients('?limit=' + sortTable.limit)
    }, [sortTable.limit]);

    const handleGetAllComapnyClients = (condition = '') => {
        getClientDetails(condition)
            .then(response => {

                if (response.data.body.status === 'success') {
                    setCompanyDetails(response?.data.body.data.companyDetail);
                    setClientCompanyCount(response?.data.body.data.totalClientCount);
                } else {
                    toast({
                        type: 'error',
                        message: response ? response.data.body.message : 'Try again !',
                    });
                }
            })
            .catch(function (e) {
                stopLoading();
                toast({
                    type: 'error',
                    message: e.response ? e.response.data.body.message : 'Something went wrong, Try again !',
                });
            });
    };
    const handleGetAllComapnyClient = (condition = '', types) => {
        getClientComapny(condition)
          .then((response) => {
            if (response.data.body.status === 'success') {
              if (types === 'edit' || types === 'delete') {
                setClientDetails(response.data.body.data.clientDetail);
              } else {
                setClientDetails((prevClientDetails) => [
                  ...prevClientDetails,
                  ...response.data.body.data.clientDetail,
                ]);
              }
              setTotalClientCount(response.data.body.data.totalClientCount);
            } else {
              toast({
                type: 'error',
                message: response ? response.data.body.message : 'Try again!',
              });
            }
          })
          .catch(function (e) {
            stopLoading();
            toast({
              type: 'error',
              message: e.response ? e.response.data.body.message : 'Something went wrong, Try again!',
            });
          });
      };
      

    const handleDeleteCliengtById = () => {
        deleteCompanyById(deleteClientId)
            .then(function (result) {
                stopLoading();
                if (result.data.body.status == 'success') {
                    setClientDetails([]);
                    handleGetAllComapnyClient('?limit=' + 10);
                    handleGetAllComapnyClients()
                    toast({
                        type: 'success',
                        message: result ? result.data.body.message : 'Try again !',
                    });
                } else {
                    toast({
                        type: 'error',
                        message: result ? result.data.body.message : 'Error',
                    });
                }
            })
            .catch(function (e) {
                stopLoading();
                toast({
                    type: 'error',
                    message: e.response ? e.response.data.body.message : 'Something went wrong, Try again !',
                });
            });
        setOpenDeleteModel(false);
    };

    const handlePaginationclient = condition => {
        // handleGetAllComapnyClient(condition);
        handleGetAllComapnyClients(condition)
    };
    const handleGetAllComapnyClientsDownload = (condition = '') => {
        getClientDetails(condition)
            .then(response => {

                if (response.data.body.status === 'success') {
                    setCompanyClientDownload(response?.data.body.data.companyDetail)
                } else {
                    toast({
                        type: 'error',
                        message: response ? response.data.body.message : 'Try again !',
                    });
                }
            })
            .catch(function (e) {
                stopLoading();
                toast({
                    type: 'error',
                    message: e.response ? e.response.data.body.message : 'Something went wrong, Try again !',
                });
            });
    };
    useEffect(()=>{
        if(clientCompanyCount){
        handleGetAllComapnyClientsDownload('?limit=' + clientCompanyCount)
        }
    },[clientCompanyCount])
    const GroupFilterData = companyClientDownload?.map(item => {
        const { createdAt, _id, __v, projectIds, orgId,updatedAt,  ...rest } = item;
        return rest;
    });

    let FinalDownloadData = GroupFilterData?.map(data => {
        return {
            ' Company Name ': data.clientCompany ,
            'Client': (data.clientName) && data.clientName.length > 0 ? data.clientName.map(company => company.clientName).join(', '): 'Not Assigned',
        };
    });
    const [open, setOpen] = useState(false);
    const openMOdule = () => {
        setOpen(true);
    };
    const handleDelete = id => {
        deleteClientById(id)
            .then(function (result) {
                stopLoading();
                if (result.data.body.status == 'success') {
                    handleGetAllComapnyClient('?limit=' + 10,"delete");
                    handleGetAllComapnyClients()
                    toast({
                        type: 'success',
                        message: result ? result.data.body.message : 'Try again !',
                    });
                } else {
                    toast({
                        type: 'error',
                        message: result ? result.data.body.message : 'Error',
                    });
                }
            })
            .catch(function (e) {
                stopLoading();
                toast({
                    type: 'error',
                    message: e.response ? e.response.data.body.message : 'Something went wrong, Try again !',
                });
            });
    };

    let [inputValue, setInputValue] = useState(null);
    const handleInputChange = event => {
        setInputValue(event.target.value);
    };
    const handleEdit = id => {
        if (inputValue !== null) {
            editClientCompany(id, { clientName: `${inputValue}` })
                .then(function (result) {
                    if (result.data.body.status == 'success') {
                        // setShowModal(false)
                        toast({
                            type: 'success',
                            message: result ? result.data.body.message : 'Try again !',
                           });
                           handleGetAllComapnyClient('?limit=' + 10,'edit');
                            handleGetAllComapnyClients()
                        // setFormState(initialState);
                    } else {
                        toast({
                            type: 'error',
                            message: result ? result.data.body.message : 'Error',
                        });
                    }
                })
                .catch(function ({ response }) {
                    toast({
                        type: 'error',
                        message: response ? response.data.body.error : 'Something went wrong, Try again !',
                    });
                });
        }
    };

    const download_data = [
        {
            text: 'Download CSV file',
            value: 'excel',
            onClick: () => {
                if (companyDetails.length === 0) {
                    toast({
                        type: 'error',
                        message: 'Please add data before downloading.',
                    });
                } else {
                    downloadClientForBothCsvPdf('excel', 'Clients',FinalDownloadData );
                }
            },
        },
        {
            text: 'Download PDF file',
            value: 'pdf',
            onClick: () => {
                if (companyDetails.length === 0) {
                    toast({
                        type: 'error',
                        message: 'Please add data before downloading.',
                    });
                } else {
                    downloadClientForBothCsvPdf('pdf', 'Clients', FinalDownloadData);
                }
            },
        },
    ];

    const downloadClientForBothCsvPdf =(type: string, exportFileName: string, collection: any)=>{
        if (type === 'excel') {
            const fileName = exportFileName + '.csv';
            const ws = XLSX.utils.json_to_sheet(collection);
            const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
            const excelBuffer = XLSX.write(wb, { bookType: 'csv', type: 'array' });
            const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
            const data = new Blob([excelBuffer], { type: fileType });
            FileSaver.saveAs(data, fileName);
        }
        if (type === 'pdf') {
            var headerNames = Object.keys(collection[0]);
            const tableData = collection.map(item =>
                headerNames.map(key => item[key])
              );
            const fileName = exportFileName + '.pdf';
            const customLetterDimensions = [416, 279]; // Width x Height in mm
            const doc = new JsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: customLetterDimensions
            });
            const columnWidths = [40, 60, 80];
            autoTable(doc, {
                head: [headerNames],
                body: tableData,
                margin: { horizontal: 5 },
                bodyStyles: { valign: 'middle' },
                styles: { fontSize: 7, overflow: 'linebreak', columnWidth: columnWidths },
                theme: 'grid',
            });
            doc.save(fileName);
            return false;
        }
    }

    const handleGetAllClients = (condition = '') => {
        getClientComapny(condition).then(response => {
            if (response.data.body.status === "success") {
                setClients(
                    response?.data?.body?.data?.clientDetail?.map(data => {
                        return { id: data?._id, key: data?.clientName, value: data };
                    })
                );
            }
            else if  (response.data.body.status === 'failed'){
                setClients([])
            }
        });
    };


    const containerRef1 = useRef();
    InfiniteScroller(handleGetAllComapnyClient, clientDetails, totalClientCount, containerRef1);
  


// const containerRef2 = useRef();
// useInfiniteScroll(fetchMoreData, clientDetails, totalClientCount, containerRef2);


    
    return (
        <>
            <div className='font-inter'>
                <div className='flex items-center justify-between my-2 mb-4 flex-wrap'>
                    <div className='heading-big relative font-bold mb-0 heading-big text-darkTextColor px-2 py-1 '>
                        Company and Client
                        <span className='absolute top-0 -right-3 inline-flex items-center justify-center mr-2 font-bold leading-none transform translate-x-1/2 -translate-y-1/2 bg-[#0685D7] text-indigo-100 text-sm text-center ml-2 px-2 py-1 rounded-full dark:bg-[#0685D7] border border-[#0685D7]'>
                            {clientCompanyCount} {''}
                        </span>
                    </div>
                    <button className='small-button' onClick={openMOdule}>
                        Show Clients{' '}
                    </button>
                    {open && (
                        <>
                            <div
                                className='fixed inset-0 flex items-center justify-center z-[999] bg-slate-900 bg-opacity-40'
                                onClick={e => {
                                    e.stopPropagation();
                                    setOpen(false);
                                }}></div>
                            <div
                                className='fixed top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] flex items-center justify-center z-[10000]'
                                onClick={e => {
                                    e.stopPropagation();
                                }}>
                                <div className='bg-white dark:bg-gray-800 dark:text-gray-50  w-96 p-4 rounded-lg shadow-md'>
                                    <div className='flex justify-between items-center mb-4'>
                                        <h2 className='text-lg font-semibold'>Clients</h2>
                                        <button
                                            className='text-gray-500 hover:text-gray-700'
                                            onClick={event => {
                                                setOpen(false);
                                                event.stopPropagation();
                                            }}>
                                            <RiCloseLine className=' text-2xl font-black' />
                                        </button>
                                    </div>
                                    <div ref={containerRef1} className='max-h-40 overflow-hidden overflow-y-scroll'>
                                    {clientDetails &&
                                            clientDetails.map((d) => (
                                            <div key={d.id} className='flex items-center gap-2 my-2 p-2 justify-between border w-full'>
                                                    { isEditing ? (

                                                <input
                                                type="text"
                                                defaultValue={d.clientName}
                                                onChange={handleInputChange}
                                                className="border px-2 outline-none w-[70%] rounded"
                                                />
                                                ) : (
                                                <div className='font-medium w-[70%] break-words'>
                                                {d.clientName}
                                                </div>
                                                )
                                                }
                                                <div className="flex gap-2">   
                                                {/* <div className='px-2 py-1 cursor-pointer text-xl rounded text-blue-300 hover:text-blue-600' onClick={() => {handleEdit(d._id); setIsEditing(!isEditing)}}><VscEdit /></div> */}
                                                <div className='px-2 py-1 cursor-pointer text-xl rounded text-blue-300 hover:text-blue-600' onClick={() => { isEditing && handleEdit(d._id); setIsEditing(!isEditing) }}><VscEdit /></div>
                                                <div className='px-2 py-1 cursor-pointer text-xl rounded text-red-300 hover:text-red-600' onClick={() => handleDelete(d._id)}><AiOutlineDelete /></div>
                                                </div>
                                            </div> 
                                            ))}

                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                    <div className='flex items-center'>
                        <div className='relative mr-3'>
                            <AddClientNames
                                // handleGetAllRoles={handleGetAllRoles}
                                type={'add'}
                                {...{ handleGetAllComapnyClient ,handleGetAllComapnyClients,handleGetAllClients,setClientDetails}}
                                // setCallClientFunction={handleCallClientFunction}
                            />
                        </div>
                        <div className='relative mr-3'>
                            <AddOrEditClient
                                // handleGetAllRoles={handleGetAllRoles}
                                type={'add'}
                                clientDetails={null}
                                // {...{ handleGetAllComapnyClient ,handleGetAllComapnyClients,handleGetAllClients,setClientDetails}}
                                handleGetAllComapnyClient={handleGetAllComapnyClient}
                                handleGetAllComapnyClients={handleGetAllComapnyClients}
                                allClients={allClients}
                                handleGetAllClients={handleGetAllClients}
                                setClientDetails={setClientDetails}
                            
                            />
                        </div>
                        {FinalDownloadData && FinalDownloadData.length > 0 && (
                            <div className='relative mr-3'>
                                <NewToolTip direction='top' message={'Download'}>
                                    <DropDown
                                        data={download_data}
                                        defaultValue={''}
                                        name={'Clients'}
                                        // downloadData={FinalDownloadData}
                                        icon={
                                            <span className='text-xl grey-link bg-white p-2 rounded-lg'>
                                                <BsDownload />
                                            </span>
                                        }
                                    />
                                </NewToolTip>
                            </div>
                        )}
                    </div>
                </div>
                <div className='card'>
                    <div className='flex justify-between items-center'>
                        <div className='flex items-center '>
                            <p className='p-0 m-0 text-lightTextColor text-base'>Show</p>
                            <select
                                value={sortTable.limit}
                                onChange={event => {
                                    setSortTable({ ...sortTable, limit: event.target.value, pageNo: 1 });
                                }}
                                className='border py-1  rounded-md outline-none w-15 text-sm px-2 mx-1'>
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                                <option value={500}>500</option>
                            </select>
                            <p className='p-0 m-0 text-lightTextColor text-base'>Entries</p>
                        </div>
                        <div className='flex items-center'>
                            <div className='flex items-center'>
                                {/* <div className='relative mr-3'>
                                <SearchInput onChange={handleSearchRole} placeholder={'Search a role'} />
                            </div>
                            <div className='relative mr-3'>
                                <RoleFilter type={undefined} {...{ userObject, handleGetFilterRole, handleGetAllRoles, roleDetails, permission }} />
                            </div>
                            <div className='relative mr-3'>
                                <RoleFilter type={'reset'} {...{ userObject, handleGetFilterRole, handleGetAllRoles, roleDetails, permission }} />
                            </div> */}
                            </div>
                            {/* <DropDown
                            data={bulkAction}
                            defaultValue={''}
                            icon={
                                <span className='text-2xl grey-link'>
                                    <BsThreeDotsVertical />
                                </span>
                            }
                            getData={undefined}
                        /> */}
                        </div>
                    </div>
                    <div className='mt-2 overflow-x-scroll relative shadow-md sm:rounded-lg max-h-[60vh] min-h-[60vh] 2xl:max-h-[66vh] 2xl:min-h-[66vh] minma'>
                        <table className='table-style w-full'>
                            <thead className='!border-b-0 sticky top-0 z-40'>
                                {/* <tr>
                                <th className='!pt-1 !pb-1 w-1/4'>Role Name</th>
                                <th className='!pt-1 !pb-1 w-[650px]'>Role Assign Members</th>
                                <th className='!pt-1 !pb-1 w-[80px]'>Action</th> */}
                                <tr className='text-gray-700 uppercase bg-blue-300 border-0 dark:bg-gray-700 dark:text-gray-400'>
                                    {companyTableList &&
                                        companyTableList.map(function (data, key) {
                                            return (
                                                <>
                                                    {data && (
                                                        // <th key={key} className={`${data.className}`}>
                                                        <th key={key} className={`text-center ${data.name === 'Client' ? 'w-[60%]': 'w-[20%]'} `}>
                                                            {data.name}
                                                        </th>
                                                    )}
                                                </>
                                            );
                                        })}
                                    <th className='text-center w-[20%]'>Action</th>
                                </tr>
                            </thead>
                            <tbody className=''>
                                {companyDetails && companyDetails.length === 0 && (
                                    <tr>
                                        <th colSpan={2}>No data</th>{' '}
                                    </tr>
                                )}
                                {!companyDetails && (
                                    <tr>
                                        <th colSpan={2}>
                                            <TinnySpinner />
                                        </th>
                                    </tr>
                                )}
                                {companyDetails &&
                                    companyDetails.map(function (data, key) {
                                        return (
                                            <tr className='w-full' key={key}>
                                                <td className='w-[20%] text-center break-all'>{data.clientCompany}</td>
                                                <td className='w-[60%] '>
                                                    <div className='flex justify-center items-center flex-row space-x-4 w-full'>
                                                        <div className='flex -space-x-4 w-max-[50px]'>
                                                            <div className='flex justify-center -space-x-4'>
                                                                {data.clientName && data.clientName.length > 2 ? (
                                                                    <>
                                                                        <div className='flex items-center -space-x-4'>
                                                                            <div className='relative w-[30px] h-[30px] shadow-md rounded-full  flex flex-col items-center group'>
                                                                                <img
                                                                                    className='bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 w-10 h-10 rounded-full'
                                                                                    src={
                                                                                        data.clientName === undefined
                                                                                            ? []
                                                                                            : data.clientName[0].profilePic ?? USER_AVTAR_URL + `${data.clientName[0].clientName}.svg`
                                                                                    }
                                                                                    alt=''
                                                                                />
                                                                            </div>
                                                                            <div className='relative w-[30px] h-[30px] shadow-md rounded-full  flex flex-col items-center group'>
                                                                                <img
                                                                                    className='bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 w-10 h-10 rounded-full'
                                                                                    src={
                                                                                        data.clientName === undefined
                                                                                            ? []
                                                                                            : data.clientName[1].profilePic ?? USER_AVTAR_URL + `${data.clientName[1].clientName}.svg`
                                                                                    }
                                                                                    alt=''
                                                                                />
                                                                            </div>
                                                                            <MemberModal members={data?.clientName ? data?.clientName : ''} remainingCount={data.clientName?.length - 2} type={'Client'}/>
                                                                        </div>
                                                                    </>
                                                                ) : (
                                                                    data.clientName.map(d => {
                                                                        return (
                                                                            <ToolTip
                                                                                className='relative w-[30px] h-[30px] shadow-md rounded-full  flex flex-col items-center group'
                                                                                message={d?.clientName}
                                                                                userId={d?.id}>
                                                                                <img
                                                                                    src={USER_AVTAR_URL + d.clientName + '.svg'}
                                                                                    className='ring-2 ring-gray-300 dark:ring-gray-500 w-full h-full rounded-full border-2 border-white dark:border-gray-800'
                                                                                    alt='-'
                                                                                />
                                                                            </ToolTip>
                                                                        );
                                                                    })
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className='flex text-start break-all w-max-[300px]'>{/* {data.clientName}    */}</div>
                                                    </div>
                                                </td>
                                                <td className='w-[20%]'>
                                                    <div className='flex items-center gap-2 justify-center'>
                                                        <NewToolTip direction={'left'} message={'Edit'}>
                                                            <AddOrEditClient size={16} type={'edit'} clientDetails={data} {...{ handleGetAllComapnyClient ,handleGetAllComapnyClients,handleGetAllClients,allClients}} />
                                                        </NewToolTip>
                                                        <NewToolTip direction='left' message={'Delete'}>
                                                            <button
                                                                className='red-link'
                                                                onClick={() => {
                                                                    setDeleteMessage('Delete Client Company ' + '"' + data.clientCompany + '"');
                                                                    setDeleteClientId(data._id);
                                                                    setOpenDeleteModel(true);
                                                                }}>
                                                                <AiOutlineDelete size={16} />
                                                            </button>
                                                        </NewToolTip>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                            </tbody>
                        </table>
                    </div>
                    {companyDetails && companyDetails.length != 0 && (
                        <div className='flex justify-between items-center'>
                            <p className='p-0 m-0 text-lightTextColor text-base sm:my-4 my-2'>
                                Showing {sortTable.limit * (sortTable.pageNo - 1) + 1} to{' '}
                                {sortTable.limit * sortTable.pageNo < clientCompanyCount ? sortTable.limit * sortTable.pageNo : clientCompanyCount} of {clientCompanyCount}
                            </p>
                            <div className='flex items-center '>
                                <button
                                    disabled={sortTable.pageNo == 1}
                                    onClick={() => {
                                        handlePaginationclient('?skip=' + (sortTable.limit * sortTable.pageNo - sortTable.limit * 2) + '&limit=' + sortTable.limit);
                                        setSortTable({ ...sortTable, pageNo: sortTable.pageNo - 1 });
                                    }}
                                    className='disabled:opacity-25  disabled:cursor-not-allowed  arrow_left border mx-1 bg-veryveryLightGrey cursor-pointer hover:bg-defaultTextColor hover:text-white'>
                                    <MdKeyboardArrowLeft />
                                </button>
                                <div className='pages'>
                                    <p className='p-0 m-0 text-lightTextColor text-base sm:my-4 my-2'>
                                        Page <span>{sortTable.pageNo}</span>
                                    </p>
                                </div>
                                <button
                                    disabled={sortTable.pageNo === Math.ceil(clientCompanyCount / sortTable.limit)}
                                    onClick={() => {
                                        handlePaginationclient('?skip=' + sortTable.limit * sortTable.pageNo + '&limit=' + sortTable.limit);
                                        setSortTable({
                                            ...sortTable,
                                            pageNo: sortTable.pageNo + 1,
                                            // skip: sortTable.pageNo * sortTable.limit,
                                        });
                                    }}
                                    className='disabled:cursor-not-allowed  arrow_right border mx-1 bg-veryveryLightGrey cursor-pointer hover:bg-defaultTextColor hover:text-white'>
                                    <MdKeyboardArrowRight />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* <UserDetailsWithProjects
            open={addRemoveUserModel}
            close={() => {
                setAddRemoveUserModel(false);
            }}
            onClick={() => {}}
        />
        <DeleteConformation open={openDeleteModel} close={handleCloseDeleteModel} message={deleteMessage} onClick={handleDeleteRolesById} /> */}
            <DeleteConformation
                open={openDeleteModel}
                close={() => {
                    setOpenDeleteModel(!openDeleteModel);
                }}
                message={deleteMessage}
                onClick={handleDeleteCliengtById}
            />
        </>
    );
};

export default client;
