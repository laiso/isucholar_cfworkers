import {PostgrestClient} from "@supabase/postgrest-js";

export function getDatabaseClient(endpoint = POSTGREST_ENDPOINT, apikey = POSTGREST_APIKEY): PostgrestClient {
  return new PostgrestClient(endpoint, {
    headers: {
      'APIKEY': apikey,
    }
  });
}
