import React, { useContext,useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CompanyContext } from "../context/CompanyContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const navigate = useNavigate();
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const { company, loading } = useContext(CompanyContext);  // ✅ get company data

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    closeMenu();
    navigate("/login"); // Redirect to login page after logout
    window.location.reload(); // Reload the page to clear any session state
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/vendorledger", label: "Vendors Account Ledgers" },
    { href: "/add-payment", label: "Add Client Payment" },
    { href: "/ledger", label: "Client Account Ledgers" },
    { href: "/manageclientbalances", label: "Clients Outstanding Report" },
    { href: "/additem", label: "Add Item" },
    { href: "/addsale", label: "Add Sale" },
    { href: "/addclient", label: "Add Client" },
    { href: "/Sales", label: "Sales" },
    { href: "/vendors", label: "Manage Vendors" },
    { href: "/company", label: "Customize Company" },
    { href: "/getCollections", label: "Collections" },
  ];

  return (
    <>
      <style>{`
        body {
          background: linear-gradient(135deg, #0f172a 0%, #1453e7ff 50%, #0f172a 100%);
          min-height: 100vh;
          margin: 0;
          padding: 0;
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        .navbar-link:hover {
          color: #ffffff !important;
          background: linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(168, 85, 247, 0.2)) !important;
          transform: translateY(-2px);
        }
        .logout-btn:hover {
          background: linear-gradient(135deg, #dc2626, #db2777) !important;
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4) !important;
        }
        .mobile-nav-link:hover {
          color: #ffffff !important;
          background: linear-gradient(90deg, rgba(0, 212, 255, 0.1), rgba(168, 85, 247, 0.1)) !important;
        }
        .mobile-logout:hover {
          background: linear-gradient(135deg, #dc2626, #db2777) !important;
        }
        .hamburger-line {
          transform-origin: center;
          background: #bbb;
          border-radius: 4px;
          height: 3px;
          width: 28px;
          transition: all 0.3s ease;
        }
        .hamburger-line.open-top {
          transform: rotate(45deg) translateY(8px);
        }
        .hamburger-line.open-middle {
          opacity: 0;
        }
        .hamburger-line.open-bottom {
          transform: rotate(-45deg) translateY(-8px);
        }
        .mobile-menu {
          transition: max-height 0.3s ease, opacity 0.3s ease;
          overflow: hidden;
          max-height: 0;
          opacity: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-radius: 0 0 16px 16px;
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          z-index: 9;
        }
        .mobile-menu.open {
          max-height: 600px;
          opacity: 1;
        }
        @media (max-width: 768px) {
          .navbar-container {
            padding: 12px 16px !important;
          }
          .logo-text {
            font-size: 20px !important;
          }
          .rocket {
            font-size: 20px !important;
          }
        }
        @media (max-width: 480px) {
          .navbar {
            margin: 8px !important;
          }
          .logo-text {
            font-size: 18px !important;
          }
          .mobile-nav-link {
            font-size: 14px !important;
            padding: 10px 20px !important;
          }
        }
      `}</style>

      <nav style={navbarStyle}>
        <div className="navbar-container" style={navbarContainerStyle}>
          <div style={logoStyle}>
            <span className="rocket" style={rocketStyle}>
              🚀
            </span>
            <span className="logo-text" style={logoTextStyle}>
             {company
          ? `${company.name}`
          : "ERP Systems"}
            </span>
          </div>

          {/* Desktop Nav */}
          <ul style={{ ...navLinksStyle, display: isMobile ? "none" : "flex" }}>
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <a href={href} className="navbar-link" style={linkStyle}>
                  {label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="/login"
                className="logout-btn"
                style={logoutStyle}
                onClick={(e) => {
                  e.preventDefault();
                  handleLogout();
                }}
              >
                Logout
              </a>
            </li>
          </ul>

          {/* Hamburger Button */}
          <button
            onClick={toggleMenu}
            aria-label="Toggle menu"
            style={{
              ...hamburgerStyle,
              display: isMobile ? "flex" : "none", // control visibility here only
            }}
          >
            <div className={`hamburger-line ${isMenuOpen ? "open-top" : ""}`}></div>
            <div className={`hamburger-line ${isMenuOpen ? "open-middle" : ""}`}></div>
            <div className={`hamburger-line ${isMenuOpen ? "open-bottom" : ""}`}></div>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobile && (
          <div className={`mobile-menu ${isMenuOpen ? "open" : ""}`} style={mobileMenuStyle}>
            <ul style={mobileNavLinksStyle}>
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="mobile-nav-link"
                    style={mobileNavLinkStyle}
                    onClick={closeMenu}
                  >
                    {label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="/login"
                  className="mobile-logout"
                  style={mobileLogoutStyle}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLogout();
                  }}
                >
                  Logout
                </a>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </>
  );
};

// Styles (no changes here except hamburgerStyle)
const navbarStyle = {
  background: "rgba(0, 0, 0, 0.2)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  borderRadius: "16px",
  margin: "16px",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
  position: "relative",
  overflow: "visible",
};

const navbarContainerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "16px 24px",
  width: "100%",
};

const logoStyle = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

const rocketStyle = {
  fontSize: "24px",
  animation: "pulse 2s infinite",
};

const logoTextStyle = {
  fontSize: "24px",
  fontWeight: "700",
  background: "linear-gradient(135deg, #00d4ff, #a855f7)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};

const navLinksStyle = {
  listStyle: "none",
  gap: "24px",
  margin: 0,
  padding: 0,
  alignItems: "center",
  display: "flex",
};

const linkStyle = {
  textDecoration: "none",
  color: "#bbb",
  fontWeight: "600",
  fontSize: "16px",
  padding: "8px 12px",
  borderRadius: "8px",
  transition: "all 0.3s ease",
  display: "inline-block",
};

const logoutStyle = {
  ...linkStyle,
  background: "linear-gradient(135deg, #ef4444, #db2777)",
  color: "#fff",
  boxShadow: "0 4px 15px rgba(239, 68, 68, 0.3)",
  fontWeight: "700",
};

const hamburgerStyle = {
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: "6px",
  border: "none",
  background: "none",
  cursor: "pointer",
  padding: 0,
  width: "40px",
  height: "40px",
  position: "relative",
  zIndex: 10,
};

const mobileMenuStyle = {
  padding: "12px 0",
  position: "absolute",
  top: "100%",
  left: 0,
  right: 0,
  background: "rgba(0, 0, 0, 0.6)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  borderRadius: "0 0 16px 16px",
  boxShadow: "0 6px 20px rgba(0, 0, 0, 0.4)",
  zIndex: 9,
};

const mobileNavLinksStyle = {
  listStyle: "none",
  padding: 0,
  margin: 0,
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  alignItems: "center",
};

const mobileNavLinkStyle = {
  ...linkStyle,
  fontSize: "16px",
  padding: "12px 24px",
  display: "block",
  width: "100%",
  textAlign: "center",
  color: "#ccc",
};

const mobileLogoutStyle = {
  ...mobileNavLinkStyle,
  background: "linear-gradient(135deg, #ef4444, #db2777)",
  color: "#fff",
  fontWeight: "700",
};

export default Navbar;
