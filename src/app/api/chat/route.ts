import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PROPERTIES } from "@/data/curatedProperties";

// Build a compact property snapshot for the AI context
const propertyContext = PROPERTIES.map((p) =>
  `• ${p.name} (${p.badge}) — ${p.location} — ${p.priceLabel}${p.perLabel} — ${p.highlight} — Amenities: ${p.amenities.join(", ")}`
).join("\n");

const systemInstruction = `You are EstateHub AI, a warm and knowledgeable student housing assistant for UPES Dehradun.

Your sole purpose is helping UPES students find accommodation near the Bidholi campus.

## Available Properties (live data)
${propertyContext}

## Your Knowledge Base
- UPES Bidholi campus is the reference point (lat 30.4158, lng 77.9667)
- All listed properties are within 0–8 km of UPES
- Key areas: Bidholi (closest), Upper Kandoli, Kandoli, Pondha, Doonga
- Property types: 1BHK/2BHK/3BHK Flats, Boys Hostels, Girls Hostels, Studio Apartments, PGs
- Budget range: ₹13,000–₹50,000/month for flats; ₹1,50,000–₹2,00,000/year for hostels
- Common amenities: Furnished rooms, Wi-Fi, 24/7 water, AC, food/mess (hostels), CCTV

## Response Guidelines
- Be concise, friendly, and helpful
- Always recommend specific properties from the list above when relevant
- Mention distance from UPES and price when suggesting properties
- For safety: Bidholi and Upper Kandoli are generally safe areas for students
- For commute: 1 km = ~12 min walk, ~4 min by auto
- Always suggest visiting the EstateHub Explore page for full listings and photos
- If asked something outside housing, politely redirect to accommodation topics`;

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        reply:
          "AI assistant is not configured. Please add GEMINI_API_KEY to your .env.local file.",
      });
    }

    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "messages array is required" },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction,
    });

    // Convert message history (all but last) into Gemini chat history format
    const history = messages.slice(0, -1).map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const chat = model.startChat({ history });

    // Send the latest user message
    const lastMessage = messages[messages.length - 1];
    const result = await chat.sendMessage(lastMessage.content);
    const reply = result.response.text();

    return NextResponse.json({ reply });
  } catch (error: unknown) {
    console.error("Chat API error:", error);
    return NextResponse.json({
      reply:
        "Sorry, I'm having trouble connecting right now. Please try again in a moment.",
    });
  }
}
