'use client';

'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.scss';
import pb from '@/lib/pocketbase';
// import { Persona } from '@/types'; // Types can be added later

export default function PersonaManagementPage() {
  const [personas, setPersonas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPersonas = async () => {
      try {
        const records = await pb.collection('personas').getFullList();
        setPersonas(records);
      } catch (error) {
        console.error('Failed to fetch personas:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPersonas();
  }, []);

  if (loading) {
    return <p>Loading personas...</p>;
  }

  return (
    <div className={styles.personaPage}>
      <header className={styles.header}>
        <h1>Persona Management</h1>
        <button className={styles.addButton}>+ Create New Persona</button>
      </header>
      <main className={styles.main}>
        <div className={styles.personaList}>
          {personas.map((persona) => (
            <div key={persona.id} className={styles.personaCard}>
              <h2>{persona.name}</h2>
              <p>{persona.description}</p>
              <div className={styles.cardActions}>
                <button>Edit</button>
                <button className={styles.deleteButton}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
