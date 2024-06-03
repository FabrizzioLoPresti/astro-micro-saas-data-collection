import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useQuestionsStore } from "@/store/questionsStore";
import { type QuestionType } from "@/types/types.d";

type Props = {
  questionInfo: QuestionType;
};

const Question = ({ questionInfo }: Props) => {
  const selectAnswer = useQuestionsStore((state) => state.selectAnswer);
  const [otherAnswer, setOtherAnswer] = useState<string>("");

  useEffect(() => {
    setOtherAnswer(questionInfo.otherAnswer || "");
  }, [questionInfo.otherAnswer]);

  if (!questionInfo) return null;

  const handleSelectAnswer = (answerIndex: number) => () => {
    selectAnswer(questionInfo.id, answerIndex);
  };

  const handleOtherAnswer =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      if (newValue.length > 100) return;

      setOtherAnswer(newValue);
      selectAnswer(questionInfo.id, index, newValue);
    };

  const isOtherOptionSelected = (index: number) => {
    return (
      questionInfo.options[index] === "Otro" &&
      questionInfo.answerSelected === index
    );
  };

  const renderOptions = () => {
    return questionInfo.options.map((option, index) => (
      <div key={index}>
        <li
          className="py-3 flex items-center gap-x-2"
          onClick={handleSelectAnswer(index)}
        >
          <RadioGroupItem
            value={index.toString()}
            id={index.toString()}
            checked={questionInfo.answerSelected === index}
          />
          <Label htmlFor={index.toString()} className="text-sm md:text-base">
            {option}
          </Label>
        </li>
        {isOtherOptionSelected(index) && (
          <>
            <input
              type="text"
              className="border border-gray-300 rounded-md px-2 py-1 w-full"
              placeholder="Especificar"
              value={otherAnswer}
              onChange={handleOtherAnswer(index)}
            />
            <div className="flex flex-col">
              {!otherAnswer.trim() && (
                <span className="text-red-500 text-sm">
                  Este campo es requerido
                </span>
              )}
              <span className="text-sm text-gray-500">
                Máximo 100 caracteres
              </span>
            </div>
          </>
        )}
      </div>
    ));
  };

  return (
    <div className="space-y-8">
      <h4 className="text-blue-800 font-bold text-xl md:text-2xl text-center">
        {questionInfo.question}
      </h4>
      <div>
        <RadioGroup>
          <ul className="[&>div>li]:border-t-2 [&>div>li]:border-t-blue-200">
            {renderOptions()}
          </ul>
        </RadioGroup>
      </div>
    </div>
  );
};

export default Question;
