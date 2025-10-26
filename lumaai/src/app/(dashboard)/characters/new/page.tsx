"use client";

import CharacterEditor from "@/components/Character/CharacterEditor";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

const NewCharacterPage = () => {
  return (
    <div className="bg-dark-bg min-h-screen text-dark-text">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link
            href="/characters"
            className="flex items-center gap-2 text-dark-text/70 hover:text-dark-text transition-colors"
          >
            <ChevronLeft size={20} />
            Back to Characters
          </Link>
        </div>
        <CharacterEditor />
      </div>
    </div>
  );
};

export default NewCharacterPage;
