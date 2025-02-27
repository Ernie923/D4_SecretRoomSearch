import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const navbar = [
  { path: "/", name: "找遊戲" }, //path先亂填，後續再補
  { path: "/1", name: "揪團去" },
];

const userBtn = [
  { path: "/", name: "會員管理" }, //path先亂填，後續再補
  { path: "/2", name: "密室管理" },
  { path: "/3", name: "揪團資料" },
];

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const [user, setUser] = useState(null);
  const userId = 11;

  const getUser = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/usersData/${userId}`);
      setUser(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <>
      {isLoggedIn ? (
        <nav className="navbar navbar-expand-lg w-100 bg-primary-99 position-fixed top-0 start-0 d-lg-flex justify-content-between">
          <div className="nav-box container d-lg-none d-flex flex-row justify-content-between align-items-center">
            <button
              className="navbar-toggler border-0 p-0"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <Link className="navbar-brand m-0 d-inline" to="/">
              <img src="src/images/logo/Logo-Type-sm.svg" alt="logo" />
            </Link>
          </div>
          <div className="container px-0 px-lg-3">
            <div
              className="collapse navbar-collapse d-lg-flex justify-content-between"
              id="navbarSupportedContent"
            >
              <Link className="m-0 d-none d-lg-inline" to="/">
                <img src="src/images/logo/Logo-Type.svg" alt="logo-lg" />
              </Link>
              <ul className="navbar-nav text-center gap-lg-10 bg-primary-99 align-items-center">
                {navbar.map((routes) => (
                  <li className="nav-item" key={routes.path}>
                    <NavLink
                      className="nav-link nav-link-bg px-0 py-4 fs-h6 fw-bold d-none d-lg-block"
                      aria-current="page"
                      to={routes.path}
                    >
                      {routes.name}
                    </NavLink>
                  </li>
                ))}
                <li className="nav-item bg-Secondary-99">
                  <NavLink
                    className="dropdown-toggle nav-link nav-link-bg px-0 py-4 fs-h6 fw-bold"
                    id="dropdownMenuLink"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {user?.user_name}
                  </NavLink>
                  <ul
                    className="dropdown-menu dropdown-menu-end bg-primary-99 text-center align-items-center"
                    aria-labelledby="dropdownMenuLink"
                  >
                    {userBtn.map((routes) => (
                      <li key={routes.path}>
                        <NavLink
                          className="dropdown-item nav-link px-0 py-4 fs-h6 fw-bold"
                          aria-current="page"
                          to={routes.path}
                        >
                          {routes.name}
                        </NavLink>
                      </li>
                    ))}
                    <button
                      onClick={handleLogout}
                      className="dropdown-item nav-link px-0 py-4 fs-h6 fw-bold"
                    >
                      登出
                    </button>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      ) : (
        <nav className="navbar navbar-expand-lg w-100 bg-primary-99 position-fixed top-0 start-0 d-lg-flex justify-content-between">
          <div className="nav-box container d-lg-none d-flex flex-row justify-content-between align-items-center">
            <button
              className="navbar-toggler border-0 p-0"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <Link className="navbar-brand m-0 d-inline" to="/">
              <img src="src/images/logo/Logo-Type-sm.svg" alt="logo" />
            </Link>
          </div>
          <div className="container px-0 px-lg-3">
            <div
              className="collapse navbar-collapse d-lg-flex justify-content-between"
              id="navbarSupportedContent"
            >
              <Link className="m-0 d-none d-lg-inline" to="/">
                <img src="src/images/logo/Logo-Type.svg" alt="logo-lg" />
              </Link>
              <ul className="navbar-nav text-center gap-lg-10 bg-primary-99 align-items-center">
                {navbar.map((routes) => (
                  <li className="nav-item" key={routes.path}>
                    <NavLink
                      className="nav-link nav-link-bg px-0 py-4 fs-h6 fw-bold"
                      aria-current="page"
                      to={routes.path}
                    >
                      {routes.name}
                    </NavLink>
                  </li>
                ))}
                <li className="nav-item">
                  <a
                    className="nav-link nav-link-bg px-0 py-4 fs-h6 fw-bold"
                    href="#"
                    onClick={handleLogin}
                  >
                    登入
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link nav-link-bg px-0 py-4 fs-h6 fw-bold"
                    href="#"
                  >
                    註冊
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      )}
    </>
  );
}
export default Header;
