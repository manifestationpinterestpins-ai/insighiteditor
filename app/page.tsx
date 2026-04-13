"use client"

import React from "react"
import { useState, useRef, useEffect } from "react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts"
import { InsightEditorModal } from "@/components/InsightEditorModal"
import { useInsightsStorage } from "@/hooks/useInsightsStorage"
import { InsightsData } from "@/lib/insights-state"

// Custom Icons
const ChevronLeftIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 19-7-7 7-7"/>
    <path d="M19 12H5"/>
  </svg>
)

const MoreHorizontalIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="5" cy="12" r="2" />
    <circle cx="12" cy="12" r="2" />
    <circle cx="19" cy="12" r="2" />
  </svg>
)

const HeartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="white" stroke="none">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>
)

const CommentIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="white" stroke="white" strokeLinejoin="round" strokeWidth="2">
    <path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"/>
  </svg>
)

const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path fill="white" d="M13.973 20.046 21.77 6.928C22.8 5.195 21.55 3 19.535 3H4.466C2.138 3 .984 5.825 2.646 7.456l4.842 4.752 1.723 7.121c.548 2.266 3.571 2.721 4.762.717Z"/>
    <path fill="white" d="m7.488 12.208 8.027-4.567"/>
  </svg>
)

const RepostIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.998 9.497a1 1 0 0 0-1 1v4.228a3.274 3.274 0 0 1-3.27 3.27h-5.313l1.791-1.787a1 1 0 0 0-1.412-1.416L7.29 18.287a1 1 0 0 0-.294.707v.001c0 .023.012.042.013.065a.92.92 0 0 0 .281.643l3.502 3.504a1 1 0 0 0 1.414-1.414l-1.797-1.798h5.318a5.276 5.276 0 0 0 5.27-5.27v-4.228a1 1 0 0 0-1-1Zm-6.41-3.496-1.795 1.795a1 1 0 1 0 1.414 1.414l3.5-3.5a1.003 1.003 0 0 0 0-1.417l-3.5-3.5a1 1 0 0 0-1.414 1.414l1.794 1.794H8.27A5.277 5.277 0 0 0 3 9.271V13.5a1 1 0 0 0 2 0V9.271a3.275 3.275 0 0 1 3.271-3.27Z"/>
  </svg>
)

const BookmarkIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path fill="white" d="m20 21-8-7.56L4 21V3h16z"/>
  </svg>
)

const InfoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-white">
    <circle cx="12.001" cy="12.005" r="10.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
    <circle cx="11.819" cy="7.709" r="1.25"/>
    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.569 16.777h2.863M10.569 11.05H12v5.727"/>
  </svg>
)

const UploadIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
)

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

// ===== GENDER EDITOR =====
const GenderEditor = ({
  menValue,
  onSave,
}: {
  menValue: number
  onSave: (newMen: number) => void
}) => {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(menValue.toFixed(1))
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editing])

  const commit = () => {
    const parsed = parseFloat(value)
    if (!isNaN(parsed) && parsed >= 0 && parsed <= 100) {
      onSave(parsed)
    }
    setEditing(false)
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => { if (e.key === "Enter") commit() }}
        className="bg-zinc-800 border border-fuchsia-500 rounded-lg px-2 py-0.5 text-[13px] text-white text-center w-[70px] outline-none"
        style={{ caretColor: "#D946EF" }}
      />
    )
  }

  return (
    <span
      className="text-[13px] text-zinc-300 cursor-pointer hover:text-fuchsia-400 transition-colors"
      onClick={() => { setValue(menValue.toFixed(1)); setEditing(true) }}
    >
      {menValue.toFixed(1)}%
    </span>
  )
}

// ===== DRAGGABLE VIEWS GRAPH =====
type GraphPoint = { date: string; thisReel: number; typical: number }

