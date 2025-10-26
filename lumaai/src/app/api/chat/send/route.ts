import { NextRequest, NextResponse } from "next/server";
import { pb } from "@/lib/pocketbase";
import { buildPrompt, Message } from "@/utils/promptUtils";

const HF_API_URL = "https://api-inference.huggingface.co/models/natalieparker/pygmalion-chat";
const HF_API_TOKEN = process.env.HF_API_TOKEN;

export async function POST(req: NextRequest) {
  if (!HF_API_TOKEN) {
    return NextResponse.json({ error: "Hugging Face API token is not configured" }, { status: 500 });
  }

  try {
    const { characterId, messages, newMessage } = await req.json();

    if (!characterId || !messages || !newMessage) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const [character, memoryLogs] = await Promise.all([
        pb.collection('characters').getOne(characterId, { expand: 'personaId' }),
        pb.collection('memory_logs').getFullList({ filter: `character = "${characterId}"`, sort: '-timestamp' })
    ]);

    const prompt = buildPrompt(character, memoryLogs, messages, newMessage.text);

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

    // 5. Improved Memory System Logic
    let memoryToCreate: { type: string; content: string } | null = null;
    const userText = newMessage.text.toLowerCase();
    const aiText = aiResponseText.toLowerCase();

    // Episodic memory for questions
    if (userText.includes("?")) {
      memoryToCreate = {
        type: 'episodic',
        content: `User asked: "${newMessage.text}" and I responded: "${aiResponseText}"`,
      };
    }
    // Semantic memory for statements of fact
    else if (userText.startsWith("my name is") || userText.startsWith("i am") || userText.startsWith("i like")) {
      memoryToCreate = {
        type: 'semantic',
        content: `User stated a fact: "${newMessage.text}"`,
      };
    }
    // Emotional memory for strong sentiment
    const emotionalWords = ["love", "hate", "happy", "sad", "angry", "excited"];
    if (emotionalWords.some(word => aiText.includes(word))) {
        memoryToCreate = {
            type: 'emotional',
            content: `In response to "${newMessage.text}", I felt: "${aiResponseText}"`,
        };
    }

    if (memoryToCreate) {
      try {
        await pb.collection('memory_logs').create({
          character: characterId,
          type: memoryToCreate.type,
          content: memoryToCreate.content,
          timestamp: new Date().toISOString(),
        });
        console.log(`Created a new ${memoryToCreate.type} memory log.`);
      } catch (memError) {
        console.error("Failed to create memory log:", memError);
      }
    }

    return NextResponse.json({ reply: aiResponseText });

  } catch (error: any) {
    console.error("Error in chat API:", error);
    return NextResponse.json({ error: error.message || "An internal server error occurred" }, { status: 500 });
  }
}
