import * as utils from "./utils";
import * as functional from "./functional";

const comraq = { utils, functional };

// Export entire library as comraq under the window object if loaded as
// script in browser
if (typeof window !== "undefined")
  window.comraq = comraq;

export default comraq;
