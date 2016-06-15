import utils from "./utils";
import functional from "./functional";

const comraq = { utils, functional };
export default comraq;

if (window)
  window.comraq = comraq;
