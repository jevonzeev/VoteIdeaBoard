import { create } from 'zustand';
import { IdeaService } from './ideaService';
import type { Idea } from '../types';

interface IdeaState {
  ideas: Idea[];
  leaderboardIdeas: Idea[];
  syncingIds: Set<number>;
  fetchIdeas: () => Promise<void>;
  fetchLeaderboard: () => Promise<void>;
  addIdea: (title: string, description: string) => Promise<void>;
  toggleVote: (ideaId: number) => Promise<void>;
}

export const useIdeaStore = create<IdeaState>((set, get) => ({
  ideas: [],
  leaderboardIdeas: [],
  syncingIds: new Set(),

  fetchIdeas: async () => {
    const serverIdeas = await IdeaService.list();
    const { syncingIds, ideas: currentIdeas } = get();
    const reconciledIdeas = serverIdeas.map(serverIdea => {
      if (syncingIds.has(serverIdea.id)) {
        const localIdea = currentIdeas.find(i => i.id === serverIdea.id);
        return localIdea || serverIdea;
      }
      return serverIdea;
    });
    set({ ideas: reconciledIdeas });
  },

  fetchLeaderboard: async () => {
    const serverIdeas = await IdeaService.listLeaderboard();
    const { syncingIds, leaderboardIdeas: currentIdeas } = get();
    const reconciledIdeas = serverIdeas.map(serverIdea => {
      if (syncingIds.has(serverIdea.id)) {
        const localIdea = currentIdeas.find(i => i.id === serverIdea.id);
        return localIdea || serverIdea;
      }
      return serverIdea;
    });
    set({ leaderboardIdeas: reconciledIdeas });
  },

  addIdea: async (title: string, description: string) => {
    const tempId = Date.now();
    const { ideas } = get();
    const tempIdea: Idea = {
      id: tempId,
      title,
      description,
      vote_count: 0,
      user_has_voted: false,
      created_at: new Date().toISOString(),
      is_temp: true,
    };
    // Insert new idea at top of current feed
    set({ ideas: [tempIdea, ...ideas] });
    try {
      const realIdea = await IdeaService.create(title, description);
      set(state => ({
        ideas: state.ideas.map(i => (i.id === tempId ? realIdea : i)),
      }));
      await get().fetchLeaderboard();
    } catch (err) {
      set(state => ({
        ideas: state.ideas.filter(i => i.id !== tempId),
      }));
      throw err;
    }
  },

  toggleVote: async (ideaId: number) => {
    const { ideas, syncingIds } = get();
    if (syncingIds.has(ideaId)) return;
    const idea = ideas.find(i => i.id === ideaId);
    if (!idea) return;

    const wasVoted = idea.user_has_voted;
    const prevCount = idea.vote_count;

    // Optimistic local state update WITHOUT re-sorting order
    set({
      syncingIds: new Set(syncingIds).add(ideaId),
      ideas: ideas.map(i =>
        i.id === ideaId
          ? { ...i, user_has_voted: !wasVoted, vote_count: wasVoted ? prevCount - 1 : prevCount + 1 }
          : i
      ),
    });

    try {
      const result = wasVoted
        ? await IdeaService.unvote(ideaId)
        : await IdeaService.vote(ideaId);

      set(state => ({
        ideas: state.ideas.map(i =>
          i.id === ideaId
            ? { ...i, user_has_voted: result.user_has_voted }
            : i
        ),
      }));
    } catch (err) {
      // Revert on failure without re-sorting order
      set(state => ({
        ideas: state.ideas.map(i =>
          i.id === ideaId
            ? { ...i, user_has_voted: wasVoted, vote_count: prevCount }
            : i
        ),
      }));
    } finally {
      set(state => {
        const next = new Set(state.syncingIds);
        next.delete(ideaId);
        return { syncingIds: next };
      });
    }
  },
}));
