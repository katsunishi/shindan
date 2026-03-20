import { NavLink } from "react-router-dom";
import { INSTAGRAM_URL } from "../data/results";

export function Header() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <NavLink to="/" className="site-header__brand">
          <span className="site-header__brand-mark">M</span>
          <span className="site-header__brand-text">Myu Music MBTI</span>
        </NavLink>
        <nav className="site-header__nav" aria-label="Primary">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `site-header__nav-link ${isActive ? "is-active" : ""}`
            }
          >
            音楽診断テスト
          </NavLink>
          <NavLink
            to="/types"
            className={({ isActive }) =>
              `site-header__nav-link ${isActive ? "is-active" : ""}`
            }
          >
            音楽タイプ
          </NavLink>
          <a
            className="site-header__nav-link"
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer"
          >
            インスタグラム
          </a>
        </nav>
      </div>
    </header>
  );
}
