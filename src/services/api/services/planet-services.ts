import apiClient from "../client";
import type { Planet } from "../types/planet-types";

interface GetPlanetsParams {
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

export const planetService = {
  getAll: async (
    params: GetPlanetsParams = {}
  ): Promise<ApiResponse<Planet>> => {
    try {
      const { data } = await apiClient.get("/planets", { params });
      return data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error fetching planets:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch planets"
      );
    }
  },

  getById: async (id: number): Promise<Planet> => {
    try {
      const { data } = await apiClient.get(`/planets/${id}`);
      return data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error fetching planet:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch planet"
      );
    }
  },
};
