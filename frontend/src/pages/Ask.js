import { useState, useRef, useEffect } from "react";

function Ask() {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const askQuestion = async () => {
    if (!question.trim() || loading) return;
    setLoading(true);
    setResponse(null);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/ask/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      setResponse(data);
    } catch {
      setResponse({ answer: "Something went wrong. Please try again." });
    }
    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); askQuestion(); }
  };

  return (
    <div style={{ maxWidth: "760px" }}>

      {/* HEADER */}
      <div style={{ marginBottom: "40px" }}>
        <p style={{ fontSize: "11px", letterSpacing: "0.2em", color: "#c9a96e", textTransform: "uppercase", fontWeight: 600, marginBottom: "8px" }}>
          AI Assistant
        </p>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "38px", fontWeight: 400, color: "#f0ece4", letterSpacing: "-0.02em", lineHeight: 1.1, margin: 0 }}>
          Ask anything
        </h1>
        <p style={{ color: "#555", fontSize: "14px", marginTop: "8px" }}>
          Get recommendations, summaries, and insights about books
        </p>
      </div>

      {/* ANSWER BOX */}
      <div style={{
        background: "#111",
        border: "1px solid #1e1e1e",
        borderRadius: "16px",
        padding: "24px",
        marginBottom: "20px",
        minHeight: "140px",
        display: "flex",
        alignItems: loading || response ? "flex-start" : "center",
      }}>
        {loading ? (
          <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#555" }}>
            <div style={{
              width: "20px", height: "20px", borderRadius: "50%",
              border: "2px solid #2a2a2a", borderTopColor: "#c9a96e",
              animation: "spin 0.8s linear infinite", flexShrink: 0
            }} />
            <span style={{ fontSize: "14px" }}>Thinking...</span>
          </div>
        ) : response ? (
          <p style={{ fontSize: "15px", lineHeight: 1.7, color: "#ccc", margin: 0, whiteSpace: "pre-line" }}>
            {response.answer}
          </p>
        ) : (
          <p style={{ fontSize: "14px", color: "#333", margin: 0 }}>
            Your answer will appear here...
          </p>
        )}
      </div>

      {/* BOOK RESULTS */}
      {response?.books?.length > 0 && (
        <div style={{ marginBottom: "28px" }}>
          <p style={{ fontSize: "11px", letterSpacing: "0.15em", color: "#444", textTransform: "uppercase", marginBottom: "14px", fontWeight: 600 }}>
            Related Books
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "14px" }}>
            {response.books.map((book) => (
              <a key={book.id} href={`/book/${book.id}`} style={{ textDecoration: "none" }}>
                <div style={{
                  background: "#111", border: "1px solid #1e1e1e",
                  borderRadius: "12px", overflow: "hidden",
                  transition: "border-color 0.15s, transform 0.15s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#2a2a2a"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#1e1e1e"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  <img
                    src={book.image || "https://via.placeholder.com/180x120/1a1a1a/333?text=Book"}
                    alt={book.title || "Book cover"}
                    style={{ width: "100%", height: "110px", objectFit: "cover", display: "block" }}
                  />
                  <div style={{ padding: "12px" }}>
                    <h4 style={{ fontSize: "12.5px", fontWeight: 600, color: "#f0ece4", margin: "0 0 3px", lineHeight: 1.3 }}>
                      {book.title}
                    </h4>
                    <p style={{ fontSize: "11px", color: "#555", margin: "0 0 6px" }}>{book.author}</p>
                    {book.rating && (
                      <p style={{ fontSize: "11px", color: "#c9a96e", margin: 0 }}>★ {book.rating}</p>
                    )}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* INPUT */}
      <div style={{
        display: "flex", gap: "10px",
        background: "#111", border: "1px solid #1e1e1e",
        borderRadius: "14px", padding: "8px 8px 8px 18px",
        transition: "border-color 0.2s",
      }}
        onFocusCapture={e => e.currentTarget.style.borderColor = "#2a2a2a"}
        onBlurCapture={e => e.currentTarget.style.borderColor = "#1e1e1e"}
      >
        <input
          ref={inputRef}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKey}
          placeholder="e.g. Recommend a mystery novel for a rainy evening..."
          style={{
            flex: 1, background: "transparent", border: "none", outline: "none",
            fontSize: "14px", color: "#f0ece4", padding: "8px 0",
          }}
        />
        <button
          onClick={askQuestion}
          disabled={loading || !question.trim()}
          style={{
            background: question.trim() && !loading ? "#c9a96e" : "#1e1e1e",
            color: question.trim() && !loading ? "#0a0a0a" : "#333",
            border: "none", borderRadius: "10px",
            padding: "10px 20px", fontSize: "13px", fontWeight: 600,
            cursor: question.trim() && !loading ? "pointer" : "default",
            transition: "all 0.2s ease", whiteSpace: "nowrap",
          }}
        >
          {loading ? "..." : "Ask"}
        </button>
      </div>

      {/* SUGGESTIONS */}
      {!response && !loading && (
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "14px" }}>
          {["Best sci-fi of 2024", "Short reads under 200 pages", "Books like Dune"].map(s => (
            <button
              key={s}
              onClick={() => { setQuestion(s); inputRef.current?.focus(); }}
              style={{
                background: "transparent", border: "1px solid #1e1e1e",
                borderRadius: "20px", padding: "6px 14px",
                fontSize: "12px", color: "#444", cursor: "pointer",
                transition: "color 0.15s, border-color 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.color = "#c9a96e"; e.currentTarget.style.borderColor = "#2a2a2a"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "#444"; e.currentTarget.style.borderColor = "#1e1e1e"; }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder { color: #333; }
      `}</style>
    </div>
  );
}

export default Ask;