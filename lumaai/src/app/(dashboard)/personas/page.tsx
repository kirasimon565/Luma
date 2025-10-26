"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { pb } from "@/lib/pocketbase";
import { Record } from "pocketbase";
import Link from "next/link";
import { PlusCircle, Trash2 } from "lucide-react";
import styles from './PersonasPage.module.scss';

const PersonasPage = () => {
  const { user } = useAuthStore();
  const [personas, setPersonas] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPersonas = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const records = await pb.collection('personas').getFullList({
        filter: `creator = "${user.id}"`,
        sort: '-created',
      });
      setPersonas(records);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPersonas();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this persona?")) {
      try {
        await pb.collection('personas').delete(id);
        fetchPersonas(); // Refresh the list
      } catch (err: any) {
        alert(`Failed to delete persona: ${err.message}`);
      }
    }
  };

  if (loading) {
    return <div className={styles.page}><p>Loading personas...</p></div>;
  }

  if (error) {
    return <div className={styles.page}><p className={styles.error}>Error: {error}</p></div>;
  }

  return (
    <div className={styles.page}>
      <div className="max-w-7xl mx-auto">
        <div className={styles.header}>
          <h1 className={styles.title}>Your Personas</h1>
          <Link href="/personas/new" className={styles.createButton}>
            <PlusCircle size={20} />
            Create Persona
          </Link>
        </div>

        {personas.length === 0 ? (
          <div className={styles.emptyState}>
            <p>You haven't created any personas yet.</p>
            <p>Personas are reusable templates for your characters.</p>
          </div>
        ) : (
          <div className={styles.personaList}>
            {personas.map((persona) => (
              <div key={persona.id} className={styles.personaCard}>
                <div>
                  <h2 className={styles.name}>{persona.name}</h2>
                  <p className={styles.description}>{persona.description}</p>
                </div>
                <button
                  onClick={() => handleDelete(persona.id)}
                  className={styles.deleteButton}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonasPage;
