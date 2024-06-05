import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ params, request }) => {
  if (request.headers.get("Content-Type") === "application/json") {
    const {email, answers} = await request.json();
    console.log( {email, answers} );

    // Validar si el mail ya existe en la BD

    // Convertir las respuestas a un formato JSON

    // Almacenar las respuestas en la BD junto al mail

    // Enviar un mail con las respuestas y enlace de para generar Link de Mercadopago a nuestro endopoint de pago

    return new Response(JSON.stringify({
      message: "Success",
    }), {
      status: 200
    })
  }
  return new Response(null, { status: 400 });
}