"use client"

import React from "react"
import { useState, useRef, useEffect } from "react"
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

// Outline-only engagement icons (stroke, not filled)
const HeartIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
)

const CommentIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
  </svg>
)

const SendIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
)

const RepostIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="17 1 21 5 17 9"/>
    <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
    <polyline points="7 23 3 19 7 15"/>
    <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
  </svg>
)

const BookmarkIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
  </svg>
)

const InfoIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-zinc-400">
    <circle cx="12" cy="12" r="10.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
    <circle cx="12" cy="7.7" r="1.25"/>
    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.5 16.8h3M10.5 11H12v5.7"/>
  </svg>
)

const UploadIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
)

const CloseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const ChevronRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6"/>
  </svg>
)

const BoostIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
    <polyline points="17 6 23 6 23 12"/>
  </svg>
)

const SkipIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="5 4 15 12 5 20 5 4"/>
    <line x1="19" y1="5" x2="19" y2="19"/>
  </svg>
)
const ShareIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
    <polyline points="16 6 12 2 8 6"/>
    <line x1="12" y1="2" x2="12" y2="15"/>
  </svg>
)
const LikeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
)
const SaveIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
    <path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
  </svg>
)
const RepostSmallIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="17 1 21 5 17 9"/>
    <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
    <polyline points="7 23 3 19 7 15"/>
    <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
  </svg>
)
const CommentSmallIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
)

// ===== BOTTOM SHEET =====
const BottomSheet = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const sheetRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const h = (e: MouseEvent) => { if (sheetRef.current && !sheetRef.current.contains(e.target as Node)) onClose() }
    const t = setTimeout(() => { document.addEventListener("mousedown", h); document.addEventListener("touchstart", h as any) }, 100)
    return () => { clearTimeout(t); document.removeEventListener("mousedown", h); document.removeEventListener("touchstart", h as any) }
  }, [open, onClose])

  return (
    <>
      <div className="fixed inset-0 z-[60] transition-opacity duration-300" style={{ backgroundColor: open ? "rgba(0,0,0,0.45)" : "rgba(0,0,0,0)", pointerEvents: open ? "auto" : "none" }} onClick={onClose} />
      <div ref={sheetRef} className="fixed left-0 right-0 bottom-0 z-[70] transition-transform duration-300 ease-out" style={{ transform: open ? "translateY(0)" : "translateY(100%)" }}>
        <div className="flex justify-center pt-3 pb-2 bg-[#1c1c1e] rounded-t-2xl"><div className="w-10 h-1 bg-zinc-600 rounded-full" /></div>
        <div className="bg-[#1c1c1e] px-4 pb-8">
          <button className="w-full flex items-center justify-between py-3.5 active:opacity-60 transition-opacity" onClick={onClose}>
            <div className="flex items-center gap-3.5"><div className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center"><BoostIcon /></div><span className="text-[14px] text-white">Boost this reel</span></div>
            <ChevronRightIcon />
          </button>
          <div className="h-px bg-zinc-800" />
          <button className="w-full flex items-center justify-between py-3.5 active:opacity-60 transition-opacity" onClick={onClose}>
            <div className="flex items-center gap-3.5"><div className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg></div><span className="text-[14px] text-white">View on Edits</span></div>
            <ChevronRightIcon />
          </button>
        </div>
        <div className="bg-[#1c1c1e] pb-[env(safe-area-inset-bottom)]" />
      </div>
    </>
  )
}

// ===== LOCK MENU =====
const LockMenu = ({ locked, onToggle, onOpenEditor, onLongPress }: { locked: boolean; onToggle: () => void; onOpenEditor: () => void; onLongPress: () => void }) => {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isLongPress = useRef(false)
  useEffect(() => { const h = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false) }; if (open) document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h) }, [open])
  const handlePressStart = () => { isLongPress.current = false; longPressTimer.current = setTimeout(() => { isLongPress.current = true; onLongPress() }, 500) }
  const handlePressEnd = () => { if (longPressTimer.current) { clearTimeout(longPressTimer.current); longPressTimer.current = null } }
  const handleClick = () => { if (isLongPress.current) { isLongPress.current = false; return }; setOpen(p => !p) }

  return (
    <div className="relative" ref={menuRef}>
      <button className="p-1 -mr-1 active:opacity-60 transition-opacity select-none" onClick={handleClick} onMouseDown={handlePressStart} onMouseUp={handlePressEnd} onMouseLeave={handlePressEnd} onTouchStart={handlePressStart} onTouchEnd={handlePressEnd} onTouchCancel={handlePressEnd}><MoreVerticalIcon /></button>
      {open && (
        <div className="absolute right-0 top-10 w-[180px] bg-zinc-900 border border-zinc-700 rounded-2xl shadow-xl overflow-hidden z-50">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-[12px] text-white hover:bg-zinc-800 transition-colors text-left" onClick={() => { setOpen(false); onOpenEditor() }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>Edit insights
          </button>
          <div className="h-px bg-zinc-800 mx-3" />
          <button className="w-full flex items-center gap-3 px-4 py-3 text-[12px] text-white hover:bg-zinc-800 transition-colors text-left" onClick={() => { onToggle(); setOpen(false) }}>
            {locked ? (<><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>Unlock editing</>) : (<><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>Lock editing</>)}
          </button>
        </div>
      )}
    </div>
  )
}

// ===== INLINE EDITOR =====
const InlineEditor = ({ value, onSave, isNumber = false, className = "", locked = false }: { value: string | number; onSave: (val: any) => void; isNumber?: boolean; className?: string; locked?: boolean }) => {
  const [editing, setEditing] = useState(false); const [val, setVal] = useState(String(value)); const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => { setVal(String(value)) }, [value]); useEffect(() => { if (editing && inputRef.current) { inputRef.current.focus(); inputRef.current.select() } }, [editing])
  const commit = () => { if (isNumber) { const p = parseFloat(val); if (!isNaN(p)) onSave(p) } else { if (val.trim()) onSave(val.trim()) }; setEditing(false) }
  if (editing) return <input ref={inputRef} value={val} type={isNumber ? "number" : "text"} onChange={e => setVal(e.target.value)} onBlur={commit} onKeyDown={e => { if (e.key === "Enter") commit() }} className={`bg-zinc-800 border border-fuchsia-500 rounded-lg px-2 py-0.5 text-white outline-none ${className}`} style={{ caretColor: "#d63bcd", minWidth: 60 }} />
  return <span className={`${locked ? "cursor-default" : "cursor-pointer hover:text-fuchsia-400"} transition-colors ${className}`} onClick={() => { if (!locked) { setVal(String(value)); setEditing(true) } }}>{value}</span>
}

