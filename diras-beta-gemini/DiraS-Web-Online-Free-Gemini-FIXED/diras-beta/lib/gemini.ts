
function stripUnsupportedSchemaFields(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(stripUnsupportedSchemaFields);
  }

  if (value && typeof value === 'object') {
    const source = value as Record<string, unknown>;
    const result: Record<string, unknown> = {};

    for (const [key, child] of Object.entries(source)) {
      // The legacy generateContent responseSchema endpoint uses Gemini's
      // protobuf Schema representation, which rejects this JSON Schema field.
      if (key === 'additionalProperties') continue;
      result[key] = stripUnsupportedSchemaFields(child);
    }

    return result;
  }

  return value;
}

export async function callGemini({
  prompt,
  systemInstruction,
  schema,
}: {
  prompt: string;
  systemInstruction?: string;
  schema?: unknown;
}) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY is not configured.');

  const model = process.env.GEMINI_WORKBOOK_MODEL || 'gemini-3.8-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;

  const generationConfig: Record<string, unknown> = {
    temperature: 0.4,
  };

  if (schema) {
    generationConfig.responseMimeType = 'application/json';
    generationConfig.responseSchema = stripUnsupportedSchemaFields(schema);
  }

  const payload: Record<string, unknown> = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig,
  };

  if (systemInstruction) {
    payload.systemInstruction = { parts: [{ text: systemInstruction }] };
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey,
    },
    body: JSON.stringify(payload),
    cache: 'no-store',
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.message || `Gemini API error (${response.status})`);
  }

  const text = data?.candidates?.[0]?.content?.parts
    ?.map((part: { text?: string }) => part.text || '')
    .join('')
    .trim();

  if (!text) {
    throw new Error('Gemini returned an empty response.');
  }

  return text;
}
