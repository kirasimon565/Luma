"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { pb } from "@/lib/pocketbase";
import { Record } from "pocketbase";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

const CharactersPage = () => {
  const { user } = useAuthStore();
  const [characters, setCharacters] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCharacters = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const records = await pb.collection('characters').getFullList({
          filter: `creator = "${user.id}"`,
          sort: '-created',
        });
        setCharacters(records);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-dark-bg text-dark-text">
        <p>Loading characters...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-dark-bg text-error">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-dark-bg min-h-screen text-dark-text">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-display font-bold">Your Characters</h1>
          <Link
            href="/characters/new"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <PlusCircle size={20} />
            Create Character
          </Link>
        </div>

        {characters.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-dark-text/20 rounded-lg">
            <p className="text-lg text-dark-text/70">You haven't created any characters yet.</p>
            <p className="text-dark-text/50">Click "Create Character" to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {characters.map((char) => (
              <Link href={`/characters/${char.id}`} key={char.id}>
                <div className="bg-dark-bg/50 backdrop-blur-sm border border-dark-text/10 rounded-xl overflow-hidden shadow-lg hover:shadow-primary/30 hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-1">
                  <div className="w-full h-48 bg-secondary flex items-center justify-center">
                    {/* Placeholder for avatar */}
                    <span className="text-5xl font-bold text-dark-bg">{char.name.charAt(0)}</span>
                  </div>
                  <div className="p-4">
                    <h2 className="text-xl font-bold font-display">{char.name}</h2>
                    <p className="text-sm text-dark-text/60 line-clamp-2">{char.backstory}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CharactersPage;
