import type { APIRoute } from 'astro';

export const POST: APIRoute = ({ params, request }) => {
  return new Response(JSON.stringify({
      message: "Success"
    })
  )
}