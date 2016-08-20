import transducerSpecs        from "./transducer.spec";
import contextSpecs           from "./context.spec";

export default () => {
  describe("transducer:",     transducerSpecs);
  describe("context:",        contextSpecs);
};
