import React, { useEffect, useState, useCallback } from 'react';
import toast from '../../../../components/Toster/index';
import TinnySpinner from '../../../../components/TinnySpinner';
import { getSprintsByProject, getSprintDetail, getBacklog, getVelocityChart, getBurndownData } from '../api/get';
import { createSprint, startSprint, completeSprint, addTaskToSprint } from '../api/post';
import { updateSprint } from '../api/put';
import { removeTaskFromSprint } from '../api/delete';
import { getAllProject } from '@WORKFORCE_MODULES/projects/api/get';
import router from 'next/router';
import Cookies from 'js-cookie';
import CreateSprintModal from './CreateSprintModal';
import SprintTaskBoard from './SprintTaskBoard';
import BacklogView from './BacklogView';
import VelocityChart from './VelocityChart';
import BurndownChart from './BurndownChart';

type Sprint = {
    _id: string;
    name: string;
    goal: string;
    startDate: string;
    endDate: string;
    status: 'planning' | 'active' | 'completed' | 'cancelled';
    velocity: number;
    plannedPoints: number;
    tasks: string[];
    taskDetails?: any[];
};

const SprintBoard = ({ startLoading, stopLoading }) => {
    const [sprints, setSprints] = useState<Sprint[]>([]);
    const [projects, setProjects] = useState<any[]>([]);
    const [selectedProjectId, setSelectedProjectId] = useState<string>('');
    const [activeSprint, setActiveSprint] = useState<Sprint | null>(null);
    const [backlogTasks, setBacklogTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'board' | 'backlog' | 'velocity' | 'burndown'>('board');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingSprint, setEditingSprint] = useState<Sprint | null>(null);
    const [velocityData, setVelocityData] = useState<any>(null);
    const [burndownData, setBurndownData] = useState<any>(null);

    // Load projects on mount
    useEffect(() => {
        fetchProjects();
    }, []);

    // Load sprints when project changes
    useEffect(() => {
        if (selectedProjectId) {
            fetchSprints();
            fetchBacklog();
        }
    }, [selectedProjectId]);

    // Load velocity/burndown when tab changes
    useEffect(() => {
        if (activeTab === 'velocity' && selectedProjectId) {
            fetchVelocity();
        }
        if (activeTab === 'burndown' && activeSprint) {
            fetchBurndown(activeSprint._id);
        }
    }, [activeTab, selectedProjectId, activeSprint]);

    const fetchProjects = async () => {
        try {
            const res = await getAllProject('?limit=1000');
            if (res?.data?.body?.data) {
                const projectList = res.data.body.data.data || res.data.body.data;
                setProjects(Array.isArray(projectList) ? projectList : []);
                if (projectList?.length > 0) {
                    // Check if projectId from URL query
                    const urlProjectId = router.query?.projectId as string;
                    setSelectedProjectId(urlProjectId || projectList[0]._id);
                }
            }
        } catch (err) {
            toast.error('Failed to load projects');
        }
    };

    const fetchSprints = async () => {
        if (!selectedProjectId) return;
        setLoading(true);
        try {
            const res = await getSprintsByProject(selectedProjectId);
            if (res?.data?.body?.data) {
                const sprintList = res.data.body.data;
                setSprints(sprintList);
                // Find the active sprint and load its details
                const active = sprintList.find((s: Sprint) => s.status === 'active');
                if (active) {
                    const detailRes = await getSprintDetail(active._id);
                    if (detailRes?.data?.body?.data) {
                        setActiveSprint(detailRes.data.body.data);
                    }
                } else {
                    setActiveSprint(null);
                }
            }
        } catch (err) {
            toast.error('Failed to load sprints');
        } finally {
            setLoading(false);
        }
    };

    const fetchBacklog = async () => {
        if (!selectedProjectId) return;
        try {
            const res = await getBacklog(selectedProjectId);
            if (res?.data?.body?.data) {
                setBacklogTasks(res.data.body.data.tasks || []);
            }
        } catch (err) {
            // Backlog fetch failure is non-critical
        }
    };

    const fetchVelocity = async () => {
        try {
            const res = await getVelocityChart(selectedProjectId);
            if (res?.data?.body?.data) {
                setVelocityData(res.data.body.data);
            }
        } catch (err) {
            toast.error('Failed to load velocity data');
        }
    };

    const fetchBurndown = async (sprintId: string) => {
        try {
            const res = await getBurndownData(sprintId);
            if (res?.data?.body?.data) {
                setBurndownData(res.data.body.data);
            }
        } catch (err) {
            toast.error('Failed to load burndown data');
        }
    };

    const handleCreateSprint = async (data: { name: string; goal: string; startDate: string; endDate: string }) => {
        try {
            const res = await createSprint({
                projectId: selectedProjectId,
                ...data,
            });
            if (res?.data?.body?.status === 'success') {
                toast.success('Sprint created successfully');
                setShowCreateModal(false);
                fetchSprints();
            } else {
                toast.error(res?.data?.body?.message || 'Failed to create sprint');
            }
        } catch (err) {
            toast.error('Failed to create sprint');
        }
    };

    const handleUpdateSprint = async (sprintId: string, data: any) => {
        try {
            const res = await updateSprint(sprintId, data);
            if (res?.data?.body?.status === 'success') {
                toast.success('Sprint updated');
                fetchSprints();
                setEditingSprint(null);
            } else {
                toast.error(res?.data?.body?.message || 'Failed to update sprint');
            }
        } catch (err) {
            toast.error('Failed to update sprint');
        }
    };

    const handleStartSprint = async (sprintId: string) => {
        try {
            const res = await startSprint(sprintId);
            if (res?.data?.body?.status === 'success') {
                toast.success('Sprint started');
                fetchSprints();
            } else {
                toast.error(res?.data?.body?.message || 'Failed to start sprint');
            }
        } catch (err) {
            toast.error('Failed to start sprint');
        }
    };

    const handleCompleteSprint = async (sprintId: string) => {
        // Find the next planning sprint to move incomplete tasks to
        const nextPlanSprint = sprints.find(s => s.status === 'planning');
        try {
            const res = await completeSprint(sprintId, nextPlanSprint?._id);
            if (res?.data?.body?.status === 'success') {
                const result = res.data.body.data;
                toast.success(
                    `Sprint completed! Velocity: ${result.velocity} pts. ${result.incompleteTasks} incomplete task(s) ${result.movedToSprint ? 'moved to next sprint' : 'returned to backlog'}.`
                );
                fetchSprints();
                fetchBacklog();
            } else {
                toast.error(res?.data?.body?.message || 'Failed to complete sprint');
            }
        } catch (err) {
            toast.error('Failed to complete sprint');
        }
    };

    const handleAddTask = async (sprintId: string, taskId: string) => {
        try {
            const res = await addTaskToSprint(sprintId, taskId);
            if (res?.data?.body?.status === 'success') {
                toast.success('Task added to sprint');
                fetchSprints();
                fetchBacklog();
            } else {
                toast.error(res?.data?.body?.message || 'Failed to add task');
            }
        } catch (err) {
            toast.error('Failed to add task');
        }
    };

    const handleRemoveTask = async (sprintId: string, taskId: string) => {
        try {
            const res = await removeTaskFromSprint(sprintId, taskId);
            if (res?.data?.body?.status === 'success') {
                toast.success('Task removed from sprint');
                fetchSprints();
                fetchBacklog();
            } else {
                toast.error(res?.data?.body?.message || 'Failed to remove task');
            }
        } catch (err) {
            toast.error('Failed to remove task');
        }
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'planning': return 'bg-blue-100 text-blue-800';
            case 'active': return 'bg-green-100 text-green-800';
            case 'completed': return 'bg-gray-100 text-gray-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <TinnySpinner />
            </div>
        );
    }

    return (
        <div className="p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Sprint Planning</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage sprints, plan work, and track velocity</p>
                </div>
                <div className="flex items-center gap-3">
                    {/* Project Selector */}
                    <select
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={selectedProjectId}
                        onChange={(e) => setSelectedProjectId(e.target.value)}
                    >
                        <option value="">Select Project</option>
                        {projects.map((p) => (
                            <option key={p._id} value={p._id}>{p.projectName}</option>
                        ))}
                    </select>
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                        onClick={() => setShowCreateModal(true)}
                        disabled={!selectedProjectId}
                    >
                        + New Sprint
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
                <nav className="flex gap-6">
                    {(['board', 'backlog', 'velocity', 'burndown'] as const).map(tab => (
                        <button
                            key={tab}
                            className={`pb-3 text-sm font-medium border-b-2 transition ${
                                activeTab === tab
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab === 'board' ? 'Sprint Board' :
                             tab === 'backlog' ? 'Backlog' :
                             tab === 'velocity' ? 'Velocity Chart' :
                             'Burndown Chart'}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Sprint List (always visible on board tab) */}
            {activeTab === 'board' && (
                <div>
                    {/* Active Sprint */}
                    {activeSprint && (
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <h2 className="text-lg font-semibold">{activeSprint.name}</h2>
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(activeSprint.status)}`}>
                                        {activeSprint.status}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {formatDate(activeSprint.startDate)} - {formatDate(activeSprint.endDate)}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {activeSprint.plannedPoints} pts planned
                                    </span>
                                </div>
                                <button
                                    className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-green-700 transition"
                                    onClick={() => handleCompleteSprint(activeSprint._id)}
                                >
                                    Complete Sprint
                                </button>
                            </div>
                            {activeSprint.goal && (
                                <p className="text-sm text-gray-600 mb-3">Goal: {activeSprint.goal}</p>
                            )}
                            <SprintTaskBoard
                                sprint={activeSprint}
                                onRemoveTask={(taskId) => handleRemoveTask(activeSprint._id, taskId)}
                            />
                        </div>
                    )}

                    {/* Planning Sprints */}
                    {sprints.filter(s => s.status === 'planning').map(sprint => (
                        <div key={sprint._id} className="mb-6 border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-md font-semibold">{sprint.name}</h3>
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(sprint.status)}`}>
                                        {sprint.status}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {formatDate(sprint.startDate)} - {formatDate(sprint.endDate)}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {sprint.tasks.length} task(s) | {sprint.plannedPoints} pts
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        className="text-gray-600 border border-gray-300 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-50 transition"
                                        onClick={() => setEditingSprint(sprint)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-blue-700 transition"
                                        onClick={() => handleStartSprint(sprint._id)}
                                    >
                                        Start Sprint
                                    </button>
                                </div>
                            </div>
                            {sprint.goal && (
                                <p className="text-sm text-gray-500 mb-2">Goal: {sprint.goal}</p>
                            )}
                            <p className="text-xs text-gray-400">
                                Drag tasks from backlog to add them, or use the Backlog tab.
                            </p>
                        </div>
                    ))}

                    {/* Completed Sprints (collapsed) */}
                    {sprints.filter(s => s.status === 'completed').length > 0 && (
                        <div className="mt-6">
                            <h3 className="text-sm font-semibold text-gray-500 mb-2">Completed Sprints</h3>
                            {sprints.filter(s => s.status === 'completed').map(sprint => (
                                <div key={sprint._id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded mb-1">
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm text-gray-700">{sprint.name}</span>
                                        <span className="text-xs text-gray-500">
                                            {formatDate(sprint.startDate)} - {formatDate(sprint.endDate)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs text-gray-600">
                                            Velocity: {sprint.velocity} pts
                                        </span>
                                        <button
                                            className="text-xs text-blue-600 hover:underline"
                                            onClick={() => {
                                                setActiveTab('burndown');
                                                fetchBurndown(sprint._id);
                                            }}
                                        >
                                            View Burndown
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {sprints.length === 0 && selectedProjectId && (
                        <div className="text-center py-12">
                            <p className="text-gray-500 mb-4">No sprints yet for this project.</p>
                            <button
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                                onClick={() => setShowCreateModal(true)}
                            >
                                Create your first sprint
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Backlog Tab */}
            {activeTab === 'backlog' && (
                <BacklogView
                    tasks={backlogTasks}
                    sprints={sprints.filter(s => s.status === 'planning' || s.status === 'active')}
                    onAddToSprint={handleAddTask}
                    onRefresh={fetchBacklog}
                />
            )}

            {/* Velocity Chart Tab */}
            {activeTab === 'velocity' && velocityData && (
                <VelocityChart data={velocityData} />
            )}

            {/* Burndown Chart Tab */}
            {activeTab === 'burndown' && (
                <div>
                    {!burndownData && activeSprint && (
                        <div className="text-center py-8">
                            <TinnySpinner />
                        </div>
                    )}
                    {burndownData && <BurndownChart data={burndownData} />}
                    {!activeSprint && !burndownData && (
                        <p className="text-center text-gray-500 py-8">No active sprint to show burndown for.</p>
                    )}
                </div>
            )}

            {/* Create Sprint Modal */}
            {showCreateModal && (
                <CreateSprintModal
                    onClose={() => setShowCreateModal(false)}
                    onSubmit={handleCreateSprint}
                />
            )}

            {/* Edit Sprint Modal */}
            {editingSprint && (
                <CreateSprintModal
                    sprint={editingSprint}
                    onClose={() => setEditingSprint(null)}
                    onSubmit={(data) => handleUpdateSprint(editingSprint._id, data)}
                />
            )}
        </div>
    );
};

export default SprintBoard;
