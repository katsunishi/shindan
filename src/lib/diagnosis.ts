import { questions } from "../data/questions";
import type { AnswerMap, AnswerValue, Dimension } from "../types";

const dimensionLetters: Record<Dimension, [string, string]> = {
  EI: ["E", "I"],
  SN: ["S", "N"],
  TF: ["T", "F"],
  JP: ["J", "P"]
};

export function normalizeAnswer(value: AnswerValue) {
  return value - 3;
}

export function getAnsweredCount(answers: AnswerMap) {
  return Object.keys(answers).length;
}

export function getMissingQuestionIds(answers: AnswerMap) {
  return questions
    .filter((question) => answers[question.id] === undefined)
    .map((question) => question.id);
}

export function computeDimensionScores(answers: AnswerMap) {
  const scores: Record<Dimension, number> = {
    EI: 0,
    SN: 0,
    TF: 0,
    JP: 0
  };

  for (const question of questions) {
    const answer = answers[question.id];

    if (answer === undefined) {
      continue;
    }

    scores[question.dimension] += normalizeAnswer(answer) * question.weight;
  }

  return scores;
}

export function computeResultType(answers: AnswerMap) {
  const scores = computeDimensionScores(answers);

  return (Object.entries(dimensionLetters) as [Dimension, [string, string]][])
    .map(([dimension, [left, right]]) =>
      scores[dimension] >= 0 ? right : left,
    )
    .join("");
}
