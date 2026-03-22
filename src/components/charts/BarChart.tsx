import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

export interface BarChartDataItem {
  label: string
  value: number
}

interface BarChartProps {
  data: BarChartDataItem[]
  width?: number
  height?: number
}

export default function BarChart({ data, width = 560, height = 300 }: BarChartProps) {
  const svgRef = useRef<SVGSVGElement | null>(null)

  useEffect(() => {
    if (!svgRef.current) return

    const margin = { top: 20, right: 20, bottom: 40, left: 70 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const g = svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    const x = d3
      .scaleBand<string>()
      .domain(data.map(d => d.label))
      .range([0, innerWidth])
      .padding(0.2)

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d.value) ?? 0])
      .nice()
      .range([innerHeight, 0])

    g.append('g')
      .call(d3.axisLeft(y).ticks(5).tickFormat(d3.format('~s')))
      .attr('class', 'axis')

    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x))
      .attr('class', 'axis')
      .selectAll('text')
      .attr('transform', 'rotate(-25)')
      .style('text-anchor', 'end')

    g.selectAll('.bar')
      .data(data)
      .join('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.label) ?? 0)
      .attr('y', d => y(d.value))
      .attr('height', d => innerHeight - y(d.value))
      .attr('width', x.bandwidth())
      .attr('fill', '#4f46e5')
      .on('mouseover', function () {
        d3.select(this).attr('fill', '#6366f1')
      })
      .on('mouseout', function () {
        d3.select(this).attr('fill', '#4f46e5')
      })

  }, [data, width, height])

  return (
    <div style={{ overflowX: 'auto' }}>
      <svg ref={svgRef} width={width} height={height} />
    </div>
  )
}
