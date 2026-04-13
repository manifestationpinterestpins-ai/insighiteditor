"use client"

import React from "react"
import { useState, useRef, useEffect } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts"
import { InsightEditorModal } from "@/components/InsightEditorModal"
import { useInsightsStorage } from "@/hooks/useInsightsStorage"
import { InsightsData } from "@/lib/insights-state"

// Custom Icons matching Instagram exactly
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

const HeartIcon = ({ filled = false }: { filled?: boolean }) => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
)

const CommentIcon = ({ filled = false }: { filled?: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
)

const SendIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
)

const RepostIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 1l4 4-4 4" />
    <path d="M3 11V9a4 4 0 0 1 4-4h14" />
    <path d="M7 23l-4-4 4-4" />
    <path d="M21 13v2a4 4 0 0 1-4 4H3" />
  </svg>
)

const BookmarkIcon = ({ filled = false }: { filled?: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
)

const InfoIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-500">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
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

  useEffect(() => {
    const timer = setTimeout(() => setAnimateCharts(true), 300)
    return () => clearTimeout(timer)
  }, [insightsData])

  const handleEditorSave = (updatedData: InsightsData) => {
    saveData(updatedData)
    // Trigger animation refresh
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

  // Animated Donut chart component
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
          {/* Background circle */}
          <circle
            cx="130"
            cy="130"
            r={radius}
            fill="none"
            stroke="#27272a"
            strokeWidth={strokeWidth}
          />
          {/* Non-followers (purple/violet) */}
          <circle
            cx="130"
            cy="130"
            r={radius}
            fill="none"
            stroke="#8B5CF6"
            strokeWidth={strokeWidth}
            strokeDasharray={`${nonFollowerStroke} ${circumference}`}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
          {/* Followers (pink/magenta) */}
          <circle
            cx="130"
            cy="130"
            r={radius}
            fill="none"
            stroke="#D946EF"
            strokeWidth={strokeWidth}
            strokeDasharray={`${followerStroke} ${circumference}`}
            strokeDashoffset={-nonFollowerStroke}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-sm text-zinc-500 tracking-wide">{label}</span>
          <span className="text-[42px] font-semibold text-white tracking-tight">{value}</span>
        </div>
      </div>
    )
  }

  // Animated Progress bar component
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
      {/* Header - Sticky */}
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-sm border-b border-zinc-900">
        <div className="flex items-center justify-between px-4 h-[52px]">
          <button className="p-1 -ml-1 active:opacity-60 transition-opacity">
            <ChevronLeftIcon />
          </button>
          <h1 className="text-[17px] font-semibold">Reel insights</h1>
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
                <img
                  src={thumbnailImage || "/placeholder.svg"}
                  alt="Reel thumbnail"
                  className="w-full h-full object-cover"
                />
                <button
                  className="absolute top-2 right-2 p-1.5 bg-black/70 rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    setThumbnailImage(null)
                  }}
                >
                  <CloseIcon />
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-zinc-600 hover:text-zinc-400 transition-colors">
                <UploadIcon />
                <span className="text-xs mt-2 font-medium">Upload thumbnail</span>
              </div>
            )}
            <input
              ref={thumbnailInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleThumbnailUpload}
            />
          </div>

          {/* Title and Date */}
          <h2 className="text-[14px] font-semibold mt-4 text-center px-4 leading-tight">
            {insightsData.caption}
          </h2>
          <p className="text-[11px] text-zinc-500 mt-1">
            {insightsData.publishDate} · Duration {insightsData.videoDuration}
          </p>

          {/* Engagement Stats Row */}
          <div className="flex items-center justify-between w-full max-w-[340px] mt-5 px-2">
            <div className="flex flex-col items-center gap-1">
              <HeartIcon filled />
              <span className="text-[13px] font-medium">{insightsData.likes}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <CommentIcon filled />
              <span className="text-[13px] font-medium">{insightsData.comments}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <SendIcon />
              <span className="text-[13px] font-medium">{insightsData.shares}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <RepostIcon />
              <span className="text-[13px] font-medium">{insightsData.reposts}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <BookmarkIcon />
              <span className="text-[13px] font-medium">{insightsData.bookmarks}</span>
            </div>
          </div>
        </section>

        {/* Section Divider */}
        <div className="h-[6px] bg-zinc-900" />

        {/* Overview Section */}
        <section className="px-4 py-5">
          <div className="flex items-center gap-2 mb-5">
            <h3 className="text-[20px] font-semibold">Overview</h3>
            <InfoIcon />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[15px]">Views</span>
              <span className="text-[15px]">{insightsData.views}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[15px]">Watch time</span>
              <span className="text-[15px]">{insightsData.watchTime}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[15px]">Interactions</span>
              <span className="text-[15px]">
                {insightsData.likes + insightsData.comments + insightsData.shares + insightsData.reposts + insightsData.bookmarks}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[15px]">Profile activity</span>
              <span className="text-[15px]">0</span>
            </div>
          </div>
        </section>

        {/* Section Divider */}
        <div className="h-[6px] bg-zinc-900" />

        {/* Views Section with Donut */}
        <section className="px-4 py-5">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-[20px] font-semibold">Views</h3>
            <InfoIcon />
          </div>

          <DonutChart 
            value={insightsData.views.toString()} 
            label="Views" 
            followerPercent={insightsData.followerPercentage} 
          />

          {/* Followers/Non-followers legend */}
          <div className="space-y-3 mt-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-[6px] h-[6px] rounded-full bg-fuchsia-500" />
                <span className="text-[15px]">Followers</span>
              </div>
              <span className="text-[15px]">{insightsData.followerPercentage.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-[6px] h-[6px] rounded-full bg-violet-500" />
                <span className="text-[15px]">Non-followers</span>
              </div>
              <span className="text-[15px]">{(100 - insightsData.followerPercentage).toFixed(1)}%</span>
            </div>
          </div>
        </section>

        {/* Thin Divider */}
        <div className="h-px bg-zinc-800 mx-4" />

        {/* Views Over Time */}
        <section className="px-4 py-5">
          <h4 className="text-[17px] font-semibold mb-4">Views over time</h4>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-5">
            {(["All", "Followers", "Non-followers"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setViewsFilter(filter)}
                className={`px-4 py-[9px] rounded-lg text-[13px] font-medium transition-all duration-200 ${
                  viewsFilter === filter
                    ? "bg-zinc-800 text-white"
                    : "bg-transparent text-zinc-400 border border-zinc-800"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Line Chart */}
          <div className="h-44 -ml-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={insightsData.viewsTimeData}>
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#71717a", fontSize: 11 }}
                  dy={8}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#71717a", fontSize: 11 }}
                  tickFormatter={(value) =>
                    value >= 1000 ? `${value / 1000}K` : value.toString()
                  }
                  domain={[0, 3000]}
                  ticks={[0, 1500, 3000]}
                  width={35}
                />
                <Line
                  type="monotone"
                  dataKey="thisReel"
                  stroke="#D946EF"
                  strokeWidth={2.5}
                  dot={false}
                  animationDuration={1500}
                />
                <Line
                  type="monotone"
                  dataKey="typical"
                  stroke="#52525b"
                  strokeWidth={2}
                  strokeDasharray="6 6"
                  dot={false}
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-3">
            <div className="flex items-center gap-2">
              <div className="w-[6px] h-[6px] rounded-full bg-fuchsia-500" />
              <span className="text-[13px] text-zinc-500">This reel</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-[6px] h-[6px] rounded-full bg-zinc-600" />
              <span className="text-[13px] text-zinc-500">Your typical reel views</span>
            </div>
          </div>
        </section>

        {/* Thin Divider */}
        <div className="h-px bg-zinc-800 mx-4" />

        {/* Top Sources of Views */}
        <section className="px-4 py-5">
          <h4 className="text-[17px] font-semibold mb-5">Top sources of views</h4>

          <div className="space-y-5">
            {insightsData.sourcesData.map((source, index) => (
              <div key={source.name}>
                <div className="flex justify-between mb-2">
                  <span className="text-[15px]">{source.name}</span>
                  <span className="text-[15px]">{source.percentage.toFixed(1)}%</span>
                </div>
                <ProgressBar percentage={source.percentage} delay={index * 100} />
              </div>
            ))}
          </div>

          {/* Accounts Reached */}
          <div className="flex justify-between mt-6 pt-5 border-t border-zinc-800">
            <span className="text-[15px] font-medium">Accounts reached</span>
            <span className="text-[15px]">{insightsData.accountsReached.toLocaleString()}</span>
          </div>
        </section>

        {/* Section Divider */}
        <div className="h-[6px] bg-zinc-900" />

        {/* Interactions Section */}
        <section className="px-4 py-5">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-[20px] font-semibold">Interactions</h3>
            <InfoIcon />
          </div>

          <DonutChart 
            value={(insightsData.likes + insightsData.comments + insightsData.shares + insightsData.reposts + insightsData.bookmarks).toString()} 
            label="Interactions" 
            followerPercent={insightsData.followerPercentage} 
          />

          {/* Followers/Non-followers legend */}
          <div className="space-y-3 mt-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-[6px] h-[6px] rounded-full bg-fuchsia-500" />
                <span className="text-[15px]">Followers</span>
              </div>
              <span className="text-[15px]">{insightsData.followerPercentage.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-[6px] h-[6px] rounded-full bg-violet-500" />
                <span className="text-[15px]">Non-followers</span>
              </div>
              <span className="text-[15px]">{(100 - insightsData.followerPercentage).toFixed(1)}%</span>
            </div>
          </div>

          {/* Thin Divider */}
          <div className="h-px bg-zinc-800 my-5" />

          {/* Interaction Metrics */}
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-[15px]">Likes</span>
              <span className="text-[15px]">{insightsData.likes}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[15px]">Saves</span>
              <span className="text-[15px]">{insightsData.bookmarks}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[15px]">Shares</span>
              <span className="text-[15px]">{insightsData.shares}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[15px]">Reposts</span>
              <span className="text-[15px]">{insightsData.reposts}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[15px]">Comments</span>
              <span className="text-[15px]">{insightsData.comments}</span>
            </div>
          </div>
        </section>

        {/* Section Divider */}
        <div className="h-[6px] bg-zinc-900" />

        {/* Profile Activity Section */}
        <section className="px-4 py-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-[20px] font-semibold">Profile activity</h3>
              <InfoIcon />
            </div>
            <span className="text-[20px] font-semibold">1</span>
          </div>

          <div className="flex justify-between">
            <span className="text-[15px]">Follows</span>
            <span className="text-[15px]">1</span>
          </div>
        </section>

        {/* Section Divider */}
        <div className="h-[6px] bg-zinc-900" />

        {/* Retention Section */}
        <section className="px-4 py-5">
          <div className="flex items-center gap-2 mb-5">
            <h3 className="text-[20px] font-semibold">Retention</h3>
            <InfoIcon />
          </div>

          {/* Retention Video Thumbnail */}
          <div className="flex justify-center mb-6">
            <div
              className="relative w-[120px] h-[180px] bg-zinc-900 rounded-xl overflow-hidden cursor-pointer group shadow-xl"
              onClick={() => retentionInputRef.current?.click()}
            >
              {retentionThumbnail ? (
                <>
                  <img
                    src={retentionThumbnail || "/placeholder.svg"}
                    alt="Retention thumbnail"
                    className="w-full h-full object-cover"
                  />
                  <button
                    className="absolute top-2 right-2 p-1.5 bg-black/70 rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      setRetentionThumbnail(null)
                    }}
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
                  <span className="text-[11px] mt-2">Upload</span>
                </div>
              )}
              {/* Play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-11 h-11 rounded-full border-[2.5px] border-white/70 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                  <PlayIcon />
                </div>
              </div>
              <input
                ref={retentionInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleRetentionThumbnailUpload}
              />
            </div>
          </div>

          {/* Retention Chart */}
          <div className="h-44 -ml-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={insightsData.retentionData}>
                <defs>
                  <linearGradient id="retentionGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#D946EF" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#D946EF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="time"
                  axisLine={{ stroke: "#3f3f46", strokeWidth: 1 }}
                  tickLine={false}
                  tick={{ fill: "#71717a", fontSize: 11 }}
                  dy={8}
                />
                <YAxis
                  axisLine={{ stroke: "#3f3f46", strokeWidth: 1 }}
                  tickLine={false}
                  tick={{ fill: "#71717a", fontSize: 11 }}
                  tickFormatter={(value) => `${value}%`}
                  domain={[0, 100]}
                  ticks={[0, 50, 100]}
                  width={40}
                />
                <Area
                  type="monotone"
                  dataKey="retention"
                  stroke="#D946EF"
                  strokeWidth={2.5}
                  fill="url(#retentionGradient)"
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Skip Rate */}
          <div className="mt-6">
            <h4 className="text-[17px] font-semibold mb-4">Skip rate</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-[15px]">{"This reel's skip rate"}</span>
                <span className="text-[15px]">{insightsData.skipRateThis.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[15px]">Your typical skip rate</span>
                <span className="text-[15px]">{insightsData.skipRateTypical.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* Watch Time Stats */}
          <div className="mt-5 pt-5 border-t border-zinc-800 space-y-3">
            <div className="flex justify-between">
              <span className="text-[15px]">Watch time</span>
              <span className="text-[15px]">{insightsData.watchTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[15px]">Average watch time</span>
              <span className="text-[15px]">{insightsData.avgWatchTime}</span>
            </div>
          </div>
        </section>

        {/* Section Divider */}
        <div className="h-[6px] bg-zinc-900" />

        {/* Audience Section */}
        <section className="px-4 py-5">
          <div className="flex items-center gap-2 mb-5">
            <h3 className="text-[20px] font-semibold">Audience</h3>
            <InfoIcon />
          </div>

          {/* Audience Tabs */}
          <div className="flex gap-2 mb-5">
            {(["Gender", "Country", "Age"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setAudienceTab(tab)}
                className={`px-4 py-[9px] rounded-lg text-[13px] font-medium transition-all duration-200 ${
                  audienceTab === tab
                    ? "bg-zinc-800 text-white"
                    : "bg-transparent text-zinc-400 border border-zinc-800"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Gender Content */}
          {audienceTab === "Gender" && (
            <div className="space-y-5">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-[15px]">Men</span>
                  <span className="text-[15px]">{insightsData.genderData.men.toFixed(1)}%</span>
                </div>
                <ProgressBar percentage={insightsData.genderData.men} delay={0} />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-[15px]">Women</span>
                  <span className="text-[15px]">{insightsData.genderData.women.toFixed(1)}%</span>
                </div>
                <ProgressBar percentage={insightsData.genderData.women} color="violet" delay={100} />
              </div>
            </div>
          )}

          {/* Country Content */}
          {audienceTab === "Country" && (
            <div className="space-y-5">
              {insightsData.countryData.map((country, index) => (
                <div key={country.name}>
                  <div className="flex justify-between mb-2">
                    <span className="text-[15px]">{country.name}</span>
                    <span className="text-[15px]">{country.percentage.toFixed(1)}%</span>
                  </div>
                  <ProgressBar percentage={country.percentage} delay={index * 80} />
                </div>
              ))}
            </div>
          )}

          {/* Age Content */}
          {audienceTab === "Age" && (
            <div className="space-y-5">
              {insightsData.ageData.map((age, index) => (
                <div key={age.name}>
                  <div className="flex justify-between mb-2">
                    <span className="text-[15px]">{age.name}</span>
                    <span className="text-[15px]">{age.percentage.toFixed(1)}%</span>
                  </div>
                  <ProgressBar percentage={age.percentage} delay={index * 60} />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Bottom Padding */}
        <div className="h-8" />
      </main>

    
      {/* Insight Editor Modal */}
      <InsightEditorModal
        open={editorOpen}
        onOpenChange={setEditorOpen}
        data={insightsData}
        onSave={handleEditorSave}
      />
    </div>
  )
}
