"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { pb } from "@/lib/pocketbase";
import Step1Basics from "./CharacterEditorSteps/Step1Basics";
import Step2Personality from "./CharacterEditorSteps/Step2Personality";
import Step3Backstory from "./CharacterEditorSteps/Step3Backstory";
import Step4Finalize from "./CharacterEditorSteps/Step4Finalize";

import { Record } from "pocketbase";

export type CharacterData = {
  name: string;
  avatarUrl: string;
  voiceStyle: string;
  isNsfw: boolean;
  personalityTraits: Record<string, any>;
  backstory: string;
  personaId?: string;
};

const CharacterEditor = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const [step, setStep] = useState(1);
  const [personas, setPersonas] = useState<Record[]>([]);
  const [characterData, setCharacterData] = useState<CharacterData>({
    name: "",
    avatarUrl: "",
    voiceStyle: "",
    isNsfw: false,
    personalityTraits: {},
    backstory: "",
    personaId: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPersonas = async () => {
      if (!user) return;
      try {
        const records = await pb.collection('personas').getFullList({
          filter: `creator = "${user.id}"`,
        });
        setPersonas(records);
      } catch (err) {
        console.error("Failed to fetch personas:", err);
      }
    };
    fetchPersonas();
  }, [user]);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const updateData = (data: Partial<CharacterData>) => {
    setCharacterData((prev) => ({ ...prev, ...data }));
  };

  const handleSubmit = async () => {
    if (!user) {
      setError("You must be logged in to create a character.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const dataToSave = {
        ...characterData,
        creator: user.id,
      };
      await pb.collection("characters").create(dataToSave);
      router.push("/characters");
    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
      <div className="bg-dark-bg/60 backdrop-blur-md border border-dark-text/10 rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-dark-text/10">
          <h1 className="text-2xl font-display font-bold text-dark-text">
            Create a New Character
          </h1>
          <p className="text-dark-text/60">Step {step} of 4</p>
        </div>

        <div className="p-6">
          {step === 1 && <Step1Basics data={characterData} updateData={updateData} personas={personas} />}
          {step === 2 && <Step2Personality data={characterData} updateData={updateData} />}
          {step === 3 && <Step3Backstory data={characterData} updateData={updateData} />}
          {step === 4 && <Step4Finalize data={characterData} />}
        </div>

        <div className="p-6 bg-dark-bg/50 border-t border-dark-text/10 flex justify-between items-center">
          <div>
            {step > 1 && (
              <button
                onClick={prevStep}
                className="px-4 py-2 bg-dark-text/10 text-dark-text rounded-lg hover:bg-dark-text/20 transition-colors"
              >
                Back
              </button>
            )}
          </div>
          <div>
            {error && <p className="text-sm text-error mb-2">{error}</p>}
            {step < 4 ? (
              <button
                onClick={nextStep}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-4 py-2 bg-success text-dark-bg rounded-lg hover:bg-success/90 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : "Create Character"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterEditor;
