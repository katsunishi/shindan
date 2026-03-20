import type { ResultProfile } from "../types";
import { RecommendedTracks } from "./RecommendedTracks";

type ResultHeroProps = {
  profile: ResultProfile;
};

export function ResultHero({ profile }: ResultHeroProps) {
  const paragraphs = profile.description.split("\n\n");
  const midpoint = Math.ceil(paragraphs.length / 2);
  const firstSection = paragraphs.slice(0, midpoint).join("\n\n");
  const secondSection = paragraphs.slice(midpoint).join("\n\n");

  return (
    <section className="result-hero">
      <div className="result-hero__visual">
        <img src={profile.imagePath} alt={`${profile.type} のイメージ`} />
        <div className="result-hero__stamp">{profile.type}</div>
      </div>
      <header className="result-hero__header">
        <h1>{profile.label}</h1>
        <p className="result-hero__type">{profile.type}</p>
      </header>
      <div className="result-hero__divider" aria-hidden="true" />
      <section className="result-hero__quote-block">
        <p className="result-hero__quote">{profile.tagline}</p>
        <p className="result-hero__quote-author">Myu Music MBTI</p>
      </section>
      <div className="result-hero__description">{firstSection}</div>
      <section className="result-hero__subsection">
        <h2>やりがいのある挑戦</h2>
        <div className="result-hero__description">{secondSection}</div>
      </section>
      <RecommendedTracks />
    </section>
  );
}
