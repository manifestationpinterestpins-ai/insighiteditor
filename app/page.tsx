"use client"

import React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
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

const BG = "#0c0f14"

const ChevronLeftIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 19-7-7 7-7"/>
    <path d="M19 12H5"/>
  </svg>
)

const MoreVerticalIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="5" r="2" />
    <circle cx="12" cy="12" r="2" />
    <circle cx="12" cy="19" r="2" />
  </svg>
)

const HeartIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="white" stroke="none">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>
)

const CommentIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="white" stroke="white" strokeLinejoin="round" strokeWidth="2">
    <path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"/>
  </svg>
)

const SendIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path fill="white" stroke="#0c0f14" strokeLinejoin="round" strokeWidth="2"
      d="M13.973 20.046 21.77 6.928C22.8 5.195 21.55 3 19.535 3H4.466C2.138 3 .984 5.825 2.646 7.456l4.842 4.752 1.723 7.121c.548 2.266 3.571 2.721 4.762.717Z"/>
    <path fill="none" stroke="#0c0f14" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
      d="m7.488 12.208 8.027-4.567"/>
  </svg>
)

const RepostIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.998 9.497a1 1 0 0 0-1 1v4.228a3.274 3.274 0 0 1-3.27 3.27h-5.313l1.791-1.787a1 1 0 0 0-1.412-1.416L7.29 18.287a1 1 0 0 0-.294.707v.001c0 .023.012.042.013.065a.92.92 0 0 0 .281.643l3.502 3.504a1 1 0 0 0 1.414-1.414l-1.797-1.798h5.318a5.276 5.276 0 0 0 5.27-5.27v-4.228a1 1 0 0 0-1-1Zm-6.41-3.496-1.795 1.795a1 1 0 1 0 1.414 1.414l3.5-3.5a1.003 1.003 0 0 0 0-1.417l-3.5-3.5a1 1 0 0 0-1.414 1.414l1.794 1.794H8.27A5.277 5.277 0 0 0 3 9.271V13.5a1 1 0 0 0 2 0V9.271a3.275 3.275 0 0 1 3.271-3.27Z"/>
  </svg>
)

const BookmarkIcon = () => (
  <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
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

const ChevronRightIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6"/>
  </svg>
)

const BoostIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
    <polyline points="17 6 23 6 23 12"/>
  </svg>
)

// ===== BOTTOM SHEET =====
const BottomSheet = ({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) => {
  const sheetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handleClickOutside = (e: MouseEvent) => {
      if (sheetRef.current && !sheetRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    // Small delay so the opening touch doesn't immediately close it
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("touchstart", handleClickOutside as any)
    }, 100)
    return () => {
      clearTimeout(timer)
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("touchstart", handleClickOutside as any)
    }
  }, [open, onClose])

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-[60] transition-opacity duration-300"
        style={{
          backgroundColor: open ? "rgba(0,0,0,0.45)" : "rgba(0,0,0,0)",
          pointerEvents: open ? "auto" : "none",
        }}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className="fixed left-0 right-0 bottom-0 z-[70] transition-transform duration-300 ease-out"
        style={{
          transform: open ? "translateY(0)" : "translateY(100%)",
        }}
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-2 bg-[#1c1c1e] rounded-t-2xl">
          <div className="w-10 h-1 bg-zinc-600 rounded-full" />
        </div>

        {/* Content */}
        <div className="bg-[#1c1c1e] px-4 pb-8">
          {/* Boost this reel */}
          <button
            className="w-full flex items-center justify-between py-3.5 active:opacity-60 transition-opacity"
            onClick={onClose}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                  <polyline points="17 6 23 6 23 12"/>
                </svg>
              </div>
              <span className="text-[15px] text-white font-normal">Boost this reel</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </button>

          {/* Divider */}
          <div className="h-px bg-zinc-800" />

          {/* View on Edits */}
          <button
            className="w-full flex items-center justify-between py-3.5 active:opacity-60 transition-opacity"
            onClick={onClose}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9"/>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                </svg>
              </div>
              <span className="text-[15px] text-white font-normal">View on Edits</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </button>
        </div>

        {/* Safe area for bottom notch phones */}
        <div className="bg-[#1c1c1e] pb-[env(safe-area-inset-bottom)]" />
      </div>
    </>
  )
}

