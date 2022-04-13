import {PostgrestError} from "@supabase/postgrest-js";

export function createDatabaseErrorResponse(error: PostgrestError): Response {
  return new Response(JSON.stringify({error: error.message}), {
    status: 500,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
