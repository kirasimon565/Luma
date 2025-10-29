import { HuggingFaceStream, StreamingTextResponse } from 'ai';
import { HfInference } from '@huggingface/inference';

export const runtime = 'edge';

const Hf = new HfInference(process.env.HF_API_TOKEN);

export async function POST(req: Request) {
  const { messages } = await req.json();

  const response = Hf.textGenerationStream({
    model: 'natalieparker/pygmalion-chat',
    inputs: messages.map((m: any) => m.content).join('\n'),
    parameters: {
      max_new_tokens: 250,
      // @ts-ignore
      typical_p: 0.95,
      repetition_penalty: 1.03,
      truncate: 1000,
      return_full_text: false,
    },
  });

  const stream = HuggingFaceStream(response);
  return new StreamingTextResponse(stream);
}