// ===== LOCK MENU =====
const LockMenu = ({
  locked,
  onToggle,
  onOpenEditor,
  onLongPress,
}: {
  locked: boolean
  onToggle: () => void
  onOpenEditor: () => void
  onLongPress: () => void
}) => {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isLongPress = useRef(false)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open])

  const handlePressStart = () => {
    isLongPress.current = false
    longPressTimer.current = setTimeout(() => {
      isLongPress.current = true
      onLongPress()
    }, 500)
  }

  const handlePressEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }

  const handleClick = () => {
    if (isLongPress.current) {
      isLongPress.current = false
      return
    }
    setOpen((prev) => !prev)
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        className="p-1 -mr-1 active:opacity-60 transition-opacity select-none"
        onClick={handleClick}
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onMouseLeave={handlePressEnd}
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
        onTouchCancel={handlePressEnd}
      >
        <MoreHorizontalIcon />
      </button>

      {open && (
        <div className="absolute right-0 top-10 w-[180px] bg-zinc-900 border border-zinc-700 rounded-2xl shadow-xl overflow-hidden z-50">
          <button
            className="w-full flex items-center gap-3 px-4 py-3 text-[13px] text-white hover:bg-zinc-800 transition-colors text-left"
            onClick={() => { setOpen(false); onOpenEditor() }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Edit insights
          </button>
          <div className="h-px bg-zinc-800 mx-3" />
          <button
            className="w-full flex items-center gap-3 px-4 py-3 text-[13px] text-white hover:bg-zinc-800 transition-colors text-left"
            onClick={() => { onToggle(); setOpen(false) }}
          >
            {locked ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 9.9-1"/>
                </svg>
                Unlock editing
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                Lock editing
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}

// ===== INLINE EDITOR =====
const InlineEditor = ({
  value,
  onSave,
  isNumber = false,
  className = "",
  locked = false,
}: {
  value: string | number
  onSave: (val: any) => void
  isNumber?: boolean
  className?: string
  locked?: boolean
}) => {
  const [editing, setEditing] = useState(false)
  const [val, setVal] = useState(String(value))
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { setVal(String(value)) }, [value])
  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editing])

  const commit = () => {
    if (isNumber) {
      const parsed = parseFloat(val)
      if (!isNaN(parsed)) onSave(parsed)
    } else {
      if (val.trim()) onSave(val.trim())
    }
    setEditing(false)
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={val}
        type={isNumber ? "number" : "text"}
        onChange={(e) => setVal(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => { if (e.key === "Enter") commit() }}
        className={`bg-zinc-800 border border-fuchsia-500 rounded-lg px-2 py-0.5 text-white outline-none ${className}`}
        style={{ caretColor: "#d63bcd", minWidth: 60 }}
      />
    )
  }

  return (
    <span
      className={`${locked ? "cursor-default" : "cursor-pointer hover:text-fuchsia-400"} transition-colors ${className}`}
      onClick={() => { if (!locked) { setVal(String(value)); setEditing(true) } }}
    >
      {value}
    </span>
  )
}

// ===== GENDER EDITOR =====
const GenderEditor = ({
  menValue,
  onSave,
  locked,
}: {
  menValue: number
  onSave: (newMen: number) => void
  locked: boolean
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
    if (!isNaN(parsed) && parsed >= 0 && parsed <= 100) onSave(parsed)
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
        style={{ caretColor: "#d63bcd" }}
      />
    )
  }

  return (
    <span
      className={`text-[13px] text-zinc-300 ${locked ? "cursor-default" : "cursor-pointer hover:text-fuchsia-400"} transition-colors`}
      onClick={() => { if (!locked) { setValue(menValue.toFixed(1)); setEditing(true) } }}
    >
      {menValue.toFixed(1)}%
    </span>
  )
}

// ===== COUNTRY NAME EDITOR =====
const CountryNameEditor = ({
  name,
  onSave,
  locked,
}: {
  name: string
  onSave: (newName: string) => void
  locked: boolean
}) => {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(name)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editing])

  const commit = () => {
    if (value.trim()) onSave(value.trim())
    else setValue(name)
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
        className="bg-zinc-800 border border-fuchsia-500 rounded-lg px-2 py-0.5 text-[13px] text-white outline-none flex-1"
        style={{ caretColor: "#d63bcd" }}
      />
    )
  }

  return (
    <span
      className={`text-[13px] text-zinc-300 ${locked ? "cursor-default" : "cursor-pointer hover:text-fuchsia-400"} transition-colors`}
      onClick={() => { if (!locked) { setValue(name); setEditing(true) } }}
    >
      {name}
    </span>
  )
}

