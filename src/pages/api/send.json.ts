import { db, Answers, NOW, eq } from "astro:db";
import type { APIRoute } from "astro";
import { z } from "zod";
import { Resend } from "resend";
import { renderEmailTemplate } from "@/utils/renderTemplate";
import { MercadoPagoConfig, Preference, Payment } from "mercadopago";

// TODO!
// 1- Agregar Spinner o Mensaje de Error en el Formulario mientras se envían las respuestas ✅
// 2- Customizar el template de email para que reciba los datos del formulario ✅
// 3- Generar un link de MercadoPago enlazado a la API y enviarlo al usuario

const resendClient = new Resend(import.meta.env.RESEND_API_KEY);
const mercadoPagoClient = new MercadoPagoConfig({
  accessToken: import.meta.env.MERCADOPAGO_API_KEY,
});

const createResponse = (
  body: string,
  {
    status = 200,
    statusText,
    headers,
  }: { status?: number; statusText?: string; headers?: HeadersInit } = {}
) => new Response(body, { status, statusText, headers });

const answersSchema = z.object({
  email: z.string().email("Por favor ingresa un correo válido."),
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

export const POST: APIRoute = async ({ request }) => {
  try {
    if (request.headers.get("Content-Type") !== "application/json") {
      throw new Error("Content-Type no es application/json");
    }

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

    if (userExists.length) {
      throw new Error("Ya has enviado tus respuestas");
    }

    // Generar enlace de MercadoPago (pasar al cliente en lo posible por time execution limit de funciones serverless de Vercel)
    const preference = await new Preference(mercadoPagoClient).create({
      body: {
        items: [
          {
            id: "respuesta_ia",
            title: "Respuesta IA",
            quantity: 1,
            unit_price: 500,
          },
        ],
      },
    });
    const urlMercadoPago = preference.sandbox_init_point!;

    // Generar el HTML del correo utilizando el template de React
    const emailHtml = renderEmailTemplate({
      email,
      mercadoPagoUrl: urlMercadoPago,
    });

    // Enviar el correo con Resend incluyendo el HTML generado y enlace de MercadoPago
    const { data, error } = await resendClient.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Gracias por completar el formulario",
      html: emailHtml,
    });

    if (error) {
      throw new Error("Error al enviar el correo");
    }

    // Convertir las respuestas a un formato JSON
    const answersJSON = JSON.stringify(answers);

    // Almacenar las respuestas en la BD junto al mail
    await db
      .insert(Answers)
      .values({ email, answers: answersJSON, createdAt: NOW });

    return createResponse(
      JSON.stringify({ message: "Respuestas enviadas correctamente" }),
      {
        status: 200,
      }
    );
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return createResponse(
        JSON.stringify({ message: error.errors[0].message }),
        { status: 400 }
      );
    }

    return createResponse(
      JSON.stringify({
        message: error.message || "Error interno del servidor",
      }),
      {
        status: error.message ? 400 : 500,
      }
    );
  }
};
