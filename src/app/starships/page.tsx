"use client";

import { useEffect, useState, useCallback } from "react";
import { starshipService } from "@/services/api/services/startship-services";
import { Starship } from "@/services/api/types/starship-types";
import { Search } from "lucide-react";
import debounce from "lodash/debounce";

export default function StarshipsPage() {
  const [starships, setStarships] = useState<Starship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});

  const fetchStarships = useCallback(
    async (params: Record<string, unknown> = {}) => {
      try {
        setLoading(true);
        setError(null);
        const response = await starshipService.getAll({
          page,
          search: searchTerm,
          ...filters,
          ...params,
        });
        setStarships(response.data);
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
    fetchStarships({ search: value, page: 1 });
  }, 300);

  useEffect(() => {
    fetchStarships();
  }, [fetchStarships]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [key]: value };
      if (!value) delete newFilters[key];
      return newFilters;
    });
    setPage(1);
  };

  const formatCredits = (credits: string) => {
    if (credits === "unknown") return "Unknown";
    const num = parseInt(credits);
    if (isNaN(num)) return credits;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(num);
  };

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <div className="text-xl text-red-400 border border-red-400/20 rounded-lg p-6 bg-black/60 backdrop-blur-sm">
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
            Star Wars Starships
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
                  placeholder="Search starships..."
                  onChange={(e) => debouncedSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-black/60 text-white border border-yellow-400/20 focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20 outline-none transition-all duration-300 backdrop-blur-sm"
                />
              </div>
            </div>

            <select
              onChange={(e) =>
                handleFilterChange("starship_class", e.target.value)
              }
              className="px-4 py-3 rounded-lg bg-black/60 text-white border border-yellow-400/20 focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20 outline-none transition-all duration-300 backdrop-blur-sm"
            >
              <option value="">All Classes</option>
              <option value="Starfighter">Starfighter</option>
              <option value="Transport">Transport</option>
              <option value="Star Destroyer">Star Destroyer</option>
              <option value="Light freighter">Light freighter</option>
              <option value="Assault starfighter">Assault starfighter</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-xl text-yellow-400">Loading starships...</div>
          </div>
        ) : (
          <>
            {/* Starships Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
              {starships.map((starship) => (
                <div
                  key={starship.url}
                  className="bg-black/60 rounded-lg p-8 backdrop-blur-sm border border-yellow-400/20 hover:border-yellow-400/50 transition-all duration-300 group"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <h2 className="text-2xl font-semibold text-yellow-400 group-hover:text-yellow-300 transition-colors">
                      {starship.name}
                    </h2>
                    <span className="px-3 py-1 bg-black/40 rounded-full text-sm text-yellow-400/70">
                      {starship.starship_class}
                    </span>
                  </div>

                  <div className="space-y-6 text-gray-300">
                    <div className="space-y-4">
                      <p>
                        <span className="font-medium text-yellow-400/80">
                          Model:
                        </span>{" "}
                        {starship.model}
                      </p>
                      <p>
                        <span className="font-medium text-yellow-400/80">
                          Manufacturer:
                        </span>{" "}
                        {starship.manufacturer}
                      </p>
                      <p>
                        <span className="font-medium text-yellow-400/80">
                          Cost:
                        </span>{" "}
                        {formatCredits(starship.cost_in_credits)}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-yellow-400/10">
                      <p>
                        <span className="font-medium text-yellow-400/80">
                          Length:
                        </span>{" "}
                        {starship.length}m
                      </p>
                      <p>
                        <span className="font-medium text-yellow-400/80">
                          Speed:
                        </span>{" "}
                        {starship.max_atmosphering_speed}
                      </p>
                      <p>
                        <span className="font-medium text-yellow-400/80">
                          Crew:
                        </span>{" "}
                        {starship.crew}
                      </p>
                      <p>
                        <span className="font-medium text-yellow-400/80">
                          Passengers:
                        </span>{" "}
                        {starship.passengers}
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4 border-t border-yellow-400/10">
                      <p>
                        <span className="font-medium text-yellow-400/80">
                          Hyperdrive Rating:
                        </span>{" "}
                        {starship.hyperdrive_rating}
                      </p>
                      <p>
                        <span className="font-medium text-yellow-400/80">
                          MGLT:
                        </span>{" "}
                        {starship.MGLT}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-yellow-400/10">
                      <span className="font-medium text-yellow-400/80">
                        Featured In:
                      </span>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-black/40 rounded-full text-sm">
                          Films: {starship.films.length}
                        </span>
                        <span className="px-3 py-1 bg-black/40 rounded-full text-sm">
                          Pilots: {starship.pilots.length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
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
