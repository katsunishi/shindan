export type Dimension = "EI" | "SN" | "TF" | "JP";

export type Question = {
  id: string;
  text: string;
  dimension: Dimension;
  leftLabel: string;
  rightLabel: string;
  weight: number;
};

export type AnswerValue = 1 | 2 | 3 | 4 | 5;

export type AnswerMap = Record<string, AnswerValue>;

export type ResultProfile = {
  type: string;
  label: string;
  tagline: string;
  description: string;
  imagePath: string;
};
