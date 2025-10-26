"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { pb } from "@/lib/pocketbase";
import { Record } from "pocketbase";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import styles from './CharactersPage.module.scss';

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
    return <div className={styles.page}><p>Loading characters...</p></div>;
  }

  if (error) {
    return <div className={styles.page}><p className={styles.error}>Error: {error}</p></div>;
  }

  return (
    <div className={styles.page}>
      <div className="max-w-7xl mx-auto">
        <div className={styles.header}>
          <h1 className={styles.title}>Your Characters</h1>
          <Link href="/characters/new" className={styles.createButton}>
            <PlusCircle size={20} />
            Create Character
          </Link>
        </div>

        {characters.length === 0 ? (
          <div className={styles.emptyState}>
            <p>You haven't created any characters yet.</p>
            <p>Click "Create Character" to get started!</p>
          </div>
        ) : (
          <div className={styles.characterGrid}>
            {characters.map((char, index) => (
              <Link href={`/characters/${char.id}`} key={char.id}>
                <div className={styles.characterCard} style={{ animationDelay: `${index * 100}ms` }}>
                  <div className={styles.avatar}>
                    <div
                      className={styles.image}
                      style={{ backgroundImage: `url(${char.avatarUrl})` }}
                    >
                      {!char.avatarUrl && <span className={styles.placeholder}>{char.name.charAt(0)}</span>}
                    </div>
                  </div>
                  <div className={styles.cardContent}>
                    <h2 className={styles.name}>{char.name}</h2>
                    <p className={styles.backstory}>{char.backstory}</p>
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
