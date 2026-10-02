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

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured.');
  }

  const configuredModel = process.env.GEMINI_WORKBOOK_MODEL;

  const models = [
    configuredModel,
    'gemini-3.8-flash',
    'gemini-3.7-flash',
    'gemini-3.6-flash',
    'gemini-3.5-flash',
  ].filter((model, index, array): model is string =>
    Boolean(model) && array.indexOf(model) === index
  );

  let lastError = '';

  for (const model of models) {
    const url =
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;

    const generationConfig: Record<string, unknown> = {
      temperature: 0.4,
    };

    if (schema) {
      generationConfig.responseMimeType = 'application/json';
    }

    const payload: Record<string, unknown> = {
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
      generationConfig,
    };

    if (systemInstruction) {
      payload.systemInstruction = {
        parts: [{ text: systemInstruction }],
      };
    }

    try {
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
        const message =
          data?.error?.message ||
          `Gemini API error (${response.status})`;

        lastError = `${model}: ${message}`;

        const retryable =
          response.status === 429 ||
          response.status === 503 ||
          /high demand|overloaded|resource exhausted|temporarily unavailable/i.test(
            message
          );

        if (retryable) {
          continue;
        }

        throw new Error(message);
      }

      const text = data?.candidates?.[0]?.content?.parts
        ?.map((part: { text?: string }) => part.text || '')
        .join('')
        .trim();

      if (!text) {
        lastError = `${model}: empty response`;
        continue;
      }

      return text;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : String(error);

      lastError = `${model}: ${message}`;

      const retryable =
        /high demand|overloaded|resource exhausted|temporarily unavailable|503|429/i.test(
          message
        );

      if (retryable) {
        continue;
      }

      throw error;
    }
  }

  throw new Error(
    `All Gemini models are currently unavailable. Last error: ${lastError}`
  );
}
