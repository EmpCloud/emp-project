import React from 'react';

type VelocityData = {
    sprints: {
        sprintName: string;
        velocity: number;
        plannedPoints: number;
        startDate: string;
        endDate: string;
    }[];
    averageVelocity: number;
    totalSprints: number;
};

type Props = {
    data: VelocityData;
};

const VelocityChart: React.FC<Props> = ({ data }) => {
    const maxPoints = Math.max(
        ...data.sprints.map(s => Math.max(s.velocity, s.plannedPoints)),
        1
    );

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Velocity Chart</h2>
                    <p className="text-sm text-gray-500">Story points completed per sprint</p>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{data.averageVelocity}</p>
                        <p className="text-xs text-gray-500">Avg Velocity</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-gray-700">{data.totalSprints}</p>
                        <p className="text-xs text-gray-500">Sprints</p>
                    </div>
                </div>
            </div>

            {data.sprints.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500">No completed sprints yet. Complete a sprint to see velocity data.</p>
                </div>
            ) : (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    {/* Legend */}
                    <div className="flex items-center gap-6 mb-4">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded bg-blue-500"></div>
                            <span className="text-xs text-gray-600">Completed (Velocity)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded bg-gray-300"></div>
                            <span className="text-xs text-gray-600">Planned</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full border-2 border-dashed border-orange-400"></div>
                            <span className="text-xs text-gray-600">Avg Velocity ({data.averageVelocity} pts)</span>
                        </div>
                    </div>

                    {/* Bar Chart */}
                    <div className="flex items-end gap-4 h-64 border-b border-l border-gray-200 pl-8 pb-2 relative">
                        {/* Y-axis labels */}
                        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-400 py-1">
                            <span>{maxPoints}</span>
                            <span>{Math.round(maxPoints / 2)}</span>
                            <span>0</span>
                        </div>

                        {/* Average line */}
                        <div
                            className="absolute left-8 right-0 border-t-2 border-dashed border-orange-400 opacity-50"
                            style={{ bottom: `${(data.averageVelocity / maxPoints) * 100}%` }}
                        ></div>

                        {data.sprints.map((sprint, idx) => (
                            <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                                <div className="flex items-end gap-1 w-full justify-center" style={{ height: '240px' }}>
                                    {/* Planned bar */}
                                    <div
                                        className="bg-gray-200 rounded-t w-5 transition-all"
                                        style={{ height: `${(sprint.plannedPoints / maxPoints) * 100}%` }}
                                        title={`Planned: ${sprint.plannedPoints} pts`}
                                    ></div>
                                    {/* Velocity bar */}
                                    <div
                                        className="bg-blue-500 rounded-t w-5 transition-all"
                                        style={{ height: `${(sprint.velocity / maxPoints) * 100}%` }}
                                        title={`Completed: ${sprint.velocity} pts`}
                                    ></div>
                                </div>
                                <div className="text-center mt-2">
                                    <p className="text-xs font-medium text-gray-700 truncate max-w-[80px]" title={sprint.sprintName}>
                                        {sprint.sprintName}
                                    </p>
                                    <p className="text-[10px] text-gray-400">{sprint.velocity} pts</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default VelocityChart;
