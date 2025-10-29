'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.scss';
import pb from '@/lib/pocketbase';

export default function WorldViewPage() {
  const [characters, setCharacters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        // The 'expand' option will fetch the related persona data
        const records = await pb.collection('characters').getFullList({ expand: 'persona' });
        setCharacters(records);
      } catch (error) {
        console.error('Failed to fetch characters:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCharacters();
  }, []);

  if (loading) {
    return <p>Loading characters...</p>;
  }

  return (
    <div className={styles.worldView}>
      <header className={styles.header}>
        <h1>World View</h1>
      </header>
      <main className={styles.main}>
        <div className={styles.characterGrid}>
          {characters.map((character) => (
            <div key={character.id} className={styles.characterCard}>
              {/* PocketBase returns file URLs, which can be constructed for the src attribute */}
              {character.avatar && (
                <img
                  src={`${pb.baseUrl}/api/files/${character.collectionId}/${character.id}/${character.avatar}`}
                  alt={character.name}
                  className={styles.avatar}
                />
              )}
              <h2>{character.name}</h2>
              {/* Display persona name if available */}
              {character.expand?.persona && <p className={styles.personaName}>{character.expand.persona.name}</p>}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
