import { Link, useLocation } from "react-router-dom";

export default function Navigation() {
  const location = useLocation();

  const navStyle = {
    backgroundColor: "#282c34",
    padding: "1rem",
    marginBottom: "2rem",
  };

  const navContainerStyle = {
    display: "flex",
    gap: "1rem",
    justifyContent: "center",
  };

  const linkStyle = (isActive: boolean) => ({
    color: isActive ? "#61dafb" : "white",
    textDecoration: "none",
    fontWeight: isActive ? "bold" : "normal",
  });

  return (
    <nav style={navStyle}>
      <div style={navContainerStyle}>
        <Link to="/" style={linkStyle(location.pathname === "/")}>
          Головна
        </Link>
        <Link to="/users" style={linkStyle(location.pathname === "/users")}>
          Користувачі
        </Link>
        <Link to="/about" style={linkStyle(location.pathname === "/about")}>
          Про проект
        </Link>
      </div>
    </nav>
  );
}
