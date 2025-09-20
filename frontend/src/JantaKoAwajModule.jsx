import React, { useEffect, useState } from "react";
import './JantaKoAwaj.css';


export default function JantaKoAwajModule({ userId }) {
  const [ideas, setIdeas] = useState([]);
  const [newIdea, setNewIdea] = useState("");
  const [topIdeas, setTopIdeas] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchIdeas();
    fetchTopIdeas();
  }, [userId]);

  async function fetchIdeas() {
    try {
      const url = userId ? `http://localhost:5000/api/ideas?user_id=${userId}` : "http://localhost:5000/api/ideas";
      const res = await fetch(url);
      const data = await res.json();
      setIdeas(data);
    } catch {
      setError("Failed to fetch ideas.");
    }
  }

  async function fetchTopIdeas() {
    try {
      const res = await fetch("http://localhost:5000/api/ideas/top");
      const data = await res.json();
      setTopIdeas(data);
    } catch {
      setError("Failed to fetch top ideas.");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (newIdea.trim() === "") return;

    try {
      const res = await fetch("http://localhost:5000/api/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newIdea }),
      });

      if (res.ok) {
        setNewIdea("");
        fetchIdeas();
        fetchTopIdeas();
      } else {
        setError("Failed to add idea.");
      }
    } catch {
      setError("Failed to add idea.");
    }
  }

  async function submitVote(ideaId, action) {
    try {
      const res = await fetch(`http://localhost:5000/api/ideas/${ideaId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          user_id: userId,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        fetchIdeas();
        fetchTopIdeas();
        setError(null);
      } else {
        const data = await res.json();
        setError(data.error || "Vote failed");
      }
    } catch {
      setError("Vote failed due to network error.");
    }
  }

  return (
    <div className="janta-container">
      <h4>Top Concerns</h4>
      <div className="janta-top-concerns">
        <ol>
          {topIdeas.map((idea) => (
            <li key={idea.id}>{idea.text}</li>
          ))}
        </ol>
      </div>

      <form className="janta-idea-form" onSubmit={handleSubmit}>
        <textarea
          placeholder="Write your concern here..."
          value={newIdea}
          onChange={(e) => setNewIdea(e.target.value)}
        />
        <button type="submit">Add Concern</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul className="janta-ideas-list">
        {ideas.map((idea) => (
          <li key={idea.id}>
            <p>{idea.text}</p>
            <button
              className={`upvote-btn ${idea.user_vote === 'up' ? 'voted' : ''}`}
              onClick={() => submitVote(idea.id, "up")}
              disabled={idea.user_vote === 'up'}
            >
              {idea.user_vote === 'up' ? '✓ ' : ''}Upvote ({idea.up})
            </button>
            <button
              className={`downvote-btn ${idea.user_vote === 'down' ? 'voted' : ''}`}
              onClick={() => submitVote(idea.id, "down")}
              disabled={idea.user_vote === 'down'}
            >
              {idea.user_vote === 'down' ? '✓ ' : ''}Downvote ({idea.down})
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
