import { useState } from 'react';
import { ThreeDButton } from './3D/Models';
import { useIdeaStore } from '../services/useIdeaStore';

export function CreateIdea() {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const addIdea = useIdeaStore((state) => state.addIdea);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    try {
      setError('');
      await addIdea(title, description);
      setTitle('');
      setDescription('');
      setIsOpen(false);
    } catch (err) {
      console.error('Failed to create idea:', err);
      setError('Failed to create idea. Please ensure you are logged in.');
    }
  };

  return (
    <div>
      <ThreeDButton onClick={() => setIsOpen(true)} />

      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px',
          }}
        >
          <div
            style={{
              background: '#1e1e24',
              padding: '24px',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '480px',
              boxSizing: 'border-box',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
              overflow: 'hidden',
            }}
          >
            <h3 style={{ marginTop: 0, marginBottom: '16px', color: '#ffffff', fontSize: '1.25rem' }}>
              Create Proposal
            </h3>

            {error && (
              <div style={{ color: '#ef4444', marginBottom: '12px', fontSize: '0.85rem' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  background: '#2a2a32',
                  border: '1px solid #33333e',
                  color: '#ffffff',
                  fontSize: '0.95rem',
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
              />
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  background: '#2a2a32',
                  border: '1px solid #33333e',
                  color: '#ffffff',
                  fontSize: '0.95rem',
                  resize: 'vertical',
                  minHeight: '80px',
                  maxHeight: '220px',
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  style={{
                    padding: '8px 16px',
                    background: 'transparent',
                    color: '#ccc',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontFamily: 'inherit',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '8px 18px',
                    background: 'var(--accent-green, #10b981)',
                    color: '#000000',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontFamily: 'inherit',
                  }}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}