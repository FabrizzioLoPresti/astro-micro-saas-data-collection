import { Suspense, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRightIcon, ChevronLeftIcon } from "@radix-ui/react-icons";
import { useQuestionsStore } from "@/store/questionsStore";
import Question from "./Question";
import { type QuestionType } from "@/types/types.d";

type Props = {};

const FormComponent = (props: Props) => {
  const questions = useQuestionsStore((state) => state.questions);
  const fetchQuestions = useQuestionsStore((state) => state.fetchQuestions);

  const currentQuestion = useQuestionsStore((state) => state.currentQuestion);
  const nextQuestion = useQuestionsStore((state) => state.nextQuestion);
  const prevQuestion = useQuestionsStore((state) => state.prevQuestion);

  useEffect(() => {
    fetchQuestions();
  }, []);

  // if (questions.length === 0) return <Spinner />;

  const questionInfo = questions[currentQuestion];

  return (
    <div className="max-w-[600px] max-h-[600px] p-8 border border-zinc-300 bg-neutral-50 shadow-2xl">
      {currentQuestion < questions.length && (
        <div className="flex flex-col items-center">
          <h3 className="text-xl font-bold text-blue-800 before:content-['-___'] after:content-['___-']">
            Pregunta
          </h3>
          <p>
            {currentQuestion + 1}{" "}
            <span className="font-bold text-blue-800">de</span>{" "}
            {questions.length}
          </p>
        </div>
      )}

      <div className="h-full">
        <div className="w-full my-6 flex flex-row items-center justify-between">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={nextQuestion}
            disabled={currentQuestion === questions.length}
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>

        {currentQuestion === questions.length ? (
          // <SendForm />
          <div>SendForm</div>
        ) : (
          // <Suspense fallback={<Spinner />}>
          <Question questionInfo={questionInfo} />
          // </Suspense>
        )}
      </div>
    </div>
  );
};

export default FormComponent;
