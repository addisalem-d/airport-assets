import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

interface TrendDatum { month: string; count: number }

export default function LineChart({ data }: { data: TrendDatum[] }) {
  const ref = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!ref.current || !data.length) return

    const el     = ref.current
    const width  = el.clientWidth || 500
    const height = 160
    const margin = { top: 16, right: 16, bottom: 32, left: 36 }
    const iW     = width  - margin.left - margin.right
    const iH     = height - margin.top  - margin.bottom

    d3.select(el).selectAll('*').remove()

    const svg = d3.select(el)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    const x = d3.scalePoint().domain(data.map(d => d.month)).range([0, iW]).padding(0.2)
    const y = d3.scaleLinear().domain([0, d3.max(data, d => d.count)! * 1.2]).range([iH, 0])

    svg.append('g')
      .call(d3.axisLeft(y).ticks(4).tickSize(-iW).tickFormat(() => ''))
      .call(g => { g.select('.domain').remove(); g.selectAll('line').attr('stroke', '#f0eeea') })

    svg.append('g')
      .call(d3.axisLeft(y).ticks(4).tickSize(0))
      .call(g => { g.select('.domain').remove(); g.selectAll('text').attr('fill', '#bbb').attr('font-size', '11px').attr('dx', '-4px') })

    svg.append('g')
      .attr('transform', `translate(0,${iH})`)
      .call(d3.axisBottom(x).tickSize(0))
      .call(g => { g.select('.domain').attr('stroke', '#ebe9e4'); g.selectAll('text').attr('fill', '#888').attr('font-size', '11px').attr('dy', '14px') })

    const line = d3.line<TrendDatum>()
      .x(d => x(d.month)!)
      .y(d => y(d.count))
      .curve(d3.curveMonotoneX)

    const area = d3.area<TrendDatum>()
      .x(d => x(d.month)!)
      .y0(iH)
      .y1(d => y(d.count))
      .curve(d3.curveMonotoneX)

    svg.append('path')
      .datum(data)
      .attr('fill', 'rgba(79,124,255,0.08)')
      .attr('d', area)

    const path = svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#4f7cff')
      .attr('stroke-width', 2)
      .attr('d', line)

    const length = path.node()!.getTotalLength()
    path
      .attr('stroke-dasharray', `${length} ${length}`)
      .attr('stroke-dashoffset', length)
      .transition().duration(800).ease(d3.easeCubicOut)
      .attr('stroke-dashoffset', 0)

    svg.selectAll('circle')
      .data(data)
      .join('circle')
      .attr('cx', d => x(d.month)!)
      .attr('cy', d => y(d.count))
      .attr('r', 4)
      .attr('fill', '#4f7cff')
      .attr('opacity', 0)
      .transition().delay((_, i) => i * 100 + 600).duration(200)
      .attr('opacity', 1)

  }, [data])

  return <svg ref={ref} style={{ width: '100%', display: 'block' }} />
}