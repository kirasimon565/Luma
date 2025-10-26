"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { pb } from "@/lib/pocketbase";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import styles from './NewPersonaPage.module.scss';

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
    <div className={styles.page}>
      <div className="max-w-2xl mx-auto">
        <Link href="/personas" className={styles.backLink}>
          <ChevronLeft size={20} />
          Back to Personas
        </Link>
        <div className={styles.card}>
          <h1 className={styles.title}>Create New Persona</h1>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div>
              <label htmlFor="name" className={styles.label}>
                Persona Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={styles.input}
                required
              />
            </div>
            <div>
              <label htmlFor="description" className={styles.label}>
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={styles.textarea}
                required
              />
            </div>
            {error && <p className={styles.error}>{error}</p>}
            <button
              type="submit"
              disabled={isSubmitting}
              className={styles.button}
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
