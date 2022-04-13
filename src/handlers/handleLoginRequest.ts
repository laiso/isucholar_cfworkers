import {createDatabaseErrorResponse} from "../errors";
import {getDatabaseClient} from "../database";
import {User} from "../types";
import {compareSync} from "bcryptjs";

export async function handleLoginRequest(request: Request): Promise<Response> {
  const {code, password} = await request.json();
  const db = getDatabaseClient();

  const {error, data: users} = await db.from<User>('users').select('*').eq('code', code)
  if (error) {
    return createDatabaseErrorResponse(error);
  }

  if (!users) {
    throw new Error('User not found');
  }

  const result = compareSync(password, fromBytea(users[0].hashed_password.toString()));
  if (!result) {
    throw new Error('Password is incorrect');
  }

  return Response.redirect('/mypage', 302);
}

function fromBytea(hex: string) {
  let str = '';
  for (let n = 0; n < hex.length; n += 2) {
    str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
  }
  return str;
}
