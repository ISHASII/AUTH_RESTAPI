import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API } from "../../api";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500&display=swap');

  .auth-page {
    min-height: 100vh;
    width: 100vw;
    background-color: #F5F2EC;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'DM Sans', sans-serif;
    padding: 20px;
    position: relative;
  }

  .auth-card {
    background: #fff;
    width: 100%;
    max-width: 400px;
    padding: 48px 44px;
    border: 1px solid #D8D3C8;
  }

  .auth-brand {
    font-family: 'DM Serif Display', serif;
    font-size: 28px;
    color: #1A1713;
    letter-spacing: -0.5px;
    margin-bottom: 6px;
  }

  .auth-subtitle {
    font-size: 13px;
    color: #8C8780;
    font-weight: 300;
    margin-bottom: 36px;
    letter-spacing: 0.02em;
  }

  .auth-label {
    display: block;
    font-size: 11px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #5C5852;
    margin-bottom: 8px;
  }

  .auth-field {
    margin-bottom: 20px;
  }

  .auth-input {
    width: 100%;
    padding: 12px 14px;
    border: 1px solid #D8D3C8;
    background: #F5F2EC;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: #1A1713;
    outline: none;
    transition: border-color 0.15s ease;
    box-sizing: border-box;
  }

  .auth-input:focus {
    border-color: #1A1713;
    background: #fff;
  }

  .auth-input::placeholder {
    color: #B8B3A8;
  }

  .auth-btn {
    width: 100%;
    padding: 14px;
    background: #1A1713;
    color: #F5F2EC;
    border: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    cursor: pointer;
    margin-top: 8px;
    transition: background 0.15s ease;
  }

  .auth-btn:hover {
    background: #2E2A25;
  }

  .auth-btn:disabled {
    background: #B8B3A8;
    cursor: not-allowed;
  }

  .auth-footer {
    margin-top: 24px;
    font-size: 13px;
    color: #8C8780;
    text-align: center;
  }

  .auth-footer a {
    color: #1A1713;
    font-weight: 500;
    text-decoration: none;
    border-bottom: 1px solid #1A1713;
  }

  .auth-error {
    background: #FFF0F0;
    border: 1px solid #F5C0C0;
    color: #B84444;
    font-size: 13px;
    padding: 10px 14px;
    margin-bottom: 20px;
  }
`;

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.user.username);
      alert("Login berhasil!");
      navigate("/dashboard");
    } catch (err) {
      setError("Username atau password salah.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="auth-page">
        <div className="auth-card">
          <h1 className="auth-brand">LOGIN</h1>
          <p className="auth-subtitle">WELCOME BACK</p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={submit}>
            <div className="auth-field">
              <label className="auth-label">Username</label>
              <input
                className="auth-input"
                placeholder="enter username"
                autoComplete="username"
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
            </div>
            <div className="auth-field">
              <label className="auth-label">Password</label>
              <input
                type="password"
                className="auth-input"
                placeholder="Enter password"
                autoComplete="current-password"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            <button className="auth-btn" disabled={loading}>
              {loading ? "Memproses..." : "Login"}
            </button>
          </form>

          <div className="auth-footer">
            Don't have an account? <Link to="/register">Register</Link>
          </div>
        </div>
      </div>
    </>
  );
}
