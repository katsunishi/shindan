import { Link, Navigate, useParams } from "react-router-dom";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { ResultHero } from "../components/ResultHero";
import { INSTAGRAM_URL, resultProfilesByType } from "../data/results";
import { useDiagnosis } from "../state/DiagnosisContext";

export function ResultPage() {
  const { type } = useParams();
  const { resetAnswers } = useDiagnosis();

  if (!type || !resultProfilesByType[type]) {
    return <Navigate to="/" replace />;
  }

  const profile = resultProfilesByType[type];

  return (
    <main className="page-shell">
      <Header />
      <div className="page-shell__glow page-shell__glow--left" aria-hidden="true" />
      <div className="page-shell__glow page-shell__glow--right" aria-hidden="true" />
      <section className="panel panel--result">
        <ResultHero profile={profile} />
        <div className="result-actions">
          <a
            className="primary-button"
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer"
          >
            詳細な説明を見る
          </a>
          <button
            type="button"
            className="secondary-button"
          >
            シェアする
          </button>
          <Link
            to="/"
            className="secondary-button"
            onClick={() => resetAnswers()}
          >
            もう一度診断する
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  );
}
