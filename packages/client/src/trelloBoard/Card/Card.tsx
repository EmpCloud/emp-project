import React, { useState,useEffect } from 'react';
import { AlignLeft, CheckSquare, Clock, MoreHorizontal } from 'react-feather';
import Chip from '../Common/Chip';
import Dropdown from '../Dropdown/Dropdown';
import { formatDate } from '../Helper/Util';
import { ICard } from '../Interfaces/Kanban';
import CardInfo from './CardInfo/CardInfo';
import DynamicCardInfo from './CardInfo/DynamicCardInfo';
import ToolTip from '@COMPONENTS/ToolTip';
import Cookies from 'js-cookie';
import { Tooltip } from '@material-tailwind/react';
import { getTaskById } from '../Helper/api/get';
import toast from '../../../src/components/Toster';
import { BiSolidShareAlt } from 'react-icons/bi';
import ShareModal from '../Modal/ShareModal';
import { GrClose } from 'react-icons/gr';
import MemberModal from '@COMPONENTS/MemberModal';

interface CardProps {
    tasks: ICard;
    boardId: number;
    removeCard: (boardId: number, cardId: number) => void;
    onDragEnd: (boardId: number, cardId: number) => void;
    // onDragEnter: (boardId: number, cardId: number) => void;
    onDragOver: (event: any) => void;
    onDrop: (event: any, boardId: number, cardId: number) => void;
    updateCard: (boardId: number, cardId: number, card: ICard) => void;
    fetchData;
    leftBorderColor:string;
}
function Card(props: CardProps) {
    const { card, boardId, removeCard,leftBorderColor,fullBorderColor, onDragEnd, onDragOver, onDrop, updateCard, fetchData, projectId, permission ,projects,projectNames,performDataFetch,urlId} = props;
    const { _id, subTaskTitle, desc, date, dueDate, tasks, labels, priority, taskTitle, subTasks, taskDetails, progress } = card;
    const [showDropdown, setShowDropdown] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const handleDelete = () => {
        removeCard(boardId, _id);
    };
//    useEffect(()=>{
//     setShowModal(true)
//    },[urlId])

const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  
const openShareModal = () => {
  setIsShareModalOpen(true);
};

const closeShareModal = () => {
  setIsShareModalOpen(false);
};

    
    return (
        <>
           
            {showModal && (
                <CardInfo
                    onClose={() => setShowModal(false)}
                    tasks={card}
                    boardId={boardId}
                    updateCard={updateCard}
                    fetchData={fetchData}
                    projectId={projectId}
                    permission={permission}
                    projects={projects}
                    projectNames={projectNames}
                    performDataFetch={performDataFetch}
                    urlId={urlId}
                    type={'card'}
                />
            )}
            <div
                className={`cards ${leftBorderColor} ${fullBorderColor}relative`}
                key={_id}
                draggable
                onDragEnd={() => onDragEnd(boardId, _id)}
                // onDragEnter={() => onDragEnter(boardId, _id)}
                onDragOver={event => onDragOver(event)}
                onDrop={event => onDrop(event, boardId, _id)}
                onClick={() => setShowModal(true)}>
                {Cookies.get('isAdmin') === true ? (
                    <div className='card-top float-right'>
                        

                        <div
                            className='card-top-more'
                            onClick={event => {
                                event.stopPropagation();
                                setShowDropdown(true);
                            }}>
                                {/* <span className=' bg-red-500 z-50'>Overdue</span> */}
                            <span className='' onClick={openShareModal}>
                                {/* <BiSolidShareAlt/> */}
                            </span>
                            <MoreHorizontal />
                            {showDropdown && (
                                <Dropdown class='board-dropdown' onClose={() => setShowDropdown(false)}>
                                    <p onClick={handleDelete}>Delete Card</p>
                                    <p onClick={handleDelete}>Delete Card</p>
                                </Dropdown>
                            )}
                        </div>
                        <div>
                        </div>
                    </div>
                ) : // If the user is not an admin
                permission && permission?.task?.delete === false ? null : (
                    <div className='card-top'>
                        {/* <div className='card-top-labels'>{<Chip item={priority} />}</div> */}

                        <div className=' flex items-center flex-col'>
                            {/* <span className=' bg-red-500 text-white px-4 py-1 rounded-xl'>Overdue</span> */}
                        <div
                            className={`${!showDropdown ? 'card-top-more':'card-top-once-more'}`}
                            onClick={event => {
                                event.stopPropagation();
                                setShowDropdown(true);
                            }}>
                            <MoreHorizontal/>
                            {showDropdown && ( 
                                <Dropdown class='board-dropdown text-sm dark:bg-gray-700 text-center' onClose={() => setShowDropdown(false)}>
                                    {/* <p className=' hover:bg-slate-100 duration-300 py-1'>Edit Card</p> */}
                                    <p className=' hover:bg-slate-100 dark:hover:bg-gray-800 duration-300 py-1' onClick={handleDelete}>Delete Card</p>
                                </Dropdown>
                            )}
                        </div>
                            {/* <span onClick={event => {
                                event.stopPropagation();
                                }}>
                                <BiSolidShareAlt onClick={openShareModal} className=' text-xl '/>
                            </span> */}
                            </div>
                    </div>
                )}
                {/* <ShareModal CloseIcon={<GrClose/>} positionShare={'absolute right-2 top-16 modal-container z-[999] w-[180px] rounded-xl'} isOpen={isShareModalOpen}
                ShareLink={process.env.SHARE_LINK + card?._id}
                onClose={closeShareModal} /> */}

                <div className='card-title w-full text-base' style={{ overflowWrap: 'break-word' }}>
                    {taskTitle}
                </div>
                <div className='card-top-labels !text-base'>{<Chip item={priority} />}</div>
                <div>
                    {/* <p title={taskDetails}> */}
                        <Tooltip className=' max-w-[16rem] bg-gray-600 before:absolute before:-bottom-[4px] before:left-[50%] before:-translate-x-[50%] before:transform before:rotate-45 before:border-gray-600 before: before:border-t before:border-[5px]' content={taskDetails === undefined ? "No Description" : <div dangerouslySetInnerHTML={{ __html: taskDetails }} />}>
                        <AlignLeft />
                        </Tooltip>
                    {/* </p> */}
                </div>
                <div className='user-img-group'>
                <div className='flex justify-center -space-x-4'>
    {card?.assignedTo?.length === 0 ? (
      <p className='text-sm'>No Members Assigned</p>
    ) : (
      <>
        {card?.assignedTo?.length <= 5 ? (
          card?.assignedTo?.map((d, index) => (
            <ToolTip
              className='relative w-[30px] bg-white h-[30px] shadow-md rounded-full'
              message={d.firstName}
              key={index}
            >
              <img
              onClick={(event) => {
                event.stopPropagation();
               }}
                className='absolute cursor-pointer top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 rounded-full'
                src={d.profilePic || `https://api.dicebear.com/7.x/initials/svg?seed=${d.firstName}.svg`}
                alt={d.firstName}
              />
            </ToolTip>
          ))
        ) : (
          <div className='flex items-center -space-x-4'>
            {card?.assignedTo
              ?.slice(0, 5)
              .map((d, index) => (
                <div
                  className='relative w-[30px] h-[30px] shadow-md rounded-full flex flex-col items-center group'
                  key={index}
                >
                  <img
                  onClick={(event) => {
                    event.stopPropagation();
                   }}
                    className='bg-white cursor-pointer absolute top-1/2 left-1/2 -translate-x-1/2 text-xs -translate-y-1/2 w-full h-full p-1 rounded-full'
                    src={d.profilePic || `https://api.dicebear.com/7.x/initials/svg?seed=${d.firstName}.svg`}
                    alt={d.firstName}
                  />
                </div>
              ))}
            <MemberModal
              members={card?.assignedTo}
              remainingCount={card?.assignedTo?.length - 5}
            />
          </div>
        )}
      </>
    )}
  </div>
</div>

                <div className='card-footer'>
                    {dueDate && (
                        <div className='card-footer-item'>
                            <Clock className='card-footer-icon' />
                            <p>{formatDate(dueDate)}</p>
                        </div>
                    )}
                    {card && card?.subTasks?.length > 0 && (
                        <div className='card-footer-item'>
                            <CheckSquare className='card-footer-icon' />
                            <p>{card?.subTasks?.filter(subTask => subTask.subTaskStatus === 'Done').length}/{card?.subTasks?.length}</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
export default Card;
