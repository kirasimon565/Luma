"use client";

import { useState } from "react";
import { CharacterData } from "../CharacterEditor";
import { Trash2 } from "lucide-react";

interface Step2PersonalityProps {
  data: CharacterData;
  updateData: (data: Partial<CharacterData>) => void;
}

const Step2Personality: React.FC<Step2PersonalityProps> = ({ data, updateData }) => {
  const [newTraitKey, setNewTraitKey] = useState("");
  const [newTraitValue, setNewTraitValue] = useState("");

  const handleAddTrait = () => {
    if (newTraitKey && newTraitValue) {
      const newTraits = {
        ...data.personalityTraits,
        [newTraitKey]: newTraitValue,
      };
      updateData({ personalityTraits: newTraits });
      setNewTraitKey("");
      setNewTraitValue("");
    }
  };

  const handleRemoveTrait = (key: string) => {
    const newTraits = { ...data.personalityTraits };
    delete newTraits[key];
    updateData({ personalityTraits: newTraits });
  };

  return (
    <div className="space-y-6 text-dark-text">
      <h2 className="text-lg font-semibold">Define Personality Traits</h2>
      <p className="text-sm text-dark-text/60">
        Add key-value pairs to shape your character's personality. For example:
        'mood' could be 'brooding', and 'hobby' could be 'stargazing'.
      </p>

      <div className="space-y-4">
        {Object.entries(data.personalityTraits).map(([key, value]) => (
          <div key={key} className="flex items-center gap-2 p-2 bg-dark-bg/30 rounded-md">
            <strong className="text-secondary">{key}:</strong>
            <span>{String(value)}</span>
            <button
              onClick={() => handleRemoveTrait(key)}
              className="ml-auto text-error hover:text-error/80"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-4 border-t border-dark-text/10 pt-6">
        <input
          type="text"
          value={newTraitKey}
          onChange={(e) => setNewTraitKey(e.target.value)}
          placeholder="Trait Name (e.g., Mood)"
          className="flex-1 px-3 py-2 bg-dark-bg/50 border border-dark-text/20 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
        />
        <input
          type="text"
          value={newTraitValue}
          onChange={(e) => setNewTraitValue(e.target.value)}
          placeholder="Trait Value (e.g., Brooding)"
          className="flex-1 px-3 py-2 bg-dark-bg/50 border border-dark-text/20 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
        />
        <button
          onClick={handleAddTrait}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default Step2Personality;
