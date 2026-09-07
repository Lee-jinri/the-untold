import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../api/adminApi";

function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const { token } = await adminLogin(password);
      sessionStorage.setItem("adminToken", token);
      navigate("/admin/cases");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      style={{ maxWidth: "320px", margin: "100px auto", textAlign: "center" }}
    >
      <h2>관리자 로그인</h2>
      {error && <p style={{ color: "var(--amber)" }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ marginTop: "24px" }}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
            color: "var(--text-primary)",
            marginBottom: "16px",
          }}
        />
        <button type="submit" style={{ width: "100%" }}>
          로그인
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;
