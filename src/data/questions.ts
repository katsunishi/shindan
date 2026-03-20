import type { Dimension, Question } from "../types";

type DimensionConfig = {
  dimension: Dimension;
  leftLabel: string;
  rightLabel: string;
  texts: string[];
};

const dimensionConfigs: DimensionConfig[] = [
  {
    dimension: "EI",
    leftLabel: "熱量でつながる",
    rightLabel: "余韻を深める",
    texts: [
      "初めてのライブ会場では、周囲の高揚感に乗る方だ。",
      "好きな曲を見つけた直後は、誰かに共有したくなる。",
      "プレイリストを作るときは、聴く相手の反応を想像する。",
      "気分を上げたい日は、人が多い場所で音楽を聴きたくなる。",
      "音楽の魅力は、その場の空気を動かす力にあると思う。",
      "印象に残る楽曲は、一人で浸るより誰かと語りたい。",
      "新しいアーティストは、コミュニティの熱量から入ることが多い。",
      "お気に入りの一曲は、自分だけの秘密にしておくより薦めたい。",
      "音楽を選ぶとき、周囲との一体感をわりと重視する。"
    ]
  },
  {
    dimension: "SN",
    leftLabel: "身体で感じる",
    rightLabel: "物語を想像する",
    texts: [
      "曲を聴くとき、まずリズムや質感に反応する。",
      "一曲の印象は、細かな音色や温度感で決まることが多い。",
      "新譜を聴くと、メロディーより先に情景を思い浮かべる。",
      "歌詞を追うより、サウンドの手触りを味わう方が好きだ。",
      "良い音楽は、具体的な景色より抽象的な世界観を広げてくれる。",
      "ライブ映像を見ると、演出より音のディテールに耳が向く。",
      "お気に入りの曲は、説明しにくい感覚の一致で決まる。",
      "一つのフレーズから、曲全体のストーリーを想像することが多い。",
      "音楽には、今この瞬間の感覚を濃くする役割を求める。"
    ]
  },
  {
    dimension: "TF",
    leftLabel: "構造で捉える",
    rightLabel: "感情で受け取る",
    texts: [
      "好きな曲を語るとき、まず構成や展開の巧さに触れる。",
      "プレイリストは、気分よりも流れの整合性で並べたい。",
      "一曲を評価するとき、歌詞の意味より心の動きを優先する。",
      "アーティストを推す理由は、作品全体の設計の美しさにある。",
      "刺さる音楽には、理屈ではなく救われる感覚が必要だ。",
      "再生回数が伸びる曲の共通点を分析するのは嫌いではない。",
      "曲に惹かれる決め手は、共感できる感情の輪郭にある。",
      "アルバムを聴くと、意図やテーマの組み立てを考えたくなる。",
      "音楽の価値は、完成度よりも自分を動かしたかで決まる。"
    ]
  },
  {
    dimension: "JP",
    leftLabel: "決めて楽しむ",
    rightLabel: "流れで楽しむ",
    texts: [
      "ライブ前には、セトリ予想や聴く順番を決めておきたい。",
      "プレイリストは用途ごとに整理されている方が落ち着く。",
      "音楽との出会いは、偶然のおすすめから広がることが多い。",
      "アルバムは最初から最後まで順番に聴き切りたい。",
      "その日の気分で、何を聴くか直前に変えることが多い。",
      "推し活では、追うべき情報を自分なりに整理しておきたい。",
      "新しい曲を掘るときは、明確なテーマを決めずに漂うのが好きだ。",
      "再生リストには、自分なりのルールや完成形を求める。",
      "音楽時間は、予定に組み込むより気分の波に任せたい。"
    ]
  }
];

const questionOrder: Dimension[] = [
  "EI",
  "SN",
  "TF",
  "JP",
  "EI",
  "SN",
  "TF",
  "JP",
  "EI",
  "SN",
  "TF",
  "JP",
  "EI",
  "SN",
  "TF",
  "JP",
  "EI",
  "SN",
  "TF",
  "JP",
  "EI",
  "SN",
  "TF",
  "JP",
  "EI",
  "SN",
  "TF",
  "JP",
  "EI",
  "SN",
  "TF",
  "JP",
  "EI",
  "SN",
  "TF",
  "JP"
];

const configByDimension = Object.fromEntries(
  dimensionConfigs.map((config) => [config.dimension, config]),
) as Record<Dimension, DimensionConfig>;

const counters: Record<Dimension, number> = {
  EI: 0,
  SN: 0,
  TF: 0,
  JP: 0
};

export const questions: Question[] = questionOrder.map((dimension, index) => {
  const config = configByDimension[dimension];
  const textIndex = counters[dimension];
  counters[dimension] += 1;

  return {
    id: `Q${String(index + 1).padStart(2, "0")}`,
    text: config.texts[textIndex],
    dimension,
    leftLabel: config.leftLabel,
    rightLabel: config.rightLabel,
    weight: 1
  };
});
