/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import { User, X } from 'react-feather';
import Modal2 from '../../Modal/Modal';
import { getAllUsers, searchMember } from './../../Helper/api/get';
import { ICard, ILabel, ITask } from '../../Interfaces/Kanban';
import toast from '../../../../src/components/Toster';
import { updateTaskStatus } from 'src/trelloBoard/Helper/api/put';
import SearchInput from '@COMPONENTS/SearchInput';
import Cookies from 'js-cookie';
import { ImCross } from 'react-icons/im';

interface CardInfoProps {
    task(arg0: string, task: any): unknown;
    attachments: any;
    onClose: () => void;
    tasks: ICard;
    boardId: number;
    updateCard: (boardId: number, cardId: number, tasks: ICard, subTasks: ICard) => void;
}
function AssignedMembers(props: CardInfoProps) {
    const { onClose, fetchData, setCardValues, cardValues, updateCardValues, projectId, permission, performDataFetch ,handleGetAllActivity} = props;
    const task = props;
    const attachments = props;
    const [membersDetail, setMemberDetails] = useState(null);
    const [allMembers, setAllMembers] = useState([]);

    useEffect(() => {
        handleGetAllUser('?limit=' + 5000 + '&invitationStatus=1&suspensionStatus=false');
    }, []);
    const handleGetAllUser = (condition = '') => {
        getAllUsers(condition).then(response => {
            if (response.data.body.status === 'success') {
                setMemberDetails(response.data?.body?.data?.users);
            }
        });
    };
    const removeLabel = (label: ILabel) => {
        const tempLabels = cardValues.labels.filter(item => item.text !== label.text);

        setCardValues({
            ...cardValues,
            labels: tempLabels,
        });
    };
    //Filtering the array based on Task attachments
    let ids = null;
    let arr2Ids = new Set(attachments?.attachments?.map(obj => obj._id));
    let filteredArr1 = membersDetail?.filter(obj => !arr2Ids.has(obj._id));

    let allTaskAssignedMembersId = [];
    for (let i = 0; i < attachments?.attachments?.length; i++) {
        ids = { id: attachments.attachments[i]?._id };
        allTaskAssignedMembersId.push(ids);
    }

    const addMemberToTask = (memberId, taskId) => {
        let datas = JSON.stringify({
            assignedTo: [{ id: memberId }, ...allTaskAssignedMembersId], 
        });
        updateTaskStatus(datas, taskId).then(response => {
            if (response.data.body.status === 'success') {
                toast({
                    type: 'success',
                    message: response ? response.data.body.message : 'Try again !',
                });
                handleGetAllActivity('?ActivityType=Task' + '&ActivityTypeId=' + taskId+'&limit=100&orderBy=createdAt&sort=desc&category=Updated');
                updateCardValues();
            } else {
                toast({
                    type: 'error',
                    message: response ? response.data.body.message : 'Try again !',
                });
                updateCardValues();
            }
        });
        setCardValues({ ...cardValues, datas });
    };

    const removeMemberToTask = (memberId, taskId) => {
        let filteredArr = allTaskAssignedMembersId?.filter(obj => memberId !== obj.id);

        let datas = JSON.stringify({
            assignedTo: filteredArr,
        });
        updateTaskStatus(datas, taskId, performDataFetch).then(response => {
            if (response.data.body.status === 'success') {
                toast({
                    type: 'success',
                    message: response ? response.data.body.message : 'Try again !',
                });
                handleGetAllActivity('?ActivityType=Task' + '&ActivityTypeId=' + taskId+'&limit=100&orderBy=createdAt&sort=desc&category=Updated');
                updateCardValues();
            } else {
                toast({
                    type: 'error',
                    message: response ? response.data.body.message : 'Try again !',
                });
                updateCardValues();
            }
        });
    };

    const handleSearchMember = (event: { target: { value: string } }) => {
        const value = event.target.value;

        if (value.trim() !== '') {
            searchedData(value);
        } else {
            // fetchData(projectId);
        }
    };
    async function searchedData(value: string) {
        await searchMember(`keyword=${value}&invitationStatus=1`).then(response => {
            setAllMembers(response.data.body.data.user);
        });
    }
    const permissionToRemoveToTask = data => {
        if (Cookies.get('isAdmin') === 'true' || permission?.task?.edit === true) {
            removeMemberToTask(data?._id, task?.task);
        }
    };
    const permissionToAddMemberToTask = data => {
        if (Cookies.get('isAdmin') === 'true' || permission?.task?.edit === true) {
            addMemberToTask(data?._id, task?.task);
        }
    };
    return (
        <>
            <Modal2 onClose={onClose}>
                <div className='cursor-pointer float-right pr-6 pt-4 mr-2'>
                    <ImCross onClick={onClose} />
                </div>
                <div className='cardinfo'>
                    <div>
                        <SearchInput onChange={handleSearchMember} placeholder={'Search  Member'} />
                    </div>
                </div>
                <div className='cardinfo !pt-0'>
                    <div className='cardinfo-box'>
                        <div className='cardinfo-box-title'>
                            <User />
                            <p>Existing Members in the Task</p>
                        </div>
                    </div>
                </div>
                <div className='cardinfo-box'>
                    <div className='cardinfo-box-labels px-14'>
                        {attachments?.attachments?.map((data, index) => (
                            <label key={index} className='label-inline'>
                                <img className='member-avatar' height='30' width='30' src={data?.profilePic ? data?.profilePic : '/imgs/user/user1.png'} title={data.firstName} />
                                {removeLabel && <X onClick={() => permissionToRemoveToTask(data)} />}
                            </label>
                        ))}
                    </div>
                </div>

                <div className='cardinfo'>
                    <div className='cardinfo-box'>
                        <div className='cardinfo-box-title'>
                            <User />
                            <p>All Members</p>
                        </div>
                    </div>
                </div>
                <div className='pop-over-section js-board-members px-14'>
                    {!filteredArr1 && (
                        <div className='js-loading hide'>
                            <p className='empty' style={{ padding: '24px 6px' }}>
                                Loading…
                            </p>
                        </div>
                    )}
                    <div className='card-detail-item u-clearfix js-card-detail-members'>
                        <div className='js-card-detail-members-list'>
                            <ul>
                                {(allMembers.length ? allMembers?.filter(obj => !arr2Ids.has(obj._id)) : filteredArr1)?.map((data, index) => (
                                    <>
                                        <li key={index}>
                                            <div className='member js-member-on-card-menu'>
                                                <img
                                                    className='member-avatar'
                                                    height='30'
                                                    width='30'
                                                    src={data.profilePic ? data.profilePic : '/imgs/user/user1.png'}
                                                    alt={data.firstName}
                                                    title={data.firstName}
                                                    onClick={() => permissionToAddMemberToTask(data)}
                                                />
                                            </div>
                                        </li>
                                    </>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </Modal2>
        </>
    );
}
export default AssignedMembers;
