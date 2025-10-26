"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { pb } from "@/lib/pocketbase";
import { useAuthStore } from "@/stores/authStore";
import { Record } from "pocketbase";
import Link from "next/link";
import { ChevronLeft, Send } from "lucide-react";
import styles from './ChatWindow.module.scss';

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: string;
}

const ChatWindow = () => {
  const { id } = useParams();
  const { user } = useAuthStore();
  const [character, setCharacter] = useState<Record | null>(null);
  const [chatSession, setChatSession] = useState<Record | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    const setupChat = async () => {
      if (!id || !user) return;
      setLoading(true);
      try {
        const charRecord = await pb.collection('characters').getOne(id as string);
        setCharacter(charRecord);
        const filter = `user = "${user.id}" && character = "${id}"`;
        let session;
        try {
          session = await pb.collection('chat_sessions').getFirstListItem(filter);
        } catch (e: any) {
          if (e.status === 404) {
            session = await pb.collection('chat_sessions').create({
              user: user.id,
              character: id,
              messages: [],
              lastInteraction: new Date().toISOString(),
            });
          } else {
            throw e;
          }
        }
        setChatSession(session);
        setMessages(session.messages || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    setupChat();
  }, [id, user]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !chatSession || !character) return;

    const userMessage: Message = {
      id: `msg_${Date.now()}_user`,
      role: "user",
      text: newMessage,
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    const currentInput = newMessage;
    setNewMessage("");
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          characterId: character.id,
          messages: messages,
          newMessage: userMessage,
        }),
      });

      if (!response.ok) throw new Error("Failed to get a response from the AI.");

      const data = await response.json();
      const assistantMessage: Message = {
        id: `msg_${Date.now()}_assistant`,
        role: "assistant",
        text: data.reply,
        timestamp: new Date().toISOString(),
      };
      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);
      await pb.collection('chat_sessions').update(chatSession.id, {
        messages: finalMessages,
        lastInteraction: new Date().toISOString(),
      });
    } catch (err: any) {
      console.error("Error sending message:", err);
      setMessages(messages);
      setNewMessage(currentInput);
    } finally {
      setIsTyping(false);
    }
  };

  if (loading) return <div className={styles.chatWindow}><p>Initializing chat...</p></div>;
  if (error || !character) return <div className={styles.chatWindow}><p>Error: {error || "Character not found"}</p></div>;

  return (
    <div className={styles.chatWindow}>
      <header className={styles.header}>
        <Link href={`/characters/${id}`} className={styles.backLink}>
          <ChevronLeft size={24} />
        </Link>
        <div className={styles.avatar}>{character.name.charAt(0)}</div>
        <div>
          <h1 className={styles.name}>{character.name}</h1>
          <p className={styles.status}>In conversation</p>
        </div>
      </header>

      <main className={styles.messageList}>
        {messages.map((msg) => (
          <div key={msg.id} className={`${styles.message} ${msg.role === 'user' ? styles.user : styles.assistant}`}>
            {msg.role === 'assistant' && <div className={styles.avatar}>{character.name.charAt(0)}</div>}
            <div className={`${styles.bubble} ${msg.role === 'user' ? styles.user : styles.assistant}`}>
              <p>{msg.text}</p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className={`${styles.message} ${styles.assistant}`}>
            <div className={styles.avatar}>{character.name.charAt(0)}</div>
            <div className={`${styles.bubble} ${styles.assistant}`}>
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 bg-primary rounded-full animate-bounce delay-75"></span>
                <span className="h-2 w-2 bg-primary rounded-full animate-bounce delay-150"></span>
                <span className="h-2 w-2 bg-primary rounded-full animate-bounce delay-300"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      <div className={styles.disclaimer}>
        <p>Everything the characters say is fictional and generated by AI.</p>
      </div>

      <footer className={styles.composer}>
        <form onSubmit={handleSendMessage}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={`Message ${character.name}...`}
          />
          <button type="submit" disabled={!newMessage.trim()}>
            <Send size={20} />
          </button>
        </form>
      </footer>
    </div>
  );
};

export default ChatWindow;
