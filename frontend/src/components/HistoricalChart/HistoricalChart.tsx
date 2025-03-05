import * as d3 from "d3";
import { motion } from "framer-motion";
import { XAxis, YAxis} from "./Axes";

type HistoricalChartProps = {
    data?: { date: string; value: number }[];
} & React.HTMLAttributes<HTMLDivElement>;

export const HistoricalChart = ({
    data = [],
    ...delegated
}: HistoricalChartProps) => {
    if (data.length === 0) return null;

    const margins = { top: 20, right: 50, bottom: 20, left: 50 };

    const width = 800;
    const height = 400;

    const xPoints = data.map((d) => new Date(d.date));
    const yPoints = data.map((d) => d.value);

    const xExtent = d3.extent(xPoints) as [Date, Date];
    const yExtent = d3.extent(yPoints) as [number, number];

    const xScale = d3.scaleTime().domain(xExtent).range([0 + margins.left, width - margins.right]);
    const yScale = d3.scaleLinear().domain(yExtent).range([height - margins.bottom, 0 + margins.top]);

    const line = d3
        .line<{ date: string; value: number }>()
        .x((d) => xScale(new Date(d.date)))
        .y((d) => yScale(d.value));

    const linePath = line(data) || "";

    const area = d3
        .area<{ date: string; value: number }>()
        .x((d) => xScale(new Date(d.date)))
        .y0(yScale(0))
        .y((d) => yScale(d.value));

    const areaPath = area(data) || "";

    return (
        <div
            style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
            }}
            {...delegated}
        >
            <svg
                style={{ width: "100%", height: "100%" }}
                viewBox={`0 0 ${width} ${height}`}
            >
                <XAxis xScale={xScale} height={height - margins.bottom} />
                <YAxis yScale={yScale} displacement={margins.left}/>
                (/* line chart */)
                <motion.path
                    key={linePath}
                    d={linePath}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2 }}
                    fill={"none"}
                    stroke={"#8884d8"}
                    strokeWidth={2}
                />
                <motion.path
                    key={areaPath}
                    d={areaPath}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2 }}
                    fill={"#8884d8"}
                    fillOpacity={0.3}
                />
            </svg>
        </div>
    );
};
