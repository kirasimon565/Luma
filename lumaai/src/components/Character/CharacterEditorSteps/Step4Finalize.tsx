"use client";

import { CharacterData } from "../CharacterEditor";

interface Step4FinalizeProps {
  data: CharacterData;
}

const Step4Finalize: React.FC<Step4FinalizeProps> = ({ data }) => {
  return (
    <div className="space-y-6 text-dark-text">
      <h2 className="text-xl font-bold font-display text-center">Review Your Character</h2>
      <div className="p-4 bg-dark-bg/30 rounded-lg space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center">
            {/* Placeholder for avatar */}
            <span className="text-4xl font-bold text-dark-bg">{data.name.charAt(0)}</span>
          </div>
          <div>
            <h3 className="text-2xl font-bold">{data.name}</h3>
            <p className="text-sm text-dark-text/70">{data.voiceStyle}</p>
            {data.isNsfw && (
              <span className="px-2 py-1 text-xs font-semibold bg-warning text-dark-bg rounded-full">
                NSFW
              </span>
            )}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-secondary">Personality Traits</h4>
          <div className="flex flex-wrap gap-2 mt-2">
            {Object.entries(data.personalityTraits).map(([key, value]) => (
              <div key={key} className="bg-dark-bg/50 px-3 py-1 rounded-full text-sm">
                <span className="font-semibold">{key}:</span> {String(value)}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-secondary">Backstory</h4>
          <p className="mt-2 text-sm text-dark-text/80 bg-dark-bg/50 p-3 rounded-md max-h-48 overflow-y-auto">
            {data.backstory}
          </p>
        </div>
      </div>
      <p className="text-center text-sm text-dark-text/60">
        When you're ready, click "Create Character" to bring them to life.
      </p>
    </div>
  );
};

export default Step4Finalize;
