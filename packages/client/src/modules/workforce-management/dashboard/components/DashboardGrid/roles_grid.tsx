/* eslint-disable react-hooks/rules-of-hooks */
import { FloatingOnlySelectfield } from '@COMPONENTS/FloatingOnlySelectfield';
import { getAllRoles, getMembersByRole } from '@WORKFORCE_MODULES/members/api/get';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import { ImCross } from 'react-icons/im';

const ChartComponent = dynamic(() => import('../graph/RoleMembersChart'), { ssr: false });

const roles_grid = ({ clickConfig, handleRemoveGrid, data, key }) => {
    const [roleList, setRoleList] = useState(null);
    const [memberDetails, setMemberDetails] = useState(null);
    const [selectedOption, setSelectedOption] = useState('');

    const handleGetAllRoles = () => {
        getAllRoles().then(response => {
            if (response.data.body.status === 'success') {
                setRoleList(
                    response.data.body.data.totalRolesData.map(item => {
                        return {
                            text: item.roles,
                            value: item.roles,
                            item,
                        };
                    })
                );
            }
        });
    };

    const filterMembers = (condition="") => {   
        getMembersByRole(condition).then(response => {
            if (response.data.body.status === 'success') {
                setMemberDetails(response.data?.body.data.data.map((d)=>{
                    return {category: `${d.firstName} ${d.lastName}`}
                }));
            }
        });
    };
    useEffect(() => {
        handleGetAllRoles();
    }, []);

    useEffect(() => {
        if(roleList){
            filterMembers( "?role="+ roleList[0].value );
        }      
    }, [roleList]);

    return (
       <div className={clickConfig ? 'outline' : ''}>
                {clickConfig && (
                    <div className='flex justify-between items-center mt-4 card p-4 w-full '>
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
                <div className={clickConfig ? 'opacity-30 ' : 'mt-5'}>
                    <div className={`card project-stage w-full inline-block align-top mt-4`}>
                        <div className='grid grid-cols-2 justify-between items-center mb-1 '>
                            <h1 className='heading-medium text-base mb-0 sm:text-xl '>Role Members</h1>
                            <div className='flex justify-center items-center text-sm pl-1 sm:text-xl rounded'>
                                <FloatingOnlySelectfield
                                    label={undefined}
                                    optionsGroup={roleList}
                                    value={selectedOption ?? ''}
                                    className={`!mb-0`}
                                    onChange={event => {
                                        setSelectedOption(event.target.value);
                                        filterMembers("?role="+ event.target.value);
                                    }}
                                />
                            </div>
                        </div>
                        <div className='member-chart-wrapper'>
                            <ChartComponent Data={memberDetails} />
                        </div>
                    </div>
                </div>
            </div>
    );
};

export default roles_grid;
