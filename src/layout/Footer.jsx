import { NavLink } from "react-router-dom";

function Footer() {
  return (
    <>
      <footer className="footer bg-nature-20">
        <div className="container">
          <div className="d-flex flex-lg-row flex-column-reverse justify-content-between py-8">
            <div className="d-flex flex-column align-items-center align-items-lg-start px-0">
              <NavLink to="/">
                <img
                  src="src/images/logo/Logo-Type.svg"
                  alt="logo"
                  className="mb-10 mb-lg-3"
                />
              </NavLink>
              <p className="text-white fs-Caption m-0">
                Cpyright@ 2024 密室搜搜 -All Right Reserved
              </p>
            </div>
            <ul className="d-flex flex-lg-row flex-column justify-content-lg-end gap-6 p-0 mb-10 mb-lg-0">
              <li className="text-center px-lg-10 px-xl-15">
                <h6 className="text-white fs-h6 mb-6">主要功能</h6>
                <div className="fw-bold">
                  <NavLink
                    href="search.html"
                    className="mb-3 link-white fs-Body-2"
                  >
                    找遊戲
                  </NavLink>
                  <NavLink href="#" className="link-white fs-Body-2">
                    揪團去
                  </NavLink>
                </div>
              </li>
              <li className="text-center px-lg-10 px-xl-15">
                <h6 className="text-white fs-h6 mb-6">關於密室搜搜</h6>
                <div className="fw-bold">
                  <NavLink
                    href="about.html#about-us"
                    className="mb-3 link-white fs-Body-2"
                  >
                    關於密室搜搜
                  </NavLink>
                  <NavLink
                    href="about.html#terms-of-service"
                    className="mb-3 link-white fs-Body-2"
                  >
                    服務條款
                  </NavLink>
                  <NavLink
                    href="about.html#privacy-policy"
                    className="link-white fs-Body-2"
                  >
                    隱私權政策
                  </NavLink>
                </div>
              </li>
              <li className="text-center px-lg-10 px-xl-15">
                <h6 className="text-white fs-h6 mb-6">追蹤我們</h6>
                <div className="d-flex justify-content-center gap-2">
                  <a href="https://www.facebook.com/">
                    <img
                      className="social_icon"
                      src="src/images/icon/fb.svg"
                      alt="fb"
                    />
                  </a>
                  <a href="https://www.instagram.com/">
                    <img
                      className="social_icon"
                      src="src/images/icon/ig.png"
                      alt="ig"
                    />
                  </a>
                  <a href="https://workspace.google.com/intl/zh-TW/products/gmail/">
                    <img
                      className="social_icon"
                      src="src/images/icon/email.png"
                      alt="mail"
                    />
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
