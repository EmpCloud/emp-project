import React from 'react';

type BurndownData = {
    sprintName: string;
    totalPoints: number;
    idealLine: { date: string; points: number }[];
    actualLine: { date: string; points: number }[];
};

type Props = {
    data: BurndownData;
};

const BurndownChart: React.FC<Props> = ({ data }) => {
    const maxPoints = data.totalPoints || 1;
    const chartWidth = 800;
    const chartHeight = 300;
    const padding = { top: 20, right: 30, bottom: 40, left: 50 };
    const innerWidth = chartWidth - padding.left - padding.right;
    const innerHeight = chartHeight - padding.top - padding.bottom;

    const allDates = data.idealLine.map(p => p.date);
    const xScale = (idx: number) => padding.left + (idx / Math.max(allDates.length - 1, 1)) * innerWidth;
    const yScale = (points: number) => padding.top + (1 - points / maxPoints) * innerHeight;

    const buildPath = (line: { date: string; points: number }[]) => {
        if (line.length === 0) return '';
        return line.map((point, idx) => {
            const x = xScale(allDates.indexOf(point.date));
            const y = yScale(point.points);
            return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
        }).join(' ');
    };

    const idealPath = buildPath(data.idealLine);
    const actualPath = buildPath(data.actualLine);

    // Show every Nth label to avoid overlap
    const labelStep = Math.max(1, Math.floor(allDates.length / 10));

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Burndown Chart</h2>
                <p className="text-sm text-gray-500">{data.sprintName} - {data.totalPoints} total story points</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
                {/* Legend */}
                <div className="flex items-center gap-6 mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-0.5 bg-gray-400" style={{ borderTop: '2px dashed #9ca3af' }}></div>
                        <span className="text-xs text-gray-600">Ideal</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-0.5 bg-blue-600"></div>
                        <span className="text-xs text-gray-600">Actual</span>
                    </div>
                </div>

                {data.idealLine.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No data available for burndown chart.</p>
                    </div>
                ) : (
                    <svg width="100%" viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="overflow-visible">
                        {/* Grid lines */}
                        {[0, 0.25, 0.5, 0.75, 1].map(ratio => (
                            <g key={ratio}>
                                <line
                                    x1={padding.left}
                                    y1={yScale(maxPoints * ratio)}
                                    x2={chartWidth - padding.right}
                                    y2={yScale(maxPoints * ratio)}
                                    stroke="#e5e7eb"
                                    strokeWidth={1}
                                />
                                <text
                                    x={padding.left - 8}
                                    y={yScale(maxPoints * ratio) + 4}
                                    textAnchor="end"
                                    fontSize={10}
                                    fill="#9ca3af"
                                >
                                    {Math.round(maxPoints * ratio)}
                                </text>
                            </g>
                        ))}

                        {/* X-axis labels */}
                        {allDates.map((date, idx) => {
                            if (idx % labelStep !== 0 && idx !== allDates.length - 1) return null;
                            return (
                                <text
                                    key={date}
                                    x={xScale(idx)}
                                    y={chartHeight - 5}
                                    textAnchor="middle"
                                    fontSize={9}
                                    fill="#9ca3af"
                                >
                                    {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </text>
                            );
                        })}

                        {/* Ideal line (dashed) */}
                        <path
                            d={idealPath}
                            fill="none"
                            stroke="#9ca3af"
                            strokeWidth={2}
                            strokeDasharray="6 4"
                        />

                        {/* Actual line */}
                        <path
                            d={actualPath}
                            fill="none"
                            stroke="#2563eb"
                            strokeWidth={2.5}
                        />

                        {/* Actual line dots */}
                        {data.actualLine.map((point, idx) => (
                            <circle
                                key={idx}
                                cx={xScale(allDates.indexOf(point.date))}
                                cy={yScale(point.points)}
                                r={3}
                                fill="#2563eb"
                            >
                                <title>{point.date}: {point.points} pts remaining</title>
                            </circle>
                        ))}
                    </svg>
                )}
            </div>
        </div>
    );
};

export default BurndownChart;
