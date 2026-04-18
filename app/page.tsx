"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

const VALID_KEYS = [
  "INSIGHT2025",
  "REELMASTER",
  "EDITPRO99",
]

export default function LoginPage() {
  const [key, setKey] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    setTimeout(() => {
      if (VALID_KEYS.includes(key.trim().toUpperCase())) {
        localStorage.setItem("access-granted", "true")
        router.push("/editor")
      } else {
        setError("Invalid key. Please try again.")
        setLoading(false)
      }
    }, 500)
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ backgroundColor: "#0c0f14" }}
    >
      <div className="w-full max-w-[340px]">
        {/* Logo / Title */}
        <div className="text-center mb-8">
          <h1 className="text-[24px] font-bold text-white mb-2">Insight Editor</h1>
          <p className="text-[13px] text-gray-400">Enter your access key to continue</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              value={key}
              onChange={(e) => { setKey(e.target.value); setError("") }}
              placeholder="Enter access key"
              className="w-full px-4 py-3 rounded-xl text-[14px] text-white outline-none border transition-colors"
              style={{
                backgroundColor: "#1a1d23",
                borderColor: error ? "#ef4444" : "#2a2d33",
                caretColor: "#d939cf",
              }}
              onFocus={(e) => { if (!error) e.target.style.borderColor = "#d939cf" }}
              onBlur={(e) => { if (!error) e.target.style.borderColor = "#2a2d33" }}
              autoFocus
            />
            {error && (
              <p className="text-[12px] text-red-400 mt-2 ml-1">{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={!key.trim() || loading}
            className="w-full py-3 rounded-xl text-[14px] font-semibold transition-all duration-200 active:scale-[0.98]"
            style={{
              backgroundColor: key.trim() ? "#d939cf" : "#2a2d33",
              color: key.trim() ? "white" : "#666",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Verifying..." : "Access Editor"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-[11px] text-gray-600 text-center mt-6">
          Contact admin for access key
        </p>
      </div>
    </div>
  )
}
