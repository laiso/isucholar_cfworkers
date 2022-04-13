import {createDatabaseErrorResponse} from "../errors";
import {getDatabaseClient} from "../database";
import {User} from "../types";
import {compareSync} from "bcryptjs";
import {createCookie} from "../session";

export async function handleLoginRequest(request: Request): Promise<Response> {
  const {code, password} = await request.json();
  const db = getDatabaseClient();

  const {error, data: user} = await db.from<User>('users').select('*').eq('code', code).single()
  if (error) {
    return createDatabaseErrorResponse(error);
  }

  if (!user) {
    throw new Error('User not found');
  }

  const result = compareSync(password, fromBytea(user.hashed_password.toString()));
  if (!result) {
    throw new Error('Password is incorrect');
  }

  const issuedCookie = await createCookie(user);
  const response = Response.redirect('/mypage', 302);
  response.headers.set('Set-Cookie', issuedCookie);

  return response;
}

function fromBytea(hex: string) {
  let str = '';
  for (let n = 0; n < hex.length; n += 2) {
    str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
  }
  return str;
}
