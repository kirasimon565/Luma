"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { pb } from "@/lib/pocketbase";
import { useAuthStore } from "@/stores/authStore";
import { Record } from "pocketbase";
import Link from "next/link";
import { ChevronLeft, Send } from "lucide-react";

// Define the structure of a message
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
  }, [messages]);

  useEffect(() => {
    const setupChat = async () => {
      if (!id || !user) return;

      try {
        setLoading(true);
        // 1. Fetch character data
        const charRecord = await pb.collection('characters').getOne(id as string);
        setCharacter(charRecord);

        // 2. Find or create a chat session
        const filter = `user = "${user.id}" && character = "${id}"`;
        let session;
        try {
          session = await pb.collection('chat_sessions').getFirstListItem(filter);
        } catch (e: any) {
          if (e.status === 404) {
            // No session found, create one
            const newSessionData = {
              user: user.id,
              character: id,
              messages: [],
              lastInteraction: new Date().toISOString(),
            };
            session = await pb.collection('chat_sessions').create(newSessionData);
          } else {
            throw e; // Re-throw other errors
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
      // Call our new API route
      const response = await fetch('/api/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          characterId: character.id,
          messages: messages, // Send history
          newMessage: userMessage, // Send new message object
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get a response from the AI.");
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: `msg_${Date.now()}_assistant`,
        role: "assistant",
        text: data.reply,
        timestamp: new Date().toISOString(),
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);

      // Update the chat session in PocketBase
      await pb.collection('chat_sessions').update(chatSession.id, {
        messages: finalMessages,
        lastInteraction: new Date().toISOString(),
      });

    } catch (err: any) {
      console.error("Error sending message:", err);
      // If the API call fails, revert the user's message for them to try again
      setMessages(messages);
      setNewMessage(currentInput);
    } finally {
      setIsTyping(false);
    }
  };


  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-dark-bg text-dark-text">Initializing chat...</div>;
  }

  if (error || !character) {
    return <div className="flex items-center justify-center h-screen bg-dark-bg text-error">Error: {error || "Character not found"}</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-dark-bg text-dark-text font-body">
      {/* Header */}
      <header className="flex items-center p-4 bg-dark-bg/80 backdrop-blur-md border-b border-dark-text/10 shadow-sm sticky top-0 z-10">
        <Link href={`/characters/${id}`} className="mr-4 p-2 rounded-full hover:bg-dark-text/10">
          <ChevronLeft size={24} />
        </Link>
        <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center font-bold text-dark-bg text-xl mr-4">
          {character.name.charAt(0)}
        </div>
        <div>
          <h1 className="font-bold text-lg">{character.name}</h1>
          <p className="text-xs text-dark-text/60">In conversation</p>
        </div>
      </header>

      {/* Message List */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
                <div className="w-8 h-8 bg-secondary rounded-full flex-shrink-0 flex items-center justify-center font-bold text-dark-bg">
                    {character.name.charAt(0)}
                </div>
            )}
            <div
              className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${
                msg.role === 'user'
                  ? 'bg-primary text-white rounded-br-lg'
                  : 'bg-dark-text/10 text-dark-text rounded-bl-lg'
              }`}
            >
              <p className="text-sm">{msg.text}</p>
            </div>
          </div>
        ))}
        {isTyping && (
            <div className="flex items-end gap-2 justify-start">
                <div className="w-8 h-8 bg-secondary rounded-full flex-shrink-0 flex items-center justify-center font-bold text-dark-bg">
                    {character.name.charAt(0)}
                </div>
                <div className="max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl bg-dark-text/10 text-dark-text rounded-bl-lg">
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

      {/* Disclaimer */}
      <div className="px-4 py-2 text-center text-xs text-dark-text/40 font-mono">
        <p>Everything the characters say is fictional and generated by AI.</p>
      </div>

      {/* Composer */}
      <footer className="p-4 bg-dark-bg/80 backdrop-blur-md border-t border-dark-text/10 sticky bottom-0">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={`Message ${character.name}...`}
            className="flex-1 px-4 py-2 bg-dark-text/5 border border-dark-text/10 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            className="p-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50"
            disabled={!newMessage.trim()}
          >
            <Send size={20} />
          </button>
        </form>
      </footer>
    </div>
  );
};

export default ChatWindow;
