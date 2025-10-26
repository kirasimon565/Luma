"use client";

import { CharacterData } from "../CharacterEditor";

interface Step1BasicsProps {
  data: CharacterData;
  updateData: (data: Partial<CharacterData>) => void;
}

const Step1Basics: React.FC<Step1BasicsProps> = ({ data, updateData }) => {
  return (
    <div className="space-y-6 text-dark-text">
      <div>
        <label htmlFor="name" className="block text-sm font-medium">
          Character Name
        </label>
        <input
          id="name"
          type="text"
          value={data.name}
          onChange={(e) => updateData({ name: e.target.value })}
          className="w-full px-3 py-2 mt-1 bg-dark-bg/50 border border-dark-text/20 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          placeholder="e.g., Elara Void-Singer"
        />
        <p className="mt-1 text-xs text-dark-text/50">
          The name your character will be known by.
        </p>
      </div>

      <div>
        <label htmlFor="avatarUrl" className="block text-sm font-medium">
          Avatar URL
        </label>
        <input
          id="avatarUrl"
          type="url"
          value={data.avatarUrl}
          onChange={(e) => updateData({ avatarUrl: e.target.value })}
          className="w-full px-3 py-2 mt-1 bg-dark-bg/50 border border-dark-text/20 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          placeholder="https://example.com/avatar.png"
        />
        <p className="mt-1 text-xs text-dark-text/50">
          A direct link to an image for your character's portrait.
        </p>
      </div>

      <div>
        <label htmlFor="voiceStyle" className="block text-sm font-medium">
          Voice Style
        </label>
        <input
          id="voiceStyle"
          type="text"
          value={data.voiceStyle}
          onChange={(e) => updateData({ voiceStyle: e.target.value })}
          className="w-full px-3 py-2 mt-1 bg-dark-bg/50 border border-dark-text/20 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          placeholder="e.g., Calm, measured, with a slight echo"
        />
        <p className="mt-1 text-xs text-dark-text/50">
          Describe the tone and style of your character's speech.
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <label htmlFor="isNsfw" className="block text-sm font-medium">
            NSFW/Adult Content
          </label>
          <p className="text-xs text-dark-text/50">
            Enable if this character is intended for mature themes.
          </p>
        </div>
        <button
          onClick={() => updateData({ isNsfw: !data.isNsfw })}
          className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
            data.isNsfw ? "bg-primary" : "bg-dark-text/30"
          }`}
        >
          <span
            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
              data.isNsfw ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>
    </div>
  );
};

export default Step1Basics;
