import * as d3 from 'd3';
import { motion } from 'motion/react'

type DonutChartProps = {
    data?: { label: string, value: number }[];
}
const defaultData = [
    { label: 'A', value: 10 },
    { label: 'B', value: 20 },
    { label: 'C', value: 30 },
    { label: 'D', value: 50 },
]

export const DonutChart = ({data = defaultData}: DonutChartProps) => {
    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2;
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const arc = d3.arc()
        .innerRadius(radius - 100)
        .outerRadius(radius - 20);

    const arcData = d3.pie<{ label: string, value: number }>().padAngle(0.02)
        .value(d => d.value)(data);
    
    const arcDataWithRadii = arcData.map(d => {
        return ({ ...d, innerRadius: radius - 100, outerRadius: radius - 20 })
    })
    
    const arcs = arcDataWithRadii.map((d, i) => {
        const arcPath = arc(d) || '';
        return (
        <g key={i}>
            <motion.path
                d={arcPath}
                fill={color(i.toString())}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            />
            <text
                transform={`translate(${arc.centroid(d)})`}
                textAnchor="middle"
                alignmentBaseline="middle"
                fill="white"
            >
                {d.data.label}
            </text>
        </g>
    )}) 


    return (
        <div
            style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column'
            }}
        >
            <svg style={{ width: '100%', height: '100%' }} viewBox={`0 0 ${width} ${height}`} >
                <g transform={`translate(${width / 2}, ${height / 2})`}>
                    {arcs}
                </g>
            </svg>
        </div>
    )

}