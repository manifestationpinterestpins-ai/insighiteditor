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

// ===== ODOMETER STYLES =====
const odometerKeyframes = `
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

// ===== SINGLE ROLLING DIGIT =====
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

// ===== ANIMATED NUMBER (Odometer — digit rolling) =====
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
  <path
    d="M36 12H10M10 12L18 4M10 12L18 20"
    stroke="white"
    stroke-width="3"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
</svg>
)
const MoreVerticalIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/>
  </svg>
)
const HeaderBoostIcon = () => (
  <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
    <polyline points="17 6 23 6 23 12"/>
  </svg>
)
const HeartIcon = () => (
  <svg
    width="26"
    height="26"
    viewBox="-1 -1 26 26"
    fill="none"
    stroke="white"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ overflow: "visible" }}
  >
    <path d="M12 21s-7-4.35-9-8.5C1.5 8 4 5 7.5 5c2 0 3.5 1 4.5 2.5C13 6 14.5 5 16.5 5 20 5 22.5 8 21 12.5 19 16.65 12 21 12 21z"/>
  </svg>
)

const CommentIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="23"
    height="23"
    viewBox="-1 -1 26 26"
    fill="currentColor"
    aria-label="Comment"
    className="x1lliihq x1n2onr6 x5n08af"
    style={{ overflow: "visible" }}
  >
    <path
      fill="none"
      stroke="currentColor"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"
    />
  </svg>
)

const RepostIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="23"
    height="23"
    viewBox="-1 -1 26 26"
    fill="currentColor"
    aria-label="Repost"
    className="x1lliihq x1n2onr6 xyb1xck"
    style={{ overflow: "visible" }}
  >
    <path d="M19.998 9.497a1 1 0 0 0-1 1v4.228a3.274 3.274 0 0 1-3.27 3.27h-5.313l1.791-1.787a1 1 0 0 0-1.412-1.416L7.29 18.287a1 1 0 0 0-.294.707v.001c0 .023.012.042.013.065a.92.92 0 0 0 .281.643l3.502 3.504a1 1 0 0 0 1.414-1.414l-1.797-1.798h5.318a5.276 5.276 0 0 0 5.27-5.27v-4.228a1 1 0 0 0-1-1Zm-6.41-3.496-1.795 1.795a1 1 0 1 0 1.414 1.414l3.5-3.5a1.003 1.003 0 0 0 0-1.417l-3.5-3.5a1 1 0 0 0-1.414 1.414l1.794 1.794H8.27A5.277 5.277 0 0 0 3 9.271V13.5a1 1 0 0 0 2 0V9.271a3.275 3.275 0 0 1 3.271-3.27Z"/>
  </svg>
)

const SendIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="23"
    height="23"
    viewBox="-1 -1 26 26"
    fill="currentColor"
    aria-label="Share"
    className="x1lliihq x1n2onr6 xyb1xck"
    style={{ overflow: "visible" }}
  >
    <path
      fill="none"
      stroke="currentColor"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M13.973 20.046 21.77 6.928C22.8 5.195 21.55 3 19.535 3H4.466C2.138 3 .984 5.825 2.646 7.456l4.842 4.752 1.723 7.121c.548 2.266 3.571 2.721 4.762.717Z"
    />
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="m7.488 12.208 8.027-4.567"
    />
  </svg>
)

const BookmarkIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="23"
    height="23"
    viewBox="-1 -1 26 26"
    fill="currentColor"
    aria-label="Save"
    className="x1lliihq x1n2onr6 xyb1xck"
    style={{ overflow: "visible" }}
  >
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="m20 21-8-7.56L4 21V3h16z"
    />
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
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
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
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" aria-label="Repost" class="x1lliihq x1n2onr6 xyb1xck"><path d="M19.998 9.497a1 1 0 0 0-1 1v4.228a3.274 3.274 0 0 1-3.27 3.27h-5.313l1.791-1.787a1 1 0 0 0-1.412-1.416L7.29 18.287a1 1 0 0 0-.294.707v.001c0 .023.012.042.013.065a.92.92 0 0 0 .281.643l3.502 3.504a1 1 0 0 0 1.414-1.414l-1.797-1.798h5.318a5.276 5.276 0 0 0 5.27-5.27v-4.228a1 1 0 0 0-1-1Zm-6.41-3.496-1.795 1.795a1 1 0 1 0 1.414 1.414l3.5-3.5a1.003 1.003 0 0 0 0-1.417l-3.5-3.5a1 1 0 0 0-1.414 1.414l1.794 1.794H8.27A5.277 5.277 0 0 0 3 9.271V13.5a1 1 0 0 0 2 0V9.271a3.275 3.275 0 0 1 3.271-3.27Z"/></svg>
)
const CommentRateIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" aria-label="Comment" class="x1lliihq x1n2onr6 x5n08af"><path fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2" d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"/></svg>
)

// ===== AUDIENCE ROW =====
const AudienceRow = ({ labelNode, percentage, barColor }: { labelNode: React.ReactNode; percentage: number; barColor: string; animateCharts?: boolean; delay?: number }) => {
  return (
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
}

// ===== ANIMATED BAR =====
const AnimatedBar = ({ percentage, color }: { percentage: number; color: string; animateCharts?: boolean; delay?: number }) => {
  return (
    <div className="flex-1 relative h-[8px] overflow-hidden" style={{ backgroundColor: BAR_BG, borderRadius: 6 }}>
      <div className="absolute left-0 top-0 h-full" style={{ width: `${percentage}%`, backgroundColor: color, borderRadius: 6 }} />
    </div>
  )
}

// ===== SIMPLE PROGRESS BAR =====
const SimpleBar = ({ percentage, color }: { percentage: number; color: string; animateCharts?: boolean; delay?: number }) => {
  return (
    <div className="relative w-full h-[8px] rounded-full overflow-hidden" style={{ backgroundColor: BAR_BG }}>
      <div className="absolute left-0 top-0 h-full rounded-full" style={{ width: `${percentage}%`, backgroundColor: color }} />
    </div>
  )
}

// ===== GENDER PERCENTAGE EDITOR =====
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

// ===== INLINE EDITOR =====
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

// ===== COUNTRY NAME EDITOR =====
const CountryNameEditor = ({ name, onSave, locked }: { name: string; onSave: (n: string) => void; locked: boolean }) => {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(name)
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => { if (editing && inputRef.current) { inputRef.current.focus(); inputRef.current.select() } }, [editing])
  const commit = () => { if (value.trim()) onSave(value.trim()); else setValue(name); setEditing(false) }
  if (editing) return <input ref={inputRef} value={value} onChange={e => setValue(e.target.value)} onBlur={commit} onKeyDown={e => { if (e.key === "Enter") commit() }} className="bg-zinc-800 border border-fuchsia-500 rounded-lg px-2 py-0.5 text-[13px] text-white outline-none w-full" style={{ caretColor: PINK }} />
  return <span className={`text-[13px] text-white ${locked ? "cursor-default" : "cursor-pointer hover:opacity-70"} transition-opacity`} onClick={() => { if (!locked) { setValue(name); setEditing(true) } }}>{name}</span>
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
      <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`} className="w-full touch-none select-none" onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
        {yLabels.map((label, i) => <text key={`yt-${i}`} x={padding.left - 8} y={yPositions[i] + 5} textAnchor="end" fill={editingY === i ? PINK : "#d1d5db"} fontSize="13" fontFamily="sans-serif" className={locked ? "cursor-default" : "cursor-pointer"} onClick={() => { if (locked) return; setEditingY(i); setEditingX(null); setEditValue(label) }}>{label}</text>)}
        {xLabels.map((label, i) => <text key={`xt-${i}`} x={xPositions[i]} y={height - 6} textAnchor="middle" fill={editingX === i ? PINK : "#d1d5db"} fontSize="13" fontFamily="sans-serif" className={locked ? "cursor-default" : "cursor-pointer"} onClick={() => { if (locked) return; setEditingX(i); setEditingY(null); setEditValue(label) }}>{label}</text>)}
        <path d={pathD} fill="none" stroke={PINK} strokeWidth={5} strokeLinecap="round" />
        {data.map((d, i) => <circle key={`tr-${i}`} cx={getX(i)} cy={getY(d.thisReel)} r={18} fill="transparent" className={locked ? "cursor-default" : "cursor-grab active:cursor-grabbing"} onPointerDown={e => handlePointerDown(i, "thisReel", e)} style={{ touchAction: "none" }} />)}
      </svg>
    </div>
  )
}

