const introSteps = [
  {
    step: "ステップ 1",
    title: "質問に答える",
    description:
      "音楽の聴き方や惹かれやすい雰囲気について、直感で答えてください。深く考えすぎず、今の感覚に近いものを選ぶのがコツです。",
    tone: "blue",
    mark: "♪"
  },
  {
    step: "ステップ 2",
    title: "結果を受け取る",
    description:
      "回答がそろうと、あなたの音楽タイプが表示されます。タイプごとの価値観や惹かれやすい魅力を、文章でざっくり整理して見られます。",
    tone: "green",
    mark: "◆"
  },
  {
    step: "ステップ 3",
    title: "おすすめを知る",
    description:
      "診断結果では、タイプの傾向に加えておすすめアーティストも確認できます。気になったらそのまま次の音楽との出会いにつなげてください。",
    tone: "purple",
    mark: "✦"
  }
];

export function AxisOverview() {
  return (
    <section className="axis-overview" aria-label="Diagnosis overview">
      <header className="axis-overview__header">
        <div className="axis-overview__logo" aria-label="Myu logo">
          <span className="axis-overview__logo-mark">M</span>
        </div>
        <h1>直感で、あなたの音楽タイプを見つける。</h1>
        <p className="axis-overview__title">音楽タイプ診断</p>
      </header>
      <div className="axis-overview__grid">
        {introSteps.map((item) => (
          <article
            key={item.step}
            className={`axis-overview__card axis-overview__card--${item.tone}`}
          >
            <div className="axis-overview__art" aria-hidden="true">
              <span>{item.mark}</span>
            </div>
            <p className="axis-overview__step">{item.step}</p>
            <h2>{item.title}</h2>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
