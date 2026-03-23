import React, { useEffect, useState } from 'react';
import { BsThreeDotsVertical } from '@react-icons/all-files/bs/BsThreeDotsVertical';
import { AiOutlinePlus } from '@react-icons/all-files/ai/AiOutlinePlus';
import { BiTimeFive } from '@react-icons/all-files/bi/BiTimeFive';
import { BsArrowsAngleExpand } from '@react-icons/all-files/bs/BsArrowsAngleExpand';
import { FiCheck } from '@react-icons/all-files/fi/FiCheck';
import { FiDownload } from '@react-icons/all-files/fi/FiDownload';
import TaskReviewCard from './taskReviewCard';
import DropDown from '../../../../components/DropDown';
import ToolTip from '../../../../components/ToolTip';
export const index = ({ startLoading, stopLoading }) => {
    const [showIcon, setShowIcon] = useState(false);
    // Dropdown
    const data = [
        { text: 'Import tasks', value: 1 },
        { text: 'Delete all', value: 2 },
    ];
    const handleSelectStatus = (event, v) => {
        event.preventDefault;
    };
    return (
        <>
            <div className='flex justify-between mb-2'>
                <h2 className='heading-big'>Task review</h2>
                {/* <button className="small-button-2" onClick={() => setShowModal(true)}>Delete popup</button> */}
                <button
                    type='button'
                    className='items-center flex bg-white rounded-lg py-2 px-4 text-defaultTextColor text-xl hover:drop-shadow-[0_5px_5px_rgba(0,0,0,0.08)] hover:text-darkTextColor transition-all'>
                    <FiDownload />
                </button>
            </div>
            <div className='card'>
                <div className='flex justify-between items-center'>
                    <h3 className='heading-medium'>Total tasks - 254</h3>
                    <div className='flex items-center mb-2'>
                        <div className='wrapper relative mr-2'>
                            <div className='absolute left-4 bottom-3 text-placeholderGrey '>
                                <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
                                    <path strokeLinecap='round' strokeLinejoin='round' d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'></path>
                                </svg>
                            </div>
                            <input
                                className='rounded-search md:w-80 py-2'
                                type='text'
                                placeholder='Search members and task'
                            />
                        </div>
                        <button className='inline-flex justify-center w-full outline-none px-3'>
                            <span className='text-xl grey-link'>
                                <BsArrowsAngleExpand />
                            </span>
                        </button>
                        <DropDown
                            data={data}
                            defaultValue={''}
                            onClick={handleSelectStatus}
                            icon={
                                <span className='text-2xl grey-link'>
                                    <BsThreeDotsVertical />
                                </span>
                            }
                        />
                    </div>
                </div>
                <div className='task-col-wrapper thin-scrollbar-firefox'>
                    {/* Start:to do */}
                    <div className='task-col'>
                        <div className='text-center pb-1 relative'>
                            <p className='text-lg text-darkTextColor font-bold'>
                                To do
                                <span className='task-col-total'>( 210 )</span>
                            </p>
                            <span className='absolute right-2 top-1 cursor-pointer grey-link text-xl'>
                                <AiOutlinePlus />
                            </span>
                        </div>
                        <div className='task-card-wrapper thin-scrollbar-firefox'>
                            <div className='task-card'>
                                <div className='task-card-header'>
                                    <h4>Create new website UI</h4>
                                </div>
                                <div className='task-card-mid'>
                                    <div className='task-card-project'>EmpCloud</div>
                                    <div className='task-card-time'>
                                        <span className='mr-1 text-sm'>
                                            <BiTimeFive />
                                        </span>
                                        2 days left
                                    </div>
                                </div>
                                <div className='task-card-footer'>
                                    <p className='text-priority1Color'>Priority 1</p>
                                    <div className='user-img-group'>
                                        <ToolTip message={'Arjun C M'} data-bs-placement={'bottom'}>
                                            <img src='/imgs/user/user1.png' className='user-img-sm' alt='user' />
                                        </ToolTip>
                                    </div>
                                </div>
                            </div>
                            {/* END: Card */}
                            <TaskReviewCard taskName={'Create neetu file'} projectName={'EmpCloud'} priority={'low'} status={'delay'} />
                            {/* Start: Card */}
                            <div className='task-card'>
                                <div className='task-card-header'>
                                    <h4>Fix website issues & create three new web pages </h4>
                                </div>
                                <div className='task-card-mid'>
                                    <div className='task-card-project'>SocioBoard</div>
                                    <div className='task-card-time hours-left'>
                                        <span className='mr-1 text-sm'>
                                            <BiTimeFive />
                                        </span>
                                        10 hours left
                                    </div>
                                </div>
                                <div className='task-card-footer'>
                                    <p className='text-priority2Color'>Priority 2</p>
                                    <div className='user-img-group'>
                                        <img src='/imgs/user/user1.png' className='user-img-sm' alt='user' />
                                        <img src='/imgs/user/user2.png' className='user-img-sm' alt='user' />
                                        <img src='/imgs/user/user3.png' className='user-img-sm' alt='user' />
                                    </div>
                                </div>
                            </div>
                            {/* END: Card */}
                            {/* Start: Card */}
                            <div className='task-card'>
                                <div className='task-card-header'>
                                    <h4>Dashboard modification</h4>
                                </div>
                                <div className='task-card-mid'>
                                    <div className='task-card-project'>PowerAdSpy</div>
                                    <div className='task-card-time task-delay'>
                                        <span className='mr-1 text-sm'>
                                            <BiTimeFive />
                                        </span>
                                        Delay
                                    </div>
                                </div>
                                <div className='task-card-footer'>
                                    <p className='text-priority2Color'>Priority 2</p>
                                    <div className='user-img-group'>
                                        <img src='/imgs/user/user1.png' className='user-img-sm' alt='user' />
                                        <img src='/imgs/user/user2.png' className='user-img-sm' alt='user' />
                                        <img src='/imgs/user/user3.png' className='user-img-sm' alt='user' />
                                    </div>
                                </div>
                            </div>
                            {/* END: Card */}
                            {/* Start: Card */}
                            <div className='task-card'>
                                <div className='task-card-header'>
                                    <h4>Fix website issues & create three new web pages </h4>
                                </div>
                                <div className='task-card-mid'>
                                    <div className='task-card-project'>SocioBoard</div>
                                    <div className='task-card-time hours-left'>
                                        <span className='mr-1 text-sm'>
                                            <BiTimeFive />
                                        </span>
                                        10 hours left
                                    </div>
                                </div>
                                <div className='task-card-footer'>
                                    <p className='text-priority2Color'>Priority 2</p>
                                    <div className='user-img-group'>
                                        <img src='/imgs/user/user1.png' className='user-img-sm' alt='user' />
                                        <img src='/imgs/user/user2.png' className='user-img-sm' alt='user' />
                                        <img src='/imgs/user/user3.png' className='user-img-sm' alt='user' />
                                    </div>
                                </div>
                            </div>
                            {/* END: Card */}
                            {/* Start: Card */}
                            <div className='task-card'>
                                <div className='task-card-header'>
                                    <h4>Dashboard modification</h4>
                                </div>
                                <div className='task-card-mid'>
                                    <div className='task-card-project'>PowerAdSpy</div>
                                    <div className='task-card-time task-delay'>
                                        <span className='mr-1 text-sm'>
                                            <BiTimeFive />
                                        </span>
                                        Delay
                                    </div>
                                </div>
                                <div className='task-card-footer'>
                                    <p className='text-priority2Color'>Priority 2</p>
                                    <div className='user-img-group'>
                                        <img src='/imgs/user/user1.png' className='user-img-sm' alt='user' />
                                        <img src='/imgs/user/user2.png' className='user-img-sm' alt='user' />
                                        <img src='/imgs/user/user3.png' className='user-img-sm' alt='user' />
                                    </div>
                                </div>
                            </div>
                            {/* END: Card */}
                            {/* Start: Card */}
                            <div className='task-card'>
                                <div className='task-card-header'>
                                    <h4>Fix website issues & create three new web pages </h4>
                                </div>
                                <div className='task-card-mid'>
                                    <div className='task-card-project'>SocioBoard</div>
                                    <div className='task-card-time hours-left'>
                                        <span className='mr-1 text-sm'>
                                            <BiTimeFive />
                                        </span>
                                        10 hours left
                                    </div>
                                </div>
                                <div className='task-card-footer'>
                                    <p className='text-priority2Color'>Priority 2</p>
                                    <div className='user-img-group'>
                                        <img src='/imgs/user/user1.png' className='user-img-sm' alt='user' />
                                        <img src='/imgs/user/user2.png' className='user-img-sm' alt='user' />
                                        <img src='/imgs/user/user3.png' className='user-img-sm' alt='user' />
                                    </div>
                                </div>
                            </div>
                            {/* END: Card */}
                            {/* Start: Card */}
                            <div className='task-card'>
                                <div className='task-card-header'>
                                    <h4>Dashboard modification</h4>
                                </div>
                                <div className='task-card-mid'>
                                    <div className='task-card-project'>PowerAdSpy</div>
                                    <div className='task-card-time task-delay'>
                                        <span className='mr-1 text-sm'>
                                            <BiTimeFive />
                                        </span>
                                        Delay
                                    </div>
                                </div>
                                <div className='task-card-footer'>
                                    <p className='text-priority2Color'>Priority 2</p>
                                    <div className='user-img-group'>
                                        <img src='/imgs/user/user1.png' className='user-img-sm' alt='user' />
                                        <img src='/imgs/user/user2.png' className='user-img-sm' alt='user' />
                                        <img src='/imgs/user/user3.png' className='user-img-sm' alt='user' />
                                    </div>
                                </div>
                            </div>
                            {/* END: Card */}
                            {/* Start: Card */}
                            <div className='task-card'>
                                <div className='task-card-header'>
                                    <h4>Fix website issues & create three new web pages </h4>
                                </div>
                                <div className='task-card-mid'>
                                    <div className='task-card-project'>SocioBoard</div>
                                    <div className='task-card-time hours-left'>
                                        <span className='mr-1 text-sm'>
                                            <BiTimeFive />
                                        </span>
                                        10 hours left
                                    </div>
                                </div>
                                <div className='task-card-footer'>
                                    <p className='text-priority2Color'>Priority 2</p>
                                    <div className='user-img-group'>
                                        <img src='/imgs/user/user1.png' className='user-img-sm' alt='user' />
                                        <img src='/imgs/user/user2.png' className='user-img-sm' alt='user' />
                                        <img src='/imgs/user/user3.png' className='user-img-sm' alt='user' />
                                    </div>
                                </div>
                            </div>
                            {/* END: Card */}
                            {/* Start: Card */}
                            <div className='task-card'>
                                <div className='task-card-header'>
                                    <h4>Dashboard modification</h4>
                                </div>
                                <div className='task-card-mid'>
                                    <div className='task-card-project'>PowerAdSpy</div>
                                    <div className='task-card-time task-delay'>
                                        <span className='mr-1 text-sm'>
                                            <BiTimeFive />
                                        </span>
                                        Delay
                                    </div>
                                </div>
                                <div className='task-card-footer'>
                                    <p className='text-priority2Color'>Priority 2</p>
                                    <div className='user-img-group'>
                                        <img src='/imgs/user/user1.png' className='user-img-sm' alt='user' />
                                        <img src='/imgs/user/user2.png' className='user-img-sm' alt='user' />
                                        <img src='/imgs/user/user3.png' className='user-img-sm' alt='user' />
                                    </div>
                                </div>
                            </div>
                            {/* END: Card */}
                            {/* Start: Card */}
                            <div className='task-card'>
                                <div className='task-card-header'>
                                    <h4>Fix website issues & create three new web pages </h4>
                                </div>
                                <div className='task-card-mid'>
                                    <div className='task-card-project'>SocioBoard</div>
                                    <div className='task-card-time hours-left'>
                                        <span className='mr-1 text-sm'>
                                            <BiTimeFive />
                                        </span>
                                        10 hours left
                                    </div>
                                </div>
                                <div className='task-card-footer'>
                                    <p className='text-priority2Color'>Priority 2</p>
                                    <div className='user-img-group'>
                                        <img src='/imgs/user/user1.png' className='user-img-sm' alt='user' />
                                        <img src='/imgs/user/user2.png' className='user-img-sm' alt='user' />
                                        <img src='/imgs/user/user3.png' className='user-img-sm' alt='user' />
                                    </div>
                                </div>
                            </div>
                            {/* END: Card */}
                            {/* Start: Card */}
                            <div className='task-card'>
                                <div className='task-card-header'>
                                    <h4>Dashboard modification</h4>
                                </div>
                                <div className='task-card-mid'>
                                    <div className='task-card-project'>PowerAdSpy</div>
                                    <div className='task-card-time task-delay'>
                                        <span className='mr-1 text-sm'>
                                            <BiTimeFive />
                                        </span>
                                        Delay
                                    </div>
                                </div>
                                <div className='task-card-footer'>
                                    <p className='text-priority2Color'>Priority 2</p>
                                    <div className='user-img-group'>
                                        <img src='/imgs/user/user1.png' className='user-img-sm' alt='user' />
                                        <img src='/imgs/user/user2.png' className='user-img-sm' alt='user' />
                                        <img src='/imgs/user/user3.png' className='user-img-sm' alt='user' />
                                    </div>
                                </div>
                            </div>
                            {/* END: Card */}
                        </div>
                    </div>
                    {/* End:to do */}
                    {/* <NEETU></NEETU> */}
                    {/* Start:In progress */}
                    <div className='task-col'>
                        <div className='text-center pb-1 relative'>
                            <p className='text-lg text-darkTextColor font-bold'>
                                In progress
                                <span className='task-col-total'>( 3 )</span>
                            </p>
                            <span className='absolute right-2 top-1 cursor-pointer grey-link text-xl'>
                                <AiOutlinePlus />
                            </span>
                        </div>
                        <div className='task-card-wrapper thin-scrollbar-firefox'>
                            {/* Start: Card */}
                            <div className='task-card'>
                                <div className='task-card-header'>
                                    <h4>Create new website UI</h4>
                                    {/* <DropDown
                        data={data}
                        defaultValue={""}
                        onClick={handleSelectStatus2}
                        icon = {<span className="text-2xl"><BsThreeDots/></span>}
                        /> */}
                                </div>
                                <div className='task-card-mid'>
                                    <div className='task-card-project'>EmpCloud</div>
                                    <div className='task-card-time'>
                                        <span className='mr-1 text-sm'>
                                            <BiTimeFive />
                                        </span>
                                        2 days left
                                    </div>
                                </div>
                                <div className='task-card-footer'>
                                    <p className='text-priority1Color'>Priority 1</p>
                                    <div className='user-img-group'>
                                        <ToolTip message={'Arjun C M'} data-bs-placement={'bottom'}>
                                            <img src='/imgs/user/user1.png' className='user-img-sm' alt='user' />
                                        </ToolTip>
                                    </div>
                                </div>
                            </div>
                            {/* END: Card */}
                            {/* Start: Card */}
                            <div className='task-card'>
                                <div className='task-card-header'>
                                    <h4>Fix website issues & create three new web pages </h4>
                                </div>
                                <div className='task-card-mid'>
                                    <div className='task-card-project'>SocioBoard</div>
                                    <div className='task-card-time hours-left'>
                                        <span className='mr-1 text-sm'>
                                            <BiTimeFive />
                                        </span>
                                        10 hours left
                                    </div>
                                </div>
                                <div className='task-card-footer'>
                                    <p className='text-priority3Color'>Priority 3</p>
                                    <div className='user-img-group'>
                                        <img src='/imgs/user/user1.png' className='user-img-sm' alt='user' />
                                        <img src='/imgs/user/user2.png' className='user-img-sm' alt='user' />
                                        <img src='/imgs/user/user3.png' className='user-img-sm' alt='user' />
                                    </div>
                                </div>
                            </div>
                            {/* END: Card */}
                            {/* Start: Card */}
                            <div className='task-card'>
                                <div className='task-card-header'>
                                    <h4>Dashboard modification</h4>
                                </div>
                                <div className='task-card-mid'>
                                    <div className='task-card-project'>PowerAdSpy</div>
                                    <div className='task-card-time task-delay'>
                                        <span className='mr-1 text-sm'>
                                            <BiTimeFive />
                                        </span>
                                        Delay
                                    </div>
                                </div>
                                <div className='task-card-footer'>
                                    <p className='text-priority2Color'>Priority 2</p>
                                    <div className='user-img-group'>
                                        <img src='/imgs/user/user1.png' className='user-img-sm' alt='user' />
                                        <img src='/imgs/user/user2.png' className='user-img-sm' alt='user' />
                                        <img src='/imgs/user/user3.png' className='user-img-sm' alt='user' />
                                    </div>
                                </div>
                            </div>
                            {/* END: Card */}
                        </div>
                    </div>
                    {/* End:In progress */}
                    {/* Start:Completed */}
                    <div className='task-col'>
                        <div className='text-center pb-1 relative'>
                            <p className='text-lg text-darkTextColor font-bold'>
                                Completed
                                <span className='task-col-total'>( 1 )</span>
                            </p>
                            <span className='absolute right-2 top-1 cursor-pointer grey-link text-xl'>
                                <AiOutlinePlus />
                            </span>
                        </div>
                        <div className='task-card-wrapper thin-scrollbar-firefox'>
                            {/* Start: Card */}
                            <div className='task-card'>
                                <div className='task-card-header'>
                                    <h4>Fix website issues & create three new web pages </h4>
                                </div>
                                <div className='task-card-mid'>
                                    <div className='task-card-project'>SocioBoard</div>
                                    <div className='task-card-time text-greenColor'>
                                        <span className='mr-1 text-sm'>
                                            <FiCheck />
                                        </span>
                                        Completed
                                    </div>
                                </div>
                                <div className='task-card-footer'>
                                    <p className='text-priority2Color'>Priority 2</p>
                                    <div className='user-img-group'>
                                        <img src='/imgs/user/user1.png' className='user-img-sm' alt='user' />
                                        <img src='/imgs/user/user2.png' className='user-img-sm' alt='user' />
                                        <img src='/imgs/user/user3.png' className='user-img-sm' alt='user' />
                                    </div>
                                </div>
                            </div>
                            {/* END: Card */}
                        </div>
                    </div>
                    {/* End:Completed */}
                    {/* Start:On hold */}
                    <div className='task-col'>
                        <div className='text-center pb-1 relative'>
                            <p className='text-lg text-darkTextColor font-bold'>
                                On hold
                                <span className='task-col-total'>( 3 )</span>
                            </p>
                            <span className='absolute right-2 top-1 cursor-pointer grey-link text-xl'>
                                <AiOutlinePlus />
                            </span>
                        </div>
                        <div className='task-card-wrapper thin-scrollbar-firefox'>
                            {/* Start: Card */}
                            <div className='task-card'>
                                <div className='task-card-header'>
                                    <h4>Fix website issues & create three new web pages </h4>
                                </div>
                                <div className='task-card-mid'>
                                    <div className='task-card-project'>SocioBoard</div>
                                    <div className='task-card-time hours-left'>
                                        <span className='mr-1 text-sm'>
                                            <BiTimeFive />
                                        </span>
                                        10 hours left
                                    </div>
                                </div>
                                <div className='task-card-footer'>
                                    <p className='text-priority2Color'>Priority 2</p>
                                    <div className='user-img-group'>
                                        <img src='/imgs/user/user1.png' className='user-img-sm' alt='user' />
                                        <img src='/imgs/user/user2.png' className='user-img-sm' alt='user' />
                                        <img src='/imgs/user/user3.png' className='user-img-sm' alt='user' />
                                    </div>
                                </div>
                            </div>
                            {/* END: Card */}
                            {/* Start: Card */}
                            <div className='task-card'>
                                <div className='task-card-header'>
                                    <h4>Dashboard modification</h4>
                                </div>
                                <div className='task-card-mid'>
                                    <div className='task-card-project'>PowerAdSpy</div>
                                    <div className='task-card-time task-delay'>
                                        <span className='mr-1 text-sm'>
                                            <BiTimeFive />
                                        </span>
                                        Delay
                                    </div>
                                </div>
                                <div className='task-card-footer'>
                                    <p className='text-priority2Color'>Priority 2</p>
                                    <div className='user-img-group'>
                                        <img src='/imgs/user/user1.png' className='user-img-sm' alt='user' />
                                        <img src='/imgs/user/user2.png' className='user-img-sm' alt='user' />
                                        <img src='/imgs/user/user3.png' className='user-img-sm' alt='user' />
                                    </div>
                                </div>
                            </div>
                            {/* END: Card */}
                        </div>
                    </div>
                    {/* End:On hold */}
                    {/* Start:Create new */}
                    <div className='add-task-col'>
                        <button className='flex bg-veryLightBlue cursor-pointer grey-link text-sm w-full' type='button'>
                            <span className='text-xl mr-1'>
                                <AiOutlinePlus />
                            </span>
                            Add new list
                        </button>
                    </div>
                    {/* End:Create new */}
                </div>
            </div>
        </>
    );
};
export default index;
