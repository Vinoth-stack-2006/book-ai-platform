import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function BookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/books/")
      .then(res => {
        const found = res.data.find(b => b.id === parseInt(id));
        setBook(found);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div style={{ color: "#333", fontSize: "14px", padding: "20px" }}>Loading...</div>
  );

  if (!book) return (
    <div style={{ color: "#555", fontSize: "14px", padding: "20px" }}>Book not found.</div>
  );

  return (
    <div style={{ maxWidth: "800px" }}>

      {/* BACK */}
      <Link to="/" style={{
        display: "inline-flex", alignItems: "center", gap: "6px",
        fontSize: "12px", color: "#444", textDecoration: "none",
        marginBottom: "32px", letterSpacing: "0.05em",
        transition: "color 0.15s"
      }}
        onMouseEnter={e => e.currentTarget.style.color = "#c9a96e"}
        onMouseLeave={e => e.currentTarget.style.color = "#444"}
      >
        ← Back to Library
      </Link>

      {/* MAIN LAYOUT */}
      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "40px", alignItems: "start" }}>

        {/* COVER */}
        <div>
          <div style={{
            borderRadius: "12px", overflow: "hidden",
            border: "1px solid #1e1e1e", aspectRatio: "2/3",
            background: "#111"
          }}>
            <img
              src={book.image_url || "https://via.placeholder.com/200x300/1a1a1a/333?text=Book"}
              alt={book.title || "Book cover"}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </div>

          {book.url && (
            <a
              href={book.url}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "block", marginTop: "14px",
                background: "#c9a96e", color: "#0a0a0a",
                borderRadius: "10px", padding: "11px 16px",
                fontSize: "13px", fontWeight: 600, textAlign: "center",
                textDecoration: "none", transition: "opacity 0.15s"
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              View Book →
            </a>
          )}
        </div>

        {/* DETAILS */}
        <div>
          {/* Genre / Category tag */}
          {book.genre && (
            <div style={{
              display: "inline-block", fontSize: "11px", letterSpacing: "0.15em",
              textTransform: "uppercase", color: "#c9a96e", fontWeight: 600,
              marginBottom: "12px"
            }}>
              {book.genre}
            </div>
          )}

          <h1 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "34px", fontWeight: 400, color: "#f0ece4",
            letterSpacing: "-0.02em", lineHeight: 1.15,
            margin: "0 0 10px"
          }}>
            {book.title}
          </h1>

          <p style={{ fontSize: "15px", color: "#555", margin: "0 0 24px" }}>
            by {book.author}
          </p>

          {/* RATING */}
          {book.rating && (
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              background: "#111", border: "1px solid #1e1e1e",
              borderRadius: "8px", padding: "6px 12px", marginBottom: "24px"
            }}>
              <span style={{ color: "#c9a96e", fontSize: "14px" }}>★</span>
              <span style={{ fontSize: "13px", color: "#ccc", fontWeight: 500 }}>{book.rating}</span>
            </div>
          )}

          {/* DIVIDER */}
          <div style={{ height: "1px", background: "#1e1e1e", marginBottom: "24px" }} />

          {/* DESCRIPTION */}
          <p style={{ fontSize: "15px", lineHeight: 1.75, color: "#888", margin: 0 }}>
            {book.description}
          </p>
        </div>
      </div>

    </div>
  );
}

export default BookDetail;