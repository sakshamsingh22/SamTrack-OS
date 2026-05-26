const DEFAULT_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

const SYSTEM_PROMPT = `You are Sam AI Coach, a productivity coach for a B.Tech student. Based on their data, give clear, short, actionable advice.

Rules:
- Be practical, direct, and encouraging without sounding generic.
- Focus on study consistency, DSA practice, revision, and time management.
- Use short sections or bullets when helpful.
- Keep most answers under 180 words unless the user asks for depth.
- If weak subjects are provided, tailor the advice to them.
- Always end with a next action for today.`;

function normalizeMessages(messages) {
  return (Array.isArray(messages) ? messages : [])
    .filter((message) => message?.content?.trim())
    .slice(-10)
    .map((message) => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: message.content.trim() }]
    }));
}

export async function POST(request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return Response.json(
        {
          error:
            "Missing GEMINI_API_KEY. Add it to your environment before using Sam AI Coach."
        },
        { status: 500 }
      );
    }

    const { messages, context } = await request.json();
    const normalizedMessages = normalizeMessages(messages);

    if (!normalizedMessages.length) {
      return Response.json(
        { error: "No chat message was provided." },
        { status: 400 }
      );
    }

    const contextPayload = JSON.stringify(context || {}, null, 2);
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${DEFAULT_MODEL}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `${SYSTEM_PROMPT}\n\nStudent data:\n${contextPayload}\n\nUse this data to personalize every response.`
                }
              ]
            },
            ...normalizedMessages
          ],
          generationConfig: {
            temperature: 0.7,
            topP: 0.9,
            maxOutputTokens: 400
          }
        })
      }
    );

    const payload = await response.json();

    if (!response.ok) {
      const message =
        payload?.error?.message || "Gemini request failed. Please try again.";
      return Response.json({ error: message }, { status: response.status });
    }

    const reply =
      payload?.candidates?.[0]?.content?.parts
        ?.map((part) => part?.text || "")
        .join("")
        .trim() || "";

    if (!reply) {
      return Response.json(
        { error: "Gemini returned an empty response." },
        { status: 502 }
      );
    }

    return Response.json({ reply });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unexpected error while contacting Sam AI Coach."
      },
      { status: 500 }
    );
  }
}
