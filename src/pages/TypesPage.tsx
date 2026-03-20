import { Link } from "react-router-dom";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { resultProfiles } from "../data/results";

export function TypesPage() {
  return (
    <main className="page-shell">
      <Header />
      <section className="panel">
        <div className="types-page">
          <header className="types-page__header">
            <h1>音楽タイプ一覧</h1>
            <p>
              16タイプのダミー結果を一覧で確認できます。気になるタイプがあれば
              結果ページの雰囲気をそのまま先に見ることもできます。
            </p>
          </header>
          <div className="types-page__grid">
            {resultProfiles.map((profile) => (
              <article key={profile.type} className="types-page__card">
                <p className="types-page__type">{profile.type}</p>
                <h2>{profile.label}</h2>
                <p className="types-page__tagline">{profile.tagline}</p>
                <Link to={`/result/${profile.type}`} className="secondary-button">
                  このタイプを見る
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