// ===== GENDER EDITOR =====
const GenderEditor = ({ menValue, onSave, locked }: { menValue: number; onSave: (n: number) => void; locked: boolean }) => {
  const [editing, setEditing] = useState(false); const [value, setValue] = useState(menValue.toFixed(1)); const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => { if (editing && inputRef.current) { inputRef.current.focus(); inputRef.current.select() } }, [editing])
  const commit = () => { const p = parseFloat(value); if (!isNaN(p) && p >= 0 && p <= 100) onSave(p); setEditing(false) }
  if (editing) return <input ref={inputRef} value={value} onChange={e => setValue(e.target.value)} onBlur={commit} onKeyDown={e => { if (e.key === "Enter") commit() }} className="bg-zinc-800 border border-fuchsia-500 rounded-lg px-2 py-0.5 text-[12px] text-white text-center w-[65px] outline-none" style={{ caretColor: "#d63bcd" }} />
  return <span className={`text-[12px] text-zinc-300 ${locked ? "cursor-default" : "cursor-pointer hover:text-fuchsia-400"} transition-colors`} onClick={() => { if (!locked) { setValue(menValue.toFixed(1)); setEditing(true) } }}>{menValue.toFixed(1)}%</span>
}

// ===== COUNTRY NAME EDITOR =====
const CountryNameEditor = ({ name, onSave, locked }: { name: string; onSave: (n: string) => void; locked: boolean }) => {
  const [editing, setEditing] = useState(false); const [value, setValue] = useState(name); const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => { if (editing && inputRef.current) { inputRef.current.focus(); inputRef.current.select() } }, [editing])
  const commit = () => { if (value.trim()) onSave(value.trim()); else setValue(name); setEditing(false) }
  if (editing) return <input ref={inputRef} value={value} onChange={e => setValue(e.target.value)} onBlur={commit} onKeyDown={e => { if (e.key === "Enter") commit() }} className="bg-zinc-800 border border-fuchsia-500 rounded-lg px-2 py-0.5 text-[12px] text-white outline-none flex-1" style={{ caretColor: "#d63bcd" }} />
  return <span className={`text-[12px] text-zinc-300 ${locked ? "cursor-default" : "cursor-pointer hover:text-fuchsia-400"} transition-colors`} onClick={() => { if (!locked) { setValue(name); setEditing(true) } }}>{name}</span>
}

// ===== DRAGGABLE VIEWS GRAPH =====
type GraphPoint = { date: string; thisReel: number; typical: number }

