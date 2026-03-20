const recommendedArtists = [
  { icon: "L", name: "Luna Harbor" },
  { icon: "N", name: "Neon Vale" },
  { icon: "S", name: "Silent Motel" },
  { icon: "A", name: "Amber Loop" }
];

export function RecommendedTracks() {
  return (
    <section className="recommended-tracks">
      <h2>あなたにおすすめする曲</h2>
      <div className="recommended-tracks__list">
        {recommendedArtists.map((artist) => (
          <div key={artist.name} className="recommended-tracks__item">
            <div className="recommended-tracks__icon" aria-hidden="true">
              <span>{artist.icon}</span>
            </div>
            <p>{artist.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