// ===== DRAGGABLE VIEWS GRAPH =====
type GraphPoint = { date: string; thisReel: number; typical: number }

const DraggableGraph = ({
  data,
  onChange,
  locked,
}: {
  data: GraphPoint[]
  onChange: (newData: GraphPoint[]) => void
  locked: boolean
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
    if (locked) return
    e.preventDefault()
    e.stopPropagation()
    const target = e.target as Element
    target.setPointerCapture?.(e.pointerId)
    setDragging({ index, line })
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging || locked) return
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
            style={{ caretColor: "#d63bcd" }}
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
          <text
            key={`ylabel-${i}`}
            x={padding.left - 6}
            y={yPositions[i] + 4}
            textAnchor="end"
            fill={editingY === i ? "#d63bcd" : "#a1a1aa"}
            fontSize="10"
            fontFamily="Roboto, sans-serif"
            className={locked ? "cursor-default" : "cursor-pointer"}
            onClick={() => { if (locked) return; setEditingY(i); setEditingX(null); setEditValue(label) }}
          >
            {label}
          </text>
        ))}

        {xLabels.map((label, i) => (
          <text
            key={`xlabel-${i}`}
            x={xPositions[i]}
            y={height - 8}
            textAnchor="middle"
            fill={editingX === i ? "#d63bcd" : "#a1a1aa"}
            fontSize="10"
            fontFamily="Roboto, sans-serif"
            className={locked ? "cursor-default" : "cursor-pointer"}
            onClick={() => { if (locked) return; setEditingX(i); setEditingY(null); setEditValue(label) }}
          >
            {label}
          </text>
        ))}

        <path d={buildPath(typicalPoints)} fill="none" stroke="#a1a1aa" strokeWidth={3.5} strokeDasharray="6 10" strokeLinecap="round" />
        <path d={buildPath(thisReelPoints)} fill="none" stroke="#d63bcd" strokeWidth={4} strokeLinecap="round" />

        {data.map((d, i) => (
          <circle key={`tr-${i}`} cx={getX(i)} cy={getY(d.thisReel)} r={18} fill="transparent" className={locked ? "cursor-default" : "cursor-grab active:cursor-grabbing"} onPointerDown={(e) => handlePointerDown(i, "thisReel", e)} style={{ touchAction: "none" }} />
        ))}
        {data.map((d, i) => (
          <circle key={`tp-${i}`} cx={getX(i)} cy={getY(d.typical)} r={18} fill="transparent" className={locked ? "cursor-default" : "cursor-grab active:cursor-grabbing"} onPointerDown={(e) => handlePointerDown(i, "typical", e)} style={{ touchAction: "none" }} />
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
  locked,
}: {
  data: RetentionPoint[]
  onChange: (newData: RetentionPoint[]) => void
  locked: boolean
}) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const [dragging, setDragging] = useState<number | null>(null)
  const [editingRightX, setEditingRightX] = useState(false)
  const [rightXValue, setRightXValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editingRightX && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editingRightX])

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

  const handlePointerDown = (index: number, e: React.PointerEvent) => {
    if (locked) return
    e.preventDefault()
    e.stopPropagation()
    const target = e.target as Element
    target.setPointerCapture?.(e.pointerId)
    setDragging(index)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (dragging === null || locked) return
    e.preventDefault()
    const val = getValFromY(e.clientY)
    const newData = [...data]
    newData[dragging] = { ...newData[dragging], retention: val }
    onChange(newData)
  }

  const handlePointerUp = () => setDragging(null)

  const yTicks = [0, 50, 100]
  const firstIdx = 0
  const lastIdx = data.length - 1

  const commitRightX = () => {
    if (rightXValue.trim()) {
      const newData = [...data]
      newData[lastIdx] = { ...newData[lastIdx], time: rightXValue.trim() }
      onChange(newData)
    }
    setEditingRightX(false)
  }

  return (
    <div className="relative">
      {editingRightX && (
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <input
            ref={inputRef}
            value={rightXValue}
            onChange={(e) => setRightXValue(e.target.value)}
            onBlur={commitRightX}
            onKeyDown={(e) => { if (e.key === "Enter") commitRightX() }}
            className="pointer-events-auto bg-zinc-800 border border-fuchsia-500 rounded-lg px-3 py-1.5 text-[13px] text-white text-center w-[100px] outline-none shadow-lg"
            style={{ caretColor: "#d63bcd" }}
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
        {yTicks.map((tick) => (
          <g key={tick}>
            <line x1={padding.left} y1={getY(tick)} x2={width - padding.right} y2={getY(tick)} stroke="#3f3f46" strokeWidth={1} />
            <text x={padding.left - 4} y={getY(tick) + 4} textAnchor="end" fill="#a1a1aa" fontSize="10" fontFamily="Roboto, sans-serif">
              {tick}%
            </text>
          </g>
        ))}

        {data[firstIdx] && (
          <text x={getX(firstIdx)} y={height - 8} textAnchor="middle" fill="#a1a1aa" fontSize="10" fontFamily="Roboto, sans-serif">
            {data[firstIdx].time}
          </text>
        )}

        {data[lastIdx] && (
          <text
            x={getX(lastIdx)}
            y={height - 8}
            textAnchor="middle"
            fill={editingRightX ? "#d63bcd" : "#a1a1aa"}
            fontSize="10"
            fontFamily="Roboto, sans-serif"
            className={locked ? "cursor-default" : "cursor-pointer"}
            onClick={() => {
              if (locked) return
              setRightXValue(data[lastIdx].time)
              setEditingRightX(true)
            }}
          >
            {data[lastIdx].time}
          </text>
        )}

        <line x1={padding.left} y1={padding.top + chartH} x2={width - padding.right} y2={padding.top + chartH} stroke="#3f3f46" strokeWidth={1} />
        <path d={pathD} fill="none" stroke="#d63bcd" strokeWidth={4} strokeLinecap="round" />

        {data.map((d, i) => (
          <circle
            key={i}
            cx={getX(i)}
            cy={getY(d.retention)}
            r={16}
            fill="transparent"
            className={locked ? "cursor-default" : "cursor-grab active:cursor-grabbing"}
            onPointerDown={(e) => handlePointerDown(i, e)}
            style={{ touchAction: "none" }}
          />
        ))}
      </svg>
    </div>
  )
}

// ===== COUNTING NUMBER HOOK =====
function useCountUp(target: number, play: boolean, duration = 900, delay = 0): number {
  const [current, setCurrent] = useState(0)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (!play) {
      setCurrent(0)
      return
    }
    let startTime: number | null = null
    let started = false

    const delayTimer = setTimeout(() => {
      started = true
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp
        const elapsed = timestamp - startTime
        const progress = Math.min(elapsed / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setCurrent(Math.round(target * eased))
        if (progress < 1) {
          rafRef.current = requestAnimationFrame(animate)
        }
      }
      rafRef.current = requestAnimationFrame(animate)
    }, delay)

    return () => {
      clearTimeout(delayTimer)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [target, play, duration, delay])

  return current
}

export default function ReelInsights() {
  const { data: insightsData, saveData, isLoaded } = useInsightsStorage()
  const [thumbnailImage, setThumbnailImage] = useState<string | null>(null)
  const [retentionThumbnail, setRetentionThumbnail] = useState<string | null>(null)
  const [viewsFilter, setViewsFilter] = useState<"All" | "Followers" | "Non-followers">("All")
  const [audienceTab, setAudienceTab] = useState<"Gender" | "Country" | "Age">("Gender")
  const [animateCharts, setAnimateCharts] = useState(false)
  const [editorOpen, setEditorOpen] = useState(false)
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false)
  const [locked, setLocked] = useState(false)
  const [accountsReachedLabel, setAccountsReachedLabel] = useState("Accounts reached")
  const [profileActivity, setProfileActivity] = useState(0)
  const thumbnailInputRef = useRef<HTMLInputElement>(null)
  const retentionInputRef = useRef<HTMLInputElement>(null)

  // Overview animation state
  const [overviewVisible, setOverviewVisible] = useState(false)
  const overviewRef = useRef<HTMLDivElement>(null)
  const overviewTriggeredRef = useRef(false)
const [animationKey, setAnimationKey] = useState(0)

  // Counting numbers
  const interactionsTarget = insightsData.likes + insightsData.comments + insightsData.shares + insightsData.reposts + insightsData.bookmarks
  const countedViews = useCountUp(insightsData.views, overviewVisible, 900, 150)
  const countedInteractions = useCountUp(interactionsTarget, overviewVisible, 900, 400)

  useEffect(() => {
    try {
      const savedLock = localStorage.getItem("site-locked")
      if (savedLock) setLocked(JSON.parse(savedLock))
      const savedLabel = localStorage.getItem("accounts-reached-label")
      if (savedLabel) setAccountsReachedLabel(savedLabel)
      const savedActivity = localStorage.getItem("profile-activity")
      if (savedActivity) setProfileActivity(JSON.parse(savedActivity))
    } catch {}
  }, [])

  const toggleLock = () => {
    const newLocked = !locked
    setLocked(newLocked)
    try { localStorage.setItem("site-locked", JSON.stringify(newLocked)) } catch {}
  }

    // Trigger overview animation when section enters viewport — once only
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !overviewTriggeredRef.current) {
          overviewTriggeredRef.current = true
          setOverviewVisible(true)
        }
      },
      { threshold: 0.25 }
    )
    if (overviewRef.current) observer.observe(overviewRef.current)
    return () => observer.disconnect()
  }, [])

  const replayOverviewAnimation = () => {
    setOverviewVisible(false)
    setAnimationKey(prev => prev + 1)
    setTimeout(() => setOverviewVisible(true), 30)
  }

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

    useEffect(() => {
    // Only run if no saved data exists yet (first ever visit)
    const alreadySaved = localStorage.getItem("instagram-reel-insights")
    if (alreadySaved) return

    const followerPct = parseFloat((Math.random() * (10 - 2) + 2).toFixed(1))
    const skipThis = parseFloat((Math.random() * (20 - 10) + 10).toFixed(1))
    const skipTypical = parseFloat((Math.random() * (30 - 20) + 20).toFixed(1))

    const us = parseFloat((Math.random() * (45 - 35) + 35).toFixed(1))
    const uk = parseFloat((Math.random() * (28 - 20) + 20).toFixed(1))
    const ca = parseFloat((Math.random() * (18 - 12) + 12).toFixed(1))
    const au = parseFloat((Math.random() * (13 - 8) + 8).toFixed(1))
    const de = parseFloat((Math.random() * (7 - 4) + 4).toFixed(1))
    const others = parseFloat((100 - us - uk - ca - au - de).toFixed(1))

    const a1824 = parseFloat((Math.random() * (48 - 35) + 35).toFixed(1))
    const a2534 = parseFloat((Math.random() * (42 - 30) + 30).toFixed(1))
    const a3544 = parseFloat((Math.random() * (10 - 5) + 5).toFixed(1))
    const a4554 = parseFloat((Math.random() * (4 - 1) + 1).toFixed(1))
    const a5564 = parseFloat((Math.random() * (1.5 - 0.3) + 0.3).toFixed(1))
    const a65 = parseFloat((Math.random() * (1 - 0.2) + 0.2).toFixed(1))
    const a1317 = parseFloat((100 - a1824 - a2534 - a3544 - a4554 - a5564 - a65).toFixed(1))

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
    if (locked) return
    setGraphData(newData)
    try { localStorage.setItem("graph-data", JSON.stringify(newData)) } catch {}
  }

  const handleRetentionChange = (newData: RetentionPoint[]) => {
    if (locked) return
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
    if (locked) return
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => { setThumbnailImage(event.target?.result as string) }
      reader.readAsDataURL(file)
    }
  }

  const handleRetentionThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (locked) return
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => { setRetentionThumbnail(event.target?.result as string) }
      reader.readAsDataURL(file)
    }
  }

  // ===== DONUT CHART =====
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
    const strokeWidth = 16
    const circumference = 2 * Math.PI * radius
    const gap = 15.5

    useEffect(() => {
      if (animateCharts) {
        const timer = setTimeout(() => setProgress(1), 100)
        return () => clearTimeout(timer)
      }
    }, [animateCharts])

    const followerFull = (followerPercent / 100) * circumference
    const nonFollowerFull = ((100 - followerPercent) / 100) * circumference
    const followerDash = Math.max(0, followerFull - gap) * progress
    const nonFollowerDash = Math.max(0, nonFollowerFull - gap) * progress
    const halfGap = gap / 2

    return (
      <div className="relative flex items-center justify-center py-6">
        <svg width="260" height="260" className="transform -rotate-90">
          <circle cx="130" cy="130" r={radius} fill="none" stroke="#1e2028" strokeWidth={strokeWidth} />
          <circle
            cx="130" cy="130" r={radius}
            fill="none"
            stroke="#7639f6"
            strokeWidth={strokeWidth}
            strokeDasharray={`${nonFollowerDash} ${circumference}`}
            strokeDashoffset={-halfGap}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
          <circle
            cx="130" cy="130" r={radius}
            fill="none"
            stroke="#d63bcd"
            strokeWidth={strokeWidth}
            strokeDasharray={`${followerDash} ${circumference}`}
            strokeDashoffset={-(nonFollowerFull + halfGap)}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-xs text-zinc-400 tracking-wide">{label}</span>
          <span className="text-[38px] font-semibold text-white tracking-tight">
            {Number(value).toLocaleString("en-IN")}
          </span>
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

    const colorStyles: Record<string, string> = {
      magenta: "#d63bcd",
      violet: "#7639f6",
      blue: "#3b82f6",
    }

    return (
      <div className="relative w-full h-[9px] bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${width}%`, backgroundColor: colorStyles[color] }}
        />
      </div>
    )
  }

  // Overview row animation helper
  const overviewRowStyle = (index: number): React.CSSProperties => ({
    opacity: overviewVisible ? 1 : 0,
    transform: overviewVisible ? "translateY(0)" : "translateY(20px)",
    transition: `opacity 400ms ease-out ${index * 120}ms, transform 400ms ease-out ${index * 120}ms`,
    willChange: "opacity, transform",
  })

  return (
    <div className="min-h-screen text-white font-sans antialiased overflow-x-hidden" style={{ backgroundColor: BG }}>
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-sm border-b border-zinc-900" style={{ backgroundColor: BG + "f5" }}>
        <div className="flex items-center justify-between px-4 h-[52px]">
          <button className="p-1 -ml-1 active:opacity-60 transition-opacity">
            <ChevronLeftIcon />
          </button>
          <h1 className="text-[17px] font-semibold flex-1 ml-5">Reel insights</h1>
                    <LockMenu
            locked={locked}
            onToggle={toggleLock}
            onOpenEditor={() => setEditorOpen(true)}
            onLongPress={() => setBottomSheetOpen(true)}
          />
        </div>
      </header>

      <main className="pb-12">
        {/* Thumbnail Section */}
        <section className="flex flex-col items-center pt-4 pb-6 px-4">
          <div
            className="relative w-[130px] h-[200px] bg-zinc-900 rounded-lg overflow-hidden cursor-pointer group shadow-lg"
            onClick={() => { if (!locked) thumbnailInputRef.current?.click() }}
          >
            {thumbnailImage ? (
              <>
                <img src={thumbnailImage || "/placeholder.svg"} alt="Reel thumbnail" className="w-full h-full object-cover" />
                {!locked && (
                  <button
                    className="absolute top-2 right-2 p-1.5 bg-black/70 rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                    onClick={(e) => { e.stopPropagation(); setThumbnailImage(null) }}
                  >
                    <CloseIcon />
                  </button>
                )}
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
            <div className="flex flex-col items-center gap-1"><HeartIcon /><span className="text-[10px] font-medium">{insightsData.likes}</span></div>
            <div className="flex flex-col items-center gap-1"><CommentIcon /><span className="text-[10px] font-medium">{insightsData.comments}</span></div>
            <div className="flex flex-col items-center gap-1"><SendIcon /><span className="text-[10px] font-medium">{insightsData.shares}</span></div>
            <div className="flex flex-col items-center gap-1"><RepostIcon /><span className="text-[10px] font-medium">{insightsData.reposts}</span></div>
            <div className="flex flex-col items-center gap-1"><BookmarkIcon /><span className="text-[10px] font-medium">{insightsData.bookmarks}</span></div>
          </div>
        </section>

        <div className="h-[6px] bg-zinc-900" />

        {/* Overview — fade+slide with staggered rows and counting numbers */}
                <section
          key={animationKey}
          ref={overviewRef}
          className="px-4 py-5"
          style={{
            opacity: overviewVisible ? 1 : 0,
            transform: overviewVisible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 400ms ease-out, transform 400ms ease-out",
            willChange: "opacity, transform",
          }}
        >
                    <div className="flex items-center gap-2 mb-5" style={overviewRowStyle(0)}>
            <h3 className="text-[18px] font-semibold">Overview</h3>
            <button
              onClick={replayOverviewAnimation}
              className="focus:outline-none active:opacity-60 transition-opacity"
            >
              <InfoIcon />
            </button>
          </div>

          <div className="space-y-4">
            {/* Views */}
            <div className="flex justify-between items-center" style={overviewRowStyle(1)}>
              <span className="text-[13px] text-zinc-300">Views</span>
              <span className="text-[13px] text-zinc-300">
                {overviewVisible ? countedViews.toLocaleString("en-IN") : "0"}
              </span>
            </div>

            {/* Watch time */}
            <div className="flex justify-between items-center" style={overviewRowStyle(2)}>
              <span className="text-[13px] text-zinc-300">Watch time</span>
              <span className="text-[13px] text-zinc-300">{insightsData.watchTime}</span>
            </div>

            {/* Interactions */}
            <div className="flex justify-between items-center" style={overviewRowStyle(3)}>
              <span className="text-[13px] text-zinc-300">Interactions</span>
              <span className="text-[13px] text-zinc-300">
                {overviewVisible ? countedInteractions.toLocaleString("en-IN") : "0"}
              </span>
            </div>

            {/* Profile activity */}
            <div className="flex justify-between items-center" style={overviewRowStyle(4)}>
              <span className="text-[13px] text-zinc-300">Profile activity</span>
              <InlineEditor
                value={profileActivity}
                isNumber
                locked={locked}
                className="text-[13px] text-zinc-300"
                onSave={(val) => {
                  const num = Math.round(val)
                  setProfileActivity(num)
                  try { localStorage.setItem("profile-activity", JSON.stringify(num)) } catch {}
                }}
              />
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
                <div className="w-[6px] h-[6px] rounded-full" style={{ backgroundColor: "#d63bcd" }} />
                <span className="text-[13px] text-zinc-300">Followers</span>
              </div>
              <span className="text-[13px] text-zinc-300">{insightsData.followerPercentage.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-[6px] h-[6px] rounded-full" style={{ backgroundColor: "#7639f6" }} />
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
                  viewsFilter === filter ? "bg-zinc-800 text-white" : "bg-transparent text-white border border-zinc-800"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          <DraggableGraph data={graphData} onChange={handleGraphChange} locked={locked} />
          <div className="flex items-center justify-center gap-6 mt-2">
            <div className="flex items-center gap-2">
              <div className="w-[6px] h-[6px] rounded-full" style={{ backgroundColor: "#d63bcd" }} />
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
            <InlineEditor
              value={accountsReachedLabel}
              locked={locked}
              className="text-[14px] text-zinc-300"
              onSave={(val) => {
                setAccountsReachedLabel(val)
                try { localStorage.setItem("accounts-reached-label", val) } catch {}
              }}
            />
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
              onClick={() => { if (!locked) retentionInputRef.current?.click() }}
            >
              {retentionThumbnail ? (
                <>
                  <img src={retentionThumbnail || "/placeholder.svg"} alt="Retention thumbnail" className="w-full h-full object-cover" />
                  {!locked && (
                    <button
                      className="absolute top-2 right-2 p-1.5 bg-black/70 rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                      onClick={(e) => { e.stopPropagation(); setRetentionThumbnail(null) }}
                    >
                      <CloseIcon />
                    </button>
                  )}
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
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"/>
                </svg>
              </div>
              <input ref={retentionInputRef} type="file" accept="image/*" className="hidden" onChange={handleRetentionThumbnailUpload} />
            </div>
          </div>

          <div className="-ml-2">
            <DraggableRetentionGraph data={retentionData} onChange={handleRetentionChange} locked={locked} />
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
                <div className="w-[6px] h-[6px] rounded-full" style={{ backgroundColor: "#d63bcd" }} />
                <span className="text-[13px] text-zinc-300">Followers</span>
              </div>
              <span className="text-[13px] text-zinc-300">{insightsData.followerPercentage.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-[6px] h-[6px] rounded-full" style={{ backgroundColor: "#7639f6" }} />
                <span className="text-[13px] text-zinc-300">Non-followers</span>
              </div>
              <span className="text-[13px] text-zinc-300">{(100 - insightsData.followerPercentage).toFixed(1)}%</span>
            </div>
          </div>
          <div className="h-px bg-zinc-800 my-5" />
          <div className="space-y-4">
            <div className="flex justify-between"><span className="text-[13px] text-zinc-300">Likes</span><span className="text-[13px] text-zinc-300">{insightsData.likes}</span></div>
            <div className="flex justify-between"><span className="text-[13px] text-zinc-300">Saves</span><span className="text-[13px] text-zinc-300">{insightsData.bookmarks}</span></div>
            <div className="flex justify-between"><span className="text-[13px] text-zinc-300">Shares</span><span className="text-[13px] text-zinc-300">{insightsData.shares}</span></div>
            <div className="flex justify-between"><span className="text-[13px] text-zinc-300">Reposts</span><span className="text-[13px] text-zinc-300">{insightsData.reposts}</span></div>
            <div className="flex justify-between"><span className="text-[13px] text-zinc-300">Comments</span><span className="text-[13px] text-zinc-300">{insightsData.comments}</span></div>
          </div>
        </section>

        <div className="h-[6px] bg-zinc-900" />

        {/* Profile Activity */}
        <section className="px-4 py-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-[17px] font-semibold">Profile activity</h3>
              <InfoIcon />
            </div>
            <span className="text-[17px] font-semibold">{profileActivity}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[13px] text-zinc-300">Follows</span>
            <span className="text-[13px] text-zinc-300">{profileActivity}</span>
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
                  audienceTab === tab ? "bg-zinc-800 text-white" : "bg-transparent text-white border border-zinc-800"
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
                    locked={locked}
                    menValue={insightsData.genderData.men}
                    onSave={(newMen) => {
                      const newWomen = parseFloat((100 - newMen).toFixed(1))
                      try { localStorage.setItem("gender-data", JSON.stringify({ men: newMen, women: newWomen })) } catch {}
                      saveData({ ...insightsData, genderData: { men: newMen, women: newWomen } })
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
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <CountryNameEditor
                      locked={locked}
                      name={country.name}
                      onSave={(newName) => {
                        const updatedCountries = [...insightsData.countryData]
                        updatedCountries[index] = { ...updatedCountries[index], name: newName }
                        try {
                          const names = updatedCountries.map(c => c.name)
                          localStorage.setItem("country-names", JSON.stringify(names))
                        } catch {}
                        saveData({ ...insightsData, countryData: updatedCountries })
                      }}
                    />
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

                <div className="h-[6px] bg-zinc-900" />

        {/* Monetisation */}
        <section className="px-4 py-5">
          <div className="flex items-center gap-2 mb-5">
            <h3 className="text-[18px] font-semibold">Monetisation</h3>
            <InfoIcon />
          </div>
          <h4 className="text-[15px] font-semibold mb-4">Gifts</h4>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-[7px] h-[7px] rounded-full bg-red-500 shrink-0" />
              <span className="text-[13px] text-zinc-300">Not monetising</span>
            </div>
            <button className="text-[13px] text-blue-500 font-medium active:opacity-60 transition-opacity">
              Add payment details
            </button>
          </div>
        </section>

        <div className="h-[6px] bg-zinc-900" />

        {/* Ad / Boost This Reel Section */}
        <section className="px-4 py-5">
          <h3 className="text-[18px] font-semibold mb-4">Ad</h3>
          <button className="w-full flex items-center justify-between py-2 active:opacity-60 transition-opacity">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center">
                <BoostIcon />
              </div>
              <span className="text-[14px] text-white font-medium">Boost this Reel</span>
            </div>
            <ChevronRightIcon />
          </button>
        </section>
      </main>

            <InsightEditorModal
        open={editorOpen}
        onOpenChange={setEditorOpen}
        data={insightsData}
        onSave={handleEditorSave}
      />

      <BottomSheet
        open={bottomSheetOpen}
        onClose={() => setBottomSheetOpen(false)}
      />
    </div>
  )
}
