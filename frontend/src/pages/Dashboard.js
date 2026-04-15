import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Dashboard() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/books/")
      .then(res => { setBooks(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div>

      {/* HEADER */}
      <div style={{ marginBottom: "40px" }}>
        <p style={{ fontSize: "11px", letterSpacing: "0.2em", color: "#c9a96e", textTransform: "uppercase", fontWeight: 600, marginBottom: "8px" }}>
          Your Collection
        </p>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "38px", fontWeight: 400, color: "#f0ece4", letterSpacing: "-0.02em", lineHeight: 1.1, margin: 0 }}>
          Book Library
        </h1>
        <p style={{ color: "#555", fontSize: "14px", marginTop: "8px" }}>
          {books.length} titles available
        </p>
      </div>

      {/* LOADING */}
      {loading && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "20px" }}>
          {[...Array(8)].map((_, i) => (
            <div key={i} style={{ background: "#161616", borderRadius: "12px", height: "300px", animation: "pulse 1.5s ease-in-out infinite", opacity: 0.6 }} />
          ))}
        </div>
      )}

      {/* GRID */}
      {!loading && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "20px" }}>
          {books.map((book, i) => (
            <Link to={`/book/${book.id}`} key={book.id} style={{ textDecoration: "none" }}>
              <div
                style={{
                  background: "#111",
                  borderRadius: "14px",
                  overflow: "hidden",
                  border: "1px solid #1e1e1e",
                  transition: "transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease",
                  cursor: "pointer",
                  animationDelay: `${i * 30}ms`,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.borderColor = "#2a2a2a";
                  e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,0.5)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "#1e1e1e";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* IMAGE */}
                <div style={{ position: "relative", height: "220px", background: "#1a1a1a", overflow: "hidden" }}>
                  <img
                    src={book.image_url || "https://via.placeholder.com/300x220/1a1a1a/333?text=Book"}
                    alt={book.title || "Book cover"}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                  <div style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(to top, rgba(10,10,10,0.8) 0%, transparent 50%)"
                  }} />
                </div>

                {/* CONTENT */}
                <div style={{ padding: "14px 16px 16px" }}>
                  <h3 style={{
                    fontSize: "13.5px", fontWeight: 600, color: "#f0ece4",
                    margin: "0 0 4px", lineHeight: 1.3,
                    display: "-webkit-box", WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical", overflow: "hidden"
                  }}>
                    {book.title}
                  </h3>
                  <p style={{ fontSize: "12px", color: "#555", margin: "0 0 10px" }}>
                    {book.author || "Unknown Author"}
                  </p>
                  <p style={{
                    fontSize: "12px", color: "#444", lineHeight: 1.5, margin: 0,
                    display: "-webkit-box", WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical", overflow: "hidden"
                  }}>
                    {book.description}
                  </p>
                  <div style={{ marginTop: "12px", fontSize: "12px", color: "#c9a96e", fontWeight: 500 }}>
                    View details →
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

    </div>
  );
}

export default Dashboard;