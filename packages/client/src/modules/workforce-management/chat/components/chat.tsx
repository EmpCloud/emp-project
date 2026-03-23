/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import InputEmoji from 'react-input-emoji';
import { FiRefreshCcw } from 'react-icons/fi';
import AudioRecording from './audioRecording';
import io from 'socket.io-client';
import { fetchChatApi, fetchChatUserApi } from '../api/get';
import toast from '@COMPONENTS/Toster/index';
const ENDPOINT = 'https://empsockets.globusdemos.com';

const index = () => {
    const [userDetails, setUserDetails] = useState(null);
    // useEffect(() => {
    //   socket.on("receive-message", (receivedData)=> {
    // },
    var socket;
    socket = io(ENDPOINT);
    useEffect(() => {
        if (Cookies.get('id')) {
            // socket.emit('setup', Cookies.get('id'));
            // socket.on('recive_message', data => {
            //     alert(data);
            //     toast({
            //         type: 'info',
            //         message: data,
            //     });
            // });
        }
    }, []);
    const [activeConversations, setActiveConversations] = useState(null);
    const [currentSelectChatWindow, setCurrentSelectChatWindow] = useState(false);
    const [receiveId, setReceiveId] = useState(null);
    const [text, setText] = useState('');
    const handleFileUpload = event => {
        document.getElementById('file_upload').click();
    };
    function handleOnEnter(event) {
        // socket.emit('send-message', text, receiveId);
    }
    const handleSelectChatWindow = (event, id) => {
        setCurrentSelectChatWindow(true);
        setReceiveId(id);
    };
    const handleFetchUser = () => {
        fetchChatUserApi().then(response => {
            if (response.data.statusCode == 200) {
                // setActiveConversations(response.data.body.data.users);
            }
        });
    };
    const handleFetchChat = () => {
        fetchChatApi('', '').then(response => {
            if (response.data.statusCode == 200) {
            }
        });
    };
    useEffect(() => {
        handleFetchUser();
    }, [userDetails, receiveId]);
    useEffect(() => {
        setUserDetails(Cookies.get('isAdmin') === 'true' ? JSON.parse(Cookies.get('adminData')) : JSON.parse(Cookies.get('userData')));
    }, []);
    if (userDetails) {
        return (
            <div className='flex h-screen antialiased text-gray-800'>
                <div className='flex flex-row h-full w-full overflow-x-hidden'>
                    <div className='flex flex-col py-8 pl-6 pr-2 w-64 bg-white flex-shrink-0'>
                        <div className='flex flex-col mt-8'>
                            <div className='flex flex-row items-center justify-between text-base'>
                                <span className='font-bold'>Conversations</span>
                                <FiRefreshCcw className='cursor-pointer' onClick={handleFetchUser} />
                            </div>
                            <div className='flex flex-col space-y-1 mt-4 -mx-2 h-48 overflow-y-auto'>
                                {activeConversations &&
                                    activeConversations.map(function (d, key) {
                                        return (
                                            <button
                                                key={key}
                                                onClick={event => {
                                                    handleSelectChatWindow(event, d._id);
                                                }}
                                                className='flex flex-row items-center hover:bg-gray-100 rounded-xl p-2'>
                                                <div className='flex items-center justify-center h-8 w-8 bg-indigo-200 rounded-full'>
                                                    <img className=' rounded-full' src={d.profilePic} alt='Rounded avatar' />
                                                </div>
                                                <div className='ml-2 text-sm font-semibold'>{d.firstName + ' ' + d.lastName}</div>
                                            </button>
                                        );
                                    })}
                            </div>
                        </div>
                        <div className='flex flex-col mt-8'>
                            <div className='flex flex-row items-center justify-between text-base'>
                                <span className='font-bold'>Groups</span>
                                <span className='flex items-center justify-center bg-gray-300 h-4 w-4 rounded-full'>4</span>
                            </div>
                            <div className='flex flex-col space-y-1 mt-4 -mx-2 h-48 overflow-y-auto'>
                                <button className='flex flex-row items-center hover:bg-gray-100 rounded-xl p-2'>
                                    <div className='flex items-center justify-center h-8 w-8 bg-indigo-200 rounded-full'>H</div>
                                    <div className='ml-2 text-sm font-semibold'>Henry Boyd</div>
                                </button>
                                <button className='flex flex-row items-center hover:bg-gray-100 rounded-xl p-2'>
                                    <div className='flex items-center justify-center h-8 w-8 bg-gray-200 rounded-full'>M</div>
                                    <div className='ml-2 text-sm font-semibold'>Marta Curtis</div>
                                    <div className='flex items-center justify-center ml-auto text-base text-white bg-red-500 h-4 w-4 rounded leading-none'>2</div>
                                </button>
                                <button className='flex flex-row items-center hover:bg-gray-100 rounded-xl p-2'>
                                    <div className='flex items-center justify-center h-8 w-8 bg-orange-200 rounded-full'>P</div>
                                    <div className='ml-2 text-sm font-semibold'>Philip Tucker</div>
                                </button>
                                <button className='flex flex-row items-center hover:bg-gray-100 rounded-xl p-2'>
                                    <div className='flex items-center justify-center h-8 w-8 bg-pink-200 rounded-full'>C</div>
                                    <div className='ml-2 text-sm font-semibold'>Christine Reid</div>
                                </button>
                                <button className='flex flex-row items-center hover:bg-gray-100 rounded-xl p-2'>
                                    <div className='flex items-center justify-center h-8 w-8 bg-purple-200 rounded-full'>J</div>
                                    <div className='ml-2 text-sm font-semibold'>Jerry Guzman</div>
                                </button>
                            </div>
                        </div>
                    </div>
                    {currentSelectChatWindow ? (
                        <div className='flex flex-col flex-auto h-full p-6'>
                            <div className='flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4'>
                                <div className='flex flex-col h-full overflow-x-auto mb-4'>
                                    <div className='flex flex-col h-full'>
                                        <div className='grid grid-cols-12 gap-y-2'>
                                            <div className='col-start-1 col-end-8 p-3 rounded-lg'>
                                                <div className='flex flex-row items-center'>
                                                    <div className='flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0'>A</div>
                                                    <div className='relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl'>
                                                        <div>Hey How are you today?</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-start-1 col-end-8 p-3 rounded-lg'>
                                                <div className='flex flex-row items-center'>
                                                    <div className='flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0'>A</div>
                                                    <div className='relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl'>
                                                        <div>
                                                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vel ipsa commodi illum saepe numquam maxime asperiores voluptate sit, minima
                                                            perspiciatis.
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-start-6 col-end-13 p-3 rounded-lg'>
                                                <div className='flex items-center justify-start flex-row-reverse'>
                                                    <div className='flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0'>A</div>
                                                    <div className='relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl'>
                                                        <div>I'm ok what about you?</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-start-6 col-end-13 p-3 rounded-lg'>
                                                <div className='flex items-center justify-start flex-row-reverse'>
                                                    <div className='flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0'>A</div>
                                                    <div className='relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl'>
                                                        <div>Lorem ipsum dolor sit, amet consectetur adipisicing. ?</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-start-6 col-end-13 p-3 rounded-lg'>
                                                <div className='flex items-center justify-start flex-row-reverse'>
                                                    <div className='flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0'>A</div>
                                                    <div className='relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl'>
                                                        <div>Lorem ipsum dolor sit, amet consectetur adipisicing. ?</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-start-6 col-end-13 p-3 rounded-lg'>
                                                <div className='flex items-center justify-start flex-row-reverse'>
                                                    <div className='flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0'>A</div>
                                                    <div className='relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl'>
                                                        <div>Lorem ipsum dolor sit, amet consectetur adipisicing. ?</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-start-1 col-end-8 p-3 rounded-lg'>
                                                <div className='flex flex-row items-center'>
                                                    <div className='flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0'>A</div>
                                                    <div className='relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl'>
                                                        <div>Lorem ipsum dolor sit amet !</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-start-6 col-end-13 p-3 rounded-lg'>
                                                <div className='flex items-center justify-start flex-row-reverse'>
                                                    <div className='flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0'>A</div>
                                                    <div className='relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl'>
                                                        <div>Lorem ipsum dolor sit, amet consectetur adipisicing. ?</div>
                                                        <div className='absolute text-base bottom-0 right-0 -mb-5 mr-2 text-gray-500'>Seen</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-start-6 col-end-13 p-3 rounded-lg'>
                                                <div className='flex items-center justify-start flex-row-reverse'>
                                                    <div className='flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0'>A</div>
                                                    <div className='relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl'>
                                                        <div>Lorem ipsum dolor sit, amet consectetur adipisicing. ?</div>
                                                        <div className='absolute text-base bottom-0 right-0 -mb-5 mr-2 text-gray-500'>Seen</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-start-6 col-end-13 p-3 rounded-lg'>
                                                <div className='flex items-center justify-start flex-row-reverse'>
                                                    <div className='flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0'>A</div>
                                                    <div className='relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl'>
                                                        <div>Lorem ipsum dolor sit, amet consectetur adipisicing. ?</div>
                                                        <div className='absolute text-base bottom-0 right-0 -mb-5 mr-2 text-gray-500'>Seen</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-start-6 col-end-13 p-3 rounded-lg'>
                                                <div className='flex items-center justify-start flex-row-reverse'>
                                                    <div className='flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0'>A</div>
                                                    <div className='relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl'>
                                                        <div>Lorem ipsum dolor sit, amet consectetur adipisicing. ?</div>
                                                        <div className='absolute text-base bottom-0 right-0 -mb-5 mr-2 text-gray-500'>Seen</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-start-6 col-end-13 p-3 rounded-lg'>
                                                <div className='flex items-center justify-start flex-row-reverse'>
                                                    <div className='flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0'>A</div>
                                                    <div className='relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl'>
                                                        <div>Lorem ipsum dolor sit, amet consectetur adipisicing. ?</div>
                                                        <div className='absolute text-base bottom-0 right-0 -mb-5 mr-2 text-gray-500'>Seen</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-start-6 col-end-13 p-3 rounded-lg'>
                                                <div className='flex items-center justify-start flex-row-reverse'>
                                                    <div className='flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0'>A</div>
                                                    <div className='relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl'>
                                                        <div>Lorem ipsum dolor sit, amet consectetur adipisicing. ?</div>
                                                        <div className='absolute text-base bottom-0 right-0 -mb-5 mr-2 text-gray-500'>Seen</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-start-6 col-end-13 p-3 rounded-lg'>
                                                <div className='flex items-center justify-start flex-row-reverse'>
                                                    <div className='flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0'>A</div>
                                                    <div className='relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl'>
                                                        <div>Lorem ipsum dolor sit, amet consectetur adipisicing. ?</div>
                                                        <div className='absolute text-base bottom-0 right-0 -mb-5 mr-2 text-gray-500'>Seen</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-start-6 col-end-13 p-3 rounded-lg'>
                                                <div className='flex items-center justify-start flex-row-reverse'>
                                                    <div className='flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0'>n</div>
                                                    <div className='relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl'>
                                                        <div id={'audio_by_user'}>neetu</div>
                                                        <div className='absolute text-base bottom-0 right-0 -mb-5 mr-2 text-gray-500'>Seen</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-start-1 col-end-8 p-3 rounded-lg'>
                                                <div className='flex flex-row items-center'>
                                                    <div className='flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0'>A</div>
                                                    <div className='relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl'>
                                                        <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis, in.</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-start-1 col-end-8 p-3 rounded-lg'>
                                                <div className='flex flex-row items-center'>
                                                    <div className='flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0'>A</div>
                                                    <div className='relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl'>
                                                        <div className='flex flex-row items-center'>
                                                            <button className='flex items-center justify-center bg-indigo-600 hover:bg-indigo-800 rounded-full h-8 w-10'>
                                                                <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                                                                    <path
                                                                        stroke-linecap='round'
                                                                        stroke-linejoin='round'
                                                                        stroke-width='1.5'
                                                                        d='M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z'></path>
                                                                    <path stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M21 12a9 9 0 11-18 0 9 9 0 0118 0z'></path>
                                                                </svg>
                                                            </button>
                                                            <div className='flex flex-row items-center space-x-px ml-4'>
                                                                <div className='h-2 w-1 bg-gray-500 rounded-lg'></div>
                                                                <div className='h-2 w-1 bg-gray-500 rounded-lg'></div>
                                                                <div className='h-4 w-1 bg-gray-500 rounded-lg'></div>
                                                                <div className='h-8 w-1 bg-gray-500 rounded-lg'></div>
                                                                <div className='h-8 w-1 bg-gray-500 rounded-lg'></div>
                                                                <div className='h-10 w-1 bg-gray-500 rounded-lg'></div>
                                                                <div className='h-10 w-1 bg-gray-500 rounded-lg'></div>
                                                                <div className='h-12 w-1 bg-gray-500 rounded-lg'></div>
                                                                <div className='h-10 w-1 bg-gray-500 rounded-lg'></div>
                                                                <div className='h-6 w-1 bg-gray-500 rounded-lg'></div>
                                                                <div className='h-5 w-1 bg-gray-500 rounded-lg'></div>
                                                                <div className='h-4 w-1 bg-gray-500 rounded-lg'></div>
                                                                <div className='h-3 w-1 bg-gray-500 rounded-lg'></div>
                                                                <div className='h-2 w-1 bg-gray-500 rounded-lg'></div>
                                                                <div className='h-2 w-1 bg-gray-500 rounded-lg'></div>
                                                                <div className='h-2 w-1 bg-gray-500 rounded-lg'></div>
                                                                <div className='h-10 w-1 bg-gray-500 rounded-lg'></div>
                                                                <div className='h-2 w-1 bg-gray-500 rounded-lg'></div>
                                                                <div className='h-10 w-1 bg-gray-500 rounded-lg'></div>
                                                                <div className='h-8 w-1 bg-gray-500 rounded-lg'></div>
                                                                <div className='h-8 w-1 bg-gray-500 rounded-lg'></div>
                                                                <div className='h-1 w-1 bg-gray-500 rounded-lg'></div>
                                                                <div className='h-1 w-1 bg-gray-500 rounded-lg'></div>
                                                                <div className='h-2 w-1 bg-gray-500 rounded-lg'></div>
                                                                <div className='h-8 w-1 bg-gray-500 rounded-lg'></div>
                                                                <div className='h-8 w-1 bg-gray-500 rounded-lg'></div>
                                                                <div className='h-2 w-1 bg-gray-500 rounded-lg'></div>
                                                                <div className='h-2 w-1 bg-gray-500 rounded-lg'></div>
                                                                <div className='h-2 w-1 bg-gray-500 rounded-lg'></div>
                                                                <div className='h-2 w-1 bg-gray-500 rounded-lg'></div>
                                                                <div className='h-4 w-1 bg-gray-500 rounded-lg'></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='flex flex-row items-center h-16 rounded-xl bg-white w-full px-4'>
                                    <div>
                                        <button className='flex items-center justify-center text-gray-400 hover:text-gray-600' onClick={handleFileUpload}>
                                            <input id='file_upload' type='file' hidden />
                                            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                                                <path
                                                    stroke-linecap='round'
                                                    stroke-linejoin='round'
                                                    stroke-width='2'
                                                    d='M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13'></path>
                                            </svg>
                                        </button>
                                    </div>
                                    <div className='flex-grow ml-4'>
                                        <InputEmoji value={text} onChange={setText} cleanOnEnter onEnter={handleOnEnter} placeholder='Type a message' />
                                    </div>
                                    <div className='ml-4 flex flex-row gap-1'>
                                        <button className='flex items-center justify-center  hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0'>
                                            <span className='ml-2'>
                                                <svg className='text-black w-4 h-4 transform rotate-45 -mt-px' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                                                    <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 19l9 2-9-18-9 18 9-2zm0 0v-8'></path>
                                                </svg>
                                            </span>
                                        </button>
                                        <AudioRecording />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className='flex flex-col flex-auto h-full p-6'>
                            <div className='flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4'>
                                <div className='flex flex-col h-full overflow-x-auto mb-4'>
                                    <div className='flex flex-col h-full'>
                                        <div className='grid grid-cols-12 gap-y-2 flex justify-center '>
                                            {/* code */}
                                            {/* <Forbidde */}
                                            {/* code */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
};
export default index;
