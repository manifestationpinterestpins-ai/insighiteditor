"use client"

import React from "react" 
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence, LayoutGroup } from "framer-motion"
import { InsightEditorModal } from "@/components/InsightEditorModal"
import { useInsightsStorage } from "@/hooks/useInsightsStorage"
import { InsightsData } from "@/lib/insights-state"

const shimmerStyle = {
  background: "linear-gradient(110deg, transparent 30%, #3A3A3C 50%, transparent 70%)",
  backgroundSize: "200% 100%",
  animation: "shimmer 1.4s linear infinite",
}

const shimmerKeyframes = `
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes rollDigit0 { 0% { transform: translateY(0); } 100% { transform: translateY(0); } }
@keyframes rollDigit1 { 0% { transform: translateY(0); } 100% { transform: translateY(-10%); } }
@keyframes rollDigit2 { 0% { transform: translateY(0); } 100% { transform: translateY(-20%); } }
@keyframes rollDigit3 { 0% { transform: translateY(0); } 100% { transform: translateY(-30%); } }
@keyframes rollDigit4 { 0% { transform: translateY(0); } 100% { transform: translateY(-40%); } }
@keyframes rollDigit5 { 0% { transform: translateY(0); } 100% { transform: translateY(-50%); } }
@keyframes rollDigit6 { 0% { transform: translateY(0); } 100% { transform: translateY(-60%); } }
@keyframes rollDigit7 { 0% { transform: translateY(0); } 100% { transform: translateY(-70%); } }
@keyframes rollDigit8 { 0% { transform: translateY(0); } 100% { transform: translateY(-80%); } }
@keyframes rollDigit9 { 0% { transform: translateY(0); } 100% { transform: translateY(-90%); } }
`

const BG = "#0c0f14"
const PINK = "#d939cf"
const PURPLE = "#7738fb"
const CARD_BG = "#25282d"
const BAR_BG = "#2a2d31"

const tabContent = {
  initial: { opacity: 0, y: 8 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.18, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.12 },
  },
}

// ===== ROLLING DIGIT =====
const RollingDigit = ({ target, delay }: { target: number; delay: number }) => {
  return (
    <span
      className="inline-block overflow-hidden"
      style={{
        height: "1em",
        lineHeight: "1em",
        verticalAlign: "top",
        width: "0.62em",
      }}
    >
      <span
        className="flex flex-col"
        style={{
          animation: `rollDigit${target} 1.8s cubic-bezier(0.2, 0.8, 0.3, 1) ${delay}s both`,
        }}
      >
        {[0,1,2,3,4,5,6,7,8,9].map(n => (
          <span key={n} className="block text-center" style={{ height: "1em", lineHeight: "1em" }}>
            {n}
          </span>
        ))}
      </span>
    </span>
  )
}

// ===== ANIMATED NUMBER =====
const AnimatedNumber = ({ value, className, triggerKey }: { value: number; className?: string; triggerKey?: number }) => {
  const formatted = value.toLocaleString("en-IN")
  const chars = formatted.split("")
  const digitChars = chars.filter(c => /\d/.test(c))
  const totalDigits = digitChars.length

  let digitIndex = 0

  return (
    <span className={className} key={triggerKey} style={{ display: "inline-flex", alignItems: "baseline" }}>
      {chars.map((char, i) => {
        if (/\d/.test(char)) {
          const currentIdx = digitIndex
          digitIndex++
          const staggerDelay = (totalDigits - 1 - currentIdx) * 0.15
          return <RollingDigit key={`${triggerKey}-${i}`} target={parseInt(char)} delay={staggerDelay} />
        }
        return <span key={`sep-${i}`} style={{ width: "0.3em", textAlign: "center" }}>{char}</span>
      })}
    </span>
  )
}

