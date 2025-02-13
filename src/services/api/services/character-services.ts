// src/services/api/services.ts
import { Message } from "@/app/components/chat";
import apiClient from "../client";
import type { Character } from "../types/character-types";

interface GetCharactersParams {
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

interface chatWithResponse {
  response: string;
}

export const characterService = {
  getAll: async (
    params: GetCharactersParams = {}
  ): Promise<ApiResponse<Character>> => {
    try {
      const { data } = await apiClient.get("/characters", { params });
      return data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error fetching characters:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch characters"
      );
    }
  },

  getById: async (id: number): Promise<Character> => {
    try {
      const { data } = await apiClient.get(`/characters/${id}`);
      return data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error fetching character:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch character"
      );
    }
  },
  chatWith: async (
    id: number,
    message: string,
    previousMessages: Message[]
  ): Promise<chatWithResponse> => {
    try {
      const { data } = await apiClient.post(`/characters/${id}/chat`, {
        message: `${message}`,
        previousMessages: previousMessages,
      });
      return data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error fetching character:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch character"
      );
    }
  },
};
