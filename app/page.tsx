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

const PlayIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <polygon points="5 3 19 12 5 21 5 3" fill="white" fillOpacity="0.9" stroke="none" />
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

// ===== DRAGGABLE GRAPH COMPONENT =====
const DraggableGraph = ({
  data,
  onChange,
}: {
  data: { date: string; thisReel: number; typical: number }[]
  onChange: (newData: { date: string; thisReel: number; typical: number }[]) => void
}) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const [dragging, setDragging] = useState<{ index: number; line: "thisReel" | "typical" } | null>(null)
    const [yTicks, setYTicks] = useState(() => {
    try {
      const saved = localStorage.getItem("graph-yticks")
      if (saved) return JSON.parse(saved)
    } catch {}
    return [0, 250, 500]
  })
  const [showEditor, setShowEditor] = useState(false)
  const [tempYTicks, setTempYTicks] = useState([0, 250, 500])
  const [tempData, setTempData] = useState(data)

  const padding = { top: 20, right: 15, bottom: 35, left: 42 }
  const width = 340
  const height = 180
  const chartW = width - padding.left - padding.right
  const chartH = height - padding.top - padding.bottom
  const yMax = yTicks[yTicks.length - 1] || 500

  const getX = (i: number) => padding.left + (i / Math.max(data.length - 1, 1)) * chartW
  const getY = (val: number) => padding.top + chartH - (Math.min(val, yMax) / yMax) * chartH

  const getValFromY = (clientY: number) => {
    const svg = svgRef.current
    if (!svg) return 0
    const rect = svg.getBoundingClientRect()
    const svgY = ((clientY - rect.top) / rect.height) * height
    const val = ((padding.top + chartH - svgY) / chartH) * yMax
    return Math.max(0, Math.min(yMax, Math.round(val)))
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

  const handlePointerUp = () => {
    setDragging(null)
  }

  // Get unique dates for x-axis labels
  const uniqueDates: { date: string; x: number }[] = []
  const seen = new Set<string>()
  data.forEach((d, i) => {
    if (!seen.has(d.date)) {
      seen.add(d.date)
      uniqueDates.push({ date: d.date, x: getX(i) })
    }
  })

  return (
    <div>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full touch-none select-none"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {/* Y axis lines and labels */}
        {yTicks.map((tick) => (
          <g key={tick}>
            <line x1={padding.left} y1={getY(tick)} x2={width - padding.right} y2={getY(tick)} stroke="#27272a" strokeWidth={1} />
            <text x={padding.left - 6} y={getY(tick) + 4} textAnchor="end" fill="#71717a" fontSize="10" fontFamily="Roboto, sans-serif">
              {tick >= 1000 ? `${(tick / 1000).toFixed(1)}K` : tick}
            </text>
          </g>
        ))}

        {/* X axis date labels */}
        {uniqueDates.map((d) => (
          <text key={d.date} x={d.x} y={height - 8} textAnchor="middle" fill="#71717a" fontSize="10" fontFamily="Roboto, sans-serif">
            {d.date}
          </text>
        ))}

                {/* Typical reel line (grey dashed - more spacing) */}
        <path d={buildPath(typicalPoints)} fill="none" stroke="#a1a1aa" strokeWidth={3.5} strokeDasharray="6 10" strokeLinecap="round" />

        {/* This reel line (pink) */}
        <path d={buildPath(thisReelPoints)} fill="none" stroke="#D946EF" strokeWidth={4} strokeLinecap="round" />

                {/* Invisible drag handles for thisReel — no visible dots */}
        {data.map((d, i) => (
          <circle
            key={`tr-${i}`}
            cx={getX(i)}
            cy={getY(d.thisReel)}
            r={18}
            fill="transparent"
            className="cursor-grab active:cursor-grabbing"
            onPointerDown={(e) => handlePointerDown(i, "thisReel", e)}
            style={{ touchAction: "none" }}
          />
        ))}

        {/* Invisible drag handles for typical — no visible dots */}
        {data.map((d, i) => (
          <circle
            key={`tp-${i}`}
            cx={getX(i)}
            cy={getY(d.typical)}
            r={18}
            fill="transparent"
            className="cursor-grab active:cursor-grabbing"
            onPointerDown={(e) => handlePointerDown(i, "typical", e)}
            style={{ touchAction: "none" }}
          />
        ))}
      </svg>

            {/* Editor trigger - hidden text removed, use long press or button */}

      {/* Value Editor Popup */}
      {showEditor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-sm max-h-[85vh] overflow-y-auto">

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-zinc-800">
              <h3 className="text-[15px] font-semibold">Edit Graph Data</h3>
              <button onClick={() => setShowEditor(false)} className="text-zinc-400 hover:text-white">
                <CloseIcon />
              </button>
            </div>

            {/* Y Axis Editor */}
            <div className="px-4 py-4 border-b border-zinc-800">
              <p className="text-[12px] font-semibold text-zinc-400 mb-3">Y Axis Levels</p>
              <div className="flex gap-2">
                {tempYTicks.map((tick, i) => (
                  <div key={i} className="flex-1">
                    <p className="text-[10px] text-zinc-500 mb-1">Level {i + 1}</p>
                    <input
                      type="number"
                      value={tick}
                      onChange={(e) => {
                        const updated = [...tempYTicks]
                        updated[i] = parseInt(e.target.value) || 0
                        setTempYTicks(updated)
                      }}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1.5 text-[12px] text-white text-center"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Data Points */}
            <div className="px-4 py-4">
              <p className="text-[12px] font-semibold text-zinc-400 mb-3">Data Points</p>
              <div className="grid grid-cols-3 gap-2 mb-2">
                <p className="text-[10px] text-zinc-500 text-center">Date</p>
                <p className="text-[10px] text-fuchsia-400 text-center">This Reel</p>
                <p className="text-[10px] text-zinc-400 text-center">Typical</p>
              </div>
              <div className="space-y-2">
                {tempData.map((point, index) => (
                  <div key={index} className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={point.date}
                      onChange={(e) => {
                        const updated = [...tempData]
                        updated[index] = { ...updated[index], date: e.target.value }
                        setTempData(updated)
                      }}
                      className="bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1.5 text-[11px] text-white text-center"
                    />
                    <input
                      type="number"
                      value={point.thisReel}
                      onChange={(e) => {
                        const updated = [...tempData]
                        updated[index] = { ...updated[index], thisReel: parseInt(e.target.value) || 0 }
                        setTempData(updated)
                      }}
                      className="bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1.5 text-[11px] text-fuchsia-400 text-center"
                    />
                    <input
                      type="number"
                      value={point.typical}
                      onChange={(e) => {
                        const updated = [...tempData]
                        updated[index] = { ...updated[index], typical: parseInt(e.target.value) || 0 }
                        setTempData(updated)
                      }}
                      className="bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1.5 text-[11px] text-zinc-300 text-center"
                    />
                  </div>
                ))}
              </div>

              {/* Add/Remove */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setTempData([...tempData, { date: "", thisReel: 0, typical: 0 }])}
                  className="flex-1 py-2 rounded-lg border border-zinc-700 text-[11px] text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors"
                >
                  + Add Point
                </button>
                {tempData.length > 2 && (
                  <button
                    onClick={() => setTempData(tempData.slice(0, -1))}
                    className="flex-1 py-2 rounded-lg border border-zinc-700 text-[11px] text-zinc-400 hover:text-red-400 hover:border-red-800 transition-colors"
                  >
                    − Remove Last
                  </button>
                )}
              </div>
            </div>

            {/* Save/Cancel */}
            <div className="flex gap-2 px-4 pb-4">
              <button
                onClick={() => setShowEditor(false)}
                className="flex-1 py-2.5 rounded-xl border border-zinc-700 text-[13px] text-zinc-400 hover:bg-zinc-900 transition-colors"
              >
                Cancel
              </button>
                            <button
                onClick={() => {
                  setYTicks(tempYTicks)
                  onChange(tempData)
                  try {
                    localStorage.setItem("graph-data", JSON.stringify(tempData))
                    localStorage.setItem("graph-yticks", JSON.stringify(tempYTicks))
                  } catch {}
                  setShowEditor(false)
                }}
                className="flex-1 py-2.5 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-700 text-[13px] text-white font-medium transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
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
    const DEFAULT_GRAPH_DATA = [
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

  const [graphData, setGraphData] = useState(() => {
    try {
      const saved = localStorage.getItem("graph-data")
      if (saved) return JSON.parse(saved)
    } catch {}
    return DEFAULT_GRAPH_DATA
  })

  const handleGraphChange = (newData: typeof graphData) => {
    setGraphData(newData)
    try {
      localStorage.setItem("graph-data", JSON.stringify(newData))
    } catch {}
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
      reader.onload = (event) => {
        setThumbnailImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRetentionThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setRetentionThumbnail(event.target?.result as string)
      }
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
          <circle cx="130" cy="130" r={radius} fill="none" stroke="#8B5CF6" strokeWidth={strokeWidth} strokeDasharray={`${nonFollowerStroke} ${circumference}`} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
          <circle cx="130" cy="130" r={radius} fill="none" stroke="#D946EF" strokeWidth={strokeWidth} strokeDasharray={`${followerStroke} ${circumference}`} strokeDashoffset={-nonFollowerStroke} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-xs text-zinc-500 tracking-wide">{label}</span>
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
      magenta: "bg-fuchsia-500",
      violet: "bg-violet-500",
      blue: "bg-blue-500",
    }

    return (
      <div className="relative w-full h-[6px] bg-zinc-800 rounded-full overflow-hidden">
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
              <div className="flex flex-col items-center justify-center h-full text-zinc-600 hover:text-zinc-400 transition-colors">
                <UploadIcon />
                <span className="text-[10px] mt-2 font-medium">Upload thumbnail</span>
              </div>
            )}
            <input ref={thumbnailInputRef} type="file" accept="image/*" className="hidden" onChange={handleThumbnailUpload} />
          </div>

          <h2 className="text-[13px] font-semibold mt-4 text-center px-4 leading-tight">{insightsData.caption}</h2>
          <p className="text-[10px] text-zinc-500 mt-1">{insightsData.publishDate} · Duration {insightsData.videoDuration}</p>

          {/* Engagement Stats Row */}
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

        {/* Overview Section */}
        <section className="px-4 py-5">
          <div className="flex items-center gap-2 mb-5">
            <h3 className="text-[18px] font-semibold">Overview</h3>
            <InfoIcon />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[13px]">Views</span>
              <span className="text-[13px]">{insightsData.views}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[13px]">Watch time</span>
              <span className="text-[13px]">{insightsData.watchTime}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[13px]">Interactions</span>
              <span className="text-[13px]">{insightsData.likes + insightsData.comments + insightsData.shares + insightsData.reposts + insightsData.bookmarks}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[13px]">Profile activity</span>
              <span className="text-[13px]">0</span>
            </div>
          </div>
        </section>

        <div className="h-[6px] bg-zinc-900" />

        {/* Views Section with Donut */}
        <section className="px-4 py-5">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-[18px] font-semibold">Views</h3>
            <InfoIcon />
          </div>
          <DonutChart value={insightsData.views.toString()} label="Views" followerPercent={insightsData.followerPercentage} />
          <div className="space-y-3 mt-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-[6px] h-[6px] rounded-full bg-fuchsia-500" />
                <span className="text-[13px]">Followers</span>
              </div>
              <span className="text-[13px]">{insightsData.followerPercentage.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-[6px] h-[6px] rounded-full bg-violet-500" />
                <span className="text-[13px]">Non-followers</span>
              </div>
              <span className="text-[13px]">{(100 - insightsData.followerPercentage).toFixed(1)}%</span>
            </div>
          </div>
        </section>

        <div className="h-px bg-zinc-800 mx-4" />

        {/* Views Over Time — DRAGGABLE GRAPH */}
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
                    : "bg-transparent text-zinc-400 border border-zinc-800"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

                    {/* Draggable Graph */}
          <DraggableGraph data={graphData} onChange={handleGraphChange} />

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-2">
            <div className="flex items-center gap-2">
              <div className="w-[6px] h-[6px] rounded-full bg-fuchsia-500" />
              <span className="text-[11px] text-zinc-500">This reel</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-[6px] h-[6px] rounded-full bg-zinc-400" />
              <span className="text-[11px] text-zinc-500">Your typical reel views</span>
            </div>
          </div>
        </section>

        <div className="h-px bg-zinc-800 mx-4" />

        {/* Top Sources of Views */}
        <section className="px-4 py-5">
          <h4 className="text-[15px] font-semibold mb-5">Top sources of views</h4>
          <div className="space-y-5">
            {insightsData.sourcesData.map((source, index) => (
              <div key={source.name}>
                <div className="flex justify-between mb-2">
                  <span className="text-[13px]">{source.name}</span>
                  <span className="text-[13px]">{source.percentage.toFixed(1)}%</span>
                </div>
                <ProgressBar percentage={source.percentage} delay={index * 100} />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-6 pt-5 border-t border-zinc-800">
            <span className="text-[13px] font-medium">Accounts reached</span>
            <span className="text-[13px]">{insightsData.accountsReached.toLocaleString()}</span>
          </div>
        </section>

        <div className="h-[6px] bg-zinc-900" />

        {/* Interactions Section */}
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
                <div className="w-[6px] h-[6px] rounded-full bg-fuchsia-500" />
                <span className="text-[13px]">Followers</span>
              </div>
              <span className="text-[13px]">{insightsData.followerPercentage.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-[6px] h-[6px] rounded-full bg-violet-500" />
                <span className="text-[13px]">Non-followers</span>
              </div>
              <span className="text-[13px]">{(100 - insightsData.followerPercentage).toFixed(1)}%</span>
            </div>
          </div>
          <div className="h-px bg-zinc-800 my-5" />
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-[13px]">Likes</span>
              <span className="text-[13px]">{insightsData.likes}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[13px]">Saves</span>
              <span className="text-[13px]">{insightsData.bookmarks}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[13px]">Shares</span>
              <span className="text-[13px]">{insightsData.shares}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[13px]">Reposts</span>
              <span className="text-[13px]">{insightsData.reposts}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[13px]">Comments</span>
              <span className="text-[13px]">{insightsData.comments}</span>
            </div>
          </div>
        </section>

        <div className="h-[6px] bg-zinc-900" />

        {/* Profile Activity Section */}
        <section className="px-4 py-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-[18px] font-semibold">Profile activity</h3>
              <InfoIcon />
            </div>
            <span className="text-[18px] font-semibold">1</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[13px]">Follows</span>
            <span className="text-[13px]">1</span>
          </div>
        </section>

        <div className="h-[6px] bg-zinc-900" />

        {/* Retention Section */}
        <section className="px-4 py-5">
          <div className="flex items-center gap-2 mb-5">
            <h3 className="text-[18px] font-semibold">Retention</h3>
            <InfoIcon />
          </div>
          <div className="flex justify-center mb-6">
            <div
              className="relative w-[120px] h-[180px] bg-zinc-900 rounded-xl overflow-hidden cursor-pointer group shadow-xl"
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
                <div className="flex flex-col items-center justify-center h-full text-zinc-600">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <span className="text-[10px] mt-2">Upload</span>
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-11 h-11 rounded-full border-[2.5px] border-white/70 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                  <PlayIcon />
                </div>
              </div>
              <input ref={retentionInputRef} type="file" accept="image/*" className="hidden" onChange={handleRetentionThumbnailUpload} />
            </div>
          </div>

          <div className="h-44 -ml-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={insightsData.retentionData}>
                <defs>
                  <linearGradient id="retentionGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#D946EF" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#D946EF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" axisLine={{ stroke: "#3f3f46", strokeWidth: 1 }} tickLine={false} tick={{ fill: "#71717a", fontSize: 10 }} dy={8} />
                <YAxis axisLine={{ stroke: "#3f3f46", strokeWidth: 1 }} tickLine={false} tick={{ fill: "#71717a", fontSize: 10 }} tickFormatter={(value) => `${value}%`} domain={[0, 100]} ticks={[0, 50, 100]} width={40} />
                <Area type="monotone" dataKey="retention" stroke="#D946EF" strokeWidth={2.5} fill="url(#retentionGradient)" animationDuration={1500} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-6">
            <h4 className="text-[15px] font-semibold mb-4">Skip rate</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-[13px]">{"This reel's skip rate"}</span>
                <span className="text-[13px]">{insightsData.skipRateThis.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[13px]">Your typical skip rate</span>
                <span className="text-[13px]">{insightsData.skipRateTypical.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-5 border-t border-zinc-800 space-y-3">
            <div className="flex justify-between">
              <span className="text-[13px]">Watch time</span>
              <span className="text-[13px]">{insightsData.watchTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[13px]">Average watch time</span>
              <span className="text-[13px]">{insightsData.avgWatchTime}</span>
            </div>
          </div>
        </section>

        <div className="h-[6px] bg-zinc-900" />

        {/* Audience Section */}
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
                className={`px-4 py-[9px] rounded-lg text-[11px] font-medium transition-all duration-200 ${
                  audienceTab === tab
                    ? "bg-zinc-800 text-white"
                    : "bg-transparent text-zinc-400 border border-zinc-800"
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
                  <span className="text-[13px]">Men</span>
                  <span className="text-[13px]">{insightsData.genderData.men.toFixed(1)}%</span>
                </div>
                <ProgressBar percentage={insightsData.genderData.men} delay={0} />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-[13px]">Women</span>
                  <span className="text-[13px]">{insightsData.genderData.women.toFixed(1)}%</span>
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
                    <span className="text-[13px]">{country.name}</span>
                    <span className="text-[13px]">{country.percentage.toFixed(1)}%</span>
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
                    <span className="text-[13px]">{age.name}</span>
                    <span className="text-[13px]">{age.percentage.toFixed(1)}%</span>
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
