import { useState } from 'react';
import { AuthService } from '../services/authService';

interface LoginFormProps {
  onLoginSuccess: () => void;
}

export function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await AuthService.login(username, password);
      onLoginSuccess();
    } catch {
      setError('Invalid username or password');
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <div 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          width: '320px', 
          padding: '36px 28px', 
          backgroundColor: '#ffffff', 
          borderRadius: '12px', 
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)', 
          border: '1px solid #e5e7eb' 
        }}
      >
        {/* Brand Icon - Updated path to point to assets folder */}
        <img 
          src="/assets/voteideaicon.svg" 
          alt="Vote Idea Logo" 
          style={{ width: '85px', height: 'auto', marginBottom: '20px' }} 
        />
        
        {/* Divider */}
        <div style={{ width: '100%', height: '1px', backgroundColor: '#f3f4f6', marginBottom: '20px' }} />

        {/* Form Title */}
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '0 0 20px 0', color: '#1f2937' }}>
          Login
        </h2>

        {error && (
          <div style={{ color: '#ef4444', marginBottom: '14px', fontSize: '0.85rem', fontWeight: 600 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              background: '#f8fafc',
              color: '#1f2937',
              fontSize: '0.95rem',
              outline: 'none',
              transition: 'all 0.2s'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#10b981';
              e.currentTarget.style.backgroundColor = '#ffffff';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#d1d5db';
              e.currentTarget.style.backgroundColor = '#f8fafc';
            }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              background: '#f8fafc',
              color: '#1f2937',
              fontSize: '0.95rem',
              outline: 'none',
              transition: 'all 0.2s'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#10b981';
              e.currentTarget.style.backgroundColor = '#ffffff';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#d1d5db';
              e.currentTarget.style.backgroundColor = '#f8fafc';
            }}
          />

          <button
            type="submit"
            style={{
              padding: '10px 16px',
              borderRadius: '6px',
              border: '1px solid #3f3f46',
              background: '#27272a',
              color: '#ffffff',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer',
              marginTop: '8px',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#18181b'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#27272a'}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}