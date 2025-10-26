"use client";

import { AlertTriangle } from "lucide-react";

interface NsfwConsentModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const NsfwConsentModal: React.FC<NsfwConsentModalProps> = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md p-6 bg-dark-bg border border-warning rounded-2xl shadow-2xl text-dark-text">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-warning" />
          <h2 className="mt-4 text-2xl font-display font-bold">Mature Content Warning</h2>
          <p className="mt-2 text-sm text-dark-text/70">
            This character is marked as NSFW and may contain adult themes, explicit language, or mature situations.
          </p>
          <p className="mt-4 text-sm font-semibold">
            You must be 18 years or older to proceed.
          </p>
        </div>
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="px-6 py-2 rounded-lg bg-dark-text/10 hover:bg-dark-text/20 transition-colors"
          >
            Go Back
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 rounded-lg bg-warning text-dark-bg font-bold hover:bg-warning/90 transition-colors"
          >
            I am 18+ and wish to continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default NsfwConsentModal;
