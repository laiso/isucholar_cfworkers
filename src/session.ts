import {parse} from "cookie";
import {User} from "./types";

export async function getCurrentUser(request: Request): Promise<User> {
  const cookie = parse(request.headers.get('Cookie') || '');
  if (!cookie['session']) {
    throw new Error('Unauthorized');
  }
  const [value, sign] = cookie['session'].split('.');

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(btoa(APP_SECRET)),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
  );

  const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      byteStringToUint8Array(atob(sign)),
      encoder.encode(value),
  );

  if (!valid) {
    throw new Error('Unauthorized');
  }

  return JSON.parse(atob(value)) as User;
}

function byteStringToUint8Array(byteString: string): Uint8Array {
  const array = new Uint8Array(byteString.length);

  for (let i = 0; i < byteString.length; i++) {
    array[i] = byteString.charCodeAt(i);
  }

  return array;
}
