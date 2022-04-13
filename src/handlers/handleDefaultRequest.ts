export async function handleDefaultRequest(request: Request): Promise<Response> {
  return new Response('Not Found', { status: 404 });
}
