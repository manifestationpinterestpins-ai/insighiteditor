export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const reelUrl = searchParams.get("url")

  if (!reelUrl) {
    return Response.json({ error: "No URL" }, { status: 400 })
  }

  try {
    const res = await fetch(
      `https://noembed.com/embed?url=${encodeURIComponent(reelUrl)}`
    )

    const data = await res.json()

    return Response.json({
      thumbnail: data.thumbnail_url || null
    })
  } catch (err) {
    return Response.json({ error: "Failed" }, { status: 500 })
  }
}
