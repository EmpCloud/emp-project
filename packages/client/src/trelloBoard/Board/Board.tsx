import React, { useState, useEffect, useRef, Component } from 'react';
import { useRouter } from 'next/router';
import { MoreHorizontal } from 'react-feather';
import Card from '../Card/Card';
import Dropdown from '../Dropdown/Dropdown';
import CustomInput from '../CustomInput/CustomInput';
import toast from '../../../src/components/Toster';
import Cookies from 'js-cookie';
import { IBoard, ICard } from '../Interfaces/Kanban';
import { updateBoardName } from '../Helper/api/put';
import { MdDelete, MdEdit, MdOutlineAddToPhotos } from 'react-icons/md';
import NoAccessCard from '@COMPONENTS/NoAccessCard';
import { RiMore2Fill } from 'react-icons/ri';
import { Tooltip } from '@material-tailwind/react';

import ScrollContainer from 'react-indiana-drag-scroll'


interface BoardProps {
    board: IBoard;
    addCard: (taskStatus: string, title: string) => void;
    removeBoard: (boardId: number) => void;
    removeCard: (boardId: number, cardId: number) => void;
    onDragEnd: (boardId: number, cardId: number) => void;
    // onDragEnter: (boardId: number, cardId: number) => void;
    onDragOver: (event: any) => void;
    onDrop: (event: any, boardId: number, cardId: number) => void;
    updateCard: (boardId: number, cardId: number, card: ICard) => void;
    fetchData;
}

