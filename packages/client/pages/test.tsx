import { FiDownload } from '@react-icons/all-files/fi/FiDownload';
import React, { Component } from 'react';
import { BsArrowsAngleExpand, BsThreeDotsVertical } from 'react-icons/bs';
import Board from 'react-trello';
import DropDown from '../src/components/DropDown';
const data = require('./data.json');
const handleDragStart = (cardId, laneId) => {};
const handleDragEnd = (cardId, sourceLaneId, targetLaneId) => {};
class App extends Component {
    state = { boardData: { lanes: [] } };
    setEventBus = eventBus => {
        this.setState({ eventBus });
    };
    async componentWillMount() {
        const response = await this.getBoard();
        this.setState({ boardData: response });
    }
    getBoard() {
        return new Promise(resolve => {
            resolve(data);
        });
    }
    completeCard = () => {
        this.state.eventBus.publish({
            type: 'ADD_CARD',
            laneId: 'COMPLETED',
            card: {
                id: 'Milk',
                title: 'Buy Milk',
                label: '15 mins',
                description: 'Use Headspace app',
            },
        });
        this.state.eventBus.publish({
            type: 'REMOVE_CARD',
            laneId: 'PLANNED',
            cardId: 'Milk',
        });
    };
    addCard = () => {
        this.state.eventBus.publish({
            type: 'ADD_CARD',
            laneId: 'BLOCKED',
            card: {
                id: 'Ec2Error',
                title: 'EC2 Instance Down',
                label: '30 mins',
                description: 'Main EC2 instance down',
            },
        });
    };
    shouldReceiveNewData = nextData => {};
    handleCardAdd = (card, laneId) => {
        console.dir(card);
    };
    render() {
        return (
            <div>
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
                                    placeholder='Search members and task
              '
                                />
                            </div>
                            <button className='inline-flex justify-center w-full outline-none px-3'>
                                <span className='text-xl grey-link'>
                                    <BsArrowsAngleExpand />
                                </span>
                            </button>
                            {/* <DropDown
              data={data}
              defaultValue={""}
              // onClick={handleSelectStatus}
              icon={
                <span className="text-2xl grey-link">
                  <BsThreeDotsVertical />
                </span>
              }
            /> */}
                        </div>
                    </div>
                    <div>
                        <Board
                            editable
                            onCardAdd={this.handleCardAdd}
                            data={this.state.boardData}
                            draggable
                            onDataChange={this.shouldReceiveNewData}
                            eventBusHandle={this.setEventBus}
                            handleDragStart={handleDragStart}
                            handleDragEnd={handleDragEnd}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
export default App;
