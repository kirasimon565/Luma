"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { pb } from "@/lib/pocketbase";
import { Record } from "pocketbase";
import Link from "next/link";
import { PlusCircle, Trash2 } from "lucide-react";

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
    return <div className="p-8 text-center">Loading personas...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-error">Error: {error}</div>;
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-dark-bg min-h-screen text-dark-text">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-display font-bold">Your Personas</h1>
          <Link
            href="/personas/new"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <PlusCircle size={20} />
            Create Persona
          </Link>
        </div>

        {personas.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-dark-text/20 rounded-lg">
            <p className="text-lg text-dark-text/70">You haven't created any personas yet.</p>
            <p className="text-dark-text/50">Personas are reusable templates for your characters.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {personas.map((persona) => (
              <div
                key={persona.id}
                className="bg-dark-bg/50 backdrop-blur-sm border border-dark-text/10 rounded-xl p-4 flex justify-between items-center shadow-lg"
              >
                <div>
                  <h2 className="text-xl font-bold font-display">{persona.name}</h2>
                  <p className="text-sm text-dark-text/60 line-clamp-2">{persona.description}</p>
                </div>
                <button
                  onClick={() => handleDelete(persona.id)}
                  className="text-error hover:text-error/80 transition-colors p-2"
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
