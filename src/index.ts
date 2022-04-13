import {handleDefaultRequest} from "./handlers/handleDefaultRequest";
import {handleMeRequest} from "./handlers/handleMeRequest";
import {handleLoginRequest} from "./handlers/handleLoginRequest";

const URL_REGEX = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})(?<path>[/\w .-]*)*\/?$/;

addEventListener('fetch', (event) => {
  const method = event.request.method;
  const path = event.request.url.match(URL_REGEX)?.pop();

  const route = `${method} ${path}`;
  switch (route) {
    case 'POST /login':
      event.respondWith(handleLoginRequest(event.request)); break;
    case 'GET /api/users/me':
      event.respondWith(handleMeRequest(event.request)); break;
    default:
      event.respondWith(handleDefaultRequest(event.request));
  }
})
