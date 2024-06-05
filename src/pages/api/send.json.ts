import type { APIRoute } from 'astro';

const response = (body: string, {status, statusText, headers}: {status?: number, statusText?: string, headers?: HeadersInit}) => new Response(body, {status, statusText, headers});

export const POST: APIRoute = async ({ params, request }) => {
  if (request.headers.get("Content-Type") === "application/json") {
    const {email, answers} = await request.json();
    console.log( {email, answers} );

    // Validar si el mail ya existe en la BD

    // Convertir las respuestas a un formato JSON

    // Almacenar las respuestas en la BD junto al mail

    // Enviar un mail con las respuestas y enlace de para generar Link de Mercadopago a nuestro endopoint de pago

    return response(JSON.stringify({message: "Respuestas enviadas"}), {status: 200});
  }
  return response(JSON.stringify({message: "Invalid request"}), {status: 400});
}