import { buildPrompt, Message } from '@/utils/promptUtils';
import { Record } from 'pocketbase';

describe('buildPrompt', () => {
  const character = new Record({
    name: 'Test Character',
    backstory: 'A character for testing.',
    personalityTraits: { mood: 'happy' },
    voiceStyle: 'A test voice',
    isNsfw: false,
  });

  const memoryLogs: Record[] = [
    new Record({ type: 'episodic', content: 'User asked a question.' }),
  ];

  const history: Message[] = [
    { role: 'user', text: 'Hello' },
    { role: 'assistant', text: 'Hi there!' },
  ];

  it('should construct a complete prompt with all sections', () => {
    const newMessage = 'This is a test.';
    const prompt = buildPrompt(character, memoryLogs, history, newMessage);

    expect(prompt).toContain('You are Test Character.');
    expect(prompt).toContain('mood: happy');
    expect(prompt).toContain('A character for testing.');
    expect(prompt).toContain('A test voice');
    expect(prompt).toContain('NSFW: Not allowed');
    expect(prompt).toContain('MEMORY SUMMARY:');
    expect(prompt).toContain('- (episodic) User asked a question.');
    expect(prompt).toContain('RECENT CHAT:');
    expect(prompt).toContain('<|user|>Hello');
    expect(prompt).toContain('<|assistant|>Hi there!');
    expect(prompt).toContain('<|user|>This is a test.');
    expect(prompt).toContain('<|assistant|>');
  });

  it('should handle a linked persona', () => {
    const characterWithPersona = new Record({
        ...character,
        expand: {
            personaId: new Record({ name: 'Test Persona', description: 'A persona for testing.' })
        }
    });
    const newMessage = 'Testing persona.';
    const prompt = buildPrompt(characterWithPersona, [], [], newMessage);
    expect(prompt).toContain('Persona: Test Persona - A persona for testing.');
  });
});
