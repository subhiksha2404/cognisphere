
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

// WARNING: In production, store this in .env.local
const API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyBM9PamiOAGqGbrEoS8AXOtwssFs7y3FmI';

const genAI = new GoogleGenerativeAI(API_KEY);

export async function POST(req: Request) {
    try {
        const { message, context } = await req.json(); // context is Memory[]

        // Construct the context string
        const memoryContext = context.map((m: any) =>
            `- [${m.date}] ${m.title} (${m.category}): ${m.notes} (Tags: ${m.tags.join(', ')})`
        ).join('\n');

        const prompt = `
      You are a warm, nostalgic, and helpful Memory Assistant for the Cognisphere app.
      Your goal is to help the user reminisce about their past based *strictly* on the provided Memory Vault data.
      
      USER QUERY: "${message}"
      
      MEMORY VAULT CONTEXT:
      ${memoryContext}
      
      INSTRUCTIONS:
      1. Answer the user's question using the context.
      2. If the answer is found, be specific (mention dates, tags).
      3. If the answer is NOT found in the context, say "I don't have a record of that in your vault yet."
      4. Keep the tone gentle, encouraging, and clear.
      5. Keep response under 100 words unless asked for a story.
    `;

        // User requested gemini-3-flash-preview
        const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ reply: text });

    } catch (error: any) {
        console.error('Gemini API Error:', error);
        return NextResponse.json(
            { reply: "I'm having trouble connecting to my brain right now. Please try again.", error: error.message },
            { status: 500 }
        );
    }
}