// ===== ICONS =====
const ChevronLeftIcon = () => (
  <svg width="40" height="24" viewBox="0 0 48 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M36 12H10M10 12L18 4M10 12L18 20" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const MoreVerticalIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/>
  </svg>
)
const HeartIcon = () => (
  <svg width="26" height="26" viewBox="-1 -1 26 26" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ overflow: "visible" }} >
    <path d="M12 21s-7-4.35-9-8.5C1.5 8 4 5 7.5 5c2 0 3.5 1 4.5 2.5C13 6 14.5 5 16.5 5 20 5 22.5 8 21 12.5 19 16.65 12 21 12 21z"/>
  </svg>
)
const CommentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="-1 -1 26 26" fill="currentColor" className="x1lliihq x1n2onr6 x5n08af" style={{ overflow: "visible" }} >
    <path fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z" />
  </svg>
)
const RepostIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="-1 -1 26 26" fill="currentColor" className="x1lliihq x1n2onr6 xyb1xck" style={{ overflow: "visible" }} >
    <path d="M19.998 9.497a1 1 0 0 0-1 1v4.228a3.274 3.274 0 0 1-3.27 3.27h-5.313l1.791-1.787a1 1 0 0 0-1.412-1.416L7.29 18.287a1 1 0 0 0-.294.707v.001c0 .023.012.042.013.065a.92.92 0 0 0 .281.643l3.502 3.504a1 1 0 0 0 1.414-1.414l-1.797-1.798h5.318a5.276 5.276 0 0 0 5.27-5.27v-4.228a1 1 0 0 0-1-1Zm-6.41-3.496-1.795 1.795a1 1 0 1 0 1.414 1.414l3.5-3.5a1.003 1.003 0 0 0 0-1.417l-3.5-3.5a1 1 0 0 0-1.414 1.414l1.794 1.794H8.27A5.277 5.277 0 0 0 3 9.271V13.5a1 1 0 0 0 2 0V9.271a3.275 3.275 0 0 1 3.271-3.27Z"/>
  </svg>
)
const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="-1 -1 26 26" fill="currentColor" className="x1lliihq x1n2onr6 xyb1xck" style={{ overflow: "visible" }} >
    <path fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" d="M13.973 20.046 21.77 6.928C22.8 5.195 21.55 3 19.535 3H4.466C2.138 3 .984 5.825 2.646 7.456l4.842 4.752 1.723 7.121c.548 2.266 3.571 2.721 4.762.717Z" />
    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m7.488 12.208 8.027-4.567" />
  </svg>
)
const BookmarkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="-1 -1 26 26" fill="currentColor" className="x1lliihq x1n2onr6 xyb1xck" style={{ overflow: "visible" }} >
    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m20 21-8-7.56L4 21V3h16z" />
  </svg>
)
const InfoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-white">
    <circle cx="12" cy="12" r="10.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
    <circle cx="12" cy="7.7" r="1.25"/>
    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.5 16.8h3M10.5 11H12v5.7"/>
  </svg>
)
const UploadIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
)
const CloseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)
const ChevronRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6"/>
  </svg>
)
const BoostIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
  </svg>
)
const SkipRateIcon = () => (
  <svg width="26" height="26" viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="18" stroke="white" strokeWidth="3" strokeLinecap="round" strokeDasharray="2 6"/>
    <path d="M24 6 A18 18 0 0 1 42 24" stroke="white" strokeWidth="3" strokeLinecap="round"/>
    <line x1="24" y1="24" x2="24" y2="14" stroke="white" strokeWidth="3" strokeLinecap="round"/>
    <line x1="24" y1="24" x2="32" y2="24" stroke="white" strokeWidth="3" strokeLinecap="round"/>
  </svg>
)
const ShareRateIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 2L11 13"/><path d="M22 2L15 22L11 13L2 9L22 2Z"/>
  </svg>
)
const LikeRateIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 21s-7-4.35-9-8.5C1.5 8 4 5 7.5 5c2 0 3.5 1 4.5 2.5C13 6 14.5 5 16.5 5 20 5 22.5 8 21 12.5 19 16.65 12 21 12 21z"/>
  </svg>
)
const SaveRateIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21l-8-7.56L4 21V3h16z"/>
  </svg>
)
const RepostRateIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="x1lliihq x1n2onr6 xyb1xck"><path d="M19.998 9.497a1 1 0 0 0-1 1v4.228a3.274 3.274 0 0 1-3.27 3.27h-5.313l1.791-1.787a1 1 0 0 0-1.412-1.416L7.29 18.287a1 1 0 0 0-.294.707v.001c0 .023.012.042.013.065a.92.92 0 0 0 .281.643l3.502 3.504a1 1 0 0 0 1.414-1.414l-1.797-1.798h5.318a5.276 5.276 0 0 0 5.27-5.27v-4.228a1 1 0 0 0-1-1Zm-6.41-3.496-1.795 1.795a1 1 0 1 0 1.414 1.414l3.5-3.5a1.003 1.003 0 0 0 0-1.417l-3.5-3.5a1 1 0 0 0-1.414 1.414l1.794 1.794H8.27A5.277 5.277 0 0 0 3 9.271V13.5a1 1 0 0 0 2 0V9.271a3.275 3.275 0 0 1 3.271-3.27Z"/></svg>
)
const CommentRateIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="x1lliihq x1n2onr6 x5n08af"><path fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"/></svg>
)

// ===== HELPERS =====
const AudienceRow = ({ labelNode, percentage, barColor }: { labelNode: React.ReactNode; percentage: number; barColor: string; animateCharts?: boolean; delay?: number }) => (
  <div className="mb-3.5">
    <div className="mb-1 text-[13px] text-white">{labelNode}</div>
    <div className="flex items-center gap-3">
      <div className="flex-1 relative h-[8px] overflow-hidden" style={{ backgroundColor: BAR_BG, borderRadius: 6 }}>
        <div className="absolute left-0 top-0 h-full" style={{ width: `${percentage}%`, backgroundColor: barColor, borderRadius: 6 }} />
      </div>
      <span className="text-[13px] text-white font-semibold w-[46px] text-right shrink-0">{percentage.toFixed(1)}%</span>
    </div>
  </div>
)

const AnimatedBar = ({ percentage, color }: { percentage: number; color: string; animateCharts?: boolean; delay?: number }) => (
  <div className="flex-1 relative h-[8px] overflow-hidden" style={{ backgroundColor: BAR_BG, borderRadius: 6 }}>
    <div className="absolute left-0 top-0 h-full" style={{ width: `${percentage}%`, backgroundColor: color, borderRadius: 6 }} />
  </div>
)

