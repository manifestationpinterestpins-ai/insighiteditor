export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const reelUrl = searchParams.get("url")

  if (!reelUrl) {
    return Response.json({ error: "No URL" }, { status: 400 })
  }

  try {
    const res = await fetch(reelUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
      }
    })

    const html = await res.text()

    const match = html.match(
      /<meta property="og:image" content="([^"]+)"/
    )

    const thumbnail = match ? match[1] : null

    return Response.json({ thumbnail })
  } catch (err) {
    return Response.json({ error: "Failed to fetch" }, { status: 500 })
  }
}
