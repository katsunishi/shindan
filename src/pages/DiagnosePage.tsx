import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AxisOverview } from "../components/AxisOverview";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { QuestionCard } from "../components/QuestionCard";
import { questions } from "../data/questions";
import { resultProfiles } from "../data/results";
import { getMissingQuestionIds } from "../lib/diagnosis";
import { useDiagnosis } from "../state/DiagnosisContext";

const QUESTIONS_PER_PAGE = 9;
const TOTAL_PAGES = Math.ceil(questions.length / QUESTIONS_PER_PAGE);

export function DiagnosePage() {
  const navigate = useNavigate();
  const { answers, isComplete, selectAnswer, computeResult } = useDiagnosis();
  const [validationMessage, setValidationMessage] = useState("");
  const [isDebugOpen, setIsDebugOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const currentQuestions = useMemo(() => {
    const start = currentPage * QUESTIONS_PER_PAGE;
    return questions.slice(start, start + QUESTIONS_PER_PAGE);
  }, [currentPage]);

  const isCurrentPageComplete = currentQuestions.every(
    (question) => answers[question.id] !== undefined
  );
  const isLastPage = currentPage === TOTAL_PAGES - 1;
  const progressValue = ((currentPage + 1) / TOTAL_PAGES) * 100;

  const handleNextPage = () => {
    if (!isCurrentPageComplete) {
      const missingCount = currentQuestions.filter(
        (question) => answers[question.id] === undefined
      ).length;
      setValidationMessage(
        `このページは残り ${missingCount} 問です。9問すべて回答すると次へ進めます。`
      );
      return;
    }

    setValidationMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
    setCurrentPage((page) => Math.min(page + 1, TOTAL_PAGES - 1));
  };

  const handleSubmit = () => {
    if (!isComplete) {
      const missingCount = getMissingQuestionIds(answers).length;
      setValidationMessage(
        `未回答の質問が ${missingCount} 問あります。すべて回答してから結果をご覧ください。`
      );
      return;
    }

    const resultType = computeResult();
    navigate(`/result/${resultType}`);
  };

  const handleDebugRandomResult = () => {
    const randomProfile =
      resultProfiles[Math.floor(Math.random() * resultProfiles.length)];
    navigate(`/result/${randomProfile.type}`);
  };

  return (
    <main className="page-shell">
      <Header />
      <div className="page-shell__glow page-shell__glow--left" aria-hidden="true" />
      <div className="page-shell__glow page-shell__glow--right" aria-hidden="true" />
      <section className="panel">
        <AxisOverview />
        <div className="question-grid">
          <section className="question-progress" aria-label="診断の進捗">
            <div className="question-progress__meta">
              <span className="question-progress__step">
                {currentPage + 1}/{TOTAL_PAGES}
              </span>
              <span className="question-progress__range">
                Q{String(currentPage * QUESTIONS_PER_PAGE + 1).padStart(2, "0")} -
                {" "}
                Q
                {String(
                  Math.min((currentPage + 1) * QUESTIONS_PER_PAGE, questions.length)
                ).padStart(2, "0")}
              </span>
            </div>
            <div
              className="question-progress__track"
              role="progressbar"
              aria-valuemin={1}
              aria-valuemax={TOTAL_PAGES}
              aria-valuenow={currentPage + 1}
              aria-valuetext={`${currentPage + 1}/${TOTAL_PAGES}`}
            >
              <div
                className="question-progress__fill"
                style={{ width: `${progressValue}%` }}
              />
            </div>
          </section>

          {currentQuestions.map((question, index) => (
            <QuestionCard
              key={question.id}
              question={question}
              index={currentPage * QUESTIONS_PER_PAGE + index}
              selectedValue={answers[question.id]}
              onSelect={(value) => {
                setValidationMessage("");
                selectAnswer(question.id, value);
              }}
            />
          ))}
        </div>
        <div className="question-actions">
          <div>
            <p>
              {isLastPage
                ? "36問すべて回答すると診断結果を表示できます。"
                : "このページの9問すべてに回答すると次へ進めます。"}
            </p>
            {validationMessage ? (
              <p className="question-actions__error">{validationMessage}</p>
            ) : null}
          </div>
          <div className="question-actions__buttons">
            {currentPage > 0 ? (
              <button
                type="button"
                className="secondary-button"
                onClick={() => {
                  setValidationMessage("");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  setCurrentPage((page) => Math.max(page - 1, 0));
                }}
              >
                前へ
              </button>
            ) : null}
            {isLastPage ? (
              <button
                type="button"
                className="primary-button"
                onClick={handleSubmit}
              >
                結果を見る
              </button>
            ) : (
              <button
                type="button"
                className="primary-button"
                onClick={handleNextPage}
              >
                次へ
              </button>
            )}
          </div>
        </div>
      </section>
      <div className="debug-menu">
        {isDebugOpen ? (
          <div className="debug-menu__items">
            <button
              type="button"
              className="debug-menu__action"
              onClick={handleDebugRandomResult}
            >
              ランダム結果を見る
            </button>
          </div>
        ) : null}
        <button
          type="button"
          className="debug-menu__toggle"
          onClick={() => setIsDebugOpen((current) => !current)}
          aria-expanded={isDebugOpen}
          aria-label="デバッグメニューを開く"
        >
          Debug
        </button>
      </div>
      <Footer />
    </main>
  );
}
