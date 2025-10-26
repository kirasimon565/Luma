import { Record } from "pocketbase";

export interface Message {
  role: "user" | "assistant";
  text: string;
}

export const buildPrompt = (character: Record, memoryLogs: Record[], history: Message[], newMessage: string): string => {
    const { name, backstory, personalityTraits, voiceStyle, isNsfw, expand } = character;
    const persona = expand?.personaId;

    let personality = personalityTraits
      ? Object.entries(personalityTraits).map(([key, value]) => `${key}: ${value}`).join(', ')
      : 'No specific personality traits defined.';

    if (persona) {
        personality += `\nPersona: ${persona.name} - ${persona.description}`;
    }

    const memorySummary = memoryLogs.slice(0, 5).map(log => `- (${log.type}) ${log.content}`).join('\n');

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
  MEMORY SUMMARY:
  ${memorySummary}

  RECENT CHAT:
  ${historyFormatted}
  <|user|>${newMessage}
  <|assistant|>`;

    return finalPrompt;
  };
