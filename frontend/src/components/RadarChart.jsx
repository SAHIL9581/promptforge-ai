import React from 'react';
import {
        Radar,
        RadarChart as RechartsRadar,
        PolarGrid,
        PolarAngleAxis,
        PolarRadiusAxis,
        ResponsiveContainer
} from 'recharts';

const RadarChart = ({ data }) => {
        // Handle empty or missing data
        if (!data) {
                return (
                        <div className="flex items-center justify-center h-[400px] text-text-secondary">
                                <div className="text-center">
                                        <div className="text-4xl mb-2">📊</div>
                                        <p className="text-sm">No skill data available yet</p>
                                        <p className="text-xs mt-1">Complete some challenges to see your skill distribution</p>
                                </div>
                        </div>
                );
        }

        const chartData = [
                { subject: 'Clarity', score: data.clarity_score || 0, fullMark: 100 },
                { subject: 'Structure', score: data.structure_score || 0, fullMark: 100 },
                { subject: 'Specificity', score: data.specificity_score || 0, fullMark: 100 },
                { subject: 'Context', score: data.context_score || 0, fullMark: 100 },
                { subject: 'Creativity', score: data.creativity_score || 0, fullMark: 100 },
                { subject: 'Technical', score: data.technical_depth_score || 0, fullMark: 100 }
        ];

        return (
                <ResponsiveContainer width="100%" height={400}>
                        <RechartsRadar data={chartData}>
                                <PolarGrid
                                        stroke="#2d2d44"
                                        strokeWidth={1}
                                />
                                <PolarAngleAxis
                                        dataKey="subject"
                                        tick={{
                                                fill: '#f8fafc',
                                                fontSize: 13,
                                                fontWeight: 500,
                                                fontFamily: 'Manrope, sans-serif'
                                        }}
                                />
                                <PolarRadiusAxis
                                        angle={90}
                                        domain={[0, 100]}
                                        tick={{
                                                fill: '#94a3b8',
                                                fontSize: 11
                                        }}
                                        tickCount={6}
                                />
                                <Radar
                                        name="Scores"
                                        dataKey="score"
                                        stroke="#6366f1"
                                        fill="#6366f1"
                                        fillOpacity={0.3}
                                        strokeWidth={2}
                                        dot={{
                                                fill: '#6366f1',
                                                strokeWidth: 2,
                                                r: 4,
                                                stroke: '#fff'
                                        }}
                                        activeDot={{
                                                fill: '#fff',
                                                stroke: '#6366f1',
                                                strokeWidth: 2,
                                                r: 6
                                        }}
                                />
                        </RechartsRadar>
                </ResponsiveContainer>
        );
};

export default RadarChart;