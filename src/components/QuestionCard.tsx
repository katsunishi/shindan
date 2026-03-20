import { AnswerScale } from "./AnswerScale";
import type { AnswerValue, Question } from "../types";

type QuestionCardProps = {
  question: Question;
  selectedValue?: AnswerValue;
  index: number;
  onSelect: (value: AnswerValue) => void;
};

export function QuestionCard({
  question,
  selectedValue,
  index,
  onSelect
}: QuestionCardProps) {
  return (
    <article className="question-card">
      <div className="question-card__meta">
        <span className="question-card__number">Q{String(index + 1).padStart(2, "0")}</span>
      </div>
      <h2 className="question-card__title">{question.text}</h2>
      <AnswerScale
        groupLabel={question.text}
        selectedValue={selectedValue}
        leftLabel={question.leftLabel}
        rightLabel={question.rightLabel}
        onSelect={onSelect}
      />
    </article>
  );
}
