import { AuthService } from '../services/authService';
import type { User } from '../types';

interface NavbarProps {
  user: User | null;
  onAuthChange: () => void;
}

export function Navbar({ user, onAuthChange }: NavbarProps) {
  const handleLogout = async () => {
    try {
      await AuthService.logout();
      onAuthChange();
    } catch (err) {
      console.error('Failed to log out:', err);
    }
  };

  return (
    <header 
      className="layout-header" 
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: '16px 28px', 
        background: '#111827', 
        borderRadius: '12px', 
        marginBottom: '24px' 
      }}
    >
      {/* Brand Section with Larger SVG Icon */}
      <div 
        className="brand-title" 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '14px', 
          color: '#ffffff', 
          fontWeight: 700, 
          fontSize: '1.35rem',
          letterSpacing: '-0.02em'
        }}
      >
        <img 
          src="/assets/voteideaicon-min.svg" 
          alt="Vote Idea Logo" 
          style={{ width: '40px', height: '40px', objectFit: 'contain' }} 
        />
        <span>voteldeaBoard</span>
      </div>

      {/* User Session Info & Disconnect Button */}
      {user && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span className="welcome-msg" style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
            Logged in as <strong style={{ color: '#ffffff' }}>@{user.username}</strong>
          </span>
          <button 
            onClick={handleLogout} 
            className="btn-logout"
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: '1px solid #374151',
              background: '#1f2937',
              color: '#ffffff',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#374151'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#1f2937'}
          >
            Disconnect
          </button>
        </div>
      )}
    </header>
  );
}