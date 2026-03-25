import React, { useState } from 'react';

type Task = {
    _id: string;
    taskTitle: string;
    taskStatus: string;
    priority: string;
    storyPoints?: number;
    assignedTo?: { firstName: string; lastName: string }[];
    dueDate?: string;
};

type Sprint = {
    _id: string;
    name: string;
    status: string;
};

type Props = {
    tasks: Task[];
    sprints: Sprint[];
    onAddToSprint: (sprintId: string, taskId: string) => void;
    onRefresh: () => void;
};

const priorityColors: Record<string, string> = {
    High: 'bg-red-100 text-red-700',
    Medium: 'bg-yellow-100 text-yellow-700',
    Low: 'bg-green-100 text-green-700',
};

const BacklogView: React.FC<Props> = ({ tasks, sprints, onAddToSprint, onRefresh }) => {
    const [selectedSprint, setSelectedSprint] = useState<string>(sprints[0]?._id || '');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredTasks = tasks.filter(t =>
        t.taskTitle?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Backlog</h2>
                    <p className="text-sm text-gray-500">{tasks.length} task(s) not assigned to any sprint</p>
                </div>
                <div className="flex items-center gap-3">
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={selectedSprint}
                        onChange={(e) => setSelectedSprint(e.target.value)}
                    >
                        <option value="">Select sprint to add to</option>
                        {sprints.map(s => (
                            <option key={s._id} value={s._id}>
                                {s.name} ({s.status})
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {filteredTasks.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500">
                        {tasks.length === 0
                            ? 'No tasks in the backlog. All tasks are assigned to sprints.'
                            : 'No tasks match your search.'}
                    </p>
                </div>
            ) : (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 text-left">
                                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Task</th>
                                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Priority</th>
                                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Points</th>
                                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Assigned To</th>
                                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Due Date</th>
                                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredTasks.map(task => (
                                <tr key={task._id} className="hover:bg-gray-50 transition">
                                    <td className="px-4 py-3">
                                        <span className="text-sm font-medium text-gray-900">{task.taskTitle}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-xs text-gray-600">{task.taskStatus || '-'}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        {task.priority && (
                                            <span className={`text-xs px-2 py-0.5 rounded font-medium ${priorityColors[task.priority] || 'bg-gray-100 text-gray-600'}`}>
                                                {task.priority}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-sm text-gray-700">{task.storyPoints || 0}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        {task.assignedTo && task.assignedTo.length > 0 ? (
                                            <span className="text-xs text-gray-600">
                                                {task.assignedTo.map(u => `${u.firstName} ${u.lastName}`).join(', ')}
                                            </span>
                                        ) : (
                                            <span className="text-xs text-gray-400">Unassigned</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-xs text-gray-600">{formatDate(task.dueDate)}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <button
                                            className="text-xs text-blue-600 font-medium hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={!selectedSprint}
                                            onClick={() => {
                                                if (selectedSprint) {
                                                    onAddToSprint(selectedSprint, task._id);
                                                }
                                            }}
                                        >
                                            Add to Sprint
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default BacklogView;
