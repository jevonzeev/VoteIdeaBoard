import { useState, useEffect } from "react";
import { AuthService } from "./services/authService";
import { Navbar } from "./components/Navbar";
import { LoginForm } from "./components/LoginForm";
import { IdeaCard } from "./components/IdeaCard";
import { CreateIdea } from "./components/CreateIdea";
import { Leaderboard } from "./components/Leaderboard";
import { useIdeaStore } from "./services/useIdeaStore";
import type { User } from "./types";

const ITEMS_PER_PAGE = 20;

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [page, setPage] = useState(1);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  const { ideas, fetchIdeas, fetchLeaderboard } = useIdeaStore();

  const loadUser = async () => {
    try {
      const userData = await AuthService.me();
      setUser(userData);
    } catch {
      setUser(null);
    }
  };

  const loadData = async () => {
    await loadUser();
    await fetchIdeas();
    await fetchLeaderboard();
  };

  useEffect(() => {
    loadData();

    const interval = setInterval(() => {
      fetchIdeas();
      fetchLeaderboard();
    }, 6000);

    const handleFocus = () => {
      fetchIdeas();
      fetchLeaderboard();
    };

    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    window.addEventListener("focus", handleFocus);
    window.addEventListener("resize", handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(ideas.length / ITEMS_PER_PAGE) || 1;
  const paginatedIdeas = ideas.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="layout-container" style={{ minHeight: "100vh", backgroundColor: "#f9fafb", display: "flex", flexDirection: "column" }}>
      {/* Top Bar with ב'סד - Extra vertical padding and spacing */}
      <div style={{ padding: "24px 32px 8px 32px", display: "flex", justifyContent: "flex-end" }}>
        <span style={{ fontSize: "1.05rem", fontWeight: 700, color: "#4b5563", letterSpacing: "0.1em" }}>
          ב״סד
        </span>
      </div>

      {/* Hide Navbar when logged out */}
      {user && <Navbar user={user} onAuthChange={loadData} />}

      <div style={{ flex: 1 }}>
        {!user ? (
          <LoginForm onLoginSuccess={loadData} />
        ) : (
          /* Dynamic layout: Leaderboard top for mobile (column-reverse), side-by-side grid for desktop */
          <div
            className="main-content"
            style={{
              display: isDesktop ? "grid" : "flex",
              flexDirection: isDesktop ? undefined : "column-reverse",
              gridTemplateColumns: isDesktop ? "2fr 1fr" : undefined,
              gap: "24px",
              padding: isDesktop ? "20px 32px" : "12px",
              alignItems: "start"
            }}
          >
            {/* Main Feed Column */}
            <main className="ideas-feed" style={{ width: "100%" }}>
              <div
                className="section-title"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "16px",
                  minHeight: "40px"
                }}
              >
                <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1f2937", margin: 0 }}>
                  Proposals Feed
                </h2>
                <CreateIdea />
              </div>

              {/* Paginated Ideas */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {paginatedIdeas.map((idea) => (
                  <IdeaCard key={idea.id} idea={idea} />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "12px",
                    marginTop: "24px"
                  }}
                >
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "6px",
                      border: "none",
                      background: page === 1 ? "#e5e7eb" : "#10b981",
                      color: page === 1 ? "#9ca3af" : "#ffffff",
                      fontWeight: "bold",
                      cursor: page === 1 ? "not-allowed" : "pointer",
                      transition: "background 0.2s"
                    }}
                  >
                    Previous
                  </button>

                  <span style={{ color: "#4b5563", fontSize: "0.9rem", fontWeight: 600 }}>
                    Page {page} of {totalPages}
                  </span>

                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "6px",
                      border: "none",
                      background: page === totalPages ? "#e5e7eb" : "#10b981",
                      color: page === totalPages ? "#9ca3af" : "#ffffff",
                      fontWeight: "bold",
                      cursor: page === totalPages ? "not-allowed" : "pointer",
                      transition: "background 0.2s"
                    }}
                  >
                    Next
                  </button>
                </div>
              )}
            </main>

            {/* Leaderboard Column (Duplicate Header Removed completely) */}
            <aside style={{ width: "100%" }}>
              <Leaderboard />
            </aside>
          </div>
        )}
      </div>

      {/* Footer - Extra top margin and padding for clean spacing */}
      <footer 
        style={{ 
          textAlign: "center", 
          padding: "50px 20px", 
          color: "#6b7280", 
          fontSize: "0.9rem", 
          borderTop: "1px solid #e5e7eb", 
          marginTop: "80px",
          backgroundColor: "#ffffff"
        }}
      >
        Created by <span style={{ fontWeight: 600, color: "#1f2937" }}>Jevon Kelly Zeev</span> • {" "}
        <a 
          href="https://github.com/jevonzeev" 
          target="_blank" 
          rel="noopener noreferrer" 
          style={{ color: "#10b981", textDecoration: "none", fontWeight: 600 }}
          onMouseEnter={(e) => e.currentTarget.style.textDecoration = "underline"}
          onMouseLeave={(e) => e.currentTarget.style.textDecoration = "none"}
        >
          GitHub Profile
        </a>
      </footer>
    </div>
  );
}