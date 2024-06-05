import { db, Answers, NOW, eq } from "astro:db";
import type { APIRoute } from "astro";
import { z } from "zod";

const response = (
  body: string,
  {
    status,
    statusText,
    headers,
  }: { status?: number; statusText?: string; headers?: HeadersInit }
) => new Response(body, { status, statusText, headers });

const answersSchema = z.object({
  email: z.string().email({
    message: "Por favor ingresa un correo valido.",
  }),
  answers: z.array(
    z.object({
      question_id: z.number(),
      option_id: z.number().optional(),
      otherAnswer: z
        .string()
        .max(100, "La respuesta no puede superar los 100 caracteres")
        .optional(),
    })
  ),
});

export const POST: APIRoute = async ({ params, request }) => {
  try {
    if (request.headers.get("Content-Type") === "application/json") {
      const body = await request.json();
      const { email, answers } = answersSchema.parse(body);
      console.log({
        email,
        answers,
      });

      // Validar si el mail ya existe en la BD
      const userExists = await db
        .select()
        .from(Answers)
        .where(eq(Answers.email, email));

      // TODO!: Cambiar parte del Catch para tomar error y poder utilizar Throw New Error
      if (userExists.length) {
        return response(
          JSON.stringify({ message: "Ya has enviado tus respuestas" }),
          {
            status: 400,
          }
        );
      }

      // Convertir las respuestas a un formato JSON
      const answersJSON = JSON.stringify(answers);

      // Almacenar las respuestas en la BD junto al mail
      await db
        .insert(Answers)
        .values({ email, answers: answersJSON, createdAt: NOW });

      // Enviar un mail con las respuestas y enlace de para generar Link de Mercadopago a nuestro endopoint de pago

      return response(JSON.stringify({ message: "Respuestas enviadas" }), {
        status: 200,
      });
    }
    return response(JSON.stringify({ message: "Invalid request" }), {
      status: 400,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return response(JSON.stringify({ message: error.errors[0].message }), {
        status: 400,
      });
    }
    return response(JSON.stringify({ message: "Error interno del servidor" }), {
      status: 500,
    });
  }
};
