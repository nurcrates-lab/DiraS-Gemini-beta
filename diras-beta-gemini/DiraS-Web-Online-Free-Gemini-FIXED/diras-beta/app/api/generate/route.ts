import { NextResponse } from 'next/server';
import { workbookSchema } from '@/lib/schema';
import { systemPrompt } from '@/lib/prompts';
import { callGemini } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not configured.' }, { status: 500 });
    }

    const input = `Create a DiraS workbook.
Title: ${body.lessonTitle}
Level: ${body.learningLevel}
Objectives: ${(body.objectives || []).join(' | ')}
Materials: ${(body.materials || []).join(' | ')}
Method: ${body.learningMethod}
Duration: ${body.duration}
Difficulty: ${body.difficulty}
Activities: exactly ${body.activityCount}
Student context: ${body.studentContext || 'Not specified'}
Language: ${body.language}. If auto, infer from the majority of title/objectives/materials. Supported output languages: id, en, ar.

Important: Return exactly the requested number of main activities. For Arabic output, use clear Modern Standard Arabic, set metadata.language to ar and metadata.direction to rtl.`;

    const text = await callGemini({
      prompt: input,
      systemInstruction: systemPrompt,
      schema: workbookSchema,
    });

    return NextResponse.json(JSON.parse(text));
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Generation failed' }, { status: 500 });
  }
}
