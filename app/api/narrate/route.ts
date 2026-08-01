import { NextRequest } from "next/server";

const MAX_NARRATION_CHARS = 12_000;

export async function POST(request: NextRequest) {
  if (process.env.FISH_AUDIO_ENABLED !== "true") return Response.json({ error: "Fish Audio is not enabled for this Fieldbook instance." }, { status: 503 });
  if (process.env.FISH_AUDIO_NON_COMMERCIAL_ONLY !== "true") return Response.json({ error: "Fish Audio requires the non-commercial evaluation gate for this build." }, { status: 403 });
  const apiKey = process.env.FISH_API_KEY;
  if (!apiKey) return Response.json({ error: "Fish Audio is not configured. Add FISH_API_KEY locally and restart Fieldbook." }, { status: 503 });

  const body = await request.json().catch(() => null) as { text?: unknown; referenceId?: unknown; confirmedNonCommercial?: unknown } | null;
  const text = typeof body?.text === "string" ? body.text.trim() : "";
  const referenceId = typeof body?.referenceId === "string" ? body.referenceId.trim() : "";
  if (body?.confirmedNonCommercial !== true) return Response.json({ error: "Confirm non-commercial evaluation use before requesting narration." }, { status: 400 });
  if (!text || text.length > MAX_NARRATION_CHARS) return Response.json({ error: `Narration must contain 1 to ${MAX_NARRATION_CHARS.toLocaleString()} characters.` }, { status: 400 });

  const upstream = await fetch("https://api.fish.audio/v1/tts", {
    method: "POST", headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json", model: "s2-pro" },
    body: JSON.stringify({ text, ...(referenceId ? { reference_id: referenceId } : {}), format: "mp3", sample_rate: 44100, mp3_bitrate: 128, normalize: true, latency: "normal" }),
  });
  if (!upstream.ok) {
    const detail = await upstream.text().catch(() => "");
    return Response.json({ error: "Fish Audio could not generate narration.", detail: detail.slice(0, 400) }, { status: upstream.status });
  }
  return new Response(upstream.body, { headers: { "Content-Type": upstream.headers.get("Content-Type") ?? "audio/mpeg", "Cache-Control": "no-store" } });
}
