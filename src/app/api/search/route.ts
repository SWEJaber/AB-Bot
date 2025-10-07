import { NextResponse } from "next/server";
import OpenAI from "openai";

type GoogleImageItem  = {
  kind: string;
  title: string;
  link: string;
  image: {
    contextLink: string;
    height: number;
    width: number;
    byteSize: number;
    thumbnailLink: string;
    thumbnailHeight: number;
    thumbnailWidth: number;
  };
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function googleSearch(query: string, type: "web" | "image") {
  const apiKey = process.env.GOOGLE_API_KEY!;
  const cx = process.env.GOOGLE_CX!;
  const params = new URLSearchParams({ q: query, key: apiKey, cx });
  if (type === "image") params.append("searchType", "image");

  const res = await fetch(`https://www.googleapis.com/customsearch/v1?${params}`);
  const data = await res.json();
  if (!data.items) return [];

  if (type === "image") {
    return data.items.map((item: GoogleImageItem) => ({
      title: item.title,
      imageUrl: item.link,
      context: item.image.contextLink,
    }));
  }

  return data.items.map((item: GoogleImageItem) => ({
    title: item.title,
    link: item.link,
    snippet: item.snippet,
  }));
}

export async function POST(req: Request) {
  const { message } = await req.json();


  try {
  // Perform both searches concurrently
  const [webResults, imageResults] = await Promise.all([
    googleSearch(message, "web"),
    googleSearch(message, "image"),
  ]);

  
  const image = imageResults?.[0]?.imageUrl ?? null;
  const context = imageResults?.[0]?.context ?? null;

  

  const sourcesText = webResults
    .map((r, i) => `[${i + 1}] ${r.title}\n${r.snippet}\n${r.link}`)
    .join("\n\n");

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    stream: true,
     messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant that summarizes Google search results and pairs them with a relevant image.",
      },
      {
        role: "user",
        content: `Question: ${message}\n\nSearch results:\n${sourcesText}`,
      },
    ],
  });

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      // 1️⃣ Send image metadata immediately
      controller.enqueue(
        encoder.encode(JSON.stringify({ type: "image", data: { image, context } }) + "\n")
      );

      // 2️⃣ Stream GPT output character by character
      for await (const chunk of response) {
        const token = chunk.choices?.[0]?.delta?.content;
        if (!token) continue;

        for (const char of token) {
          // send each character as a separate chunk
          controller.enqueue(encoder.encode(JSON.stringify({ type: "text", data: char }) + "\n"));
        }
      }

      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });

} catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'An error occurred during your request.' }, { status: 500 });
    }
}
