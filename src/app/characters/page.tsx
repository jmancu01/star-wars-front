"use client";

import { useEffect, useState, useCallback } from "react";
import { characterService } from "@/services/api";
import { Character } from "@/services/api/types/character-types";
import { Search } from "lucide-react";
import debounce from "lodash/debounce";
import Link from "next/link";

export default function CharactersPage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});

  const fetchCharacters = useCallback(
    async (params: Record<string, unknown> = {}) => {
      try {
        setLoading(true);
        setError(null);
        const response = await characterService.getAll({
          page,
          search: searchTerm,
          ...filters,
          ...params,
        });
        setCharacters(response.data);
        setTotalPage(response.meta.totalPages);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [page, searchTerm, filters]
  );

  const debouncedSearch = debounce((value: string) => {
    setSearchTerm(value);
    setPage(1);
    fetchCharacters({ search: value, page: 1 });
  }, 300);

  useEffect(() => {
    fetchCharacters();
  }, [fetchCharacters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [key]: value };
      if (!value) delete newFilters[key];
      return newFilters;
    });
    setPage(1);
  };

  const extractIdFromUrl = (url: string | null | undefined): string => {
    if (!url) return "1";
    const segments = url.split("/").filter(Boolean);
    const lastSegment = segments[segments.length - 1];
    return lastSegment || "1";
  };

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black text-red-400">
        <div className="text-xl border border-red-400/20 rounded-lg p-6 bg-black/60 backdrop-blur-sm">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-8 text-yellow-400 text-center">
            Star Wars Characters
          </h1>

          {/* Search and Filters */}
          <div className="flex flex-wrap gap-4 mb-8 max-w-4xl mx-auto">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search characters..."
                  onChange={(e) => debouncedSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-black/60 text-white border border-yellow-400/20 focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20 outline-none transition-all duration-300 backdrop-blur-sm"
                />
              </div>
            </div>

            <select
              onChange={(e) => handleFilterChange("gender", e.target.value)}
              className="px-4 py-3 rounded-lg bg-black/60 text-white border border-yellow-400/20 focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20 outline-none transition-all duration-300 backdrop-blur-sm"
            >
              <option value="">All Genders</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="n/a">N/A</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-xl text-yellow-400">Loading characters...</div>
          </div>
        ) : (
          <>
            {/* Characters Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {characters.map((character) => (
                <Link
                  href={`/characters/${extractIdFromUrl(character.url)}`}
                  key={character.url}
                  className="block transition-all duration-300 hover:transform hover:scale-105"
                >
                  <div className="bg-black/60 rounded-lg p-6 backdrop-blur-sm border border-yellow-400/20 hover:border-yellow-400/50 transition-all duration-300">
                    <h2 className="text-2xl font-semibold mb-4 text-yellow-400">
                      {character.name}
                    </h2>
                    <div className="space-y-3 text-gray-300">
                      <p>
                        <span className="font-medium text-yellow-400/80">
                          Birth Year:
                        </span>{" "}
                        {character.birth_year}
                      </p>
                      <p>
                        <span className="font-medium text-yellow-400/80">
                          Gender:
                        </span>{" "}
                        {character.gender}
                      </p>
                      <p>
                        <span className="font-medium text-yellow-400/80">
                          Height:
                        </span>{" "}
                        {character.height}cm
                      </p>
                      <p>
                        <span className="font-medium text-yellow-400/80">
                          Mass:
                        </span>{" "}
                        {character.mass}kg
                      </p>
                      <p>
                        <span className="font-medium text-yellow-400/80">
                          Hair Color:
                        </span>{" "}
                        {character.hair_color}
                      </p>
                      <p>
                        <span className="font-medium text-yellow-400/80">
                          Eye Color:
                        </span>{" "}
                        {character.eye_color}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-12 flex justify-center space-x-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-6 py-3 bg-black/60 text-white rounded-lg border border-yellow-400/20 hover:border-yellow-400/50 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black/80 transition-all duration-300 backdrop-blur-sm"
              >
                Previous Page
              </button>
              <span className="px-6 py-3 text-yellow-400">Page {page}</span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= totalPage}
                className="px-6 py-3 bg-black/60 text-white rounded-lg border border-yellow-400/20 hover:border-yellow-400/50 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black/80 transition-all duration-300 backdrop-blur-sm"
              >
                Next Page
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
