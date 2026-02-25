import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../../api";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    width: 100%;
    height: 100%;
  }

  .dashboard-page {
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

  .dashboard-card {
    background: #fff;
    /* card fills whole screen */
    width: 100vw;
    height: 100vh;
    padding: 48px 44px;
    border: none;
    color: #000; /* ensure text is black */
  }

  .dashboard-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 24px;
    font-size: 14px;
  }

  .dashboard-table th,
  .dashboard-table td {
    border: 1px solid #D8D3C8;
    padding: 12px 16px;
    text-align: left;
  }

  .dashboard-table th {
    background: #F0F0F0;
    font-weight: 500;
  }

  .pagination {
    margin-top: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
  }
  .pagination button {
    padding: 6px 12px;
    background: #1A1713;
    color: #F5F2EC;
    border: none;
    cursor: pointer;
  }
  .pagination button:disabled {
    background: #B8B3A8;
    cursor: not-allowed;
  }
`;

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const fetchProfile = () => {
    const token = localStorage.getItem("token");
    API.get("/user/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setUser(
          res.data.user || { username: localStorage.getItem("username") },
        );
      })
      .catch((err) => {
        console.error(err);
        alert("Tidak terotorisasi atau error saat mengambil profil");
      });
  };

  const fetchUsers = (p = 1) => {
    const token = localStorage.getItem("token");
    API.get(`/user/list?page=${p}&limit=${limit}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setUsers(res.data.users);
        setTotal(res.data.total);
      })
      .catch((err) => {
        console.error(err);
        alert("Gagal mengambil daftar user");
      });
  };

  useEffect(() => {
    fetchProfile();
    fetchUsers(page);
  }, [page]);

  const totalPages = Math.ceil(total / limit);

  if (!user) {
    return <h1>Memuat...</h1>;
  }

  return (
    <>
      <style>{styles}</style>
      <div className="dashboard-page">
        <div className="dashboard-card">
          <h1 style={{ color: "#000" }}>Welcome, {user.username}!</h1>
          <button
            style={{
              marginTop: "8px",
              padding: "6px 12px",
              background: "#1A1713",
              color: "#F5F2EC",
              border: "none",
              cursor: "pointer",
            }}
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("username");
              navigate("/login");
            }}
          >
            Logout
          </button>

          <h2>List Account</h2>
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u._id}</td>
                  <td>{u.username}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Prev
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
