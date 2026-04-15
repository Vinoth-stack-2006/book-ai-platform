import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Ask from "./pages/Ask";
import BookDetail from "./pages/BookDetail";

function App() {
  return (
    <Router>
      <div style={{ display: "flex", height: "100vh", background: "#0a0a0a", color: "#f0ece4", fontFamily: "'DM Sans', sans-serif" }}>

        {/* SIDEBAR */}
        <aside style={{
          width: "240px",
          background: "#111111",
          borderRight: "1px solid #1e1e1e",
          display: "flex",
          flexDirection: "column",
          padding: "32px 20px",
          flexShrink: 0,
        }}>

          {/* LOGO */}
          <div style={{ marginBottom: "48px", paddingLeft: "8px" }}>
            <div style={{ fontSize: "11px", letterSpacing: "0.2em", color: "#c9a96e", fontWeight: 600, textTransform: "uppercase", marginBottom: "4px" }}>
              Library
            </div>
            <div style={{ fontSize: "22px", fontWeight: 700, color: "#f0ece4", letterSpacing: "-0.03em" }}>
              Book<span style={{ color: "#c9a96e" }}>AI</span>
            </div>
          </div>

          {/* NAV */}
          <nav style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {[
              { to: "/", label: "Library", icon: "▤" },
              { to: "/ask", label: "Ask AI", icon: "◈" },
            ].map(({ to, label, icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                style={({ isActive }) => ({
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  fontSize: "13.5px",
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? "#c9a96e" : "#777",
                  background: isActive ? "#1a1a1a" : "transparent",
                  textDecoration: "none",
                  transition: "all 0.15s ease",
                  border: isActive ? "1px solid #2a2a2a" : "1px solid transparent",
                })}
              >
                <span style={{ fontSize: "15px" }}>{icon}</span>
                {label}
              </NavLink>
            ))}
          </nav>

          {/* FOOTER */}
          <div style={{ marginTop: "auto", fontSize: "11px", color: "#333", letterSpacing: "0.05em" }}>
            Powered by Claude AI
          </div>
        </aside>

        {/* MAIN */}
        <main style={{ flex: 1, overflowY: "auto", padding: "40px 48px" }}>
          <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/ask" element={<Ask />} />
            <Route path="/book/:id" element={<BookDetail />} />
          </Routes>
        </main>

      </div>
    </Router>
  );
}

export default App;