import type { AnswerValue } from "../types";

type AnswerScaleProps = {
  groupLabel: string;
  selectedValue?: AnswerValue;
  leftLabel: string;
  rightLabel: string;
  onSelect: (value: AnswerValue) => void;
};

const values: AnswerValue[] = [1, 2, 3, 4, 5];

function getToneClass(value: AnswerValue) {
  if (value <= 2) {
    return "is-left";
  }

  if (value === 3) {
    return "is-center";
  }

  return "is-right";
}

export function AnswerScale({
  groupLabel,
  selectedValue,
  leftLabel,
  rightLabel,
  onSelect
}: AnswerScaleProps) {
  return (
    <div className="answer-scale">
      <div className="answer-scale__labels" aria-hidden="true">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
      <div
        className="answer-scale__buttons"
        role="radiogroup"
        aria-label={groupLabel}
      >
        {values.map((value) => {
          const isSelected = selectedValue === value;

          return (
            <button
              key={value}
              type="button"
              className={`answer-scale__button answer-scale__button--${value} ${getToneClass(
                value,
              )} ${isSelected ? "is-selected" : ""}`}
              role="radio"
              aria-checked={isSelected}
              aria-label={`${groupLabel} ${value}`}
              onClick={() => onSelect(value)}
            >
              <span aria-hidden="true">{isSelected ? "✓" : ""}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