function Board(props: BoardProps) {
    const { board, addCard, removeBoard, removeCard, onDragEnd, permission, onDragOver, onDrop, updateCard,urlId, fetchData, projectId ,projects,projectNames,performDataFetch} = props;
    const [showDropdown, setShowDropdown] = useState(false);

    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(board?.taskStatus);
    const inputRef = useRef(null);

    const handleEditName = () => {
            setIsEditing(true);
        
    };

    useEffect(() => {
        if (isEditing === true) {
            inputRef.current.focus();
        }
    }, [isEditing]);
    const handleNameChange = event => {
        setName(event.target.value);
    };

    const handleSaveName = event => {
        setIsEditing(false);
        updateBoardName(event.target.value, board?._id).then(response => {
            if (response?.data&&response?.data?.body?.status === 'success') {
                toast({
                    type: 'success',
                    message: response ? response.data?.body?.message : 'Try again !',
                });
                performDataFetch()
            } else {
                toast({
                    type: 'error',
                    message: response ? response?.data.body.message : 'Try again !',
                });
                performDataFetch()
            }
        }).catch(function ({response}) {
            toast({
                type: 'error',
                message: response ? response?.data?.body?.message : 'Something went wrong, Try again !',
            });
        });
    }

  
    return (
        <div className='board'>
            <div className='board-inner' key={board?._id}>
                <div className={`board-header relative ${
                board?.taskStatus === "Todo" ? "bg-[#e3d96e] px-4 py-1 rounded" :
                board?.taskStatus === "Inprogress" ? "bg-[#6e9be3] px-4 py-1 rounded" :
                board?.taskStatus === "Done" ? "bg-[#84e36e] px-4 py-1 rounded" :
                board?.taskStatus === "Onhold" ? "bg-[#e3936e] px-4 py-1 rounded" :
                board?.taskStatus === "Inreview" ? "bg-[#e36eb2] px-4 py-1 rounded" :
                board?.taskStatus === "To be tested1" ? "bg-[#ffe693] px-4 py-1 rounded" :
                board?.taskStatus === "Interview" ? "bg-[#93acff] px-4 py-1 rounded" :
                 `bg-slate-300 px-4 py-2 rounded`}`}>
                    {isEditing ? (
                        <input type='text' value={null} defaultValue={board?.taskStatus} onChange={handleNameChange} onBlur={handleSaveName} ref={inputRef} />
                        ) : (
                            <p className='board-header-title text-white !text-md relative'>
                            {board?.taskStatus}
                            <span className={` absolute top-0 -right-[28px] h-6 w-6 flex justify-center items-center !text-[10px] rounded-full !text-white 
                            ${board?.taskStatus === "Todo" ? "bg-[#c0b750]" :
                            board?.taskStatus === "Inprogress" ? "bg-[#618aca]" :
                            board?.taskStatus === "Done" ? "bg-[#6cbb5a]" :
                            board?.taskStatus === "Onhold" ? "bg-[#c47e5e]" :
                            board?.taskStatus === "Inreview" ? "bg-[#bd5b94]" :
                            board?.taskStatus === "To be tested1" ? "bg-[#d1bc78]" :
                            board?.taskStatus === "Interview" ? "bg-[#7285c5]" :
                 "bg-slate-500"}`}>{board?.tasks?.length || 0}</span>
                        </p>
                    )}
                    <div className='flex items-center gap-2'>
                    {/* Add Card */}
                    <Tooltip content="Add Card" className=' bg-gray-600 dark:text-[#fff] before:absolute before:-bottom-[4px] before:left-[40%] before:transform before:rotate-45 before:border-gray-600 before: before:border-t before:border-[5px]'>
                    <div>
                    {Cookies.get('isAdmin') === true ? (
                        // Outermost condition
                        <CustomInput
                            text='+'
                            placeholder='Enter Card Title'
                            displayClass='bg-white !rounded-full !px-2 !py-0'
                            editClass='board-add-card-edit resize-none'
                            validation='title'
                            rowsHeight={4}
                            widthForCard=' absolute z-50'
                            disable={permission && permission?.task?.create === false ? false : true}
                            onSubmit={(value: string) => addCard(board?.taskStatus, value)}
                        />
                    ) : // If the user is not an admin
                    permission && permission?.task?.create === false ? null : (
                        <CustomInput
                            text='+'
                            placeholder='Enter Card Title'
                            displayClass='bg-white !rounded-full !mt-0 !px-2 !py-0 placeholder'
                            widthForCard='!w-fit'
                            editClass='board-add-card-edit absolute z-50 top-12 left-[50%] translate-x-[-50%] w-[19rem] dark:bg-gray-800 shadow shadow-gray-600'
                            validation='title'
                            rowsHeight={6}
                            disable={permission && permission?.task?.create === false ? false : true}
                            onSubmit={(value: string) => addCard(board?.taskStatus, value)}
                        />
                    )}
                    </div>
                    </Tooltip>
                    {/* more options */}
                    <div>
                    {Cookies.get('isAdmin') === true ? (
                        <div
                            className='board-header-title-more'
                            onClick={event => {
                                event.stopPropagation();
                                setShowDropdown(true);
                            }}>
                            <RiMore2Fill className=' text-white sticky -z-10 left-0' />
                            {showDropdown && (
                                <Dropdown class='board-dropdown' onClose={() => setShowDropdown(false)}>
                                    {board?.isDefault === true ? (
                                        <p className='text-base text-center hover:bg-slate-200 p-1 rounded'>Default Board</p>
                                    ) : (
                                        <div>
                                            <div className='flex justify-between items-center hover:bg-slate-200 p-1 duration-300 ease-linear rounded text-sm' onClick={() => removeBoard(board?._id)}>
                                                Delete Board
                                            </div>
                                            <div className='flex justify-between items-center hover:bg-slate-200 p-1 duration-300 ease-linear rounded text-sm' onClick={handleEditName}>
                                                Edit Name
                                            </div>
                                        </div>
                                    )}
                                </Dropdown>
                            )}
                        </div>
                    ) : // If the user is not an admin
                    permission && permission?.task?.delete === false ? null : (
                        <div
                            className='board-header-title-more'
                            onClick={event => {
                                event.stopPropagation();
                                setShowDropdown(true);
                            }}>
                            <RiMore2Fill className=' text-white text-xl sticky left-0' />
                            {showDropdown && (
                                <Dropdown class='board-dropdown' onClose={() => setShowDropdown(false)}>
                                    {board?.isDefault === true ? (
                                        <p className='text-base text-center hover:bg-slate-200 p-1 rounded'>Default Board</p>
                                    ) : (
                                        <div>
                                            <div className='flex justify-between items-center hover:bg-slate-200 p-1 duration-300 ease-linear rounded text-sm' onClick={() => removeBoard(board?._id)}>
                                                Delete Board
                                            </div>
                                            <div className='flex justify-between items-center hover:bg-slate-200 p-1 duration-300 ease-linear rounded text-sm' onClick={handleEditName}>
                                                Edit Name
                                            </div>
                                        </div>
                                    )}
                                </Dropdown>
                            )}
                            
                        </div>
                    )}
                    </div>
                    </div>
                </div>
                <div className='board-cards 2xl:max-h-[72vh]  xl:max-h-[66vh]  max-h-[70vh] overflow-y-auto mt-3 custom-scroll' onDragOver={event => onDragOver(event)} onDrop={event => onDrop(event, board._id, 0)}>
                {board?.tasks?.length > 0 ? (
        board?.tasks?.map(item => (
            <Card
                key={item._id}
                leftBorderColor={` 
                ${board?.taskStatus === "Todo" ? " border-l-4 border-[#e3d96e] duration-75  ease-linear" :
                board?.taskStatus === "Inprogress" ? " border-l-4 border-[#6e9be3] duration-75  ease-linear" :
                board?.taskStatus === "Done" ? " border-l-4 border-[#84e36e] duration-75  ease-linear" :
                board?.taskStatus === "Onhold" ? " border-l-4 border-[#e3936e] duration-75  ease-linear" :
                board?.taskStatus === "Inreview" ? " border-l-4 border-[#e36eb2] duration-75  ease-linear" :
                board?.taskStatus === "To be tested1" ? " border-l-4 border-[#ffe693] duration-75  ease-linear" :
                board?.taskStatus === "Interview" ? " border-l-4 border-[#93acff] duration-75  ease-linear" :
                "bg-slate-300"}`}
                fullBorderColor={` 
                ${board?.taskStatus === "Todo" ? " hover:border-l-4 shadow hover:shadow-gray-800 border-[#e3d96e]" :
                board?.taskStatus === "Inprogress" ? " hover:border-l-4 shadow hover:shadow-gray-800 border-[#6e9be3]" :
                board?.taskStatus === "Done" ? " hover:border-l-4 shadow hover:shadow-gray-800 border-[#84e36e]" :
                board?.taskStatus === "Onhold" ? " hover:border-l-4 shadow hover:shadow-gray-800 border-[#e3936e]" :
                board?.taskStatus === "Inreview" ? " hover:border-l-4 shadow hover:shadow-gray-800 border-[#e36eb2]" :
                board?.taskStatus === "To be tested1" ? " hover:border-l-4 shadow hover:shadow-gray-800 border-[#ffe693]" :
                board?.taskStatus === "Interview" ? " hover:border-l-4 shadow hover:shadow-gray-800 border-[#93acff]" :
                "bg-slate-300"}`}
                card={item}
                boardId={board._id}
                taskStatus={board.taskStatus}
                removeCard={removeCard}
                onDragOver={onDragOver}
                onDrop={onDrop}
                onDragEnd={onDragEnd}
                updateCard={updateCard}
                fetchData={fetchData}
                projectId={projectId}
                permission={permission}
                projects={projects}
                projectNames={projectNames}
                performDataFetch={performDataFetch}
                urlId={urlId}
            />
        ))
    ) : (
        <div className='text-center h-40 bg-slate-200 opacity-60 rounded-xl flex justify-center items-center border-dashed border-4 border-slate-300'><p><MdOutlineAddToPhotos className=" text-gray-500 text-2xl"/></p>
        <p>Drop here..</p>
        </div>
    )}
                    
                    
                </div>
                
            </div>
        </div>
    );
}

export default Board;
