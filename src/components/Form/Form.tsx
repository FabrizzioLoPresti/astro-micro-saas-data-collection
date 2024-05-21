import { Suspense, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRightIcon, ChevronLeftIcon } from "@radix-ui/react-icons";
import Question from "./Question";

type Props = {};

const FormComponent = (props: Props) => {
  return (
    <div className="max-w-[600px] max-h-[600px] p-8 border border-zinc-300 bg-neutral-50 shadow-2xl">
      {/* {currentQuestion < questions.length && ( */}
      <div className="flex flex-col items-center">
        <h3 className="text-xl font-bold text-blue-800 before:content-['-___'] after:content-['___-']">
          Pregunta
        </h3>
        <p>
          3 <span className="font-bold text-blue-800">de</span> 10
        </p>
      </div>
      {/* )} */}

      <div className="h-full">
        <div className="w-full my-6 flex flex-row items-center justify-between">
          <Button
            type="button"
            variant="outline"
            size="icon"
            // onClick={prevQuestion}
            // disabled={currentQuestion === 0}
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="outline"
            size="icon"
            // onClick={nextQuestion}
            // disabled={currentQuestion === questions.length}
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>

        {/* {currentQuestion === questions.length ? (
          <SendForm />
        ) : (
          <Suspense fallback={<Spinner />}>
            <Question questionInfo={questionInfo} />
          </Suspense>
        )} */}
        <Question />
      </div>
    </div>
  );
};

export default FormComponent;
