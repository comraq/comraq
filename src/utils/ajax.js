import { isString } from "./checks";

/**
 * @private @function ajax
 * - takes in a request object, makes an xmlhttp request and returns a promise
 *
 * @param {Object} req
 * - req object should be in the following form:
 * {
 *   method: String,
 *   url: String,
 *   user: String,
 *   password: String,
 *   headers: Object,
 *   body: Object
 * }
 *
 * @returns {Promise}
 * - promise resolved if ajax response successful (status 200s),
 *   rejected if unsuccessful (status 300s, 400s, 500s)
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
 */
export default req =>
  new Promise((resolve, reject) => {
    let method = req.method || "GET";
    let url = req.url || "/";
    let user = req.user || "";
    let password = req.password || "";
    let body = null;
    if (req.body) {
      if (!isString(req.body))
        body = JSON.stringify(req.body);
      else
        body = req.body;
    }

    const xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = () =>
      xmlReadyStateChanged(xmlhttp, resolve, reject);

    xmlhttp.open(method, url, true, user, password);

    const defaultHeaders = {
      "Content-Type": "application/json"
    };
    const mergedHeaders = getMergedHeaders(defaultHeaders, req.headers);
    for (let key in mergedHeaders)
      xmlhttp.setRequestHeader(key, mergedHeaders[key]);

    xmlhttp.send(body);
  });

/**
 * @private @function getMergedHeaders
 * - not using Object.assign because header names (object properties)
 *   are case-insensitive, don't want to duplicate headers
 *
 * @param {Object} defaults 
 * - default headers { headerName: headerValue }
 *
 * @param {Object} headers (optional)
 * - request headers { headerName: headerValue }
 *
 * @return {Object}
 * - merged headers with no duplicates of form { headerName: headerValue }
 */
const getMergedHeaders = (defaults, headers = null) => {
  const merged = {};
  let contentSpecified = false;

  if (headers) {
    for(let key in headers) {
      if (key.toLowerCase() === "content-type")
        contentSpecified = true;

      merged[key] = headers[key];
    }
  }

  if (!contentSpecified) {
    for(let key in defaults)
      merged[key] = defaults[key];
  }

  return merged;
};

/**
 * @private @function xmlReadyStateChanged
 * - event handler function for xmlonreadystatechange
 *
 * @param {XMLHttpRequest} xmlhttp
 * - xmlhttp target for readystatechanged
 *
 * @param {function} resolve
 * - promise resolve function to be called if request successful (200s)
 *
 * @param {function} reject
 * - promise reject function to be called if request successful
 *   status codes (300s, 400s, 500s)
 *
 * @returns {undefined}
 * - event handler function, nowhere to return to
 */
const xmlReadyStateChanged = (xmlhttp, resolve, reject) => {
  if (xmlhttp.readyState == 4) {
    const res = getXmlHttpResponse(xmlhttp);

    if (xmlhttp.status == 200)
      return resolve(JSON.stringify(res));

    else
      return reject(JSON.stringify(res));
  }
};

/**
 * @private @function getXmlHttpResponse
 * - generating the response object from xmlhttp after state === done
 *
 * @param {XMLHttpRequest} xmlhttp
 * - the xmlhttp target
 *
 * @returns {Object}
 * - new response object { headers: Array, body: any }
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/readyState
 */
const getXmlHttpResponse = xmlhttp => {
  const headers = xmlhttp.getAllResponseHeaders();
  const contentType = xmlhttp.getResponseHeader("Content-Type");

  var responseText;
  if (contentType.toLowerCase() === "application/json") {
    try {
      responseText = JSON.parse(xmlhttp.responseText);
    } catch (e) {
      console.log(`Got bad JSON! Error ${e}`);
      responseText = xmlhttp.responseText;
    }

  } else
    responseText = xmlhttp.responseText;

  return {
    headers: headers.trim().split("\n"),
    body: responseText
  };
};
