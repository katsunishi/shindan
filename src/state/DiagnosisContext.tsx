import {
  createContext,
  useContext,
  useState,
  type PropsWithChildren
} from "react";
import { questions } from "../data/questions";
import { computeResultType, getAnsweredCount } from "../lib/diagnosis";
import type { AnswerMap, AnswerValue } from "../types";

type DiagnosisContextValue = {
  answers: AnswerMap;
  answeredCount: number;
  isComplete: boolean;
  selectAnswer: (questionId: string, value: AnswerValue) => void;
  resetAnswers: () => void;
  computeResult: () => string;
};

const DiagnosisContext = createContext<DiagnosisContextValue | null>(null);

export function DiagnosisProvider({ children }: PropsWithChildren) {
  const [answers, setAnswers] = useState<AnswerMap>({});
  const answeredCount = getAnsweredCount(answers);
  const isComplete = answeredCount === questions.length;

  const value: DiagnosisContextValue = {
    answers,
    answeredCount,
    isComplete,
    selectAnswer(questionId, value) {
      setAnswers((current) => ({
        ...current,
        [questionId]: value
      }));
    },
    resetAnswers() {
      setAnswers({});
    },
    computeResult() {
      return computeResultType(answers);
    }
  };

  return (
    <DiagnosisContext.Provider value={value}>
      {children}
    </DiagnosisContext.Provider>
  );
}

export function useDiagnosis() {
  const context = useContext(DiagnosisContext);

  if (!context) {
    throw new Error("useDiagnosis must be used within a DiagnosisProvider");
  }

  return context;
}
