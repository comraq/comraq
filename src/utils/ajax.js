/*
 * Takes in a request object and returns a promise.
 * Request Object comes in the following form:
 * {
 *   method: String,
 *   url: String,
 *   user: String,
 *   password: String,
 *   header: Object,
 *   body: Object
 * }
 */
const ajax = req =>
  new Promise((resolve, reject) => {
    let method = req.method || "GET";
    let url = req.url || "/";
    let user = req.user || "";
    let password = req.password || "";
    let body = req.body || null;

    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = () => {
      if (xmlhttp.readyState == 4) {
        const res = {
          headers: xmlhttp.getAllResponseHeaders(),
          data: JSON.parse(xmlhttp.responseText)
        };
        if (xmlhttp.status == 200)
          resolve(JSON.stringify(res));
        else
          reject(JSON.stringify(res));
      }
    }

    let defaultHeaders = {
      "Content-Type": "application/json"
    };
    xmlhttp.open(method, url, true, user, password);

    for(let key in defaultHeaders)
      xmlhttp.setRequestHeader(key, defaultHeaders[key]);

    if (req.headers) {
      for(let key in req.headers)
        xmlhttp.setRequestHeader(key, req.headers[key]);
    }

    xmlhttp.send(body);
  })

export default ajax;
