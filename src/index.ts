import {handleDefaultRequest} from "./handlers/handleDefaultRequest";
import {handleMeRequest} from "./handlers/handleMeRequest";
import {handleLoginRequest} from "./handlers/handleLoginRequest";

addEventListener('fetch', (event) => {
  const method = event.request.method;
  const url = new URL(event.request.url);

  if (method === 'POST' && url.pathname === '/login') {
    event.respondWith(handleLoginRequest(event.request));
  } else if (method === 'GET' && url.pathname === '/api/users/me') {
    event.respondWith(handleMeRequest(event.request))
  } else if (method === 'GET' && /\/api\/courses\/\w/.test(url.pathname)) {
    // TODO: event.respondWith(handleCourseRequest(event.request))
  } else {
    event.respondWith(handleDefaultRequest(event.request));
  }
})
