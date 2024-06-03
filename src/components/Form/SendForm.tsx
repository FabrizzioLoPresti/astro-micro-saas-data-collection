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
import { Toaster, toast } from "sonner";
import { useQuestionsStore } from "@/store/questionsStore";

type Props = {};

const formSchema = z.object({
  email: z.string().email({
    message: "Por favor ingresa un correo valido.",
  }),
});

const SendForm = (props: Props) => {
  const questions = useQuestionsStore((state) => state.questions);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    let hasError = false;
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
      return toast.error("Por favor completa todas las preguntas");
    }

    console.log("Formulario enviado");
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
        <Button className="mt-2 bg-blue-800 text-white px-4 py-2 rounded-md hover:bg-blue-900 transition-colors ease-in-out duration-300 w-full md:w-1/2 text-center self-start lg:self-center">
          Enviar
        </Button>
      </form>
      <Toaster position="top-right" richColors />
    </Form>
  );
};

export default SendForm;
