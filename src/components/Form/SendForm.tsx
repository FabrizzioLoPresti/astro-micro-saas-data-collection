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

type Props = {};

const formSchema = z.object({
  email: z.string().email({
    message: "Por favor ingresa un email valido",
  }),
});

const SendForm = (props: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
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
          Por favor ingresa tu email para recibir los resultados en tu correo
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
                Ingresa un email valido para recibir los resultados
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="mt-2 bg-blue-800 text-white px-4 py-2 rounded-md hover:bg-blue-900 transition-colors ease-in-out duration-300 w-full md:w-1/2 text-center self-start lg:self-center">
          Enviar
        </Button>
      </form>
    </Form>
  );
};

export default SendForm;
