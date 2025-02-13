"use client";

import { useEffect, useState } from "react";
import { characterService } from "@/services/api";
import { Character } from "@/services/api/types/character-types";
import { useParams } from "next/navigation";
import Link from "next/link";
import ChatModule from "../../components/chat";

export default function CharacterDetailPage() {
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        setLoading(true);
        setError(null);

        const characterId = params?.id;
        if (!characterId || Array.isArray(characterId)) {
          throw new Error("Invalid character ID");
        }

        const response = await characterService.getById(parseInt(characterId));
        setCharacter(response);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacter();
  }, [params?.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <div className="animate-pulse text-xl text-yellow-400">
          Loading character details...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <div className="text-xl text-red-400 border border-red-400/20 rounded-lg p-6 bg-black/60 backdrop-blur-sm">
          Error: {error}
        </div>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <div className="text-xl text-yellow-400">Character not found</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Character Details Panel */}
          <div className="bg-black/60 rounded-lg p-8 backdrop-blur-sm border border-yellow-400/20 hover:border-yellow-400/50 transition-all duration-300">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <h1 className="text-4xl font-bold text-yellow-400">
                {character.name}
              </h1>
              <Link
                href="/characters"
                className="px-6 py-3 bg-black/60 text-white rounded-lg border border-yellow-400/20 hover:border-yellow-400/50 transition-all duration-300 backdrop-blur-sm hover:bg-black/80"
              >
                Back to List
              </Link>
            </div>

            <div className="space-y-6 text-gray-300">
              <DetailRow label="Birth Year" value={character.birth_year} />
              <DetailRow label="Gender" value={character.gender} />
              <DetailRow label="Height" value={`${character.height}cm`} />
              <DetailRow label="Mass" value={`${character.mass}kg`} />
              <DetailRow label="Hair Color" value={character.hair_color} />
              <DetailRow label="Eye Color" value={character.eye_color} />
              <DetailRow label="Skin Color" value={character.skin_color} />
            </div>
          </div>

          {/* Chat Module Panel */}
          <div className="bg-black/60 rounded-lg overflow-hidden backdrop-blur-sm border border-yellow-400/20 hover:border-yellow-400/50 transition-all duration-300">
            <ChatModule character={character} />
          </div>
        </div>
      </div>
    </main>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center border-b border-yellow-400/10 pb-4">
      <span className="font-medium sm:w-1/3 text-yellow-400/80 mb-1 sm:mb-0">
        {label}:
      </span>
      <span className="sm:w-2/3">{value}</span>
    </div>
  );
}
