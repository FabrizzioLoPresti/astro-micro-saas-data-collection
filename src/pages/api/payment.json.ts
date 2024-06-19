import { db, Answers, NOW, eq } from "astro:db";
import type { APIRoute } from "astro";
import { z } from "zod";
import { Resend } from "resend";
import { renderEmailTemplate } from "@/utils/renderTemplate";
import { MercadoPagoConfig, Payment } from "mercadopago";

// TODO!

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

const answersSchema = z.object({});

// Endpoint para recibir la notificación de MercadoPago mediante Webhooks
export const POST: APIRoute = async ({ request }) => {
  try {
    // if (request.headers.get("Content-Type") !== "application/json") {
    //   throw new Error("Content-Type no es application/json");
    // }

    const body = await request
      .json()
      .then((data) => data as { data: { id: string } });

    const payment = await new Payment(mercadoPagoClient).get({
      id: body.data.id,
    });

    return createResponse(JSON.stringify({ message: "Ok" }), {
      status: 200,
    });
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