const DraggableGraph = ({
  data,
  onChange,
}: {
  data: GraphPoint[]
  onChange: (newData: GraphPoint[]) => void
}) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const [dragging, setDragging] = useState<{ index: number; line: "thisReel" | "typical" } | null>(null)
  const [xLabels, setXLabels] = useState(["28 Jan", "29 Jan", "30 Jan"])
  const [yLabels, setYLabels] = useState(["0", "250", "500"])
  const [editingX, setEditingX] = useState<number | null>(null)
  const [editingY, setEditingY] = useState<number | null>(null)
  const [editValue, setEditValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    try {
      const savedX = localStorage.getItem("graph-xlabels")
      const savedY = localStorage.getItem("graph-ylabels")
      if (savedX) setXLabels(JSON.parse(savedX))
      if (savedY) setYLabels(JSON.parse(savedY))
    } catch {}
  }, [])

  useEffect(() => {
    if ((editingX !== null || editingY !== null) && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editingX, editingY])

  const saveXLabels = (labels: string[]) => {
    setXLabels(labels)
    try { localStorage.setItem("graph-xlabels", JSON.stringify(labels)) } catch {}
  }

  const saveYLabels = (labels: string[]) => {
    setYLabels(labels)
    try { localStorage.setItem("graph-ylabels", JSON.stringify(labels)) } catch {}
  }

  const padding = { top: 20, right: 15, bottom: 35, left: 42 }
  const width = 340
  const height = 180
  const chartW = width - padding.left - padding.right
  const chartH = height - padding.top - padding.bottom

  const yPositions = [
    padding.top + chartH,
    padding.top + chartH / 2,
    padding.top,
  ]

  const maxVal = Math.max(...data.map(d => Math.max(d.thisReel, d.typical)))
  const graphMax = Math.ceil(maxVal / 100) * 100 || 500

  const getX = (i: number) => padding.left + (i / Math.max(data.length - 1, 1)) * chartW
  const getY = (val: number) => padding.top + chartH - (Math.min(val, graphMax) / graphMax) * chartH

  const getValFromY = (clientY: number) => {
    const svg = svgRef.current
    if (!svg) return 0
    const rect = svg.getBoundingClientRect()
    const svgY = ((clientY - rect.top) / rect.height) * height
    const val = ((padding.top + chartH - svgY) / chartH) * graphMax
    return Math.max(0, Math.min(graphMax, Math.round(val)))
  }

  const buildPath = (points: { x: number; y: number }[]) => {
    if (points.length < 2) return ""
    let d = `M ${points[0].x} ${points[0].y}`
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1]
      const curr = points[i]
      const cpx1 = prev.x + (curr.x - prev.x) * 0.35
      const cpx2 = prev.x + (curr.x - prev.x) * 0.65
      d += ` C ${cpx1} ${prev.y}, ${cpx2} ${curr.y}, ${curr.x} ${curr.y}`
    }
    return d
  }

  const thisReelPoints = data.map((d, i) => ({ x: getX(i), y: getY(d.thisReel) }))
  const typicalPoints = data.map((d, i) => ({ x: getX(i), y: getY(d.typical) }))

  const handlePointerDown = (index: number, line: "thisReel" | "typical", e: React.PointerEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const target = e.target as Element
    target.setPointerCapture?.(e.pointerId)
    setDragging({ index, line })
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging) return
    e.preventDefault()
    const val = getValFromY(e.clientY)
    const newData = [...data]
    newData[dragging.index] = { ...newData[dragging.index], [dragging.line]: val }
    onChange(newData)
  }

  const handlePointerUp = () => setDragging(null)

  const xPositions = [
    padding.left,
    padding.left + chartW / 2,
    padding.left + chartW,
  ]

  const commitEdit = () => {
    if (editingX !== null) {
      const updated = [...xLabels]
      updated[editingX] = editValue
      saveXLabels(updated)
      setEditingX(null)
    }
    if (editingY !== null) {
      const updated = [...yLabels]
      updated[editingY] = editValue
      saveYLabels(updated)
      setEditingY(null)
    }
    setEditValue("")
  }

  return (
    <div className="relative">
      {(editingX !== null || editingY !== null) && (
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <input
            ref={inputRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={(e) => { if (e.key === "Enter") commitEdit() }}
            className="pointer-events-auto bg-zinc-800 border border-fuchsia-500 rounded-lg px-3 py-1.5 text-[13px] text-white text-center w-[100px] outline-none shadow-lg"
            style={{ caretColor: "#D946EF" }}
          />
        </div>
      )}

      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full touch-none select-none"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {yPositions.map((yPos, i) => (
          <line key={`yline-${i}`} x1={padding.left} y1={yPos} x2={width - padding.right} y2={yPos} stroke="#27272a" strokeWidth={1} />
        ))}

        {yLabels.map((label, i) => (
          <text key={`ylabel-${i}`} x={padding.left - 6} y={yPositions[i] + 4} textAnchor="end" fill={editingY === i ? "#D946EF" : "#a1a1aa"} fontSize="10" fontFamily="Roboto, sans-serif" className="cursor-pointer" onClick={() => { setEditingY(i); setEditingX(null); setEditValue(label) }}>
            {label}
          </text>
        ))}

        {xLabels.map((label, i) => (
          <text key={`xlabel-${i}`} x={xPositions[i]} y={height - 8} textAnchor="middle" fill={editingX === i ? "#D946EF" : "#a1a1aa"} fontSize="10" fontFamily="Roboto, sans-serif" className="cursor-pointer" onClick={() => { setEditingX(i); setEditingY(null); setEditValue(label) }}>
            {label}
          </text>
        ))}

        <path d={buildPath(typicalPoints)} fill="none" stroke="#a1a1aa" strokeWidth={3.5} strokeDasharray="6 10" strokeLinecap="round" />
        <path d={buildPath(thisReelPoints)} fill="none" stroke="#C026D3" strokeWidth={4} strokeLinecap="round" />

        {data.map((d, i) => (
          <circle key={`tr-${i}`} cx={getX(i)} cy={getY(d.thisReel)} r={18} fill="transparent" className="cursor-grab active:cursor-grabbing" onPointerDown={(e) => handlePointerDown(i, "thisReel", e)} style={{ touchAction: "none" }} />
        ))}
        {data.map((d, i) => (
          <circle key={`tp-${i}`} cx={getX(i)} cy={getY(d.typical)} r={18} fill="transparent" className="cursor-grab active:cursor-grabbing" onPointerDown={(e) => handlePointerDown(i, "typical", e)} style={{ touchAction: "none" }} />
        ))}
      </svg>
    </div>
  )
}

