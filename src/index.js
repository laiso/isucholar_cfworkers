import {PostgrestClient} from "@supabase/postgrest-js";
import {parse, serialize} from "cookie";

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

const client = new PostgrestClient(POSTGREST_ENDPOINT, {
  headers:{
    'APIKEY': POSTGREST_APIKEY,
  }
})

async function getUserInfo(request) {
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

  return JSON.parse(atob(value));
}

async function handleRequest(request) {
// async function handleLoginRequest(request) {
  const {code, password} = await request.json()

  const { data, error } = client.from('users').select().eq('code', code)
  const user = data.shift()
  if (!user || error || !bcrypt.compare(password, user.hashed_password)) {
    throw new Error('Unauthorized');
  }

  const info = {
    userID: user.id,
    userName: user.name,
    isAdmin: user.type === 'teacher',
  };

  const encoder = new TextEncoder();

  const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(btoa(APP_SECRET)),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
  );

  const value = btoa(JSON.stringify(info));
  const session = encoder.encode(value);
  const signature = await crypto.subtle.sign("HMAC", key, session);
  const hash = btoa(String.fromCharCode(...new Uint8Array(signature))).replace(
      /=+$/,
      ""
  );

  const response = new Response(JSON.stringify({}));
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Content-Type', 'application/json');
  response.headers.set('Set-Cookie', serialize('session', value +'.' +hash, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  }));

  return response;
}

function byteStringToUint8Array(byteString) {
  let array = new Uint8Array(byteString.length);

  for (let i = 0; i < byteString.length; i++) {
    array[i] = byteString.charCodeAt(i);
  }

  return array;
}

async function handleUsers() {
  const {error, data} = await client.from('users').select('*')
  if (error) {
    return errorResponse(error);
  }

  return new Response(JSON.stringify(data), {
    'content-type': 'application/json;charset=UTF-8',
  });
}

function errorResponse(error) {
  return new Response(JSON.stringify(error), {
    status: 500,
    headers: {'Content-Type': 'application/json'},
  });
}
