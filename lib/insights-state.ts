// Type definitions for insights data
export interface ViewsTimeDataPoint {
  date: string
  thisReel: number
  typical: number
}

export interface RetentionDataPoint {
  time: string
  retention: number
}

export interface CountryDataPoint {
  name: string
  percentage: number
}

export interface AgeDataPoint {
  name: string
  percentage: number
}

export interface SourceDataPoint {
  name: string
  percentage: number
}

export interface InsightsData {
  // Basic metrics
  caption: string
  videoDuration: string // "0:31" format
  publishDate: string
  
  // Engagement metrics
  likes: number
  comments: number
  shares: number
  reposts: number
  bookmarks: number
  views: number
  
  // Views distribution
  followerPercentage: number
  
  // Demographics
  genderData: {
    men: number
    women: number
  }
  countryData: CountryDataPoint[]
  ageData: AgeDataPoint[]
  
  // Views Over Time
  viewsTimeData: ViewsTimeDataPoint[]
  
  // Retention
  retentionData: RetentionDataPoint[]
  skipRateThis: number
  skipRateTypical: number
  watchTime: string
  avgWatchTime: string
  
  // Sources
  sourcesData: SourceDataPoint[]
  accountsReached: number
}

// Default insights data
export const DEFAULT_INSIGHTS_DATA: InsightsData = {
  caption: "The ultimate cheat code for couples.",
  videoDuration: "0:31",
  publishDate: "28 January",
  
  likes: 22,
  comments: 1,
  shares: 22,
  reposts: 0,
  bookmarks: 1,
  views: 481,
  
  followerPercentage: 7.2,
  
  genderData: {
    men: 28.5,
    women: 71.5,
  },
  countryData: [
    { name: "United States", percentage: 38.5 },
    { name: "United Kingdom", percentage: 24.2 },
    { name: "Canada", percentage: 15.8 },
    { name: "Australia", percentage: 12.3 },
    { name: "Germany", percentage: 5.7 },
    { name: "Others", percentage: 3.5 },
  ],
  ageData: [
    { name: "13-17", percentage: 0.0 },
    { name: "18-24", percentage: 42.8 },
    { name: "25-34", percentage: 44.6 },
    { name: "35-44", percentage: 7.3 },
    { name: "45-54", percentage: 1.9 },
    { name: "55-64", percentage: 0.5 },
    { name: "65+", percentage: 0.7 },
  ],
  viewsTimeData: [
    { date: "12 Jan", thisReel: 100, typical: 1800 },
    { date: "15 Jan", thisReel: 2900, typical: 1900 },
    { date: "18 Jan", thisReel: 2950, typical: 1950 },
    { date: "23 Jan", thisReel: 2950, typical: 2000 },
    { date: "28 Jan", thisReel: 2950, typical: 2050 },
    { date: "2 Feb", thisReel: 2950, typical: 2100 },
  ],
  retentionData: [
    { time: "0:00", retention: 100 },
    { time: "0:01", retention: 85 },
    { time: "0:02", retention: 65 },
    { time: "0:03", retention: 55 },
    { time: "0:04", retention: 45 },
    { time: "0:05", retention: 38 },
    { time: "0:06", retention: 32 },
    { time: "0:07", retention: 28 },
    { time: "0:08", retention: 25 },
  ],
  skipRateThis: 15,
  skipRateTypical: 22,
  watchTime: "2h 48m 21s",
  avgWatchTime: "21s",
  
  sourcesData: [
    { name: "Reels tab", percentage: 77.2 },
    { name: "Explore", percentage: 11.7 },
    { name: "Stories", percentage: 6.9 },
    { name: "Profile", percentage: 1.5 },
    { name: "Feed", percentage: 0.3 },
  ],
  accountsReached: 2118,
}

// Utility function to parse duration string
export const parseDuration = (durationStr: string): number => {
  const parts = durationStr.split(":").map(Number)
  let seconds = 0
  if (parts.length === 3) {
    seconds = parts[0] * 3600 + parts[1] * 60 + parts[2]
  } else if (parts.length === 2) {
    seconds = parts[0] * 60 + parts[1]
  }
  return seconds
}

// Utility function to format seconds to duration string
export const formatDuration = (seconds: number): string => {
  const hrs = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  
  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

// Generate realistic retention data based on video duration
export const generateRetentionData = (durationStr: string): RetentionDataPoint[] => {
  const totalSeconds = parseDuration(durationStr)
  const dataPoints = Math.min(Math.ceil(totalSeconds / 1), 20)
  
  const retentionData: RetentionDataPoint[] = []
  
  // Generate retention curve (typical exponential decay pattern)
  for (let i = 0; i <= dataPoints; i++) {
    const timeSeconds = (i / dataPoints) * totalSeconds
    const minutes = Math.floor(timeSeconds / 60)
    const seconds = Math.floor(timeSeconds % 60)
    
    // Exponential decay: 100 * e^(-k*t) where k ≈ 0.5
    const retention = Math.max(
      20,
      100 * Math.exp(-0.5 * (i / dataPoints))
    )
    
    retentionData.push({
      time: `${minutes}:${seconds.toString().padStart(2, "0")}`,
      retention: Math.round(retention),
    })
  }
  
  return retentionData
}

// Calculate watch time from views and average watch time
export const calculateWatchTime = (
  views: number,
  avgWatchTimeStr: string
): string => {
  if (!avgWatchTimeStr || views === 0) {
    return "0h 0m 0s"
  }
  
  let avgSeconds = 0
  
  // Handle different formats: "21s", "0:21", "1:23", "1m 21s", etc.
  const str = avgWatchTimeStr.trim().toLowerCase()
  
  if (str.includes('h')) {
    // Format: "1h 23m 45s"
    const parts = str.match(/(\d+)h\s*(\d+)m\s*(\d+)s/)
    if (parts) {
      avgSeconds = parseInt(parts[1]) * 3600 + parseInt(parts[2]) * 60 + parseInt(parts[3])
    }
  } else if (str.includes('m')) {
    // Format: "23m 45s" or "1m 21s"
    const parts = str.match(/(\d+)m\s*(\d+)s/)
    if (parts) {
      avgSeconds = parseInt(parts[1]) * 60 + parseInt(parts[2])
    }
  } else if (str.includes('s')) {
    // Format: "21s" or just "21"
    const num = str.match(/(\d+)/)
    if (num) {
      avgSeconds = parseInt(num[1])
    }
  } else if (str.includes(':')) {
    // Format: "0:21" or "1:23" (minutes:seconds)
    avgSeconds = parseDuration(str)
  } else {
    // Try to parse as number (seconds)
    const num = parseInt(str)
    if (!isNaN(num)) {
      avgSeconds = num
    }
  }
  
  if (avgSeconds === 0) {
    return "0h 0m 0s"
  }
  
  const totalSeconds = views * avgSeconds
  
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = Math.round(totalSeconds % 60)
  
  return `${hours}h ${minutes}m ${seconds}s`
}

// Ensure percentages sum to 100
export const normalizePercentages = (
  data: Array<{ percentage: number }>
): Array<{ percentage: number }> => {
  const total = data.reduce((sum, item) => sum + item.percentage, 0)
  if (total === 0) return data
  
  return data.map((item) => ({
    ...item,
    percentage: (item.percentage / total) * 100,
  }))
}

// Calculate total interactions
export const calculateInteractions = (data: Partial<InsightsData>): number => {
  return (data.likes || 0) + (data.comments || 0) + (data.shares || 0) + 
         (data.reposts || 0) + (data.bookmarks || 0)
}