const SimpleBar = ({ percentage, color }: { percentage: number; color: string; animateCharts?: boolean; delay?: number }) => (
  <div className="relative w-full h-[8px] rounded-full overflow-hidden" style={{ backgroundColor: BAR_BG }}>
    <div className="absolute left-0 top-0 h-full rounded-full" style={{ width: `${percentage}%`, backgroundColor: color }} />
  </div>
)

const GenderPercentEditor = ({ value, onSave, locked }: { value: number; onSave: (n: number) => void; locked: boolean }) => {
  const [editing, setEditing] = useState(false)
  const [val, setVal] = useState(value.toFixed(1))
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => { setVal(value.toFixed(1)) }, [value])
  useEffect(() => { if (editing && inputRef.current) { inputRef.current.focus(); inputRef.current.select() } }, [editing])
  const commit = () => { const p = parseFloat(val); if (!isNaN(p) && p >= 0 && p <= 100) onSave(p); setEditing(false) }
  if (editing) return <input ref={inputRef} value={val} onChange={e => setVal(e.target.value)} onBlur={commit} onKeyDown={e => { if (e.key === "Enter") commit() }} className="bg-zinc-800 border border-fuchsia-500 rounded-lg px-1 py-0.5 text-[13px] text-white text-center outline-none" style={{ caretColor: PINK, width: 60 }} />
  return <span className={`text-[13px] text-white font-semibold w-[46px] text-right shrink-0 ${locked ? "cursor-default" : "cursor-pointer hover:opacity-70"} transition-opacity`} onClick={() => { if (!locked) setEditing(true) }}>{value.toFixed(1)}%</span>
}

const BottomSheet = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const sheetRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const h = (e: MouseEvent) => { if (sheetRef.current && !sheetRef.current.contains(e.target as Node)) onClose() }
    const t = setTimeout(() => { document.addEventListener("mousedown", h); document.addEventListener("touchstart", h as any) }, 100)
    return () => { clearTimeout(t); document.removeEventListener("mousedown", h); document.removeEventListener("touchstart", h as any) }
  }, [open, onClose])
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-[60]" style={{ backgroundColor: "rgba(0,0,0,0.45)" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div ref={sheetRef} className="fixed left-0 right-0 bottom-0 z-[70]" initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", stiffness: 300, damping: 30 }}>
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
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