// ===== DRAGGABLE ENGAGEMENT GRAPH =====
type EngagementPoint = { time: string; value: number }
const DraggableEngagementGraph = ({ data, onChange, locked, videoDuration }: { data: EngagementPoint[]; onChange: (d: EngagementPoint[]) => void; locked: boolean; videoDuration: string }) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const [dragging, setDragging] = useState<number | null>(null)
  const [editingRightX, setEditingRightX] = useState(false)
  const [rightXValue, setRightXValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => { if (editingRightX && inputRef.current) { inputRef.current.focus(); inputRef.current.select() } }, [editingRightX])
  const padding = { top: 15, right: 10, bottom: 38, left: 44 }
  const width = 380; const height = 160
  const chartW = width - padding.left - padding.right; const chartH = height - padding.top - padding.bottom
  const getX = (i: number) => padding.left + (i / Math.max(data.length - 1, 1)) * chartW
  const getY = (val: number) => padding.top + chartH - (Math.min(val, 100) / 100) * chartH
  const getValFromY = (clientY: number) => { const svg = svgRef.current; if (!svg) return 0; const rect = svg.getBoundingClientRect(); const svgY = ((clientY - rect.top) / rect.height) * height; return Math.max(0, Math.min(100, Math.round(((padding.top + chartH - svgY) / chartH) * 100))) }
  const buildPath = (points: { x: number; y: number }[]) => { if (points.length < 2) return ""; let d = `M ${points[0].x} ${points[0].y}`; for (let i = 1; i < points.length; i++) d += ` L ${points[i].x} ${points[i].y}`; return d }
  const points = data.map((d, i) => ({ x: getX(i), y: getY(d.value) }))
  const pathD = buildPath(points)
  const handlePointerDown = (index: number, e: React.PointerEvent) => { if (locked) return; e.preventDefault(); e.stopPropagation(); (e.target as Element).setPointerCapture?.(e.pointerId); setDragging(index) }
  const handlePointerMove = (e: React.PointerEvent) => { if (dragging === null || locked) return; e.preventDefault(); const val = getValFromY(e.clientY); const nd = [...data]; nd[dragging] = { ...nd[dragging], value: val }; onChange(nd) }
  const handlePointerUp = () => setDragging(null)
  const lastIdx = data.length - 1
  const commitRightX = () => { if (rightXValue.trim()) { const nd = [...data]; nd[lastIdx] = { ...nd[lastIdx], time: rightXValue.trim() }; onChange(nd) }; setEditingRightX(false) }
  const totalSec = (() => { const parts = videoDuration.split(":").map(Number); return parts.length === 2 ? parts[0] * 60 + parts[1] : 31 })()
  const durMin = Math.floor(totalSec / 60); const durSec = totalSec % 60
  const defaultRightLabel = `${durMin}:${durSec.toString().padStart(2, "0")}`

  return (
    <div className="relative -mx-1">
      {editingRightX && <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"><input ref={inputRef} value={rightXValue} onChange={e => setRightXValue(e.target.value)} onBlur={commitRightX} onKeyDown={e => { if (e.key === "Enter") commitRightX() }} className="pointer-events-auto bg-zinc-800 border border-fuchsia-500 rounded-lg px-3 py-1.5 text-[13px] text-white text-center w-[100px] outline-none shadow-lg" style={{ caretColor: PINK }} /></div>}
      <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`} className="w-full touch-none select-none" onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
        {[0, 50, 100].map(t => <text key={t} x={padding.left - 8} y={getY(t) + 4} textAnchor="end" fill="#d1d5db" fontSize="13" fontFamily="sans-serif">{t === 0 ? "0" : `${t}%`}</text>)}
        <text x={padding.left + 18} y={height - 7} textAnchor="middle" fill="#d1d5db" fontSize="13" fontFamily="sans-serif">0:00</text>
        <text x={getX(lastIdx)} y={height - 7} textAnchor="middle" fill={editingRightX ? PINK : "#d1d5db"} fontSize="13" fontFamily="sans-serif" className={locked ? "cursor-default" : "cursor-pointer"} onClick={() => { if (locked) return; setRightXValue(data[lastIdx]?.time || defaultRightLabel); setEditingRightX(true) }}>{data[lastIdx]?.time || defaultRightLabel}</text>
        <path d={pathD} fill="none" stroke={PINK} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
        {data.map((d, i) => <circle key={i} cx={getX(i)} cy={getY(d.value)} r={18} fill="transparent" className={locked ? "cursor-default" : "cursor-grab active:cursor-grabbing"} onPointerDown={e => handlePointerDown(i, e)} style={{ touchAction: "none" }} />)}
      </svg>
    </div>
  )
}

// ===== DRAGGABLE RETENTION GRAPH =====
type RetentionPoint = { time: string; retention: number }
const DraggableRetentionGraph = ({ data, onChange, locked, videoDuration }: { data: RetentionPoint[]; onChange: (d: RetentionPoint[]) => void; locked: boolean; videoDuration: string }) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const [dragging, setDragging] = useState<number | null>(null)
  const [editingRightX, setEditingRightX] = useState(false)
  const [rightXValue, setRightXValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => { if (editingRightX && inputRef.current) { inputRef.current.focus(); inputRef.current.select() } }, [editingRightX])
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
  const lastIdx = data.length - 1
  const commitRightX = () => { if (rightXValue.trim()) { const nd = [...data]; nd[lastIdx] = { ...nd[lastIdx], time: rightXValue.trim() }; onChange(nd) }; setEditingRightX(false) }
  const totalSec = (() => { const parts = videoDuration.split(":").map(Number); return parts.length === 2 ? parts[0] * 60 + parts[1] : 31 })()
  const durMin = Math.floor(totalSec / 60); const durSec = totalSec % 60
  const dynamicDurLabel = `${durMin}:${durSec.toString().padStart(2, "0")}`

  return (
    <div className="relative -mx-1">
      {editingRightX && <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"><input ref={inputRef} value={rightXValue} onChange={e => setRightXValue(e.target.value)} onBlur={commitRightX} onKeyDown={e => { if (e.key === "Enter") commitRightX() }} className="pointer-events-auto bg-zinc-800 border border-fuchsia-500 rounded-lg px-3 py-1.5 text-[13px] text-white text-center w-[100px] outline-none shadow-lg" style={{ caretColor: PINK }} /></div>}
      <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`} className="w-full touch-none select-none" onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
        {[0, 50, 100].map(t => <text key={t} x={padding.left - 8} y={getY(t) + 4} textAnchor="end" fill="#d1d5db" fontSize="13" fontFamily="sans-serif">{t === 0 ? "0" : `${t}%`}</text>)}
        {data[0] && <text x={getX(0) + 18} y={height - 7} textAnchor="middle" fill="#d1d5db" fontSize="13" fontFamily="sans-serif">{data[0].time}</text>}
        <text x={getX(lastIdx) - 6} y={height - 7} textAnchor="middle" fill={editingRightX ? PINK : "#d1d5db"} fontSize="13" fontFamily="sans-serif" className={locked ? "cursor-default" : "cursor-pointer"} onClick={() => { if (locked) return; setRightXValue(dynamicDurLabel); setEditingRightX(true) }}>{dynamicDurLabel}</text>
        <path d={pathD} fill="none" stroke={PINK} strokeWidth={5} strokeLinecap="round" />
        {data.map((d, i) => <circle key={i} cx={getX(i)} cy={getY(d.retention)} r={16} fill="transparent" className={locked ? "cursor-default" : "cursor-grab active:cursor-grabbing"} onPointerDown={e => handlePointerDown(i, e)} style={{ touchAction: "none" }} />)}
      </svg>
    </div>
  )
}