const DraggableGraph = ({ data, onChange, locked }: { data: GraphPoint[]; onChange: (d: GraphPoint[]) => void; locked: boolean }) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const [dragging, setDragging] = useState<{ index: number; line: "thisReel" | "typical" } | null>(null)
  const [xLabels, setXLabels] = useState(["28 Jan", "29 Jan", "30 Jan"])
  const [yLabels, setYLabels] = useState(["0", "250", "500"])
  const [editingX, setEditingX] = useState<number | null>(null)
  const [editingY, setEditingY] = useState<number | null>(null)
  const [editValue, setEditValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const [visibleCount] = useState(Math.ceil(data.length / 2))

  useEffect(() => { try { const sx = localStorage.getItem("graph-xlabels"); const sy = localStorage.getItem("graph-ylabels"); if (sx) setXLabels(JSON.parse(sx)); if (sy) setYLabels(JSON.parse(sy)) } catch {} }, [])
  useEffect(() => { if ((editingX !== null || editingY !== null) && inputRef.current) { inputRef.current.focus(); inputRef.current.select() } }, [editingX, editingY])
  const saveXLabels = (l: string[]) => { setXLabels(l); try { localStorage.setItem("graph-xlabels", JSON.stringify(l)) } catch {} }
  const saveYLabels = (l: string[]) => { setYLabels(l); try { localStorage.setItem("graph-ylabels", JSON.stringify(l)) } catch {} }

  const padding = { top: 20, right: 15, bottom: 35, left: 42 }; const width = 340; const height = 180
  const chartW = width - padding.left - padding.right; const chartH = height - padding.top - padding.bottom
  const yPositions = [padding.top + chartH, padding.top + chartH / 2, padding.top]
  const maxVal = Math.max(...data.map(d => Math.max(d.thisReel, d.typical)))
  const graphMax = Math.ceil(maxVal / 100) * 100 || 500
  const getX = (i: number) => padding.left + (i / Math.max(data.length - 1, 1)) * chartW
  const getY = (val: number) => padding.top + chartH - (Math.min(val, graphMax) / graphMax) * chartH
  const getValFromY = (clientY: number) => { const svg = svgRef.current; if (!svg) return 0; const rect = svg.getBoundingClientRect(); const svgY = ((clientY - rect.top) / rect.height) * height; return Math.max(0, Math.min(graphMax, Math.round(((padding.top + chartH - svgY) / chartH) * graphMax))) }
  const buildPath = (points: { x: number; y: number }[]) => { if (points.length < 2) return ""; let d = `M ${points[0].x} ${points[0].y}`; for (let i = 1; i < points.length; i++) d += ` L ${points[i].x} ${points[i].y}`; return d }
  const visibleThisReel = data.slice(0, visibleCount).map((d, i) => ({ x: getX(i), y: getY(d.thisReel) }))
  const visibleTypical = data.map((d, i) => ({ x: getX(i), y: getY(d.typical) }))
  const handlePointerDown = (index: number, line: "thisReel" | "typical", e: React.PointerEvent) => { if (locked) return; e.preventDefault(); e.stopPropagation(); (e.target as Element).setPointerCapture?.(e.pointerId); setDragging({ index, line }) }
  const handlePointerMove = (e: React.PointerEvent) => { if (!dragging || locked) return; e.preventDefault(); const val = getValFromY(e.clientY); const nd = [...data]; nd[dragging.index] = { ...nd[dragging.index], [dragging.line]: val }; onChange(nd) }
  const handlePointerUp = () => setDragging(null)
  const xPositions = [padding.left, padding.left + chartW / 2, padding.left + chartW]
  const commitEdit = () => { if (editingX !== null) { const u = [...xLabels]; u[editingX] = editValue; saveXLabels(u); setEditingX(null) }; if (editingY !== null) { const u = [...yLabels]; u[editingY] = editValue; saveYLabels(u); setEditingY(null) }; setEditValue("") }

  return (
    <div className="relative">
      {(editingX !== null || editingY !== null) && <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"><input ref={inputRef} value={editValue} onChange={e => setEditValue(e.target.value)} onBlur={commitEdit} onKeyDown={e => { if (e.key === "Enter") commitEdit() }} className="pointer-events-auto bg-zinc-800 border border-fuchsia-500 rounded-lg px-3 py-1.5 text-[12px] text-white text-center w-[90px] outline-none shadow-lg" style={{ caretColor: "#d63bcd" }} /></div>}
      <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`} className="w-full touch-none select-none" onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
        {yPositions.map((yPos, i) => <line key={`yl-${i}`} x1={padding.left} y1={yPos} x2={width - padding.right} y2={yPos} stroke="#1a1a1e" strokeWidth={1} />)}
        {yLabels.map((label, i) => <text key={`yt-${i}`} x={padding.left - 6} y={yPositions[i] + 4} textAnchor="end" fill={editingY === i ? "#d63bcd" : "#3f3f46"} fontSize="9" fontFamily="sans-serif" className={locked ? "cursor-default" : "cursor-pointer"} onClick={() => { if (locked) return; setEditingY(i); setEditingX(null); setEditValue(label) }}>{label}</text>)}
        {xLabels.map((label, i) => <text key={`xt-${i}`} x={xPositions[i]} y={height - 8} textAnchor="middle" fill={editingX === i ? "#d63bcd" : "#3f3f46"} fontSize="9" fontFamily="sans-serif" className={locked ? "cursor-default" : "cursor-pointer"} onClick={() => { if (locked) return; setEditingX(i); setEditingY(null); setEditValue(label) }}>{label}</text>)}
        <path d={buildPath(visibleTypical)} fill="none" stroke="#3f3f46" strokeWidth={5} strokeDasharray="6 10" strokeLinecap="round" />
        <path d={buildPath(visibleThisReel)} fill="none" stroke="#d63bcd" strokeWidth={5.5} strokeLinecap="round" />
        {data.slice(0, visibleCount).map((d, i) => <circle key={`tr-${i}`} cx={getX(i)} cy={getY(d.thisReel)} r={18} fill="transparent" className={locked ? "cursor-default" : "cursor-grab active:cursor-grabbing"} onPointerDown={e => handlePointerDown(i, "thisReel", e)} style={{ touchAction: "none" }} />)}
        {data.map((d, i) => <circle key={`tp-${i}`} cx={getX(i)} cy={getY(d.typical)} r={18} fill="transparent" className={locked ? "cursor-default" : "cursor-grab active:cursor-grabbing"} onPointerDown={e => handlePointerDown(i, "typical", e)} style={{ touchAction: "none" }} />)}
      </svg>
    </div>
  )
}

// ===== DRAGGABLE RETENTION GRAPH =====
type RetentionPoint = { time: string; retention: number }
const DraggableRetentionGraph = ({ data, onChange, locked }: { data: RetentionPoint[]; onChange: (d: RetentionPoint[]) => void; locked: boolean }) => {
  const svgRef = useRef<SVGSVGElement>(null); const [dragging, setDragging] = useState<number | null>(null); const [editingRightX, setEditingRightX] = useState(false); const [rightXValue, setRightXValue] = useState(""); const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => { if (editingRightX && inputRef.current) { inputRef.current.focus(); inputRef.current.select() } }, [editingRightX])
  const padding = { top: 20, right: 15, bottom: 35, left: 45 }; const width = 340; const height = 180
  const chartW = width - padding.left - padding.right; const chartH = height - padding.top - padding.bottom
  const getX = (i: number) => padding.left + (i / Math.max(data.length - 1, 1)) * chartW
  const getY = (val: number) => padding.top + chartH - (Math.min(val, 100) / 100) * chartH
  const getValFromY = (clientY: number) => { const svg = svgRef.current; if (!svg) return 0; const rect = svg.getBoundingClientRect(); const svgY = ((clientY - rect.top) / rect.height) * height; return Math.max(0, Math.min(100, Math.round(((padding.top + chartH - svgY) / chartH) * 100))) }
  const buildPath = (points: { x: number; y: number }[]) => { if (points.length < 2) return ""; let d = `M ${points[0].x} ${points[0].y}`; for (let i = 1; i < points.length; i++) d += ` L ${points[i].x} ${points[i].y}`; return d }
  const points = data.map((d, i) => ({ x: getX(i), y: getY(d.retention) })); const pathD = buildPath(points)
  const handlePointerDown = (index: number, e: React.PointerEvent) => { if (locked) return; e.preventDefault(); e.stopPropagation(); (e.target as Element).setPointerCapture?.(e.pointerId); setDragging(index) }
  const handlePointerMove = (e: React.PointerEvent) => { if (dragging === null || locked) return; e.preventDefault(); const val = getValFromY(e.clientY); const nd = [...data]; nd[dragging] = { ...nd[dragging], retention: val }; onChange(nd) }
  const handlePointerUp = () => setDragging(null); const yTicks = [0, 50, 100]; const lastIdx = data.length - 1
  const commitRightX = () => { if (rightXValue.trim()) { const nd = [...data]; nd[lastIdx] = { ...nd[lastIdx], time: rightXValue.trim() }; onChange(nd) }; setEditingRightX(false) }

  return (
    <div className="relative">
      {editingRightX && <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"><input ref={inputRef} value={rightXValue} onChange={e => setRightXValue(e.target.value)} onBlur={commitRightX} onKeyDown={e => { if (e.key === "Enter") commitRightX() }} className="pointer-events-auto bg-zinc-800 border border-fuchsia-500 rounded-lg px-3 py-1.5 text-[12px] text-white text-center w-[90px] outline-none shadow-lg" style={{ caretColor: "#d63bcd" }} /></div>}
      <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`} className="w-full touch-none select-none" onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
        {yTicks.map(tick => <g key={tick}><line x1={padding.left} y1={getY(tick)} x2={width - padding.right} y2={getY(tick)} stroke="#1a1a1e" strokeWidth={1} /><text x={padding.left - 4} y={getY(tick) + 4} textAnchor="end" fill="#3f3f46" fontSize="9" fontFamily="sans-serif">{tick}%</text></g>)}
        {data[0] && <text x={getX(0)} y={height - 8} textAnchor="middle" fill="#3f3f46" fontSize="9" fontFamily="sans-serif">{data[0].time}</text>}
        {data[lastIdx] && <text x={getX(lastIdx)} y={height - 8} textAnchor="middle" fill={editingRightX ? "#d63bcd" : "#3f3f46"} fontSize="9" fontFamily="sans-serif" className={locked ? "cursor-default" : "cursor-pointer"} onClick={() => { if (locked) return; setRightXValue(data[lastIdx].time); setEditingRightX(true) }}>{data[lastIdx].time}</text>}
        <line x1={padding.left} y1={padding.top + chartH} x2={width - padding.right} y2={padding.top + chartH} stroke="#1a1a1e" strokeWidth={1} />
        <path d={pathD} fill="none" stroke="#d63bcd" strokeWidth={3.5} strokeLinecap="round" />
        {data.map((d, i) => <circle key={i} cx={getX(i)} cy={getY(d.retention)} r={16} fill="transparent" className={locked ? "cursor-default" : "cursor-grab active:cursor-grabbing"} onPointerDown={e => handlePointerDown(i, e)} style={{ touchAction: "none" }} />)}
      </svg>
    </div>
  )
}

