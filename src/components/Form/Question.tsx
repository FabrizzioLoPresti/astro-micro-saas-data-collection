import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useQuestionsStore } from "@/store/questionsStore";
import { type QuestionType } from "@/types/types.d";

type Props = {
  questionInfo: QuestionType;
};

const handleSelectAnswer =
  (
    answerIndex: number,
    questionInfo: QuestionType,
    selectAnswer: (questionId: number, indexAnswer: number) => void
  ) =>
  () => {
    selectAnswer(questionInfo.id, answerIndex);
  };

const Question = ({ questionInfo }: Props) => {
  const selectAnswer = useQuestionsStore((state) => state.selectAnswer);

  if (!questionInfo) return null;

  return (
    <div className="space-y-8">
      <h4 className="text-blue-800 font-bold text-2xl text-center">
        {questionInfo.question}
      </h4>

      <div>
        <RadioGroup>
          <ul className="[&>div>li]:border-t-2 [&>div>li]:border-t-blue-200">
            {questionInfo.options.map((option, index) => (
              <div key={index}>
                <li
                  className="py-3  flex items-center gap-x-2"
                  onClick={handleSelectAnswer(
                    index,
                    questionInfo,
                    selectAnswer
                  )}
                >
                  <RadioGroupItem
                    value={index.toString()}
                    id={index.toString()}
                    checked={questionInfo.answerSelected === index}
                  />
                  <Label
                    htmlFor={index.toString()}
                    className="text-sm lg:text-base"
                  >
                    {option}
                  </Label>
                </li>
                {option === "Otro" && questionInfo.answerSelected === index && (
                  <input
                    type="text"
                    className="border border-gray-300 rounded-md px-2 py-1 w-full"
                    placeholder="Especificar"
                    value={questionInfo.otherAnswer}
                    onChange={(e) => {
                      selectAnswer(questionInfo.id, index, e.target.value);
                    }}
                  />
                )}
              </div>
            ))}
          </ul>
        </RadioGroup>
      </div>
    </div>
  );
};

export default Question;