const TABS = ["Overview", "Engagement", "Audience"] as const

export default function ReelInsights() {
  const { data: insightsData, saveData } = useInsightsStorage()
  const [thumbnailImage, setThumbnailImage] = useState<string | null>(null)
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
  const thumbnailInputRef = useRef<HTMLInputElement>(null)
  const retentionInputRef = useRef<HTMLInputElement>(null)
  const [mainTab, setMainTab] = useState<"Overview" | "Engagement" | "Audience">("Overview")
    const [animationKey, setAnimationKey] = useState(0)
  const [viewsAnimKey, setViewsAnimKey] = useState(0)
  const overviewRef = useRef<HTMLDivElement>(null)
  const tabsRef = useRef<HTMLDivElement>(null)
  const tabsPlaceholderRef = useRef<HTMLDivElement>(null)
  const [tabsSticky, setTabsSticky] = useState(false)
  const tabsOffsetTop = useRef(0)

  const buildEngagementData = (videoDuration: string): EngagementPoint[] => {
    const totalSec = (() => { const parts = videoDuration.split(":").map(Number); return parts.length === 2 ? parts[0] * 60 + parts[1] : 31 })()
    const numPoints = Math.min(totalSec + 1, 20)
    const data: EngagementPoint[] = []
    for (let i = 0; i < numPoints; i++) {
      const p = i / (numPoints - 1); let v = 0
      if (p < 0.1) v = 60 + Math.random() * 30; else if (p < 0.2) v = 40 + Math.random() * 35
      else if (p < 0.4) v = 20 + Math.random() * 40; else if (p < 0.5) v = 50 + Math.random() * 40
      else if (p < 0.7) v = 15 + Math.random() * 30; else v = 5 + Math.random() * 20
      const timeSec = Math.round(p * totalSec); const tMin = Math.floor(timeSec / 60); const tSec = timeSec % 60
      data.push({ time: `${tMin}:${tSec.toString().padStart(2, "0")}`, value: Math.min(100, Math.max(0, v)) })
    }
    if (data.length > 0) { const dm = Math.floor(totalSec / 60); const ds = totalSec % 60; data[data.length - 1].time = `${dm}:${ds.toString().padStart(2, "0")}` }
    return data
  }

  const [engagementData, setEngagementData] = useState<EngagementPoint[]>([])

  useEffect(() => {
    try {
      const sl = localStorage.getItem("site-locked"); if (sl) setLocked(JSON.parse(sl))
      const sp = localStorage.getItem("profile-activity"); if (sp) setProfileActivity(JSON.parse(sp))
      const sv = localStorage.getItem("profile-visits"); if (sv) setProfileVisits(JSON.parse(sv))
    } catch {}
  }, [])

  useEffect(() => {
    const updateOffset = () => { if (tabsPlaceholderRef.current) tabsOffsetTop.current = tabsPlaceholderRef.current.getBoundingClientRect().top + window.scrollY }
    updateOffset()
    window.addEventListener("resize", updateOffset)
    const handleScroll = () => { updateOffset(); setTabsSticky(window.scrollY >= tabsOffsetTop.current) }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => { window.removeEventListener("scroll", handleScroll); window.removeEventListener("resize", updateOffset) }
  }, [])

  const toggleLock = () => { const n = !locked; setLocked(n); try { localStorage.setItem("site-locked", JSON.stringify(n)) } catch {} }
  const replayOverviewAnimation = () => { setAnimationKey(p => p + 1) }

  const DEFAULT_GRAPH_DATA: GraphPoint[] = [
    { date: "28 Jan", thisReel: 80, typical: 60 }, { date: "28 Jan", thisReel: 200, typical: 80 },
    { date: "28 Jan", thisReel: 170, typical: 90 }, { date: "29 Jan", thisReel: 320, typical: 75 },
    { date: "29 Jan", thisReel: 290, typical: 100 }, { date: "29 Jan", thisReel: 400, typical: 85 },
    { date: "30 Jan", thisReel: 370, typical: 95 }, { date: "30 Jan", thisReel: 460, typical: 80 },
    { date: "30 Jan", thisReel: 481, typical: 110 },
  ]
  const [graphData, setGraphData] = useState<GraphPoint[]>(DEFAULT_GRAPH_DATA)
  const [retentionData, setRetentionData] = useState<RetentionPoint[]>(insightsData.retentionData)

  useEffect(() => {
    const fp = parseFloat((Math.random() * 8 + 2).toFixed(1))
    const reels = parseFloat((Math.random() * 10 + 75).toFixed(1)); const explore = parseFloat((Math.random() * 5 + 10).toFixed(1)); const rem = parseFloat((100 - reels - explore).toFixed(1)); const stories = parseFloat((rem * 0.55).toFixed(1)); const profile = parseFloat((rem * 0.28).toFixed(1)); const feed = parseFloat((rem - stories - profile).toFixed(1))
    const sT = parseFloat((Math.random() * 10 + 10).toFixed(1)); const sTy = parseFloat((Math.random() * 10 + 20).toFixed(1))
    const us = parseFloat((Math.random() * 10 + 35).toFixed(1)); const uk = parseFloat((Math.random() * 8 + 20).toFixed(1)); const ca = parseFloat((Math.random() * 6 + 12).toFixed(1)); const au = parseFloat((Math.random() * 5 + 8).toFixed(1)); const de = parseFloat((Math.random() * 3 + 4).toFixed(1)); const ot = parseFloat((100 - us - uk - ca - au - de).toFixed(1))
    const a18 = parseFloat((Math.random() * 13 + 35).toFixed(1)); const a25 = parseFloat((Math.random() * 12 + 30).toFixed(1)); const a35 = parseFloat((Math.random() * 5 + 5).toFixed(1)); const a45 = parseFloat((Math.random() * 3 + 1).toFixed(1)); const a55 = parseFloat((Math.random() * 1.2 + 0.3).toFixed(1)); const a65 = parseFloat((Math.random() * 0.8 + 0.2).toFixed(1)); const a13 = parseFloat((100 - a18 - a25 - a35 - a45 - a55 - a65).toFixed(1))
    saveData({
      ...insightsData, followerPercentage: fp, skipRateThis: sT, skipRateTypical: sTy,
      countryData: [{ name: insightsData.countryData[0]?.name ?? "United States", percentage: us }, { name: insightsData.countryData[1]?.name ?? "United Kingdom", percentage: uk }, { name: insightsData.countryData[2]?.name ?? "Canada", percentage: ca }, { name: insightsData.countryData[3]?.name ?? "Australia", percentage: au }, { name: insightsData.countryData[4]?.name ?? "Germany", percentage: de }, { name: insightsData.countryData[5]?.name ?? "Others", percentage: Math.max(0, ot) }],
      ageData: [{ name: "13-17", percentage: Math.max(0, a13) }, { name: "18-24", percentage: a18 }, { name: "25-34", percentage: a25 }, { name: "35-44", percentage: a35 }, { name: "45-54", percentage: a45 }, { name: "55-64", percentage: a55 }, { name: "65+", percentage: a65 }],
      sourcesData: [{ name: "Reels tab", percentage: reels }, { name: "Explore", percentage: explore }, { name: "Stories", percentage: stories }, { name: "Profile", percentage: profile }, { name: "Feed", percentage: Math.max(0, feed) }],
    })
  }, [])

  useEffect(() => {
    try {
      const s = localStorage.getItem("graph-data"); if (s) { const p = JSON.parse(s); if (Array.isArray(p) && p.length > 0) setGraphData(p) }
      const sr = localStorage.getItem("retention-data"); if (sr) { const p = JSON.parse(sr); if (Array.isArray(p) && p.length > 0) setRetentionData(p) }
      const se = localStorage.getItem("engagement-graph-data")
      if (se) { const p = JSON.parse(se); if (Array.isArray(p) && p.length > 0) { setEngagementData(p); return } }
      setEngagementData(buildEngagementData(insightsData.videoDuration))
    } catch { setEngagementData(buildEngagementData(insightsData.videoDuration)) }
  }, [])

  const handleGraphChange = (nd: GraphPoint[]) => { if (locked) return; setGraphData(nd); try { localStorage.setItem("graph-data", JSON.stringify(nd)) } catch {} }
  const handleRetentionChange = (nd: RetentionPoint[]) => { if (locked) return; setRetentionData(nd); try { localStorage.setItem("retention-data", JSON.stringify(nd)) } catch {} }
  const handleEngagementChange = (nd: EngagementPoint[]) => { if (locked) return; setEngagementData(nd); try { localStorage.setItem("engagement-graph-data", JSON.stringify(nd)) } catch {} }

  useEffect(() => {
    setSummaryLoading(true)
    const t1 = setTimeout(() => setSummaryLoading(false), 900)
    const t2 = setTimeout(() => setAnimateCharts(true), 300)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [insightsData])

  const handleEditorSave = (ud: InsightsData) => { saveData(ud); setAnimateCharts(false); setTimeout(() => setAnimateCharts(true), 50) }
  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => { if (locked) return; const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.onload = ev => setThumbnailImage(ev.target?.result as string); r.readAsDataURL(f) } }
  const handleRetentionThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => { if (locked) return; const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.onload = ev => setRetentionThumbnail(ev.target?.result as string); r.readAsDataURL(f) } }
  const saveGender = (newMen: number) => { const nw = parseFloat((100 - newMen).toFixed(1)); try { localStorage.setItem("gender-data", JSON.stringify({ men: newMen, women: nw })) } catch {}; saveData({ ...insightsData, genderData: { men: newMen, women: nw } }) }

  const totalViews = insightsData.views || 1
  const affectsData = [
    { icon: <SkipRateIcon />, label: "Skip rate", value: `${insightsData.skipRateThis.toFixed(1)}%` },
    { icon: <ShareRateIcon />, label: "Share rate", value: `${((insightsData.shares / totalViews) * 100).toFixed(1)}%` },
    { icon: <LikeRateIcon />, label: "Like rate", value: `${((insightsData.likes / totalViews) * 100).toFixed(1)}%` },
    { icon: <SaveRateIcon />, label: "Save rate", value: `${((insightsData.bookmarks / totalViews) * 100).toFixed(1)}%` },
    { icon: <RepostRateIcon />, label: "Repost rate", value: `${((insightsData.reposts / totalViews) * 100).toFixed(1)}%` },
    { icon: <CommentRateIcon />, label: "Comment rate", value: `${((insightsData.comments / totalViews) * 100).toFixed(1)}%` },
  ]

  return (
    <>
      <style>{shimmerKeyframes}</style>

      <div
        className="min-h-screen text-white font-sans antialiased overflow-x-hidden flex justify-center"
        style={{ backgroundColor: BG }}
      >
        <div className="w-full max-w-[420px]">

          {/* Header */}
          <header className="sticky top-0 z-50" style={{ backgroundColor: BG }}>
            <div className="flex items-center justify-between px-4 h-[48px]">
              <button className="p-1 -ml-1 active:opacity-60 transition-opacity"><ChevronLeftIcon /></button>
              <h1 className="text-[18px] font-semibold flex-1 ml-4">Reel insights</h1>
              <div className="flex items-center gap-2">
                <button className="p-1 active:opacity-60 transition-opacity" onClick={() => {}}><HeaderBoostIcon /></button>
                <LockMenu locked={locked} onToggle={toggleLock} onOpenEditor={() => setEditorOpen(true)} onLongPress={() => setBottomSheetOpen(true)} />
              </div>
            </div>
          </header>

          {/* Thumbnail */}
          <section className="flex flex-col items-center pt-4 pb-4 px-5">
            <div className="relative w-[130px] h-[230px] bg-zinc-900 rounded-xl overflow-hidden cursor-pointer group shadow-lg" onClick={() => { if (!locked) thumbnailInputRef.current?.click() }}>
              {thumbnailImage ? (<><img src={thumbnailImage} alt="Reel" className="w-full h-full object-cover" />{!locked && <button className="absolute top-1.5 right-1.5 p-1 bg-black/70 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => { e.stopPropagation(); setThumbnailImage(null) }}><CloseIcon /></button>}</>) : (<div className="flex flex-col items-center justify-center h-full text-zinc-500 hover:text-zinc-300 transition-colors"><UploadIcon /><span className="text-[9px] mt-1.5 font-medium">Upload thumbnail</span></div>)}
              <input ref={thumbnailInputRef} type="file" accept="image/*" className="hidden" onChange={handleThumbnailUpload} />
            </div>
                            <div className="flex items-start justify-center gap-7 w-full mt-4 px-3 overflow-visible [&_svg]:block [&_svg]:overflow-visible">
  <div className="flex flex-col items-center gap-1 min-w-[38px]" style={{ lineHeight: 0 }}>
    <HeartIcon />
    <span className="text-[10px] text-white leading-none font-semibold">{insightsData.likes}</span>
  </div>

  <div className="flex flex-col items-center gap-1 min-w-[38px]" style={{ lineHeight: 0 }}>
    <CommentIcon />
    <span className="text-[10px] text-white leading-none font-semibold">{insightsData.comments}</span>
  </div>

  <div className="flex flex-col items-center gap-1 min-w-[38px]" style={{ lineHeight: 0 }}>
    <RepostIcon />
    <span className="text-[10px] text-white leading-none font-semibold">{insightsData.reposts}</span>
  </div>

  <div className="flex flex-col items-center gap-1 min-w-[38px]" style={{ lineHeight: 0 }}>
    <SendIcon />
    <span className="text-[10px] text-white leading-none font-semibold">{insightsData.shares}</span>
  </div>

  <div className="flex flex-col items-center gap-1 min-w-[38px]" style={{ lineHeight: 0 }}>
    <BookmarkIcon />
    <span className="text-[10px] text-white leading-none font-semibold">{insightsData.bookmarks}</span>
  </div>
</div>
          </section>

          {/* Tabs placeholder */}
          <div ref={tabsPlaceholderRef} style={{ height: tabsSticky ? 45 : 0 }} />

          {/* Tabs */}
          <LayoutGroup>
            <div
              ref={tabsRef}
              className="flex border-b border-zinc-800/40 z-50"
              style={{
                position: tabsSticky ? "fixed" : "relative",
                top: tabsSticky ? 0 : undefined,
                left: tabsSticky ? 0 : undefined,
                right: tabsSticky ? 0 : undefined,
                width: tabsSticky ? "100%" : undefined,
                maxWidth: tabsSticky ? 420 : undefined,
                margin: tabsSticky ? "0 auto" : undefined,
                backgroundColor: BG,
              }}
            >
              {TABS.map(tab => (
                <button key={tab} onClick={() => setMainTab(tab)} className={`flex-1 py-2.5 text-[13px] font-medium text-center relative transition-colors ${mainTab === tab ? "text-white" : "text-gray-300"}`}>
                  {tab}
                  {mainTab === tab && (
                    <motion.div
                      layoutId="activeTabUnderline"
                      className="absolute bottom-0 left-1/4 right-1/4 h-[2px] bg-white rounded-full"
                      transition={{ type: "spring", stiffness: 500, damping: 40 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </LayoutGroup>

          <main className="pb-12">
            <AnimatePresence mode="wait">

              {/* ===== OVERVIEW ===== */}
              {mainTab === "Overview" && (
                <motion.div key="overview" variants={tabContent} initial="initial" animate="animate" exit="exit">

                                                                        <section ref={overviewRef} key={animationKey} className="px-4 pt-5 pb-4">
                    <div className="flex items-center gap-2 mb-4">
                      <h3 className="text-[15px] font-semibold">Summary</h3>
                      <button onClick={() => { setSummaryLoading(true); setViewsAnimKey(k => k + 1); setTimeout(() => setSummaryLoading(false), 800) }} className="focus:outline-none active:opacity-60 transition-opacity"><InfoIcon /></button>
                    </div>
                    <div className="grid grid-cols-2 gap-2.5">
                      {[
                        { label: "Views", value: insightsData.views },
                        { label: "Accounts reached", value: insightsData.accountsReached },
                        { label: "Average watch time", value: insightsData.avgWatchTime },
                        { label: "Follows", value: profileActivity },
                      ].map((card, i) => (
                        <div
                          key={card.label}
                          className="rounded-xl p-3.5 relative overflow-hidden"
                          style={{ backgroundColor: CARD_BG, minHeight: 72, transform: "none" }}
                        >
                          {/* Shimmer overlay — sits on top, doesn't affect layout */}
                          {summaryLoading && (
                            <div className="absolute inset-0 z-10" style={{ ...shimmerStyle, animationDelay: `${i * 0.08}s` }} />
                          )}

                          {/* Content — ALWAYS rendered to maintain fixed height */}
                          <div style={{ opacity: summaryLoading ? 0 : 1, transition: "opacity 0.2s ease-out" }}>
                            <div className="h-[14px] mb-1 flex items-center">
                              <span className="text-[11px] text-gray-400">{card.label}</span>
                            </div>
                            <div className="h-[24px] flex items-center">
                              {card.label === "Average watch time" ? (
                                <span className="text-[17px] font-bold text-white">{card.value}</span>
                              ) : card.label === "Follows" ? (
                                <InlineEditor value={profileActivity} isNumber locked={locked} className="text-[17px] font-bold text-white" onSave={val => { const n = Math.round(val); setProfileActivity(n); try { localStorage.setItem("profile-activity", JSON.stringify(n)) } catch {} }} />
                              ) : (
                                <span className="text-[17px] font-bold text-white">{(card.value as number).toLocaleString("en-IN")}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="px-4 py-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2"><h3 className="text-[15px] font-semibold">Views</h3><InfoIcon /></div>
                           <AnimatedNumber value={insightsData.views} className="text-[15px] font-semibold" triggerKey={viewsAnimKey} />
                    </div>
                    <div className="flex gap-2 mb-6">
                      {(["All", "Followers", "Non-followers"] as const).map(filter => (
                        <button key={filter} onClick={() => setViewsFilter(filter)} className={`px-3.5 py-[7px] rounded-full text-[11px] font-medium transition-all duration-200 ${viewsFilter === filter ? "text-white" : "bg-transparent text-white border border-zinc-700"}`} style={viewsFilter === filter ? { backgroundColor: CARD_BG } : {}}>{filter}</button>
                      ))}
                    </div>
                    <DraggableGraph data={graphData} onChange={handleGraphChange} locked={locked} />
                  </section>

                  <section className="px-4 py-5">
                    <div className="flex items-center gap-2 mb-4"><h3 className="text-[15px] font-semibold">What affects your views</h3><InfoIcon /></div>
                                        <div className="space-y-5">
                      {affectsData.map((item, i) => (
                        <div key={i} className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                            <div className="rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: CARD_BG, width: 52, height: 52 }}>{item.icon}</div>
                            <span className="text-[14px] text-white font-medium">{item.label}</span>
                          </div>
                          <span className="text-[14px] text-white font-semibold">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="px-4 py-5">
                    <div className="flex items-center gap-2 mb-4"><h3 className="text-[15px] font-semibold">How long people watched your reel</h3><InfoIcon /></div>
                    <div className="flex justify-center mb-5">
                      <div className="relative w-[100px] h-[170px] bg-zinc-900 rounded-xl overflow-hidden cursor-pointer group shadow-xl" onClick={() => { if (!locked) retentionInputRef.current?.click() }}>
                        {retentionThumbnail ? (<><img src={retentionThumbnail} alt="Retention" className="w-full h-full object-cover" />{!locked && <button className="absolute top-1.5 right-1.5 p-1 bg-black/70 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => { e.stopPropagation(); setRetentionThumbnail(null) }}><CloseIcon /></button>}</>) : (<div className="flex flex-col items-center justify-center h-full text-zinc-500"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg><span className="text-[9px] mt-1.5">Upload</span></div>)}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"/></svg></div>
                        <input ref={retentionInputRef} type="file" accept="image/*" className="hidden" onChange={handleRetentionThumbnailUpload} />
                      </div>
                    </div>
                    <DraggableRetentionGraph data={retentionData} onChange={handleRetentionChange} locked={locked} videoDuration={insightsData.videoDuration} />
                  </section>

                  <section className="px-4 py-5">
                    <div className="flex items-center gap-2 mb-4"><h4 className="text-[15px] font-semibold">Top sources of views</h4><InfoIcon /></div>
                    <div className="space-y-4">
                      {insightsData.sourcesData.map((source, index) => (
                        <div key={source.name}>
                          <div className="flex justify-between mb-1.5"><span className="text-[13px] text-white">{source.name}</span><span className="text-[13px] text-white font-medium">{source.percentage.toFixed(1)}%</span></div>
                          <SimpleBar percentage={source.percentage} color={PINK} animateCharts={animateCharts} delay={index * 100} />
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="px-4 py-5">
                    <h3 className="text-[15px] font-semibold mb-3">Ad</h3>
                    <button className="w-full flex items-center justify-between py-2 active:opacity-60 transition-opacity">
                      <div className="flex items-center gap-3"><BoostIcon /><span className="text-[13px] text-white font-medium">Boost this Reel</span></div>
                      <ChevronRightIcon />
                    </button>
                  </section>
                </motion.div>
              )}

              {/* ===== ENGAGEMENT ===== */}
              {mainTab === "Engagement" && (
                <motion.div key="engagement" variants={tabContent} initial="initial" animate="animate" exit="exit">
                  <section className="px-4 py-5">
                    <div className="flex items-center gap-2 mb-5"><h3 className="text-[15px] font-semibold">When people liked your reel</h3><InfoIcon /></div>
                    {engagementData.length > 0 && <DraggableEngagementGraph data={engagementData} onChange={handleEngagementChange} locked={locked} videoDuration={insightsData.videoDuration} />}
                  </section>

                  <section className="px-4 py-5">
                    <div className="flex items-center gap-2 mb-4"><h3 className="text-[15px] font-semibold">Actions after viewing</h3><InfoIcon /></div>
                    <div className="space-y-3.5">
                      <div className="flex justify-between items-center">
                        <span className="text-[13px] text-white">Follows</span>
                        <InlineEditor value={profileActivity} isNumber locked={locked} className="text-[13px] text-white font-semibold" onSave={val => { const n = Math.round(val); setProfileActivity(n); try { localStorage.setItem("profile-activity", JSON.stringify(n)) } catch {} }} />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[13px] text-white">Profile visits</span>
                        <InlineEditor value={profileVisits} isNumber locked={locked} className="text-[13px] text-white font-semibold" onSave={val => { const n = Math.round(val); setProfileVisits(n); try { localStorage.setItem("profile-visits", JSON.stringify(n)) } catch {} }} />
                      </div>
                    </div>
                  </section>

                  <section className="px-4 py-5">
                    <div className="flex items-center gap-2 mb-4"><h3 className="text-[15px] font-semibold">Interactions</h3><InfoIcon /></div>
                    <div className="space-y-3.5">
                      {[["Likes", insightsData.likes], ["Comments", insightsData.comments], ["Reposts", insightsData.reposts], ["Shares", insightsData.shares], ["Saves", insightsData.bookmarks]].map(([label, val]) => (
                        <div key={label as string} className="flex justify-between items-center">
                          <span className="text-[13px] text-white">{label}</span>
                          <span className="text-[13px] text-white font-semibold">{val}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                </motion.div>
              )}

              {/* ===== AUDIENCE ===== */}
              {mainTab === "Audience" && (
                <motion.div key="audience" variants={tabContent} initial="initial" animate="animate" exit="exit">
                  <section className="px-4 pt-5 pb-3">
                    <div className="flex items-center gap-2 mb-4"><h3 className="text-[15px] font-semibold">Who viewed your reel</h3><InfoIcon /></div>
                    <AudienceRow labelNode={<span>Followers</span>} percentage={insightsData.followerPercentage} barColor={PINK} animateCharts={animateCharts} delay={0} />
                    <AudienceRow labelNode={<span>Non-followers</span>} percentage={100 - insightsData.followerPercentage} barColor={PURPLE} animateCharts={animateCharts} delay={120} />
                  </section>

                  <section className="px-4 pt-3 pb-5">
                    <div className="flex items-center gap-2 mb-3"><h3 className="text-[15px] font-semibold">Audience details</h3><InfoIcon /></div>
                    <div className="flex gap-2 mb-5">
                      {(["Age", "Country", "Gender"] as const).map(tab => (
                        <button key={tab} onClick={() => setAudienceTab(tab === "Age" ? "Age" : tab === "Country" ? "Country" : "Gender")} className={`px-4 py-[8px] rounded-full text-[12px] font-medium transition-all duration-200 border ${audienceTab === tab ? "text-white border-transparent" : "bg-transparent text-white border-zinc-700"}`} style={audienceTab === tab ? { backgroundColor: CARD_BG } : {}}>{tab}</button>
                      ))}
                    </div>

                    <AnimatePresence mode="wait">
                      {audienceTab === "Age" && (
                        <motion.div key="age" variants={tabContent} initial="initial" animate="animate" exit="exit">
                          {insightsData.ageData.map((age, index) => <AudienceRow key={age.name} labelNode={<span>{age.name}</span>} percentage={age.percentage} barColor={PINK} animateCharts={animateCharts} delay={index * 60} />)}
                        </motion.div>
                      )}
                      {audienceTab === "Country" && (
                        <motion.div key="country" variants={tabContent} initial="initial" animate="animate" exit="exit">
                          {insightsData.countryData.map((country, index) => (
                            <AudienceRow key={index} labelNode={<CountryNameEditor locked={locked} name={country.name} onSave={newName => { const uc = [...insightsData.countryData]; uc[index] = { ...uc[index], name: newName }; try { localStorage.setItem("country-names", JSON.stringify(uc.map(c => c.name))) } catch {}; saveData({ ...insightsData, countryData: uc }) }} />} percentage={country.percentage} barColor={PINK} animateCharts={animateCharts} delay={index * 80} />
                          ))}
                        </motion.div>
                      )}
                      {audienceTab === "Gender" && (
                        <motion.div key="gender" variants={tabContent} initial="initial" animate="animate" exit="exit">
                          <div className="mb-3.5">
                            <div className="mb-1 text-[13px] text-white">Men</div>
                            <div className="flex items-center gap-3">
                              <AnimatedBar percentage={insightsData.genderData.men} color={PINK} animateCharts={animateCharts} delay={0} />
                              <GenderPercentEditor value={insightsData.genderData.men} locked={locked} onSave={saveGender} />
                            </div>
                          </div>
                          <div className="mb-3.5">
                            <div className="mb-1 text-[13px] text-white">Women</div>
                            <div className="flex items-center gap-3">
                              <AnimatedBar percentage={insightsData.genderData.women} color={PURPLE} animateCharts={animateCharts} delay={120} />
                              <span className="text-[13px] text-white font-semibold w-[46px] text-right shrink-0">{insightsData.genderData.women.toFixed(1)}%</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </section>
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
