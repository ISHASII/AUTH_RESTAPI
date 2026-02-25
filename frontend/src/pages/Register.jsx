import { useState } from "react";
import { Link } from "react-router-dom";
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

  .auth-success {
    background: #F0FFF4;
    border: 1px solid #A8D5B5;
    color: #2E7D50;
    font-size: 13px;
    padding: 10px 14px;
    margin-bottom: 20px;
  }
`;

export default function Register() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/auth/register", form);
      setSuccess(true);
      setForm({ username: "", password: "" });
    } catch (err) {
      alert("Registrasi gagal. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="auth-page">
        <div className="auth-card">
          <h1 className="auth-brand">Register</h1>
          <p className="auth-subtitle">Create Account</p>

          {success && <div className="auth-success">Registrasi Success!.</div>}

          <form onSubmit={submit}>
            <div className="auth-field">
              <label className="auth-label">Username</label>
              <input
                className="auth-input"
                placeholder="Enter Username"
                autoComplete="username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
            </div>
            <div className="auth-field">
              <label className="auth-label">Password</label>
              <input
                type="password"
                className="auth-input"
                placeholder="Create Password"
                autoComplete="new-password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            <button className="auth-btn" disabled={loading}>
              {loading ? "Memproses..." : "Register"}
            </button>
          </form>

          <div className="auth-footer">
            Have Account? <Link to="/login">Login Here!</Link>
          </div>
        </div>
      </div>
    </>
  );
}
