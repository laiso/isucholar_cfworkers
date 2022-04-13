import {createDatabaseErrorResponse} from "../errors";
import {getDatabaseClient} from "../database";
import {getCurrentUser} from "../session";
import {User} from "../types";

export async function handleMeRequest(request: Request): Promise<Response> {
  const db = getDatabaseClient();
  const user = await getCurrentUser(request);
  const {error, data: me} = await db.from<User>('users').select('*').eq('id', user.id).single()
  if (error) {
    return createDatabaseErrorResponse(error);
  }

  if (!me) {
    throw new Error('User not found');
  }

  return new Response(JSON.stringify({
    id: me.id,
    code: me.code,
    name: me.name,
    }),{
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
