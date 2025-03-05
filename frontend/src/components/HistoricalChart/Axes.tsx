import * as d3 from "d3";
import { useEffect, useRef } from "react";

type XAxisProps = {
  xScale: d3.ScaleTime<number, number>;
  height: number;
};

type YAxisProps = {
  yScale: d3.ScaleLinear<number, number>;
  displacement: number;
};

export const XAxis = ({ xScale, height }: XAxisProps) => {
  const axisRef = useRef<SVGGElement | null>(null);
  useEffect(() => {
    const xAxis = d3.axisBottom(xScale).ticks(5);
    axisRef.current && d3.select(axisRef.current).call(xAxis);
  }, [xScale]);

  return <g ref={axisRef} id="x-axis" transform={`translate(0, ${height})`} />;
};

export const YAxis = ({ yScale, displacement }: YAxisProps) => {
  const axisRef = useRef<SVGGElement | null>(null);
  useEffect(() => {
    const yAxis = d3.axisLeft(yScale).ticks(5);
    axisRef.current && d3.select(axisRef.current).call(yAxis);
  }, [yScale]);

  return <g ref={axisRef} transform={`translate(${displacement}, 0)`} id="y-axis" />;
}