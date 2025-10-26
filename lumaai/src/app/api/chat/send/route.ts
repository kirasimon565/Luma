import { NextRequest, NextResponse } from "next/server";
import { pb } from "@/lib/pocketbase";

const HF_API_URL = "https://api-inference.huggingface.co/models/natalieparker/pygmalion-chat";
const HF_API_TOKEN = process.env.HF_API_TOKEN;

interface Message {
  role: "user" | "assistant";
  text: string;
}

const buildPrompt = (character: any, history: Message[], newMessage: string): string => {
    const { name, backstory, personalityTraits, voiceStyle, isNsfw } = character;

    const personality = personalityTraits
      ? Object.entries(personalityTraits).map(([key, value]) => `${key}: ${value}`).join(', ')
      : 'No specific personality traits defined.';

    const systemPrompt = `<|system|>You are ${name}.
  Personality: ${personality}.
  Backstory: ${backstory.substring(0, 1000)}
  Voice Style: ${voiceStyle}
  NSFW: ${isNsfw ? 'Allowed' : 'Not allowed'} - You must obey platform NSFW policies.
  `;

    const historyFormatted = history
      .slice(-10)
      .map(msg => `${msg.role === 'user' ? '<|user|>' : '<|assistant|>'}${msg.text}`)
      .join('');

    const finalPrompt = `${systemPrompt}
  ${historyFormatted}
  <|user|>${newMessage}
  <|assistant|>`;

    return finalPrompt;
  };

export async function POST(req: NextRequest) {
  if (!HF_API_TOKEN) {
    return NextResponse.json({ error: "Hugging Face API token is not configured" }, { status: 500 });
  }

  try {
    const { characterId, messages, newMessage } = await req.json();

    if (!characterId || !messages || !newMessage) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const character = await pb.collection('characters').getOne(characterId);
    const prompt = buildPrompt(character, messages, newMessage.text);

    const response = await fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 150,
          return_full_text: false,
          temperature: 0.8,
          repetition_penalty: 1.1,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Hugging Face API Error:", errorText);
      return NextResponse.json({ error: `Hugging Face API error: ${errorText}` }, { status: response.status });
    }

    const data = await response.json();
    let aiResponseText = data[0]?.generated_text || "Sorry, I couldn't generate a response.";

    aiResponseText = aiResponseText.replace(prompt, "").trim();
    const stopSequences = ["<|user|>", "<|system|>", "User:"];
    for (const seq of stopSequences) {
        if (aiResponseText.includes(seq)) {
            aiResponseText = aiResponseText.split(seq)[0].trim();
        }
    }

    // 5. Basic Memory System Logic
    // If the user's message was a question, create a memory log.
    if (newMessage.text.includes("?")) {
      const memoryContent = `User asked: "${newMessage.text}" and I responded: "${aiResponseText}"`;
      try {
        await pb.collection('memory_logs').create({
          character: characterId,
          type: 'episodic',
          content: memoryContent,
          timestamp: new Date().toISOString(),
        });
        console.log("Created a new memory log.");
      } catch (memError) {
        console.error("Failed to create memory log:", memError);
        // Don't block the chat response if memory creation fails
      }
    }

    return NextResponse.json({ reply: aiResponseText });

  } catch (error: any) {
    console.error("Error in chat API:", error);
    return NextResponse.json({ error: error.message || "An internal server error occurred" }, { status: 500 });
  }
}
