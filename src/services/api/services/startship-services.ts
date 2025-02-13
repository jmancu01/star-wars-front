// services/api/starshipService.ts
import apiClient from "../client";
import type { Starship } from "../types/starship-types";

interface GetStarshipsParams {
  page?: number;
  limit?: number;
  search?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; // For additional filter parameters
}

interface ApiResponse<T> {
  meta: {
    total: number;
    currentPage: number;
    totalPages: number;
    limit: number;
  };
  data: T[];
}

export const starshipService = {
  getAll: async (
    params: GetStarshipsParams = {}
  ): Promise<ApiResponse<Starship>> => {
    try {
      const { data } = await apiClient.get("/starships", { params });
      return data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error fetching starships:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch starships"
      );
    }
  },

  getById: async (id: number): Promise<Starship> => {
    try {
      const { data } = await apiClient.get(`/starships/${id}`);
      return data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error fetching starship:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch starship"
      );
    }
  },
};
