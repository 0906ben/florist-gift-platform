import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";

const storeNavItems = [
  { to: "/", label: "首頁" },
  { to: "/catalog", label: "花禮選品" },
  { to: "/profiles", label: "她的檔案" }
];

const adminNavItems = [
  { to: "/admin", label: "儀表板", end: true },
  { to: "/admin/products", label: "商品管理" },
  { to: "/admin/orders", label: "訂單管理" },
  { to: "/admin/profiles", label: "檔案總覽" }
];

export function StoreLayout() {
  const { itemCount } = useCart();
  const location = useLocation();
  const [isNavOpen, setIsNavOpen] = useState(false);

  useEffect(() => {
    setIsNavOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 960) {
        setIsNavOpen(false);
      }
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="app-shell">
      <div className="announcement-bar">
        <span>Seasonal Floral Delivery</span>
        <p>指定日期配送、手寫卡片與精緻包裝服務</p>
      </div>

      <header className={`site-header ${isNavOpen ? "site-header--nav-open" : ""}`}>
        <div className="site-header__top">
          <Link className="brand-mark" to="/">
            <span className="brand-mark__badge">LB</span>
            <div>
              <strong>Lazy Bloom</strong>
              <span>Floral House</span>
            </div>
          </Link>

          <button
            className="nav-toggle"
            type="button"
            onClick={() => setIsNavOpen((current) => !current)}
            aria-expanded={isNavOpen}
            aria-controls="store-navigation"
          >
            {isNavOpen ? "收合選單" : "展開選單"}
          </button>
        </div>

        <nav
          id="store-navigation"
          className={`site-nav ${isNavOpen ? "site-nav--open" : ""}`}
        >
          {storeNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? "active" : "")}
              end={item.to === "/"}
            >
              {item.label}
            </NavLink>
          ))}
          <NavLink className="cart-pill" to="/cart">
            購物袋 {itemCount > 0 ? `(${itemCount})` : ""}
          </NavLink>
        </nav>
      </header>

      <main className="page-content">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="site-footer__grid">
          <div className="site-footer__brand">
            <strong>Lazy Bloom</strong>
            <p>為值得被記住的時刻，整理出更好挑選、更好送出的花禮系列。</p>
          </div>

          <div>
            <span className="site-footer__title">Explore</span>
            <Link to="/catalog">花禮選品</Link>
            <Link to="/profiles">她的檔案</Link>
            <Link to="/cart">購物袋</Link>
          </div>

          <div>
            <span className="site-footer__title">Service</span>
            <p>指定日期配送</p>
            <p>手寫卡片服務</p>
            <p>精裝包裝加購</p>
          </div>

          <div>
            <span className="site-footer__title">Note</span>
            <p>鮮花作品依花況微調，會保留整體色系與質感。</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function AdminLayout() {
  const location = useLocation();
  const [isNavOpen, setIsNavOpen] = useState(false);

  useEffect(() => {
    setIsNavOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 960) {
        setIsNavOpen(false);
      }
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__top">
          <Link className="brand-mark brand-mark--admin" to="/">
            <span className="brand-mark__badge">LB</span>
            <div>
              <strong>Lazy Bloom Ops</strong>
              <span>模擬後台工作台</span>
            </div>
          </Link>

          <button
            className="nav-toggle"
            type="button"
            onClick={() => setIsNavOpen((current) => !current)}
            aria-expanded={isNavOpen}
            aria-controls="admin-navigation"
          >
            {isNavOpen ? "收合後台選單" : "展開後台選單"}
          </button>
        </div>

        <nav
          id="admin-navigation"
          className={`admin-nav ${isNavOpen ? "admin-nav--open" : ""}`}
        >
          {adminNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <section className="admin-main">
        <div className="admin-topbar">
          <p>後台重點已完成商品新增、商品編輯、訂單檢視與檔案管理。</p>
          <Link className="ghost-link" to="/">
            返回前台
          </Link>
        </div>
        <Outlet />
      </section>
    </div>
  );
}
