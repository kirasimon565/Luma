'use client';

import { useChat } from 'ai/react';
import styles from './page.module.scss';

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat/stream',
  });

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messages}>
        {messages.map((m) => (
          <div key={m.id} className={`${styles.message} ${m.role === 'user' ? styles.user : styles.assistant}`}>
            <strong>{m.role === 'user' ? 'You: ' : 'AI: '}</strong>
            {m.content}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className={styles.chatForm}>
        <input
          className={styles.input}
          value={input}
          onChange={handleInputChange}
          placeholder="Say something..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
