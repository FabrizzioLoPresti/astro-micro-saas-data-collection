import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type Props = {};

const Question = (props: Props) => {
  return (
    <div className="space-y-8">
      <h4 className="text-blue-800 font-bold text-2xl text-center">Pregunta</h4>

      <div>
        <RadioGroup>
          <ul className="[&>li]:border-t-2 [&>li:nth-child(odd)]:border-t-blue-800 [&>li:nth-child(even)]:border-t-blue-200">
            <li className="py-3 px-6 flex items-center gap-x-2">
              <RadioGroupItem value="1" />
              <Label htmlFor="1">Pregunta</Label>
            </li>
          </ul>
        </RadioGroup>
      </div>
    </div>
  );
};

export default Question;
