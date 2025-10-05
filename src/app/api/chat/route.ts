import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


export async function POST(req: Request) {
  const { messages } = await req.json();
  
  try {
    const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: messages,
        stream: true,
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
        async start(controller) {
        for await (const chunk of response) {
            const content = chunk.choices?.[0]?.delta?.content;
            if (content) {
            controller.enqueue(encoder.encode(content));
            }
        }
        controller.close();
        },
    });

    return new Response(stream, {
        headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        },
    });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'An error occurred during your request.' }, { status: 500 });
    }
}