import { VoteToken } from './VoteToken';
import { useIdeaStore } from '../services/useIdeaStore';
import type { Idea } from '../types';

export const IdeaCard = ({ idea }: { idea: Idea }) => {
  const toggleVote = useIdeaStore((state) => state.toggleVote);
  const syncingIds = useIdeaStore((state) => state.syncingIds);
  const isSyncing = syncingIds.has(idea.id);

  return (
    <div className="idea-card">
      <div className="idea-info">
        <h3 className="idea-title">{idea.title}</h3>
        <div className="idea-meta">
          Posted by <span style={{ color: '#10b981' }}>@{idea.owner?.username || 'anonymous'}</span>
        </div>
        {idea.description && <p className="idea-description">{idea.description}</p>}
      </div>

      <VoteToken
        isVoted={idea.user_has_voted}
        count={idea.vote_count}
        onClick={isSyncing ? undefined : () => toggleVote(idea.id)}
      />
    </div>
  );
};
