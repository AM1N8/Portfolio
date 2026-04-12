// app/api/weather/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const res = await fetch('https://wttr.in/Meknes?0&m&q&lang=en', {
      headers: {
        'Accept': 'text/plain',
        'User-Agent': 'curl/7.68.0'
      },
      next: { revalidate: 1800 } // cache 30 minutes
    })

    if (!res.ok) throw new Error('wttr.in unreachable')

    const text = await res.text()

    return new NextResponse(text, {
      headers: { 'Content-Type': 'text/plain' }
    })
  } catch {
    return new NextResponse('curl: (6) Could not resolve host: wttr.in', {
      status: 502,
      headers: { 'Content-Type': 'text/plain' }
    })
  }
}