const LockMenu = ({ locked, onToggle, onOpenEditor, onLongPress, trigger }: { locked: boolean; onToggle: () => void; onOpenEditor: () => void; onLongPress: () => void; trigger?: React.ReactNode }) => {
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
      <button className="p-1 active:opacity-60 transition-opacity select-none" onClick={handleClick} onMouseDown={handlePressStart} onMouseUp={handlePressEnd} onMouseLeave={handlePressEnd} onTouchStart={handlePressStart} onTouchEnd={handlePressEnd} onTouchCancel={handlePressEnd}>{trigger || <MoreVerticalIcon />}</button>
      <AnimatePresence>
        {open && (
          <motion.div className="absolute right-0 top-10 w-[180px] bg-zinc-900 border border-zinc-700 rounded-2xl shadow-xl overflow-hidden z-50" initial={{ opacity: 0, scale: 0.92, y: -8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92, y: -8 }} transition={{ duration: 0.15, ease: "easeOut" }}>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-[12px] text-white hover:bg-zinc-800 transition-colors text-left" onClick={() => { setOpen(false); onOpenEditor() }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              Edit insights
            </button>
            <div className="h-px bg-zinc-800 mx-3" />
            <button className="w-full flex items-center gap-3 px-4 py-3 text-[12px] text-white hover:bg-zinc-800 transition-colors text-left" onClick={() => { onToggle(); setOpen(false) }}>
              {locked
                ? <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>Unlock editing</>
                : <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>Lock editing</>}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const InlineEditor = ({ value, onSave, isNumber = false, className = "", locked = false }: { value: string | number; onSave: (val: any) => void; isNumber?: boolean; className?: string; locked?: boolean }) => {
  const [editing, setEditing] = useState(false)
  const [val, setVal] = useState(String(value))
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => { setVal(String(value)) }, [value])
  useEffect(() => { if (editing && inputRef.current) { inputRef.current.focus(); inputRef.current.select() } }, [editing])
  const commit = () => { if (isNumber) { const p = parseFloat(val); if (!isNaN(p)) onSave(p) } else { if (val.trim()) onSave(val.trim()) }; setEditing(false) }
  if (editing) return <input ref={inputRef} value={val} type={isNumber ? "number" : "text"} onChange={e => setVal(e.target.value)} onBlur={commit} onKeyDown={e => { if (e.key === "Enter") commit() }} className={`bg-zinc-800 border border-fuchsia-500 rounded-lg px-2 py-0.5 text-white outline-none ${className}`} style={{ caretColor: PINK, minWidth: 60 }} />
  return <span className={`${locked ? "cursor-default" : "cursor-pointer hover:opacity-70"} transition-opacity ${className}`} onClick={() => { if (!locked) { setVal(String(value)); setEditing(true) } }}>{value}</span>
}

const CountryNameEditor = ({ name, onSave, locked }: { name: string; onSave: (n: string) => void; locked: boolean }) => {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(name)
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => { if (editing && inputRef.current) { inputRef.current.focus(); inputRef.current.select() } }, [editing])
  const commit = () => { if (value.trim()) onSave(value.trim()); else setValue(name); setEditing(false) }
  if (editing) return <input ref={inputRef} value={value} onChange={e => setValue(e.target.value)} onBlur={commit} onKeyDown={e => { if (e.key === "Enter") commit() }} className="bg-zinc-800 border border-fuchsia-500 rounded-lg px-2 py-0.5 text-[13px] text-white outline-none w-full" style={{ caretColor: PINK }} />
  return <span className={`text-[13px] text-white ${locked ? "cursor-default" : "cursor-pointer hover:opacity-70"} transition-opacity`} onClick={() => { if (!locked) { setValue(name); setEditing(true) } }}>{name}</span>
}

// ===== GRAPHS =====
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

  useEffect(() => { try { const sx = localStorage.getItem("graph-xlabels"); const sy = localStorage.getItem("graph-ylabels"); if (sx) setXLabels(JSON.parse(sx)); if (sy) setYLabels(JSON.parse(sy)) } catch {} }, [])
  useEffect(() => { if ((editingX !== null || editingY !== null) && inputRef.current) { inputRef.current.focus(); inputRef.current.select() } }, [editingX, editingY])
  const saveXLabels = (l: string[]) => { setXLabels(l); try { localStorage.setItem("graph-xlabels", JSON.stringify(l)) } catch {} }
  const saveYLabels = (l: string[]) => { setYLabels(l); try { localStorage.setItem("graph-ylabels", JSON.stringify(l)) } catch {} }

  const padding = { top: 15, right: 10, bottom: 38, left: 44 }
  const width = 380; const height = 170
  const chartW = width - padding.left - padding.right
  const chartH = height - padding.top - padding.bottom
  const yPositions = [padding.top + chartH, padding.top + chartH / 2, padding.top]
  const maxVal = Math.max(...data.map(d => Math.max(d.thisReel, d.typical)))
  const graphMax = Math.ceil(maxVal / 100) * 100 || 500
  const getX = (i: number) => padding.left + (i / Math.max(data.length - 1, 1)) * chartW
  const getY = (val: number) => padding.top + chartH - (Math.min(val, graphMax) / graphMax) * chartH
  const getValFromY = (clientY: number) => { const svg = svgRef.current; if (!svg) return 0; const rect = svg.getBoundingClientRect(); const svgY = ((clientY - rect.top) / rect.height) * height; return Math.max(0, Math.min(graphMax, Math.round(((padding.top + chartH - svgY) / chartH) * graphMax))) }
  const buildPath = (points: { x: number; y: number }[]) => { if (points.length < 2) return ""; let d = `M ${points[0].x} ${points[0].y}`; for (let i = 1; i < points.length; i++) d += ` L ${points[i].x} ${points[i].y}`; return d }
  const allThisReel = data.map((d, i) => ({ x: getX(i), y: getY(d.thisReel) }))
  const handlePointerDown = (index: number, line: "thisReel" | "typical", e: React.PointerEvent) => { if (locked) return; e.preventDefault(); e.stopPropagation(); (e.target as Element).setPointerCapture?.(e.pointerId); setDragging({ index, line }) }
  const handlePointerMove = (e: React.PointerEvent) => { if (!dragging || locked) return; e.preventDefault(); const val = getValFromY(e.clientY); const nd = [...data]; nd[dragging.index] = { ...nd[dragging.index], [dragging.line]: val }; onChange(nd) }
  const handlePointerUp = () => setDragging(null)
  const xPositions = [padding.left + 18, padding.left + chartW / 2, padding.left + chartW]
  const commitEdit = () => { if (editingX !== null) { const u = [...xLabels]; u[editingX] = editValue; saveXLabels(u); setEditingX(null) }; if (editingY !== null) { const u = [...yLabels]; u[editingY] = editValue; saveYLabels(u); setEditingY(null) }; setEditValue("") }
  const pathD = buildPath(allThisReel)

  return (
    <div className="relative -mx-1">
      {(editingX !== null || editingY !== null) && <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"><input ref={inputRef} value={editValue} onChange={e => setEditValue(e.target.value)} onBlur={commitEdit} onKeyDown={e => { if (e.key === "Enter") commitEdit() }} className="pointer-events-auto bg-zinc-800 border border-fuchsia-500 rounded-lg px-3 py-1.5 text-[13px] text-white text-center w-[100px] outline-none shadow-lg" style={{ caretColor: PINK }} /></div>}
      <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`} className={`w-full select-none ${locked ? "" : "touch-none"}`} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
        {yLabels.map((label, i) => <text key={`yt-${i}`} x={padding.left - 8} y={yPositions[i] + 5} textAnchor="end" fill={editingY === i ? PINK : "#d1d5db"} fontSize="13" fontFamily="sans-serif" className={locked ? "cursor-default" : "cursor-pointer"} onClick={() => { if (locked) return; setEditingY(i); setEditingX(null); setEditValue(label) }}>{label}</text>)}
        {xLabels.map((label, i) => <text key={`xt-${i}`} x={xPositions[i]} y={height - 6} textAnchor="middle" fill={editingX === i ? PINK : "#d1d5db"} fontSize="13" fontFamily="sans-serif" className={locked ? "cursor-default" : "cursor-pointer"} onClick={() => { if (locked) return; setEditingX(i); setEditingY(null); setEditValue(label) }}>{label}</text>)}
        <path d={pathD} fill="none" stroke={PINK} strokeWidth={5} strokeLinecap="round" />
        {data.map((d, i) => <circle key={`tr-${i}`} cx={getX(i)} cy={getY(d.thisReel)} r={18} fill="transparent" className={locked ? "cursor-default" : "cursor-grab active:cursor-grabbing"} onPointerDown={e => handlePointerDown(i, "thisReel", e)} style={{ touchAction: "none" }} />)}
      </svg>
    </div>
  )
}

type EngagementPoint = { time: string; value: number }
const DraggableEngagementGraph = ({ data, onChange, locked, videoDuration }: { data: EngagementPoint[]; onChange: (d: EngagementPoint[]) => void; locked: boolean; videoDuration: string }) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const [dragging, setDragging] = useState<number | null>(null)
  const padding = { top: 15, right: 10, bottom: 38, left: 44 }
  const width = 380; const height = 160
  const chartW = width - padding.left - padding.right; const chartH = height - padding.top - padding.bottom
  const getX = (i: number) => (padding.left + 12) + (i / Math.max(data.length - 1, 1)) * (chartW - 12)
  const getY = (val: number) => padding.top + chartH - (Math.min(val, 100) / 100) * chartH
  const getValFromY = (clientY: number) => { const svg = svgRef.current; if (!svg) return 0; const rect = svg.getBoundingClientRect(); const svgY = ((clientY - rect.top) / rect.height) * height; return Math.max(0, Math.min(100, Math.round(((padding.top + chartH - svgY) / chartH) * 100))) }
  const buildPath = (points: { x: number; y: number }[]) => { if (points.length < 2) return ""; let d = `M ${points[0].x} ${points[0].y}`; for (let i = 1; i < points.length; i++) d += ` L ${points[i].x} ${points[i].y}`; return d }
  const points = data.map((d, i) => ({ x: getX(i), y: getY(d.value) }))
  const pathD = buildPath(points)
  const handlePointerDown = (index: number, e: React.PointerEvent) => { if (locked) return; e.preventDefault(); e.stopPropagation(); (e.target as Element).setPointerCapture?.(e.pointerId); setDragging(index) }
  const handlePointerMove = (e: React.PointerEvent) => { if (dragging === null || locked) return; e.preventDefault(); const val = getValFromY(e.clientY); const nd = [...data]; nd[dragging] = { ...nd[dragging], value: val }; onChange(nd) }
  const handlePointerUp = () => setDragging(null)
  return (
    <div className="relative -mx-1">
      <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`} className={`w-full select-none ${locked ? "" : "touch-none"}`} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
        {[0, 50, 100].map(t => <text key={t} x={padding.left - 8} y={getY(t) + 4} textAnchor="end" fill="#d1d5db" fontSize="13" fontFamily="sans-serif">{t === 0 ? "0" : `${t}%`}</text>)}
        <text x={padding.left + 15} y={height - 7} textAnchor="middle" fill="#d1d5db" fontSize="13" fontFamily="sans-serif">0:00</text>
        <text x={getX(data.length - 1) - 8} y={height - 7} textAnchor="middle" fill="#d1d5db" fontSize="13" fontFamily="sans-serif">{videoDuration}</text>
        <path d={pathD} fill="none" stroke={PINK} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
        {data.map((d, i) => <circle key={i} cx={getX(i)} cy={getY(d.value)} r={18} fill="transparent" className={locked ? "cursor-default" : "cursor-grab active:cursor-grabbing"} onPointerDown={e => handlePointerDown(i, e)} style={{ touchAction: "none" }} />)}
      </svg>
    </div>
  )
}

