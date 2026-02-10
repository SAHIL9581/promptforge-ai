import React from 'react'
import { Radar, RadarChart as RechartsRadar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts'

const RadarChart = ({ data }) => {
        const chartData = [
                { subject: 'Clarity', score: data.clarity_score, fullMark: 100 },
                { subject: 'Structure', score: data.structure_score, fullMark: 100 },
                { subject: 'Specificity', score: data.specificity_score, fullMark: 100 },
                { subject: 'Context', score: data.context_score, fullMark: 100 },
                { subject: 'Creativity', score: data.creativity_score, fullMark: 100 },
                { subject: 'Technical', score: data.technical_depth_score, fullMark: 100 }
        ]

        return (
                <ResponsiveContainer width="100%" height={400}>
                        <RechartsRadar data={chartData}>
                                <PolarGrid stroke="#4b5563" />
                                <PolarAngleAxis
                                        dataKey="subject"
                                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                                />
                                <PolarRadiusAxis
                                        angle={90}
                                        domain={[0, 100]}
                                        tick={{ fill: '#9ca3af' }}
                                />
                                <Radar
                                        name="Scores"
                                        dataKey="score"
                                        stroke="#0ea5e9"
                                        fill="#0ea5e9"
                                        fillOpacity={0.6}
                                />
                        </RechartsRadar>
                </ResponsiveContainer>
        )
}

export default RadarChart
