"use client";

import { CharacterData } from "../CharacterEditor";

interface Step3BackstoryProps {
  data: CharacterData;
  updateData: (data: Partial<CharacterData>) => void;
}

const Step3Backstory: React.FC<Step3BackstoryProps> = ({ data, updateData }) => {
  return (
    <div className="space-y-4 text-dark-text">
      <h2 className="text-lg font-semibold">Character Backstory</h2>
      <p className="text-sm text-dark-text/60">
        This is the core of your character's memory and history. Write as much
        or as little as you like. The AI will draw from this to inform its
        responses.
      </p>
      <textarea
        value={data.backstory}
        onChange={(e) => updateData({ backstory: e.target.value })}
        className="w-full h-64 px-3 py-2 bg-dark-bg/50 border border-dark-text/20 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
        placeholder="Once upon a time, in a galaxy far, far away..."
      />
    </div>
  );
};

export default Step3Backstory;
