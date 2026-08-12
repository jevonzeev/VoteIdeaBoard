import api from "../lib/axios";
import type { Idea, VoteResponse } from "../types";

//fetch all ideas
export const IdeaService = {
  list: async (): Promise<Idea[]> => {
    const response = await api.get<Idea[]>("/ideas/");
    return response.data;
  },
  listLeaderboard: async (): Promise<Idea[]> => {
    const response = await api.get<Idea[]>("/leaderboard/");
    return response.data;
  },
  //create idea
  create: async (title: string, description: string): Promise<Idea> => {
    const response = await api.post<Idea>("/ideas/", { title, description });
    return response.data;
  },
  
  vote: async (id: number): Promise<VoteResponse> => {
    const response = await api.post<VoteResponse>(`/ideas/${id}/vote/`);
    return response.data;
  },

  unvote: async (id: number): Promise<VoteResponse> => {
    const response = await api.delete<VoteResponse>(`/ideas/${id}/vote/`);
    return response.data;
  },
};
