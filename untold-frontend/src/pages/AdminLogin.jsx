import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: 나중에 JWT 로그인으로 교체
    sessionStorage.setItem("isAdmin", "true");
    navigate("/admin/cases");
  };

  return (
    <div
      style={{ maxWidth: "320px", margin: "100px auto", textAlign: "center" }}
    >
      <h2>관리자 로그인</h2>
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
