"use client";

import { useEffect, useState } from "react";
import { pb } from "@/lib/pocketbase";
import { Record } from "pocketbase";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Edit } from "lucide-react";
import NsfwConsentModal from "@/components/NSFW/NsfwConsentModal";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";


const CharacterDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const [character, setCharacter] = useState<Record | null>(null);
  const [memoryLogs, setMemoryLogs] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNsfwModal, setShowNsfwModal] = useState(false);

  const handleChatClick = () => {
    if (character?.isNsfw) {
      setShowNsfwModal(true);
    } else {
      router.push(`/chat/${id}`);
    }
  };

  const handleNsfwConfirm = async () => {
    setShowNsfwModal(false);
    if(user && character) {
        try {
            await fetch('/api/nsfw/consent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    characterId: character.id,
                    action: 'chat',
                })
            });
        } catch (e) {
            console.error("Failed to log NSFW consent", e);
        }
    }
    router.push(`/chat/${id}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        // Fetch character and memories in parallel
        const [charRecord, memRecords] = await Promise.all([
          pb.collection('characters').getOne(id as string),
          pb.collection('memory_logs').getFullList({
            filter: `character = "${id}"`,
            sort: '-timestamp',
          })
        ]);
        setCharacter(charRecord);
        setMemoryLogs(memRecords);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-dark-bg text-dark-text">Loading character...</div>;
  }

  if (error || !character) {
    return <div className="flex items-center justify-center h-screen bg-dark-bg text-error">Error: {error || "Character not found"}</div>;
  }

  return (
    <>
      {showNsfwModal && (
        <NsfwConsentModal
          onConfirm={handleNsfwConfirm}
          onCancel={() => setShowNsfwModal(false)}
        />
      )}
      <div className="bg-dark-bg min-h-screen text-dark-text">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Link
              href="/characters"
              className="flex items-center gap-2 text-dark-text/70 hover:text-dark-text transition-colors"
            >
              <ChevronLeft size={20} />
              Back to Characters
            </Link>
          </div>

          <div className="max-w-4xl mx-auto bg-dark-bg/60 backdrop-blur-md border border-dark-text/10 rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-start gap-8">
                <div className="w-full md:w-1/3 flex-shrink-0">
                  <div className="w-full aspect-square bg-secondary rounded-xl flex items-center justify-center">
                    <span className="text-8xl font-bold text-dark-bg">{character.name.charAt(0)}</span>
                  </div>
                </div>
                <div className="w-full md:w-2/3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h1 className="text-4xl font-display font-bold">{character.name}</h1>
                      <p className="text-dark-text/70 mt-1">{character.voiceStyle}</p>
                      {character.isNsfw && (
                        <span className="mt-2 inline-block px-2 py-1 text-xs font-semibold bg-warning text-dark-bg rounded-full">
                          NSFW
                        </span>
                      )}
                    </div>
                    <Link href={`/characters/${character.id}/edit`} className="text-dark-text/70 hover:text-primary transition-colors">
                      <Edit size={20} />
                    </Link>
                  </div>

                  <div className="mt-8">
                    <h2 className="text-xl font-semibold text-secondary mb-3">Personality</h2>
                    <div className="flex flex-wrap gap-2">
                      {character.personalityTraits && Object.entries(character.personalityTraits).map(([key, value]) => (
                        <div key={key} className="bg-dark-bg/50 px-3 py-1 rounded-full text-sm">
                          <span className="font-semibold">{key}:</span> {String(value)}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8">
                    <h2 className="text-xl font-semibold text-secondary mb-3">Backstory</h2>
                    <div className="prose prose-invert max-w-none text-dark-text/80 bg-dark-bg/50 p-4 rounded-md max-h-60 overflow-y-auto">
                      <p>{character.backstory}</p>
                    </div>
                  </div>

                  <div className="mt-8">
                    <button
                      onClick={handleChatClick}
                      className="w-full px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Chat with {character.name}
                    </button>
                  </div>

                  <div className="mt-8">
                    <h2 className="text-xl font-semibold text-secondary mb-3">Memory Logs</h2>
                    <div className="space-y-3 max-h-48 overflow-y-auto bg-dark-bg/50 p-3 rounded-md">
                      {memoryLogs.length > 0 ? (
                        memoryLogs.map(log => (
                          <div key={log.id} className="text-sm p-2 bg-dark-bg/40 rounded">
                            <span className="font-semibold capitalize text-primary">{log.type}: </span>
                            <span className="text-dark-text/80">{log.content}</span>
                            <div className="text-xs text-dark-text/50 mt-1">
                              {new Date(log.timestamp).toLocaleString()}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-dark-text/60">No memories logged yet.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CharacterDetailPage;
