import { currify } from "./curry";

export const trace = currify((msg, data) => {
  console.log(`${msg}:\nData: ${data}`);
  return data;
});
