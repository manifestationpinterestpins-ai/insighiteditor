"use client"

import React, { useState } from "react"
import { InsightsData, CountryDataPoint, AgeDataPoint, SourceDataPoint, normalizePercentages, calculateWatchTime } from "@/lib/insights-state"
import { recalculateMetrics } from "@/lib/insights-calculator"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

interface InsightEditorModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: InsightsData
  onSave: (updatedData: InsightsData) => void
}

export function InsightEditorModal({
  open,
  onOpenChange,
  data,
  onSave,
}: InsightEditorModalProps) {
  const [formData, setFormData] = useState<InsightsData>(data)

  // Reset form when modal opens
  React.useEffect(() => {
    setFormData(data)
  }, [data, open])

  const handleBasicChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleEngagementChange = (field: string, value: any) => {
    const updatedData = {
      ...formData,
      [field]: value,
    }
    const changes = recalculateMetrics(data, updatedData)
    setFormData((prev) => ({
      ...prev,
      ...changes,
    }))
  }

  const handleDemographicChange = (type: string, field: string, value: any) => {
    if (type === "gender") {
      setFormData((prev) => ({
        ...prev,
        genderData: {
          ...prev.genderData,
          [field]: value,
        },
      }))
    } else if (type === "country") {
      const [index, subField] = field.split(".")
      const idx = parseInt(index)
      const newCountryData = [...formData.countryData]
      newCountryData[idx] = { ...newCountryData[idx], [subField]: value }
      setFormData((prev) => ({
        ...prev,
        countryData: newCountryData,
      }))
    } else if (type === "age") {
      const index = parseInt(field)
      const newAgeData = [...formData.ageData]
      newAgeData[index] = { ...newAgeData[index], percentage: value }
      setFormData((prev) => ({
        ...prev,
        ageData: normalizePercentages(newAgeData),
      }))
    }
  }

  const handleSourceChange = (index: number, field: string, value: any) => {
    const newSourcesData = [...formData.sourcesData]
    newSourcesData[index] = { ...newSourcesData[index], [field]: value }
    setFormData((prev) => ({
      ...prev,
      sourcesData: normalizePercentages(newSourcesData),
    }))
  }

  const handleViewsTimeChange = (index: number, field: string, value: any) => {
    const newViewsTimeData = [...formData.viewsTimeData]
    if (field === "date") {
      newViewsTimeData[index] = { ...newViewsTimeData[index], date: value }
    } else {
      newViewsTimeData[index] = { ...newViewsTimeData[index], [field]: parseInt(value) || 0 }
    }
    setFormData((prev) => ({
      ...prev,
      viewsTimeData: newViewsTimeData,
    }))
  }

  const handleSave = () => {
    // Calculate watch time based on views and average watch time
    const calculatedWatchTime = calculateWatchTime(formData.views, formData.avgWatchTime)
    
    const finalData = {
      ...formData,
      watchTime: calculatedWatchTime,
    }
    onSave(finalData)
    onOpenChange(false)
  }

  const handleReset = () => {
    setFormData(data)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-zinc-950 border-zinc-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl">Edit Reel Insights</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-zinc-900 border-b border-zinc-800 h-auto">
            <TabsTrigger value="basic" className="text-xs">Basic</TabsTrigger>
            <TabsTrigger value="engagement" className="text-xs">Engagement</TabsTrigger>
            <TabsTrigger value="demographics" className="text-xs">Demographics</TabsTrigger>
            <TabsTrigger value="viewership" className="text-xs">Viewership</TabsTrigger>
            <TabsTrigger value="views-time" className="text-xs">Views Over Time</TabsTrigger>
            <TabsTrigger value="sources" className="text-xs">Sources</TabsTrigger>
          </TabsList>

          {/* Basic Metrics Tab */}
          <TabsContent value="basic" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="caption">Caption</Label>
              <Textarea
                id="caption"
                value={formData.caption}
                onChange={(e) => handleBasicChange("caption", e.target.value)}
                className="bg-zinc-900 border-zinc-800 text-white"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Video Duration (MM:SS)</Label>
                <Input
                  id="duration"
                  value={formData.videoDuration}
                  onChange={(e) =>
                    handleEngagementChange("videoDuration", e.target.value)
                  }
                  className="bg-zinc-900 border-zinc-800 text-white"
                  placeholder="0:31"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Publish Date</Label>
                <Input
                  id="date"
                  value={formData.publishDate}
                  onChange={(e) => handleBasicChange("publishDate", e.target.value)}
                  className="bg-zinc-900 border-zinc-800 text-white"
                  placeholder="28 January"
                />
              </div>
            </div>
          </TabsContent>

          {/* Engagement Metrics Tab */}
          <TabsContent value="engagement" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="views">Total Views</Label>
              <Input
                id="views"
                type="number"
                value={formData.views}
                onChange={(e) =>
                  handleEngagementChange("views", parseInt(e.target.value) || 0)
                }
                className="bg-zinc-900 border-zinc-800 text-white"
              />
            </div>

            <div className="p-4 bg-gradient-to-br from-zinc-900 to-zinc-900/50 rounded-lg border border-zinc-800 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="followerPercent" className="text-sm font-semibold text-zinc-300">
                  Followers Percentage (%)
                </Label>
                <Input
                  id="followerPercent"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={formData.followerPercentage}
                  onChange={(e) =>
                    handleEngagementChange(
                      "followerPercentage",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="bg-zinc-800 border-zinc-700 text-white font-medium"
                />
                <p className="text-xs text-zinc-500">Percentage of views from followers</p>
              </div>

              <div className="pt-2 border-t border-zinc-800">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-semibold text-zinc-300">
                    Non-Followers Percentage (%)
                  </Label>
                  <span className="text-sm font-semibold text-fuchsia-400">
                    {(100 - formData.followerPercentage).toFixed(1)}%
                  </span>
                </div>
                <div className="bg-zinc-950 rounded-lg p-3 border border-zinc-700">
                  <p className="text-xs text-zinc-500">
                    Auto-calculated: 100% - {formData.followerPercentage.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-br from-zinc-900 to-zinc-900/50 rounded-lg border border-zinc-800 space-y-4">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-sm font-semibold text-zinc-300">
                    Total Interactions
                  </Label>
                  <span className="text-lg font-bold text-fuchsia-400">
                    {formData.likes + formData.comments + formData.shares + formData.reposts + formData.bookmarks}
                  </span>
                </div>
                <p className="text-xs text-zinc-500">
                  Sum of all engagement metrics below
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="likes" className="text-xs font-semibold text-zinc-400 uppercase">
                    Likes
                  </Label>
                  <Input
                    id="likes"
                    type="number"
                    value={formData.likes}
                    onChange={(e) =>
                      handleEngagementChange("likes", parseInt(e.target.value) || 0)
                    }
                    className="bg-zinc-800 border-zinc-700 text-white text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="comments" className="text-xs font-semibold text-zinc-400 uppercase">
                    Comments
                  </Label>
                  <Input
                    id="comments"
                    type="number"
                    value={formData.comments}
                    onChange={(e) =>
                      handleEngagementChange("comments", parseInt(e.target.value) || 0)
                    }
                    className="bg-zinc-800 border-zinc-700 text-white text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shares" className="text-xs font-semibold text-zinc-400 uppercase">
                    Shares
                  </Label>
                  <Input
                    id="shares"
                    type="number"
                    value={formData.shares}
                    onChange={(e) =>
                      handleEngagementChange("shares", parseInt(e.target.value) || 0)
                    }
                    className="bg-zinc-800 border-zinc-700 text-white text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reposts" className="text-xs font-semibold text-zinc-400 uppercase">
                    Reposts
                  </Label>
                  <Input
                    id="reposts"
                    type="number"
                    value={formData.reposts}
                    onChange={(e) =>
                    handleEngagementChange("reposts", parseInt(e.target.value) || 0)
                  }
                  className="bg-zinc-900 border-zinc-800 text-white"
                />
              </div>

                <div className="space-y-2">
                  <Label htmlFor="bookmarks" className="text-xs font-semibold text-zinc-400 uppercase">
                    Bookmarks
                  </Label>
                  <Input
                    id="bookmarks"
                    type="number"
                    value={formData.bookmarks}
                    onChange={(e) =>
                      handleEngagementChange("bookmarks", parseInt(e.target.value) || 0)
                    }
                    className="bg-zinc-800 border-zinc-700 text-white text-sm"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Demographics Tab */}
          <TabsContent value="demographics" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div>
                <Label className="text-base font-semibold mb-3 block">
                  Gender Distribution
                </Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="men">Men (%)</Label>
                    <Input
                      id="men"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={formData.genderData.men}
                      onChange={(e) =>
                        handleDemographicChange("gender", "men", parseFloat(e.target.value))
                      }
                      className="bg-zinc-900 border-zinc-800 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="women">Women (%)</Label>
                    <Input
                      id="women"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={formData.genderData.women}
                      onChange={(e) =>
                        handleDemographicChange("gender", "women", parseFloat(e.target.value))
                      }
                      className="bg-zinc-900 border-zinc-800 text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-zinc-800 pt-4">
                <Label className="text-base font-semibold mb-3 block">
                  Top Countries
                </Label>
                <div className="space-y-3">
                  {formData.countryData.map((country, index) => (
                    <div key={index} className="space-y-2 p-3 bg-zinc-900/50 rounded-lg border border-zinc-800">
                      <div className="space-y-1">
                        <Label htmlFor={`country-name-${index}`} className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">
                          Country Name
                        </Label>
                        <Input
                          id={`country-name-${index}`}
                          type="text"
                          value={country.name}
                          onChange={(e) =>
                            handleDemographicChange(
                              "country",
                              `${index}.name`,
                              e.target.value
                            )
                          }
                          className="bg-zinc-800 border-zinc-700 text-white text-sm font-medium placeholder-zinc-600"
                          placeholder="Enter country name"
                        />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <Label htmlFor={`country-${index}`} className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">
                            Percentage
                          </Label>
                          <span className="text-sm font-semibold text-fuchsia-400">
                            {country.percentage.toFixed(1)}%
                          </span>
                        </div>
                        <Input
                          id={`country-${index}`}
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                          value={country.percentage}
                          onChange={(e) =>
                            handleDemographicChange(
                              "country",
                              `${index}.percentage`,
                              parseFloat(e.target.value)
                            )
                          }
                          className="bg-zinc-800 border-zinc-700 text-white text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-zinc-800 pt-4">
                <Label className="text-base font-semibold mb-3 block">
                  Age Distribution
                </Label>
                <div className="space-y-3">
                  {formData.ageData.map((age, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <Label htmlFor={`age-${index}`} className="text-sm">
                          {age.name}
                        </Label>
                        <span className="text-xs text-zinc-500">
                          {age.percentage.toFixed(1)}%
                        </span>
                      </div>
                      <Input
                        id={`age-${index}`}
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={age.percentage}
                        onChange={(e) =>
                          handleDemographicChange(
                            "age",
                            index.toString(),
                            parseFloat(e.target.value)
                          )
                        }
                        className="bg-zinc-900 border-zinc-800 text-white text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Viewership Tab */}
          <TabsContent value="viewership" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="skipRateThis">Skip Rate - This Reel (%)</Label>
              <Input
                id="skipRateThis"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.skipRateThis}
                onChange={(e) =>
                  handleBasicChange("skipRateThis", parseFloat(e.target.value))
                }
                className="bg-zinc-900 border-zinc-800 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="skipRateTypical">Skip Rate - Typical Reel (%)</Label>
              <Input
                id="skipRateTypical"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.skipRateTypical}
                onChange={(e) =>
                  handleBasicChange("skipRateTypical", parseFloat(e.target.value))
                }
                className="bg-zinc-900 border-zinc-800 text-white"
              />
            </div>

            <div className="p-4 bg-gradient-to-br from-zinc-900 to-zinc-900/50 rounded-lg border border-zinc-800 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="avgWatchTime" className="text-sm font-semibold text-zinc-300">
                  Average Watch Time Per View
                </Label>
                <Input
                  id="avgWatchTime"
                  value={formData.avgWatchTime}
                  onChange={(e) =>
                    handleBasicChange("avgWatchTime", e.target.value)
                  }
                  className="bg-zinc-800 border-zinc-700 text-white font-medium"
                  placeholder="21s"
                />
                <p className="text-xs text-zinc-500 mt-1">Format: MM:SS or Ss (e.g., 0:21 or 21s)</p>
              </div>

              <div className="pt-2 border-t border-zinc-800">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-semibold text-zinc-300">
                    Total Watch Time
                  </Label>
                  <span className="text-sm text-zinc-500">(Auto-calculated)</span>
                </div>
                <div className="bg-zinc-950 rounded-lg p-3 border border-zinc-700">
                  <p className="text-lg font-bold text-fuchsia-400">
                    {calculateWatchTime(formData.views, formData.avgWatchTime)}
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">
                    Based on {formData.views} views × {formData.avgWatchTime} avg watch time
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountsReached">Accounts Reached</Label>
              <Input
                id="accountsReached"
                type="number"
                value={formData.accountsReached}
                onChange={(e) =>
                  handleBasicChange("accountsReached", parseInt(e.target.value) || 0)
                }
                className="bg-zinc-900 border-zinc-800 text-white"
              />
            </div>
          </TabsContent>

          {/* Views Over Time Tab */}
          <TabsContent value="views-time" className="space-y-4 mt-4">
            <div className="space-y-4">
              {formData.viewsTimeData.map((dataPoint, index) => (
                <div
                  key={index}
                  className="p-3 bg-zinc-900/50 rounded-lg border border-zinc-800 space-y-3"
                >
                  <div className="space-y-2">
                    <Label htmlFor={`date-${index}`} className="text-sm font-semibold text-zinc-300">
                      Date
                    </Label>
                    <Input
                      id={`date-${index}`}
                      type="text"
                      value={dataPoint.date}
                      onChange={(e) =>
                        handleViewsTimeChange(index, "date", e.target.value)
                      }
                      className="bg-zinc-800 border-zinc-700 text-white text-sm font-medium"
                      placeholder="e.g., 12 Jan, 15 Jan, 2 Feb"
                    />
                    <p className="text-xs text-zinc-500">Format: DD Mon or D Mon (e.g., 12 Jan, 2 Feb)</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor={`this-reel-${index}`} className="text-sm font-semibold text-zinc-300">
                        This Reel Views
                      </Label>
                      <Input
                        id={`this-reel-${index}`}
                        type="number"
                        min="0"
                        value={dataPoint.thisReel}
                        onChange={(e) =>
                          handleViewsTimeChange(index, "thisReel", e.target.value)
                        }
                        className="bg-zinc-800 border-zinc-700 text-white text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`typical-${index}`} className="text-sm font-semibold text-zinc-300">
                        Typical Reel Views
                      </Label>
                      <Input
                        id={`typical-${index}`}
                        type="number"
                        min="0"
                        value={dataPoint.typical}
                        onChange={(e) =>
                          handleViewsTimeChange(index, "typical", e.target.value)
                        }
                        className="bg-zinc-800 border-zinc-700 text-white text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Sources Tab */}
          <TabsContent value="sources" className="space-y-4 mt-4">
            <div className="space-y-3">
              {formData.sourcesData.map((source, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={`source-${index}`} className="text-sm">
                      {source.name}
                    </Label>
                    <span className="text-xs text-zinc-500">
                      {source.percentage.toFixed(1)}%
                    </span>
                  </div>
                  <Input
                    id={`source-${index}`}
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={source.percentage}
                    onChange={(e) =>
                      handleSourceChange(
                        index,
                        "percentage",
                        parseFloat(e.target.value)
                      )
                    }
                    className="bg-zinc-900 border-zinc-800 text-white"
                  />
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6 flex gap-2 justify-end">
          <Button
            variant="outline"
            onClick={handleReset}
            className="border-zinc-800 text-zinc-400 hover:bg-zinc-900"
          >
            Reset
          </Button>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-zinc-800 text-zinc-400 hover:bg-zinc-900"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