type RetentionPoint = { time: string; retention: number }
const DraggableRetentionGraph = ({ data, onChange, locked, videoDuration }: { data: RetentionPoint[]; onChange: (d: RetentionPoint[]) => void; locked: boolean; videoDuration: string }) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const [dragging, setDragging] = useState<number | null>(null)
  const padding = { top: 15, right: 10, bottom: 38, left: 44 }
  const width = 380; const height = 150
  const chartW = width - padding.left - padding.right; const chartH = height - padding.top - padding.bottom
  const getX = (i: number) => padding.left + (i / Math.max(data.length - 1, 1)) * chartW
  const getY = (val: number) => padding.top + chartH - (Math.min(val, 100) / 100) * chartH
  const getValFromY = (clientY: number) => { const svg = svgRef.current; if (!svg) return 0; const rect = svg.getBoundingClientRect(); const svgY = ((clientY - rect.top) / rect.height) * height; return Math.max(0, Math.min(100, Math.round(((padding.top + chartH - svgY) / chartH) * 100))) }
  const buildPath = (points: { x: number; y: number }[]) => { if (points.length < 2) return ""; let d = `M ${points[0].x} ${points[0].y}`; for (let i = 1; i < points.length; i++) d += ` L ${points[i].x} ${points[i].y}`; return d }
  const points = data.map((d, i) => ({ x: getX(i), y: getY(d.retention) }))
  const pathD = buildPath(points)
  const handlePointerDown = (index: number, e: React.PointerEvent) => { if (locked) return; e.preventDefault(); e.stopPropagation(); (e.target as Element).setPointerCapture?.(e.pointerId); setDragging(index) }
  const handlePointerMove = (e: React.PointerEvent) => { if (dragging === null || locked) return; e.preventDefault(); const val = getValFromY(e.clientY); const nd = [...data]; nd[dragging] = { ...nd[dragging], retention: val }; onChange(nd) }
  const handlePointerUp = () => setDragging(null)
  return (
    <div className="relative -mx-1">
      <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`} className={`w-full select-none ${locked ? "" : "touch-none"}`} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
        {[0, 50, 100].map(t => <text key={t} x={padding.left - 8} y={getY(t) + 4} textAnchor="end" fill="#d1d5db" fontSize="13" fontFamily="sans-serif">{t === 0 ? "0" : `${t}%`}</text>)}
        <text x={getX(0) + 18} y={height - 7} textAnchor="middle" fill="#d1d5db" fontSize="13" fontFamily="sans-serif">0:00</text>
        <text x={getX(data.length - 1) - 6} y={height - 7} textAnchor="middle" fill="#d1d5db" fontSize="13" fontFamily="sans-serif">{videoDuration}</text>
        <path d={pathD} fill="none" stroke={PINK} strokeWidth={5} strokeLinecap="round" />
        {data.map((d, i) => <circle key={i} cx={getX(i)} cy={getY(d.retention)} r={16} fill="transparent" className={locked ? "cursor-default" : "cursor-grab active:cursor-grabbing"} onPointerDown={e => handlePointerDown(i, e)} style={{ touchAction: "none" }} />)}
      </svg>
    </div>
  )
}

const TABS = ["Overview", "Engagement", "Audience"] as const

// ===== MAIN PAGE COMPONENT =====
export default function ReelInsights() {
  const { data: insightsData, saveData } = useInsightsStorage()
  const [thumbnailImage, setThumbnailImage] = useState<string | null>(null)
  const [headerImage, setHeaderImage] = useState<string | null>(null)
  const [retentionThumbnail, setRetentionThumbnail] = useState<string | null>(null)
  const [viewsFilter, setViewsFilter] = useState<"All" | "Followers" | "Non-followers">("All")
  const [audienceTab, setAudienceTab] = useState<"Gender" | "Country" | "Age">("Age")
  const [animateCharts, setAnimateCharts] = useState(false)
  const [summaryLoading, setSummaryLoading] = useState(true)
  const [editorOpen, setEditorOpen] = useState(false)
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false)
  const [locked, setLocked] = useState(false)
  const [profileActivity, setProfileActivity] = useState(0)
  const [profileVisits, setProfileVisits] = useState(0)
  const [mainTab, setMainTab] = useState<"Overview" | "Engagement" | "Audience">("Overview")
  const [animationKey, setAnimationKey] = useState(0)
  const [viewsAnimKey, setViewsAnimKey] = useState(0)
  const [tabsSticky, setTabsSticky] = useState(false)
  const [engagementData, setEngagementData] = useState<EngagementPoint[]>([])
  const [graphData, setGraphData] = useState<GraphPoint[]>([])
  const [retentionData, setRetentionData] = useState<RetentionPoint[]>([])

  const headerRef = useRef<HTMLDivElement>(null)
  const tabsPlaceholderRef = useRef<HTMLDivElement>(null)
  const headerImageInputRef = useRef<HTMLInputElement>(null)
  const thumbnailInputRef = useRef<HTMLInputElement>(null)
  const retentionInputRef = useRef<HTMLInputElement>(null)
  const tabsOffsetTop = useRef(0)

  // Initialize data
  useEffect(() => {
    try {
      const hi = localStorage.getItem("header-image"); if (hi) setHeaderImage(hi)
      const sl = localStorage.getItem("site-locked"); if (sl) setLocked(JSON.parse(sl))
      const sp = localStorage.getItem("profile-activity"); if (sp) setProfileActivity(JSON.parse(sp))
      const sv = localStorage.getItem("profile-visits"); if (sv) setProfileVisits(JSON.parse(sv))
      
      const s = localStorage.getItem("graph-data")
      setGraphData(s ? JSON.parse(s) : [
        { date: "28 Jan", thisReel: 80, typical: 60 }, { date: "28 Jan", thisReel: 200, typical: 80 },
        { date: "28 Jan", thisReel: 170, typical: 90 }, { date: "29 Jan", thisReel: 320, typical: 75 },
        { date: "29 Jan", thisReel: 290, typical: 100 }, { date: "29 Jan", thisReel: 400, typical: 85 },
        { date: "30 Jan", thisReel: 370, typical: 95 }, { date: "30 Jan", thisReel: 460, typical: 80 },
        { date: "30 Jan", thisReel: 481, typical: 110 },
      ])
      
      setRetentionData(insightsData.retentionData)
      const se = localStorage.getItem("engagement-graph-data")
      if (se) setEngagementData(JSON.parse(se))
      else {
        const d: EngagementPoint[] = []
        for (let i = 0; i < 10; i++) d.push({ time: `${i}:00`, value: 20 + Math.random() * 60 })
        setEngagementData(d)
      }
    } catch {}
  }, [insightsData])

  // Scroll logic for sticky header and tabs
  useEffect(() => {
    const updateOffset = () => { if (tabsPlaceholderRef.current) tabsOffsetTop.current = tabsPlaceholderRef.current.getBoundingClientRect().top + window.scrollY }
    const handleScroll = () => {
      const hHeight = headerRef.current?.offsetHeight || 0
      setTabsSticky(window.scrollY + hHeight >= tabsOffsetTop.current)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", updateOffset)
    updateOffset()
    return () => { window.removeEventListener("scroll", handleScroll); window.removeEventListener("resize", updateOffset) }
  }, [])

  useEffect(() => {
    setSummaryLoading(true)
    setTimeout(() => setSummaryLoading(false), 900)
    setTimeout(() => setAnimateCharts(true), 300)
  }, [insightsData])

  const toggleLock = () => { const n = !locked; setLocked(n); localStorage.setItem("site-locked", JSON.stringify(n)) }
  const handleEditorSave = (ud: InsightsData) => { saveData(ud); setAnimateCharts(false); setTimeout(() => setAnimateCharts(true), 50) }
  const handleHeaderImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) {
      const r = new FileReader()
      r.onload = ev => { const res = ev.target?.result as string; setHeaderImage(res); localStorage.setItem("header-image", res) }
      r.readAsDataURL(f)
    }
  }
  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => { const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.onload = ev => setThumbnailImage(ev.target?.result as string); r.readAsDataURL(f) } }
  const handleRetentionThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => { const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.onload = ev => setRetentionThumbnail(ev.target?.result as string); r.readAsDataURL(f) } }
  const saveGender = (newMen: number) => { const nw = 100 - newMen; saveData({ ...insightsData, genderData: { men: newMen, women: nw } }) }

  return (
    <>
      <style>{shimmerKeyframes}</style>
      <div className="min-h-screen text-white font-sans antialiased flex justify-center" style={{ backgroundColor: BG }}>
        <div className="w-full max-w-[420px] relative">
          
          {/* 1. STICKY HEADER SECTION - Always visible */}
          <div 
            ref={headerRef} 
            className="sticky top-0 z-[100] w-full" 
            style={{ backgroundColor: BG }}
          >
            <div className="w-full cursor-pointer" onClick={() => headerImageInputRef.current?.click()}>
              {headerImage ? (
                <img src={headerImage} alt="Header" className="w-full object-cover" style={{ maxHeight: 180 }} />
              ) : (
                <div className="w-full flex flex-col items-center justify-center gap-2" style={{ height: 120, backgroundColor: "#1a1d23" }}>
                  <UploadIcon /><span className="text-[11px] text-zinc-500">Tap to add header image</span>
                </div>
              )}
            </div>
            <input ref={headerImageInputRef} type="file" accept="image/*" className="hidden" onChange={handleHeaderImageUpload} />
          </div>

          {/* 2. THUMBNAIL SECTION - Reduced gap (pt-2) */}
          <section className="flex flex-col items-center pt-2 pb-4 px-5">
            <div className="relative w-[130px] h-[230px] bg-zinc-900 rounded-xl overflow-hidden cursor-pointer shadow-lg" onClick={() => !locked && thumbnailInputRef.current?.click()}>
              {thumbnailImage ? <img src={thumbnailImage} alt="Reel" className="w-full h-full object-cover" /> : <div className="flex flex-col items-center justify-center h-full text-zinc-500"><UploadIcon /><span className="text-[9px] mt-1.5 font-medium">Upload thumbnail</span></div>}
              <input ref={thumbnailInputRef} type="file" accept="image/*" className="hidden" onChange={handleThumbnailUpload} />
            </div>
            <div className="flex items-center justify-center gap-7 w-full mt-4 px-3 overflow-visible">
              <div className="flex flex-col items-center gap-1"><HeartIcon /><span className="text-[12px] font-bold">{insightsData.likes}</span></div>
              <div className="flex flex-col items-center gap-1"><CommentIcon /><span className="text-[12px] font-bold">{insightsData.comments}</span></div>
              <div className="flex flex-col items-center gap-1"><RepostIcon /><span className="text-[12px] font-bold">{insightsData.reposts}</span></div>
              <div className="flex flex-col items-center gap-1"><SendIcon /><span className="text-[12px] font-bold">{insightsData.shares}</span></div>
              <div className="flex flex-col items-center gap-1"><BookmarkIcon /><span className="text-[12px] font-bold">{insightsData.bookmarks}</span></div>
            </div>
          </section>

          {/* 3. TABS - Sticky right below the header */}
          <div ref={tabsPlaceholderRef} style={{ height: tabsSticky ? 45 : 0 }} />
          <LayoutGroup>
            <div
              className="flex border-b border-zinc-800/40 z-[90]"
              style={{
                position: tabsSticky ? "fixed" : "relative",
                top: tabsSticky ? (headerRef.current?.offsetHeight || 0) : undefined,
                width: "100%", maxWidth: 420, backgroundColor: BG,
              }}
            >
              {TABS.map(tab => (
                <button key={tab} onClick={() => setMainTab(tab)} className={`flex-1 py-2.5 text-[13px] font-medium text-center relative transition-colors ${mainTab === tab ? "text-white" : "text-gray-300"}`}>
                  {tab}
                  {mainTab === tab && <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-1/4 right-1/4 h-[2px] bg-white rounded-full" />}
                </button>
              ))}
            </div>
          </LayoutGroup>

          {/* 4. CONTENT AREA */}
          <main className="pb-12">
            <AnimatePresence mode="wait">
              {mainTab === "Overview" && (
                <motion.div key="overview" variants={tabContent} initial="initial" animate="animate" exit="exit">
                  <section className="px-4 pt-5 pb-4">
                    <div className="flex items-center gap-2 mb-4"><h3 className="text-[15px] font-semibold">Summary</h3><InfoIcon /></div>
                    <div className="grid grid-cols-2 gap-2.5">
                      {[
                        { label: "Views", value: insightsData.views },
                        { label: "Accounts reached", value: insightsData.accountsReached },
                        { label: "Average watch time", value: insightsData.avgWatchTime },
                        { label: "Follows", value: profileActivity },
                      ].map((card, i) => (
                        <div key={card.label} className="rounded-xl p-3.5 relative overflow-hidden" style={{ backgroundColor: CARD_BG, minHeight: 72 }}>
                          {summaryLoading && <div className="absolute inset-0 z-10" style={{ ...shimmerStyle, animationDelay: `${i * 0.08}s` }} />}
                          <div style={{ opacity: summaryLoading ? 0 : 1 }}>
                            <div className="h-[14px] mb-1"><span className="text-[11px] text-gray-400">{card.label}</span></div>
                            <div className="h-[24px] flex items-center">
                              {card.label === "Average watch time" ? <span className="text-[17px] font-bold">{card.value}</span> : 
                               card.label === "Follows" ? <InlineEditor value={profileActivity} isNumber locked={locked} className="text-[17px] font-bold" onSave={v => setProfileActivity(v)} /> :
                               <span className="text-[17px] font-bold">{(card.value as number).toLocaleString("en-IN")}</span>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                  <section className="px-4 py-5">
                    <div className="flex items-center justify-between mb-4"><div className="flex items-center gap-2"><h3 className="text-[15px] font-semibold">Views</h3><InfoIcon /></div><AnimatedNumber value={insightsData.views} className="text-[15px] font-semibold" triggerKey={viewsAnimKey} /></div>
                    <DraggableGraph data={graphData} onChange={d => setGraphData(d)} locked={locked} />
                  </section>
                  <section className="px-4 py-5">
                    <div className="flex items-center gap-2 mb-4"><h3 className="text-[15px] font-semibold">What affects your views</h3><InfoIcon /></div>
                    <div className="space-y-5">
                      {[{ icon: <SkipRateIcon />, label: "Skip rate", value: "24.1%" }, { icon: <ShareRateIcon />, label: "Share rate", value: "8.2%" }, { icon: <LikeRateIcon />, label: "Like rate", value: "12.4%" }].map((item, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center gap-4"><div className="rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: CARD_BG, width: 52, height: 52 }}>{item.icon}</div><span className="text-[14px] font-medium">{item.label}</span></div>
                          <span className="text-[14px] font-semibold">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                  <section className="px-4 py-5">
                    <div className="flex items-center gap-2 mb-4"><h3 className="text-[15px] font-semibold">Retention</h3><InfoIcon /></div>
                    <DraggableRetentionGraph data={retentionData} onChange={d => setRetentionData(d)} locked={locked} videoDuration={insightsData.videoDuration} />
                  </section>
                  <section className="px-4 py-5">
                    <h3 className="text-[15px] font-semibold mb-3">Ad</h3>
                    <div className="w-full flex items-center justify-between py-2">
                      <div className="flex items-center gap-3"><BoostIcon /><span className="text-[13px] font-medium">Boost this Reel</span></div>
                      <LockMenu locked={locked} onToggle={toggleLock} onOpenEditor={() => setEditorOpen(true)} onLongPress={() => setBottomSheetOpen(true)} trigger={<ChevronRightIcon />} />
                    </div>
                  </section>
                </motion.div>
              )}
              {mainTab === "Engagement" && (
                <motion.div key="engagement" variants={tabContent} initial="initial" animate="animate" exit="exit">
                  <section className="px-4 py-5"><h3 className="text-[15px] font-semibold mb-5">Engagement Graph</h3><DraggableEngagementGraph data={engagementData} onChange={d => setEngagementData(d)} locked={locked} videoDuration={insightsData.videoDuration} /></section>
                </motion.div>
              )}
              {mainTab === "Audience" && (
                <motion.div key="audience" variants={tabContent} initial="initial" animate="animate" exit="exit">
                   <section className="px-4 pt-5 pb-5"><h3 className="text-[15px] font-semibold mb-3">Audience Details</h3><AudienceRow labelNode="Followers" percentage={insightsData.followerPercentage} barColor={PINK} /></section>
                </motion.div>
              )}
            </AnimatePresence>
          </main>

          <InsightEditorModal open={editorOpen} onOpenChange={setEditorOpen} data={insightsData} onSave={handleEditorSave} />
          <BottomSheet open={bottomSheetOpen} onClose={() => setBottomSheetOpen(false)} />
        </div>
      </div>
    </>
  )
}
