import { NextResponse } from 'next/server';
import { callGemini } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not configured.' }, { status: 500 });
    }

    const text = await callGemini({
      systemInstruction:
        'You are revising one DiraS workbook section. Preserve the learning objective, cognitive demand, learning method, learner level, scope, and language. Do not change other sections. Return only the revised text content, with no commentary or markdown fences.',
      prompt: `Section type: ${body.sectionType}\nCurrent content: ${body.currentContent}\nWorkbook context: ${JSON.stringify(body.context)}\nInstruction: ${body.instruction}`,
    });

    return NextResponse.json({ text });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Regeneration failed' }, { status: 500 });
  }
}