// ===== DRAGGABLE RETENTION GRAPH =====
type RetentionPoint = { time: string; retention: number }

const DraggableRetentionGraph = ({
  data,
  onChange,
}: {
  data: RetentionPoint[]
  onChange: (newData: RetentionPoint[]) => void
}) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const [dragging, setDragging] = useState<number | null>(null)

  const padding = { top: 20, right: 15, bottom: 35, left: 45 }
  const width = 340
  const height = 180
  const chartW = width - padding.left - padding.right
  const chartH = height - padding.top - padding.bottom

  const getX = (i: number) => padding.left + (i / Math.max(data.length - 1, 1)) * chartW
  const getY = (val: number) => padding.top + chartH - (Math.min(val, 100) / 100) * chartH

  const getValFromY = (clientY: number) => {
    const svg = svgRef.current
    if (!svg) return 0
    const rect = svg.getBoundingClientRect()
    const svgY = ((clientY - rect.top) / rect.height) * height
    const val = ((padding.top + chartH - svgY) / chartH) * 100
    return Math.max(0, Math.min(100, Math.round(val)))
  }

  const buildPath = (points: { x: number; y: number }[]) => {
    if (points.length < 2) return ""
    let d = `M ${points[0].x} ${points[0].y}`
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1]
      const curr = points[i]
      const cpx1 = prev.x + (curr.x - prev.x) * 0.35
      const cpx2 = prev.x + (curr.x - prev.x) * 0.65
      d += ` C ${cpx1} ${prev.y}, ${cpx2} ${curr.y}, ${curr.x} ${curr.y}`
    }
    return d
  }

  const points = data.map((d, i) => ({ x: getX(i), y: getY(d.retention) }))
  const pathD = buildPath(points)
  const areaD = points.length > 1
    ? `${pathD} L ${points[points.length - 1].x} ${padding.top + chartH} L ${points[0].x} ${padding.top + chartH} Z`
    : ""

  const handlePointerDown = (index: number, e: React.PointerEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const target = e.target as Element
    target.setPointerCapture?.(e.pointerId)
    setDragging(index)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (dragging === null) return
    e.preventDefault()
    const val = getValFromY(e.clientY)
    const newData = [...data]
    newData[dragging] = { ...newData[dragging], retention: val }
    onChange(newData)
  }

  const handlePointerUp = () => setDragging(null)

  const yTicks = [0, 50, 100]
  const xTickIndices = [0, Math.floor(data.length / 2), data.length - 1]

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${width} ${height}`}
      className="w-full touch-none select-none"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <defs>
        <linearGradient id="retentionDragGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C026D3" stopOpacity={0.2} />
          <stop offset="100%" stopColor="#C026D3" stopOpacity={0} />
        </linearGradient>
      </defs>

      {yTicks.map((tick) => (
        <g key={tick}>
          <line x1={padding.left} y1={getY(tick)} x2={width - padding.right} y2={getY(tick)} stroke="#3f3f46" strokeWidth={1} />
          <text x={padding.left - 4} y={getY(tick) + 4} textAnchor="end" fill="#a1a1aa" fontSize="10" fontFamily="Roboto, sans-serif">
            {tick}%
          </text>
        </g>
      ))}

      {xTickIndices.map((idx) => (
        data[idx] && (
          <text key={idx} x={getX(idx)} y={height - 8} textAnchor="middle" fill="#a1a1aa" fontSize="10" fontFamily="Roboto, sans-serif">
            {data[idx].time}
          </text>
        )
      ))}

      <line x1={padding.left} y1={padding.top + chartH} x2={width - padding.right} y2={padding.top + chartH} stroke="#3f3f46" strokeWidth={1} />

      <path d={areaD} fill="url(#retentionDragGradient)" />
      <path d={pathD} fill="none" stroke="#C026D3" strokeWidth={2.5} strokeLinecap="round" />

      {data.map((d, i) => (
        <circle
          key={i}
          cx={getX(i)}
          cy={getY(d.retention)}
          r={16}
          fill="transparent"
          className="cursor-grab active:cursor-grabbing"
          onPointerDown={(e) => handlePointerDown(i, e)}
          style={{ touchAction: "none" }}
        />
      ))}
    </svg>
  )
}

export default function ReelInsights() {
  const { data: insightsData, saveData, isLoaded } = useInsightsStorage()
  const [thumbnailImage, setThumbnailImage] = useState<string | null>(null)
  const [retentionThumbnail, setRetentionThumbnail] = useState<string | null>(null)
  const [viewsFilter, setViewsFilter] = useState<"All" | "Followers" | "Non-followers">("All")
  const [audienceTab, setAudienceTab] = useState<"Gender" | "Country" | "Age">("Gender")
  const [animateCharts, setAnimateCharts] = useState(false)
  const [editorOpen, setEditorOpen] = useState(false)
  const thumbnailInputRef = useRef<HTMLInputElement>(null)
  const retentionInputRef = useRef<HTMLInputElement>(null)

  const DEFAULT_GRAPH_DATA: GraphPoint[] = [
    { date: "28 Jan", thisReel: 80,  typical: 60  },
    { date: "28 Jan", thisReel: 200, typical: 80  },
    { date: "28 Jan", thisReel: 170, typical: 90  },
    { date: "29 Jan", thisReel: 320, typical: 75  },
    { date: "29 Jan", thisReel: 290, typical: 100 },
    { date: "29 Jan", thisReel: 400, typical: 85  },
    { date: "30 Jan", thisReel: 370, typical: 95  },
    { date: "30 Jan", thisReel: 460, typical: 80  },
    { date: "30 Jan", thisReel: 481, typical: 110 },
  ]

  const [graphData, setGraphData] = useState<GraphPoint[]>(DEFAULT_GRAPH_DATA)
  const [retentionData, setRetentionData] = useState<RetentionPoint[]>(insightsData.retentionData)

  // Randomize certain values on each page load
  useEffect(() => {
    const followerPct = parseFloat((Math.random() * (10 - 2) + 2).toFixed(1))
    const skipThis = parseFloat((Math.random() * (20 - 10) + 10).toFixed(1))
    const skipTypical = parseFloat((Math.random() * (30 - 20) + 20).toFixed(1))

    // Random country data US > UK > Canada > Australia > Germany > Others
    const us = parseFloat((Math.random() * (45 - 35) + 35).toFixed(1))
    const uk = parseFloat((Math.random() * (28 - 20) + 20).toFixed(1))
    const ca = parseFloat((Math.random() * (18 - 12) + 12).toFixed(1))
    const au = parseFloat((Math.random() * (13 - 8) + 8).toFixed(1))
    const de = parseFloat((Math.random() * (7 - 4) + 4).toFixed(1))
    const others = parseFloat((100 - us - uk - ca - au - de).toFixed(1))

    // Random age data
    const a1824 = parseFloat((Math.random() * (48 - 35) + 35).toFixed(1))
    const a2534 = parseFloat((Math.random() * (42 - 30) + 30).toFixed(1))
    const a3544 = parseFloat((Math.random() * (10 - 5) + 5).toFixed(1))
    const a4554 = parseFloat((Math.random() * (4 - 1) + 1).toFixed(1))
    const a5564 = parseFloat((Math.random() * (1.5 - 0.3) + 0.3).toFixed(1))
    const a65 = parseFloat((Math.random() * (1 - 0.2) + 0.2).toFixed(1))
    const a1317 = parseFloat((100 - a1824 - a2534 - a3544 - a4554 - a5564 - a65).toFixed(1))

    // Random sources
    const reels = parseFloat((Math.random() * (85 - 75) + 75).toFixed(1))
    const explore = parseFloat((Math.random() * (15 - 10) + 10).toFixed(1))
    const remaining = parseFloat((100 - reels - explore).toFixed(1))
    const stories = parseFloat((remaining * 0.55).toFixed(1))
    const profile = parseFloat((remaining * 0.28).toFixed(1))
    const feed = parseFloat((remaining - stories - profile).toFixed(1))

    saveData({
      ...insightsData,
      followerPercentage: followerPct,
      skipRateThis: skipThis,
      skipRateTypical: skipTypical,
      countryData: [
        { name: "United States", percentage: us },
        { name: "United Kingdom", percentage: uk },
        { name: "Canada", percentage: ca },
        { name: "Australia", percentage: au },
        { name: "Germany", percentage: de },
        { name: "Others", percentage: Math.max(0, others) },
      ],
      ageData: [
        { name: "13-17", percentage: Math.max(0, a1317) },
        { name: "18-24", percentage: a1824 },
        { name: "25-34", percentage: a2534 },
        { name: "35-44", percentage: a3544 },
        { name: "45-54", percentage: a4554 },
        { name: "55-64", percentage: a5564 },
        { name: "65+", percentage: a65 },
      ],
      sourcesData: [
        { name: "Reels tab", percentage: reels },
        { name: "Explore", percentage: explore },
        { name: "Stories", percentage: stories },
        { name: "Profile", percentage: profile },
        { name: "Feed", percentage: Math.max(0, feed) },
      ],
    })
  }, [])

  useEffect(() => {
    try {
      const saved = localStorage.getItem("graph-data")
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) setGraphData(parsed)
      }
      const savedRetention = localStorage.getItem("retention-data")
      if (savedRetention) {
        const parsed = JSON.parse(savedRetention)
        if (Array.isArray(parsed) && parsed.length > 0) setRetentionData(parsed)
      }
    } catch {}
  }, [])

  const handleGraphChange = (newData: GraphPoint[]) => {
    setGraphData(newData)
    try { localStorage.setItem("graph-data", JSON.stringify(newData)) } catch {}
  }

  const handleRetentionChange = (newData: RetentionPoint[]) => {
    setRetentionData(newData)
    try { localStorage.setItem("retention-data", JSON.stringify(newData)) } catch {}
  }

  useEffect(() => {
    const timer = setTimeout(() => setAnimateCharts(true), 300)
    return () => clearTimeout(timer)
  }, [insightsData])

  const handleEditorSave = (updatedData: InsightsData) => {
    saveData(updatedData)
    setAnimateCharts(false)
    setTimeout(() => setAnimateCharts(true), 50)
  }

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => { setThumbnailImage(event.target?.result as string) }
      reader.readAsDataURL(file)
    }
  }

  const handleRetentionThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => { setRetentionThumbnail(event.target?.result as string) }
      reader.readAsDataURL(file)
    }
  }

  const DonutChart = ({
    value,
    label,
    followerPercent,
  }: {
    value: string
    label: string
    followerPercent: number
  }) => {
    const [progress, setProgress] = useState(0)
    const radius = 110
    const strokeWidth = 14
    const circumference = 2 * Math.PI * radius

    useEffect(() => {
      if (animateCharts) {
        const timer = setTimeout(() => setProgress(1), 100)
        return () => clearTimeout(timer)
      }
    }, [animateCharts])

    const followerStroke = (followerPercent / 100) * circumference * progress
    const nonFollowerStroke = ((100 - followerPercent) / 100) * circumference * progress

    return (
      <div className="relative flex items-center justify-center py-6">
        <svg width="260" height="260" className="transform -rotate-90">
          <circle cx="130" cy="130" r={radius} fill="none" stroke="#27272a" strokeWidth={strokeWidth} />
          <circle cx="130" cy="130" r={radius} fill="none" stroke="#7C3AED" strokeWidth={strokeWidth} strokeDasharray={`${nonFollowerStroke} ${circumference}`} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
          <circle cx="130" cy="130" r={radius} fill="none" stroke="#C026D3" strokeWidth={strokeWidth} strokeDasharray={`${followerStroke} ${circumference}`} strokeDashoffset={-nonFollowerStroke} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-xs text-zinc-400 tracking-wide">{label}</span>
          <span className="text-[38px] font-semibold text-white tracking-tight">{value}</span>
        </div>
      </div>
    )
  }

  const ProgressBar = ({
    percentage,
    color = "magenta",
    delay = 0,
  }: {
    percentage: number
    color?: "magenta" | "violet" | "blue"
    delay?: number
  }) => {
    const [width, setWidth] = useState(0)

    useEffect(() => {
      if (animateCharts) {
        const timer = setTimeout(() => setWidth(percentage), delay)
        return () => clearTimeout(timer)
      }
    }, [animateCharts, percentage, delay])

    const colorClasses = {
      magenta: "bg-fuchsia-600",
      violet: "bg-violet-700",
      blue: "bg-blue-500",
    }

    return (
      <div className="relative w-full h-[9px] bg-zinc-800 rounded-full overflow-hidden">
        <div
          className={`absolute left-0 top-0 h-full ${colorClasses[color]} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${width}%` }}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans antialiased">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-sm border-b border-zinc-900">
        <div className="flex items-center justify-between px-4 h-[52px]">
          <button className="p-1 -ml-1 active:opacity-60 transition-opacity">
            <ChevronLeftIcon />
          </button>
          <h1 className="text-[17px] font-semibold flex-1 ml-3">Reel insights</h1>
          <button
            className="p-1 -mr-1 active:opacity-60 transition-opacity"
            onClick={() => setEditorOpen(true)}
            title="Edit insights"
          >
            <MoreHorizontalIcon />
          </button>
        </div>
      </header>

      <main className="pb-12">
        {/* Thumbnail Section */}
        <section className="flex flex-col items-center pt-4 pb-6 px-4">
          <div
            className="relative w-[130px] h-[200px] bg-zinc-900 rounded-lg overflow-hidden cursor-pointer group shadow-lg"
            onClick={() => thumbnailInputRef.current?.click()}
          >
            {thumbnailImage ? (
              <>
                <img src={thumbnailImage || "/placeholder.svg"} alt="Reel thumbnail" className="w-full h-full object-cover" />
                <button
                  className="absolute top-2 right-2 p-1.5 bg-black/70 rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                  onClick={(e) => { e.stopPropagation(); setThumbnailImage(null) }}
                >
                  <CloseIcon />
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-zinc-500 hover:text-zinc-300 transition-colors">
                <UploadIcon />
                <span className="text-[10px] mt-2 font-medium">Upload thumbnail</span>
              </div>
            )}
            <input ref={thumbnailInputRef} type="file" accept="image/*" className="hidden" onChange={handleThumbnailUpload} />
          </div>

          <h2 className="text-[13px] font-semibold mt-4 text-center px-4 leading-tight">{insightsData.caption}</h2>
          <p className="text-[10px] text-zinc-400 mt-1">{insightsData.publishDate} · Duration {insightsData.videoDuration}</p>

          <div className="flex items-center justify-between w-full max-w-[340px] mt-5 px-2">
            <div className="flex flex-col items-center gap-1">
              <HeartIcon />
              <span className="text-[10px] font-medium">{insightsData.likes}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <CommentIcon />
              <span className="text-[10px] font-medium">{insightsData.comments}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <SendIcon />
              <span className="text-[10px] font-medium">{insightsData.shares}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <RepostIcon />
              <span className="text-[10px] font-medium">{insightsData.reposts}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <BookmarkIcon />
              <span className="text-[10px] font-medium">{insightsData.bookmarks}</span>
            </div>
          </div>
        </section>

        <div className="h-[6px] bg-zinc-900" />

        {/* Overview */}
        <section className="px-4 py-5">
          <div className="flex items-center gap-2 mb-5">
            <h3 className="text-[18px] font-semibold">Overview</h3>
            <InfoIcon />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[13px] text-zinc-300">Views</span>
              <span className="text-[13px] text-zinc-300">{insightsData.views}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[13px] text-zinc-300">Watch time</span>
              <span className="text-[13px] text-zinc-300">{insightsData.watchTime}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[13px] text-zinc-300">Interactions</span>
              <span className="text-[13px] text-zinc-300">{insightsData.likes + insightsData.comments + insightsData.shares + insightsData.reposts + insightsData.bookmarks}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[13px] text-zinc-300">Profile activity</span>
              <span className="text-[13px] text-zinc-300">0</span>
            </div>
          </div>
        </section>

        <div className="h-[6px] bg-zinc-900" />

        {/* Views Donut */}
        <section className="px-4 py-5">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-[18px] font-semibold">Views</h3>
            <InfoIcon />
          </div>
          <DonutChart value={insightsData.views.toString()} label="Views" followerPercent={insightsData.followerPercentage} />
          <div className="space-y-3 mt-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-[6px] h-[6px] rounded-full bg-fuchsia-600" />
                <span className="text-[13px] text-zinc-300">Followers</span>
              </div>
              <span className="text-[13px] text-zinc-300">{insightsData.followerPercentage.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-[6px] h-[6px] rounded-full bg-violet-600" />
                <span className="text-[13px] text-zinc-300">Non-followers</span>
              </div>
              <span className="text-[13px] text-zinc-300">{(100 - insightsData.followerPercentage).toFixed(1)}%</span>
            </div>
          </div>
        </section>

        <div className="h-px bg-zinc-800 mx-4" />

        {/* Views Over Time */}
        <section className="px-4 py-5">
          <h4 className="text-[15px] font-semibold mb-4">Views over time</h4>
          <div className="flex gap-2 mb-5">
            {(["All", "Followers", "Non-followers"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setViewsFilter(filter)}
                className={`px-4 py-[9px] rounded-full text-[11px] font-medium transition-all duration-200 ${
                  viewsFilter === filter
                    ? "bg-zinc-800 text-white"
                    : "bg-transparent text-white border border-zinc-800"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          <DraggableGraph data={graphData} onChange={handleGraphChange} />
          <div className="flex items-center justify-center gap-6 mt-2">
            <div className="flex items-center gap-2">
              <div className="w-[6px] h-[6px] rounded-full bg-fuchsia-600" />
              <span className="text-[11px] text-zinc-400">This reel</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-[6px] h-[6px] rounded-full bg-zinc-400" />
              <span className="text-[11px] text-zinc-400">Your typical reel views</span>
            </div>
          </div>
        </section>

        <div className="h-px bg-zinc-800 mx-4" />

        {/* Top Sources */}
        <section className="px-4 py-5">
          <h4 className="text-[15px] font-semibold mb-5">Top sources of views</h4>
          <div className="space-y-5">
            {insightsData.sourcesData.map((source, index) => (
              <div key={source.name}>
                <div className="flex justify-between mb-2">
                  <span className="text-[13px] text-zinc-300">{source.name}</span>
                  <span className="text-[13px] text-zinc-300">{source.percentage.toFixed(1)}%</span>
                </div>
                <ProgressBar percentage={source.percentage} delay={index * 100} />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-6 pt-5 border-t border-zinc-800">
            <span className="text-[14px] text-zinc-300">Accounts reached</span>
            <span className="text-[14px] text-zinc-300">{insightsData.accountsReached.toLocaleString()}</span>
          </div>
        </section>

        <div className="h-[6px] bg-zinc-900" />

        {/* Retention */}
        <section className="px-4 py-5">
          <div className="flex items-center gap-2 mb-5">
            <h3 className="text-[18px] font-semibold">Retention</h3>
            <InfoIcon />
          </div>
          <div className="flex justify-center mb-6">
            <div
              className="relative w-[105px] h-[180px] bg-zinc-900 rounded-xl overflow-hidden cursor-pointer group shadow-xl"
              onClick={() => retentionInputRef.current?.click()}
            >
              {retentionThumbnail ? (
                <>
                  <img src={retentionThumbnail || "/placeholder.svg"} alt="Retention thumbnail" className="w-full h-full object-cover" />
                  <button
                    className="absolute top-2 right-2 p-1.5 bg-black/70 rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                    onClick={(e) => { e.stopPropagation(); setRetentionThumbnail(null) }}
                  >
                    <CloseIcon />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-zinc-500">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <span className="text-[10px] mt-2">Upload</span>
                </div>
              )}
              {/* Play Icon */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"/>
                </svg>
              </div>
              <input ref={retentionInputRef} type="file" accept="image/*" className="hidden" onChange={handleRetentionThumbnailUpload} />
            </div>
          </div>

          <div className="-ml-2">
            <DraggableRetentionGraph data={retentionData} onChange={handleRetentionChange} />
          </div>

          <div className="mt-6">
            <h4 className="text-[15px] font-semibold mb-4">Skip rate</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-[13px] text-zinc-300">{"This reel's skip rate"}</span>
                <span className="text-[13px] text-zinc-300">{insightsData.skipRateThis.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[13px] text-zinc-300">Your typical skip rate</span>
                <span className="text-[13px] text-zinc-300">{insightsData.skipRateTypical.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-5 border-t border-zinc-800 space-y-3">
            <div className="flex justify-between">
              <span className="text-[13px] text-zinc-300">Watch time</span>
              <span className="text-[13px] text-zinc-300">{insightsData.watchTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[13px] text-zinc-300">Average watch time</span>
              <span className="text-[13px] text-zinc-300">{insightsData.avgWatchTime}</span>
            </div>
          </div>
        </section>

        <div className="h-[6px] bg-zinc-900" />

        {/* Interactions */}
        <section className="px-4 py-5">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-[18px] font-semibold">Interactions</h3>
            <InfoIcon />
          </div>
          <DonutChart
            value={(insightsData.likes + insightsData.comments + insightsData.shares + insightsData.reposts + insightsData.bookmarks).toString()}
            label="Interactions"
            followerPercent={insightsData.followerPercentage}
          />
          <div className="space-y-3 mt-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-[6px] h-[6px] rounded-full bg-fuchsia-600" />
                <span className="text-[13px] text-zinc-300">Followers</span>
              </div>
              <span className="text-[13px] text-zinc-300">{insightsData.followerPercentage.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-[6px] h-[6px] rounded-full bg-violet-600" />
                <span className="text-[13px] text-zinc-300">Non-followers</span>
              </div>
              <span className="text-[13px] text-zinc-300">{(100 - insightsData.followerPercentage).toFixed(1)}%</span>
            </div>
          </div>
          <div className="h-px bg-zinc-800 my-5" />
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-[13px] text-zinc-300">Likes</span>
              <span className="text-[13px] text-zinc-300">{insightsData.likes}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[13px] text-zinc-300">Saves</span>
              <span className="text-[13px] text-zinc-300">{insightsData.bookmarks}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[13px] text-zinc-300">Shares</span>
              <span className="text-[13px] text-zinc-300">{insightsData.shares}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[13px] text-zinc-300">Reposts</span>
              <span className="text-[13px] text-zinc-300">{insightsData.reposts}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[13px] text-zinc-300">Comments</span>
              <span className="text-[13px] text-zinc-300">{insightsData.comments}</span>
            </div>
          </div>
        </section>

        <div className="h-[6px] bg-zinc-900" />

        {/* Profile Activity */}
        <section className="px-4 py-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-[15px] font-semibold">Profile activity</h3>
              <InfoIcon />
            </div>
            <span className="text-[15px] font-semibold">1</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[13px] text-zinc-300">Follows</span>
            <span className="text-[13px] text-zinc-300">1</span>
          </div>
        </section>

        <div className="h-[6px] bg-zinc-900" />

        {/* Audience */}
        <section className="px-4 py-5">
          <div className="flex items-center gap-2 mb-5">
            <h3 className="text-[18px] font-semibold">Audience</h3>
            <InfoIcon />
          </div>
          <div className="flex gap-2 mb-5">
            {(["Gender", "Country", "Age"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setAudienceTab(tab)}
                className={`px-4 py-[9px] rounded-full text-[11px] font-medium transition-all duration-200 ${
                  audienceTab === tab
                    ? "bg-zinc-800 text-white"
                    : "bg-transparent text-white border border-zinc-800"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {audienceTab === "Gender" && (
            <div className="space-y-5">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-[13px] text-zinc-300">Men</span>
                  <GenderEditor
                    menValue={insightsData.genderData.men}
                    onSave={(newMen) => {
                      const newWomen = parseFloat((100 - newMen).toFixed(1))
                      saveData({
                        ...insightsData,
                        genderData: { men: newMen, women: newWomen },
                      })
                    }}
                  />
                </div>
                <ProgressBar percentage={insightsData.genderData.men} delay={0} />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-[13px] text-zinc-300">Women</span>
                  <span className="text-[13px] text-zinc-300">{insightsData.genderData.women.toFixed(1)}%</span>
                </div>
                <ProgressBar percentage={insightsData.genderData.women} color="violet" delay={100} />
              </div>
            </div>
          )}

          {audienceTab === "Country" && (
            <div className="space-y-5">
              {insightsData.countryData.map((country, index) => (
                <div key={country.name}>
                  <div className="flex justify-between mb-2">
                    <span className="text-[13px] text-zinc-300">{country.name}</span>
                    <span className="text-[13px] text-zinc-300">{country.percentage.toFixed(1)}%</span>
                  </div>
                  <ProgressBar percentage={country.percentage} delay={index * 80} />
                </div>
              ))}
            </div>
          )}

          {audienceTab === "Age" && (
            <div className="space-y-5">
              {insightsData.ageData.map((age, index) => (
                <div key={age.name}>
                  <div className="flex justify-between mb-2">
                    <span className="text-[13px] text-zinc-300">{age.name}</span>
                    <span className="text-[13px] text-zinc-300">{age.percentage.toFixed(1)}%</span>
                  </div>
                  <ProgressBar percentage={age.percentage} delay={index * 60} />
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="h-8" />
      </main>

      <InsightEditorModal
        open={editorOpen}
        onOpenChange={setEditorOpen}
        data={insightsData}
        onSave={handleEditorSave}
      />
    </div>
  )
}