// ===== COUNTING NUMBER HOOK =====
function useCountUp(target: number, play: boolean, duration = 900, delay = 0): number {
  const [current, setCurrent] = useState(0); const rafRef = useRef<number>(0)
  useEffect(() => { if (!play) { setCurrent(0); return }; let startTime: number | null = null; const delayTimer = setTimeout(() => { const animate = (ts: number) => { if (!startTime) startTime = ts; const p = Math.min((ts - startTime) / duration, 1); setCurrent(Math.round(target * (1 - Math.pow(1 - p, 3)))); if (p < 1) rafRef.current = requestAnimationFrame(animate) }; rafRef.current = requestAnimationFrame(animate) }, delay); return () => { clearTimeout(delayTimer); if (rafRef.current) cancelAnimationFrame(rafRef.current) } }, [target, play, duration, delay])
  return current
}

export default function ReelInsights() {
  const { data: insightsData, saveData, isLoaded } = useInsightsStorage()
  const [thumbnailImage, setThumbnailImage] = useState<string | null>(null)
  const [retentionThumbnail, setRetentionThumbnail] = useState<string | null>(null)
  const [viewsFilter, setViewsFilter] = useState<"All" | "Followers" | "Non-followers">("All")
  const [audienceTab, setAudienceTab] = useState<"Gender" | "Country" | "Age">("Age")
  const [animateCharts, setAnimateCharts] = useState(false)
  const [editorOpen, setEditorOpen] = useState(false)
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false)
  const [locked, setLocked] = useState(false)
  const [accountsReachedLabel, setAccountsReachedLabel] = useState("Accounts reached")
  const [profileActivity, setProfileActivity] = useState(0)
  const thumbnailInputRef = useRef<HTMLInputElement>(null)
  const retentionInputRef = useRef<HTMLInputElement>(null)
  const [mainTab, setMainTab] = useState<"Overview" | "Engagement" | "Audience">("Overview")
  const [overviewVisible, setOverviewVisible] = useState(false)
  const [animationKey, setAnimationKey] = useState(0)
  const overviewRef = useRef<HTMLDivElement>(null)
  const overviewTriggeredRef = useRef(false)

  const interactionsTarget = insightsData.likes + insightsData.comments + insightsData.shares + insightsData.reposts + insightsData.bookmarks
  const countedViews = useCountUp(insightsData.views, overviewVisible, 900, 150)
  const countedInteractions = useCountUp(interactionsTarget, overviewVisible, 900, 400)

  useEffect(() => { try { const sl = localStorage.getItem("site-locked"); if (sl) setLocked(JSON.parse(sl)); const sa = localStorage.getItem("accounts-reached-label"); if (sa) setAccountsReachedLabel(sa); const sp = localStorage.getItem("profile-activity"); if (sp) setProfileActivity(JSON.parse(sp)) } catch {} }, [])
  const toggleLock = () => { const n = !locked; setLocked(n); try { localStorage.setItem("site-locked", JSON.stringify(n)) } catch {} }
  useEffect(() => { const observer = new IntersectionObserver(entries => { if (entries[0].isIntersecting && !overviewTriggeredRef.current) { overviewTriggeredRef.current = true; setOverviewVisible(true) } }, { threshold: 0.25 }); if (overviewRef.current) observer.observe(overviewRef.current); return () => observer.disconnect() }, [])
  const replayOverviewAnimation = () => { setOverviewVisible(false); setAnimationKey(p => p + 1); setTimeout(() => setOverviewVisible(true), 30) }

  const DEFAULT_GRAPH_DATA: GraphPoint[] = [
    { date: "28 Jan", thisReel: 80, typical: 60 }, { date: "28 Jan", thisReel: 200, typical: 80 }, { date: "28 Jan", thisReel: 170, typical: 90 },
    { date: "29 Jan", thisReel: 320, typical: 75 }, { date: "29 Jan", thisReel: 290, typical: 100 }, { date: "29 Jan", thisReel: 400, typical: 85 },
    { date: "30 Jan", thisReel: 370, typical: 95 }, { date: "30 Jan", thisReel: 460, typical: 80 }, { date: "30 Jan", thisReel: 481, typical: 110 },
  ]
  const [graphData, setGraphData] = useState<GraphPoint[]>(DEFAULT_GRAPH_DATA)
  const [retentionData, setRetentionData] = useState<RetentionPoint[]>(insightsData.retentionData)

  useEffect(() => {
    const fp = parseFloat((Math.random() * 8 + 2).toFixed(1)); const reels = parseFloat((Math.random() * 10 + 75).toFixed(1)); const explore = parseFloat((Math.random() * 5 + 10).toFixed(1)); const rem = parseFloat((100 - reels - explore).toFixed(1)); const stories = parseFloat((rem * 0.55).toFixed(1)); const profile = parseFloat((rem * 0.28).toFixed(1)); const feed = parseFloat((rem - stories - profile).toFixed(1))
    const sT = parseFloat((Math.random() * 10 + 10).toFixed(1)); const sTy = parseFloat((Math.random() * 10 + 20).toFixed(1))
    const us = parseFloat((Math.random() * 10 + 35).toFixed(1)); const uk = parseFloat((Math.random() * 8 + 20).toFixed(1)); const ca = parseFloat((Math.random() * 6 + 12).toFixed(1)); const au = parseFloat((Math.random() * 5 + 8).toFixed(1)); const de = parseFloat((Math.random() * 3 + 4).toFixed(1)); const ot = parseFloat((100 - us - uk - ca - au - de).toFixed(1))
    const a18 = parseFloat((Math.random() * 13 + 35).toFixed(1)); const a25 = parseFloat((Math.random() * 12 + 30).toFixed(1)); const a35 = parseFloat((Math.random() * 5 + 5).toFixed(1)); const a45 = parseFloat((Math.random() * 3 + 1).toFixed(1)); const a55 = parseFloat((Math.random() * 1.2 + 0.3).toFixed(1)); const a65 = parseFloat((Math.random() * 0.8 + 0.2).toFixed(1)); const a13 = parseFloat((100 - a18 - a25 - a35 - a45 - a55 - a65).toFixed(1))
    saveData({ ...insightsData, followerPercentage: fp, skipRateThis: sT, skipRateTypical: sTy,
      countryData: [{ name: insightsData.countryData[0]?.name ?? "United States", percentage: us }, { name: insightsData.countryData[1]?.name ?? "United Kingdom", percentage: uk }, { name: insightsData.countryData[2]?.name ?? "Canada", percentage: ca }, { name: insightsData.countryData[3]?.name ?? "Australia", percentage: au }, { name: insightsData.countryData[4]?.name ?? "Germany", percentage: de }, { name: insightsData.countryData[5]?.name ?? "Others", percentage: Math.max(0, ot) }],
      ageData: [{ name: "13-17", percentage: Math.max(0, a13) }, { name: "18-24", percentage: a18 }, { name: "25-34", percentage: a25 }, { name: "35-44", percentage: a35 }, { name: "45-54", percentage: a45 }, { name: "55-64", percentage: a55 }, { name: "65+", percentage: a65 }],
      sourcesData: [{ name: "Reels tab", percentage: reels }, { name: "Explore", percentage: explore }, { name: "Stories", percentage: stories }, { name: "Profile", percentage: profile }, { name: "Feed", percentage: Math.max(0, feed) }],
    })
  }, [])

  useEffect(() => { try { const s = localStorage.getItem("graph-data"); if (s) { const p = JSON.parse(s); if (Array.isArray(p) && p.length > 0) setGraphData(p) }; const sr = localStorage.getItem("retention-data"); if (sr) { const p = JSON.parse(sr); if (Array.isArray(p) && p.length > 0) setRetentionData(p) } } catch {} }, [])
  const handleGraphChange = (nd: GraphPoint[]) => { if (locked) return; setGraphData(nd); try { localStorage.setItem("graph-data", JSON.stringify(nd)) } catch {} }
  const handleRetentionChange = (nd: RetentionPoint[]) => { if (locked) return; setRetentionData(nd); try { localStorage.setItem("retention-data", JSON.stringify(nd)) } catch {} }
  useEffect(() => { const t = setTimeout(() => setAnimateCharts(true), 300); return () => clearTimeout(t) }, [insightsData])
  const handleEditorSave = (ud: InsightsData) => { saveData(ud); setAnimateCharts(false); setTimeout(() => setAnimateCharts(true), 50) }
  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => { if (locked) return; const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.onload = ev => setThumbnailImage(ev.target?.result as string); r.readAsDataURL(f) } }
  const handleRetentionThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => { if (locked) return; const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.onload = ev => setRetentionThumbnail(ev.target?.result as string); r.readAsDataURL(f) } }

  const ProgressBar = ({ percentage, color = "magenta", delay = 0 }: { percentage: number; color?: "magenta" | "violet" | "blue"; delay?: number }) => {
    const [width, setWidth] = useState(0); useEffect(() => { if (animateCharts) { const t = setTimeout(() => setWidth(percentage), delay); return () => clearTimeout(t) } }, [animateCharts, percentage, delay])
    const cs: Record<string, string> = { magenta: "#d63bcd", violet: "#7639f6", blue: "#3b82f6" }
    return <div className="relative w-full h-[8px] bg-[#1a1a1e] rounded-full overflow-hidden"><div className="absolute left-0 top-0 h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${width}%`, backgroundColor: cs[color] }} /></div>
  }

  const totalViews = insightsData.views || 1
  const affectsData = [
    { icon: <SkipIcon />, label: "Skip rate", value: `${insightsData.skipRateThis.toFixed(1)}%` },
    { icon: <ShareIcon />, label: "Share rate", value: `${((insightsData.shares / totalViews) * 100).toFixed(1)}%` },
    { icon: <LikeIcon />, label: "Like rate", value: `${((insightsData.likes / totalViews) * 100).toFixed(1)}%` },
    { icon: <SaveIcon />, label: "Save rate", value: `${((insightsData.bookmarks / totalViews) * 100).toFixed(1)}%` },
    { icon: <RepostSmallIcon />, label: "Repost rate", value: `${((insightsData.reposts / totalViews) * 100).toFixed(1)}%` },
    { icon: <CommentSmallIcon />, label: "Comment rate", value: `${((insightsData.comments / totalViews) * 100).toFixed(1)}%` },
  ]

  return (
    <div className="min-h-screen text-white font-sans antialiased overflow-x-hidden flex justify-center" style={{ backgroundColor: BG }}>
      <div className="w-full max-w-[420px]">

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-800/50" style={{ backgroundColor: BG }}>
        <div className="flex items-center justify-between px-4 h-[48px]">
          <button className="p-1 -ml-1 active:opacity-60 transition-opacity"><ChevronLeftIcon /></button>
          <h1 className="text-[16px] font-semibold flex-1 ml-4">Reel insights</h1>
          <LockMenu locked={locked} onToggle={toggleLock} onOpenEditor={() => setEditorOpen(true)} onLongPress={() => setBottomSheetOpen(true)} />
        </div>
      </header>

      {/* Thumbnail + Reel Info */}
      <section className="flex flex-col items-center pt-4 pb-3 px-5">
        <div className="relative w-[120px] h-[213px] bg-zinc-900 rounded-xl overflow-hidden cursor-pointer group shadow-lg" onClick={() => { if (!locked) thumbnailInputRef.current?.click() }}>
          {thumbnailImage ? (
            <><img src={thumbnailImage} alt="Reel" className="w-full h-full object-cover" />{!locked && <button className="absolute top-1.5 right-1.5 p-1 bg-black/70 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => { e.stopPropagation(); setThumbnailImage(null) }}><CloseIcon /></button>}</>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-zinc-500 hover:text-zinc-300 transition-colors"><UploadIcon /><span className="text-[9px] mt-1.5 font-medium">Upload thumbnail</span></div>
          )}
          <input ref={thumbnailInputRef} type="file" accept="image/*" className="hidden" onChange={handleThumbnailUpload} />
        </div>
        <h2 className="text-[13px] font-semibold mt-3 text-center px-6 leading-tight text-white">{insightsData.caption}</h2>
        <p className="text-[11px] text-zinc-500 mt-1">{insightsData.publishDate} · Duration {insightsData.videoDuration}</p>
        <div className="flex items-center justify-between w-full max-w-[300px] mt-4 px-1">
          <div className="flex flex-col items-center gap-1"><HeartIcon /><span className="text-[10px] text-zinc-300">{insightsData.likes}</span></div>
          <div className="flex flex-col items-center gap-1"><CommentIcon /><span className="text-[10px] text-zinc-300">{insightsData.comments}</span></div>
          <div className="flex flex-col items-center gap-1"><SendIcon /><span className="text-[10px] text-zinc-300">{insightsData.shares}</span></div>
          <div className="flex flex-col items-center gap-1"><RepostIcon /><span className="text-[10px] text-zinc-300">{insightsData.reposts}</span></div>
          <div className="flex flex-col items-center gap-1"><BookmarkIcon /><span className="text-[10px] text-zinc-300">{insightsData.bookmarks}</span></div>
        </div>
      </section>

      {/* Main Tabs */}
      <div className="border-b border-zinc-800/50">
        <div className="flex">
          {(["Overview", "Engagement", "Audience"] as const).map(tab => (
            <button key={tab} onClick={() => setMainTab(tab)} className={`flex-1 py-2.5 text-[13px] font-medium text-center relative transition-colors ${mainTab === tab ? "text-white" : "text-zinc-500"}`}>
              {tab}
              {mainTab === tab && <div className="absolute bottom-0 left-1/4 right-1/4 h-[2px] bg-white rounded-full" />}
            </button>
          ))}
        </div>
      </div>

      <main className="pb-12">
        {/* ==================== OVERVIEW TAB ==================== */}
        {mainTab === "Overview" && (
          <>
            <section ref={overviewRef} key={animationKey} className="px-4 pt-5 pb-4">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-[15px] font-semibold">Summary</h3>
                <button onClick={replayOverviewAnimation} className="focus:outline-none active:opacity-60 transition-opacity"><InfoIcon /></button>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-[#161a21] rounded-xl p-3.5">
                  <span className="text-[11px] text-zinc-400">Views</span>
                  <p className="text-[20px] font-bold text-white mt-0.5">{overviewVisible ? countedViews.toLocaleString("en-IN") : "0"}</p>
                </div>
                <div className="bg-[#161a21] rounded-xl p-3.5">
                  <span className="text-[11px] text-zinc-400">Accounts reached</span>
                  <p className="text-[20px] font-bold text-white mt-0.5">{insightsData.accountsReached.toLocaleString("en-IN")}</p>
                </div>
                <div className="bg-[#161a21] rounded-xl p-3.5">
                  <span className="text-[11px] text-zinc-400">Average watch time</span>
                  <p className="text-[20px] font-bold text-white mt-0.5">{insightsData.avgWatchTime}</p>
                </div>
                <div className="bg-[#161a21] rounded-xl p-3.5">
                  <span className="text-[11px] text-zinc-400">Follows</span>
                  <InlineEditor value={profileActivity} isNumber locked={locked} className="text-[20px] font-bold text-white mt-0.5 block" onSave={val => { const n = Math.round(val); setProfileActivity(n); try { localStorage.setItem("profile-activity", JSON.stringify(n)) } catch {} }} />
                </div>
              </div>
            </section>

            <div className="h-[5px]" style={{ backgroundColor: "#0a0c10" }} />

            <section className="px-4 py-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2"><h3 className="text-[15px] font-semibold">Views</h3><InfoIcon /></div>
                <span className="text-[15px] font-semibold">{insightsData.views.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex gap-2 mb-4">
                {(["All", "Followers", "Non-followers"] as const).map(filter => (
                  <button key={filter} onClick={() => setViewsFilter(filter)} className={`px-3.5 py-[7px] rounded-full text-[11px] font-medium transition-all duration-200 ${viewsFilter === filter ? "bg-white text-black" : "bg-transparent text-zinc-300 border border-zinc-700"}`}>{filter}</button>
                ))}
              </div>
              <DraggableGraph data={graphData} onChange={handleGraphChange} locked={locked} />
              <div className="flex items-center justify-center gap-5 mt-2">
                <div className="flex items-center gap-1.5"><div className="w-[5px] h-[5px] rounded-full" style={{ backgroundColor: "#d63bcd" }} /><span className="text-[10px] text-zinc-500">This reel</span></div>
                <div className="flex items-center gap-1.5"><div className="w-[5px] h-[5px] rounded-full bg-zinc-600" /><span className="text-[10px] text-zinc-500">Your typical reel views</span></div>
              </div>
            </section>

            <div className="h-[5px]" style={{ backgroundColor: "#0a0c10" }} />

            <section className="px-4 py-5">
              <div className="flex items-center gap-2 mb-4"><h3 className="text-[15px] font-semibold">What affects your views</h3><InfoIcon /></div>
              <div className="space-y-3.5">
                {affectsData.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-[#161a21] flex items-center justify-center">{item.icon}</div><span className="text-[13px] text-zinc-300">{item.label}</span></div>
                    <span className="text-[13px] text-zinc-500">{item.value}</span>
                  </div>
                ))}
              </div>
            </section>

            <div className="h-[5px]" style={{ backgroundColor: "#0a0c10" }} />

            <section className="px-4 py-5">
              <div className="flex items-center gap-2 mb-4"><h3 className="text-[15px] font-semibold">How long people watched your reel</h3><InfoIcon /></div>
              <div className="flex justify-center mb-5">
                <div className="relative w-[100px] h-[170px] bg-zinc-900 rounded-xl overflow-hidden cursor-pointer group shadow-xl" onClick={() => { if (!locked) retentionInputRef.current?.click() }}>
                  {retentionThumbnail ? (
                    <><img src={retentionThumbnail} alt="Retention" className="w-full h-full object-cover" />{!locked && <button className="absolute top-1.5 right-1.5 p-1 bg-black/70 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => { e.stopPropagation(); setRetentionThumbnail(null) }}><CloseIcon /></button>}</>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-zinc-500"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg><span className="text-[9px] mt-1.5">Upload</span></div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"/></svg></div>
                  <input ref={retentionInputRef} type="file" accept="image/*" className="hidden" onChange={handleRetentionThumbnailUpload} />
                </div>
              </div>
              <DraggableRetentionGraph data={retentionData} onChange={handleRetentionChange} locked={locked} />
              <div className="mt-4 pt-3.5 border-t border-zinc-800/50 space-y-2.5">
                <div className="flex justify-between"><span className="text-[12px] text-zinc-500">Watch time</span><span className="text-[12px] text-white font-medium">{insightsData.watchTime}</span></div>
                <div className="flex justify-between"><span className="text-[12px] text-zinc-500">Average watch time</span><span className="text-[12px] text-white font-medium">{insightsData.avgWatchTime}</span></div>
              </div>
            </section>

            <div className="h-[5px]" style={{ backgroundColor: "#0a0c10" }} />

            <section className="px-4 py-5">
              <h4 className="text-[15px] font-semibold mb-4">Top sources of views</h4>
              <div className="space-y-4">
                {insightsData.sourcesData.map((source, index) => (
                  <div key={source.name}>
                    <div className="flex justify-between mb-1.5"><span className="text-[12px] text-zinc-500">{source.name}</span><span className="text-[12px] text-white font-medium">{source.percentage.toFixed(1)}%</span></div>
                    <ProgressBar percentage={source.percentage} delay={index * 100} />
                  </div>
                ))}
              </div>
            </section>

            <div className="h-[5px]" style={{ backgroundColor: "#0a0c10" }} />

            <section className="px-4 py-5">
              <h3 className="text-[15px] font-semibold mb-3">Ad</h3>
              <button className="w-full flex items-center justify-between py-2 active:opacity-60 transition-opacity">
                <div className="flex items-center gap-3"><BoostIcon /><span className="text-[13px] text-white font-medium">Boost this Reel</span></div>
                <ChevronRightIcon />
              </button>
            </section>
          </>
        )}

        {/* ==================== ENGAGEMENT TAB ==================== */}
        {mainTab === "Engagement" && (
          <>
            <section className="px-4 py-5">
              <div className="flex items-center gap-2 mb-4"><h3 className="text-[15px] font-semibold">When people liked your reel</h3><InfoIcon /></div>
              {(() => {
                const svgW = 340; const svgH = 150; const pad = { top: 15, right: 15, bottom: 28, left: 38 }; const cW = svgW - pad.left - pad.right; const cH = svgH - pad.top - pad.bottom
                const totalSec = (() => { const parts = insightsData.videoDuration.split(":").map(Number); return parts.length === 2 ? parts[0] * 60 + parts[1] : 31 })()
                const numPoints = Math.min(totalSec + 1, 32); const spikeData: number[] = []
                for (let i = 0; i < numPoints; i++) { const p = i / (numPoints - 1); let v = 0; if (p < 0.1) v = 60 + Math.random() * 30; else if (p < 0.2) v = 40 + Math.random() * 35; else if (p < 0.4) v = 20 + Math.random() * 40; else if (p < 0.5) v = 50 + Math.random() * 40; else if (p < 0.7) v = 15 + Math.random() * 30; else v = 5 + Math.random() * 20; spikeData.push(Math.min(100, Math.max(0, v))) }
                const getX = (i: number) => pad.left + (i / (numPoints - 1)) * cW; const getY = (v: number) => pad.top + cH - (v / 100) * cH
                let pathD = `M ${getX(0)} ${getY(spikeData[0])}`; for (let i = 1; i < numPoints; i++) pathD += ` L ${getX(i)} ${getY(spikeData[i])}`
                const durMin = Math.floor(totalSec / 60); const durSec = totalSec % 60; const durStr = `${durMin}:${durSec.toString().padStart(2, "0")}`
                return (
                  <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full">
                    {[0, 50, 100].map(t => <g key={t}><line x1={pad.left} y1={getY(t)} x2={svgW - pad.right} y2={getY(t)} stroke="#1a1a1e" strokeWidth={1} /><text x={pad.left - 5} y={getY(t) + 3} textAnchor="end" fill="#3f3f46" fontSize="9" fontFamily="sans-serif">{t}%</text></g>)}
                    <text x={pad.left} y={svgH - 5} textAnchor="middle" fill="#3f3f46" fontSize="9" fontFamily="sans-serif">0:00</text>
                    <text x={svgW - pad.right} y={svgH - 5} textAnchor="middle" fill="#3f3f46" fontSize="9" fontFamily="sans-serif">{durStr}</text>
                    <path d={pathD} fill="none" stroke="#d63bcd" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )
              })()}
            </section>

            <div className="h-[5px]" style={{ backgroundColor: "#0a0c10" }} />

            <section className="px-4 py-5">
              <div className="flex items-center gap-2 mb-4"><h3 className="text-[15px] font-semibold">Actions after viewing</h3><InfoIcon /></div>
              <div className="space-y-3.5">
                <div className="flex justify-between items-center"><span className="text-[13px] text-zinc-400">Follows</span><InlineEditor value={profileActivity} isNumber locked={locked} className="text-[13px] text-white font-semibold" onSave={val => { const n = Math.round(val); setProfileActivity(n); try { localStorage.setItem("profile-activity", JSON.stringify(n)) } catch {} }} /></div>
                <div className="flex justify-between items-center"><span className="text-[13px] text-zinc-400">Profile visits</span><span className="text-[13px] text-white font-semibold">{Math.round(insightsData.views * 0.04)}</span></div>
              </div>
            </section>

            <div className="h-[5px]" style={{ backgroundColor: "#0a0c10" }} />

            <section className="px-4 py-5">
              <div className="flex items-center gap-2 mb-4"><h3 className="text-[15px] font-semibold">Interactions</h3><InfoIcon /></div>
              <div className="space-y-3.5">
                {[["Likes", insightsData.likes], ["Comments", insightsData.comments], ["Reposts", insightsData.reposts], ["Shares", insightsData.shares], ["Saves", insightsData.bookmarks]].map(([label, val]) => (
                  <div key={label as string} className="flex justify-between items-center"><span className="text-[13px] text-zinc-400">{label}</span><span className="text-[13px] text-white font-semibold">{val}</span></div>
                ))}
              </div>
            </section>

            <div className="h-[5px]" style={{ backgroundColor: "#0a0c10" }} />

            <section className="px-4 py-5">
              <div className="flex items-center gap-2 mb-4"><h3 className="text-[15px] font-semibold">Monetisation</h3><InfoIcon /></div>
              <h4 className="text-[14px] font-semibold mb-3">Gifts</h4>
              <div className="flex items-center justify-between"><div className="flex items-center gap-2"><div className="w-[6px] h-[6px] rounded-full bg-red-500 shrink-0" /><span className="text-[12px] text-zinc-500">Not monetising</span></div><button className="text-[12px] text-blue-500 font-medium active:opacity-60 transition-opacity">Add payment details</button></div>
            </section>
          </>
        )}

        {/* ==================== AUDIENCE TAB ==================== */}
        {mainTab === "Audience" && (
          <>
            <section className="px-4 py-5">
              <div className="flex items-center gap-2 mb-4"><h3 className="text-[15px] font-semibold">Who viewed your reel</h3><InfoIcon /></div>
              <div className="space-y-4">
                <div><div className="flex justify-between mb-1.5"><span className="text-[13px] text-zinc-400">Followers</span><span className="text-[13px] text-white font-semibold">{insightsData.followerPercentage.toFixed(1)}%</span></div><ProgressBar percentage={insightsData.followerPercentage} delay={0} /></div>
                <div><div className="flex justify-between mb-1.5"><span className="text-[13px] text-zinc-400">Non-followers</span><span className="text-[13px] text-white font-semibold">{(100 - insightsData.followerPercentage).toFixed(1)}%</span></div><ProgressBar percentage={100 - insightsData.followerPercentage} color="violet" delay={100} /></div>
              </div>
            </section>

            <div className="h-[5px]" style={{ backgroundColor: "#0a0c10" }} />

            <section className="px-4 py-5">
              <div className="flex items-center gap-2 mb-4"><h3 className="text-[15px] font-semibold">Audience details</h3><InfoIcon /></div>
              <div className="flex gap-2 mb-5">
                {(["Age", "Country", "Gender"] as const).map(tab => (
                  <button key={tab} onClick={() => setAudienceTab(tab === "Age" ? "Age" : tab === "Country" ? "Country" : "Gender")} className={`px-3.5 py-[7px] rounded-full text-[11px] font-medium transition-all duration-200 ${audienceTab === tab ? "bg-white text-black" : "bg-transparent text-zinc-300 border border-zinc-700"}`}>{tab}</button>
                ))}
              </div>

              {audienceTab === "Age" && (
                <div className="space-y-3">
                  {insightsData.ageData.map((age, index) => (
                    <div key={age.name} className="flex items-center gap-2.5">
                      <span className="text-[11px] text-zinc-500 w-[40px] shrink-0">{age.name}</span>
                      <div className="flex-1"><ProgressBar percentage={age.percentage} delay={index * 60} /></div>
                      <span className="text-[11px] text-white font-medium w-[40px] text-right">{age.percentage.toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              )}

              {audienceTab === "Country" && (
                <div className="space-y-3">
                  {insightsData.countryData.map((country, index) => (
                    <div key={index} className="flex items-center gap-2.5">
                      <div className="w-[85px] shrink-0"><CountryNameEditor locked={locked} name={country.name} onSave={newName => { const uc = [...insightsData.countryData]; uc[index] = { ...uc[index], name: newName }; try { localStorage.setItem("country-names", JSON.stringify(uc.map(c => c.name))) } catch {}; saveData({ ...insightsData, countryData: uc }) }} /></div>
                      <div className="flex-1"><ProgressBar percentage={country.percentage} delay={index * 80} /></div>
                      <span className="text-[11px] text-white font-medium w-[40px] text-right">{country.percentage.toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              )}

              {audienceTab === "Gender" && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-[11px] text-zinc-500 w-[50px] shrink-0">Men</span>
                    <div className="flex-1"><ProgressBar percentage={insightsData.genderData.men} delay={0} /></div>
                    <div className="w-[50px] text-right"><GenderEditor locked={locked} menValue={insightsData.genderData.men} onSave={newMen => { const nw = parseFloat((100 - newMen).toFixed(1)); try { localStorage.setItem("gender-data", JSON.stringify({ men: newMen, women: nw })) } catch {}; saveData({ ...insightsData, genderData: { men: newMen, women: nw } }) }} /></div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-[11px] text-zinc-500 w-[50px] shrink-0">Women</span>
                    <div className="flex-1"><ProgressBar percentage={insightsData.genderData.women} color="violet" delay={100} /></div>
                    <span className="text-[11px] text-white font-medium w-[50px] text-right">{insightsData.genderData.women.toFixed(1)}%</span>
                  </div>
                </div>
              )}
            </section>
          </>
        )}
      </main>

      <InsightEditorModal open={editorOpen} onOpenChange={setEditorOpen} data={insightsData} onSave={handleEditorSave} />
      <BottomSheet open={bottomSheetOpen} onClose={() => setBottomSheetOpen(false)} />

      </div>
    </div>
  )
}
