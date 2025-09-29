import { type NextRequest, NextResponse } from "next/server"
import { sendTelegramNotification } from "@/lib/telegram"

export async function POST(request: NextRequest) {
  try {
    const { step, timestamp, userAgent } = await request.json()

    const message =
      `✅ <b>Verification Step Completed</b>\n\n` +
      `📋 Step: <code>${step}</code>\n` +
      `⏰ Time: ${new Date(timestamp).toLocaleString()}\n` +
      `🌐 User Agent: ${userAgent}\n` +
      `📍 IP: ${request.ip || "Unknown"}\n\n` +
      `🔄 <b>Status:</b> User has completed ${step} verification step`

    await sendTelegramNotification(message)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Verification completion notification error:", error)
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 })
  }
}
