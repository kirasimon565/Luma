"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { pb } from "@/lib/pocketbase";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

const NewPersonaPage = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError("You must be logged in.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await pb.collection("personas").create({
        name,
        description,
        creator: user.id,
      });
      router.push("/personas");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-dark-bg min-h-screen text-dark-text">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link href="/personas" className="flex items-center gap-2 text-dark-text/70 hover:text-dark-text">
            <ChevronLeft size={20} />
            Back to Personas
          </Link>
        </div>
        <div className="bg-dark-bg/60 backdrop-blur-md border border-dark-text/10 rounded-2xl shadow-2xl p-6">
          <h1 className="text-2xl font-display font-bold mb-4">Create New Persona</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium">
                Persona Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-dark-bg/50 border border-dark-text/20 rounded-md shadow-sm focus:outline-none focus:ring-primary"
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full mt-1 h-32 px-3 py-2 bg-dark-bg/50 border border-dark-text/20 rounded-md shadow-sm focus:outline-none focus:ring-primary"
                required
              />
            </div>
            {error && <p className="text-error text-sm">{error}</p>}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-4 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Create Persona"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewPersonaPage;
