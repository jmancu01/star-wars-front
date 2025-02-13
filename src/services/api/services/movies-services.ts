import apiClient from "../client";
import type { Film } from "../types/film-types";

interface GetFilmsParams {
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

export const filmService = {
  getAll: async (params: GetFilmsParams = {}): Promise<ApiResponse<Film>> => {
    try {
      const { data } = await apiClient.get("/films", { params });
      return data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error fetching films:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch films");
    }
  },

  getById: async (id: number): Promise<Film> => {
    try {
      const { data } = await apiClient.get(`/films/${id}`);
      return data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error fetching film:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch film");
    }
  },
};
