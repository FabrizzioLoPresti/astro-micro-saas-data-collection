import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import Spinner from "@/components/Layout/Spinner";
import { Toaster, toast } from "sonner";
import { useQuestionsStore } from "@/store/questionsStore";
import { sendAnswers } from "@/services/questions";

type Props = {};

const formSchema = z.object({
  email: z.string().email({
    message: "Por favor ingresa un correo valido.",
  }),
});

const SendForm = (props: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const questions = useQuestionsStore((state) => state.questions);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    let hasError = false;
    setIsLoading(true);
    questions.forEach((question) => {
      if (
        (!question.answerSelected && question.answerSelected !== 0) ||
        (question.options[question.answerSelected] === "Otro" &&
          !question.otherAnswer)
      ) {
        hasError = true;
      }
    });

    if (hasError) {
      setIsLoading(false);
      return toast.error("Por favor completa todas las preguntas");
    }

    const data = {
      email: values.email,
      answers: questions.map((question) => ({
        question_id: question.id,
        option_id: question.answerSelected,
        otherAnswer: question.otherAnswer,
      })),
    };
    const { message } = await sendAnswers(data);

    setMessage(message);
    setIsLoading(false);
    hasError = false;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col items-center justify-center space-y-8 w-full"
      >
        <h3 className="text-2xl font-bold text-blue-800">
          Gracias por completar el formulario
        </h3>

        <p className="text-center font-semibold">
          Por favor ingresa tu correo para recibir los resultados en tu correo
        </p>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input placeholder="E-mail" type="email" {...field} />
              </FormControl>
              <FormDescription>
                Ingresa un correo valido para recibir los resultados
              </FormDescription>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />

        {message && <p className="text-center font-semibold">{message}</p>}

        <Button
          className="mt-2 bg-blue-800 text-white px-4 py-2 rounded-md hover:bg-blue-900 transition-colors ease-in-out duration-300 w-full lg:w-1/2 text-center self-start lg:self-center disabled:opacity-70 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          Enviar
        </Button>
        {isLoading && <Spinner />}
      </form>
      <Toaster position="top-right" richColors />
    </Form>
  );
};

export default SendForm;
