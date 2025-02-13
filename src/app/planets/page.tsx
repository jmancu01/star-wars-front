"use client";

import { useEffect, useState, useCallback } from "react";
import { planetService } from "@/services/api/services/planet-services";
import { Planet } from "@/services/api/types/planet-types";
import { Search } from "lucide-react";
import debounce from "lodash/debounce";

export default function PlanetsPage() {
  const [planets, setPlanets] = useState<Planet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});

  const fetchPlanets = useCallback(
    async (params: Record<string, unknown> = {}) => {
      try {
        setLoading(true);
        setError(null);
        const response = await planetService.getAll({
          page,
          search: searchTerm,
          ...filters,
          ...params,
        });
        setPlanets(response.data);
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
    fetchPlanets({ search: value, page: 1 });
  }, 300);

  useEffect(() => {
    fetchPlanets();
  }, [fetchPlanets]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [key]: value };
      if (!value) delete newFilters[key];
      return newFilters;
    });
    setPage(1);
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
            Star Wars Planets
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
                  placeholder="Search planets..."
                  onChange={(e) => debouncedSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-black/60 text-white border border-yellow-400/20 focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20 outline-none transition-all duration-300 backdrop-blur-sm"
                />
              </div>
            </div>

            <select
              onChange={(e) => handleFilterChange("climate", e.target.value)}
              className="px-4 py-3 rounded-lg bg-black/60 text-white border border-yellow-400/20 focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20 outline-none transition-all duration-300 backdrop-blur-sm"
            >
              <option value="">All Climates</option>
              <option value="temperate">Temperate</option>
              <option value="tropical">Tropical</option>
              <option value="arid">Arid</option>
              <option value="frozen">Frozen</option>
            </select>

            <select
              onChange={(e) => handleFilterChange("terrain", e.target.value)}
              className="px-4 py-3 rounded-lg bg-black/60 text-white border border-yellow-400/20 focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20 outline-none transition-all duration-300 backdrop-blur-sm"
            >
              <option value="">All Terrains</option>
              <option value="barren">Barren</option>
              <option value="rock">Rock</option>
              <option value="desert">Desert</option>
              <option value="grasslands">Grasslands</option>
              <option value="mountains">Mountains</option>
              <option value="jungles">Jungles</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-xl text-yellow-400">Loading planets...</div>
          </div>
        ) : (
          <>
            {/* Planets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {planets.map((planet) => (
                <div
                  key={planet.url}
                  className="bg-black/60 rounded-lg p-8 backdrop-blur-sm border border-yellow-400/20 hover:border-yellow-400/50 transition-all duration-300 group"
                >
                  <h2 className="text-2xl font-semibold mb-6 text-yellow-400 group-hover:text-yellow-300 transition-colors">
                    {planet.name}
                  </h2>
                  <div className="space-y-4 text-gray-300">
                    <p>
                      <span className="font-medium text-yellow-400/80">
                        Climate:
                      </span>{" "}
                      {planet.climate}
                    </p>
                    <p>
                      <span className="font-medium text-yellow-400/80">
                        Terrain:
                      </span>{" "}
                      {planet.terrain}
                    </p>
                    <p>
                      <span className="font-medium text-yellow-400/80">
                        Population:
                      </span>{" "}
                      {Number(planet.population).toLocaleString() !== "NaN"
                        ? Number(planet.population).toLocaleString()
                        : planet.population}
                    </p>
                    <p>
                      <span className="font-medium text-yellow-400/80">
                        Diameter:
                      </span>{" "}
                      {Number(planet.diameter).toLocaleString()} km
                    </p>
                    <p>
                      <span className="font-medium text-yellow-400/80">
                        Rotation Period:
                      </span>{" "}
                      {planet.rotation_period} hours
                    </p>
                    <p>
                      <span className="font-medium text-yellow-400/80">
                        Orbital Period:
                      </span>{" "}
                      {planet.orbital_period} days
                    </p>
                    <div className="pt-4 border-t border-yellow-400/10">
                      <span className="font-medium text-yellow-400/80">
                        Featured In:
                      </span>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-black/40 rounded-full text-sm">
                          Films: {planet.films.length}
                        </span>
                        <span className="px-3 py-1 bg-black/40 rounded-full text-sm">
                          Residents: {planet.residents.length}
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
