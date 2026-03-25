import React from 'react';
import { AiOutlineDelete } from '@react-icons/all-files/ai/AiOutlineDelete';

type Task = {
    _id: string;
    taskTitle: string;
    taskStatus: string;
    priority: string;
    storyPoints?: number;
    assignedTo?: { firstName: string; lastName: string; profilePic?: string }[];
};

type Sprint = {
    _id: string;
    name: string;
    taskDetails?: Task[];
};

type Props = {
    sprint: Sprint;
    onRemoveTask: (taskId: string) => void;
};

const columns = [
    { key: 'Todo', label: 'To Do', color: 'border-blue-400' },
    { key: 'Inprogress', label: 'In Progress', color: 'border-yellow-400' },
    { key: 'Review', label: 'Review', color: 'border-purple-400' },
    { key: 'Done', label: 'Done', color: 'border-green-400' },
];

const priorityColors: Record<string, string> = {
    High: 'bg-red-100 text-red-700',
    Medium: 'bg-yellow-100 text-yellow-700',
    Low: 'bg-green-100 text-green-700',
};

const SprintTaskBoard: React.FC<Props> = ({ sprint, onRemoveTask }) => {
    const tasks = sprint.taskDetails || [];

    const getTasksByStatus = (status: string) => {
        return tasks.filter(t => t.taskStatus === status);
    };

    return (
        <div className="grid grid-cols-4 gap-4">
            {columns.map(col => {
                const colTasks = getTasksByStatus(col.key);
                return (
                    <div key={col.key} className={`bg-gray-50 rounded-lg border-t-4 ${col.color} min-h-[200px]`}>
                        <div className="p-3 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm font-semibold text-gray-700">{col.label}</h4>
                                <span className="text-xs text-gray-400 bg-white px-2 py-0.5 rounded-full">
                                    {colTasks.length}
                                </span>
                            </div>
                        </div>
                        <div className="p-2 space-y-2">
                            {colTasks.map(task => (
                                <div key={task._id} className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 hover:shadow-md transition">
                                    <div className="flex items-start justify-between mb-2">
                                        <h5 className="text-sm font-medium text-gray-900 flex-1 line-clamp-2">
                                            {task.taskTitle}
                                        </h5>
                                        <button
                                            onClick={() => onRemoveTask(task._id)}
                                            className="text-gray-400 hover:text-red-500 ml-1 flex-shrink-0"
                                            title="Remove from sprint"
                                        >
                                            <AiOutlineDelete size={14} />
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            {task.priority && (
                                                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${priorityColors[task.priority] || 'bg-gray-100 text-gray-600'}`}>
                                                    {task.priority}
                                                </span>
                                            )}
                                            {(task.storyPoints !== undefined && task.storyPoints > 0) && (
                                                <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-medium">
                                                    {task.storyPoints} pts
                                                </span>
                                            )}
                                        </div>
                                        {task.assignedTo && task.assignedTo.length > 0 && (
                                            <div className="flex -space-x-1">
                                                {task.assignedTo.slice(0, 3).map((user, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center text-[8px] text-white font-bold border border-white"
                                                        title={`${user.firstName} ${user.lastName}`}
                                                    >
                                                        {user.firstName?.[0]}{user.lastName?.[0]}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {colTasks.length === 0 && (
                                <p className="text-xs text-gray-400 text-center py-4">No tasks</p>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default SprintTaskBoard;
