import { useIdeaStore } from '../services/useIdeaStore';
import { WinnerCupCanvas, SkullCanvas } from './3D/Models';

export function Leaderboard() {
  const { leaderboardIdeas } = useIdeaStore();

  return (
    <div style={{ width: '100%' }}>
      {/* Fixed header using a bold h2 heading to match the rest of the feed section */}
      <div 
        className="section-title"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
          minHeight: '40px'
        }}
      >
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1f2937', margin: 0 }}>
          Leaderboard
        </h2>
      </div>

      <div className="leaderboard-panel">
        {leaderboardIdeas.map((idea, index) => {
          const rank = index + 1;
          const isFirst = rank === 1;
          const isLast = rank === leaderboardIdeas.length && leaderboardIdeas.length > 1;
          const rankClass = rank === 1 ? 'rank-1' : rank === 2 ? 'rank-2' : '';

          return (
            <div key={idea.id} className={`rank-card ${rankClass}`}>
              <div className={`rank-badge ${!rankClass ? 'rank-badge-default' : ''}`}>
                {rank}
              </div>

              <div className="rank-details">
                <p className="rank-title">{idea.title}</p>
                <p className="rank-meta">{idea.vote_count} votes</p>
              </div>

              <div className="rank-icon">
                {isFirst && <WinnerCupCanvas />}
                {isLast && <SkullCanvas />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}